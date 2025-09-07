import React, { useState, useEffect } from 'react';
import { Clock, UserPlus, CreditCard, Wrench, UserMinus, ArrowRight } from 'lucide-react';
import './DashboardComponents.css';

const RecentActivities = () => {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch tenants data for recent activities
  useEffect(() => {
    const fetchTenants = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('token');
        
        if (!token) {
          console.log('No authentication token found');
          return;
        }

        const response = await fetch('http://localhost:8080/hq/api/manager/tenants', {
          method: 'GET',
          headers: {
            'Authorization': `Token ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error(`Failed to fetch tenants: ${response.status}`);
        }

        const data = await response.json();
        
        if (data.status === 'success' && data.tenants) {
          // Transform tenant data into recent activities
          const recentActivities = data.tenants
            .sort((a, b) => new Date(b.date_created) - new Date(a.date_created))
            .slice(0, 5) // Show only 5 most recent
            .map((tenant, index) => ({
              id: tenant.id,
              type: 'checkin',
              tenant: tenant.user?.username || 'Unknown',
              amount: tenant.amount,
              time: getTimeAgo(new Date(tenant.date_created)),
              date: tenant.date_created
            }));
          
          setActivities(recentActivities);
        }
        
      } catch (err) {
        console.error('Error fetching tenants for activities:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchTenants();
  }, []);

  // Helper function to calculate time ago
  const getTimeAgo = (date) => {
    const now = new Date();
    const diffInSeconds = Math.floor((now - date) / 1000);
    
    if (diffInSeconds < 60) return 'Just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
    if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 86400)} days ago`;
    return `${Math.floor(diffInSeconds / 2592000)} months ago`;
  };
  const getActivityIcon = (type) => {
    switch (type) {
      case 'checkin':
        return <UserPlus size={16} />;
      case 'payment':
        return <CreditCard size={16} />;
      case 'maintenance':
        return <Wrench size={16} />;
      case 'checkout':
        return <UserMinus size={16} />;
      default:
        return <Clock size={16} />;
    }
  };

  const getActivityText = (activity) => {
    switch (activity.type) {
      case 'checkin':
        return `${activity.tenant} checked in`;
      case 'payment':
        return `${activity.tenant} made a payment of $${activity.amount}`;
      case 'maintenance':
        return `Maintenance: ${activity.issue}`;
      case 'checkout':
        return `${activity.tenant} checked out`;
      default:
        return 'Activity recorded';
    }
  };

  return (
    <div className="dashboard-section">
      <div className="section-header">
        <h3 className="section-title">Recent Activities</h3>
        <button 
          className="section-action"
          onClick={() => window.location.href = '/tenants'}
        >
          View All
          <ArrowRight size={16} />
        </button>
      </div>
      
      <div className="activities-list">
        {activities.map((activity) => (
          <div key={activity.id} className="activity-item">
            <div className="activity-icon">
              {getActivityIcon(activity.type)}
            </div>
            <div className="activity-content">
              <div className="activity-text">
                {getActivityText(activity)}
              </div>
              <div className="activity-time">{activity.time}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecentActivities;
