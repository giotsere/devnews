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
    await signOut(auth).then(() => {
      console.log('user logged out');
    });
  };

  return (
    <div className="flex justify-around mb-6 pt-2">
      <div className="flex">
        <Link to="/" className="font-size">
          <h1 className="content-title">DevNews</h1>
        </Link>
        <ul className="flex">
          <Link to="/" className="font-size">
            <li className="nav-margin font-size cursor-pointer">Posts</li>
          </Link>

          <li className="nav-margin font-size cursor-pointer">Submit</li>
        </ul>
      </div>
      <div>
        {userState ? (
          <div onClick={logout} className="nav-margin">
            Log Out
          </div>
        ) : (
          <Link to="/login" className="nav-margin font-size">
            Login
          </Link>
        )}
      </div>
    </div>
  );
}

export default Navbar;
