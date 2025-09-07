import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { HostelProvider, useHostel } from './contexts/HostelContext';
import Sidebar from './components/Sidebar/Sidebar';
import Dashboard from './pages/Dashboard/Dashboard';
import Tenants from './pages/Tenants/Tenants';
import Analytics from './pages/Analytics/Analytics';
import Settings from './pages/Settings/Settings';
import TenantProfile from './pages/Tenants/TenantProfile';
import NoHostelState from './components/NoHostelState/NoHostelState';
import LoginForms from './pages/Login/LoginForms';
import ProtectedRoute from './components/Auth/ProtectedRoute';

import './assets/css/theme.css';
import './assets/css/layout.css';

// Main app content component that uses the contexts
function AppContent() {
  const { hasHostel } = useHostel();
  const { isAuthenticated } = useAuth();

  // If not authenticated, show login page
  if (!isAuthenticated) {
    return (
      <div className="auth-container-modern">
        <div className="auth-background-modern">
          <div className="auth-pattern-modern"></div>
          <div className="auth-gradient-modern"></div>
        </div>
        <div className="auth-content-modern">
          <Routes>
            <Route path="/login" element={<LoginForms />} />
            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
        </div>
      </div>
    );
  }

  // If authenticated, show the main app
  return (
    <div className="app-modern">
      <div className="app-background-modern">
        <div className="app-pattern-modern"></div>
        <div className="app-gradient-modern"></div>
      </div>
      <Sidebar />
      <div className="main-content-modern">
        <div className="content-container-modern">
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
            <Route path="/analytics" element={
              !hasHostel ? <NoHostelState /> : <Analytics />
            } />
            <Route path="/settings" element={<Settings />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </div>
    </div>
  );
}

// Main App component with context providers
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
