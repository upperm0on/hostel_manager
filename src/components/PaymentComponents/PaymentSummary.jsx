import React from 'react';
import { DollarSign, TrendingUp, AlertCircle, Clock } from 'lucide-react';
import './PaymentComponents.css';

const PaymentSummary = ({ summary }) => {
  const summaryCards = [
    {
      icon: DollarSign,
      label: 'Total Expected',
      value: `$${summary.totalExpected.toLocaleString()}`,
      color: 'primary'
    },
    {
      icon: TrendingUp,
      label: 'Total Paid',
      value: `$${summary.totalPaid.toLocaleString()}`,
      color: 'success'
    },
    {
      icon: Clock,
      label: 'Total Pending',
      value: `$${summary.totalPending.toLocaleString()}`,
      color: 'warning'
    },
    {
      icon: AlertCircle,
      label: 'Total Overdue',
      value: `$${summary.totalOverdue.toLocaleString()}`,
      color: 'error'
    }
  ];

  return (
    <div className="financial-summary">
      {summaryCards.map((card, index) => (
        <div key={index} className={`summary-card ${card.color}`}>
          <div className="summary-icon">
            <card.icon size={24} />
          </div>
          <div className="summary-content">
            <div className="summary-label">{card.label}</div>
            <div className="summary-value">{card.value}</div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default PaymentSummary;
