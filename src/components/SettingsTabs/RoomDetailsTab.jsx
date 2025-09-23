import React, { useState, useEffect } from 'react';
import { Home, Plus, Users, DollarSign, Trash2, Settings, Edit3, Eye, EyeOff, Check, X, Upload, Image as ImageIcon, AlertTriangle } from 'lucide-react';
import './SettingsTabs.css';
import { getMinimumRoomsRequired } from '../../utils/roomUtils';
import { API_ENDPOINTS } from '../../config/api';

const RoomDetailsTab = ({ 
  roomDetails,
  onAddRoom,
  onRemoveRoom,
  onUpdateRoom,
  onOpenAmenityModal,
  validationErrors = {},
  hostelInfo
}) => {
  
  // Helper function to validate and fix gender allocation
  const validateAndFixGenderAllocation = (room) => {
    const totalRooms = parseInt(room.number_of_rooms) || 0;
    const maleRooms = parseInt(room.gender?.male || room.male_rooms) || 0;
    const femaleRooms = parseInt(room.gender?.female || room.female_rooms) || 0;
    
    if (room.gender === 'male') {
      // For male-only rooms, all rooms should be male
      if (maleRooms !== totalRooms || femaleRooms !== 0) {
        onUpdateRoom(room.id, 'male_rooms', totalRooms);
        onUpdateRoom(room.id, 'female_rooms', 0);
      }
    } else if (room.gender === 'female') {
      // For female-only rooms, all rooms should be female
      if (femaleRooms !== totalRooms || maleRooms !== 0) {
        onUpdateRoom(room.id, 'female_rooms', totalRooms);
        onUpdateRoom(room.id, 'male_rooms', 0);
      }
    } else if (room.gender === 'mixed') {
      // For mixed rooms, total should equal male + female
      const currentTotal = maleRooms + femaleRooms;
      if (currentTotal !== totalRooms) {
        // Auto-correct to even split
        const correctedMale = Math.ceil(totalRooms / 2);
        const correctedFemale = Math.max(0, totalRooms - correctedMale);
        onUpdateRoom(room.id, 'male_rooms', correctedMale);
        onUpdateRoom(room.id, 'female_rooms', correctedFemale);
      }
    }
  };

  // Comprehensive validation function for all rooms
  const validateAllRooms = () => {
    const errors = [];
    
    roomDetails.forEach((room, index) => {
      const totalRooms = parseInt(room.number_of_rooms) || 0;
      const maleRooms = parseInt(room.gender?.male || room.male_rooms) || 0;
      const femaleRooms = parseInt(room.gender?.female || room.female_rooms) || 0;
      
      // Check if gender allocation is valid
      if (room.gender === 'mixed') {
        const allocatedTotal = maleRooms + femaleRooms;
        if (allocatedTotal !== totalRooms) {
          errors.push(`Room ${index + 1}: Gender allocation (${allocatedTotal}) doesn't match total rooms (${totalRooms})`);
        }
        if (maleRooms < 0 || femaleRooms < 0) {
          errors.push(`Room ${index + 1}: Room counts cannot be negative`);
        }
      } else if (room.gender === 'male') {
        if (maleRooms !== totalRooms || femaleRooms !== 0) {
          errors.push(`Room ${index + 1}: Male-only rooms should have all rooms allocated to males`);
        }
      } else if (room.gender === 'female') {
        if (femaleRooms !== totalRooms || maleRooms !== 0) {
          errors.push(`Room ${index + 1}: Female-only rooms should have all rooms allocated to females`);
        }
      }
    });
    
    return errors;
  };
  const [editingRoom, setEditingRoom] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);
  const [hoveredRoom, setHoveredRoom] = useState(null);
  const [tenants, setTenants] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch tenants data to validate room counts
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
        // Transform tenant data to match expected format
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
      } catch (error) {
        console.error('Error fetching tenants for room validation:', error);
        setTenants([]);
      } finally {
        setLoading(false);
      }
    };

    fetchTenants();
  }, []);

  // Validate gender allocation whenever room details change
  useEffect(() => {
    roomDetails.forEach(room => {
      validateAndFixGenderAllocation(room);
    });
  }, [roomDetails]);

  const handleEditToggle = (roomId) => {
    setEditingRoom(editingRoom === roomId ? null : roomId);
  };

  const handleDeleteConfirm = (roomId) => {
    onRemoveRoom(roomId);
    setShowDeleteConfirm(null);
  };

  const getRoomStats = (room) => {
    const totalCapacity = (room.number_in_room || 0) * (room.number_of_rooms || 0);
    const totalRevenue = (room.price || 0) * (room.number_of_rooms || 0);
    return { totalCapacity, totalRevenue };
  };

  const getFieldError = (roomId, fieldName) => {
    // Map display names to actual field names
    const fieldMapping = {
      'room_label': 'room_label',
      'room_capacity': 'number_in_room',
      'number_of_rooms': 'number_of_rooms',
      'room_price': 'price',
      'male_rooms': 'male_rooms',
      'female_rooms': 'female_rooms'
    };
    
    const actualFieldName = fieldMapping[fieldName] || fieldName;
    const errorKey = `room_${roomId}_${actualFieldName}`;
    return validationErrors[errorKey] || null;
  };

  const hasFieldError = (roomId, fieldName) => {
    return getFieldError(roomId, fieldName) !== null;
  };

  // Get minimum rooms required for a room type based on current tenant count
  const getMinimumRoomsForRoom = (room) => {
    if (!room.room_uuid || !hostelInfo || !tenants.length) {
      return 0;
    }
    return getMinimumRoomsRequired(room.room_uuid, tenants, hostelInfo);
  };

  // Check if the number of rooms is below the minimum required
  const isBelowMinimumRooms = (room) => {
    const currentRooms = parseInt(room.number_of_rooms) || 0;
    const minimumRequired = getMinimumRoomsForRoom(room);
    return currentRooms < minimumRequired;
  };

  return (
    <div className="settings-tab-content">
      <div className="rooms-section">
        <div className="settings-section-header">
          <Home className="settings-section-icon" />
          <div>
            <h2 className="settings-section-title">Room Configuration</h2>
            <p className="settings-section-description">
              Set up your room types and pricing
            </p>
          </div>
        </div>

        {roomDetails.length === 0 ? (
          <div className="empty-rooms-state">
            <div className="empty-state-icon">
              <Home size={48} />
            </div>
            <h3>No Room Types Added</h3>
            <p>Add your first room type to get started</p>
            <button
              type="button"
              className="btn btn-primary"
              onClick={onAddRoom}
            >
              <Plus size={20} />
              Add Room Type
            </button>
          </div>
        ) : (
          <>
            <div className="rooms-grid-interactive">
              {roomDetails.map((room, index) => {
                const stats = getRoomStats(room);
                const isEditing = editingRoom === room.id;
                const isHovered = hoveredRoom === room.id;
                const isDeleteConfirming = showDeleteConfirm === room.id;
                
                return (
                  <div 
                    key={room.id} 
                    className={`room-card-interactive ${isEditing ? 'editing' : ''} ${isHovered ? 'hovered' : ''}`}
                    onMouseEnter={() => setHoveredRoom(room.id)}
                    onMouseLeave={() => setHoveredRoom(null)}
                  >
                    <div className="room-card-header">
                      <div className="room-type-info">
                        <div className="room-type-badge">
                          <span className="room-number">
                            {room.room_label || `${room.number_in_room || 'N/A'}-Person Room`}
                          </span>
                          <span className="room-label">Room Type</span>
                        </div>
                        <div className="room-quick-stats">
                          <div className="quick-stat">
                            <Users size={14} />
                            <span>{stats.totalCapacity} total beds</span>
                          </div>
                          <div className="quick-stat">
                            <DollarSign size={14} />
                            <span>₵{stats.totalRevenue.toLocaleString()}</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="room-actions">
                        <button
                          type="button"
                          className={`action-btn edit-btn ${isEditing ? 'active' : ''}`}
                          onClick={() => handleEditToggle(room.id)}
                          title={isEditing ? "Close Edit" : "Edit Room"}
                        >
                          {isEditing ? <X size={16} /> : <Edit3 size={16} />}
                        </button>
                        
                        {isDeleteConfirming ? (
                          <div className="delete-confirm">
                            <button
                              type="button"
                              className="action-btn confirm-btn"
                              onClick={() => handleDeleteConfirm(room.id)}
                              title="Confirm Delete"
                            >
                              <Check size={16} />
                            </button>
                            <button
                              type="button"
                              className="action-btn cancel-btn"
                              onClick={() => setShowDeleteConfirm(null)}
                              title="Cancel"
                            >
                              <X size={16} />
                            </button>
                          </div>
                        ) : (
                          <button
                            type="button"
                            className="action-btn delete-btn"
                            onClick={() => setShowDeleteConfirm(room.id)}
                            title="Delete Room Type"
                          >
                            <Trash2 size={16} />
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Collapsible Form Section */}
                    <div className={`room-form-collapsible ${isEditing ? 'expanded' : 'collapsed'}`}>
                      <div className="form-row">
                        <div className="form-group full-width">
                          <label className="form-label">
                            <Edit3 size={16} />
                            Room Label
                          </label>
                          <input
                            type="text"
                            className={`form-input ${hasFieldError(room.id, 'room_label') ? 'field-error' : ''}`}
                            placeholder="e.g., Deluxe Room, Standard Room, Economy Room"
                            value={room.room_label || ''}
                            onChange={(e) => onUpdateRoom(room.id, 'room_label', e.target.value)}
                          />
                          <small className="form-help">Give this room type a custom name</small>
                          {hasFieldError(room.id, 'room_label') && (
                            <div className="validation-error">
                              {getFieldError(room.id, 'room_label')}
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="form-row">
                        <div className="form-group">
                          <label className="form-label">
                            <Users size={16} />
                            Capacity per Room
                          </label>
                          <div className="input-with-suffix">
                            <input
                              type="number"
                              className={`form-input ${hasFieldError(room.id, 'room_capacity') ? 'field-error' : ''}`}
                              placeholder="2"
                              value={room.number_in_room}
                              onChange={(e) => {
                                const inputValue = e.target.value;
                                
                                // Allow empty string for typing
                                if (inputValue === '') {
                                  onUpdateRoom(room.id, 'number_in_room', '');
                                  return;
                                }
                                
                                // Only allow positive integers
                                const newCapacity = parseInt(inputValue);
                                if (isNaN(newCapacity) || newCapacity < 0) {
                                  return; // Don't update if invalid
                                }
                                
                                onUpdateRoom(room.id, 'number_in_room', newCapacity);
                              }}
                              min="1"
                              max="20"
                            />
                            <span className="input-suffix">people</span>
                            {hasFieldError(room.id, 'room_capacity') && (
                              <div className="validation-error">
                                {getFieldError(room.id, 'room_capacity')}
                              </div>
                            )}
                          </div>
                        </div>
                        
                        <div className="form-group">
                          <label className="form-label">
                            <Home size={16} />
                            Number of Rooms
                          </label>
                          <div className="input-with-suffix">
                            <input
                              type="number"
                              className={`form-input ${hasFieldError(room.id, 'number_of_rooms') ? 'field-error' : ''}`}
                              placeholder="10"
                              value={room.number_of_rooms}
                              onChange={(e) => {
                                const inputValue = e.target.value;
                                
                                // Allow empty string for typing
                                if (inputValue === '') {
                                  onUpdateRoom(room.id, 'number_of_rooms', '');
                                  return;
                                }
                                
                                // Only allow positive integers
                                const newQuantity = parseInt(inputValue);
                                if (isNaN(newQuantity) || newQuantity < 0) {
                                  return; // Don't update if invalid
                                }
                                
                                // Check if new quantity is below minimum required
                                const minimumRequired = getMinimumRoomsForRoom(room);
                                if (newQuantity < minimumRequired) {
                                  // Don't allow setting below minimum
                                  return;
                                }
                                
                                onUpdateRoom(room.id, 'number_of_rooms', newQuantity);
                                
                                // Auto-split rooms when total changes and gender is mixed
                                if (room.gender === 'mixed' && newQuantity > 0) {
                                  // Male gets the rounded up number (no decimals)
                                  const maleRooms = Math.ceil(newQuantity / 2);
                                  const femaleRooms = Math.max(0, newQuantity - maleRooms);
                                  onUpdateRoom(room.id, 'male_rooms', maleRooms);
                                  onUpdateRoom(room.id, 'female_rooms', femaleRooms);
                                } else if (newQuantity === 0) {
                                  // Clear gender allocations if no rooms
                                  onUpdateRoom(room.id, 'male_rooms', 0);
                                  onUpdateRoom(room.id, 'female_rooms', 0);
                                }
                              }}
                              min={getMinimumRoomsForRoom(room)}
                            />
                            <span className="input-suffix">rooms</span>
                            {hasFieldError(room.id, 'number_of_rooms') && (
                              <div className="validation-error">
                                {getFieldError(room.id, 'number_of_rooms')}
                              </div>
                            )}
                            {isBelowMinimumRooms(room) && (
                              <div className="validation-error tenant-warning">
                                <AlertTriangle size={14} />
                                <span>
                                  Minimum {getMinimumRoomsForRoom(room)} rooms required for current tenants
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="form-row">
                        <div className="form-group">
                          <label className="form-label">
                            <DollarSign size={16} />
                            Price per Room
                          </label>
                          <div className="input-with-prefix">
                            <span className="input-prefix">₵</span>
                            <input
                              type="number"
                              className={`form-input ${hasFieldError(room.id, 'room_price') ? 'field-error' : ''}`}
                              placeholder="0.00"
                              value={room.price}
                              onChange={(e) => onUpdateRoom(room.id, 'price', e.target.value)}
                              min="0"
                              step="0.01"
                            />
                          </div>
                          {hasFieldError(room.id, 'room_price') && (
                            <div className="validation-error">
                              {getFieldError(room.id, 'room_price')}
                            </div>
                          )}
                        </div>
                        
                        <div className="form-group">
                          <label className="form-label">Gender Allocation</label>
                          <div className="gender-selector">
                            {[
                              { value: 'mixed', label: 'Mixed', icon: '⚥', color: '#8b5cf6' },
                              { value: 'male', label: 'Male Only', icon: '♂', color: '#3b82f6' },
                              { value: 'female', label: 'Female Only', icon: '♀', color: '#ec4899' }
                            ].map((option) => (
                              <button
                                key={option.value}
                                type="button"
                                className={`gender-option-btn ${room.gender === option.value ? 'active' : ''}`}
                                onClick={() => {
                                  const newGender = option.value;
                                  onUpdateRoom(room.id, 'gender', newGender);

                                  const totalRooms = parseInt(room.number_of_rooms) || 0;
                                  if (newGender === 'mixed') {
                                    if (totalRooms > 0) {
                                      const maleRooms = Math.ceil(totalRooms / 2);
                                      const femaleRooms = Math.max(0, totalRooms - maleRooms);
                                      onUpdateRoom(room.id, 'male_rooms', maleRooms);
                                      onUpdateRoom(room.id, 'female_rooms', femaleRooms);
                                    } else {
                                      onUpdateRoom(room.id, 'male_rooms', 0);
                                      onUpdateRoom(room.id, 'female_rooms', 0);
                                    }
                                  } else if (newGender === 'male') {
                                    onUpdateRoom(room.id, 'male_rooms', totalRooms);
                                    onUpdateRoom(room.id, 'female_rooms', 0);
                                  } else if (newGender === 'female') {
                                    onUpdateRoom(room.id, 'male_rooms', 0);
                                    onUpdateRoom(room.id, 'female_rooms', totalRooms);
                                  }
                                }}
                                style={{ '--option-color': option.color }}
                              >
                                <span className="gender-icon">{option.icon}</span>
                                <span className="gender-label">{option.label}</span>
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>

                      {room.gender === 'mixed' && (
                        <div className="mixed-gender-section">
                          <div className="form-row">
                            <div className="form-group">
                              <label className="form-label">
                                <span className="gender-icon" style={{ color: '#3b82f6' }}>♂</span>
                                Male Rooms
                              </label>
                              <div className="input-with-suffix">
                                <input
                                  type="number"
                                  className="form-input"
                                  placeholder="0"
                                  value={room.gender?.male || room.male_rooms || ''}
                                  onChange={(e) => {
                                    const inputValue = e.target.value;
                                    
                                    // Allow empty string for typing
                                    if (inputValue === '') {
                                      onUpdateRoom(room.id, 'male_rooms', '');
                                      return;
                                    }
                                    
                                    const maleRooms = parseInt(inputValue);
                                    if (isNaN(maleRooms) || maleRooms < 0) {
                                      return; // Don't update if invalid
                                    }
                                    
                                    const totalRooms = parseInt(room.number_of_rooms) || 0;
                                    
                                    // Ensure male rooms don't exceed total and don't go below 0
                                    const validMaleRooms = Math.max(0, Math.min(maleRooms, totalRooms));
                                    const femaleRooms = Math.max(0, totalRooms - validMaleRooms);
                                    
                                    onUpdateRoom(room.id, 'male_rooms', validMaleRooms);
                                    onUpdateRoom(room.id, 'female_rooms', femaleRooms);
                                  }}
                                  min="0"
                                  max={room.number_of_rooms || 0}
                                />
                                <span className="input-suffix">rooms</span>
                              </div>
                            </div>
                            
                            <div className="form-group">
                              <label className="form-label">
                                <span className="gender-icon" style={{ color: '#ec4899' }}>♀</span>
                                Female Rooms
                              </label>
                              <div className="input-with-suffix">
                                <input
                                  type="number"
                                  className="form-input"
                                  placeholder="0"
                                  value={room.gender?.female || room.female_rooms || ''}
                                  onChange={(e) => {
                                    const inputValue = e.target.value;
                                    
                                    // Allow empty string for typing
                                    if (inputValue === '') {
                                      onUpdateRoom(room.id, 'female_rooms', '');
                                      return;
                                    }
                                    
                                    const femaleRooms = parseInt(inputValue);
                                    if (isNaN(femaleRooms) || femaleRooms < 0) {
                                      return; // Don't update if invalid
                                    }
                                    
                                    const totalRooms = parseInt(room.number_of_rooms) || 0;
                                    
                                    // Ensure female rooms don't exceed total and don't go below 0
                                    const validFemaleRooms = Math.max(0, Math.min(femaleRooms, totalRooms));
                                    const maleRooms = Math.max(0, totalRooms - validFemaleRooms);
                                    
                                    onUpdateRoom(room.id, 'female_rooms', validFemaleRooms);
                                    onUpdateRoom(room.id, 'male_rooms', maleRooms);
                                  }}
                                  min="0"
                                  max={room.number_of_rooms || 0}
                                />
                                <span className="input-suffix">rooms</span>
                              </div>
                            </div>
                          </div>

                          <div className="gender-allocation-help">
                            <small className="form-help">
                              💡 Total allocated rooms (Male + Female) cannot exceed the total number of rooms. 
                              Only whole numbers are allowed.
                            </small>
                          </div>

                          <div className="gender-split-helper">
                            <div className="helper-header">
                              <span>Room Allocation Summary</span>
                              {(() => {
                                const totalRooms = parseInt(room.number_of_rooms) || 0;
                                const maleRooms = parseInt(room.male_rooms) || 0;
                                const femaleRooms = parseInt(room.female_rooms) || 0;
                                const allocatedTotal = maleRooms + femaleRooms;
                                const isValid = allocatedTotal <= totalRooms && allocatedTotal > 0;
                                
                                return (
                                  <div className={`allocation-status ${isValid ? 'valid' : 'invalid'}`}>
                                    {isValid ? '✓ Valid' : '⚠ Check allocation'}
                                  </div>
                                );
                              })()}
                            </div>
                            <div className="helper-stats">
                              <div className="helper-stat">
                                <span className="stat-label">Total Rooms</span>
                                <span className="stat-value">{room.number_of_rooms || 0}</span>
                              </div>
                              <div className="helper-stat">
                                <span className="stat-label">Male Rooms</span>
                                <span className="stat-value male">{room.gender?.male || room.male_rooms || 0}</span>
                              </div>
                              <div className="helper-stat">
                                <span className="stat-label">Female Rooms</span>
                                <span className="stat-value female">{room.gender?.female || room.female_rooms || 0}</span>
                              </div>
                            </div>
                            {(room.gender?.male || room.male_rooms || 0) + (room.gender?.female || room.female_rooms || 0) !== (room.number_of_rooms || 0) && (
                              <div className="helper-warning">
                                <span>⚠️</span>
                                <span>Room allocation doesn't match total rooms</span>
                              </div>
                            )}
                          </div>
                        </div>
                      )}

                    </div>

                          {/* Always visible amenities button */}
                          <div className="room-amenities-section">
                            <button
                              type="button"
                              className="amenities-btn-interactive"
                              onClick={() => onOpenAmenityModal(index)}
                            >
                              <Settings size={16} />
                              <div className="amenities-content">
                                <span className="amenities-label">Room Amenities</span>
                                <span className="amenities-count">{room.amenities?.length || 0} configured</span>
                              </div>
                              <div className="amenities-arrow">→</div>
                            </button>
                          </div>

                          {/* Room Image Upload Section */}
                          <div className="room-image-section">
                            <div className="image-upload-header">
                              <ImageIcon size={16} />
                              <span className="image-upload-label">Room Image *</span>
                            </div>
                            <div className="image-upload-container">
                              {room.room_image ? (
                                <div className="image-preview-container">
                                  <img 
                                    src={room.room_image} 
                                    alt={`${room.number_in_room}-person room`}
                                    className="room-image-preview"
                                  />
                                  <div className="image-overlay">
                                    <button
                                      type="button"
                                      className="image-change-btn"
                                      onClick={() => document.getElementById(`room-image-${room.id}`).click()}
                                    >
                                      <Upload size={16} />
                                      Change Image
                                    </button>
                                    <button
                                      type="button"
                                      className="image-remove-btn"
                                      onClick={() => onUpdateRoom(room.id, 'room_image', '')}
                                    >
                                      <X size={16} />
                                    </button>
                                  </div>
                                </div>
                              ) : (
                                <div className="image-upload-placeholder">
                                  <div className="upload-icon">
                                    <Upload size={32} />
                                  </div>
                                  <div className="upload-text">
                                    <span className="upload-title">Upload Room Image</span>
                                    <span className="upload-subtitle">Click to select an image file</span>
                                  </div>
                                </div>
                              )}
                              <input
                                id={`room-image-${room.id}`}
                                type="file"
                                accept="image/*"
                                className="image-upload-input"
                                onChange={(e) => {
                                  const file = e.target.files[0];
                                  if (file) {
                                    const reader = new FileReader();
                                    reader.onload = (event) => {
                                      onUpdateRoom(room.id, 'room_image', event.target.result);
                                    };
                                    reader.readAsDataURL(file);
                                  }
                                }}
                              />
                            </div>
                            {!room.room_image && (
                              <div className="image-upload-error">
                                <span>⚠️ Room image is required</span>
                              </div>
                            )}
                          </div>
                  </div>
                );
              })}
            </div>
            
            <div className="add-room-section">
              <button
                type="button"
                className="btn btn-primary add-room-btn-interactive"
                onClick={onAddRoom}
              >
                <Plus size={20} />
                <span>Add Another Room Type</span>
                <div className="btn-glow"></div>
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default RoomDetailsTab;
