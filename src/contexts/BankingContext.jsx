import React, { createContext, useContext, useState, useEffect } from 'react';

const BankingContext = createContext();

export const useBanking = () => {
  const context = useContext(BankingContext);
  if (!context) {
    throw new Error('useBanking must be used within a BankingProvider');
  }
  return context;
};

export const BankingProvider = ({ children }) => {
  const [hasBankingInfo, setHasBankingInfo] = useState(false);
  const [isChecking, setIsChecking] = useState(true);

  // Check banking status in localStorage
  const checkBankingStatus = () => {
    try {
      const userAccountName = localStorage.getItem('userAccountName');
      const userBankingDetails = localStorage.getItem('userBankingDetails');
      
      if (userAccountName && userBankingDetails) {
        const parsed = JSON.parse(userBankingDetails);
        // Check if essential banking fields are filled
        const hasBankName = parsed.settlementBank && parsed.settlementBank.trim() !== '';
        const hasAccountNumber = parsed.accountNumber && parsed.accountNumber.trim() !== '';
        const hasAccountName = parsed.accountName && parsed.accountName.trim() !== '';
        
        const isComplete = hasBankName && hasAccountNumber && hasAccountName;
        setHasBankingInfo(isComplete);
      } else {
        setHasBankingInfo(false);
      }
    } catch (error) {
      console.error('Error checking banking status:', error);
      setHasBankingInfo(false);
    } finally {
      setIsChecking(false);
    }
  };

  // Update banking status (called when banking info is saved/deleted)
  const updateBankingStatus = () => {
    checkBankingStatus();
  };

  useEffect(() => {
    // Initial check
    checkBankingStatus();
    
    // Listen for storage changes from other tabs
    const handleStorageChange = (e) => {
      if (e.key === 'userAccountName' || e.key === 'userBankingDetails') {
        checkBankingStatus();
      }
    };

    window.addEventListener('storage', handleStorageChange);
    
    // Also check periodically in case of same-tab updates
    const interval = setInterval(checkBankingStatus, 2000);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      clearInterval(interval);
    };
  }, []);

  const value = {
    hasBankingInfo,
    isChecking,
    updateBankingStatus,
    checkBankingStatus
  };

  return (
    <BankingContext.Provider value={value}>
      {children}
    </BankingContext.Provider>
  );
};
