import React from 'react';
import { Filter, Download, Plus } from 'lucide-react';
import './PaymentComponents.css';

const PaymentFilters = ({ 
  filterStatus, 
  onFilterChange, 
  onExportReport, 
  onRecordPayment 
}) => {
  return (
    <div className="filter-section">
      <div className="filter-controls">
        <div className="filter-select-wrapper">
          <Filter size={16} className="filter-icon" />
          <select
            value={filterStatus}
            onChange={(e) => onFilterChange(e.target.value)}
            className="filter-select"
          >
            <option value="all">All Payments</option>
            <option value="paid">Paid</option>
            <option value="pending">Pending</option>
            <option value="overdue">Overdue</option>
          </select>
        </div>
      </div>
      
      <div className="page-actions">
        <button className="btn btn-outline" onClick={onExportReport}>
          <Download size={20} />
          Export Report
        </button>
        <button className="btn btn-primary" onClick={onRecordPayment}>
          <Plus size={20} />
          Record Payment
        </button>
      </div>
    </div>
  );
};

export default PaymentFilters;
