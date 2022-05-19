import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { auth } from '../firebase.config';
import { onAuthStateChanged, signOut } from 'firebase/auth';

function Navbar() {
  const [userState, setUserState] = useState(null);
  let navigate = useNavigate();

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

    navigate('/');
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
          <div onClick={logout} className="nav-margin  hover-effect">
            Log Out
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
