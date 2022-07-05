import { useState, useEffect } from 'react';

import { onAuthStateChanged } from 'firebase/auth';
import { auth, db } from '../firebase.config';

import PostCard from './PostCard';

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

  return (
    <main>
      <div className="flex flex-col items-center mt-20">
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
      </div>
    </main>
  );
}

export default Content;
