import React from 'react';
import { Link } from 'react-router-dom';

function Navbar() {
  return (
    <div>
      <h1>DevNews</h1>
      <ul>
        <li>Posts</li>
        <li>Submit</li>
        <Link to="/login">Login</Link>
      </ul>
    </div>
  );
}

export default Navbar;
