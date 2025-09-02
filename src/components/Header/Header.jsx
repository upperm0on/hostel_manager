import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  Home, 
  Search, 
  ChevronDown,
  Bell
} from 'lucide-react';
import './Header.css';

const Header = () => {
  return (
    <header className="header">
      {/* Header Left */}
      <div className="header-left">
        <NavLink to="/" className="header-logo">
          <Home className="header-logo-icon" />
          <span className="header-logo-text">Hostel Manager</span>
        </NavLink>
        
        <div className="header-search">
          <Search className="header-search-icon" />
          <input
            type="text"
            placeholder="Search tenants, payments, rooms..."
            className="header-search-input"
          />
        </div>
      </div>

      {/* Header Right */}
      <div className="header-right">
        {/* Notifications */}
        <div className="header-notifications">
          <button className="header-notifications-button">
            <Bell className="header-notifications-icon" />
            <span className="header-notifications-badge">3</span>
          </button>
        </div>

        {/* User Menu */}
        <div className="header-user-menu">
          <button className="header-user-button">
            <div className="header-user-avatar">
              AM
            </div>
            <div className="header-user-info">
              <div className="header-user-name">Admin Manager</div>
              <div className="header-user-role">Hostel Manager</div>
            </div>
            <ChevronDown className="header-user-chevron" />
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
