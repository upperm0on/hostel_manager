import React from 'react';
import { useHostel } from '../../contexts/HostelContext';
import { useNavigate } from 'react-router-dom';
import { Home, Plus } from 'lucide-react';
import {
  DashboardHeader,
  DashboardGrid,
  RecentActivities,
  UpcomingEvents,
  MaintenanceAlerts,
  RecentTenants,
  DashboardAnalytics,
  DashboardCharts
} from '../../components/Dashboard';
import BankingAlert from '../../components/Common/BankingAlert';
import './Dashboard.css';

const Dashboard = () => {
  const { hasHostel, hostelInfo } = useHostel();
  const navigate = useNavigate();

  // No more mock data - using real data from context and API calls

  const handleSetupHostel = () => {
    navigate('/settings');
  };

  const handleCompleteBanking = () => {
    navigate('/settings?tab=banking');
  };

  // If no hostel exists, show setup message
  if (!hasHostel) {
    return (
      <div className="dashboard">
        <DashboardHeader hostelInfo={null} />
        
        <div className="no-hostel-dashboard">
          <div className="no-hostel-content">
            <Home size={64} className="no-hostel-icon" />
            <h2>Dashboard Not Available</h2>
            <p>You need to set up your hostel first to access the dashboard and view your hostel's performance metrics.</p>
            <div className="dashboard-actions">
              <button onClick={handleSetupHostel} className="btn btn-primary">
                <Plus size={20} />
                Set Up Hostel
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard">
      <BankingAlert onComplete={handleCompleteBanking} />
      <DashboardHeader hostelInfo={hostelInfo} />

      {/* Dashboard Analytics Component (includes StatsGrid) */}
      <DashboardAnalytics hostelInfo={hostelInfo} />

      {/* Dashboard Charts Component */}
      <DashboardCharts hostelInfo={hostelInfo} />

      <DashboardGrid columns={2}>
        <div className="dashboard-left">
          <RecentActivities />
          <UpcomingEvents />
        </div>
        
        <div className="dashboard-right">
          <MaintenanceAlerts />
          <RecentTenants />
        </div>
      </DashboardGrid>
    </div>
  );
};

export default Dashboard;
