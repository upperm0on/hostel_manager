import React from 'react';
import { useHostel } from '../../contexts/HostelContext';
import { useNavigate } from 'react-router-dom';
import { Building, Settings, ArrowRight, Users, Home, DollarSign, BarChart3, Sparkles, CheckCircle, Star } from 'lucide-react';
import './NoHostelState.css';

const NoHostelState = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: Users,
      title: 'Tenant Management',
      description: 'Manage all your tenants, track payments, and handle check-ins/check-outs efficiently.',
      color: 'blue'
    },
    {
      icon: Home,
      title: 'Room Management',
      description: 'Organize rooms, set pricing, and manage occupancy with real-time updates.',
      color: 'green'
    },
    {
      icon: DollarSign,
      title: 'Payment Tracking',
      description: 'Monitor rent collection, track overdue payments, and generate financial reports.',
      color: 'purple'
    },
    {
      icon: BarChart3,
      title: 'Analytics & Reports',
      description: 'Get insights into your hostel performance, occupancy rates, and financial metrics.',
      color: 'orange'
    }
  ];

  const handleSetupHostel = () => {
    navigate('/settings');
  };

  return (
    <div className="no-hostel-state-modern">
      <div className="no-hostel-container-modern">
        {/* Hero Section */}
        <div className="hero-section-modern">
          <div className="hero-background-modern">
            <div className="hero-pattern-modern"></div>
            <div className="hero-gradient-modern"></div>
          </div>
          
          <div className="hero-content-modern">
            <div className="hero-main-modern">
              <div className="hero-icon-modern">
                <Building size={100} />
                <div className="icon-glow-modern"></div>
              </div>
              
              <div className="hero-text-modern">
                <h1 className="hero-title-modern">
                  Welcome to <span className="gradient-text-modern">Hostel Manager</span>
                  <Sparkles size={32} className="sparkle-icon-modern" />
                </h1>
                <p className="hero-description-modern">
                  Transform your hostel management with our comprehensive platform. 
                  Set up your property in minutes and start managing like a pro.
                </p>
                
                <div className="hero-stats-modern">
                  <div className="hero-stat-modern">
                    <div className="stat-icon-modern">
                      <Users size={20} />
                    </div>
                    <div className="stat-content-modern">
                      <span className="stat-value-modern">1000+</span>
                      <span className="stat-label-modern">Happy Managers</span>
                    </div>
                  </div>
                  
                  <div className="hero-stat-modern">
                    <div className="stat-icon-modern">
                      <Home size={20} />
                    </div>
                    <div className="stat-content-modern">
                      <span className="stat-value-modern">50K+</span>
                      <span className="stat-label-modern">Rooms Managed</span>
                    </div>
                  </div>
                  
                  <div className="hero-stat-modern">
                    <div className="stat-icon-modern">
                      <DollarSign size={20} />
                    </div>
                    <div className="stat-content-modern">
                      <span className="stat-value-modern">99%</span>
                      <span className="stat-label-modern">Satisfaction</span>
                    </div>
                  </div>
                </div>
                
                <button onClick={handleSetupHostel} className="setup-button-modern">
                  <Settings size={20} />
                  <span>Set Up Your Hostel</span>
                  <ArrowRight size={20} />
                  <div className="button-glow-modern"></div>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div className="features-section-modern">
          <div className="section-header-modern">
            <h2 className="section-title-modern">
              Powerful Features <span className="accent-text-modern">Awaiting You</span>
            </h2>
            <p className="section-description-modern">
              Everything you need to manage your hostel efficiently, all in one place.
            </p>
          </div>
          
          <div className="features-grid-modern">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div key={index} className={`feature-card-modern feature-${feature.color}`}>
                  <div className="feature-icon-modern">
                    <Icon size={32} />
                    <div className="icon-background-modern"></div>
                  </div>
                  <div className="feature-content-modern">
                    <h3 className="feature-title-modern">{feature.title}</h3>
                    <p className="feature-description-modern">{feature.description}</p>
                  </div>
                  <div className="feature-glow-modern"></div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Setup Guide */}
        <div className="setup-guide-modern">
          <div className="section-header-modern">
            <h2 className="section-title-modern">
              Quick <span className="accent-text-modern">Setup Guide</span>
            </h2>
            <p className="section-description-modern">
              Get your hostel up and running in just 4 simple steps.
            </p>
          </div>
          
          <div className="setup-steps-modern">
            <div className="setup-step-modern">
              <div className="step-number-modern">
                <span>1</span>
                <CheckCircle size={16} className="step-check-modern" />
              </div>
              <div className="step-content-modern">
                <h4 className="step-title-modern">Basic Information</h4>
                <p className="step-description-modern">Enter your hostel name, location, and contact details</p>
              </div>
              <div className="step-connector-modern"></div>
            </div>
            
            <div className="setup-step-modern">
              <div className="step-number-modern">
                <span>2</span>
                <CheckCircle size={16} className="step-check-modern" />
              </div>
              <div className="step-content-modern">
                <h4 className="step-title-modern">Amenities & Features</h4>
                <p className="step-description-modern">List what your hostel offers to attract tenants</p>
              </div>
              <div className="step-connector-modern"></div>
            </div>
            
            <div className="setup-step-modern">
              <div className="step-number-modern">
                <span>3</span>
                <CheckCircle size={16} className="step-check-modern" />
              </div>
              <div className="step-content-modern">
                <h4 className="step-title-modern">Room Configuration</h4>
                <p className="step-description-modern">Set up room types, pricing, and capacity</p>
              </div>
              <div className="step-connector-modern"></div>
            </div>
            
            <div className="setup-step-modern">
              <div className="step-number-modern">
                <span>4</span>
                <CheckCircle size={16} className="step-check-modern" />
              </div>
              <div className="step-content-modern">
                <h4 className="step-title-modern">Start Managing</h4>
                <p className="step-description-modern">Begin adding tenants and tracking operations</p>
              </div>
            </div>
          </div>
        </div>

        {/* Testimonials */}
        <div className="testimonials-modern">
          <div className="section-header-modern">
            <h2 className="section-title-modern">
              Loved by <span className="accent-text-modern">Hostel Managers</span>
            </h2>
          </div>
          
          <div className="testimonials-grid-modern">
            <div className="testimonial-card-modern">
              <div className="testimonial-content-modern">
                <div className="stars-modern">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={16} className="star-modern" />
                  ))}
                </div>
                <p className="testimonial-text-modern">
                  "This platform transformed how I manage my hostel. Everything is so intuitive and efficient!"
                </p>
                <div className="testimonial-author-modern">
                  <div className="author-avatar-modern">SM</div>
                  <div className="author-info-modern">
                    <span className="author-name-modern">Sarah Mitchell</span>
                    <span className="author-role-modern">Hostel Manager</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="testimonial-card-modern">
              <div className="testimonial-content-modern">
                <div className="stars-modern">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={16} className="star-modern" />
                  ))}
                </div>
                <p className="testimonial-text-modern">
                  "The analytics and reporting features help me make better business decisions every day."
                </p>
                <div className="testimonial-author-modern">
                  <div className="author-avatar-modern">JD</div>
                  <div className="author-info-modern">
                    <span className="author-name-modern">John Davis</span>
                    <span className="author-role-modern">Property Owner</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Final CTA */}
        <div className="final-cta-modern">
          <div className="cta-content-modern">
            <h2 className="cta-title-modern">
              Ready to <span className="gradient-text-modern">Transform</span> Your Hostel Management?
            </h2>
            <p className="cta-description-modern">
              Join thousands of successful hostel managers who have streamlined their operations with our platform.
            </p>
            <button onClick={handleSetupHostel} className="cta-button-modern">
              <Settings size={20} />
              <span>Begin Setup Now</span>
              <ArrowRight size={20} />
              <div className="button-glow-modern"></div>
            </button>
          </div>
          <div className="cta-background-modern"></div>
        </div>
      </div>
    </div>
  );
};

export default NoHostelState;
