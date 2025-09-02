import React from 'react';
import { Star, Award, ArrowRight } from 'lucide-react';
import './DashboardComponents.css';

const TopPerformers = ({ performers }) => {
  const getPaymentStatusColor = (status) => {
    switch (status) {
      case 'Early':
        return 'status-early';
      case 'On time':
        return 'status-ontime';
      case 'Late':
        return 'status-late';
      default:
        return 'status-ontime';
    }
  };

  return (
    <div className="dashboard-section">
      <div className="section-header">
        <h3 className="section-title">Top Performers</h3>
        <button className="section-action">
          View All
          <ArrowRight size={16} />
        </button>
      </div>
      
      <div className="performers-list">
        {performers.map((performer, index) => (
          <div key={performer.id} className="performer-item">
            <div className="performer-rank">
              {index === 0 && <Award size={16} className="rank-icon" />}
              <span className="rank-number">{index + 1}</span>
            </div>
            <div className="performer-info">
              <div className="performer-name">{performer.name}</div>
              <div className="performer-room">{performer.room}</div>
            </div>
            <div className="performer-rating">
              <Star size={14} className="star-icon" />
              <span>{performer.rating}</span>
            </div>
            <div className={`performer-payment ${getPaymentStatusColor(performer.payments)}`}>
              {performer.payments}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TopPerformers;
