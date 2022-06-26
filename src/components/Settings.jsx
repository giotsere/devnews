import { useState, useEffect } from 'react';
import { auth, db } from '../firebase.config';
import { onAuthStateChanged, updateProfile } from 'firebase/auth';
import { doc, updateDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';

function Settings() {
  const [userData, setUserData] = useState({
    displayName: '',
  });
  const [oldUser, setOldUser] = useState({
    name: '',
  });
  const [error, setError] = useState('');

  let navigate = useNavigate();

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserData({
          displayName: user.displayName,
          email: user.email,
        });
        setOldUser({
          name: user.displayName,
          email: user.email,
        });
      }
    });
  }, []);

  const updateUser = async () => {
    if (
      userData.displayName == oldUser.name &&
      userData.email == oldUser.email
    ) {
      setError("Can't submit empty data");
    } else {
      try {
        const updateProfileUsername = await updateProfile(auth.currentUser, {
          displayName: userData.displayName,
        });
        const updateUserUsername = await updateDoc(
          doc(db, 'users', auth.currentUser.uid),
          {
            username: userData.displayName,
          }
        );
        setError('');
        navigate('/');
      } catch (err) {
        console.log(err);
      }
    }
  };

  function onChange(e) {
    setUserData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  }

  return (
    <div>
      <div className="flex flex-col items-center mt-20">
        <h2 className="form-title">Settings</h2>
        <div className="form">
          <label className="bottom-margin form-title">Display Name</label>
          <input
            type="text"
            name="displayName"
            id="displayname"
            className="input-border mb-6"
            placeholder={userData.displayName}
            onChange={onChange}
          />

          <button className="btn mb-4" onClick={updateUser}>
            Submit
          </button>
        </div>
        {error ? <p className="text-center text-red-700">{error}</p> : ''}
      </div>
    </div>
  );
}

export default Settings;
