// src/App.jsx
import React from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate
} from 'react-router-dom';

import LoginPage from './pages/LoginPage';
import AgentDashboardPage from './pages/agent/DashboardPage';
import AgentStudentPage from './pages/agent/StudentPage';
import ReviewDashboardPage from './pages/review/DashboardPage';

import ReviewStudentPage from './pages/review/StudentProfilePage';
export default function App() {
  return (
    <Router>
      <Routes>
        {/* Public */}
        <Route path="/" element={<LoginPage />} />

        {/* Agent routes */}
        <Route path="/agent/dashboard" element={<AgentDashboardPage />} />
        <Route path="/agent/student/:id"   element={<AgentStudentPage />}   />

        {/* Review Team routes */}
        <Route path="/review/dashboard" element={<ReviewDashboardPage />} />
        <Route path="/review/student/:id" element={<ReviewStudentPage />} />
        {/* Catch-all: redirect to login */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}
