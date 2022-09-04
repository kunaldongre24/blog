import { initializeApp } from "firebase/app";
import {
  getAuth,
  RecaptchaVerifier,
  signInWithPhoneNumber,
  signOut,
} from "firebase/auth";

import { getDatabase } from "firebase/database";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyDXMCJ4YopHqwEAfxI-oF8CAWJAlABTQFk",
  authDomain: "blog-cfa2b.firebaseapp.com",
  projectId: "blog-cfa2b",
  storageBucket: "blog-cfa2b.appspot.com",
  messagingSenderId: "381992267940",
  appId: "1:381992267940:web:b2d40ee734f670a06b3631",
  measurementId: "G-G17TRB557C",
};

const app = initializeApp(firebaseConfig);
const authentication = getAuth(app);

const db = getDatabase(app);
const storage = getStorage(app);

const logout = () => {
  signOut(authentication);
};
export {
  db,
  storage,
  authentication,
  signInWithPhoneNumber,
  RecaptchaVerifier,
  logout,
};
