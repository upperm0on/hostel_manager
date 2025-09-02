import React from 'react';
import { X, Plus } from 'lucide-react';
import './SettingsTabs.css';

const AmenityModal = ({ 
  showAmenityModal,
  currentRoomAmenities,
  onClose,
  onAddRoomAmenity,
  onRemoveRoomAmenity,
  onUpdateRoomAmenity,
  onSaveRoomAmenities
}) => {
  if (!showAmenityModal) return null;

  return (
    <div className="amenity-modal" onClick={onClose}>
      <div className="amenity-modal-content" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h4>Room Amenities</h4>
          <button
            type="button"
            className="modal-close"
            onClick={onClose}
          >
            <X size={20} />
          </button>
        </div>
        
        <div className="amenity-inputs">
          {currentRoomAmenities.map((amenity) => (
            <div key={amenity.id} className="amenity-input-wrapper">
              <input
                type="text"
                className="form-input"
                placeholder="Enter amenity"
                value={amenity.value}
                onChange={(e) => onUpdateRoomAmenity(amenity.id, e.target.value)}
              />
              <button
                type="button"
                className="remove-amenity-btn"
                onClick={() => onRemoveRoomAmenity(amenity.id)}
              >
                <X size={16} />
              </button>
            </div>
          ))}
        </div>
        
        <div className="modal-actions">
          <button
            type="button"
            className="btn btn-outline"
            onClick={onAddRoomAmenity}
          >
            <Plus size={16} />
            Add Item
          </button>
          <button
            type="button"
            className="btn btn-primary"
            onClick={onSaveRoomAmenities}
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};

export default AmenityModal;
