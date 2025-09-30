import React, { useState, useEffect } from 'react';
import { Building, Image, Upload, X } from 'lucide-react';
import SearchableSelect from '../Common/SearchableSelect';
import { API_ENDPOINTS, getApiUrl } from '../../config/api';
import './SettingsTabs.css';

const HostelDetailsTab = ({
  hostelDetails,
  onHostelDetailsChange,
  onLogoUpload
}) => {
  const [campusOptions, setCampusOptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [allCampusData, setAllCampusData] = useState([]);

  // Fetch campus options on component mount
  useEffect(() => {
    loadCampusOptions();
  }, []);

  const loadCampusOptions = () => {
    // First try to load from localStorage
    const cachedData = localStorage.getItem('campusOptions');
    const cacheTimestamp = localStorage.getItem('campusOptionsTimestamp');
    const now = Date.now();
    const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

    if (cachedData && cacheTimestamp && (now - parseInt(cacheTimestamp)) < CACHE_DURATION) {
      // Use cached data if it's less than 5 minutes old
      const data = JSON.parse(cachedData);
      setCampusOptions(data);
      setAllCampusData(data);
    } else {
      // Fetch fresh data from API
      fetchCampusOptions();
    }
  };

  const fetchCampusOptions = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');

      const response = await fetch(getApiUrl(API_ENDPOINTS.CAMPUS_SEARCH), {
        method: 'GET',
        headers: {
          'Authorization': `Token ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        setCampusOptions(data);
        setAllCampusData(data);

        // Cache the data in localStorage
        localStorage.setItem('campusOptions', JSON.stringify(data));
        localStorage.setItem('campusOptionsTimestamp', Date.now().toString());
      } else {
        console.error('Failed to fetch campus options');
      }
    } catch (error) {
      console.error('Error fetching campus options:', error);
    } finally {
      setLoading(false);
    }
  };
  const handleCampusSearch = (searchTerm) => {
    if (searchTerm.trim() === '') {
      // If search is empty, show all options
      setCampusOptions(allCampusData);
      return;
    }

    // Filter locally from cached data
    const filtered = allCampusData.filter(option =>
      option.campus.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setCampusOptions(filtered);
  };

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
              />
            </div>
            <SearchableSelect
              label="Location"
              placeholder="Search for campus location..."
              value={hostelDetails.location}
              onChange={(value) => onHostelDetailsChange('location', value)}
              options={campusOptions}
              onSearch={handleCampusSearch}
              loading={loading}
            />
          </div>


          <div className="form-group">
            <label className="form-label">Hostel Cover Image *</label>
            <div className="cover-image-upload">
              {hostelDetails.logo || hostelDetails.logoPreview ? (
                <div className="cover-image-preview-container">
                  <img
                    src={hostelDetails.logoPreview
                      ? hostelDetails.logoPreview
                      : (typeof hostelDetails.logo === 'string' ? hostelDetails.logo : '')
                    }
                    alt="Hostel cover preview"
                    className="cover-image-preview"
                  />
                  <div className="cover-image-overlay">
                    <button
                      type="button"
                      className="cover-image-change-btn"
                      onClick={() => document.getElementById('cover-image-upload').click()}
                    >
                      <Upload size={16} />
                      Change Image
                    </button>
                    <button
                      type="button"
                      className="cover-image-remove-btn"
                      onClick={() => {
                        // Revoke preview URL if exists
                        if (hostelDetails.logoPreview) {
                          try { URL.revokeObjectURL(hostelDetails.logoPreview); } catch (_) {}
                        }
                        onHostelDetailsChange('logo', null);
                        onHostelDetailsChange('logoPreview', '');
                        // Reset the file input value to allow re-uploading the same file
                        const input = document.getElementById('cover-image-upload');
                        if (input) input.value = '';
                      }}
                    >
                      <X size={16} />
                    </button>
                  </div>
                </div>
              ) : (
                <div className="cover-image-upload-placeholder">
                  <div className="cover-upload-icon">
                    <Upload size={48} />
                  </div>
                  <div className="cover-upload-text">
                    <span className="cover-upload-title">Upload Hostel Cover Image</span>
                    <span className="cover-upload-subtitle">Click to select a cover image for your hostel</span>
                  </div>
                </div>
              )}
              <input
                id="cover-image-upload"
                type="file"
                accept="image/*"
                className="cover-image-upload-input"
                onChange={(e) => {
                  const file = e.target.files[0];
                  if (file) {
                    // Clean up any existing preview URL
                    if (hostelDetails.logoPreview) {
                      try { URL.revokeObjectURL(hostelDetails.logoPreview); } catch (_) {}
                    }
                    // Pass the file to your backend
                    onHostelDetailsChange('logo', file);
                    // For preview only
                    const previewUrl = URL.createObjectURL(file);
                    onHostelDetailsChange('logoPreview', previewUrl);
                  }
                }}
              />
            </div>
            {/* Image is optional; no blocking requirement */}
            <p className="form-help">Recommended size: 1200x400px, Max: 5MB</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HostelDetailsTab;
