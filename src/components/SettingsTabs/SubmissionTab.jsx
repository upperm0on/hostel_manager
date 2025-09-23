import React from 'react';
import { CheckCircle } from 'lucide-react';
import './SettingsTabs.css';

const SubmissionTab = ({ 
  hostelDetails, 
  generalAmenities, 
  roomDetails, 
  additionalInfo 
}) => {
  return (
    <div className="settings-tab-content">
      <div className="submission-summary">
        <div className="summary-section">
          <h5>Hostel Details</h5>
          <div className="summary-item">
            <span className="summary-label">Name:</span>
            <span className="summary-value">{hostelDetails.name || 'Not provided'}</span>
          </div>
          <div className="summary-item">
            <span className="summary-label">Location:</span>
            <span className="summary-value">{hostelDetails.location || 'Not provided'}</span>
          </div>
          <div className="summary-item">
            <span className="summary-label">Description:</span>
            <span className="summary-value">{hostelDetails.description || 'Not provided'}</span>
          </div>
        </div>

        <div className="summary-section">
          <h5>General Amenities ({generalAmenities.filter(item => item.value.trim()).length})</h5>
          <div className="summary-list">
            {generalAmenities.filter(item => item.value.trim()).map((amenity, index) => (
              <span key={amenity.id} className="summary-tag">{amenity.value}</span>
            ))}
          </div>
        </div>

        <div className="summary-section">
          <h5>Room Details ({roomDetails.length})</h5>
          <div className="summary-list">
            {roomDetails.map((room, index) => (
              <div key={room.id} className="room-summary">
                <strong>Room {index + 1}:</strong> {room.quantity} rooms, {room.numberInRoom} capacity, ₵{room.price} price
              </div>
            ))}
          </div>
        </div>

        <div className="summary-section">
          <h5>Additional Information ({additionalInfo.filter(item => item.value.trim()).length})</h5>
          <div className="summary-list">
            {additionalInfo.filter(item => item.value.trim()).map((info, index) => (
              <span key={info.id} className="summary-tag">{info.value}</span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubmissionTab;
