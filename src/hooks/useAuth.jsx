// ──────────────────────────────────────────────────────────
// src/hooks/useAuth.jsx
// Centralised Firebase Auth context + hook
// ──────────────────────────────────────────────────────────

import React, { createContext, useContext, useEffect, useState } from 'react';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { app as firebaseApp } from '../firebaseClient'; // ← Path to your Firebase app
import PropTypes from 'prop-types';

// Initialise Firebase Auth from the already‑initialised app
const auth = getAuth(firebaseApp);

// Create a context with sensible defaults
const AuthContext = createContext({
  user: null,
  loading: true,
});

// ──────────────────────────────────────────
// <AuthProvider> — wrap your app once (in main.jsx)
// ──────────────────────────────────────────
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Listen for auth state changes
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser || null);
      setLoading(false);
    });

    // Clean up listener on unmount
    return () => unsubscribe();
  }, []);

  return <AuthContext.Provider value={{ user, loading }}>{children}</AuthContext.Provider>;
};

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

// ──────────────────────────────────────────
// Custom hook — always returns { user, loading }
// ──────────────────────────────────────────
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
