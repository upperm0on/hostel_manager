import React from 'react';
import { Clock, UserPlus, CreditCard, Wrench, UserMinus, ArrowRight } from 'lucide-react';
import './DashboardComponents.css';

const RecentActivities = ({ activities }) => {
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
