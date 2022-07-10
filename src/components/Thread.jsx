import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import {
  addDoc,
  collection,
  doc,
  getDoc,
  updateDoc,
  increment,
  arrayUnion,
  query,
  where,
  onSnapshot,
} from 'firebase/firestore';
import PostCard from './PostCard';

import { auth, db } from '../firebase.config';
import { onAuthStateChanged } from 'firebase/auth';
import { Link } from 'react-router-dom';
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
    where('postID', '==', id)
  );

  useEffect(() => {
    const fetchData = async () => {
      const docSnap = await getDoc(postRef);

      onSnapshot(commentsQuery, (comments) => {
        setComments(
          comments.docs.map((comment) => {
            return {
              ...comment.data(),
            };
          })
        );
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

  function createTree(list) {
    let map = {},
      node,
      roots = [],
      i;

    for (i = 0; i < list.length; i += 1) {
      map[list[i].id] = i; // initialize the map
      list[i].children = []; // initialize the children
    }

    for (i = 0; i < list.length; i += 1) {
      node = list[i];
      if (node.parentID) {
        // if you have dangling branches check that map[node.parentId] exists
        list[map[node.parentID]].children.push(node);
      } else {
        roots.push(node);
      }
    }
    return roots;
  }

  const commentTree = createTree(comments);

  const addComment = async () => {
    try {
      let date = new Date();
      const docRef = await addDoc(collection(db, 'comments'), {
        comment: comment,
        username: displayName,
        uid: userID.id,
        parentID: null,
        postID: post.id,
        date: date,
        replies: 0,
        likes: 0,
        children: null,
      });

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

      setComment('');
    } catch (err) {
      console.log(err);
    }
  };

  const handleOnChange = (e) => {
    setComment(e.target.value);
  };

  return (
    <div>
      <div className="flex flex-col items-center mt-20">
        {error && <p>There was an error fetching data</p>}
        {post != '' && (
          <PostCard
            post={post}
            authenticated={userState.authenticated}
            db={db}
            userID={userID.id}
            key={post.id}
          />
        )}
        {userState.authenticated ? (
          <div className="mb-4 xl:w-7/12 w-10/12">
            <textarea
              name="comment"
              className="w-full textarea"
              placeholder="Add a comment..."
              onChange={handleOnChange}
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
        <div className="flex flex-col xl:w-7/12 w-10/12 mt-20 border-t-2 border-sky-800 pt-10  h-screen">
          {comError && <p>There was an error fetching data</p>}
          {post.comments === 0 ? (
            <p className="text-center underline text-lg">
              This Post has no comments
            </p>
          ) : (
            commentTree.map((comm) => {
              return (
                <div key={comm.id}>
                  {' '}
                  <Comment
                    comm={comm}
                    authenticated={userState.authenticated}
                    commentUsername={displayName}
                    userID={userID.id}
                    displayName={displayName}
                    key={comm.id}
                    postID={id}
                  />
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}

export default Thread;
