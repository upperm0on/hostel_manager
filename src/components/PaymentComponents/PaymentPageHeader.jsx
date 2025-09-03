import React from 'react';
import { Plus, Download, Filter } from 'lucide-react';
import './PaymentPageHeader.css';

const PaymentPageHeader = ({ 
  title, 
  subtitle, 
  onAddPayment, 
  onExportReport,
  onShowFilters 
}) => {
  return (
    <div className="payment-page-header">
      <div className="header-content">
        <div className="header-left">
          <h1 className="page-title">{title}</h1>
          <p className="page-subtitle">{subtitle}</p>
        </div>
        
        <div className="header-right">
          <button
            className="btn btn-outline"
            onClick={onShowFilters}
          >
            <Filter size={20} />
            Filters
          </button>
          
          <button
            className="btn btn-outline"
            onClick={onExportReport}
          >
            <Download size={20} />
            Export
          </button>
          
          <button
            className="btn btn-primary"
            onClick={onAddPayment}
          >
            <Plus size={20} />
            Record Payment
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentPageHeader;
