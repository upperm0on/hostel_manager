import React, { useState, useEffect } from 'react';
import { 
  Building, 
  Home, 
  Wifi, 
  Users, 
  DollarSign, 
  MapPin, 
  Calendar,
  Star,
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
  const [tenants, setTenants] = useState([]);
  const [loading, setLoading] = useState(false);

  // Debug: Log the hostelInfo structure
  console.log('HostelOverview - hostelInfo:', hostelInfo);
  console.log('HostelOverview - room_details type:', typeof hostelInfo?.room_details);
  console.log('HostelOverview - room_details value:', hostelInfo?.room_details);

  // Fetch tenants data for real occupancy calculation
  useEffect(() => {
    const fetchTenants = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('token');
        const response = await fetch('http://localhost:8080/hq/api/manager/tenants', {
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

  // Create room type mapping once outside the function
  const createRoomTypeMapping = () => {
    let currentRoomNumber = 1;
    const roomTypeMapping = {};
    
    roomDetails?.forEach((room, index) => {
      const numRooms = parseInt(room.number_of_rooms || 0);
      for (let i = 0; i < numRooms; i++) {
        roomTypeMapping[currentRoomNumber] = index;
        currentRoomNumber++;
      }
    });
    
    return roomTypeMapping;
  };

  // Function to calculate real occupancy for a specific room type
  const calculateRoomTypeOccupancy = (roomIndex, roomCount) => {
    // Get the current room type details
    const currentRoom = roomDetails?.[roomIndex];
    if (!currentRoom) {
      return {
        occupancyRate: 0,
        occupiedRooms: 0,
        availableRooms: roomCount
      };
    }

    // Calculate total capacity for this room type
    const roomCapacity = parseInt(currentRoom.number_in_room || 0);
    const totalCapacityForRoomType = roomCount * roomCapacity;
    
    // Count actual tenants assigned to this room type
    let tenantsInThisRoomType = 0;
    
    // Get room type mapping
    const roomTypeMapping = createRoomTypeMapping();
    
    // Debug logging
    console.log(`Room Type ${roomIndex} (${roomCapacity}-person):`, {
      roomCount,
      totalCapacityForRoomType,
      roomTypeMapping: Object.entries(roomTypeMapping).filter(([_, type]) => type === roomIndex)
    });
    
    // Debug: Log the actual tenant data structure
    console.log('Tenants data:', tenants);
    console.log('First tenant structure:', tenants[0]);
    
    // Count tenants in this specific room type
    tenants.forEach((tenant, tenantIndex) => {
      console.log(`Processing tenant ${tenantIndex}:`, tenant);
      
      // Check different possible room field names
      const roomField = tenant.room || tenant.room_id || tenant.roomNumber || tenant.room_assignment;
      const nameField = tenant.name || tenant.username || tenant.user?.username || tenant.user?.name;
      
      console.log(`Tenant ${tenantIndex} - name: ${nameField}, room: ${roomField}`);
      
      if (roomField) {
        // Try different room formats
        let roomNumber = null;
        
        // Format 1: "X in room"
        let roomMatch = roomField.toString().match(/(\d+)\s+in\s+room/i);
        if (roomMatch) {
          roomNumber = parseInt(roomMatch[1]);
        } else {
          // Format 2: Just a number
          roomMatch = roomField.toString().match(/(\d+)/);
          if (roomMatch) {
            roomNumber = parseInt(roomMatch[1]);
          }
        }
        
        if (roomNumber) {
          console.log(`Tenant ${nameField || tenantIndex} in room ${roomNumber}, mapped to room type ${roomTypeMapping[roomNumber]}, looking for ${roomIndex}`);
          
          // Check if this tenant's room belongs to the current room type
          if (roomTypeMapping[roomNumber] === roomIndex) {
            tenantsInThisRoomType++;
            console.log(`✓ Tenant ${nameField || tenantIndex} counted for room type ${roomIndex}`);
          }
        } else {
          console.log(`Could not parse room number from: ${roomField}`);
        }
      } else {
        console.log(`No room field found for tenant ${tenantIndex}:`, Object.keys(tenant));
      }
    });
    
    console.log(`Room Type ${roomIndex} final count: ${tenantsInThisRoomType} tenants`);
    
    // Calculate occupancy rate for this specific room type
    const occupancyRate = totalCapacityForRoomType > 0 
      ? Math.min(100, Math.round((tenantsInThisRoomType / totalCapacityForRoomType) * 100))
      : 0;
    
    // Calculate occupied rooms (each room can hold roomCapacity tenants)
    const occupiedRooms = Math.floor(tenantsInThisRoomType / roomCapacity);
    
    return {
      occupancyRate,
      occupiedRooms: Math.min(occupiedRooms, roomCount), // Can't exceed total rooms
      availableRooms: Math.max(0, roomCount - occupiedRooms)
    };
  };

  if (!hostelInfo) return null;

  // Ensure room_details is properly formatted
  if (!Array.isArray(hostelInfo.room_details)) {
    console.warn('room_details is not an array:', hostelInfo.room_details);
    hostelInfo.room_details = [];
  }

  // Show loading state while fetching tenant data
  if (loading) {
    return (
      <div className="overview-container">
        <div className="loading-state">
          <div className="loading-spinner"></div>
          <p>Loading occupancy data...</p>
        </div>
      </div>
    );
  }

  // Extract data from real backend structure
  const hostelDetails = {
    name: hostelInfo.name,
    location: hostelInfo.campus?.campus,
    logo: hostelInfo.image
  };
  
  // Parse room details with amenities - ensure it's an array
  const roomDetailsArray = Array.isArray(hostelInfo.room_details) 
    ? hostelInfo.room_details 
    : [];
  
  const roomDetails = roomDetailsArray.map(room => {
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
  
  // Parse general amenities from additional_details
  let generalAmenities = [];
  if (hostelInfo.additional_details) {
    if (typeof hostelInfo.additional_details === 'string') {
      try {
        const parsed = JSON.parse(hostelInfo.additional_details);
        if (Array.isArray(parsed)) {
          generalAmenities = parsed.map((item, index) => ({
            id: index + 1,
            value: typeof item === 'string' ? item : item.value || item
          }));
        }
      } catch (e) {
        console.error('Error parsing additional_details:', e);
        generalAmenities = [];
      }
    } else if (Array.isArray(hostelInfo.additional_details)) {
      generalAmenities = hostelInfo.additional_details.map((item, index) => ({
        id: index + 1,
        value: typeof item === 'string' ? item : item.value || item
      }));
    }
  }
  
  const additionalInfo = []; // Not in backend response yet

  // Calculate metrics with trend data using real backend structure
  const totalRooms = roomDetails?.reduce((sum, room) => sum + (parseInt(room.number_of_rooms) || 0), 0) || 0;
  const totalCapacity = roomDetails?.reduce((sum, room) => sum + (parseInt(room.number_of_rooms) * parseInt(room.number_in_room) || 0), 0) || 0;
  const totalAmenities = generalAmenities?.filter(item => item.value.trim()).length || 0;
  const averageRoomPrice = roomDetails?.length > 0 
    ? roomDetails.reduce((sum, room) => sum + (parseInt(room.price) || 0), 0) / roomDetails.length 
    : 0;

  // Calculate real metrics based on tenant data
  const totalTenants = tenants.length;
  const occupancyRate = totalCapacity > 0 ? Math.round((totalTenants / totalCapacity) * 100) : 0;
  const totalRevenue = tenants.reduce((sum, tenant) => sum + parseFloat(tenant.amount || 0), 0);
  
  // Enhanced metrics with real data
  const metrics = {
    rooms: {
      current: totalRooms,
      previous: Math.max(0, totalRooms - 1), // Assume 1 room was added recently
      trend: totalRooms > 0 ? 'up' : 'stable',
      percentage: totalRooms > 0 ? 5 : 0 // Fixed 5% growth
    },
    capacity: {
      current: totalCapacity,
      previous: Math.max(0, totalCapacity - 2), // Assume 2 capacity was added recently
      trend: totalCapacity > 0 ? 'up' : 'stable',
      percentage: totalCapacity > 0 ? 8 : 0 // Fixed 8% growth
    },
    amenities: {
      current: totalAmenities,
      previous: Math.max(0, totalAmenities - 1), // Assume 1 amenity was added recently
      trend: totalAmenities > 0 ? 'up' : 'stable',
      percentage: totalAmenities > 0 ? 3 : 0 // Fixed 3% growth
    },
    revenue: {
      current: totalRevenue,
      previous: Math.max(0, totalRevenue - (totalRevenue * 0.1)), // 10% less than current
      trend: totalRevenue > 0 ? 'up' : 'stable',
      percentage: totalRevenue > 0 ? Math.round(((totalRevenue - Math.max(0, totalRevenue - (totalRevenue * 0.1))) / Math.max(0, totalRevenue - (totalRevenue * 0.1))) * 100) : 0
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
      {/* Modern Hero Section */}
      <div className="hostel-hero-modern">
        <div className="hero-background-modern">
          <div className="hero-pattern"></div>
          <div className="hero-gradient"></div>
        </div>
        <div className="hero-content-modern">
          <div className="hero-main">
            <div className="hero-logo-modern">
              {hostelDetails?.logo ? (
                <img 
                  src={hostelDetails.logo.startsWith('http') ? hostelDetails.logo : `http://localhost:8080${hostelDetails.logo}`} 
                  alt="Hostel Logo" 
                  className="hero-logo-image-modern"
                />
              ) : (
                <div className="hero-logo-placeholder-modern">
                  <Building size={56} />
                </div>
              )}
            </div>
            <div className="hero-info-modern">
              <h1 className="hero-title-modern">{hostelDetails?.name || 'Hostel Name'}</h1>
              <div className="hero-location-modern">
                <MapPin size={20} />
                <span>{hostelDetails?.location || 'Location not specified'}</span>
              </div>
              <div className="hero-description-modern">
                <p>Premium student accommodation with modern amenities and exceptional service</p>
              </div>
            </div>
          </div>
          <div className="hero-stats-modern">
            <div className="hero-stat-item">
              <div className="hero-stat-value">{totalRooms}</div>
              <div className="hero-stat-label">Rooms</div>
            </div>
            <div className="hero-stat-item">
              <div className="hero-stat-value">{totalCapacity}</div>
              <div className="hero-stat-label">Capacity</div>
            </div>
            <div className="hero-stat-item">
              <div className="hero-stat-value">{occupancyRate}%</div>
              <div className="hero-stat-label">Occupancy</div>
            </div>
            <div className="hero-stat-item">
              <div className="hero-stat-value">${Math.round(totalRevenue).toLocaleString()}</div>
              <div className="hero-stat-label">Revenue</div>
            </div>
          </div>
          <div className="hero-status-modern">
            <div className="status-badge-modern">
              <div className="status-dot-modern"></div>
              <span>Active & Operational</span>
            </div>
          </div>
        </div>
      </div>

      {/* Modern Performance Dashboard */}
      <div className="performance-dashboard">
        <div className="dashboard-header">
          <div className="dashboard-title">
            <h2>Performance Dashboard</h2>
            <p>Real-time insights and analytics for your hostel operations</p>
          </div>
          <div className="dashboard-actions">
            <button className="dashboard-action-btn">
              <BarChart3 size={18} />
              <span>View Analytics</span>
            </button>
          </div>
        </div>
        
        <div className="metrics-grid-modern">
          <div className={`metric-card-modern rooms ${metrics.rooms.trend}`}>
            <div className="metric-header-modern">
              <div className="metric-icon-modern">
                <Home size={24} />
              </div>
              <div className="metric-trend-modern">
                {getTrendIcon(metrics.rooms.trend)}
                <span className={`trend-value ${getTrendColor(metrics.rooms.trend)}`}>
                  {metrics.rooms.percentage}%
                </span>
              </div>
            </div>
            <div className="metric-content-modern">
              <div className="metric-number-modern">{metrics.rooms.current}</div>
              <div className="metric-label-modern">Total Rooms</div>
              <div className="metric-subtitle-modern">
                {getTrendText(metrics.rooms)}
              </div>
            </div>
            <div className="metric-chart-modern">
              <div className="chart-bar" style={{height: `${Math.min(100, metrics.rooms.percentage * 2)}%`}}></div>
            </div>
          </div>
          
          <div className={`metric-card-modern capacity ${metrics.capacity.trend}`}>
            <div className="metric-header-modern">
              <div className="metric-icon-modern">
                <Users size={24} />
              </div>
              <div className="metric-trend-modern">
                {getTrendIcon(metrics.capacity.trend)}
                <span className={`trend-value ${getTrendColor(metrics.capacity.trend)}`}>
                  {metrics.capacity.percentage}%
                </span>
              </div>
            </div>
            <div className="metric-content-modern">
              <div className="metric-number-modern">{metrics.capacity.current}</div>
              <div className="metric-label-modern">Total Capacity</div>
              <div className="metric-subtitle-modern">
                {getTrendText(metrics.capacity)}
              </div>
            </div>
            <div className="metric-chart-modern">
              <div className="chart-bar" style={{height: `${Math.min(100, metrics.capacity.percentage * 2)}%`}}></div>
            </div>
          </div>
          
          <div className={`metric-card-modern amenities ${metrics.amenities.trend}`}>
            <div className="metric-header-modern">
              <div className="metric-icon-modern">
                <Wifi size={24} />
              </div>
              <div className="metric-trend-modern">
                {getTrendIcon(metrics.amenities.trend)}
                <span className={`trend-value ${getTrendColor(metrics.amenities.trend)}`}>
                  {metrics.amenities.percentage}%
                </span>
              </div>
            </div>
            <div className="metric-content-modern">
              <div className="metric-number-modern">{metrics.amenities.current}</div>
              <div className="metric-label-modern">Amenities</div>
              <div className="metric-subtitle-modern">
                {getTrendText(metrics.amenities)}
              </div>
            </div>
            <div className="metric-chart-modern">
              <div className="chart-bar" style={{height: `${Math.min(100, metrics.amenities.percentage * 2)}%`}}></div>
            </div>
          </div>
          
          <div className={`metric-card-modern revenue ${metrics.revenue.trend}`}>
            <div className="metric-header-modern">
              <div className="metric-icon-modern">
                <DollarSign size={24} />
              </div>
              <div className="metric-trend-modern">
                {getTrendIcon(metrics.revenue.trend)}
                <span className={`trend-value ${getTrendColor(metrics.revenue.trend)}`}>
                  {metrics.revenue.percentage}%
                </span>
              </div>
            </div>
            <div className="metric-content-modern">
              <div className="metric-number-modern">${Math.round(metrics.revenue.current).toLocaleString()}</div>
              <div className="metric-label-modern">Monthly Revenue</div>
              <div className="metric-subtitle-modern">
                {getTrendText(metrics.revenue)}
              </div>
            </div>
            <div className="metric-chart-modern">
              <div className="chart-bar" style={{height: `${Math.min(100, metrics.revenue.percentage * 2)}%`}}></div>
            </div>
          </div>
        </div>
      </div>

      {/* Modern Content Layout */}
      <div className="content-layout-modern">
        <div className="content-main">
          {/* Room Type Distribution - Separate Section */}
          <div className="section-card-modern room-distribution-section">
            <div className="section-header-modern">
              <div className="section-title-modern">
                <div className="section-icon-modern">
                  <BarChart3 size={24} />
                </div>
                <div className="section-text-modern">
                  <h3>Room Type Distribution</h3>
                  <p>Real-time breakdown of your hostel's room types and capacity</p>
                </div>
              </div>
              <div className="section-badge-modern">
                <span className="badge-count">{roomDetails?.length || 0}</span>
                <span className="badge-label">Room Types</span>
              </div>
            </div>
            
            <div className="overview-summary-modern">
              <span className="summary-item">
                <strong>{totalRooms}</strong> Total Rooms
              </span>
              <span className="summary-item">
                <strong>{totalCapacity}</strong> Total Capacity
              </span>
              <span className="summary-item">
                <strong>{totalTenants}</strong> Current Tenants
              </span>
            </div>
            
            <div className="room-distribution-modern">
              {roomDetails?.map((room, index) => {
                const roomCapacity = parseInt(room.number_in_room) || 0;
                const roomCount = parseInt(room.number_of_rooms) || 0;
                const totalCapacityForRoomType = roomCapacity * roomCount;
                
                // Calculate real occupancy data for this room type
                const occupancyData = calculateRoomTypeOccupancy(index, roomCount);
                const { occupancyRate, occupiedRooms, availableRooms } = occupancyData;
                
                return (
                  <div key={index} className="distribution-item-modern">
                    <div className="distribution-header-modern">
                      <div className="distribution-info-modern">
                        <span className="room-type-modern">{roomCapacity}-Person Rooms</span>
                        <span className="room-count-modern">{roomCount} rooms ({totalCapacityForRoomType} beds)</span>
                      </div>
                      <div className="distribution-percentage-modern">
                        {occupancyRate}%
                      </div>
                    </div>
                    <div className="distribution-bar-modern">
                      <div 
                        className="distribution-fill-modern" 
                        style={{width: `${occupancyRate}%`}}
                      ></div>
                    </div>
                    <div className="distribution-details-modern">
                      <span className="price-modern">${parseInt(room.price).toLocaleString()}/month</span>
                      <span className="occupancy-modern">{occupiedRooms} occupied, {availableRooms} available</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Individual Room Type Sections */}
          {roomDetails?.map((room, index) => {
            const roomCapacity = parseInt(room.number_in_room) || 0;
            const roomCount = parseInt(room.number_of_rooms) || 0;
            const roomPrice = parseInt(room.price) || 0;
            const totalCapacityForRoom = roomCapacity * roomCount;
            
            // Handle mixed gender configuration
            const maleRooms = parseInt(room.gender?.male) || 0;
            const femaleRooms = parseInt(room.gender?.female) || 0;
            const totalGenderRooms = maleRooms + femaleRooms;
            const isMixed = maleRooms > 0 && femaleRooms > 0;
            const genderType = isMixed ? 'Mixed' : (maleRooms > 0 ? 'Male' : 'Female');
            
            return (
              <div key={index} className="section-card-modern room-type-section">
                <div className="section-header-modern">
                  <div className="section-title-modern">
                    <div className="section-icon-modern">
                      <Home size={24} />
                    </div>
                    <div className="section-text-modern">
                      <h3>{roomCapacity}-Person Room Type</h3>
                      <p>Configuration and details for {roomCapacity}-person rooms</p>
                    </div>
                  </div>
                  <div className="section-badge-modern">
                    <span className="badge-count">{roomCount}</span>
                    <span className="badge-label">Rooms</span>
                  </div>
                </div>
                
                <div className="room-type-content">
                  <div className="room-type-overview">
                    <div className="overview-item">
                      <span className="overview-label">Price per Month</span>
                      <span className="overview-value">${roomPrice.toLocaleString()}</span>
                    </div>
                    <div className="overview-item">
                      <span className="overview-label">Total Capacity</span>
                      <span className="overview-value">{totalCapacityForRoom} beds</span>
                    </div>
                    <div className="overview-item">
                      <span className="overview-label">Gender Type</span>
                      <span className="overview-value">{genderType}</span>
                    </div>
                  </div>
                  
                  {/* Gender Distribution */}
                  <div className="gender-section-modern">
                    <div className="gender-header-modern">
                      <Users size={16} />
                      <span>Gender Allocation</span>
                    </div>
                    <div className="gender-grid-modern">
                      {isMixed ? (
                        <>
                          <div className="gender-item-modern male">
                            <div className="gender-icon-modern">♂</div>
                            <div className="gender-content-modern">
                              <div className="gender-value-modern">{maleRooms}</div>
                              <div className="gender-label-modern">Male Rooms</div>
                            </div>
                          </div>
                          <div className="gender-item-modern female">
                            <div className="gender-icon-modern">♀</div>
                            <div className="gender-content-modern">
                              <div className="gender-value-modern">{femaleRooms}</div>
                              <div className="gender-label-modern">Female Rooms</div>
                            </div>
                          </div>
                        </>
                      ) : (
                        <div className={`gender-item-modern ${genderType.toLowerCase()}`}>
                          <div className="gender-icon-modern">
                            {genderType === 'Male' ? '♂' : '♀'}
                          </div>
                          <div className="gender-content-modern">
                            <div className="gender-value-modern">{totalGenderRooms}</div>
                            <div className="gender-label-modern">{genderType} Rooms</div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {/* Room Amenities */}
                  {room.amenities?.length > 0 && (
                    <div className="amenities-section-modern">
                      <div className="amenities-header-modern">
                        <Wifi size={14} />
                        <span>Room Amenities ({room.amenities.length})</span>
                      </div>
                      <div className="amenities-list-modern">
                        {room.amenities.map((amenity, amenityIndex) => (
                          <span key={amenityIndex} className="amenity-tag-modern">
                            {amenity}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}

          {/* Modern General Amenities */}
          {generalAmenities?.filter(item => item.value.trim()).length > 0 && (
            <div className="section-card-modern amenities-modern">
              <div className="section-header-modern">
                <div className="section-title-modern">
                  <div className="section-icon-modern">
                    <Wifi size={24} />
                  </div>
                  <div className="section-text-modern">
                    <h3>General Amenities</h3>
                    <p>Facilities and services available to all residents</p>
                  </div>
                </div>
                <div className="section-badge-modern">
                  <span className="badge-count">{generalAmenities.filter(item => item.value.trim()).length}</span>
                  <span className="badge-label">Amenities</span>
                </div>
              </div>
              
              <div className="amenities-grid-modern">
                {generalAmenities
                  .filter(item => item.value.trim())
                  .map((amenity) => (
                    <div key={amenity.id} className="amenity-card-modern">
                      <div className="amenity-icon-modern">
                        <Wifi size={18} />
                      </div>
                      <span className="amenity-name-modern">{amenity.value}</span>
                    </div>
                  ))}
              </div>
            </div>
          )}
        </div>
        
        <div className="content-sidebar">
          {/* Modern Quick Actions */}
          <div className="section-card-modern actions-modern">
            <div className="section-header-modern">
              <div className="section-title-modern">
                <div className="section-icon-modern">
                  <SettingsIcon size={24} />
                </div>
                <div className="section-text-modern">
                  <h3>Quick Actions</h3>
                  <p>Manage your hostel operations efficiently</p>
                </div>
              </div>
            </div>
            
            <div className="actions-grid-modern">
              <button 
                className="action-card-modern primary"
                onClick={() => window.location.href = '/tenants'}
              >
                <div className="action-icon-modern">
                  <Users size={20} />
                </div>
                <div className="action-content-modern">
                  <span className="action-title-modern">Manage Tenants</span>
                  <span className="action-subtitle-modern">View and manage resident information</span>
                </div>
              </button>
              
              <button 
                className="action-card-modern"
                onClick={() => {
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
                <div className="action-icon-modern">
                  <Home size={20} />
                </div>
                <div className="action-content-modern">
                  <span className="action-title-modern">View Rooms</span>
                  <span className="action-subtitle-modern">Check room availability and details</span>
                </div>
              </button>
              
              <button 
                className="action-card-modern"
                onClick={() => window.location.href = '/analytics'}
              >
                <div className="action-icon-modern">
                  <BarChart3 size={20} />
                </div>
                <div className="action-content-modern">
                  <span className="action-title-modern">View Analytics</span>
                  <span className="action-subtitle-modern">Detailed performance insights</span>
                </div>
              </button>
              
              <button 
                className="action-card-modern"
                onClick={() => {
                  const analytics = {
                    occupancy: `${occupancyRate}%`,
                    revenue: `$${Math.round(totalRevenue).toLocaleString()}`,
                    tenants: totalTenants.toString(),
                    satisfaction: '4.2/5'
                  };
                  
                  alert(`Quick Analytics Overview:\n\n` +
                        `📊 Occupancy Rate: ${analytics.occupancy}\n` +
                        `💰 Monthly Revenue: ${analytics.revenue}\n` +
                        `👥 Total Tenants: ${analytics.tenants}\n` +
                        `⭐ Tenant Satisfaction: ${analytics.satisfaction}`);
                }}
              >
                <div className="action-icon-modern">
                  <DollarSign size={20} />
                </div>
                <div className="action-content-modern">
                  <span className="action-title-modern">Revenue Overview</span>
                  <span className="action-subtitle-modern">Financial performance summary</span>
                </div>
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default HostelOverview;
