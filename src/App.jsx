import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { HostelProvider, useHostel } from './contexts/HostelContext';
import Sidebar from './components/Sidebar/Sidebar';
import Header from './components/Header/Header';
import Dashboard from './pages/Dashboard/Dashboard';
import Tenants from './pages/Tenants/Tenants';
import Payments from './pages/Payments/Payments';
import Settings from './pages/Settings/Settings';
import TenantProfile from './pages/Tenants/TenantProfile';
import NoHostelState from './components/NoHostelState/NoHostelState';

import './assets/css/theme.css';
import './assets/css/layout.css';

// Main app content component
function AppContent() {
  const { hasHostel } = useHostel();

  return (
    <div className="app">
      <Sidebar />
      <div className="main-content">
        <Header />
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
          </Routes>
        </div>
      </div>
    </div>
  );
}

// Main App component with context provider
function App() {
  return (
    <HostelProvider>
      <Router>
        <AppContent />
      </Router>
    </HostelProvider>
  );
}

export default App;
