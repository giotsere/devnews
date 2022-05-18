import React, { useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { auth } from '../firebase.config';
import Login from './Login';
import SignUp from './SignUp';
import Navbar from './Navbar';

function Loginpage() {
  let navigate = useNavigate();

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        navigate('/');
      }
    });
  }, []);

  return (
    <>
      <Navbar />
      <div className="flex flex-col items-center">
        <Login />
        <SignUp />
      </div>
    </>
  );
}

export default Loginpage;
