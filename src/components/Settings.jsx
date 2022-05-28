import React, { useState, useEffect } from 'react';
import Navbar from './Navbar';
import { auth } from '../firebase.config';
import { onAuthStateChanged } from 'firebase/auth';

function Settings() {
  const [userState, setUserState] = useState(null);

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserState(user);
      } else {
        setUserState(null);
      }
    });
  }, []);

  return (
    <div>
      <Navbar />
      <div>
        <h2>Settings</h2>
        <div>
          <div>
            <label>Display Name</label>
            <input type="text" name="displayname" id="displayname" />
          </div>
          <div>
            <label>Email</label>
            <input type="text" name="email" id="email" />
          </div>
          <button>Submit</button>
        </div>
      </div>
    </div>
  );
}

export default Settings;
