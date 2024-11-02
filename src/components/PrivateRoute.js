import React from 'react';
import { Navigate } from 'react-router-dom';
import jwt_decode from 'jwt-decode';

// Kiểm tra vai trò của người dùng
function checkRole(role) {
  const token = localStorage.getItem('token');
  if (token) {
    const jwttoken = require('jwt-decode');
    const decodedToken = jwttoken(token);
    return decodedToken.role === role;
  }
  return false;
}

export const PrivateRoute = ({ children, role }) => {
  if (!checkRole(role)) {
    return <Navigate to="/login" />;
  }
  return children;
};
