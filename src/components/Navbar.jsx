import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { auth } from '../firebase.config';
import { onAuthStateChanged, signOut } from 'firebase/auth';

function Navbar() {
  const [userState, setUserState] = useState('');
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
    <nav className="flex justify-around pt-2 bg-sky-600 pb-2 text-white">
      <div className="flex">
        <Link to="/" className="font-size ">
          <h1 className="hover-effect font-bold">DevNews</h1>
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
            <Link to="/settings" className="nav-margin hover-effect">
              {userState.displayName}
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
    </nav>
  );
}

export default Navbar;
