import React from 'react';

function Content({ posts }) {
  return (
    <div>
      {posts.map((post) => {
        return (
          <div>
            <p>{post.title}</p>
            {post.url == '' ? <p>{post.text}</p> : <p>{post.url}</p>}
            <p>{post.likes}</p>
            <p>{post.comments}</p>
          </div>
        );
      })}
    </div>
  );
}

export default Content;
