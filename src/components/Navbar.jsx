import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { auth } from '../firebase.config';
import { onAuthStateChanged, signOut } from 'firebase/auth';

function Navbar() {
  const [userState, setUserState] = useState(null);

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserState(user);
      } else {
        setUserState(null);
      }
    });
  }, []);

  const logout = async () => {
    await signOut(auth);
  };

  return (
    <div>
      <h1>DevNews</h1>
      <ul>
        <li>Posts</li>
        <li>Submit</li>
        {userState ? (
          <li onClick={logout}>Log Out</li>
        ) : (
          <Link to="/login">Login</Link>
        )}
      </ul>
    </div>
  );
}

export default Navbar;
