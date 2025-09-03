import React from 'react';
import { DollarSign, TrendingUp, AlertCircle, CheckCircle } from 'lucide-react';
import './PaymentSummary.css';

const PaymentSummary = ({ payments = [] }) => {
  const calculateStats = () => {
    if (!payments || !Array.isArray(payments)) {
      return { total: 0, paid: 0, pending: 0, overdue: 0 };
    }
    
    const total = payments.reduce((sum, payment) => sum + (payment.amount || 0), 0);
    const paid = payments.filter(p => p.status === 'paid').reduce((sum, p) => sum + (p.amount || 0), 0);
    const pending = payments.filter(p => p.status === 'pending').reduce((sum, p) => sum + (p.amount || 0), 0);
    const overdue = payments.filter(p => p.status === 'overdue').reduce((sum, p) => sum + (p.amount || 0), 0);
    
    return { total, paid, pending, overdue };
  };

  const stats = calculateStats();

  const summaryCards = [
    {
      icon: DollarSign,
      title: 'Total Revenue',
      value: `$${stats.total.toLocaleString()}`,
      variant: 'primary',
      change: '+12%',
      changeType: 'positive'
    },
    {
      icon: CheckCircle,
      title: 'Paid Amount',
      value: `$${stats.paid.toLocaleString()}`,
      variant: 'success',
      change: '+8%',
      changeType: 'positive'
    },
    {
      icon: AlertCircle,
      title: 'Pending',
      value: `$${stats.pending.toLocaleString()}`,
      variant: 'warning',
      change: '-3%',
      changeType: 'negative'
    },
    {
      icon: TrendingUp,
      title: 'Overdue',
      value: `$${stats.overdue.toLocaleString()}`,
      variant: 'error',
      change: '+5%',
      changeType: 'negative'
    }
  ];

  return (
    <div className="payment-summary">
      <div className="summary-grid">
        {summaryCards.map((card, index) => (
          <div key={index} className={`summary-card ${card.variant}`}>
            <div className="card-icon">
              <card.icon size={24} />
            </div>
            <div className="card-content">
              <h3 className="card-title">{card.title}</h3>
              <div className="card-value">{card.value}</div>
              <div className={`card-change ${card.changeType}`}>
                {card.change}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PaymentSummary;
