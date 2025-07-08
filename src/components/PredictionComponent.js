// src/components/PredictionComponent.js
import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { toast } from 'react-hot-toast';
import { CheckCircle, XCircle, Brain } from 'lucide-react';
import debounce from 'lodash.debounce';
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { auth } from '../firebase';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:5000';

const PredictionComponent = ({ user, onLogin }) => {
  const [textInput, setTextInput] = useState('');
  const [predictionResult, setPredictionResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);

  useEffect(() => {
    const debouncedPredict = debounce(async (text) => {
      if (!text.trim()) {
        setPredictionResult(null);
        setErrorMessage(null);
        return;
      }

      setIsLoading(true);
      setErrorMessage(null);

      try {
        const response = await fetch(`${BACKEND_URL}/predict`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ text }),
        });

        const data = await response.json();

        if (response.ok && data.result) {
          setPredictionResult(data.result);
          toast.success('🧠 Prediction updated');
        } else {
          throw new Error(data.error || 'Prediction failed');
        }
      } catch (err) {
        console.error('Prediction error:', err);
        setPredictionResult(null);
        setErrorMessage('❌ Prediction failed. Try again.');
        toast.error('❌ Prediction failed');
      } finally {
        setIsLoading(false);
      }
    }, 800);

    debouncedPredict(textInput);

    return () => {
      debouncedPredict.cancel();
    };
  }, [textInput]);

  const handleClear = () => {
    setTextInput('');
    setPredictionResult(null);
    setErrorMessage(null);
    toast('🧹 Cleared input', { icon: '🧹' });
  };

  const handleLogin = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const firebaseUser = result.user;
      toast.success(`Welcome, ${firebaseUser.displayName}!`);
      if (onLogin) onLogin(firebaseUser);
    } catch (err) {
      console.error('Login failed:', err);
      toast.error('Login failed. Try again.');
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 shadow-md rounded p-6 border border-gray-200 dark:border-gray-700 transition-colors duration-300">
      <h2 className="text-xl font-bold mb-4 flex items-center gap-2 text-gray-900 dark:text-gray-100">
        <Brain className="text-indigo-500 dark:text-indigo-400 w-6 h-6" />
        Real-time AI Predictor
      </h2>

      {!user ? (
        <button
          onClick={handleLogin}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded flex items-center gap-2 transition"
        >
          🔑 Login with Google to Predict
        </button>
      ) : (
        <>
          <textarea
            value={textInput}
            onChange={(e) => setTextInput(e.target.value)}
            placeholder="Type something to get a prediction..."
            className="w-full h-24 p-3 border border-gray-300 dark:border-gray-600 rounded text-gray-800 dark:text-gray-100 bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors duration-300"
          />

          <div className="flex gap-3 mt-4 items-center">
            <button
              onClick={handleClear}
              className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded transition"
            >
              🧹 Clear
            </button>
            {isLoading && (
              <span className="text-blue-600 dark:text-blue-400 flex items-center gap-1">
                <span className="animate-spin border-t-2 border-blue-500 h-4 w-4 rounded-full"></span>
                Predicting...
              </span>
            )}
          </div>

          {predictionResult && (
            <div className="mt-6 p-4 rounded border bg-green-50 dark:bg-green-900 text-green-800 dark:text-green-300 border-green-300 dark:border-green-700 transition-colors duration-300">
              <p className="font-semibold flex items-center gap-2">
                <CheckCircle className="w-5 h-5" />
                Prediction Result:
              </p>
              <p className="mt-1">{predictionResult}</p>
            </div>
          )}

          {errorMessage && (
            <div className="mt-6 p-4 rounded border bg-red-50 dark:bg-red-900 text-red-700 dark:text-red-300 border-red-300 dark:border-red-700 transition-colors duration-300">
              <p className="font-semibold flex items-center gap-2">
                <XCircle className="w-5 h-5" />
                Error:
              </p>
              <p className="mt-1">{errorMessage}</p>
            </div>
          )}
        </>
      )}
    </div>
  );
};

// ✅ Add PropTypes validation
PredictionComponent.propTypes = {
  user: PropTypes.object,
  onLogin: PropTypes.func,
};

export default PredictionComponent;
