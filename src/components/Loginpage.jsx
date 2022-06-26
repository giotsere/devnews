import React, { useEffect } from 'react';
import Login from './Login';
import SignUp from './SignUp';

function Loginpage() {
  return (
    <>
      <div className="flex flex-col items-center">
        <Login />
        <SignUp />
      </div>
    </>
  );
}

export default Loginpage;
