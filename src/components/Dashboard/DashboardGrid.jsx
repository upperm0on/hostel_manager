import React from 'react';
import './DashboardGrid.css';

const DashboardGrid = ({ children, columns = 2 }) => {
  return (
    <div className={`dashboard-grid dashboard-grid-${columns}`}>
      {children}
    </div>
  );
};

export default DashboardGrid;
