import { fromJSON } from 'postcss';
import React from 'react';
import upvoteIcon from '../assets/icons/upvote-svg.svg';
import deleteIcon from '../assets/icons/trash.svg';
import {
  doc,
  updateDoc,
  getDoc,
  arrayUnion,
  increment,
} from 'firebase/firestore';
import { db } from '../firebase.config';
import { deleteContent } from '../functions/deleteContent';

function Comment({ comm, authenticated, commentUsername, userID }) {
  const upvoteComment = async (id) => {
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

          const commentRef = doc(db, 'comments', id);
          await updateDoc(userRef, {
            upvoted: arrayUnion(id),
          });
          await updateDoc(commentRef, {
            likes: increment(1),
          });
        }
      }
    }
  };

  return (
    <div className="mb-10" id={comm.id}>
      <div className="xl:w-7/12 w-10/12 flex">
        <div className="mr-4">
          <img
            src={upvoteIcon}
            alt="upvote icon"
            className="cursor-pointer w-6"
            onClick={() => {
              upvoteComment(comm.id);
            }}
          />
          <p className="pl-2">{comm.likes}</p>
        </div>
        <div>
          <p className="user-colour">{comm.username}</p>
          <div>
            <p>{comm.comment}</p>
          </div>
        </div>
        <div>
          {commentUsername === comm.username ? (
            <img
              src={deleteIcon}
              alt="delete icon"
              className="ml-4 cursor-pointer w-6"
              onClick={(e) => {
                deleteContent(e, 'comments', db, userID, comm.parentID);
              }}
            />
          ) : (
            ''
          )}
        </div>
      </div>
    </div>
  );
}

export default Comment;
