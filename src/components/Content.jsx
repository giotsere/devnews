import { useState, useEffect } from 'react';
import {
  collection,
  query,
  getDocs,
  orderBy,
  startAfter,
  endAt,
  limit,
} from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import { auth, db } from '../firebase.config';

import PostCard from './PostCard';

function Content() {
  const [lastVisible, setLastVisible] = useState();
  const [posts, setPosts] = useState([]);
  const [isNext, setIsNext] = useState(true);

  const [userState, setUserState] = useState({
    authenticated: false,
  });

  const [userID, setUserID] = useState({
    id: '',
  });

  const fetchData = async () => {
    const first = query(
      collection(db, 'posts'),
      orderBy('date', 'desc'),
      limit(5)
    );

    const documentSnapshots = await getDocs(first);

    getDocs(first).then((snapshot) => {
      snapshot.forEach((doc) => {
        setPosts((prev) => [...prev, doc.data()]);
      });
    });

    setLastVisible(documentSnapshots.docs[documentSnapshots.docs.length - 1]);
  };

  const previousData = async () => {
    const prev = query(
      collection(db, 'posts'),
      orderBy('date', 'desc'),
      endAt(lastVisible),
      limit(5)
    );

    const documentSnapshots = await getDocs(prev);
    setPosts([]);
    setLastVisible(documentSnapshots.docs[documentSnapshots.docs.length - 1]);

    getDocs(prev).then((snapshot) => {
      snapshot.forEach((doc) => {
        setPosts((prev) => [...prev, doc.data()]);
      });
    });
    setIsNext(true);
  };

  const nextData = async () => {
    const next = query(
      collection(db, 'posts'),
      orderBy('date', 'desc'),
      startAfter(lastVisible),
      limit(5)
    );

    const documentSnapshots = await getDocs(next);
    if (documentSnapshots.docs.length != 0) {
      if (documentSnapshots.docs.length < 5) {
        setIsNext(false);
        setPosts([]);
        setLastVisible(
          documentSnapshots.docs[documentSnapshots.docs.length - 1]
        );

        getDocs(next).then((snapshot) => {
          snapshot.forEach((doc) => {
            setPosts((prev) => [...prev, doc.data()]);
          });
        });
      } else {
        setPosts([]);
        setLastVisible(
          documentSnapshots.docs[documentSnapshots.docs.length - 1]
        );

        getDocs(next).then((snapshot) => {
          snapshot.forEach((doc) => {
            setPosts((prev) => [...prev, doc.data()]);
          });
        });
      }
    } else {
      setIsNext(false);
    }
  };

  useEffect(() => {
    fetchData();
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

  return (
    <main id="main">
      <div className="flex flex-col items-center mt-20" id="content">
        {posts.map((post) => {
          return (
            <PostCard
              post={post}
              authenticated={userState.authenticated}
              db={db}
              userID={userID.id}
              key={post.id}
            />
          );
        })}
        <div className="flex">
          <button className="m-4 btn" onClick={previousData}>
            Prev
          </button>
          {isNext && (
            <button className="m-4 btn" onClick={nextData}>
              Next
            </button>
          )}
        </div>
      </div>
    </main>
  );
}

export default Content;
