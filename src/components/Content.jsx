import React from 'react';

function Content({ posts }) {
  return (
    <div className="flex flex-col items-center mt-20">
      {posts.map((post) => {
        return (
          <div className="flex flex-col w-72 mb-4">
            <div className="flex w-full">
              <p className="content-title cursor-pointer">{post.title}</p>
              {post.url != '' ? (
                <p className="secondery-colour  cursor-pointer">({post.url})</p>
              ) : (
                ''
              )}
            </div>
            <div className="flex w-full">
              <p className="secondery-colour">{post.likes} points</p>
              <p className="p-margin secondery-colour">
                {post.comments} comments by
              </p>
              <p className="p-margin user-colour">{post.username}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default Content;
