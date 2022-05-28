import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { db } from '../firebase.config';
import { doc, getDoc } from 'firebase/firestore';
import Navbar from './Navbar';
import { auth } from '../firebase.config';
import { onAuthStateChanged } from 'firebase/auth';
import { Link } from 'react-router-dom';

function Thread() {
  const { id } = useParams();
  const [post, setPost] = useState('');
  const [error, setError] = useState(false);
  const [userState, setUserState] = useState({
    authenticated: false,
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
      } else {
        setUserState({
          authenticated: false,
        });
      }
    });

    fetchData();
  }, []);

  const addComment = () => {
    console.log(1);
  };

  return (
    <div>
      <Navbar />
      <div className="flex flex-col items-center mt-20">
        {error && <p>There was an error fetching data</p>}
        {post != '' && (
          <div className="mb-10 xl:w-7/12 w-10/12">
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
              <p className="secondery-colour">{post.likes} points</p>
              <p className="p-margin secondery-colour">
                {post.comments} comments by
              </p>
              <p className="p-margin user-colour mb-10">{post.username}</p>
            </div>
            <div>{post.text != '' ? <p>{post.text}</p> : ''}</div>
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
        <div className="mb-4 xl:w-7/12 w-10/12">
          <div>
            <p>comment</p>
            <div>
              <p>3</p>
            </div>
          </div>
          <div>
            <p>comment2 </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Thread;
