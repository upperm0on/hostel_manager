import React, { useState } from 'react';
import { Home, Plus, Users, DollarSign, Trash2, Settings, Edit3, Eye, EyeOff, Check, X, Upload, Image as ImageIcon } from 'lucide-react';
import './SettingsTabs.css';

const RoomDetailsTab = ({ 
  roomDetails,
  onAddRoom,
  onRemoveRoom,
  onUpdateRoom,
  onOpenAmenityModal
}) => {
  const [editingRoom, setEditingRoom] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);
  const [hoveredRoom, setHoveredRoom] = useState(null);

  const handleEditToggle = (roomId) => {
    setEditingRoom(editingRoom === roomId ? null : roomId);
  };

  const handleDeleteConfirm = (roomId) => {
    onRemoveRoom(roomId);
    setShowDeleteConfirm(null);
  };

  const getRoomStats = (room) => {
    const totalCapacity = (room.numberInRoom || 0) * (room.quantity || 0);
    const totalRevenue = (room.price || 0) * (room.quantity || 0);
    return { totalCapacity, totalRevenue };
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
                          <span className="room-number">#{index + 1}</span>
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
                        <div className="form-group">
                          <label className="form-label">
                            <Users size={16} />
                            Capacity per Room
                          </label>
                          <div className="input-with-suffix">
                            <input
                              type="number"
                              className="form-input"
                              placeholder="2"
                              value={room.numberInRoom}
                              onChange={(e) => onUpdateRoom(room.id, 'numberInRoom', e.target.value)}
                              min="1"
                              max="20"
                            />
                            <span className="input-suffix">people</span>
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
                              className="form-input"
                              placeholder="10"
                              value={room.quantity}
                              onChange={(e) => {
                                const newQuantity = parseInt(e.target.value) || 0;
                                onUpdateRoom(room.id, 'quantity', newQuantity);
                                
                                // Auto-split rooms when total changes and gender is mixed
                                if (room.gender === 'mixed' && newQuantity > 0) {
                                  const maleRooms = Math.round(newQuantity / 2);
                                  const femaleRooms = newQuantity - maleRooms;
                                  onUpdateRoom(room.id, 'maleRooms', maleRooms);
                                  onUpdateRoom(room.id, 'femaleRooms', femaleRooms);
                                }
                              }}
                              min="1"
                            />
                            <span className="input-suffix">rooms</span>
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
                              className="form-input"
                              placeholder="0.00"
                              value={room.price}
                              onChange={(e) => onUpdateRoom(room.id, 'price', e.target.value)}
                              min="0"
                              step="0.01"
                            />
                          </div>
                        </div>
                        
                        <div className="form-group">
                          <label className="form-label">Gender Allocation</label>
                          <div className="gender-selector">
                            {[
                              { value: 'mixed', label: 'Mixed', icon: '⚥', color: '#8b5cf6' },
                              { value: 'males', label: 'Male Only', icon: '♂', color: '#3b82f6' },
                              { value: 'females', label: 'Female Only', icon: '♀', color: '#ec4899' }
                            ].map((option) => (
                              <button
                                key={option.value}
                                type="button"
                                className={`gender-option-btn ${room.gender === option.value ? 'active' : ''}`}
                                onClick={() => {
                                  const newGender = option.value;
                                  onUpdateRoom(room.id, 'gender', newGender);
                                  
                                  // Auto-split rooms when changing to mixed
                                  if (newGender === 'mixed') {
                                    const totalRooms = parseInt(room.quantity) || 0;
                                    if (totalRooms > 0) {
                                      const maleRooms = Math.round(totalRooms / 2);
                                      const femaleRooms = totalRooms - maleRooms;
                                      onUpdateRoom(room.id, 'maleRooms', maleRooms);
                                      onUpdateRoom(room.id, 'femaleRooms', femaleRooms);
                                    }
                                  } else {
                                    // Clear male/female rooms when not mixed
                                    onUpdateRoom(room.id, 'maleRooms', 0);
                                    onUpdateRoom(room.id, 'femaleRooms', 0);
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
                                  value={room.maleRooms || ''}
                                  onChange={(e) => {
                                    const maleRooms = parseInt(e.target.value) || 0;
                                    const totalRooms = parseInt(room.quantity) || 0;
                                    const femaleRooms = Math.max(0, totalRooms - maleRooms);
                                    onUpdateRoom(room.id, 'maleRooms', maleRooms);
                                    onUpdateRoom(room.id, 'femaleRooms', femaleRooms);
                                  }}
                                  min="0"
                                  max={room.quantity || 0}
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
                                  value={room.femaleRooms || ''}
                                  onChange={(e) => {
                                    const femaleRooms = parseInt(e.target.value) || 0;
                                    const totalRooms = parseInt(room.quantity) || 0;
                                    const maleRooms = Math.max(0, totalRooms - femaleRooms);
                                    onUpdateRoom(room.id, 'femaleRooms', femaleRooms);
                                    onUpdateRoom(room.id, 'maleRooms', maleRooms);
                                  }}
                                  min="0"
                                  max={room.quantity || 0}
                                />
                                <span className="input-suffix">rooms</span>
                              </div>
                            </div>
                          </div>

                          <div className="gender-split-helper">
                            <div className="helper-header">
                              <span>Room Allocation Summary</span>
                            </div>
                            <div className="helper-stats">
                              <div className="helper-stat">
                                <span className="stat-label">Total Rooms</span>
                                <span className="stat-value">{room.quantity || 0}</span>
                              </div>
                              <div className="helper-stat">
                                <span className="stat-label">Male Rooms</span>
                                <span className="stat-value male">{room.maleRooms || 0}</span>
                              </div>
                              <div className="helper-stat">
                                <span className="stat-label">Female Rooms</span>
                                <span className="stat-value female">{room.femaleRooms || 0}</span>
                              </div>
                            </div>
                            {(room.maleRooms || 0) + (room.femaleRooms || 0) !== (room.quantity || 0) && (
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
                                    alt={`${room.numberInRoom}-person room`}
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
