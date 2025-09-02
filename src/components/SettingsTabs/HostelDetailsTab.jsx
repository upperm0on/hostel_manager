import React from 'react';
import { Building, Image } from 'lucide-react';
import './SettingsTabs.css';

const HostelDetailsTab = ({ 
  hostelDetails, 
  onHostelDetailsChange, 
  onLogoUpload 
}) => {
  return (
    <div className="settings-tab-content">
      <div className="settings-section">
        <div className="settings-section-header">
          <Building className="settings-section-icon" />
          <div>
            <h2 className="settings-section-title">Hostel Information</h2>
            <p className="settings-section-description">
              Basic information about your hostel
            </p>
          </div>
        </div>

        <div className="settings-form">
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Hostel Name *</label>
              <input
                type="text"
                className="form-input"
                placeholder="Enter hostel name"
                value={hostelDetails.name}
                onChange={(e) => onHostelDetailsChange('name', e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">Location *</label>
              <input
                type="text"
                className="form-input"
                placeholder="Enter location"
                value={hostelDetails.location}
                onChange={(e) => onHostelDetailsChange('location', e.target.value)}
                required
              />
            </div>
          </div>

          <div className="form-row full">
            <div className="form-group">
              <label className="form-label">Description</label>
              <textarea
                className="form-textarea"
                placeholder="Describe your hostel"
                value={hostelDetails.description}
                onChange={(e) => onHostelDetailsChange('description', e.target.value)}
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Logo</label>
            <div className="logo-upload">
              <div className="logo-preview">
                {hostelDetails.logo ? (
                  <img 
                    src={URL.createObjectURL(hostelDetails.logo)} 
                    alt="Logo preview" 
                  />
                ) : (
                  <Image size={32} />
                )}
              </div>
              <div>
                <input
                  type="file"
                  className="logo-upload-input"
                  accept="image/*"
                  id="logo-upload"
                  onChange={onLogoUpload}
                />
                <label htmlFor="logo-upload" className="logo-upload-button">
                  Upload Logo
                </label>
                <p className="form-help">Recommended size: 200x200px, Max: 2MB</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HostelDetailsTab;
