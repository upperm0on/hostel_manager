import React from 'react';
import { Home, Wifi, Plus, Minus, Users, DollarSign, Camera, UserCheck, Trash2, Edit3 } from 'lucide-react';
import './SettingsTabs.css';

const RoomDetailsTab = ({ 
  roomDetails,
  onAddRoom,
  onRemoveRoom,
  onUpdateRoom,
  onOpenAmenityModal
}) => {
  const getGenderIcon = (gender) => {
    switch (gender) {
      case 'males': return '♂';
      case 'females': return '♀';
      case 'mixed': return '⚥';
      default: return '👥';
    }
  };

  const getGenderColor = (gender) => {
    switch (gender) {
      case 'males': return '#3b82f6';
      case 'females': return '#ec4899';
      case 'mixed': return '#8b5cf6';
      default: return '#6b7280';
    }
  };

  return (
    <div className="settings-tab-content">
      <div className="rooms-section">
        <div className="settings-section-header">
          <div className="section-icon-wrapper">
            <Home className="settings-section-icon" />
          </div>
          <div className="section-content">
            <h2 className="settings-section-title">Room Configuration</h2>
            <p className="settings-section-description">
              Design your hostel's room types with detailed specifications and amenities
            </p>
          </div>
        </div>

        {roomDetails.length === 0 ? (
          <div className="empty-rooms-state">
            <div className="empty-state-icon">
              <Home size={48} />
            </div>
            <h3>No Room Types Configured</h3>
            <p>Start by adding your first room type to begin setting up your hostel</p>
            <button
              type="button"
              className="btn btn-primary btn-large"
              onClick={onAddRoom}
            >
              <Plus size={20} />
              Add Your First Room Type
            </button>
          </div>
        ) : (
          <>
            <div className="rooms-grid-enhanced">
              {roomDetails.map((room, index) => (
                <div key={room.id} className="room-card-enhanced">
                  <div className="room-card-header-enhanced">
                    <div className="room-type-info">
                      <div className="room-type-badge">
                        <span className="room-type-number">#{index + 1}</span>
                        <span className="room-type-label">Room Type</span>
                      </div>
                      <div className="room-summary-stats">
                        <span className="stat-item">
                          <Users size={14} />
                          {room.numberInRoom || 0} per room
                        </span>
                        <span className="stat-item">
                          <DollarSign size={14} />
                          ₵{room.price || 0}
                        </span>
                      </div>
                    </div>
                    <div className="room-actions">
                      <button
                        type="button"
                        className="action-btn edit-btn"
                        onClick={() => onOpenAmenityModal(index)}
                        title="Manage Amenities"
                      >
                        <Edit3 size={16} />
                      </button>
                      <button
                        type="button"
                        className="action-btn delete-btn"
                        onClick={() => onRemoveRoom(room.id)}
                        title="Remove Room Type"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>

                  <div className="room-form-grid-enhanced">
                    <div className="form-group-enhanced">
                      <label className="form-label-enhanced">
                        <Users size={16} />
                        Capacity per Room
                      </label>
                      <div className="input-wrapper">
                        <input
                          type="number"
                          className="form-input-enhanced"
                          placeholder="e.g., 2, 4, 6"
                          value={room.numberInRoom}
                          onChange={(e) => onUpdateRoom(room.id, 'numberInRoom', e.target.value)}
                          min="1"
                          max="20"
                        />
                        <span className="input-suffix">people</span>
                      </div>
                      <small className="form-help">How many people can stay in each room</small>
                    </div>
                    
                    <div className="form-group-enhanced">
                      <label className="form-label-enhanced">
                        <Home size={16} />
                        Number of Rooms
                      </label>
                      <div className="input-wrapper">
                        <input
                          type="number"
                          className="form-input-enhanced"
                          placeholder="e.g., 10, 25, 50"
                          value={room.quantity}
                          onChange={(e) => onUpdateRoom(room.id, 'quantity', e.target.value)}
                          min="1"
                        />
                        <span className="input-suffix">rooms</span>
                      </div>
                      <small className="form-help">Total rooms of this type</small>
                    </div>
                    
                    <div className="form-group-enhanced">
                      <label className="form-label-enhanced">
                        <DollarSign size={16} />
                        Price per Room
                      </label>
                      <div className="input-wrapper">
                        <span className="input-prefix">₵</span>
                        <input
                          type="number"
                          className="form-input-enhanced"
                          placeholder="0.00"
                          value={room.price}
                          onChange={(e) => onUpdateRoom(room.id, 'price', e.target.value)}
                          min="0"
                          step="0.01"
                        />
                      </div>
                      <small className="form-help">Total cost for the entire room</small>
                    </div>
                    
                    <div className="form-group-enhanced">
                      <label className="form-label-enhanced">
                        <Camera size={16} />
                        Room Image
                      </label>
                      <div className="file-upload-wrapper">
                        <input
                          type="file"
                          className="file-input"
                          accept="image/*"
                          onChange={(e) => onUpdateRoom(room.id, 'roomImage', e.target.files[0])}
                          id={`room-image-${room.id}`}
                        />
                        <label htmlFor={`room-image-${room.id}`} className="file-upload-label">
                          <Camera size={20} />
                          <span>Choose Image</span>
                        </label>
                      </div>
                      <small className="form-help">Upload a photo of this room type</small>
                    </div>
                    
                    <div className="form-group-enhanced gender-selection">
                      <label className="form-label-enhanced">
                        <UserCheck size={16} />
                        Gender Allocation
                      </label>
                      <div className="gender-options">
                        {[
                          { value: 'males', label: 'Male Only', icon: '♂' },
                          { value: 'females', label: 'Female Only', icon: '♀' },
                          { value: 'mixed', label: 'Mixed Gender', icon: '⚥' }
                        ].map((option) => (
                          <label key={option.value} className="gender-option">
                            <input
                              type="radio"
                              name={`gender-${room.id}`}
                              value={option.value}
                              checked={room.gender === option.value}
                              onChange={(e) => onUpdateRoom(room.id, 'gender', e.target.value)}
                            />
                            <div className="gender-option-content">
                              <span className="gender-icon" style={{ color: getGenderColor(option.value) }}>
                                {option.icon}
                              </span>
                              <span className="gender-label">{option.label}</span>
                            </div>
                          </label>
                        ))}
                      </div>
                    </div>
                    
                    {room.gender === 'mixed' && (
                      <div className="mixed-gender-details">
                        <div className="form-group-enhanced">
                          <label className="form-label-enhanced">
                            <span className="gender-icon" style={{ color: '#3b82f6' }}>♂</span>
                            Male Rooms
                          </label>
                          <div className="input-wrapper">
                            <input
                              type="number"
                              className="form-input-enhanced"
                              placeholder="0"
                              value={room.maleRooms}
                              onChange={(e) => onUpdateRoom(room.id, 'maleRooms', e.target.value)}
                              min="0"
                              max={room.quantity}
                            />
                            <span className="input-suffix">rooms</span>
                          </div>
                        </div>
                        <div className="form-group-enhanced">
                          <label className="form-label-enhanced">
                            <span className="gender-icon" style={{ color: '#ec4899' }}>♀</span>
                            Female Rooms
                          </label>
                          <div className="input-wrapper">
                            <input
                              type="number"
                              className="form-input-enhanced"
                              placeholder="0"
                              value={room.femaleRooms}
                              onChange={(e) => onUpdateRoom(room.id, 'femaleRooms', e.target.value)}
                              min="0"
                              max={room.quantity}
                            />
                            <span className="input-suffix">rooms</span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                  
                  <div className="room-amenities-section-enhanced">
                    <button
                      type="button"
                      className="amenities-btn"
                      onClick={() => onOpenAmenityModal(index)}
                    >
                      <Wifi size={18} />
                      <div className="amenities-btn-content">
                        <span className="amenities-btn-label">Room Amenities</span>
                        <span className="amenities-count">{room.amenities.length} configured</span>
                      </div>
                    </button>
                  </div>

                  {/* Room Preview Card */}
                  <div className="room-preview-card">
                    <div className="preview-header">
                      <span className="preview-title">Room Preview</span>
                      <div className="preview-gender-badge" style={{ backgroundColor: getGenderColor(room.gender) }}>
                        {getGenderIcon(room.gender)}
                      </div>
                    </div>
                    <div className="preview-stats">
                      <div className="preview-stat">
                        <span className="preview-stat-value">{room.numberInRoom || 0}</span>
                        <span className="preview-stat-label">Capacity</span>
                      </div>
                      <div className="preview-stat">
                        <span className="preview-stat-value">{room.quantity || 0}</span>
                        <span className="preview-stat-label">Rooms</span>
                      </div>
                      <div className="preview-stat">
                        <span className="preview-stat-value">₵{room.price || 0}</span>
                        <span className="preview-stat-label">Price</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="add-room-section">
              <button
                type="button"
                className="btn btn-primary btn-large add-room-btn"
                onClick={onAddRoom}
              >
                <Plus size={20} />
                Add Another Room Type
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default RoomDetailsTab;
