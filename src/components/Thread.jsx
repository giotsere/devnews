import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { db } from '../firebase.config';
import { doc, getDoc } from 'firebase/firestore';
import Navbar from './Navbar';

function Thread() {
  const { id } = useParams();
  const [post, setPost] = useState('');
  const [error, setError] = useState(false);

  const postRef = doc(db, 'posts', id);

  useEffect(() => {
    const fetchData = async () => {
      const docSnap = await getDoc(postRef);

      if (docSnap.exists()) {
        setPost(docSnap.data());
      } else {
        setError(True);
      }
    };

    fetchData();
  }, []);

  return (
    <div>
      <Navbar />
      <div className="flex flex-col items-center mt-20">
        {error && <p>There was an error fetching data</p>}
        {post != '' && (
          <div className="mb-4 xl:w-7/12 w-10/12  custom-border">
            <div className="flex w-full">
              <p className="content-title hover-effect">{post.title}</p>
              {post.url != '' ? (
                <a
                  target="_blank"
                  href={post.url}
                  rel="noopener noreferrer"
                  className="secondery-colour cursor-pointer"
                >
                  ({post.url})
                </a>
              ) : (
                ''
              )}
            </div>
            <div className="flex w-full">
              <p className="secondery-colour">{post.likes} points</p>
              <p className="p-margin secondery-colour">
                {post.comments} comments by
              </p>
              <p className="p-margin user-colour mb-10">{post.username}</p>
            </div>
            <div>{post.text != '' ? <p>{post.text}</p> : ''}</div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Thread;
