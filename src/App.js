// src/App.js
import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { Routes, Route, Navigate } from 'react-router-dom';
import CalendarTasks from './CalendarTasks';
import PredictionComponent from './components/PredictionComponent';
import ProfileCard from './ProfileCard';
import { Toaster } from 'react-hot-toast';
import './App.css';
import ProfileTab from './components/ProfileTab';
import PrivateRoute from './components/PrivateRoute';
import ThemeToggle from './components/ThemeToggle';
import ProfileSection from './components/ProfileSection';
import { useAuth } from './hooks/useAuth';
import { supabase } from './supabaseClient';
import { connectSocket } from './socket';
import FirebaseTokenTool from './components/FirebaseTokenTool'; // 👈 NEW

// ✅ Error Boundary Component
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('❌ ErrorBoundary caught:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="p-4 text-red-700 font-medium bg-red-100 rounded">
          Something went wrong: {this.state.error?.message}
        </div>
      );
    }

    return this.props.children;
  }
}

ErrorBoundary.propTypes = {
  children: PropTypes.node.isRequired,
};

function App() {
  const { user } = useAuth();

  // 🔌 Connect WebSocket
  useEffect(() => {
    const socket = connectSocket();
    const onTaskUpdate = () => {
      console.log('📬 Received "task_update" from server');
    };

    socket.on('task_update', onTaskUpdate);
    return () => socket.off('task_update', onTaskUpdate);
  }, []);

  // 🧠 Fetch user tasks after login
  useEffect(() => {
    const fetchUserTasks = async () => {
      if (user) {
        try {
          const { data, error } = await supabase.from('tasks').select('*').eq('user_id', user.uid);
          if (error) console.error('❌ Supabase fetch error:', error.message);
          else console.log('✅ Fetched tasks:', data);
        } catch (err) {
          console.error('❌ Unexpected fetch error:', err.message);
        }
      }
    };

    fetchUserTasks();
  }, [user]);

  return (
    <ErrorBoundary>
      <ThemeToggle />
      <Toaster position="top-right" />

      <Routes>
        {/* 🌐 Public Routes */}
        <Route path="/profile" element={<ProfileCard />} />
        <Route path="/predict" element={<PredictionComponent />} />

        {/* 🔐 Protected Routes */}
        <Route
          path="/"
          element={
            <PrivateRoute user={user}>
              <CalendarTasks />
            </PrivateRoute>
          }
        />
        <Route
          path="/profile-section"
          element={
            <PrivateRoute user={user}>
              <ProfileSection />
            </PrivateRoute>
          }
        />
        <Route
          path="/profile-tab"
          element={
            <PrivateRoute user={user}>
              <ProfileTab />
            </PrivateRoute>
          }
        />

        {/* 🔐 Firebase ID Token Tool (for manual token testing) */}
        <Route path="/get-id-token" element={<FirebaseTokenTool />} />

        {/* 🐞 Debug */}
        <Route
          path="/debug"
          element={<div className="p-4">Current user: {JSON.stringify(user)}</div>}
        />

        {/* 🛑 Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </ErrorBoundary>
  );
}

export default App;
