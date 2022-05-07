import React, { useState } from 'react';

function Signup() {
  const [SignUpForm, setSignUpForm] = useState({
    email: '',
    password: '',
    confirmPassword: '',
  });

  function onSubmit() {}

  function onChange(e) {
    setSignUpForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  }

  return (
    <div>
      <h2>Sign Up</h2>
      <form onSubmit={onSubmit}>
        <input required type="text" name="username" placeholder="Username" />
        <input
          required
          type="password"
          name="password"
          placeholder="Password"
        />
        <input
          required
          type="password"
          name="confirmpassword"
          placeholder="Confirm Password"
        />
        <button type="submit">Log In</button>
      </form>
    </div>
  );
}

export default Signup;
