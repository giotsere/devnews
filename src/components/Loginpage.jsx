import React, { useEffect } from 'react';
import Login from './Login';
import SignUp from './SignUp';
import Navbar from './Navbar';

function Loginpage() {
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
