import React, { useState, useEffect } from 'react';
import { 
  X, 
  User, 
  Mail, 
  Phone, 
  Home, 
  Calendar,
  DollarSign,
  FileText,
  Save,
  UserPlus,
  AlertCircle,
  CheckCircle,
  Loader2
} from 'lucide-react';
import './TenantModal.css';
import { validateEmailRealTime, sanitizeEmail } from '../../utils/emailValidation';

const TenantModal = ({ 
  isOpen, 
  onClose, 
  tenant = null, 
  onSave, 
  mode = 'add',
  existingTenants = [] // Array of existing tenants for email uniqueness check
}) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    room: '',
    checkInDate: '',
    rentAmount: '',
    deposit: '',
    leaseStartDate: '',
    leaseEndDate: '',
    emergencyContact: {
      name: '',
      phone: '',
      relationship: ''
    },
    documents: [],
    notes: ''
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [emailValidation, setEmailValidation] = useState({
    isValid: false,
    isChecking: false,
    error: ''
  });

  // Initialize form with tenant data if editing
  useEffect(() => {
    if (tenant && mode === 'edit') {
      setFormData({
        name: tenant.name || '',
        email: tenant.email || '',
        phone: tenant.phone || '',
        room: tenant.room || '',
        checkInDate: tenant.checkInDate || '',
        rentAmount: tenant.rentAmount || '',
        deposit: tenant.deposit || '',
        leaseStartDate: tenant.leaseStartDate || '',
        leaseEndDate: tenant.leaseEndDate || '',
        emergencyContact: tenant.emergencyContact || {
          name: '',
          phone: '',
          relationship: ''
        },
        documents: tenant.documents || [],
        notes: tenant.notes || ''
      });
    }
  }, [tenant, mode]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
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
      const result = await validateEmailRealTime(
        email, 
        existingTenants, 
        mode === 'edit' ? tenant?.id : null
      );
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
      if (formData.email) {
        validateEmailField(formData.email);
      }
    }, 500); // 500ms debounce

    return () => clearTimeout(timeoutId);
  }, [formData.email, existingTenants, tenant?.id, mode]);

  const handleEmergencyContactChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      emergencyContact: {
        ...prev.emergencyContact,
        [field]: value
      }
    }));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    // Email validation - use the real-time validation result
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!emailValidation.isValid) {
      newErrors.email = emailValidation.error || 'Email is invalid';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    }

    if (!formData.room.trim()) {
      newErrors.room = 'Room assignment is required';
    }

    if (!formData.checkInDate) {
      newErrors.checkInDate = 'Check-in date is required';
    }

    if (!formData.rentAmount || parseFloat(formData.rentAmount) <= 0) {
      newErrors.rentAmount = 'Valid rent amount is required';
    }

    if (!formData.leaseStartDate) {
      newErrors.leaseStartDate = 'Lease start date is required';
    }

    if (!formData.leaseEndDate) {
      newErrors.leaseEndDate = 'Lease end date is required';
    }

    if (formData.leaseStartDate && formData.leaseEndDate) {
      if (new Date(formData.leaseStartDate) >= new Date(formData.leaseEndDate)) {
        newErrors.leaseEndDate = 'Lease end date must be after start date';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    
    try {
      await onSave(formData);
      onClose();
    } catch (error) {
      console.error('Error saving tenant:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="tenant-modal-overlay">
      <div className="tenant-modal">
        {/* Modal Header */}
        <div className="modal-header">
          <div className="modal-title">
            {mode === 'add' ? (
              <>
                <UserPlus size={20} />
                <span>Add New Tenant</span>
              </>
            ) : (
              <>
                <User size={20} />
                <span>Edit Tenant</span>
              </>
            )}
          </div>
          <button 
            className="modal-close" 
            onClick={handleClose}
            disabled={isSubmitting}
          >
            <X size={20} />
          </button>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleSubmit} className="tenant-form">
          <div className="form-sections">
            {/* Basic Information */}
            <div className="form-section">
              <h3 className="section-title">
                <User size={18} />
                Basic Information
              </h3>
              <div className="form-grid">
                <div className="form-group">
                  <label className="form-label">Full Name *</label>
                  <input
                    type="text"
                    className={`form-input ${errors.name ? 'error' : ''}`}
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    placeholder="Enter tenant's full name"
                    disabled={isSubmitting}
                  />
                  {errors.name && <span className="error-message">{errors.name}</span>}
                </div>

                <div className="form-group">
                  <label className="form-label">Email Address *</label>
                  <div className="email-input-container">
                    <input
                      type="email"
                      className={`form-input ${errors.email ? 'error' : ''} ${emailValidation.isValid ? 'valid' : ''}`}
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', sanitizeEmail(e.target.value))}
                      placeholder="Enter email address"
                      disabled={isSubmitting}
                    />
                    <div className="email-validation-icon">
                      {emailValidation.isChecking && <Loader2 size={16} className="spinning" />}
                      {!emailValidation.isChecking && emailValidation.isValid && <CheckCircle size={16} className="valid-icon" />}
                      {!emailValidation.isChecking && !emailValidation.isValid && formData.email && <AlertCircle size={16} className="invalid-icon" />}
                    </div>
                  </div>
                  {errors.email && <span className="error-message">{errors.email}</span>}
                  {!errors.email && emailValidation.error && <span className="error-message">{emailValidation.error}</span>}
                </div>

                <div className="form-group">
                  <label className="form-label">Phone Number *</label>
                  <input
                    type="tel"
                    className={`form-input ${errors.phone ? 'error' : ''}`}
                    value={formData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    placeholder="Enter phone number"
                    disabled={isSubmitting}
                  />
                  {errors.phone && <span className="error-message">{errors.phone}</span>}
                </div>

                <div className="form-group">
                  <label className="form-label">Room Assignment *</label>
                  <input
                    type="text"
                    className={`form-input ${errors.room ? 'error' : ''}`}
                    value={formData.room}
                    onChange={(e) => handleInputChange('room', e.target.value)}
                    placeholder="e.g., 3 in room"
                    disabled={isSubmitting}
                  />
                  {errors.room && <span className="error-message">{errors.room}</span>}
                  <small className="form-help">Enter the position in room (e.g., "3 in room" means 3rd person in the room)</small>
                </div>
              </div>
            </div>

            {/* Dates & Financial */}
            <div className="form-section">
              <h3 className="section-title">
                <Calendar size={18} />
                Dates & Financial
              </h3>
              <div className="form-grid">
                <div className="form-group">
                  <label className="form-label">Check-in Date *</label>
                  <input
                    type="date"
                    className={`form-input ${errors.checkInDate ? 'error' : ''}`}
                    value={formData.checkInDate}
                    onChange={(e) => handleInputChange('checkInDate', e.target.value)}
                    disabled={isSubmitting}
                  />
                  {errors.checkInDate && <span className="error-message">{errors.checkInDate}</span>}
                </div>

                <div className="form-group">
                  <label className="form-label">Lease Start Date *</label>
                  <input
                    type="date"
                    className={`form-input ${errors.leaseStartDate ? 'error' : ''}`}
                    value={formData.leaseStartDate}
                    onChange={(e) => handleInputChange('leaseStartDate', e.target.value)}
                    disabled={isSubmitting}
                  />
                  {errors.leaseStartDate && <span className="error-message">{errors.leaseStartDate}</span>}
                </div>

                <div className="form-group">
                  <label className="form-label">Lease End Date *</label>
                  <input
                    type="date"
                    className={`form-input ${errors.leaseEndDate ? 'error' : ''}`}
                    value={formData.leaseEndDate}
                    onChange={(e) => handleInputChange('leaseEndDate', e.target.value)}
                    disabled={isSubmitting}
                  />
                  {errors.leaseEndDate && <span className="error-message">{errors.leaseEndDate}</span>}
                </div>

                <div className="form-group">
                  <label className="form-label">Monthly Rent *</label>
                  <div className="input-with-icon">
                    <DollarSign size={16} className="input-icon" />
                    <input
                      type="number"
                      className={`form-input ${errors.rentAmount ? 'error' : ''}`}
                      value={formData.rentAmount}
                      onChange={(e) => handleInputChange('rentAmount', e.target.value)}
                      placeholder="0.00"
                      min="0"
                      step="0.01"
                      disabled={isSubmitting}
                    />
                  </div>
                  {errors.rentAmount && <span className="error-message">{errors.rentAmount}</span>}
                </div>

                <div className="form-group">
                  <label className="form-label">Security Deposit</label>
                  <div className="input-with-icon">
                    <DollarSign size={16} className="input-icon" />
                    <input
                      type="number"
                      className="form-input"
                      value={formData.deposit}
                      onChange={(e) => handleInputChange('deposit', e.target.value)}
                      placeholder="0.00"
                      min="0"
                      step="0.01"
                      disabled={isSubmitting}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Emergency Contact */}
            <div className="form-section">
              <h3 className="section-title">
                <Phone size={18} />
                Emergency Contact
              </h3>
              <div className="form-grid">
                <div className="form-group">
                  <label className="form-label">Contact Name</label>
                  <input
                    type="text"
                    className="form-input"
                    value={formData.emergencyContact.name}
                    onChange={(e) => handleEmergencyContactChange('name', e.target.value)}
                    placeholder="Enter emergency contact name"
                    disabled={isSubmitting}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Contact Phone</label>
                  <input
                    type="tel"
                    className="form-input"
                    value={formData.emergencyContact.phone}
                    onChange={(e) => handleEmergencyContactChange('phone', e.target.value)}
                    placeholder="Enter emergency contact phone"
                    disabled={isSubmitting}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Relationship</label>
                  <input
                    type="text"
                    className="form-input"
                    value={formData.emergencyContact.relationship}
                    onChange={(e) => handleEmergencyContactChange('relationship', e.target.value)}
                    placeholder="e.g., Parent, Spouse, Friend"
                    disabled={isSubmitting}
                  />
                </div>
              </div>
            </div>

            {/* Additional Information */}
            <div className="form-section">
              <h3 className="section-title">
                <FileText size={18} />
                Additional Information
              </h3>
              <div className="form-group full">
                <label className="form-label">Notes</label>
                <textarea
                  className="form-textarea"
                  value={formData.notes}
                  onChange={(e) => handleInputChange('notes', e.target.value)}
                  placeholder="Add any additional notes about the tenant..."
                  rows={4}
                  disabled={isSubmitting}
                />
              </div>
            </div>
          </div>

          {/* Form Actions */}
          <div className="form-actions">
            <button
              type="button"
              className="btn btn-outline"
              onClick={handleClose}
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <div className="spinner"></div>
                  Saving...
                </>
              ) : (
                <>
                  <Save size={16} />
                  {mode === 'add' ? 'Add Tenant' : 'Save Changes'}
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TenantModal;
