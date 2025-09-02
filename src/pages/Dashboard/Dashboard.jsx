import React from 'react';
import { useHostel } from '../../contexts/HostelContext';
import { useNavigate } from 'react-router-dom';
import { Home, Plus } from 'lucide-react';
import {
  DashboardStats,
  RecentActivities,
  UpcomingEvents,
  MaintenanceAlerts,
  TopPerformers
} from '../../components/DashboardComponents';
import './Dashboard.css';

const Dashboard = () => {
  const { hasHostel, hostelInfo } = useHostel();
  const navigate = useNavigate();

  // Mock data for demonstration
  const mockData = {
    totalTenants: 45,
    occupancyRate: 87,
    monthlyRevenue: 12500,
    pendingPayments: 8,
    recentActivities: [
      { id: 1, type: 'checkin', tenant: 'John Doe', time: '2 hours ago', icon: 'user-plus' },
      { id: 2, type: 'payment', tenant: 'Jane Smith', amount: 500, time: '4 hours ago', icon: 'credit-card' },
      { id: 3, type: 'maintenance', issue: 'Water heater repair', time: '6 hours ago', icon: 'wrench' },
      { id: 4, type: 'checkout', tenant: 'Mike Johnson', time: '1 day ago', icon: 'user-minus' }
    ],
    upcomingEvents: [
      { id: 1, title: 'Monthly Rent Due', date: '2024-01-15', type: 'payment' },
      { id: 2, title: 'Maintenance Inspection', date: '2024-01-18', type: 'maintenance' },
      { id: 3, title: 'New Tenant Check-in', date: '2024-01-20', type: 'checkin' }
    ],
    maintenanceAlerts: [
      { id: 1, issue: 'Water heater needs repair', priority: 'high', room: 'Room 15' },
      { id: 2, issue: 'Light bulb replacement', priority: 'medium', room: 'Common Area' },
      { id: 3, issue: 'Window lock broken', priority: 'low', room: 'Room 8' }
    ],
    topPerformers: [
      { id: 1, name: 'Sarah Wilson', room: 'Room 12', rating: 4.9, payments: 'On time' },
      { id: 2, name: 'David Brown', room: 'Room 7', rating: 4.8, payments: 'Early' },
      { id: 3, name: 'Lisa Garcia', room: 'Room 21', rating: 4.7, payments: 'On time' }
    ]
  };

  const handleSetupHostel = () => {
    navigate('/settings');
  };

  // If no hostel exists, show setup message
  if (!hasHostel) {
    return (
      <div className="dashboard">
        <div className="dashboard-header">
          <div className="header-content">
            <h1>Dashboard</h1>
            <p>Welcome to your hostel management dashboard</p>
          </div>
        </div>
        
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
      {/* Dashboard Header */}
      <div className="dashboard-header">
        <div className="header-content">
          <h1>Dashboard</h1>
          <p>Welcome back! Here's what's happening at {hostelInfo?.hostelDetails?.name || 'your hostel'}</p>
        </div>
      </div>

      {/* Dashboard Stats Component */}
      <DashboardStats stats={mockData} />

      {/* Dashboard Content Grid */}
      <div className="dashboard-content">
        <div className="dashboard-left">
          {/* Recent Activities Component */}
          <RecentActivities activities={mockData.recentActivities} />
          
          {/* Upcoming Events Component */}
          <UpcomingEvents events={mockData.upcomingEvents} />
        </div>
        
        <div className="dashboard-right">
          {/* Maintenance Alerts Component */}
          <MaintenanceAlerts alerts={mockData.maintenanceAlerts} />
          
          {/* Top Performers Component */}
          <TopPerformers performers={mockData.topPerformers} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
