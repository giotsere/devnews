import React from 'react';
import { Link } from 'react-router-dom';

function Content({ posts }) {
  return (
    <div className="flex flex-col items-center mt-20">
      {posts.map((post) => {
        return (
          <div
            to={`/posts/${post.id}`}
            className="mb-8 xl:w-7/12 w-10/12 custom-border"
            id={post.id}
          >
            <div className="flex w-full">
              <Link
                to={`/posts/${post.id}`}
                className="content-title hover-effect"
              >
                {post.title}
              </Link>
              {post.url != '' ? (
                <a
                  target="_blank"
                  href={post.url}
                  rel="noopener noreferrer"
                  className="secondery-colour hover:text-gray-700 hover:underline"
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
              <p className="p-margin user-colour">{post.username}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default Content;
