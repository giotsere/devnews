import React, { useState } from 'react';

function Login() {
  const [loginForm, setLoginForm] = useState({
    email: '',
    password: '',
  });

  function onSubmit() {}

  function onChange(e) {
    setLogoinForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  }

  return (
    <div>
      <h2>Login</h2>
      <form onSubmit={onSubmit}>
        <input required type="text" name="username" placeholder="Username" />
        <input
          required
          type="password"
          name="password"
          placeholder="Password"
        />
        <button type="submit">Log In</button>
      </form>
    </div>
  );
}

export default Login;
