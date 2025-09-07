import React from 'react';
import { Building, Bell, User } from 'lucide-react';
import './DashboardHeader.css';

const DashboardHeader = ({ hostelInfo }) => {
  return (
    <div className="dashboard-header">
      <div className="header-content">
        <div className="header-left">
          <div className="hostel-info">
            <Building size={24} className="hostel-icon" />
            <div>
              <h1 className="hostel-name">
                {hostelInfo?.name || 'Hostel Manager'}
              </h1>
              <p className="hostel-location">
                {hostelInfo?.campus?.campus || 'Location not set'}
              </p>
            </div>
          </div>
        </div>
        
        <div className="header-right">
          <button className="header-action">
            <Bell size={20} />
          </button>
          <button className="header-action">
            <User size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default DashboardHeader;
