import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyDUDQti3a-SnstsakWSB6vTppsxDV_gh2Q",
  authDomain: "techwealth-website.firebaseapp.com",
  projectId: "techwealth-website",
  storageBucket: "techwealth-website.appspot.com",
  messagingSenderId: "36453865287",
  appId: "1:36453865287:web:22bef340b02a7b8e385e62",
  measurementId: "G-HLRMJ3E11E"
};

export const firebaseApp = initializeApp(firebaseConfig);
export const db = getFirestore(firebaseApp);
export const auth = getAuth(firebaseApp);
