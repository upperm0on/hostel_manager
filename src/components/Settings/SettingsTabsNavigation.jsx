import React from 'react';
import { Settings as SettingsIcon, CreditCard } from 'lucide-react';
import './SettingsTabsNavigation.css';

const SettingsTabsNavigation = ({ activeTab, onTabChange }) => {
  const tabs = [
    {
      id: 'hostel',
      label: 'Hostel Settings',
      icon: SettingsIcon
    },
    {
      id: 'banking',
      label: 'Banking Details',
      icon: CreditCard
    }
  ];

  return (
    <div className="settings-tabs-navigation">
      {tabs.map(({ id, label, icon: Icon }) => (
        <button
          key={id}
          className={`tab-button ${activeTab === id ? 'active' : ''}`}
          onClick={() => onTabChange(id)}
        >
          <Icon size={20} />
          {label}
        </button>
      ))}
    </div>
  );
};

export default SettingsTabsNavigation;
