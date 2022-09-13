import { useState } from 'react';
import { auth, db } from '../firebase.config';
import { doc, setDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
//TODO: error checking

function SignUp() {
  const [SignUpForm, setSignUpForm] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const [errorMessage, setErrorMessage] = useState('');

  let navigate = useNavigate();

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

        const updateUsername = await updateProfile(auth.currentUser, {
          displayName: SignUpForm.name,
        });

        const setUserData = await setDoc(
          doc(db, 'users', auth.currentUser.uid),
          {
            username: SignUpForm.name,
            email: SignUpForm.email,
            uid: auth.currentUser.uid,
            posts: [],
            postsCount: 0,
            upvoted: [],
            comments: [],
            commentsCount: 0,
            createdAt: new Date(),
          }
        );
        navigate('/');
      } catch (err) {
        setErrorMessage(err.code);
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
    <div className="form">
      <h2 className="bottom-margin form-title">Sign Up</h2>
      <input
        required
        type="name"
        name="name"
        placeholder="Name"
        onChange={onChange}
        className="bottom-margin input-border"
      />
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
      <input
        required
        type="password"
        name="confirmPassword"
        placeholder="Confirm Password"
        onChange={onChange}
        className="bottom-margin input-border"
      />
      <button onClick={createAccount} className="btn">
        Sign Up
      </button>
      {errorMessage ? (
        <p className="text-center text-red-600 pt-2">{errorMessage}</p>
      ) : (
        ''
      )}
    </div>
  );
}

export default SignUp;
