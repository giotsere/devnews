import { doc, deleteDoc } from 'firebase/firestore';

export async function deleteContent(e, type, db) {
  const contentID = e.target.parentNode.parentNode.parentNode.id;
  await deleteDoc(doc(db, type, contentID));
  document.getElementById(contentID).textContent = '';
}
