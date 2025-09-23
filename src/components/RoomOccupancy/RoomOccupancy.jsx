import React, { useState, useEffect } from 'react';
import { Home, Users, UserCheck, UserX, MapPin } from 'lucide-react';
import { API_ENDPOINTS } from '../../config/api';
import { getRoomTypeName } from '../../utils/roomUtils';
import './RoomOccupancy.css';

const RoomOccupancy = ({ hostelInfo }) => {
  const [tenants, setTenants] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch tenants data
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
          // Transform API data to match frontend expected format
          const transformedTenants = data.tenants.map((tenant) => ({
            id: tenant.id,
            name: tenant.user?.username || "Unknown",
            email: tenant.user?.email || "No email",
            phone: tenant.user?.phone || "No phone",
            room: tenant.room_uuid || "No room assigned",
            roomUuid: tenant.room_uuid,
            checkInDate: tenant.date_created
              ? new Date(tenant.date_created).toISOString().split("T")[0]
              : "Unknown",
            status: tenant.is_active ? "active" : "inactive",
            rentAmount: tenant.amount || 0,
            reference: tenant.reference,
            hostel: tenant.hostel,
            originalData: tenant,
          }));
          setTenants(transformedTenants);
        }
        
      } catch (err) {
        console.error('Error fetching tenants for room occupancy:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchTenants();
  }, []);

  // Calculate room occupancy
  const getRoomOccupancy = () => {
    if (!hostelInfo?.room_details || !tenants.length) {
      return [];
    }

    // Get all unique room UUIDs from tenants
    const occupiedRooms = new Set(tenants.map(tenant => tenant.roomUuid).filter(Boolean));
    
    // Create room occupancy data
    const roomOccupancy = hostelInfo.room_details.map((roomType, index) => {
      const roomCapacity = parseInt(roomType.number_of_rooms || 0) * parseInt(roomType.number_in_room || 0);
      
      // For now, we'll estimate occupancy based on total tenants vs total capacity
      // In a real system, you'd map room_uuid to specific room types
      const totalOccupied = occupiedRooms.size;
      const totalCapacity = hostelInfo.room_details.reduce((sum, rt) => 
        sum + (parseInt(rt.number_of_rooms || 0) * parseInt(rt.number_in_room || 0)), 0);
      
      const estimatedOccupied = totalCapacity > 0 ? Math.round((roomCapacity / totalCapacity) * totalOccupied) : 0;
      const available = Math.max(0, roomCapacity - estimatedOccupied);
      
      return {
        id: roomType.id || index,
        type: `${roomType.number_in_room || 'N/A'}-Person Room`,
        totalRooms: parseInt(roomType.number_of_rooms || 0),
        capacityPerRoom: parseInt(roomType.number_in_room || 0),
        totalCapacity: roomCapacity,
        occupied: estimatedOccupied,
        available: available,
        occupancyRate: roomCapacity > 0 ? Math.round((estimatedOccupied / roomCapacity) * 100) : 0,
        price: parseFloat(roomType.price || 0),
        gender: roomType.gender || 'mixed'
      };
    });

    return roomOccupancy;
  };

  const roomOccupancy = getRoomOccupancy();

  if (loading) {
    return (
      <div className="room-occupancy">
        <div className="loading-state">
          <div className="loading-spinner"></div>
          <p>Loading room occupancy data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="room-occupancy">
      <div className="room-occupancy-header">
        <Home className="header-icon" />
        <div>
          <h3>Room Occupancy</h3>
          <p>Real-time room availability and occupancy status</p>
        </div>
      </div>

      <div className="occupancy-summary">
        <div className="summary-card">
          <div className="summary-icon total">
            <Home size={20} />
          </div>
          <div className="summary-content">
            <span className="summary-label">Total Rooms</span>
            <span className="summary-value">
              {roomOccupancy.reduce((sum, room) => sum + room.totalRooms, 0)}
            </span>
          </div>
        </div>

        <div className="summary-card">
          <div className="summary-icon occupied">
            <UserCheck size={20} />
          </div>
          <div className="summary-content">
            <span className="summary-label">Occupied</span>
            <span className="summary-value">
              {roomOccupancy.reduce((sum, room) => sum + room.occupied, 0)}
            </span>
          </div>
        </div>

        <div className="summary-card">
          <div className="summary-icon available">
            <UserX size={20} />
          </div>
          <div className="summary-content">
            <span className="summary-label">Available</span>
            <span className="summary-value">
              {roomOccupancy.reduce((sum, room) => sum + room.available, 0)}
            </span>
          </div>
        </div>

        <div className="summary-card">
          <div className="summary-icon rate">
            <Users size={20} />
          </div>
          <div className="summary-content">
            <span className="summary-label">Occupancy Rate</span>
            <span className="summary-value">
              {(() => {
                const totalOccupied = roomOccupancy.reduce((sum, room) => sum + room.occupied, 0);
                const totalCapacity = roomOccupancy.reduce((sum, room) => sum + room.totalCapacity, 0);
                return totalCapacity > 0 ? Math.round((totalOccupied / totalCapacity) * 100) : 0;
              })()}%
            </span>
          </div>
        </div>
      </div>

      <div className="room-types-grid">
        {roomOccupancy.map((room) => (
          <div key={room.id} className="room-type-card">
            <div className="room-type-header">
              <div className="room-type-info">
                <h4>{room.type}</h4>
                <p>{room.totalRooms} rooms • {room.capacityPerRoom} beds each</p>
              </div>
              <div className="room-type-price">
                <span className="price">₵{room.price.toLocaleString()}</span>
                <span className="price-label">per room</span>
              </div>
            </div>

            <div className="room-type-stats">
              <div className="stat-item">
                <span className="stat-label">Total Capacity</span>
                <span className="stat-value">{room.totalCapacity} beds</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">Occupied</span>
                <span className="stat-value occupied">{room.occupied} beds</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">Available</span>
                <span className="stat-value available">{room.available} beds</span>
              </div>
            </div>

            <div className="occupancy-bar">
              <div className="occupancy-fill" style={{ width: `${room.occupancyRate}%` }}></div>
            </div>
            <div className="occupancy-rate">
              <span>{room.occupancyRate}% occupied</span>
            </div>

            <div className="room-type-footer">
              <div className="gender-badge">
                <MapPin size={14} />
                <span>
                  {room.gender === 'mixed' 
                    ? `${room.gender?.male || room.male_rooms || 0} Male, ${room.gender?.female || room.female_rooms || 0} Female` 
                    : room.gender === 'male' 
                    ? `${room.gender?.male || room.male_rooms || 0} Male Only` 
                    : room.gender === 'female'
                    ? `${room.gender?.female || room.female_rooms || 0} Female Only`
                    : 'Gender Not Set'
                  }
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {tenants.length > 0 && (
        <div className="tenant-room-mapping">
          <h4>Current Tenant Room Assignments</h4>
          <div className="tenant-list">
            {tenants.map((tenant) => (
              <div key={tenant.id} className="tenant-item">
                <div className="tenant-info">
                  <span className="tenant-name">{tenant.name}</span>
                  <span className="tenant-room">Room: {getRoomTypeName(tenant.roomUuid, hostelInfo)}</span>
                </div>
                <div className="tenant-status">
                  <span className={`status-badge ${tenant.status}`}>
                    {tenant.status}
                  </span>
                  <span className="rent-amount">₵{tenant.rentAmount.toLocaleString()}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default RoomOccupancy;
