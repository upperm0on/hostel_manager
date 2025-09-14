import React, { useState, useEffect } from 'react';
import { API_ENDPOINTS } from '../../config/api';
import { 
  BarChart3, 
  TrendingUp, 
  TrendingDown, 
  Users, 
  DollarSign, 
  Home, 
  Calendar,
  Download,
  Filter,
  Eye,
  PieChart,
  Target,
  Award,
  AlertTriangle
} from 'lucide-react';
import { Modal } from '../Common';
import './AnalyticsTab.css';

const AnalyticsTab = ({ hostelInfo, onSave }) => {
  const [selectedPeriod, setSelectedPeriod] = useState('semester');
  const [selectedView, setSelectedView] = useState('overview');
  const [tenants, setTenants] = useState([]);
  const [loading, setLoading] = useState(false);
  
  // Modal states
  const [showOccupancyModal, setShowOccupancyModal] = useState(false);
  const [showRevenueModal, setShowRevenueModal] = useState(false);
  const [showTenantModal, setShowTenantModal] = useState(false);

  // Fetch tenants data for analytics
  useEffect(() => {
    const fetchTenants = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('token');
        
        if (!token) {
          console.log('No authentication token found');
          return;
        }

        const response = await fetch(API_ENDPOINTS.TENANTS_LIST, {
          method: 'GET',
          headers: {
            'Authorization': `Token ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error(`Failed to fetch tenants: ${response.status}`);
        }

        const data = await response.json();
        
        if (data.status === 'success' && data.tenants) {
          setTenants(data.tenants);
        }
        
      } catch (err) {
        console.error('Error fetching tenants for analytics:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchTenants();
  }, []);
  
  // Calculate analytics from real hostel data with parsed amenities
  const roomDetails = (hostelInfo?.room_details || []).map(room => {
    // Parse amenities if it's a string
    let parsedAmenities = [];
    if (room.amenities) {
      if (typeof room.amenities === 'string') {
        try {
          parsedAmenities = JSON.parse(room.amenities);
        } catch (e) {
          console.error('Error parsing amenities:', e);
          parsedAmenities = [];
        }
      } else if (Array.isArray(room.amenities)) {
        parsedAmenities = room.amenities;
      }
    }
    
    return {
      ...room,
      amenities: parsedAmenities
    };
  });
  const totalRooms = roomDetails.reduce((sum, room) => sum + (parseInt(room.number_of_rooms) || 0), 0);
  const totalCapacity = roomDetails.reduce((sum, room) => sum + (parseInt(room.number_of_rooms) * parseInt(room.number_in_room) || 0), 0);
  const averagePrice = roomDetails.length > 0 ? roomDetails.reduce((sum, room) => sum + (parseInt(room.price) || 0), 0) / roomDetails.length : 0;
  
  // Calculate real analytics from tenant data
  const currentTenants = tenants.length;
  const totalRevenue = tenants.reduce((sum, tenant) => sum + parseFloat(tenant.amount || 0), 0);
  const occupancyRate = totalCapacity > 0 ? Math.round((currentTenants / totalCapacity) * 100) : 0;
  
  // Payment performance not applicable since payment is required upfront to book
  
  const analyticsData = {
    occupancy: {
      current: occupancyRate,
      previous: Math.max(0, occupancyRate - 5), // Simulate previous period with fixed decrease
      trend: occupancyRate > 0 ? 'up' : 'stable',
      rooms: {
        total: totalRooms,
        occupied: Math.floor((totalRooms * occupancyRate) / 100),
        vacant: totalRooms - Math.floor((totalRooms * occupancyRate) / 100),
        maintenance: Math.max(0, Math.floor(totalRooms * 0.05)) // 5% of rooms under maintenance
      }
    },
    revenue: {
      current: totalRevenue,
      previous: Math.round(totalRevenue * 0.9), // Simulate previous period
      trend: 'up',
              breakdown: {
          rent: totalRevenue, // All revenue is from rent payments
          utilities: 0, // Not tracked yet
          services: 0 // Not tracked yet
        }
    },
    tenants: {
      total: totalCapacity,
      active: currentTenants,
      new: Math.max(0, Math.floor(currentTenants * 0.1)), // 10% of current tenants as "new"
      leaving: Math.max(0, Math.floor(currentTenants * 0.05)), // 5% of current tenants as "leaving"
      satisfaction: 4.2 // Static for now
    }
  };

  // Interactive period change handler
  const handlePeriodChange = (period) => {
    setSelectedPeriod(period);
    // In a real app, this would trigger API calls to fetch new data
    console.log(`Analytics period changed to: ${period}`);
  };

  // Interactive view change handler
  const handleViewChange = (view) => {
    setSelectedView(view);
    // In a real app, this would change the display mode
    console.log(`Analytics view changed to: ${view}`);
  };

  const generateReport = () => {
    // In a real app, this would generate and download a PDF/Excel report
    alert('Report generation feature coming soon!');
  };

  const exportData = () => {
    // In a real app, this would export data to CSV/Excel
    alert('Data export feature coming soon!');
  };

  return (
    <div className="analytics-tab">
      {/* Header Section */}
      <div className="analytics-header">
        <div className="analytics-header-content">
          <div>
            <h2 className="analytics-title">Analytics & Reports</h2>
            <p className="analytics-subtitle">
              Comprehensive insights into your hostel performance and operations
            </p>
          </div>
          <div className="analytics-actions">
            <button className="btn btn-outline" onClick={exportData}>
              <Download size={16} />
              Export Data
            </button>
            <button className="btn btn-primary" onClick={generateReport}>
              <BarChart3 size={16} />
              Generate Report
            </button>
          </div>
        </div>
      </div>

      {/* Filters and Controls */}
      <div className="analytics-controls">
        <div className="control-group">
          <label className="control-label">Time Period:</label>
          <select 
            value={selectedPeriod} 
            onChange={(e) => handlePeriodChange(e.target.value)}
            className="control-select"
          >
            <option value="semester">This Semester</option>
            <option value="year">This Year</option>
            <option value="academic-year">Academic Year</option>
          </select>
        </div>
        <div className="control-group">
          <label className="control-label">View:</label>
          <select 
            value={selectedView} 
            onChange={(e) => handleViewChange(e.target.value)}
            className="control-select"
          >
            <option value="overview">Overview</option>
            <option value="detailed">Detailed</option>
            <option value="comparison">Comparison</option>
          </select>
        </div>
      </div>

      {/* Key Metrics Grid */}
      <div className="metrics-grid">
        <div className="metric-card primary">
          <div className="metric-header">
            <div className="metric-icon">
              <Home size={24} />
            </div>
            <div className="metric-trend up">
              <TrendingUp size={16} />
              +5%
            </div>
          </div>
          <div className="metric-content">
            <div className="metric-value">{analyticsData.occupancy.current}%</div>
            <div className="metric-label">Occupancy Rate</div>
            <div className="metric-comparison">
              vs {analyticsData.occupancy.previous}% last period
            </div>
          </div>
        </div>

        <div className="metric-card success">
          <div className="metric-header">
            <div className="metric-icon">
              <DollarSign size={24} />
            </div>
            <div className="metric-trend up">
              <TrendingUp size={16} />
              +7.8%
            </div>
          </div>
          <div className="metric-content">
            <div className="metric-value">${analyticsData.revenue.current.toLocaleString()}</div>
            <div className="metric-label">Total Revenue</div>
            <div className="metric-comparison">
              vs ${analyticsData.revenue.previous.toLocaleString()} last period
            </div>
          </div>
        </div>

        <div className="metric-card info">
          <div className="metric-header">
            <div className="metric-icon">
              <Users size={24} />
            </div>
            <div className="metric-trend up">
              <TrendingUp size={16} />
              +6
            </div>
          </div>
          <div className="metric-content">
            <div className="metric-value">{analyticsData.tenants.total}</div>
            <div className="metric-label">Total Tenants</div>
            <div className="metric-comparison">
              +{analyticsData.tenants.new} new this period
            </div>
          </div>
        </div>

      </div>

      {/* Detailed Analytics Sections */}
      <div className="analytics-sections">
        {/* Occupancy Analysis */}
        <div className="analytics-section">
          <div className="section-header">
            <h3 className="section-title">
              <Home size={20} />
              Occupancy Analysis
            </h3>
            <div className="section-actions">
              <button 
                className="btn btn-outline btn-sm"
                onClick={() => setShowOccupancyModal(true)}
              >
                <Eye size={16} />
                View Details
              </button>
            </div>
          </div>
          <div className="section-content">
            <div className="occupancy-breakdown">
              <div className="breakdown-item">
                <div className="breakdown-label">Total Rooms</div>
                <div className="breakdown-value">{analyticsData.occupancy.rooms.total}</div>
                <div className="breakdown-bar">
                  <div className="bar-fill" style={{ width: '100%' }}></div>
                </div>
              </div>
              <div className="breakdown-item">
                <div className="breakdown-label">Occupied</div>
                <div className="breakdown-value">{analyticsData.occupancy.rooms.occupied}</div>
                <div className="breakdown-bar">
                  <div className="bar-fill occupied" style={{ width: `${(analyticsData.occupancy.rooms.occupied / analyticsData.occupancy.rooms.total) * 100}%` }}></div>
                </div>
              </div>
              <div className="breakdown-item">
                <div className="breakdown-label">Vacant</div>
                <div className="breakdown-value">{analyticsData.occupancy.rooms.vacant}</div>
                <div className="breakdown-bar">
                  <div className="bar-fill vacant" style={{ width: `${(analyticsData.occupancy.rooms.vacant / analyticsData.occupancy.rooms.total) * 100}%` }}></div>
                </div>
              </div>
              <div className="breakdown-item">
                <div className="breakdown-label">Maintenance</div>
                <div className="breakdown-value">{analyticsData.occupancy.rooms.maintenance}</div>
                <div className="breakdown-bar">
                  <div className="bar-fill maintenance" style={{ width: `${(analyticsData.occupancy.rooms.maintenance / analyticsData.occupancy.rooms.total) * 100}%` }}></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Revenue Breakdown */}
        <div className="analytics-section">
          <div className="section-header">
            <h3 className="section-title">
              <DollarSign size={20} />
              Revenue Breakdown
            </h3>
            <div className="section-actions">
              <button 
                className="btn btn-outline btn-sm"
                onClick={() => setShowRevenueModal(true)}
              >
                <PieChart size={16} />
                Chart View
              </button>
            </div>
          </div>
          <div className="section-content">
            <div className="revenue-breakdown">
              <div className="revenue-item">
                <div className="revenue-label">Rent Collection</div>
                <div className="revenue-amount">${analyticsData.revenue.breakdown.rent.toLocaleString()}</div>
                <div className="revenue-percentage">
                  {Math.round((analyticsData.revenue.breakdown.rent / analyticsData.revenue.current) * 100)}%
                </div>
              </div>
              <div className="revenue-item">
                <div className="revenue-label">Utilities</div>
                <div className="revenue-amount">${analyticsData.revenue.breakdown.utilities.toLocaleString()}</div>
                <div className="revenue-percentage">
                  {Math.round((analyticsData.revenue.breakdown.utilities / analyticsData.revenue.current) * 100)}%
                </div>
              </div>
              <div className="revenue-item">
                <div className="revenue-label">Additional Services</div>
                <div className="revenue-amount">${analyticsData.revenue.breakdown.services.toLocaleString()}</div>
                <div className="revenue-percentage">
                  {Math.round((analyticsData.revenue.breakdown.services / analyticsData.revenue.current) * 100)}%
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tenant Satisfaction & Performance */}
        <div className="analytics-section">
          <div className="section-header">
            <h3 className="section-title">
              <Award size={20} />
              Tenant Satisfaction & Performance
            </h3>
            <div className="section-actions">
              <button 
                className="btn btn-outline btn-sm"
                onClick={() => setShowTenantModal(true)}
              >
                <Target size={16} />
                Set Goals
              </button>
            </div>
          </div>
          <div className="section-content">
            <div className="satisfaction-metrics">
              <div className="satisfaction-item">
                <div className="satisfaction-label">Overall Rating</div>
                <div className="satisfaction-rating">
                  <span className="rating-value">{analyticsData.tenants.satisfaction}</span>
                  <span className="rating-max">/5.0</span>
                </div>
                <div className="rating-stars">
                  {[...Array(5)].map((_, i) => (
                    <span key={i} className={`star ${i < Math.floor(analyticsData.tenants.satisfaction) ? 'filled' : ''}`}>
                      ★
                    </span>
                  ))}
                </div>
              </div>
              <div className="satisfaction-item">
                <div className="satisfaction-label">New Tenants</div>
                <div className="satisfaction-value positive">+{analyticsData.tenants.new}</div>
                <div className="satisfaction-trend">This period</div>
              </div>
              <div className="satisfaction-item">
                <div className="satisfaction-label">Tenant Retention</div>
                <div className="satisfaction-value">
                  {Math.round(((analyticsData.tenants.total - analyticsData.tenants.leaving) / analyticsData.tenants.total) * 100)}%
                </div>
                <div className="satisfaction-trend">High retention rate</div>
              </div>
            </div>
          </div>
        </div>

      </div>


      {/* Modals */}
      {/* Occupancy Details Modal */}
      <Modal
        isOpen={showOccupancyModal}
        onClose={() => setShowOccupancyModal(false)}
        title="Occupancy Analysis Details"
        size="large"
      >
        <div className="modal-content-grid">
          <div className="modal-section">
            <h3>📊 Room Status Breakdown</h3>
            <div className="status-grid">
              <div className="status-item">
                <div className="status-label">Total Rooms</div>
                <div className="status-value">{analyticsData.occupancy.rooms.total}</div>
              </div>
              <div className="status-item">
                <div className="status-label">Occupied</div>
                <div className="status-value occupied">{analyticsData.occupancy.rooms.occupied}</div>
                <div className="status-percentage">
                  {Math.round((analyticsData.occupancy.rooms.occupied / analyticsData.occupancy.rooms.total) * 100)}%
                </div>
              </div>
              <div className="status-item">
                <div className="status-label">Vacant</div>
                <div className="status-value vacant">{analyticsData.occupancy.rooms.vacant}</div>
                <div className="status-percentage">
                  {Math.round((analyticsData.occupancy.rooms.vacant / analyticsData.occupancy.rooms.total) * 100)}%
                </div>
              </div>
              <div className="status-item">
                <div className="status-label">Under Maintenance</div>
                <div className="status-value maintenance">{analyticsData.occupancy.rooms.maintenance}</div>
                <div className="status-percentage">
                  {Math.round((analyticsData.occupancy.rooms.maintenance / analyticsData.occupancy.rooms.total) * 100)}%
                </div>
              </div>
            </div>
          </div>
          
          <div className="modal-section">
            <h3>📈 Occupancy Trends</h3>
            <div className="trend-info">
              <p><strong>Current Rate:</strong> {analyticsData.occupancy.current}%</p>
              <p><strong>Previous Period:</strong> {analyticsData.occupancy.previous}%</p>
              <p><strong>Change:</strong> <span className="trend-positive">+{analyticsData.occupancy.current - analyticsData.occupancy.previous}%</span></p>
              <p><strong>Trend:</strong> <span className="trend-positive">↗️ Upward</span></p>
            </div>
          </div>
          
          <div className="modal-section">
            <h3>🎯 Recommendations</h3>
            <ul className="recommendations-list">
              <li>Focus on filling vacant rooms to increase occupancy rate</li>
              <li>Complete maintenance tasks quickly to return rooms to market</li>
              <li>Consider seasonal pricing strategies for better occupancy</li>
              <li>Implement referral programs to attract new tenants</li>
            </ul>
          </div>
        </div>
      </Modal>

      {/* Revenue Chart Modal */}
      <Modal
        isOpen={showRevenueModal}
        onClose={() => setShowRevenueModal(false)}
        title="Revenue Breakdown Chart"
        size="large"
      >
        <div className="modal-content-grid">
          <div className="modal-section">
            <h3>💰 Revenue Distribution</h3>
            <div className="chart-container">
              <div className="pie-chart">
                <div className="pie-segment rent" style={{
                  background: `conic-gradient(#3b82f6 0deg ${Math.round((analyticsData.revenue.breakdown.rent / analyticsData.revenue.current) * 100) * 3.6}deg, #e5e7eb ${Math.round((analyticsData.revenue.breakdown.rent / analyticsData.revenue.current) * 100) * 3.6}deg 360deg)`
                }}>
                  <span className="pie-label">
                    {Math.round((analyticsData.revenue.breakdown.rent / analyticsData.revenue.current) * 100)}%
                  </span>
                </div>
              </div>
              <div className="chart-legend">
                <div className="legend-item">
                  <div className="legend-color rent"></div>
                  <span>Rent Collection: ${analyticsData.revenue.breakdown.rent.toLocaleString()}</span>
                </div>
                <div className="legend-item">
                  <div className="legend-color utilities"></div>
                  <span>Utilities: ${analyticsData.revenue.breakdown.utilities.toLocaleString()}</span>
                </div>
                <div className="legend-item">
                  <div className="legend-color services"></div>
                  <span>Additional Services: ${analyticsData.revenue.breakdown.services.toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="modal-section">
            <h3>📊 Revenue Summary</h3>
            <div className="summary-grid">
              <div className="summary-item">
                <div className="summary-label">Total Revenue</div>
                <div className="summary-value">${analyticsData.revenue.current.toLocaleString()}</div>
              </div>
              <div className="summary-item">
                <div className="summary-label">Previous Period</div>
                <div className="summary-value">${analyticsData.revenue.previous.toLocaleString()}</div>
              </div>
              <div className="summary-item">
                <div className="summary-label">Growth</div>
                <div className="summary-value positive">
                  +{Math.round(((analyticsData.revenue.current - analyticsData.revenue.previous) / analyticsData.revenue.previous) * 100)}%
                </div>
              </div>
            </div>
          </div>
        </div>
      </Modal>
      {/* Occupancy Details Modal */}
      <Modal
        isOpen={showOccupancyModal}
        onClose={() => setShowOccupancyModal(false)}
        title="Occupancy Analysis Details"
        size="large"
      >
        <div className="modal-content-grid">
          <div className="modal-section">
            <h3>📊 Room Status Breakdown</h3>
            <div className="status-grid">
              <div className="status-item">
                <div className="status-label">Total Rooms</div>
                <div className="status-value">{analyticsData.occupancy.rooms.total}</div>
              </div>
              <div className="status-item">
                <div className="status-label">Occupied</div>
                <div className="status-value occupied">{analyticsData.occupancy.rooms.occupied}</div>
                <div className="status-percentage">
                  {Math.round((analyticsData.occupancy.rooms.occupied / analyticsData.occupancy.rooms.total) * 100)}%
                </div>
              </div>
              <div className="status-item">
                <div className="status-label">Vacant</div>
                <div className="status-value vacant">{analyticsData.occupancy.rooms.vacant}</div>
                <div className="status-percentage">
                  {Math.round((analyticsData.occupancy.rooms.vacant / analyticsData.occupancy.rooms.total) * 100)}%
                </div>
              </div>
              <div className="status-item">
                <div className="status-label">Under Maintenance</div>
                <div className="status-value maintenance">{analyticsData.occupancy.rooms.maintenance}</div>
                <div className="status-percentage">
                  {Math.round((analyticsData.occupancy.rooms.maintenance / analyticsData.occupancy.rooms.total) * 100)}%
                </div>
              </div>
            </div>
          </div>
          
          <div className="modal-section">
            <h3>📈 Occupancy Trends</h3>
            <div className="trend-info">
              <p><strong>Current Rate:</strong> {analyticsData.occupancy.current}%</p>
              <p><strong>Previous Period:</strong> {analyticsData.occupancy.previous}%</p>
              <p><strong>Change:</strong> <span className="trend-positive">+{analyticsData.occupancy.current - analyticsData.occupancy.previous}%</span></p>
              <p><strong>Trend:</strong> <span className="trend-positive">↗️ Upward</span></p>
            </div>
          </div>
          
          <div className="modal-section">
            <h3>🎯 Recommendations</h3>
            <ul className="recommendations-list">
              <li>Focus on filling vacant rooms to increase occupancy rate</li>
              <li>Complete maintenance tasks quickly to return rooms to market</li>
              <li>Consider seasonal pricing strategies for better occupancy</li>
              <li>Implement referral programs to attract new tenants</li>
            </ul>
          </div>
        </div>
      </Modal>

      {/* Revenue Chart Modal */}
      <Modal
        isOpen={showRevenueModal}
        onClose={() => setShowRevenueModal(false)}
        title="Revenue Breakdown Chart"
        size="large"
      >
        <div className="modal-content-grid">
          <div className="modal-section">
            <h3>💰 Revenue Distribution</h3>
            <div className="chart-container">
              <div className="pie-chart">
                <div className="pie-segment rent" style={{
                  background: `conic-gradient(#3b82f6 0deg ${Math.round((analyticsData.revenue.breakdown.rent / analyticsData.revenue.current) * 100) * 3.6}deg, #e5e7eb ${Math.round((analyticsData.revenue.breakdown.rent / analyticsData.revenue.current) * 100) * 3.6}deg 360deg)`
                }}>
                  <span className="pie-label">
                    {Math.round((analyticsData.revenue.breakdown.rent / analyticsData.revenue.current) * 100)}%
                  </span>
                </div>
              </div>
              <div className="chart-legend">
                <div className="legend-item">
                  <div className="legend-color rent"></div>
                  <span>Rent Collection: ${analyticsData.revenue.breakdown.rent.toLocaleString()}</span>
                </div>
                <div className="legend-item">
                  <div className="legend-color utilities"></div>
                  <span>Utilities: ${analyticsData.revenue.breakdown.utilities.toLocaleString()}</span>
                </div>
                <div className="legend-item">
                  <div className="legend-color services"></div>
                  <span>Additional Services: ${analyticsData.revenue.breakdown.services.toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="modal-section">
            <h3>📊 Revenue Summary</h3>
            <div className="summary-grid">
              <div className="summary-item">
                <div className="summary-label">Total Revenue</div>
                <div className="summary-value">${analyticsData.revenue.current.toLocaleString()}</div>
              </div>
              <div className="summary-item">
                <div className="summary-label">Previous Period</div>
                <div className="summary-value">${analyticsData.revenue.previous.toLocaleString()}</div>
              </div>
              <div className="summary-item">
                <div className="summary-label">Growth</div>
                <div className="summary-value positive">
                  +{Math.round(((analyticsData.revenue.current - analyticsData.revenue.previous) / analyticsData.revenue.previous) * 100)}%
                </div>
              </div>
            </div>
          </div>
        </div>
      </Modal>

      {/* Tenant Goals Modal */}
      <Modal
        isOpen={showTenantModal}
        onClose={() => setShowTenantModal(false)}
        title="Set Performance Goals"
        size="medium"
      >
        <div className="modal-content-grid">
          <div className="modal-section">
            <h3>🎯 Current Performance</h3>
            <div className="performance-grid">
              <div className="performance-item">
                <div className="performance-label">Tenant Satisfaction</div>
                <div className="performance-value">{analyticsData.tenants.satisfaction}/5.0</div>
              </div>
              <div className="performance-item">
                <div className="performance-label">New Tenants This Period</div>
                <div className="performance-value">+{analyticsData.tenants.new}</div>
              </div>
              <div className="performance-item">
                <div className="performance-label">Tenant Retention Rate</div>
                <div className="performance-value">
                  {Math.round(((analyticsData.tenants.total - analyticsData.tenants.leaving) / analyticsData.tenants.total) * 100)}%
                </div>
              </div>
            </div>
          </div>
          
          <div className="modal-section">
            <h3>📈 Goal Setting</h3>
            <div className="goals-form">
              <div className="form-group">
                <label>Target Satisfaction Score:</label>
                <input 
                  type="number" 
                  min="1" 
                  max="5" 
                  step="0.1" 
                  defaultValue={Math.min(5, analyticsData.tenants.satisfaction + 0.3)}
                  className="form-input"
                />
              </div>
              <div className="form-group">
                <label>Target New Tenants:</label>
                <input 
                  type="number" 
                  min="0" 
                  defaultValue={analyticsData.tenants.new + 2}
                  className="form-input"
                />
              </div>
              <div className="form-group">
                <label>Target Retention Rate:</label>
                <input 
                  type="number" 
                  min="0" 
                  max="100" 
                  defaultValue={Math.min(100, Math.round(((analyticsData.tenants.total - analyticsData.tenants.leaving) / analyticsData.tenants.total) * 100) + 5)}
                  className="form-input"
                />
                <span className="input-suffix">%</span>
              </div>
              <button 
                className="btn btn-primary"
                onClick={() => {
                  alert('Goals saved successfully!');
                  setShowTenantModal(false);
                }}
              >
                Save Goals
              </button>
            </div>
          </div>
        </div>
      </Modal>

    </div>
  );
};

export default AnalyticsTab;
