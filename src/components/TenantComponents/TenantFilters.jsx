import React from 'react';
import { Filter } from 'lucide-react';
import './TenantFilters.css';

const TenantFilters = ({ 
  statusFilter, 
  onStatusFilterChange,
  totalTenants,
  filteredCount 
}) => {
  const statusOptions = [
    { value: 'all', label: 'All Tenants', count: totalTenants },
    { value: 'active', label: 'Active', count: 0 },
    { value: 'overdue', label: 'Overdue', count: 0 },
    { value: 'inactive', label: 'Inactive', count: 0 }
  ];

  return (
    <div className="tenant-filters">
      <div className="filters-header">
        <div className="filters-title">
          <Filter size={20} />
          <span>Filters</span>
        </div>
        <div className="results-count">
          Showing {filteredCount} of {totalTenants} tenants
        </div>
      </div>
      
      <div className="filter-options">
        {statusOptions.map(({ value, label, count }) => (
          <button
            key={value}
            className={`filter-option ${statusFilter === value ? 'active' : ''}`}
            onClick={() => onStatusFilterChange(value)}
          >
            <span className="filter-label">{label}</span>
            <span className="filter-count">{count}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default TenantFilters;
