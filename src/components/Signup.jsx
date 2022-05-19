import React, { useState } from 'react';
import { auth, db } from '../firebase.config';
import { doc, setDoc } from 'firebase/firestore';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
//TODO: error checking

function Signup() {
  const [SignUpForm, setSignUpForm] = useState({
    name: '',
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
        )
          .then(() => {
            try {
              updateProfile(auth.currentUser, {
                displayName: SignUpForm.name,
              });
            } catch (err) {
              console.log(err);
            }
          })
          .then(async () => {
            try {
              const docRef = await setDoc(
                doc(db, 'users', auth.currentUser.uid),
                {
                  username: SignUpForm.name,
                  email: SignUpForm.email,
                  uid: auth.currentUser.uid,
                  posts: [],
                  comments: [],
                  createdAt: new Date(),
                }
              );
            } catch (err) {
              console.log(err);
            }
          });
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
    </div>
  );
}

export default Signup;
