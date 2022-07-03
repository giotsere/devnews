import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import upvoteIcon from '../assets/icons/upvote-svg.svg';
import deleteIcon from '../assets/icons/trash.svg';
import { onAuthStateChanged } from 'firebase/auth';
import { auth, db } from '../firebase.config';
import {
  doc,
  getDoc,
  updateDoc,
  increment,
  arrayUnion,
} from 'firebase/firestore';
import { deleteContent } from '../functions/deleteContent';

function Content({ posts }) {
  const [userState, setUserState] = useState({
    authenticated: false,
  });

  const [userID, setUserID] = useState({
    id: '',
  });

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserState({
          authenticated: true,
        });
        setUserID({ id: user.uid });
      } else {
        setUserState({
          authenticated: false,
        });
      }
    });
  }, []);

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

  return (
    <div className="flex flex-col items-center mt-20">
      {posts.map((post) => {
        return (
          <div
            to={`/posts/${post.id}`}
            className="mb-8 xl:w-7/12 w-10/12 flex"
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
                <Link
                  to={`/posts/${post.id}`}
                  className="content-title hover-effect"
                >
                  {post.title}
                </Link>
                {post.url != '' ? (
                  <a
                    target="_blank"
                    href={post.url}
                    rel="noopener noreferrer"
                    className="secondery-colour hover:text-gray-700 hover:underline"
                  >
                    ({post.url})
                  </a>
                ) : (
                  ''
                )}
                {userID.id == post.uid && (
                  <img
                    src={deleteIcon}
                    alt="delete icon"
                    className="ml-4 cursor-pointer w-6"
                    onClick={(e) => {
                      deleteContent(e, 'posts', db, userID.id);
                    }}
                  />
                )}
              </div>
              <div className="flex w-full">
                <p className="secondery-colour">{post.comments} comments by</p>
                <p className="p-margin user-colour">{post.username}</p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default Content;
