// src/AppRoutes.jsx
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Login from '../Components/Login/Login.jsx';
import Otp from '../Components/Otp/Otp.jsx';
import Registration from '../Components/Registration/Registration.jsx';
import TeamLogin from '../Pages/TeamLogin.jsx';
import ApplicationForm from '../Components/ApplicationForm/ApplicationForm.jsx';
import ApplicationNew from '../Pages/Application-New.jsx';
import ApplicationPending from '../Pages/ApplicationPending.jsx';
import ProtectedRoute from '../Components/ProtectedRoute/ProtectedRoute.jsx';

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/" element={<Login />} />
      <Route path="/otp" element={<Otp />} />
      <Route path="/registration" element={<Registration />} />
      <Route path="/TeamLogin" element={<TeamLogin />} />
      <Route path="/ApplicationForm" element={<ApplicationForm />} />
      
      {/* Protected routes */}
      <Route 
        path="/ApplicationNew" 
        element={
          <ProtectedRoute allowedRoles={['EXECUTIVE', 'MANAGER']}>
            <ApplicationNew />
          </ProtectedRoute>
        } 
      />
      
     <Route 
  path="/ApplicationNew" 
  element={
    <ProtectedRoute allowedRoles={['EXECUTIVE', 'MANAGER']}>
      <ApplicationNew />
    </ProtectedRoute>
  } 
/>
    </Routes>
  );
};

export default AppRoutes;