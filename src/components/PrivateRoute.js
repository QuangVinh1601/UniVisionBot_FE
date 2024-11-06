import React from 'react';
import { Navigate } from 'react-router-dom';
// import jwt_decode from 'jwt-decode';

// Kiểm tra vai trò của người dùng
function checkRole(role) {
  const token = localStorage.getItem('token');
  const storageRole = localStorage.getItem('role');
  if (token) {
    return storageRole === role;
  }
  return false;
}

export const PrivateRoute = ({ children, role }) => {
  if (!checkRole(role)) {
    return <Navigate to="/login" />;
  }
  return children;
};
