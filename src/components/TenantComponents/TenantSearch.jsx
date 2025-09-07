import React from 'react';
import { Search, Filter } from 'lucide-react';
import './TenantComponents.css';

const TenantSearch = ({ 
  searchTerm, 
  onSearchChange, 
  filterStatus, 
  onFilterChange
}) => {
  return (
    <div className="search-filter-section">
      <div className="search-box">
        <Search size={20} className="search-icon" />
        <input
          type="text"
          placeholder="Search tenants by name, email, or room..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="search-input"
        />
      </div>
      
      <div className="filter-controls">
        <div className="filter-select-wrapper">
          <Filter size={16} className="filter-icon" />
          <select
            value={filterStatus}
            onChange={(e) => onFilterChange(e.target.value)}
            className="filter-select"
          >
            <option value="all">All Tenants</option>
            <option value="active">Active</option>
            <option value="overdue">Overdue</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>
        
      </div>
    </div>
  );
};

export default TenantSearch;
