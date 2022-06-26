import React, { useState } from 'react';
import {
  doc,
  collection,
  addDoc,
  updateDoc,
  arrayUnion,
} from 'firebase/firestore';
import { auth, db } from '../firebase.config';
import { useNavigate } from 'react-router-dom';

function Submit() {
  let navigate = useNavigate();
  const [post, setPost] = useState({
    title: '',
    url: '',
    text: '',
  });

  const [error, setError] = useState('');

  const user = auth.currentUser;

  const submitPost = async () => {
    if (post.title != '' && (post.url != '' || post.text != '')) {
      if (post.title.length < 7) {
        setError('Title must be at least 7 characters');
      } else {
        if (user != null) {
          let username = user.displayName;
          let userId = user.uid;
          let date = new Date();

          const docRef = await addDoc(collection(db, 'posts'), {
            title: post.title,
            url: post.url,
            text: post.text,
            username: username,
            userId: userId,
            date: date,
            comments: 0,
            likes: 0,
            replies: [],
            id: '',
          });

          const usersRef = doc(db, 'users', user.uid);
          await updateDoc(usersRef, {
            posts: arrayUnion(docRef.id),
          });

          const newDocRef = doc(db, 'posts', docRef.id);
          await updateDoc(newDocRef, {
            id: docRef.id,
          });

          setPost({
            title: '',
            url: '',
            text: '',
          });

          resetInputs();

          navigate('/');
        }
      }
    } else {
      setError("Can't submit empty post.");
    }
  };

  const onChange = (e) => {
    setPost((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const resetInputs = () => {
    Array.from(document.querySelectorAll('input')).forEach(
      (input) => (input.value = '')
    );

    document.querySelector('textarea').value = '';
  };

  return (
    <div>
      <div className="form m-auto mt-20">
        <p className="bottom-margin form-title"> Title</p>
        <input
          type="text"
          name="title"
          id="title"
          className="input-border mb-4"
          onChange={onChange}
        />
        <p className="bottom-margin form-title">URL</p>
        <input
          type="text"
          name="url"
          id="url"
          className="input-border  mb-4"
          onChange={onChange}
        />
        <p className="bottom-margin form-title">and / or Text</p>
        <textarea
          name="text"
          id="text"
          cols="30"
          rows="10"
          className="input-border mb-4 resize-none"
          onChange={onChange}
        ></textarea>
        <button className="btn mb-4" onClick={submitPost}>
          Submit
        </button>
        {error != '' ? <p className="text-center text-red-700">{error}</p> : ''}
      </div>
    </div>
  );
}

export default Submit;
