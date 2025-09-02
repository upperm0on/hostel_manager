import React from 'react';
import { Wifi, Plus, X } from 'lucide-react';
import './SettingsTabs.css';

const GeneralAmenitiesTab = ({ 
  generalAmenities, 
  additionalInfo,
  onAddGeneralAmenity,
  onRemoveGeneralAmenity,
  onUpdateGeneralAmenity,
  onAddAdditionalInfo,
  onRemoveAdditionalInfo,
  onUpdateAdditionalInfo
}) => {
  return (
    <div className="settings-tab-content">
      <div className="amenities-section">
        <div className="settings-section-header">
          <Wifi className="settings-section-icon" />
          <div>
            <h2 className="settings-section-title">General Amenities</h2>
            <p className="settings-section-description">
              List the amenities available in your hostel
            </p>
          </div>
        </div>

        <div className="amenities-list">
          {generalAmenities.map((amenity) => (
            <div key={amenity.id} className="amenity-input-item">
              <input
                type="text"
                className="form-input"
                placeholder="Enter amenity"
                value={amenity.value}
                onChange={(e) => onUpdateGeneralAmenity(amenity.id, e.target.value)}
              />
              <button
                type="button"
                className="remove-amenity-btn"
                onClick={() => onRemoveGeneralAmenity(amenity.id)}
              >
                <X size={16} />
              </button>
            </div>
          ))}
        </div>
        <button
          type="button"
          className="btn btn-outline"
          onClick={onAddGeneralAmenity}
        >
          <Plus size={16} />
          Add Amenity
        </button>
      </div>

      <div className="additional-info-section">
        <div className="settings-section-header">
          <Wifi className="settings-section-icon" />
          <div>
            <h2 className="settings-section-title">Additional Information</h2>
            <p className="settings-section-description">
              Add any additional information about your hostel
            </p>
          </div>
        </div>

        <div className="additional-info-list">
          {additionalInfo.map((info) => (
            <div key={info.id} className="info-input-item">
              <input
                type="text"
                className="form-input"
                placeholder="Additional information"
                value={info.value}
                onChange={(e) => onUpdateAdditionalInfo(info.id, e.target.value)}
              />
              <button
                type="button"
                className="remove-info-btn"
                onClick={() => onRemoveAdditionalInfo(info.id)}
              >
                <X size={16} />
              </button>
            </div>
          ))}
        </div>
        <button
          type="button"
          className="btn btn-outline"
          onClick={onAddAdditionalInfo}
        >
          <Plus size={16} />
          Add Information
        </button>
      </div>
    </div>
  );
};

export default GeneralAmenitiesTab;
