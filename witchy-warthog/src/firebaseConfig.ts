// src/firebaseConfig.ts
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {

  // @ts-ignore
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,

// @ts-ignore
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,

// @ts-ignore
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,

// @ts-ignore
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,

// @ts-ignore
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,

// @ts-ignore
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

export { auth, db, storage };
