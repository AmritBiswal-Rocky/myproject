// src/components/FirebaseTokenTool.jsx

import React, { useState } from 'react';
import {
  signInWithGoogle,
  signOutUser,
  generateFirebaseToken,
  auth,
  onAuthStateChanged,
} from '../firebase';

const FirebaseTokenTool = () => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState('');
  const [copied, setCopied] = useState(false);

  // Track auth state
  React.useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
    });
    return () => unsubscribe();
  }, []);

  const handleSignIn = async () => {
    const user = await signInWithGoogle();
    setUser(user);
  };

  const handleGetToken = async () => {
    const token = await generateFirebaseToken();
    setToken(token);
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
