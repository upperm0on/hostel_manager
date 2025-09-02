import React from 'react';
import { AlertTriangle, ArrowRight } from 'lucide-react';
import './DashboardComponents.css';

const MaintenanceAlerts = ({ alerts }) => {
  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high':
        return 'priority-high';
      case 'medium':
        return 'priority-medium';
      case 'low':
        return 'priority-low';
      default:
        return 'priority-medium';
    }
  };

  const getPriorityIcon = (priority) => {
    switch (priority) {
      case 'high':
        return '🔴';
      case 'medium':
        return '🟡';
      case 'low':
        return '🟢';
      default:
        return '⚪';
    }
  };

  return (
    <div className="dashboard-section">
      <div className="section-header">
        <h3 className="section-title">Maintenance Alerts</h3>
        <button className="section-action">
          View All
          <ArrowRight size={16} />
        </button>
      </div>
      
      <div className="alerts-list">
        {alerts.map((alert) => (
          <div key={alert.id} className={`alert-item ${getPriorityColor(alert.priority)}`}>
            <div className="alert-priority">
              {getPriorityIcon(alert.priority)}
            </div>
            <div className="alert-content">
              <div className="alert-issue">{alert.issue}</div>
              <div className="alert-room">{alert.room}</div>
            </div>
            <div className="alert-priority-label">
              {alert.priority.charAt(0).toUpperCase() + alert.priority.slice(1)}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MaintenanceAlerts;
