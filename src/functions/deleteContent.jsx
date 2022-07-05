import {
  doc,
  deleteDoc,
  updateDoc,
  increment,
  arrayRemove,
} from 'firebase/firestore';

export async function deleteContent(e, type, db, userID, parentID) {
  const contentID = e.target.parentNode.parentNode.parentNode.id;
  await deleteDoc(doc(db, type, contentID));

  const usersRef = doc(db, 'users', userID);
  if (type == 'posts') {
    await updateDoc(usersRef, {
      posts: arrayRemove(contentID),
      postsCount: increment(-1),
    });
  } else if (type == 'comments') {
    await updateDoc(usersRef, {
      comments: arrayRemove(contentID),
      commentsCount: increment(-1),
    });

    const postRef = doc(db, 'posts', parentID);
    await updateDoc(postRef, {
      comments: increment(-1),
    });
  }
}
