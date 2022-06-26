import { useState } from 'react';
import { auth } from '../firebase.config';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';

//TODO: error checking

function Login() {
  const [loginForm, setLoginForm] = useState({
    email: '',
    password: '',
  });

  const navigate = useNavigate();

  const login = async () => {
    const loginEmail = loginForm.email;
    const loginPassword = loginForm.password;

    try {
      const userCredentials = await signInWithEmailAndPassword(
        auth,
        loginEmail,
        loginPassword
      );
      navigate('/');
    } catch (err) {
      console.log(err);
    }
  };

  function onChange(e) {
    setLoginForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  }

  return (
    <div className="form">
      <h2 className="bottom-margin form-title">Login</h2>
      <input
        required
        type="email"
        name="email"
        placeholder="Email"
        onChange={onChange}
        className="bottom-margin input-border"
      />
      <input
        required
        type="password"
        name="password"
        placeholder="Password"
        onChange={onChange}
        className="bottom-margin input-border"
      />
      <button onClick={login} className="btn">
        Log In
      </button>
    </div>
  );
}

export default Login;
