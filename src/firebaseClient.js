// ──────────────────────────────────────────────────────
// src/firebaseClient.js
// Complete, drop‑in replacement for your old firebase.js
// Works in Vite/React using import.meta.env (VITE_… keys)
// ──────────────────────────────────────────────────────

import { initializeApp } from 'firebase/app';
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  onAuthStateChanged,
  signOut,
} from 'firebase/auth';

// 🔑 Required environment variables (Vite → VITE_*)
//    If you’re on CRA, rename them REACT_APP_* and switch
//    import.meta.env → process.env below.
const requiredEnvVars = [
  'VITE_FIREBASE_API_KEY',
  'VITE_FIREBASE_AUTH_DOMAIN',
  'VITE_FIREBASE_PROJECT_ID',
  'VITE_FIREBASE_STORAGE_BUCKET',
  'VITE_FIREBASE_MESSAGING_SENDER_ID',
  'VITE_FIREBASE_APP_ID',
  'VITE_FIREBASE_MEASUREMENT_ID',
];

// Warn early if something is missing
for (const key of requiredEnvVars) {
  if (!import.meta.env[key]) {
    console.warn(`⚠️ Missing environment variable: ${key}`);
  }
}

// 🔥 Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
};

// 🚀 Initialize Firebase
const app = initializeApp(firebaseConfig);

// 🔐 Auth setup
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

/**
 * Sign in with Google (popup)
 */
export const signInWithGoogle = async () => {
  try {
    const { user } = await signInWithPopup(auth, googleProvider);
    console.log('✅ Logged‑in user:', user);
    return user;
  } catch (error) {
    console.error('❌ Google sign‑in error:', error);
  }
};

/**
 * Get a fresh Firebase ID token (JWT)
 */
export const generateFirebaseToken = async () => {
  const firebaseUser = auth.currentUser;
  if (!firebaseUser) {
    console.warn('⚠️ No Firebase user is signed in.');
    return null;
  }
  try {
    const token = await firebaseUser.getIdToken(true); // force refresh
    console.log('🔐 Firebase ID token:', token);
    return token;
  } catch (error) {
    console.error('❌ Token generation error:', error);
  }
};

/**
 * Sign out current user
 */
export const signOutUser = async () => {
  try {
    await signOut(auth);
    console.log('👋 User signed out');
  } catch (error) {
    console.error('❌ Sign‑out error:', error);
  }
};

// 📊 Enable Analytics (only in browser)
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

// 📦 Exports
export { app, auth, googleProvider, onAuthStateChanged, signOut };
export default app;
