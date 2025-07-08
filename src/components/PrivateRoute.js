// src/components/PrivateRoute.js
import React from 'react';
import PropTypes from 'prop-types';
import { Navigate } from 'react-router-dom';

const PrivateRoute = ({ user, children }) => {
  if (user === undefined) {
    // Optionally show a loading spinner or nothing while auth is being checked
    return null;
  }
  if (!user) {
    return <Navigate to="/profile" replace />;
  }
  return children;
};

// ✅ PropTypes validation
PrivateRoute.propTypes = {
  user: PropTypes.object,
  children: PropTypes.node.isRequired,
};

export default PrivateRoute;
