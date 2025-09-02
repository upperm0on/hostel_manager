import React from 'react';
import { useHostel } from '../../contexts/HostelContext';
import { useNavigate } from 'react-router-dom';
import { Building, Settings, ArrowRight, Users, Home, DollarSign, BarChart3 } from 'lucide-react';
import './NoHostelState.css';

const NoHostelState = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: Users,
      title: 'Tenant Management',
      description: 'Manage all your tenants, track payments, and handle check-ins/check-outs efficiently.'
    },
    {
      icon: Home,
      title: 'Room Management',
      description: 'Organize rooms, set pricing, and manage occupancy with real-time updates.'
    },
    {
      icon: DollarSign,
      title: 'Payment Tracking',
      description: 'Monitor rent collection, track overdue payments, and generate financial reports.'
    },
    {
      icon: BarChart3,
      title: 'Analytics & Reports',
      description: 'Get insights into your hostel performance, occupancy rates, and financial metrics.'
    }
  ];

  const handleSetupHostel = () => {
    navigate('/settings');
  };

  return (
    <div className="no-hostel-state">
      <div className="no-hostel-container">
        {/* Main Message */}
        <div className="main-message">
          <div className="message-icon">
            <Building size={80} />
          </div>
          <h1>Welcome to Hostel Manager!</h1>
          <p className="main-description">
            It looks like you haven't set up your hostel yet. Let's get you started with managing your hostel efficiently.
          </p>
          <button onClick={handleSetupHostel} className="setup-button">
            <Settings size={20} />
            Set Up Your Hostel
            <ArrowRight size={20} />
          </button>
        </div>

        {/* Features Preview */}
        <div className="features-section">
          <h2>What You'll Get</h2>
          <p className="features-description">
            Once you set up your hostel, you'll have access to these powerful features:
          </p>
          
          <div className="features-grid">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div key={index} className="feature-card">
                  <div className="feature-icon">
                    <Icon size={32} />
                  </div>
                  <h3>{feature.title}</h3>
                  <p>{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Quick Setup Guide */}
        <div className="setup-guide">
          <h2>Quick Setup Guide</h2>
          <div className="setup-steps">
            <div className="setup-step">
              <div className="step-number">1</div>
              <div className="step-content">
                <h4>Basic Information</h4>
                <p>Enter your hostel name, location, and description</p>
              </div>
            </div>
            
            <div className="setup-step">
              <div className="step-number">2</div>
              <div className="step-content">
                <h4>Amenities & Features</h4>
                <p>List what your hostel offers to attract tenants</p>
              </div>
            </div>
            
            <div className="setup-step">
              <div className="step-number">3</div>
              <div className="step-content">
                <h4>Room Configuration</h4>
                <p>Set up room types, pricing, and capacity</p>
              </div>
            </div>
            
            <div className="setup-step">
              <div className="step-number">4</div>
              <div className="step-content">
                <h4>Start Managing</h4>
                <p>Begin adding tenants and tracking operations</p>
              </div>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="final-cta">
          <h2>Ready to Get Started?</h2>
          <p>Setting up your hostel takes just a few minutes and will unlock all the features you need to manage your property effectively.</p>
          <button onClick={handleSetupHostel} className="cta-button">
            <Settings size={20} />
            Begin Setup Now
            <ArrowRight size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default NoHostelState;
