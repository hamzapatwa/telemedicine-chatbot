// src/App.js
import ProtectedRoute from './ProtectedRoute';
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import LandingPage from './LandingPage';
import SignUp from './SignUp';
import Login from './Login';
import UserDashboard from './UserDashboard';
import DoctorDashboard from './DoctorDashboard';
import SymptomSelector from './SymptomSelector';
import Chatbot from './Chatbot';
import UserChat from './UserChat';
import DoctorChat from './DoctorChat';

function App() {
  return (
    <div>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/login" element={<Login />} />

        {/* User Routes */}
        <Route path="/user/dashboard" element={<UserDashboard />} />
        <Route path="/symptoms" element={<SymptomSelector />} />
        <Route path="/chatbot" element={<Chatbot />} />
        <Route path="/user/chat/:messageId" element={<UserChat />} />

        {/* Doctor Routes */}
        <Route path="/doctor/dashboard" element={<DoctorDashboard />} />
        <Route path="/doctor/chat/:messageId" element={<DoctorChat />} />
      </Routes>
    </div>
  );
}

export default App;
