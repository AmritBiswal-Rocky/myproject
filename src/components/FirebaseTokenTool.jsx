// ────────────────────────────────────────────────
// src/components/FirebaseTokenTool.jsx
// ────────────────────────────────────────────────

import React, { useState, useEffect } from 'react';
import {
  signInWithGoogle,
  signOutUser,
  generateFirebaseToken,
  auth,
  onAuthStateChanged,
} from '../firebaseClient'; // ← updated path

const FirebaseTokenTool = () => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState('');
  const [copied, setCopied] = useState(false);

  // Track auth state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
    });
    return () => unsubscribe();
  }, []);

  const handleSignIn = async () => {
    const loggedInUser = await signInWithGoogle();
    setUser(loggedInUser);
  };

  const handleGetToken = async () => {
    const idToken = await generateFirebaseToken();
    setToken(idToken || '');
    setCopied(false);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(token);
    setCopied(true);
  };

  const handleSignOut = async () => {
    await signOutUser();
    setUser(null);
    setToken('');
  };

  return (
    <div style={{ padding: 20, maxWidth: 600, margin: 'auto', fontFamily: 'sans-serif' }}>
      <h2>🛠️ Firebase ID Token Tool</h2>

      {!user ? (
        <button onClick={handleSignIn}>🔐 Login with Google</button>
      ) : (
        <>
          <p>✅ Logged in as: {user.email}</p>
          <button onClick={handleGetToken}>🔑 Get Firebase ID Token</button>

          {token && (
            <>
              <pre
                style={{
                  whiteSpace: 'pre-wrap',
                  wordBreak: 'break-word',
                  background: '#f0f0f0',
                  padding: 10,
                }}
              >
                {token}
              </pre>
              <button onClick={handleCopy}>{copied ? '✅ Copied' : '📋 Copy Token'}</button>
            </>
          )}

          <br />
          <br />
          <button onClick={handleSignOut}>👋 Sign Out</button>
        </>
      )}
    </div>
  );
};

export default FirebaseTokenTool;
