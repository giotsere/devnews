import { useState, useEffect } from 'react';
import { db } from './firebase.config';

import { collection, doc, onSnapshot } from 'firebase/firestore';

import Navbar from './components/Navbar';
import Content from './components/Content';

function App() {
  const [posts, setPosts] = useState([]);

  const postsRef = collection(db, 'posts');

  useEffect(() => {
    onSnapshot(postsRef, (post) => {
      setPosts(
        post.docs.map((doc) => {
          return {
            ...doc.data(),
          };
        })
      );
    });
  }, []);

  return (
    <div className="App">
      <Navbar />
      <Content posts={posts} />
    </div>
  );
}

export default App;
