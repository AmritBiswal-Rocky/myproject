// src/hooks/useAuth.js
import { useEffect, useState, createContext, useContext } from 'react';
import { onAuthStateChanged, getAuth } from 'firebase/auth';
import { auth as firebaseAuth } from '../firebase'; // ✅ Correctly import initialized auth instance
import PropTypes from 'prop-types';

// Create Firebase auth instance
const auth = getAuth(firebaseAuth.app); // or just use `firebaseAuth` if already initialized

// Create context
const AuthContext = createContext();

// AuthProvider to wrap the app
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(undefined); // undefined means loading
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser || null);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return <AuthContext.Provider value={{ user, loading }}>{children}</AuthContext.Provider>;
};

// Prop validation
AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

// Custom hook for auth context
export const useAuth = () => useContext(AuthContext);
