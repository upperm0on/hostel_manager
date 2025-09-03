import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { HostelProvider, useHostel } from './contexts/HostelContext';
import Sidebar from './components/Sidebar/Sidebar';
import Dashboard from './pages/Dashboard/Dashboard';
import Tenants from './pages/Tenants/Tenants';
import Payments from './pages/Payments/Payments';
import Settings from './pages/Settings/Settings';
import TenantProfile from './pages/Tenants/TenantProfile';
import NoHostelState from './components/NoHostelState/NoHostelState';
import LoginForms from './pages/Login/LoginForms';
import ProtectedRoute from './components/Auth/ProtectedRoute';

import './assets/css/theme.css';
import './assets/css/layout.css';

// Main app content component
function AppContent() {
  const { hasHostel } = useHostel();
  const { isAuthenticated } = useAuth();

  // If not authenticated, show login page
  if (!isAuthenticated) {
    return (
      <div className="auth-container">
        <Routes>
          <Route path="/login" element={<LoginForms />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </div>
    );
  }

  // If authenticated, show the main app
  return (
    <div className="app">
      <Sidebar />
      <div className="main-content">
        <div className="content-container">
          <Routes>
            <Route path="/" element={
              !hasHostel ? <NoHostelState /> : <Dashboard />
            } />
            <Route path="/tenants" element={
              !hasHostel ? <NoHostelState /> : <Tenants />
            } />
            <Route path="/tenants/:id" element={
              !hasHostel ? <NoHostelState /> : <TenantProfile />
            } />
            <Route path="/payments" element={
              !hasHostel ? <NoHostelState /> : <Payments />
            } />
            <Route path="/settings" element={<Settings />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </div>
    </div>
  );
}

// Main App component with context provider
function App() {
  return (
    <AuthProvider>
      <HostelProvider>
        <Router>
          <AppContent />
        </Router>
      </HostelProvider>
    </AuthProvider>
  );
}

export default App;
