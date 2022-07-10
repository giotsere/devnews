import { fromJSON } from 'postcss';
import React, { useState } from 'react';
import upvoteIcon from '../assets/icons/upvote-svg.svg';
import deleteIcon from '../assets/icons/trash.svg';
import {
  doc,
  updateDoc,
  addDoc,
  collection,
  getDoc,
  arrayUnion,
  increment,
} from 'firebase/firestore';
import { db } from '../firebase.config';
import { deleteContent } from '../functions/deleteContent';

function Comment({
  comm,
  authenticated,
  commentUsername,
  userID,
  displayName,
  postID,
}) {
  const [replying, setReplying] = useState(false);

  const nestedComments = (comm.children || []).map((comm) => {
    return (
      <Comment
        comm={comm}
        authenticated={authenticated}
        commentUsername={displayName}
        userID={userID}
        displayName={displayName}
        key={comm.id}
        postID={postID}
      />
    );
  });

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

  const sendReply = async (e) => {
    const inputID = e.target.parentNode.parentNode.id + 'div';
    const textareaID = e.target.parentNode.parentNode.id + 'txt';
    const replyValue = document.getElementById(textareaID).value;
    const parentCommentID = e.target.parentNode.parentNode.id;

    if (replyValue != '') {
      try {
        let date = new Date();
        const docRef = await addDoc(collection(db, 'comments'), {
          comment: replyValue,
          username: displayName,
          uid: userID,
          parentID: parentCommentID,
          postID: postID,
          date: date,
          replies: 0,
          likes: 0,
          children: null,
        });

        const newDocRef = doc(db, 'comments', docRef.id);
        await updateDoc(newDocRef, {
          id: docRef.id,
        });

        const usersRef = doc(db, 'users', userID);
        await updateDoc(usersRef, {
          comments: arrayUnion(docRef.id),
          commentsCount: increment(1),
        });

        const postRef = doc(db, 'comments', parentCommentID);
        await updateDoc(postRef, {
          replies: increment(1),
        });

        setReplying(false);
        document.getElementById(inputID).remove();
      } catch (err) {
        console.log(err);
      }
    }
  };

  const createReplyDiv = (e) => {
    const inputDiv = document.createElement('div');
    const commentID = e.target.parentNode.parentNode.id;
    const inputID = commentID + 'div';
    const textareaID = commentID + 'txt';
    inputDiv.setAttribute('id', inputID);

    if (!replying) {
      setReplying(true);

      const input = document.createElement('textarea');
      input.classList.add('textarea');
      input.classList.add('ml-10');
      input.classList.add('block');
      input.setAttribute('id', textareaID);

      const inputSubmit = document.createElement('a');
      inputSubmit.textContent = 'Send';
      inputSubmit.classList.add('btn');
      inputSubmit.classList.add('ml-10');
      inputSubmit.classList.add('cursor-pointer');
      inputSubmit.addEventListener('click', sendReply);

      inputDiv.appendChild(input);
      inputDiv.appendChild(inputSubmit);
      inputDiv.classList.add('mb-6');

      e.target.parentNode.parentNode.insertBefore(
        inputDiv,
        e.target.parentNode.nextSibling
      );
    } else {
      setReplying(false);
      document.getElementById(inputID).remove();
    }
  };

  return (
    <div className="mb-10 comments rounded p-4" id={comm.id}>
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
                deleteContent(e, 'comments', db, userID, comm.parentID, postID);
              }}
            />
          ) : (
            ''
          )}
        </div>
      </div>
      <div className="flex pl-10 pb-6">
        {authenticated && (
          <p
            className="pr-2 cursor-pointer hover:font-bold user-colour underline underline-offset-2"
            onClick={createReplyDiv}
          >
            reply
          </p>
        )}
        <p className="pr-2">{comm.replies} replies </p>
        <p>{comm.likes} likes</p>
      </div>

      {nestedComments}
    </div>
  );
}

export default Comment;
