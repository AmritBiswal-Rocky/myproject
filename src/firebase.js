// src/firebase.js

import { initializeApp } from 'firebase/app';
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  onAuthStateChanged,
  signOut,
} from 'firebase/auth';

// 🔥 Firebase configuration
const firebaseConfig = {
  apiKey: 'AIzaSyAxFm-MWgNsd_LaQ_tvKCgL5JFVVZbhIew',
  authDomain: 'ai-calender-95194.firebaseapp.com',
  projectId: 'ai-calender-95194',
  storageBucket: 'ai-calender-95194.appspot.com',
  messagingSenderId: '34331058415',
  appId: '1:34331058415:web:48456f38f9ad6d6e9b7b1a',
  measurementId: 'G-F3G5C9E7FJ',
};

// 🚀 Initialize Firebase
const app = initializeApp(firebaseConfig);

// 🔐 Initialize Firebase Auth
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

/**
 * ✅ Sign in with Google popup
 */
const signInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    const user = result.user;
    console.log('✅ Logged in user:', user);
    return user;
  } catch (error) {
    console.error('❌ Error during Google sign-in:', error);
  }
};

/**
 * 🔐 Generate a fresh Firebase ID token (JWT)
 */
const generateFirebaseToken = async () => {
  const firebaseUser = auth.currentUser;
  if (firebaseUser) {
    try {
      const token = await firebaseUser.getIdToken(true); // force refresh
      console.log('🔐 Firebase ID Token:', token);
      return token;
    } catch (error) {
      console.error('❌ Error generating Firebase token:', error);
    }
  } else {
    console.warn('⚠️ No Firebase user is currently signed in.');
  }
};

/**
 * 🔒 Sign out the current user
 */
const signOutUser = async () => {
  try {
    await signOut(auth);
    console.log('👋 User signed out successfully');
  } catch (error) {
    console.error('❌ Error during sign-out:', error);
  }
};

// ✅ Optional: Load Analytics if browser supports it
if (typeof window !== 'undefined') {
  import('firebase/analytics').then(({ getAnalytics, isSupported }) => {
    isSupported().then((supported) => {
      if (supported) {
        getAnalytics(app);
        console.log('📊 Firebase Analytics enabled');
      }
    });
  });
}

// 📦 Export Firebase helpers
export {
  auth,
  googleProvider,
  signInWithPopup,
  onAuthStateChanged,
  signOut,
  signInWithGoogle,
  generateFirebaseToken,
  signOutUser,
};

export default app;
