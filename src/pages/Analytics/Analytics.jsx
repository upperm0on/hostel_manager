import React, { useState, useEffect } from 'react';
import { useHostel } from '../../contexts/HostelContext';
import { useNavigate } from 'react-router-dom';
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
  AlertTriangle,
  Clock,
  Star,
  Activity,
  MapPin,
  Building,
  Bed,
  Wifi,
  Car,
  Utensils,
  Dumbbell,
  BookOpen,
  Droplets,
  Tv,
  AirVent,
  X
} from 'lucide-react';
import BankingAlert from '../../components/Common/BankingAlert';
import './Analytics.css';

const Analytics = () => {
  const { hostelInfo } = useHostel();
  const navigate = useNavigate();
  const [selectedPeriod, setSelectedPeriod] = useState('semester');
  const [selectedView, setSelectedView] = useState('overview');
  const [tenants, setTenants] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleCompleteBanking = () => {
    navigate('/settings?tab=banking');
  };
  
  // Modal states
  const [showOccupancyModal, setShowOccupancyModal] = useState(false);
  const [showRevenueModal, setShowRevenueModal] = useState(false);
  const [showTenantModal, setShowTenantModal] = useState(false);
  const [showAmenitiesModal, setShowAmenitiesModal] = useState(false);

  // Fetch tenants data for analytics
  useEffect(() => {
    const fetchTenants = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('token');
        const response = await fetch(API_ENDPOINTS.TENANTS_LIST, {
          headers: {
            'Authorization': `Token ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        setTenants(data.tenants || []);
      } catch (error) {
        console.error('Error fetching tenants:', error);
        setTenants([]);
      } finally {
        setLoading(false);
      }
    };

    fetchTenants();
  }, []);

  // Calculate total capacity from room details
  const totalCapacity = hostelInfo?.room_details?.reduce((total, room) => {
    const roomCapacity = parseInt(room.number_of_rooms || 0) * parseInt(room.number_in_room || 0);
    return total + roomCapacity;
  }, 0) || 0;

  // Calculate real analytics from tenant data
  const currentTenants = tenants.length;
  const totalRevenue = tenants.reduce((sum, tenant) => sum + parseFloat(tenant.amount || 0), 0);
  const occupancyRate = totalCapacity > 0 ? Math.round((currentTenants / totalCapacity) * 100) : 0;
  
  // Calculate room type distribution
  const roomTypeStats = Array.isArray(hostelInfo?.room_details) 
    ? hostelInfo.room_details.map(room => {
        const roomCapacity = parseInt(room.number_of_rooms || 0) * parseInt(room.number_in_room || 0);
        const roomRevenue = parseFloat(room.price || 0) * parseInt(room.number_of_rooms || 0);
        return {
          type: `${room.number_in_room}-person room`,
          capacity: roomCapacity,
          revenue: roomRevenue,
          price: parseFloat(room.price || 0),
          rooms: parseInt(room.number_of_rooms || 0),
          occupancy: Math.min(100, Math.round((currentTenants / totalCapacity) * 100))
        };
      })
    : [];

  // Calculate amenities usage
  const allAmenities = Array.isArray(hostelInfo?.room_details) 
    ? hostelInfo.room_details.flatMap(room => {
        try {
          const amenities = typeof room.amenities === 'string' ? JSON.parse(room.amenities) : room.amenities;
          return amenities || [];
        } catch {
          return [];
        }
      })
    : [];

  const amenitiesStats = allAmenities.reduce((acc, amenity) => {
    acc[amenity] = (acc[amenity] || 0) + 1;
    return acc;
  }, {});

  // Calculate gender distribution
  const genderStats = hostelInfo?.room_details?.reduce((acc, room) => {
    const male = parseInt(room.gender?.male || 0);
    const female = parseInt(room.gender?.female || 0);
    acc.male = (acc.male || 0) + male;
    acc.female = (acc.female || 0) + female;
    return acc;
  }, { male: 0, female: 0 });

  const analyticsData = {
    occupancy: {
      current: occupancyRate,
      previous: Math.max(0, occupancyRate - 5), // Simulate previous period with fixed decrease
      total: totalCapacity,
      occupied: currentTenants,
      vacant: Math.max(0, totalCapacity - currentTenants),
      maintenance: Math.max(0, Math.floor(totalCapacity * 0.05)) // 5% under maintenance
    },
    revenue: {
      current: totalRevenue,
      previous: Math.max(0, totalRevenue - (totalRevenue * 0.1)), // 10% decrease simulation
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
    },
    roomTypes: roomTypeStats,
    amenities: amenitiesStats,
    gender: genderStats
  };

  // Interactive period change handler
  const handlePeriodChange = (period) => {
    setSelectedPeriod(period);
  };

  // Export functions
  const exportToPDF = () => {
    console.log('Exporting to PDF...');
    // Implementation would go here
  };

  const exportToExcel = () => {
    console.log('Exporting to Excel...');
    // Implementation would go here
  };

  const exportToCSV = () => {
    console.log('Exporting to CSV...');
    // Implementation would go here
  };

  // Quick action handlers
  const handleExportReport = () => {
    console.log('Exporting comprehensive report...');
    // Implementation would go here
  };

  const handleScheduleReport = () => {
    console.log('Scheduling report...');
    // Implementation would go here
  };

  const handleFilterData = () => {
    console.log('Opening data filters...');
    // Implementation would go here
  };

  const handleViewDetails = () => {
    console.log('Viewing detailed analytics...');
    // Implementation would go here
  };

  if (loading) {
    return (
      <div className="analytics-container">
        <div className="analytics-header">
          <h1>Analytics & Reports</h1>
        </div>
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading analytics data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="analytics-container">
      <BankingAlert onComplete={handleCompleteBanking} />
      {/* Header */}
      <div className="analytics-header">
        <div className="header-content">
          <div className="header-title">
            <BarChart3 size={28} />
            <h1>Analytics & Reports</h1>
          </div>
          <div className="header-actions">
            <div className="period-selector">
              <select 
                value={selectedPeriod} 
                onChange={(e) => handlePeriodChange(e.target.value)}
                className="period-select"
              >
                <option value="semester">This Semester</option>
                <option value="year">This Year</option>
                <option value="academic">Academic Year</option>
              </select>
            </div>
            <div className="export-buttons">
              <button className="btn btn-outline btn-sm" onClick={exportToPDF}>
                <Download size={16} />
                PDF
              </button>
              <button className="btn btn-outline btn-sm" onClick={exportToExcel}>
                <Download size={16} />
                Excel
              </button>
              <button className="btn btn-outline btn-sm" onClick={exportToCSV}>
                <Download size={16} />
                CSV
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="metrics-grid">
        <div className="metric-card primary">
          <div className="metric-header">
            <div className="metric-icon">
              <Home size={24} />
            </div>
            <div className="metric-trend up">
              <TrendingUp size={16} />
              +{analyticsData.occupancy.current - analyticsData.occupancy.previous}%
            </div>
          </div>
          <div className="metric-content">
            <div className="metric-value">{analyticsData.occupancy.current}%</div>
            <div className="metric-label">Occupancy Rate</div>
            <div className="metric-comparison">
              {analyticsData.occupancy.occupied} of {analyticsData.occupancy.total} rooms occupied
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
              +{Math.round(((analyticsData.revenue.current - analyticsData.revenue.previous) / analyticsData.revenue.previous) * 100)}%
            </div>
          </div>
          <div className="metric-content">
            <div className="metric-value">₵{analyticsData.revenue.current.toLocaleString()}</div>
            <div className="metric-label">Total Revenue</div>
            <div className="metric-comparison">
              ₵{analyticsData.revenue.breakdown.rent.toLocaleString()} from rent
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
              +{analyticsData.tenants.new} new this period
            </div>
          </div>
          <div className="metric-content">
            <div className="metric-value">{analyticsData.tenants.active}</div>
            <div className="metric-label">Active Tenants</div>
            <div className="metric-comparison">
              {analyticsData.tenants.leaving} leaving this period
            </div>
          </div>
        </div>

        <div className="metric-card warning">
          <div className="metric-header">
            <div className="metric-icon">
              <Star size={24} />
            </div>
            <div className="metric-trend up">
              <TrendingUp size={16} />
              +0.2
            </div>
          </div>
          <div className="metric-content">
            <div className="metric-value">{analyticsData.tenants.satisfaction}</div>
            <div className="metric-label">Satisfaction Rating</div>
            <div className="metric-comparison">
              Based on tenant feedback
            </div>
          </div>
        </div>
      </div>

      {/* Detailed Analytics Sections */}
      <div className="analytics-sections">
        {/* Room Type Performance */}
        <div className="analytics-section">
          <div className="section-header">
            <h3 className="section-title">
              <Building size={20} />
              Room Type Performance
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
            <div className="room-types-grid">
              {analyticsData.roomTypes.map((roomType, index) => (
                <div key={index} className="room-type-card">
                  <div className="room-type-header">
                    <h4>{roomType.type}</h4>
                    <span className="room-type-price">₵{roomType.price}/month</span>
                  </div>
                  <div className="room-type-stats">
                    <div className="stat-item">
                      <span className="stat-label">Rooms:</span>
                      <span className="stat-value">{roomType.rooms}</span>
                    </div>
                    <div className="stat-item">
                      <span className="stat-label">Capacity:</span>
                      <span className="stat-value">{roomType.capacity}</span>
                    </div>
                    <div className="stat-item">
                      <span className="stat-label">Revenue:</span>
                      <span className="stat-value">₵{roomType.revenue.toLocaleString()}</span>
                    </div>
                  </div>
                  <div className="room-type-occupancy">
                    <div className="occupancy-bar">
                      <div 
                        className="occupancy-fill" 
                        style={{ width: `${roomType.occupancy}%` }}
                      ></div>
                    </div>
                    <span className="occupancy-text">{roomType.occupancy}% occupied</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Gender Distribution */}
        <div className="analytics-section">
          <div className="section-header">
            <h3 className="section-title">
              <Users size={20} />
              Gender Distribution
            </h3>
          </div>
          <div className="section-content">
            <div className="gender-distribution">
              <div className="gender-card male">
                <div className="gender-icon">
                  <Users size={24} />
                </div>
                <div className="gender-stats">
                  <div className="gender-count">{analyticsData.gender.male}</div>
                  <div className="gender-label">Male Tenants</div>
                  <div className="gender-percentage">
                    {totalCapacity > 0 ? Math.round((analyticsData.gender.male / totalCapacity) * 100) : 0}%
                  </div>
                </div>
              </div>
              <div className="gender-card female">
                <div className="gender-icon">
                  <Users size={24} />
                </div>
                <div className="gender-stats">
                  <div className="gender-count">{analyticsData.gender.female}</div>
                  <div className="gender-label">Female Tenants</div>
                  <div className="gender-percentage">
                    {totalCapacity > 0 ? Math.round((analyticsData.gender.female / totalCapacity) * 100) : 0}%
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Amenities Analysis */}
        <div className="analytics-section">
          <div className="section-header">
            <h3 className="section-title">
              <Wifi size={20} />
              Amenities Analysis
            </h3>
            <div className="section-actions">
              <button 
                className="btn btn-outline btn-sm"
                onClick={() => setShowAmenitiesModal(true)}
              >
                <Eye size={16} />
                View All
              </button>
            </div>
          </div>
          <div className="section-content">
            <div className="amenities-grid">
              {Object.entries(analyticsData.amenities).map(([amenity, count]) => (
                <div key={amenity} className="amenity-card">
                  <div className="amenity-icon">
                    {getAmenityIcon(amenity)}
                  </div>
                  <div className="amenity-info">
                    <div className="amenity-name">{amenity}</div>
                    <div className="amenity-count">{count} rooms</div>
                  </div>
                </div>
              ))}
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
                <BarChart3 size={16} />
                View Chart
              </button>
            </div>
          </div>
          <div className="section-content">
            <div className="revenue-breakdown">
              <div className="revenue-item">
                <div className="revenue-label">Rent Collection</div>
                <div className="revenue-value">₵{analyticsData.revenue.breakdown.rent.toLocaleString()}</div>
                <div className="revenue-bar">
                  <div className="bar-fill primary" style={{ width: '100%' }}></div>
                </div>
              </div>
              <div className="revenue-item">
                <div className="revenue-label">Utilities</div>
                <div className="revenue-value">₵{analyticsData.revenue.breakdown.utilities.toLocaleString()}</div>
                <div className="revenue-bar">
                  <div className="bar-fill secondary" style={{ width: '0%' }}></div>
                </div>
              </div>
              <div className="revenue-item">
                <div className="revenue-label">Additional Services</div>
                <div className="revenue-value">₵{analyticsData.revenue.breakdown.services.toLocaleString()}</div>
                <div className="revenue-bar">
                  <div className="bar-fill tertiary" style={{ width: '0%' }}></div>
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
                <div className="satisfaction-value">{analyticsData.tenants.satisfaction}/5.0</div>
                <div className="satisfaction-stars">
                  {[...Array(5)].map((_, i) => (
                    <Star 
                      key={i} 
                      size={16} 
                      className={i < Math.floor(analyticsData.tenants.satisfaction) ? 'filled' : 'empty'} 
                    />
                  ))}
                </div>
              </div>
              <div className="satisfaction-item">
                <div className="satisfaction-label">New Tenants</div>
                <div className="satisfaction-value">{analyticsData.tenants.new}</div>
                <div className="satisfaction-trend positive">
                  <TrendingUp size={14} />
                  +{analyticsData.tenants.new} this period
                </div>
              </div>
              <div className="satisfaction-item">
                <div className="satisfaction-label">Retention Rate</div>
                <div className="satisfaction-value">{Math.round(((analyticsData.tenants.active - analyticsData.tenants.leaving) / analyticsData.tenants.active) * 100)}%</div>
                <div className="satisfaction-trend positive">
                  <TrendingUp size={14} />
                  {analyticsData.tenants.leaving} leaving
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
          <button className="action-btn" onClick={handleExportReport}>
            <Download size={20} />
            <span>Export Report</span>
          </button>
          <button className="action-btn" onClick={handleScheduleReport}>
            <Calendar size={20} />
            <span>Schedule Report</span>
          </button>
          <button className="action-btn" onClick={handleFilterData}>
            <Filter size={20} />
            <span>Filter Data</span>
          </button>
          <button className="action-btn" onClick={handleViewDetails}>
            <Eye size={20} />
            <span>View Details</span>
          </button>
        </div>
      </div>

      {/* Modals */}
      {showOccupancyModal && (
        <div className="modal-overlay" onClick={() => setShowOccupancyModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Room Occupancy Details</h3>
              <button className="modal-close" onClick={() => setShowOccupancyModal(false)}>
                <X size={20} />
              </button>
            </div>
            <div className="modal-body">
              <p>Detailed occupancy information for all room types.</p>
              <div className="occupancy-details">
                {analyticsData.roomTypes.map((roomType, index) => (
                  <div key={index} className="detail-item">
                    <h4>{roomType.type}</h4>
                    <p>Rooms: {roomType.rooms}</p>
                    <p>Capacity: {roomType.capacity}</p>
                    <p>Occupancy: {roomType.occupancy}%</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {showRevenueModal && (
        <div className="modal-overlay" onClick={() => setShowRevenueModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Revenue Analysis</h3>
              <button className="modal-close" onClick={() => setShowRevenueModal(false)}>
                <X size={20} />
              </button>
            </div>
            <div className="modal-body">
              <p>Detailed revenue breakdown and trends.</p>
              <div className="revenue-details">
                <div className="detail-item">
                  <h4>Total Revenue</h4>
                  <p>₵{analyticsData.revenue.current.toLocaleString()}</p>
                </div>
                <div className="detail-item">
                  <h4>Rent Collection</h4>
                  <p>₵{analyticsData.revenue.breakdown.rent.toLocaleString()}</p>
                </div>
                <div className="detail-item">
                  <h4>Previous Period</h4>
                  <p>₵{analyticsData.revenue.previous.toLocaleString()}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {showTenantModal && (
        <div className="modal-overlay" onClick={() => setShowTenantModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Tenant Performance Goals</h3>
              <button className="modal-close" onClick={() => setShowTenantModal(false)}>
                <X size={20} />
              </button>
            </div>
            <div className="modal-body">
              <p>Set and track tenant satisfaction and performance goals.</p>
              <div className="goals-form">
                <div className="form-group">
                  <label>Satisfaction Target</label>
                  <input type="number" min="1" max="5" step="0.1" defaultValue="4.5" />
                </div>
                <div className="form-group">
                  <label>Retention Rate Target</label>
                  <input type="number" min="0" max="100" step="1" defaultValue="85" />
                </div>
                <button className="btn btn-primary" onClick={() => setShowTenantModal(false)}>
                  Save Goals
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showAmenitiesModal && (
        <div className="modal-overlay" onClick={() => setShowAmenitiesModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>All Amenities</h3>
              <button className="modal-close" onClick={() => setShowAmenitiesModal(false)}>
                <X size={20} />
              </button>
            </div>
            <div className="modal-body">
              <p>Complete list of amenities available in the hostel.</p>
              <div className="amenities-list">
                {Object.entries(analyticsData.amenities).map(([amenity, count]) => (
                  <div key={amenity} className="amenity-item">
                    <div className="amenity-icon">
                      {getAmenityIcon(amenity)}
                    </div>
                    <div className="amenity-info">
                      <h4>{amenity}</h4>
                      <p>{count} rooms have this amenity</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Helper function to get amenity icons
const getAmenityIcon = (amenity) => {
  const iconMap = {
    'WiFi': <Wifi size={20} />,
    'Parking': <Car size={20} />,
    'Kitchen': <Utensils size={20} />,
    'Gym': <Dumbbell size={20} />,
    'Study Room': <BookOpen size={20} />,
    'Hot Water': <Droplets size={20} />,
    'TV': <Tv size={20} />,
    'Air Conditioning': <AirVent size={20} />,
    'Laundry': <Activity size={20} />
  };
  return iconMap[amenity] || <Home size={20} />;
};

export default Analytics;
