import React from 'react';
import { Plus, Search } from 'lucide-react';
import './TenantPageHeader.css';

const TenantPageHeader = ({ 
  title, 
  subtitle, 
  searchQuery, 
  onSearchChange, 
  onAddTenant 
}) => {
  return (
    <div className="tenant-page-header">
      <div className="header-content">
        <div className="header-left">
          <h1 className="page-title">{title}</h1>
          <p className="page-subtitle">{subtitle}</p>
        </div>
        
        <div className="header-right">
          <div className="search-container">
            <Search size={20} className="search-icon" />
            <input
              type="text"
              placeholder="Search tenants..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="search-input"
            />
          </div>
          
          <button
            className="btn btn-primary"
            onClick={onAddTenant}
          >
            <Plus size={20} />
            Add Tenant
          </button>
        </div>
      </div>
    </div>
  );
};

export default TenantPageHeader;
