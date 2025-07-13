// src/App.js
import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Routes, Route, Navigate } from 'react-router-dom';
import CalendarTasks from './CalendarTasks';
import PredictionComponent from './components/PredictionComponent';
import ProfileCard from './components/ProfileCard';
import { Toaster } from 'react-hot-toast';
import './App.css';
import ProfileTab from './components/ProfileTab';
import PrivateRoute from './components/PrivateRoute';
import ThemeToggle from './components/ThemeToggle';
import ProfileSection from './components/ProfileSection';
import { useAuth } from './hooks/useAuth';
import { supabase } from './supabaseClient';
import { connectSocket } from './socket';
import FirebaseTokenTool from './components/FirebaseTokenTool';
import CalendarView from './components/CalendarView';
import Sidebar from './components/Sidebar';

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
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  // ✅ Fetch tasks from Supabase
  const fetchUserTasks = async () => {
    if (user) {
      try {
        const { data, error } = await supabase.from('tasks').select('*').eq('user_id', user.uid);

        if (error) {
          console.error('❌ Supabase fetch error:', error.message);
        } else {
          setTasks(data);
          console.log('✅ Fetched tasks:', data);
        }
      } catch (err) {
        console.error('❌ Unexpected fetch error:', err.message);
      } finally {
        setLoading(false);
      }
    }
  };

  // 🔌 Connect WebSocket and listen for task updates
  useEffect(() => {
    const socket = connectSocket();

    const handleTaskUpdate = () => {
      console.log('📬 Received "task_update" from server');
      fetchUserTasks(); // 🔄 Refresh tasks when notified
    };

    socket.on('task_update', handleTaskUpdate);

    return () => {
      socket.off('task_update', handleTaskUpdate);
    };
  }, [user]);

  // 🔃 Initial task fetch on login
  useEffect(() => {
    fetchUserTasks();
  }, [user]);

  return (
    <ErrorBoundary>
      <ThemeToggle />
      <Toaster position="top-right" />
      <Sidebar />

      <Routes>
        {/* 🌐 Public Routes */}
        <Route path="/profile" element={<ProfileCard />} />
        <Route path="/predict" element={<PredictionComponent />} />

        {/* 🔐 Protected Routes */}
        <Route
          path="/"
          element={
            <PrivateRoute user={user}>
              <CalendarTasks tasks={tasks} loading={loading} fetchTasks={fetchUserTasks} />
            </PrivateRoute>
          }
        />
        <Route
          path="/calendar-view"
          element={
            <PrivateRoute user={user}>
              <CalendarView />
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

        {/* 🔧 Firebase Token Tool */}
        <Route path="/get-id-token" element={<FirebaseTokenTool />} />

        {/* 🐞 Debug Route */}
        <Route
          path="/debug"
          element={
            <div className="p-4">
              <pre>{JSON.stringify(user, null, 2)}</pre>
            </div>
          }
        />

        {/* 🛑 Catch-all Route */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </ErrorBoundary>
  );
}

export default App;
