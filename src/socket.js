// src/socket.js
import { io } from 'socket.io-client';

let socket = null;

/**
 * Initializes and returns a WebSocket connection to the backend server.
 * Ensures only one connection is established.
 */
export const connectSocket = () => {
  if (!socket) {
    socket = io('http://localhost:5000', {
      transports: ['websocket'], // ✅ Use only WebSocket (no polling fallback)
      withCredentials: true, // ✅ Include credentials if needed
      reconnection: true, // 🔁 Auto-reconnect on disconnect
      reconnectionAttempts: 5, // 🔂 Try reconnecting up to 5 times
      reconnectionDelay: 2000, // ⏱ Delay between attempts (2 seconds)
      timeout: 10000, // ⏳ 10s timeout to establish connection
    });

    // 🔌 Connection established
    socket.on('connect', () => {
      console.log('✅ Connected to WebSocket server');
    });

    // ❌ Disconnected from server
    socket.on('disconnect', (reason) => {
      console.warn('⚠️ Disconnected from WebSocket:', reason);
    });

    // 🚫 Error during connection
    socket.on('connect_error', (err) => {
      console.error('❌ WebSocket connection error:', err.message);
    });

    // 🔄 Server triggered task update
    socket.on('task_update', () => {
      console.log('🔄 Received task_update from server');
      // 👉 Optionally trigger fetchTasks() or update UI here
    });
  }

  return socket;
};
