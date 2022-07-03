import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  updateDoc,
  increment,
  arrayUnion,
  query,
  where,
} from 'firebase/firestore';

import { auth, db } from '../firebase.config';
import { onAuthStateChanged } from 'firebase/auth';
import { Link } from 'react-router-dom';
import upvoteIcon from '../assets/icons/upvote-svg.svg';
import Comment from './Comment';

function Thread() {
  const { id } = useParams();
  const [post, setPost] = useState('');
  const [error, setError] = useState(false);
  const [comError, setComError] = useState(false);
  const [userState, setUserState] = useState({
    authenticated: false,
  });
  const [comment, setComment] = useState('');
  const [userID, setUserId] = useState({
    id: '',
  });
  const [displayName, setDisplayName] = useState('');
  const [comments, setComments] = useState([]);

  const postRef = doc(db, 'posts', id);
  const commentsQuery = query(
    collection(db, 'comments'),
    where('parentID', '==', id)
  );

  useEffect(() => {
    const fetchData = async () => {
      const docSnap = await getDoc(postRef);
      getDocs(commentsQuery).then((snapshot) => {
        snapshot.forEach((comment) => {
          setComments((prev) => [...prev, comment.data()]);
        });
      });

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
        setDisplayName(user.displayName);
      } else {
        setUserState({
          authenticated: false,
        });
      }
    });

    fetchData();
  }, []);

  const addComment = async () => {
    try {
      let date = new Date();
      const docRef = await addDoc(collection(db, 'comments'), {
        comment: comment,
        username: displayName,
        uid: userID.id,
        parentID: post.id,
        date: date,
        replies: 0,
        likes: 0,
      });

      console.log(docRef.id);
      const newDocRef = doc(db, 'comments', docRef.id);
      await updateDoc(newDocRef, {
        id: docRef.id,
      });

      const usersRef = doc(db, 'users', userID.id);
      await updateDoc(usersRef, {
        comments: arrayUnion(docRef.id),
        commentsCount: increment(1),
      });

      const postRef = doc(db, 'posts', post.id);
      await updateDoc(postRef, {
        comments: increment(1),
      });
      window.location.reload();
    } catch (err) {
      console.log(err);
    }
  };

  const upvotePost = async (id) => {
    if (userState.authenticated) {
      /*get user doc from collection
      look for doc in user.upvoted 
      */
      const userRef = doc(db, 'users', userID.id);
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

  const onChange = (e) => {
    setComment(e.target.value);
  };

  return (
    <div>
      <div className="flex flex-col items-center mt-20">
        {error && <p>There was an error fetching data</p>}
        {post != '' && (
          <div
            className="mb-10 pb-10 xl:w-7/12 w-10/12 flex border-b-2 border-sky-800"
            id={post.id}
          >
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
              name="comment"
              className="w-full textarea"
              placeholder="Add a comment..."
              onChange={onChange}
              value={comment}
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
        <div className="flex flex-col xl:w-7/12 w-10/12 mt-20 border-t-2 border-sky-800 pt-10">
          {comError && <p>There was an error fetching data</p>}
          {comments.map((comm) => {
            return (
              <Comment
                comm={comm}
                authenticated={userState.authenticated}
                commentUsername={displayName}
                userID={userID.id}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default Thread;
