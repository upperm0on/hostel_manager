import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar, 
  Shield, 
  Edit3, 
  Save, 
  X,
  Camera,
  Key,
  Bell,
  Globe,
  AlertCircle,
  CheckCircle,
  Loader2
} from 'lucide-react';
import BankingAlert from '../../components/Common/BankingAlert';
import { validateEmailRealTime, sanitizeEmail } from '../../utils/emailValidation';
import ConfirmationModal from '../../components/Common/ConfirmationModal';
import './Profile.css';

const Profile = () => {
  const { user, updateUser } = useAuth();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [isEditingPassword, setIsEditingPassword] = useState(false);
  const [isEditingNotifications, setIsEditingNotifications] = useState(false);
  const [modalState, setModalState] = useState({
    isOpen: false,
    title: '',
    message: '',
    type: 'info',
    showCancel: false,
    showConfirm: true,
    confirmText: 'OK',
    onConfirm: null,
  });
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    phone: '',
    address: '',
    bio: '',
    avatar: null
  });
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    smsNotifications: false,
    pushNotifications: true,
    weeklyReports: true,
    paymentReminders: true,
    maintenanceAlerts: true
  });
  const [emailValidation, setEmailValidation] = useState({
    isValid: false,
    isChecking: false,
    error: ''
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (user) {
      setFormData({
        username: user.username || '',
        email: user.email || '',
        phone: user.phone || '',
        address: user.address || '',
        bio: user.bio || '',
        avatar: user.avatar || null
      });
    }
  }, [user]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    // Sanitize email input
    const processedValue = name === 'email' ? sanitizeEmail(value) : value;
    
    setFormData(prev => ({
      ...prev,
      [name]: processedValue
    }));

    // Clear errors when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  // Email validation with debouncing
  const validateEmailField = async (email) => {
    if (!email || email.trim() === '') {
      setEmailValidation({ isValid: false, isChecking: false, error: '' });
      return;
    }

    setEmailValidation(prev => ({ ...prev, isChecking: true }));
    
    try {
      // For profile, we don't need to check against other tenants
      // Just validate format
      const result = await validateEmailRealTime(email, [], user?.id);
      setEmailValidation(result);
    } catch (error) {
      setEmailValidation({ 
        isValid: false, 
        isChecking: false, 
        error: 'Error validating email' 
      });
    }
  };

  // Debounced email validation
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (formData.email && isEditing) {
        validateEmailField(formData.email);
      }
    }, 500); // 500ms debounce

    return () => clearTimeout(timeoutId);
  }, [formData.email, isEditing, user?.id]);

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleNotificationChange = (e) => {
    const { name, checked } = e.target;
    setNotificationSettings(prev => ({
      ...prev,
      [name]: checked
    }));
  };

  const handleAvatarUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setFormData(prev => ({
          ...prev,
          avatar: event.target.result
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.username.trim()) {
      newErrors.username = 'Username is required';
    }

    // Email validation - use the real-time validation result
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!emailValidation.isValid) {
      newErrors.email = emailValidation.error || 'Email is invalid';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validateForm()) {
      return;
    }

    try {
      // Here you would typically make an API call to update the user profile
      await updateUser(formData);
      setIsEditing(false);
      console.log('Profile updated successfully');
    } catch (error) {
      console.error('Error updating profile:', error);
      setModalState({
        isOpen: true,
        title: 'Update Failed',
        message: 'Failed to update profile. Please try again.',
        type: 'danger',
        showCancel: false,
        showConfirm: true,
        confirmText: 'OK',
        onConfirm: () => setModalState((s) => ({ ...s, isOpen: false })),
      });
    }
  };

  const handlePasswordSave = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setModalState({
        isOpen: true,
        title: 'Password Mismatch',
        message: 'New passwords do not match',
        type: 'warning',
        showCancel: false,
        showConfirm: true,
        confirmText: 'OK',
        onConfirm: () => setModalState((s) => ({ ...s, isOpen: false })),
      });
      return;
    }
    
    try {
      // Here you would typically make an API call to update the password
      console.log('Password updated successfully');
      setIsEditingPassword(false);
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
    } catch (error) {
      console.error('Error updating password:', error);
      setModalState({
        isOpen: true,
        title: 'Update Failed',
        message: 'Failed to update password. Please try again.',
        type: 'danger',
        showCancel: false,
        showConfirm: true,
        confirmText: 'OK',
        onConfirm: () => setModalState((s) => ({ ...s, isOpen: false })),
      });
    }
  };

  const handleNotificationSave = async () => {
    try {
      // Here you would typically make an API call to update notification settings
      console.log('Notification settings updated successfully');
      setIsEditingNotifications(false);
    } catch (error) {
      console.error('Error updating notification settings:', error);
      setModalState({
        isOpen: true,
        title: 'Update Failed',
        message: 'Failed to update notification settings. Please try again.',
        type: 'danger',
        showCancel: false,
        showConfirm: true,
        confirmText: 'OK',
        onConfirm: () => setModalState((s) => ({ ...s, isOpen: false })),
      });
    }
  };

  const handleCompleteBanking = () => {
    navigate('/settings?tab=banking');
  };

  const handleCancel = () => {
    setIsEditing(false);
    setIsEditingPassword(false);
    setIsEditingNotifications(false);
    // Reset form data to original values
    if (user) {
      setFormData({
        username: user.username || '',
        email: user.email || '',
        phone: user.phone || '',
        address: user.address || '',
        bio: user.bio || '',
        avatar: user.avatar || null
      });
    }
    setPasswordData({
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    });
  };

  return (
    <div className="profile-page">
      <ConfirmationModal
        isOpen={modalState.isOpen}
        onClose={() => setModalState((s) => ({ ...s, isOpen: false }))}
        onConfirm={() => {
          if (typeof modalState.onConfirm === 'function') {
            const cb = modalState.onConfirm;
            setModalState((s) => ({ ...s, isOpen: false }));
            cb();
          } else {
            setModalState((s) => ({ ...s, isOpen: false }));
          }
        }}
        title={modalState.title}
        message={modalState.message}
        type={modalState.type}
        isLoading={false}
        showCancel={modalState.showCancel}
        showConfirm={modalState.showConfirm}
        confirmText={modalState.confirmText}
      />
      <BankingAlert onComplete={handleCompleteBanking} />
      
      {/* Profile Header */}
      <div className="profile-header">
        <div className="profile-header-content">
          <div className="profile-avatar-section">
            <div className="profile-avatar-container">
              {formData.avatar ? (
                <img 
                  src={formData.avatar} 
                  alt="Profile" 
                  className="profile-avatar"
                />
              ) : (
                <div className="profile-avatar-placeholder">
                  <User size={48} />
                </div>
              )}
              {isEditing && (
                <label className="avatar-upload-btn">
                  <Camera size={16} />
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarUpload}
                    style={{ display: 'none' }}
                  />
                </label>
              )}
            </div>
            <div className="profile-info">
              <h1 className="profile-name">{formData.username || 'User'}</h1>
              <p className="profile-role">Hostel Manager</p>
              <p className="profile-join-date">
                Member since {new Date().getFullYear()}
              </p>
            </div>
          </div>
          <div className="profile-actions">
            {!isEditing ? (
              <button 
                className="btn btn-primary"
                onClick={() => setIsEditing(true)}
              >
                <Edit3 size={16} />
                Edit Profile
              </button>
            ) : (
              <div className="edit-actions">
                <button 
                  className="btn btn-success"
                  onClick={handleSave}
                >
                  <Save size={16} />
                  Save Changes
                </button>
                <button 
                  className="btn btn-outline"
                  onClick={handleCancel}
                >
                  <X size={16} />
                  Cancel
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Profile Content */}
      <div className="profile-content">
        <div className="profile-grid">
          {/* Personal Information */}
          <div className="profile-section">
            <div className="section-header">
              <h2 className="section-title">
                <User size={20} />
                Personal Information
              </h2>
            </div>
            <div className="section-content">
              <div className="form-grid">
                <div className="form-group">
                  <label className="form-label">
                    <User size={16} />
                    Username
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      name="username"
                      value={formData.username}
                      onChange={handleInputChange}
                      className="form-input"
                      placeholder="Enter username"
                    />
                  ) : (
                    <div className="form-display">{formData.username || 'Not set'}</div>
                  )}
                </div>

                <div className="form-group">
                  <label className="form-label">
                    <Mail size={16} />
                    Email Address
                  </label>
                  {isEditing ? (
                    <div className="email-input-container">
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className={`form-input ${errors.email ? 'error' : ''} ${emailValidation.isValid ? 'valid' : ''}`}
                        placeholder="Enter email address"
                      />
                      <div className="email-validation-icon">
                        {emailValidation.isChecking && <Loader2 size={16} className="spinning" />}
                        {!emailValidation.isChecking && emailValidation.isValid && <CheckCircle size={16} className="valid-icon" />}
                        {!emailValidation.isChecking && !emailValidation.isValid && formData.email && <AlertCircle size={16} className="invalid-icon" />}
                      </div>
                    </div>
                  ) : (
                    <div className="form-display">{formData.email || 'Not set'}</div>
                  )}
                  {errors.email && <span className="error-message">{errors.email}</span>}
                  {!errors.email && emailValidation.error && <span className="error-message">{emailValidation.error}</span>}
                </div>

                <div className="form-group">
                  <label className="form-label">
                    <Phone size={16} />
                    Phone Number
                  </label>
                  {isEditing ? (
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="form-input"
                      placeholder="Enter phone number"
                    />
                  ) : (
                    <div className="form-display">{formData.phone || 'Not set'}</div>
                  )}
                </div>

                <div className="form-group">
                  <label className="form-label">
                    <MapPin size={16} />
                    Address
                  </label>
                  {isEditing ? (
                    <textarea
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      className="form-textarea"
                      placeholder="Enter address"
                      rows={3}
                    />
                  ) : (
                    <div className="form-display">{formData.address || 'Not set'}</div>
                  )}
                </div>

                <div className="form-group full-width">
                  <label className="form-label">
                    <User size={16} />
                    Bio
                  </label>
                  {isEditing ? (
                    <textarea
                      name="bio"
                      value={formData.bio}
                      onChange={handleInputChange}
                      className="form-textarea"
                      placeholder="Tell us about yourself"
                      rows={4}
                    />
                  ) : (
                    <div className="form-display">{formData.bio || 'No bio available'}</div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Security Settings */}
          <div className="profile-section">
            <div className="section-header">
              <h2 className="section-title">
                <Shield size={20} />
                Security Settings
              </h2>
              {!isEditingPassword && (
                <button 
                  className="btn btn-outline btn-sm"
                  onClick={() => setIsEditingPassword(true)}
                >
                  <Key size={16} />
                  Change Password
                </button>
              )}
            </div>
            <div className="section-content">
              {isEditingPassword ? (
                <div className="password-form">
                  <div className="form-group">
                    <label className="form-label">Current Password</label>
                    <input
                      type="password"
                      name="currentPassword"
                      value={passwordData.currentPassword}
                      onChange={handlePasswordChange}
                      className="form-input"
                      placeholder="Enter current password"
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">New Password</label>
                    <input
                      type="password"
                      name="newPassword"
                      value={passwordData.newPassword}
                      onChange={handlePasswordChange}
                      className="form-input"
                      placeholder="Enter new password"
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Confirm New Password</label>
                    <input
                      type="password"
                      name="confirmPassword"
                      value={passwordData.confirmPassword}
                      onChange={handlePasswordChange}
                      className="form-input"
                      placeholder="Confirm new password"
                    />
                  </div>
                  <div className="form-actions">
                    <button 
                      className="btn btn-success"
                      onClick={handlePasswordSave}
                    >
                      <Save size={16} />
                      Update Password
                    </button>
                    <button 
                      className="btn btn-outline"
                      onClick={() => setIsEditingPassword(false)}
                    >
                      <X size={16} />
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div className="security-info">
                  <div className="security-item">
                    <div className="security-label">Password</div>
                    <div className="security-value">Last changed 3 months ago</div>
                  </div>
                  <div className="security-item">
                    <div className="security-label">Two-Factor Authentication</div>
                    <div className="security-value">Not enabled</div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Notification Settings */}
          <div className="profile-section">
            <div className="section-header">
              <h2 className="section-title">
                <Bell size={20} />
                Notification Preferences
              </h2>
              {!isEditingNotifications && (
                <button 
                  className="btn btn-outline btn-sm"
                  onClick={() => setIsEditingNotifications(true)}
                >
                  <Edit3 size={16} />
                  Edit Settings
                </button>
              )}
            </div>
            <div className="section-content">
              {isEditingNotifications ? (
                <div className="notification-form">
                  <div className="notification-group">
                    <label className="notification-label">
                      <input
                        type="checkbox"
                        name="emailNotifications"
                        checked={notificationSettings.emailNotifications}
                        onChange={handleNotificationChange}
                        className="notification-checkbox"
                      />
                      <span className="notification-text">Email Notifications</span>
                    </label>
                    <p className="notification-description">
                      Receive important updates via email
                    </p>
                  </div>

                  <div className="notification-group">
                    <label className="notification-label">
                      <input
                        type="checkbox"
                        name="smsNotifications"
                        checked={notificationSettings.smsNotifications}
                        onChange={handleNotificationChange}
                        className="notification-checkbox"
                      />
                      <span className="notification-text">SMS Notifications</span>
                    </label>
                    <p className="notification-description">
                      Receive urgent alerts via SMS
                    </p>
                  </div>

                  <div className="notification-group">
                    <label className="notification-label">
                      <input
                        type="checkbox"
                        name="pushNotifications"
                        checked={notificationSettings.pushNotifications}
                        onChange={handleNotificationChange}
                        className="notification-checkbox"
                      />
                      <span className="notification-text">Push Notifications</span>
                    </label>
                    <p className="notification-description">
                      Receive browser notifications
                    </p>
                  </div>

                  <div className="notification-group">
                    <label className="notification-label">
                      <input
                        type="checkbox"
                        name="weeklyReports"
                        checked={notificationSettings.weeklyReports}
                        onChange={handleNotificationChange}
                        className="notification-checkbox"
                      />
                      <span className="notification-text">Weekly Reports</span>
                    </label>
                    <p className="notification-description">
                      Receive weekly performance summaries
                    </p>
                  </div>

                  <div className="notification-group">
                    <label className="notification-label">
                      <input
                        type="checkbox"
                        name="paymentReminders"
                        checked={notificationSettings.paymentReminders}
                        onChange={handleNotificationChange}
                        className="notification-checkbox"
                      />
                      <span className="notification-text">Payment Reminders</span>
                    </label>
                    <p className="notification-description">
                      Get notified about overdue payments
                    </p>
                  </div>

                  <div className="notification-group">
                    <label className="notification-label">
                      <input
                        type="checkbox"
                        name="maintenanceAlerts"
                        checked={notificationSettings.maintenanceAlerts}
                        onChange={handleNotificationChange}
                        className="notification-checkbox"
                      />
                      <span className="notification-text">Maintenance Alerts</span>
                    </label>
                    <p className="notification-description">
                      Receive maintenance and repair notifications
                    </p>
                  </div>

                  <div className="form-actions">
                    <button 
                      className="btn btn-success"
                      onClick={handleNotificationSave}
                    >
                      <Save size={16} />
                      Save Settings
                    </button>
                    <button 
                      className="btn btn-outline"
                      onClick={() => setIsEditingNotifications(false)}
                    >
                      <X size={16} />
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div className="notification-summary">
                  <div className="notification-item">
                    <div className="notification-label">Email Notifications</div>
                    <div className={`notification-status ${notificationSettings.emailNotifications ? 'enabled' : 'disabled'}`}>
                      {notificationSettings.emailNotifications ? 'Enabled' : 'Disabled'}
                    </div>
                  </div>
                  <div className="notification-item">
                    <div className="notification-label">SMS Notifications</div>
                    <div className={`notification-status ${notificationSettings.smsNotifications ? 'enabled' : 'disabled'}`}>
                      {notificationSettings.smsNotifications ? 'Enabled' : 'Disabled'}
                    </div>
                  </div>
                  <div className="notification-item">
                    <div className="notification-label">Push Notifications</div>
                    <div className={`notification-status ${notificationSettings.pushNotifications ? 'enabled' : 'disabled'}`}>
                      {notificationSettings.pushNotifications ? 'Enabled' : 'Disabled'}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
