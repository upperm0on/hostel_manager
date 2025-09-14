import React, { useState, useEffect } from 'react';
import { AlertTriangle, X, CreditCard } from 'lucide-react';
import './BankingAlert.css';

const BankingAlert = ({ onDismiss, onComplete }) => {
  const [isVisible, setIsVisible] = useState(true);
  const [bankingComplete, setBankingComplete] = useState(false);

  useEffect(() => {
    // Check if banking details are complete in localStorage
    const checkBankingStatus = () => {
      try {
        const bankingData = localStorage.getItem('bankingDetails');
        if (bankingData) {
          const parsed = JSON.parse(bankingData);
          // Check if essential banking fields are filled
          const hasBankName = parsed.bankName && parsed.bankName.trim() !== '';
          const hasAccountNumber = parsed.accountNumber && parsed.accountNumber.trim() !== '';
          const hasAccountName = parsed.accountName && parsed.accountName.trim() !== '';
          
          setBankingComplete(hasBankName && hasAccountNumber && hasAccountName);
        } else {
          setBankingComplete(false);
        }
      } catch (error) {
        console.error('Error checking banking status:', error);
        setBankingComplete(false);
      }
    };

    checkBankingStatus();
    
    // Listen for storage changes to update status
    const handleStorageChange = () => {
      checkBankingStatus();
    };

    window.addEventListener('storage', handleStorageChange);
    
    // Also check periodically in case of same-tab updates
    const interval = setInterval(checkBankingStatus, 2000);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      clearInterval(interval);
    };
  }, []);

  const handleDismiss = () => {
    setIsVisible(false);
    if (onDismiss) onDismiss();
  };

  const handleComplete = () => {
    if (onComplete) onComplete();
  };

  // Don't show alert if banking is complete
  if (bankingComplete || !isVisible) {
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
