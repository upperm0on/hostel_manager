import React from 'react';
import { HostelOverview, BankingDetailsTab } from '../SettingsTabs';
import BankingAlert from '../Common/BankingAlert';
import './TabContent.css';

const TabContent = ({ activeTab, hostelInfo, bankingDetails, onBankingSave, onTabChange }) => {
  const handleCompleteBanking = () => {
    if (onTabChange) {
      onTabChange('banking');
    }
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'hostel':
        return (
          <div className="tab-panel">
            <HostelOverview hostelInfo={hostelInfo} />
          </div>
        );
      
      case 'banking':
        return (
          <div className="tab-panel">
            <BankingDetailsTab 
              hostelInfo={{ ...hostelInfo, bankingDetails }} 
              onSave={onBankingSave}
            />
          </div>
        );
      
      default:
        return null;
    }
  };

  return (
    <div className="tab-content">
      <BankingAlert onComplete={handleCompleteBanking} />
      {renderTabContent()}
    </div>
  );
};

export default TabContent;
