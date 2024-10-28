import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ isAllowed, children }) => {
   console.log('Is Allowed:', isAllowed); 
  return isAllowed ? children : <Navigate to="/login" />; 
  
};

export default ProtectedRoute;