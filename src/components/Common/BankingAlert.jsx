import React, { useState } from 'react';
import { AlertTriangle, X, CreditCard } from 'lucide-react';
import { useBanking } from '../../contexts/BankingContext';
import './BankingAlert.css';

const BankingAlert = ({ onDismiss, onComplete }) => {
  const [isVisible, setIsVisible] = useState(true);
  const { hasBankingInfo, isChecking } = useBanking();

  const handleDismiss = () => {
    setIsVisible(false);
    if (onDismiss) onDismiss();
  };

  const handleComplete = () => {
    if (onComplete) onComplete();
  };

  // Don't show alert if banking is complete or still checking
  if (hasBankingInfo || !isVisible || isChecking) {
    return null;
  }

  return (
    <div className="banking-alert">
      <div className="banking-alert-content">
        <div className="banking-alert-icon">
          <AlertTriangle size={20} />
        </div>
        <div className="banking-alert-text">
          <h4 className="banking-alert-title">Banking Information Required</h4>
          <p className="banking-alert-message">
            Complete your banking details to receive payments from tenants. 
            This information is required for your hostel to be fully operational.
          </p>
        </div>
        <div className="banking-alert-actions">
          <button
            type="button"
            className="banking-alert-btn banking-alert-btn-primary"
            onClick={handleComplete}
          >
            <CreditCard size={16} />
            Complete Banking Details
          </button>
          <button
            type="button"
            className="banking-alert-btn banking-alert-btn-dismiss"
            onClick={handleDismiss}
          >
            <X size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default BankingAlert;
