// ─────────────────────────────────────────────
// src/socket.js
// Centralised WebSocket helper for the frontend
// ─────────────────────────────────────────────
import { io } from 'socket.io-client';

let socket = null;

/**
 * Initialise (or return existing) Socket.IO client.
 * Ensures only a single connection per tab.
 */
export const connectSocket = () => {
  if (!socket) {
    // Vite env variable ➜ VITE_BACKEND_URL
    const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';

    socket = io(backendUrl, {
      transports: ['websocket'], // use WebSocket only
      withCredentials: true,
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 2000,
      timeout: 10000, // fail if not connected in 10s
    });

    /** Connection events */
    socket.on('connect', () => {
      console.log('✅ Connected to WebSocket server:', socket.id);
    });

    socket.on('disconnect', (reason) => {
      console.warn('⚠️ Disconnected from WebSocket:', reason);
    });

    socket.on('connect_error', (err) => {
      console.error('❌ WebSocket connection error:', err.message);
    });

    /** Custom server events */
    socket.on('task_update', () => {
      console.log('🔄 Received task_update from server');
      // UI reactivity is handled elsewhere in the app
    });
  }

  return socket;
};
