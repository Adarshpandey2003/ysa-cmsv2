// src/App.jsx
import React from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate
} from 'react-router-dom';

import LoginPage from './pages/LoginPage';

// Agent pages
import AgentDashboardPage from './pages/agent/DashboardPage';
import AgentStudentProfilePage   from './pages/agent/StudentPage';

// Review-team pages
import ReviewDashboardPage    from './pages/review/DashboardPage';
import ReviewStudentPage      from './pages/review/StudentProfilePage';

// Admin pages
import AdminLogin               from './pages/admin/login';
import AgentAdminDashboardPage      from './pages/admin/agent/dashboard';
import AgentAdminApplicationsPage   from './pages/admin/agent/applications';
import AgentAdminAgentsPage         from './pages/admin/agent/agents';

export default function App() {
  return (
    <Router>
      <Routes>
        {/* Public */}
        <Route path="/"                  element={<LoginPage />} />
        <Route path="/admin/login"       element={<AdminLogin />} />

        {/* Agent routes */}
        <Route path="/agent/dashboard"   element={<AgentDashboardPage />} />
        <Route path="/agent/student/:id" element={<AgentStudentProfilePage />}   />

        {/* Review-team routes */}
        <Route path="/review/dashboard"  element={<ReviewDashboardPage />} />
        <Route path="/review/student/:id" element={<ReviewStudentPage />}  />

        {/* Agent-Admin routes */}
        <Route
          path="/admin/agent/dashboard"
          element={<AgentAdminDashboardPage />}
        />
        <Route
          path="/admin/agent/applications"
          element={<AgentAdminApplicationsPage />}
        />
        <Route
          path="/admin/agent/agents/:id"
          element={<AgentAdminAgentsPage />}
        />

        {/* Catch-all: redirect to login */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}
