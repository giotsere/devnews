import React from 'react';
import { Link } from 'react-router-dom';
import upvoteIcon from '../assets/icons/upvote-svg.svg';
import deleteIcon from '../assets/icons/trash.svg';
import { deleteContent } from '../functions/deleteContent';
import {
  doc,
  getDoc,
  updateDoc,
  increment,
  arrayUnion,
} from 'firebase/firestore';

function PostCard({ post, authenticated, db, userID }) {
  const upvotePost = async (id, authenticated, db, userID) => {
    if (authenticated) {
      /*get user doc from collection
          look for doc in user.upvoted 
          */
      const userRef = doc(db, 'users', userID);
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
    <div
      to={`/posts/${post.id}`}
      className="mb-8 xl:w-7/12 w-10/12 p-6 flex bg-white drop-shadow rounded"
      id={post.id}
    >
      <div className="mr-4">
        <img
          src={upvoteIcon}
          alt="upvote icon"
          className="cursor-pointer w-6"
          onClick={() => {
            upvotePost(post.id, authenticated, db, userID);
          }}
        />
        <p className="pl-2">{post.likes}</p>
      </div>
      <div>
        <div className="flex w-full">
          <Link to={`/posts/${post.id}`} className="content-title hover-effect">
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
          {userID == post.uid && (
            <img
              src={deleteIcon}
              alt="delete icon"
              className="ml-4 cursor-pointer w-6"
              onClick={(e) => {
                deleteContent(e, 'posts', db, userID, null);
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
}

export default PostCard;
