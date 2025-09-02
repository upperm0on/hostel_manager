import React from 'react';
import { Home, Wifi, Plus, Minus } from 'lucide-react';
import './SettingsTabs.css';

const RoomDetailsTab = ({ 
  roomDetails,
  onAddRoom,
  onRemoveRoom,
  onUpdateRoom,
  onOpenAmenityModal
}) => {
  return (
    <div className="settings-tab-content">
      <div className="rooms-section">
        <div className="settings-section-header">
          <Home className="settings-section-icon" />
          <div>
            <h2 className="settings-section-title">Room Configuration</h2>
            <p className="settings-section-description">
              Configure room types, pricing, and capacity
            </p>
          </div>
        </div>

        <div className="rooms-list">
          {roomDetails.map((room, index) => (
            <div key={room.id} className="room-detail-item">
              <div className="room-header">
                <h6>Room Information #{index + 1}</h6>
                <button
                  type="button"
                  className="remove-room-btn"
                  onClick={() => onRemoveRoom(room.id)}
                >
                  <Minus size={16} />
                </button>
              </div>
              
              <div className="room-form-grid">
                <div className="form-group">
                  <label>How many in a Room?</label>
                  <input
                    type="number"
                    className="form-input"
                    placeholder="Capacity"
                    value={room.numberInRoom}
                    onChange={(e) => onUpdateRoom(room.id, 'numberInRoom', e.target.value)}
                  />
                </div>
                
                <div className="form-group">
                  <label>How many rooms?</label>
                  <input
                    type="number"
                    className="form-input"
                    placeholder="Quantity"
                    value={room.quantity}
                    onChange={(e) => onUpdateRoom(room.id, 'quantity', e.target.value)}
                  />
                </div>
                
                <div className="form-group">
                  <label>Price</label>
                  <input
                    type="number"
                    className="form-input"
                    placeholder="Price per room"
                    value={room.price}
                    onChange={(e) => onUpdateRoom(room.id, 'price', e.target.value)}
                  />
                </div>
                
                <div className="form-group">
                  <label>Room Image</label>
                  <input
                    type="file"
                    className="form-input"
                    accept="image/*"
                    onChange={(e) => onUpdateRoom(room.id, 'roomImage', e.target.files[0])}
                  />
                </div>
                
                <div className="form-group">
                  <label>Gender</label>
                  <select
                    className="form-select"
                    value={room.gender}
                    onChange={(e) => onUpdateRoom(room.id, 'gender', e.target.value)}
                  >
                    <option value="">-- Gender Select --</option>
                    <option value="males">Males</option>
                    <option value="females">Females</option>
                    <option value="mixed">Mixed</option>
                  </select>
                </div>
                
                {room.gender === 'mixed' && (
                  <>
                    <div className="form-group">
                      <label>Male Rooms</label>
                      <input
                        type="number"
                        className="form-input"
                        placeholder="Number of male rooms"
                        value={room.maleRooms}
                        onChange={(e) => onUpdateRoom(room.id, 'maleRooms', e.target.value)}
                      />
                    </div>
                    <div className="form-group">
                      <label>Female Rooms</label>
                      <input
                        type="number"
                        className="form-input"
                        placeholder="Number of female rooms"
                        value={room.femaleRooms}
                        onChange={(e) => onUpdateRoom(room.id, 'femaleRooms', e.target.value)}
                      />
                    </div>
                  </>
                )}
              </div>
              
              <div className="room-amenities-section">
                <button
                  type="button"
                  className="btn btn-outline"
                  onClick={() => onOpenAmenityModal(index)}
                >
                  <Wifi size={16} />
                  Manage Room Amenities ({room.amenities.length})
                </button>
              </div>
            </div>
          ))}
        </div>
        
        <button
          type="button"
          className="btn btn-secondary"
          onClick={onAddRoom}
        >
          <Plus size={16} />
          Add Room Information
        </button>
      </div>
    </div>
  );
};

export default RoomDetailsTab;
