// src/components/Sidebar.jsx
import React from 'react';
import { Link } from 'react-router-dom';

/**
 * 📚 Sidebar – simple vertical nav
 * • Uses Tailwind for styling
 * • Change/extend links as needed
 */
const Sidebar = () => (
  <aside className="w-64 h-full bg-gray-800 text-white p-4 space-y-4">
    <h2 className="text-xl font-semibold">Navigation</h2>

    <nav className="flex flex-col space-y-2">
      <Link to="/" className="hover:text-yellow-400">
        🏠 Home
      </Link>

      <Link to="/calendar-view" className="hover:text-yellow-400">
        📅 Calendar View
      </Link>

      <Link to="/profile-tab" className="hover:text-yellow-400">
        👤 Profile
      </Link>

      <Link to="/predict" className="hover:text-yellow-400">
        🤖 Predict
      </Link>
    </nav>
  </aside>
);

export default Sidebar;
