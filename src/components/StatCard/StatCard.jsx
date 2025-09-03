import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';
import './StatCard.css';

const StatCard = ({ 
  icon: Icon, 
  title, 
  value, 
  change, 
  changeType = 'neutral',
  variant = 'primary' 
}) => {
  return (
    <div className={`stat-card ${variant}`}>
      <div className={`stat-card-icon ${variant}`}>
        <Icon size={24} />
      </div>
      
      <div className="stat-card-content">
        <div className="stat-card-number">{value}</div>
        <div className="stat-card-label">{title}</div>
        
        {change && (
          <div className={`stat-card-change ${changeType}`}>
            {changeType === 'positive' && <TrendingUp className="stat-card-change-icon" />}
            {changeType === 'negative' && <TrendingDown className="stat-card-change-icon" />}
            <span>{change}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default StatCard;
