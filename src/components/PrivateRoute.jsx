// src/components/PrivateRoute.jsx
import React from 'react';
import PropTypes from 'prop-types';
import { Navigate } from 'react-router-dom';

/**
 * Wrap protected routes so only authenticated users can see them.
 * user === undefined  → auth check still loading (render nothing / spinner).
 * user === null       → not logged in (redirect to /profile).
 * user is truthy      → render children.
 */
const PrivateRoute = ({ user, children }) => {
  if (user === undefined) {
    return null; // or a loader while checking auth
  }
  if (!user) {
    return <Navigate to="/profile" replace />;
  }
  return children;
};

PrivateRoute.propTypes = {
  user: PropTypes.object,
  children: PropTypes.node.isRequired,
};

export default PrivateRoute;
