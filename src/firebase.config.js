import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: 'AIzaSyCibpzFQlbQvZrtW-PkeAuu6RkZ6f6I5Qg',
  authDomain: 'devnews-cfd07.firebaseapp.com',
  projectId: 'devnews-cfd07',
  storageBucket: 'devnews-cfd07.appspot.com',
  messagingSenderId: '10507188598',
  appId: '1:10507188598:web:8abd6148b79a2fa443a257',
};

const app = initializeApp(firebaseConfig);

const db = getFirestore(app);
const auth = getAuth(app);

export { app, db, auth };
