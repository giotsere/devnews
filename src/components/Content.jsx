import React from 'react';
import { Link } from 'react-router-dom';

function Content({ posts }) {
  return (
    <div className="flex flex-col items-center mt-20">
      {posts.map((post) => {
        return (
          <Link
            to={`/posts/${post.id}`}
            className="mb-4 xl:w-7/12 w-10/12"
            id={post.id}
          >
            <div className="flex w-full">
              <p className="content-title cursor-pointer">{post.title}</p>
              {post.url != '' ? (
                <p className="secondery-colour cursor-pointer">({post.url})</p>
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
          </Link>
        );
      })}
    </div>
  );
}

export default Content;
