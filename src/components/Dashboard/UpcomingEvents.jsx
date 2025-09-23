import React, { useState, useEffect } from 'react';
import { Calendar, ArrowRight } from 'lucide-react';
import ConfirmationModal from '../Common/ConfirmationModal';
import './DashboardComponents.css';

const UpcomingEvents = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalState, setModalState] = useState({
    isOpen: false,
    title: '',
    message: '',
    type: 'info',
    showCancel: false,
    showConfirm: true,
    confirmText: 'Close',
    onConfirm: null,
  });

  // Generate upcoming events based on real data
  useEffect(() => {
    const generateUpcomingEvents = () => {
      const today = new Date();
      const upcomingEvents = [];

      // Add monthly rent due date (1st of next month)
      const nextMonth = new Date(today.getFullYear(), today.getMonth() + 1, 1);
      upcomingEvents.push({
        id: 1,
        title: 'Monthly Rent Due',
        date: nextMonth.toISOString().split('T')[0],
        type: 'payment'
      });

      setEvents(upcomingEvents);
    };

    generateUpcomingEvents();
  }, []);
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
      <ConfirmationModal
        isOpen={modalState.isOpen}
        onClose={() => setModalState((s) => ({ ...s, isOpen: false }))}
        onConfirm={() => setModalState((s) => ({ ...s, isOpen: false }))}
        title={modalState.title}
        message={modalState.message}
        type={modalState.type}
        isLoading={false}
        showCancel={modalState.showCancel}
        showConfirm={modalState.showConfirm}
        confirmText={modalState.confirmText}
      />
      <div className="section-header">
        <h3 className="section-title">Upcoming Events</h3>
        <button 
          className="section-action"
          onClick={() => {
            // Show calendar view or navigate to events page
            const eventList = events.map(e => `${e.date}: ${e.title}`).join('\n');
            setModalState({
              isOpen: true,
              title: 'Upcoming Events',
              message: eventList || 'No events scheduled',
              type: 'info',
              showCancel: false,
              showConfirm: true,
              confirmText: 'Close',
              onConfirm: () => setModalState((s) => ({ ...s, isOpen: false })),
            });
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
