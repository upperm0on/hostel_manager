import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { 
  Home, 
  Users, 
  CreditCard, 
  Settings, 
  ChevronDown,
  Menu,
  LogOut
} from 'lucide-react';
import './Sidebar.css';

const Sidebar = () => {
  const location = useLocation();
  const [isOpen, setIsOpen] = React.useState(false);
  const { user, logout } = useAuth();

  const navItems = [
    { path: '/', icon: Home, label: 'Dashboard' },
    { path: '/tenants', icon: Users, label: 'Tenants' },
    { path: '/payments', icon: CreditCard, label: 'Payments' },
    { path: '/settings', icon: Settings, label: 'Settings' },
  ];

  const toggleSidebar = () => setIsOpen(!isOpen);

  return (
    <>
      <button className="sidebar-toggle" onClick={toggleSidebar}>
        <Menu size={20} />
      </button>
      
      <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
        {/* Sidebar Header */}
        <div className="sidebar-header">
          <NavLink to="/" className="sidebar-logo">
            <Home className="sidebar-logo-icon" />
            <span className="sidebar-logo-text">Hostel Manager</span>
          </NavLink>
        </div>

        {/* Sidebar Navigation */}
        <nav className="sidebar-nav">
          <ul className="sidebar-nav-list">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              
              return (
                <li key={item.path} className="sidebar-nav-item">
                  <NavLink
                    to={item.path}
                    className={`sidebar-nav-link ${isActive ? 'active' : ''}`}
                    onClick={() => setIsOpen(false)}
                  >
                    <Icon className="sidebar-nav-icon" />
                    <span className="sidebar-nav-text">{item.label}</span>
                  </NavLink>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Sidebar Footer */}
        <div className="sidebar-footer">
          <div className="sidebar-footer-content">
            <div className="sidebar-footer-avatar">
              {user?.username?.charAt(0).toUpperCase() || 'U'}
            </div>
            <div className="sidebar-footer-info">
              <div className="sidebar-footer-name">{user?.username || 'User'}</div>
              <div className="sidebar-footer-role">Hostel Manager</div>
            </div>
            <button 
              className="sidebar-footer-logout"
              onClick={logout}
              title="Logout"
            >
              <LogOut size={16} />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
