import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import {
  doc,
  getDoc,
  updateDoc,
  increment,
  arrayUnion,
} from 'firebase/firestore';

import { auth, db } from '../firebase.config';
import { onAuthStateChanged } from 'firebase/auth';
import { Link } from 'react-router-dom';
import upvoteIcon from '../assets/icons/upvote-svg.svg';

function Thread() {
  const { id } = useParams();
  const [post, setPost] = useState('');
  const [error, setError] = useState(false);
  const [userState, setUserState] = useState({
    authenticated: false,
  });
  const [userId, setUserId] = useState({
    id: '',
  });

  const postRef = doc(db, 'posts', id);

  useEffect(() => {
    const fetchData = async () => {
      const docSnap = await getDoc(postRef);

      if (docSnap.exists()) {
        setPost(docSnap.data());
      } else {
        setError(True);
      }
    };

    onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserState({
          authenticated: true,
        });
        setUserId({ id: user.uid });
      } else {
        setUserState({
          authenticated: false,
        });
      }
    });

    fetchData();
  }, []);

  const addComment = () => {
    //commentid, parentid, username, likes,
  };

  const upvotePost = async (id) => {
    if (userState.authenticated) {
      /*get user doc from collection
      look for doc in user.upvoted 
      */
      const userRef = doc(db, 'users', userId.id);
      const docSnap = await getDoc(userRef);
      if (docSnap.exists()) {
        //if user has not voted on the post
        if (!docSnap.data().upvoted.includes(id)) {
          //update front end without fetching data
          const selectLikedP = document
            .getElementById(id)
            .querySelectorAll('p');
          const updateLikedP = selectLikedP[0].textContent++;

          const postRef = doc(db, 'posts', id);
          await updateDoc(userRef, {
            upvoted: arrayUnion(id),
          });
          await updateDoc(postRef, {
            likes: increment(1),
          });
        }
      }
    }
  };

  return (
    <div>
      <div className="flex flex-col items-center mt-20">
        {error && <p>There was an error fetching data</p>}
        {post != '' && (
          <div className="mb-10 xl:w-7/12 w-10/12 flex" id={post.id}>
            <div className="mr-4">
              <img
                src={upvoteIcon}
                alt="upvote icon"
                className="cursor-pointer w-6"
                onClick={() => {
                  upvotePost(post.id);
                }}
              />
              <p className="pl-2">{post.likes}</p>
            </div>
            <div>
              <div className="flex w-full">
                <p className="content-title hover-effect">{post.title}</p>
                {post.url != '' ? (
                  <a
                    target="_blank"
                    href={post.url}
                    rel="noopener noreferrer"
                    className="secondery-colour cursor-pointer"
                  >
                    ({post.url})
                  </a>
                ) : (
                  ''
                )}
              </div>
              <div className="flex w-full">
                <p className="secondery-colour">{post.comments} comments by</p>
                <p className="p-margin user-colour mb-10">{post.username}</p>
              </div>
              {post.text != '' ? (
                <div>
                  <p>{post.text}</p>
                </div>
              ) : (
                ''
              )}
            </div>
          </div>
        )}
        {userState.authenticated ? (
          <div className="mb-4 xl:w-7/12 w-10/12">
            <textarea
              className="w-full textarea"
              placeholder="Add a comment..."
            ></textarea>
            <button className="btn" onClick={addComment}>
              Add Comment
            </button>
          </div>
        ) : (
          <div>
            <p>
              {' '}
              <Link to="/login" className="nav-margin hover-effect">
                Login
              </Link>{' '}
              to comment
            </p>
          </div>
        )}
      </div>
      <div className="flex flex-col items-center mt-20">
        <div className="mb-4 xl:w-7/12 w-10/12"></div>
      </div>
    </div>
  );
}

export default Thread;
