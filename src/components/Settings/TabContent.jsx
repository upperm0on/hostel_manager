import React from 'react';
import { HostelOverview, BankingDetailsTab } from '../SettingsTabs';
import './TabContent.css';

const TabContent = ({ activeTab, hostelInfo, bankingDetails, onBankingSave }) => {
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
      {renderTabContent()}
    </div>
  );
};

export default TabContent;
