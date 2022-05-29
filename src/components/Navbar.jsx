import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { auth } from '../firebase.config';
import { onAuthStateChanged, signOut } from 'firebase/auth';

function Navbar() {
  const [userState, setUserState] = useState('');
  const [userName, setUserName] = useState('');
  let navigate = useNavigate();

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserState(user);
        setUserName(user.displayName);
      } else {
        setUserState(null);
      }
    });
  }, []);

  const logout = async () => {
    await signOut(auth).then(() => {
      navigate('/');
    });
  };

  const redirect = () => {
    if (userState) {
      navigate('/submit');
    } else {
      navigate('/login');
    }
  };

  return (
    <div className="flex justify-around mb-20 pt-2">
      <div className="flex">
        <Link to="/" className="font-size">
          <h1 className="content-title hover-effect">DevNews</h1>
        </Link>
        <ul className="flex">
          <Link to="/" className="font-size">
            <li className="nav-margin hover-effect">Posts</li>
          </Link>

          <li className="nav-margin hover-effect" onClick={redirect}>
            Submit
          </li>
        </ul>
      </div>
      <div>
        {userState ? (
          <div className="flex">
            <Link
              to="/settings"
              state={userState}
              className="nav-margin hover-effect"
            >
              {userName}
            </Link>
            <p onClick={logout} className="nav-margin  hover-effect">
              Log Out
            </p>
          </div>
        ) : (
          <Link to="/login" className="nav-margin hover-effect">
            Login
          </Link>
        )}
      </div>
    </div>
  );
}

export default Navbar;
