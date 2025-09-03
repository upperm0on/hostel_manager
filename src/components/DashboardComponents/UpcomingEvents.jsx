import React from 'react';
import { Calendar, ArrowRight } from 'lucide-react';
import './DashboardComponents.css';

const UpcomingEvents = ({ events }) => {
  const getEventIcon = (type) => {
    switch (type) {
      case 'payment':
        return '💰';
      case 'maintenance':
        return '🔧';
      case 'checkin':
        return '👤';
      default:
        return '📅';
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric' 
    });
  };

  return (
    <div className="dashboard-section">
      <div className="section-header">
        <h3 className="section-title">Upcoming Events</h3>
        <button 
          className="section-action"
          onClick={() => {
            // Show calendar view or navigate to events page
            const today = new Date();
            const events = [
              { date: '2024-01-15', title: 'Monthly Rent Due' },
              { date: '2024-01-18', title: 'Maintenance Inspection' },
              { date: '2024-01-20', title: 'New Tenant Check-in' }
            ];
            alert(`Upcoming Events:\n${events.map(e => `${e.date}: ${e.title}`).join('\n')}`);
          }}
        >
          View Calendar
          <ArrowRight size={16} />
        </button>
      </div>
      
      <div className="events-list">
        {events.map((event) => (
          <div key={event.id} className="event-item">
            <div className="event-icon">
              {getEventIcon(event.type)}
            </div>
            <div className="event-content">
              <div className="event-title">{event.title}</div>
              <div className="event-date">{formatDate(event.date)}</div>
            </div>
            <div className="event-type">{event.type}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UpcomingEvents;
