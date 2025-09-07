import React from 'react';
import { Edit, X, RefreshCw } from 'lucide-react';
import './SettingsHeader.css';

const SettingsHeader = ({ 
  title, 
  subtitle, 
  showActions = false, 
  onEdit, 
  onDelete,
  onRefresh,
  isRefreshing = false
}) => {
  return (
    <div className="page-header">
      <div className="page-header-content">
        <div>
          <h1 className="page-title">{title}</h1>
          <p className="page-subtitle">{subtitle}</p>
        </div>
        {showActions && (
          <div className="settings-actions">
            <button
              type="button"
              className="btn btn-outline"
              onClick={onRefresh}
              disabled={isRefreshing}
              title="Refresh data from server"
            >
              <RefreshCw size={20} className={isRefreshing ? 'animate-spin' : ''} />
              {isRefreshing ? 'Refreshing...' : 'Refresh'}
            </button>
            <button
              type="button"
              className="btn btn-outline"
              onClick={onEdit}
            >
              <Edit size={20} />
              Edit Hostel Info
            </button>
            <button
              type="button"
              className="btn btn-error"
              onClick={onDelete}
            >
              <X size={20} />
              Delete Hostel
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default SettingsHeader;
