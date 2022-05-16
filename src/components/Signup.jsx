import React, { useState } from 'react';
import { auth } from '../firebase.config';
import { createUserWithEmailAndPassword } from 'firebase/auth';
//TODO: error checking

function Signup() {
  const [SignUpForm, setSignUpForm] = useState({
    email: '',
    password: '',
    confirmPassword: '',
  });

  const createAccount = async () => {
    const signUpEmail = SignUpForm.email;
    const signUpPassword = SignUpForm.password;

    if (SignUpForm.password === SignUpForm.confirmPassword) {
      try {
        const userCredentials = await createUserWithEmailAndPassword(
          auth,
          signUpEmail,
          signUpPassword
        );
      } catch (err) {
        console.log(err);
      }
    }
  };

  function onChange(e) {
    setSignUpForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  }

  return (
    <div>
      <h2>Sign Up</h2>
      <input
        required
        type="email"
        name="email"
        placeholder="Email"
        onChange={onChange}
      />
      <input
        required
        type="password"
        name="password"
        placeholder="Password"
        onChange={onChange}
      />
      <input
        required
        type="password"
        name="confirmPassword"
        placeholder="Confirm Password"
        onChange={onChange}
      />
      <button onClick={createAccount}>Sign Up</button>
    </div>
  );
}

export default Signup;
