import React, { useState } from 'react';
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
  Activity,
  Target,
  Award,
  Clock,
  AlertTriangle
} from 'lucide-react';
import { Modal } from '../Common';
import './AnalyticsTab.css';

const AnalyticsTab = ({ hostelInfo, onSave }) => {
  const [selectedPeriod, setSelectedPeriod] = useState('month');
  const [selectedView, setSelectedView] = useState('overview');
  
  // Modal states
  const [showOccupancyModal, setShowOccupancyModal] = useState(false);
  const [showRevenueModal, setShowRevenueModal] = useState(false);
  const [showTenantModal, setShowTenantModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  
  // Mock data - in a real app, this would come from API calls
  const analyticsData = {
    occupancy: {
      current: 87,
      previous: 82,
      trend: 'up',
      rooms: {
        total: 45,
        occupied: 39,
        vacant: 6,
        maintenance: 2
      }
    },
    revenue: {
      current: 45600,
      previous: 42300,
      trend: 'up',
      breakdown: {
        rent: 42000,
        utilities: 2800,
        services: 800
      }
    },
    tenants: {
      total: 156,
      active: 142,
      new: 8,
      leaving: 3,
      satisfaction: 4.2
    },
    payments: {
      onTime: 89,
      late: 8,
      overdue: 3,
      averageDelay: 2.4
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
            <option value="week">This Week</option>
            <option value="month">This Month</option>
            <option value="quarter">This Quarter</option>
            <option value="year">This Year</option>
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

        <div className="metric-card warning">
          <div className="metric-header">
            <div className="metric-icon">
              <Activity size={24} />
            </div>
            <div className="metric-trend down">
              <TrendingDown size={16} />
              -2.1%
            </div>
          </div>
          <div className="metric-content">
            <div className="metric-value">{analyticsData.payments.onTime}%</div>
            <div className="metric-label">Payment Success</div>
            <div className="metric-comparison">
              {analyticsData.payments.late + analyticsData.payments.overdue} payments need attention
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

        {/* Payment Performance */}
        <div className="analytics-section">
          <div className="section-header">
            <h3 className="section-title">
              <Activity size={20} />
              Payment Performance
            </h3>
            <div className="section-actions">
              <button 
                className="btn btn-outline btn-sm"
                onClick={() => setShowPaymentModal(true)}
              >
                <Clock size={16} />
                Payment History
              </button>
            </div>
          </div>
          <div className="section-content">
            <div className="payment-metrics">
              <div className="payment-item">
                <div className="payment-label">On-Time Payments</div>
                <div className="payment-value positive">{analyticsData.payments.onTime}%</div>
                <div className="payment-bar">
                  <div className="bar-fill positive" style={{ width: `${analyticsData.payments.onTime}%` }}></div>
                </div>
              </div>
              <div className="payment-item">
                <div className="payment-label">Late Payments</div>
                <div className="payment-value warning">{analyticsData.payments.late}%</div>
                <div className="payment-bar">
                  <div className="bar-fill warning" style={{ width: `${analyticsData.payments.late}%` }}></div>
                </div>
              </div>
              <div className="payment-item">
                <div className="payment-label">Overdue Payments</div>
                <div className="payment-value negative">{analyticsData.payments.overdue}%</div>
                <div className="payment-bar">
                  <div className="bar-fill negative" style={{ width: `${analyticsData.payments.overdue}%` }}></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="quick-actions">
        <h3 className="actions-title">Quick Actions</h3>
        <div className="actions-grid">
          <button 
            className="action-card"
            onClick={() => {
              const reportData = {
                month: new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
                occupancy: '87%',
                revenue: '$45,600',
                tenants: 156
              };
              const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: 'application/json' });
              const url = URL.createObjectURL(blob);
              const a = document.createElement('a');
              a.href = url;
              a.download = `monthly-report-${new Date().toISOString().slice(0, 7)}.json`;
              a.click();
              URL.revokeObjectURL(url);
            }}
          >
            <BarChart3 size={24} />
            <span>Generate Monthly Report</span>
          </button>
          
          <button 
            className="action-card"
            onClick={() => {
              const trendsData = {
                period: selectedPeriod,
                occupancy: {
                  trend: 'up',
                  change: '+5%',
                  forecast: '90% by next period'
                },
                revenue: {
                  trend: 'up',
                  change: '+7.8%',
                  forecast: '$49,200 by next period'
                }
              };
              const blob = new Blob([JSON.stringify(trendsData, null, 2)], { type: 'application/json' });
              const url = URL.createObjectURL(blob);
              const a = document.createElement('a');
              a.href = url;
              a.download = `performance-trends-${selectedPeriod}.json`;
              a.click();
              URL.revokeObjectURL(url);
            }}
          >
            <TrendingUp size={24} />
            <span>View Performance Trends</span>
          </button>
          
          <button 
            className="action-card"
            onClick={() => {
              const tenantData = {
                total: analyticsData.tenants.total,
                active: analyticsData.tenants.active,
                new: analyticsData.tenants.new,
                satisfaction: analyticsData.tenants.satisfaction,
                retention: Math.round(((analyticsData.tenants.total - analyticsData.tenants.leaving) / analyticsData.tenants.total) * 100)
              };
              const blob = new Blob([JSON.stringify(tenantData, null, 2)], { type: 'application/json' });
              const url = URL.createObjectURL(blob);
              const a = document.createElement('a');
              a.href = url;
              a.download = `tenant-analytics-${selectedPeriod}.json`;
              a.click();
              URL.revokeObjectURL(url);
            }}
          >
            <Users size={24} />
            <span>Tenant Analytics</span>
          </button>
          
          <button 
            className="action-card"
            onClick={() => {
              const financialData = {
                revenue: analyticsData.revenue.current,
                breakdown: analyticsData.revenue.breakdown,
                payments: analyticsData.payments,
                period: selectedPeriod
              };
              const blob = new Blob([JSON.stringify(financialData, null, 2)], { type: 'application/json' });
              const url = URL.createObjectURL(blob);
              const a = document.createElement('a');
              a.href = url;
              a.download = `financial-summary-${selectedPeriod}.json`;
              a.click();
              URL.revokeObjectURL(url);
            }}
          >
            <DollarSign size={24} />
            <span>Financial Summary</span>
          </button>
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

      {/* Payment History Modal */}
      <Modal
        isOpen={showPaymentModal}
        onClose={() => setShowPaymentModal(false)}
        title="Payment History & Performance"
        size="large"
      >
        <div className="modal-content-grid">
          <div className="modal-section">
            <h3>💰 Payment Status Breakdown</h3>
            <div className="payment-status-grid">
              <div className="status-card positive">
                <h4>On-Time</h4>
                <div className="status-number">{analyticsData.payments.onTime}%</div>
                <p>Excellent performance</p>
              </div>
              <div className="status-card warning">
                <h4>Late</h4>
                <div className="status-number">{analyticsData.payments.late}%</div>
                <p>Needs attention</p>
              </div>
              <div className="status-card negative">
                <h4>Overdue</h4>
                <div className="status-number">{analyticsData.payments.overdue}%</div>
                <p>Critical issue</p>
              </div>
            </div>
          </div>
          
          <div className="modal-section">
            <h3>📊 Performance Summary</h3>
            <div className="performance-summary">
              <p><strong>Overall Success Rate:</strong> {analyticsData.payments.onTime}%</p>
              <p><strong>Areas for Improvement:</strong> {analyticsData.payments.late + analyticsData.payments.overdue}% of payments need attention</p>
              <p><strong>Average Delay:</strong> {analyticsData.payments.averageDelay} days</p>
            </div>
          </div>
          
          <div className="modal-section">
            <h3>🚀 Recommendations</h3>
            <ul className="recommendations-list">
              <li>Implement automated payment reminders</li>
              <li>Offer multiple payment methods</li>
              <li>Provide early payment incentives</li>
              <li>Regular follow-up on late payments</li>
              <li>Consider payment plan options for struggling tenants</li>
            </ul>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default AnalyticsTab;
