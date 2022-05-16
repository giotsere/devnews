import React, { useState } from 'react';
import { auth } from '../firebase.config';
import { signInWithEmailAndPassword } from 'firebase/auth';

//TODO: error checking

function Login() {
  const [loginForm, setLoginForm] = useState({
    email: '',
    password: '',
  });

  const login = async () => {
    const loginEmail = loginForm.email;
    const loginPassword = loginForm.password;

    const userCredentials = await signInWithEmailAndPassword(
      auth,
      loginEmail,
      loginPassword
    );
  };

  function onChange(e) {
    setLoginForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  }

  return (
    <div>
      <h2>Login</h2>
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
      <button onClick={login}>Log In</button>
    </div>
  );
}

export default Login;
