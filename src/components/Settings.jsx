import { useState, useEffect } from 'react';
import { auth, db } from '../firebase.config';
import { onAuthStateChanged, updateProfile } from 'firebase/auth';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';

function Settings() {
  const [newUsername, setNewUsername] = useState({
    displayName: '',
  });
  const [oldUsername, setOldUsername] = useState({
    name: '',
  });
  const [error, setError] = useState('');
  const [userData, setUserData] = useState('');

  let navigate = useNavigate();

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setNewUsername({
          displayName: user.displayName,
        });
        setOldUsername({
          name: user.displayName,
        });

        const fetchUserData = (async () => {
          const usersRef = await doc(db, 'users', user.uid);
          const docSnap = await getDoc(usersRef);
          if (docSnap.exists()) {
            setUserData(docSnap.data());
          }
        })();
      }
    });
  }, []);

  const updateUser = async () => {
    if (newUsername.displayName == oldUsername.name) {
      setError("Can't submit empty data");
    } else {
      try {
        const updateProfileUsername = await updateProfile(auth.currentUser, {
          displayName: newUsername.displayName,
        });
        const updateUserUsername = await updateDoc(
          doc(db, 'users', auth.currentUser.uid),
          {
            username: newUsername.displayName,
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
    setNewUsername((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  }

  return (
    <div>
      <div className="flex flex-col items-center mt-20">
        <h2 className="form-title">Settings</h2>
        <div className="form">
          <label className="bottom-margin form-title">Change Username</label>
          <input
            type="text"
            name="displayName"
            id="displayname"
            className="input-border mb-6"
            placeholder={newUsername.displayName}
            onChange={onChange}
          />

          <button className="btn mb-4" onClick={updateUser}>
            Submit
          </button>
          <a href="" className="form-title mt-4">
            Posts ({userData.postsCount})
          </a>
          <a href="" className="form-title mt-4">
            Comments ({userData.commentsCount})
          </a>
        </div>
        <div></div>
        {error ? <p className="text-center text-red-700">{error}</p> : ''}
      </div>
    </div>
  );
}

export default Settings;
