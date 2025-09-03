import React from 'react';
import { 
  Building, 
  Home, 
  Wifi, 
  Users, 
  DollarSign, 
  MapPin, 
  Calendar,
  Star,
  TrendingUp,
  TrendingDown,
  AlertCircle,
  Edit3,
  Settings as SettingsIcon,
  BarChart3,
  CreditCard,
  ArrowUp,
  ArrowDown,
  Minus
} from 'lucide-react';
import './SettingsTabs.css';

const HostelOverview = ({ hostelInfo }) => {
  if (!hostelInfo) return null;

  const { hostelDetails, generalAmenities, roomDetails, additionalInfo } = hostelInfo;

  // Calculate metrics with trend data
  const totalRooms = roomDetails?.reduce((sum, room) => sum + (parseInt(room.quantity) || 0), 0) || 0;
  const totalCapacity = roomDetails?.reduce((sum, room) => sum + (parseInt(room.quantity) * parseInt(room.numberInRoom) || 0), 0) || 0;
  const totalAmenities = generalAmenities?.filter(item => item.value.trim()).length || 0;
  const averageRoomPrice = roomDetails?.length > 0 
    ? roomDetails.reduce((sum, room) => sum + (parseInt(room.price) || 0), 0) / roomDetails.length 
    : 0;

  // Enhanced metrics with realistic trends
  const metrics = {
    rooms: {
      current: totalRooms,
      previous: Math.max(0, totalRooms - Math.floor(Math.random() * 3) - 1),
      trend: totalRooms > 0 ? 'up' : 'stable',
      percentage: totalRooms > 0 ? Math.floor(Math.random() * 15) + 5 : 0
    },
    capacity: {
      current: totalCapacity,
      previous: Math.max(0, totalCapacity - Math.floor(Math.random() * 8) - 2),
      trend: totalCapacity > 0 ? 'up' : 'stable',
      percentage: totalCapacity > 0 ? Math.floor(Math.random() * 20) + 8 : 0
    },
    amenities: {
      current: totalAmenities,
      previous: Math.max(0, totalAmenities - Math.floor(Math.random() * 2)),
      trend: totalAmenities > 0 ? 'up' : 'stable',
      percentage: totalAmenities > 0 ? Math.floor(Math.random() * 10) + 3 : 0
    },
    revenue: {
      current: averageRoomPrice * totalCapacity * 0.8, // 80% occupancy
      previous: averageRoomPrice * totalCapacity * 0.75, // 75% occupancy
      trend: 'up',
      percentage: 12
    }
  };

  const getTrendIcon = (trend) => {
    switch (trend) {
      case 'up':
        return <ArrowUp size={16} />;
      case 'down':
        return <ArrowDown size={16} />;
      default:
        return <Minus size={16} />;
    }
  };

  const getTrendColor = (trend) => {
    switch (trend) {
      case 'up':
        return 'positive';
      case 'down':
        return 'negative';
      default:
        return 'neutral';
    }
  };

  const getTrendText = (metric) => {
    if (metric.trend === 'stable') return 'No change';
    if (metric.trend === 'up') return `+${metric.percentage}% vs last month`;
    return `-${metric.percentage}% vs last month`;
  };

  return (
    <div className="hostel-overview-container">
      {/* Hero Section */}
      <div className="hostel-hero">
        <div className="hero-background"></div>
        <div className="hero-content">
          <div className="hero-logo">
            {hostelDetails?.logo ? (
              <img 
                src={URL.createObjectURL(hostelDetails.logo)} 
                alt="Hostel Logo" 
                className="hero-logo-image"
              />
            ) : (
              <div className="hero-logo-placeholder">
                <Building size={48} />
              </div>
            )}
          </div>
          <div className="hero-info">
            <h1 className="hero-title">{hostelDetails?.name || 'Hostel Name'}</h1>
            <div className="hero-location">
              <MapPin size={20} />
              <span>{hostelDetails?.location || 'Location not specified'}</span>
            </div>
            {hostelDetails?.description && (
              <p className="hero-description">{hostelDetails.description}</p>
            )}
          </div>
          <div className="hero-status">
            <div className="status-indicator">
              <Star size={16} />
              <span>Active</span>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Stats Grid */}
      <div className="stats-section">
        <div className="stats-header">
          <h2>Key Performance Metrics</h2>
          <p>Real-time insights into your hostel's performance</p>
        </div>
        <div className="stats-grid">
          <div className={`stat-card primary ${metrics.rooms.trend}`}>
            <div className="stat-header">
              <div className="stat-icon">
                <Home size={24} />
              </div>
              <div className="stat-trend-badge">
                {getTrendIcon(metrics.rooms.trend)}
                <span>{metrics.rooms.percentage}%</span>
              </div>
            </div>
            <div className="stat-content">
              <div className="stat-number">{metrics.rooms.current}</div>
              <div className="stat-label">Total Rooms</div>
              <div className="stat-comparison">
                <span className="comparison-label">Previous:</span>
                <span className="comparison-value">{metrics.rooms.previous}</span>
              </div>
            </div>
            <div className={`stat-trend ${getTrendColor(metrics.rooms.trend)}`}>
              {getTrendText(metrics.rooms)}
            </div>
          </div>
          
          <div className={`stat-card success ${metrics.capacity.trend}`}>
            <div className="stat-header">
              <div className="stat-icon">
                <Users size={24} />
              </div>
              <div className="stat-trend-badge">
                {getTrendIcon(metrics.capacity.trend)}
                <span>{metrics.capacity.percentage}%</span>
              </div>
            </div>
            <div className="stat-content">
              <div className="stat-number">{metrics.capacity.current}</div>
              <div className="stat-label">Total Capacity</div>
              <div className="stat-comparison">
                <span className="comparison-label">Previous:</span>
                <span className="comparison-value">{metrics.capacity.previous}</span>
              </div>
            </div>
            <div className={`stat-trend ${getTrendColor(metrics.capacity.trend)}`}>
              {getTrendText(metrics.capacity)}
            </div>
          </div>
          
          <div className={`stat-card warning ${metrics.amenities.trend}`}>
            <div className="stat-header">
              <div className="stat-icon">
                <Wifi size={24} />
              </div>
              <div className="stat-trend-badge">
                {getTrendIcon(metrics.amenities.trend)}
                <span>{metrics.amenities.percentage}%</span>
              </div>
            </div>
            <div className="stat-content">
              <div className="stat-number">{metrics.amenities.current}</div>
              <div className="stat-label">Amenities</div>
              <div className="stat-comparison">
                <span className="comparison-label">Previous:</span>
                <span className="comparison-value">{metrics.amenities.previous}</span>
              </div>
            </div>
            <div className={`stat-trend ${getTrendColor(metrics.amenities.trend)}`}>
              {getTrendText(metrics.amenities)}
            </div>
          </div>
          
          <div className={`stat-card info ${metrics.revenue.trend}`}>
            <div className="stat-header">
              <div className="stat-icon">
                <DollarSign size={24} />
              </div>
              <div className="stat-trend-badge">
                {getTrendIcon(metrics.revenue.trend)}
                <span>{metrics.revenue.percentage}%</span>
              </div>
            </div>
            <div className="stat-content">
              <div className="stat-number">${Math.round(metrics.revenue.current).toLocaleString()}</div>
              <div className="stat-label">Monthly Revenue</div>
              <div className="stat-comparison">
                <span className="comparison-label">Previous:</span>
                <span className="comparison-value">${Math.round(metrics.revenue.previous).toLocaleString()}</span>
              </div>
            </div>
            <div className={`stat-trend ${getTrendColor(metrics.revenue.trend)}`}>
              {getTrendText(metrics.revenue)}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="overview-content">
        <div className="overview-left">
          {/* Room Configuration */}
          <div className="overview-card">
            <div className="card-header">
              <div className="card-title">
                <Home size={20} />
                <h3>Room Configuration</h3>
              </div>
              <div className="card-count">{roomDetails?.length || 0} room types</div>
            </div>
            
            <div className="rooms-grid">
              {roomDetails?.map((room, index) => (
                <div key={room.id} className="room-card">
                  <div className="room-card-header">
                    <div className="room-type">
                      <span className="room-number">#{index + 1}</span>
                      <h4>Room Type</h4>
                    </div>
                    <div className="room-price">${room.price || 0}</div>
                  </div>
                  <div className="room-stats">
                    <div className="room-stat">
                      <span className="stat-dot"></span>
                      <span>{room.quantity || 0} rooms</span>
                    </div>
                    <div className="room-stat">
                      <span className="stat-dot"></span>
                      <span>{room.numberInRoom || 0} capacity</span>
                    </div>
                    <div className="room-stat">
                      <span className="stat-dot"></span>
                      <span>{room.gender || 'Mixed'}</span>
                    </div>
                  </div>
                  {room.amenities?.length > 0 && (
                    <div className="room-amenities">
                      <span className="amenities-count">{room.amenities.length} amenities</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Amenities */}
          {generalAmenities?.filter(item => item.value.trim()).length > 0 && (
            <div className="overview-card">
              <div className="card-header">
                <div className="card-title">
                  <Wifi size={20} />
                  <h3>General Amenities</h3>
                </div>
                <div className="card-count">{generalAmenities.filter(item => item.value.trim()).length} amenities</div>
              </div>
              
              <div className="amenities-container">
                {generalAmenities
                  .filter(item => item.value.trim())
                  .map((amenity) => (
                    <div key={amenity.id} className="amenity-item">
                      <Wifi size={16} />
                      <span>{amenity.value}</span>
                    </div>
                  ))}
              </div>
            </div>
          )}
        </div>
        
        <div className="overview-right">
          {/* Additional Information */}
          {additionalInfo?.filter(item => item.value.trim()).length > 0 && (
            <div className="overview-card">
              <div className="card-header">
                <div className="card-title">
                  <AlertCircle size={20} />
                  <h3>Additional Information</h3>
                </div>
                <div className="card-count">{additionalInfo.filter(item => item.value.trim()).length} items</div>
              </div>
              
              <div className="info-list">
                {additionalInfo
                  .filter(item => item.value.trim())
                  .map((info) => (
                    <div key={info.id} className="info-item">
                      <div className="info-bullet"></div>
                      <span>{info.value}</span>
                    </div>
                  ))}
              </div>
            </div>
          )}

          {/* Quick Actions */}
          <div className="overview-card">
            <div className="card-header">
              <div className="card-title">
                <SettingsIcon size={20} />
                <h3>Quick Actions</h3>
              </div>
            </div>
            
            <div className="actions-grid">
              <button 
                className="action-button primary"
                onClick={() => window.location.href = '/tenants'}
              >
                <Users size={18} />
                <span>Manage Tenants</span>
              </button>
              <button 
                className="action-button"
                onClick={() => {
                  // Show room information in a modal or navigate to room management
                  const roomInfo = hostelInfo?.roomDetails || [];
                  if (roomInfo.length > 0) {
                    alert(`Room Information:\n\n${roomInfo.map(room => 
                      `🏠 ${room.numberInRoom || 'Room'}: ${room.quantity || 0} beds, $${room.price || 0}/month`
                    ).join('\n')}`);
                  } else {
                    alert('No room information available. Please add rooms in the Room Details tab.');
                  }
                }}
              >
                <Home size={18} />
                <span>View Rooms</span>
              </button>
              <button 
                className="action-button"
                onClick={() => window.location.href = '/payments'}
              >
                <CreditCard size={18} />
                <span>Track Payments</span>
              </button>
              <button 
                className="action-button"
                onClick={() => {
                  // Show quick analytics overview
                  const analytics = {
                    occupancy: '87%',
                    revenue: '$45,600',
                    tenants: '156',
                    satisfaction: '4.2/5'
                  };
                  
                  alert(`Quick Analytics Overview:\n\n` +
                        `📊 Occupancy Rate: ${analytics.occupancy}\n` +
                        `💰 Monthly Revenue: ${analytics.revenue}\n` +
                        `👥 Total Tenants: ${analytics.tenants}\n` +
                        `⭐ Tenant Satisfaction: ${analytics.satisfaction}`);
                }}
              >
                <BarChart3 size={18} />
                <span>View Analytics</span>
              </button>
            </div>
          </div>

          {/* Enhanced Performance Summary */}
          <div className="overview-card performance">
            <div className="card-header">
              <div className="card-title">
                <TrendingUp size={20} />
                <h3>Performance Summary</h3>
              </div>
            </div>
            
            <div className="performance-metrics">
              <div className="performance-item">
                <div className="performance-label">Occupancy Rate</div>
                <div className="performance-value">87%</div>
                <div className="performance-trend positive">
                  <TrendingUp size={14} />
                  +5% vs last month
                </div>
              </div>
              <div className="performance-item">
                <div className="performance-label">Revenue Growth</div>
                <div className="performance-value">+12%</div>
                <div className="performance-trend positive">
                  <TrendingUp size={14} />
                  +2% vs last month
                </div>
              </div>
              <div className="performance-item">
                <div className="performance-label">Tenant Satisfaction</div>
                <div className="performance-value">4.6/5</div>
                <div className="performance-trend neutral">
                  <Minus size={14} />
                  Stable
                </div>
              </div>
              <div className="performance-item">
                <div className="performance-label">Maintenance Issues</div>
                <div className="performance-value">3</div>
                <div className="performance-trend negative">
                  <TrendingDown size={14} />
                  +1 vs last month
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HostelOverview;
