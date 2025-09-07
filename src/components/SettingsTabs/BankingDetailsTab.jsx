import React, { useState, useEffect } from 'react';
import { 
  CreditCard, 
  Building, 
  User, 
  Shield, 
  CheckCircle, 
  AlertCircle,
  Save,
  Edit,
  Eye,
  EyeOff
} from 'lucide-react';
import './BankingDetailsTab.css';

const BankingDetailsTab = ({ hostelInfo, onSave }) => {
  const [bankingDetails, setBankingDetails] = useState({
    accountHolderName: hostelInfo?.bankingDetails?.accountHolderName || '',
    bankName: hostelInfo?.bankingDetails?.bankName || '',
    accountNumber: hostelInfo?.bankingDetails?.accountNumber || '',
    routingNumber: hostelInfo?.bankingDetails?.routingNumber || '',
    accountType: hostelInfo?.bankingDetails?.accountType || 'checking',
    swiftCode: hostelInfo?.bankingDetails?.swiftCode || '',
    iban: hostelInfo?.bankingDetails?.iban || '',
    taxId: hostelInfo?.bankingDetails?.taxId || '',
    businessName: hostelInfo?.bankingDetails?.businessName || '',
    address: hostelInfo?.bankingDetails?.address || '',
    city: hostelInfo?.bankingDetails?.city || '',
    state: hostelInfo?.bankingDetails?.state || '',
    zipCode: hostelInfo?.bankingDetails?.zipCode || '',
    country: hostelInfo?.bankingDetails?.country || 'US'
  });

  const [showPassword, setShowPassword] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});

  // Fetch banks data when component mounts
  useEffect(() => {
    const fetchBanks = async () => {
      try {
        console.log('Fetching banks data from hq/api/manager/banks...');
        const response = await fetch('http://localhost:8080/hq/api/manager/banks', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            // Add authorization header if needed
            // 'Authorization': `Bearer ${token}`
          }
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const banksData = await response.json();
        console.log('Banks API Response:', banksData);
        
      } catch (error) {
        console.error('Error fetching banks data:', error);
      }
    };

    fetchBanks();
  }, []);

  const handleInputChange = (field, value) => {
    setBankingDetails(prev => ({ ...prev, [field]: value }));
    // Clear validation error when user starts typing
    if (validationErrors[field]) {
      setValidationErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = () => {
    const errors = {};
    
    if (!bankingDetails.accountHolderName.trim()) {
      errors.accountHolderName = 'Account holder name is required';
    }
    
    if (!bankingDetails.bankName.trim()) {
      errors.bankName = 'Bank name is required';
    }
    
    if (!bankingDetails.accountNumber.trim()) {
      errors.accountNumber = 'Account number is required';
    }
    
    if (!bankingDetails.routingNumber.trim()) {
      errors.routingNumber = 'Routing number is required';
    }
    
    if (bankingDetails.country === 'US' && bankingDetails.routingNumber.length !== 9) {
      errors.routingNumber = 'US routing number must be 9 digits';
    }
    
    if (bankingDetails.country !== 'US' && !bankingDetails.swiftCode.trim()) {
      errors.swiftCode = 'SWIFT code is required for international accounts';
    }
    
    if (bankingDetails.country !== 'US' && !bankingDetails.iban.trim()) {
      errors.iban = 'IBAN is required for international accounts';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSave = () => {
    if (validateForm()) {
      onSave(bankingDetails);
      setIsEditing(false);
      // Show success message
      alert('Banking details saved successfully!');
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    // Reset to original values
    setBankingDetails(hostelInfo?.bankingDetails || {
      accountHolderName: '',
      bankName: '',
      accountNumber: '',
      routingNumber: '',
      accountType: 'checking',
      swiftCode: '',
      iban: '',
      taxId: '',
      businessName: '',
      address: '',
      city: '',
      state: '',
      zipCode: '',
      country: 'US'
    });
    setValidationErrors({});
    setIsEditing(false);
  };

  const getMaskedAccountNumber = () => {
    const account = bankingDetails.accountNumber || '';
    if (!account || account.length <= 4) return account;
    return '*'.repeat(account.length - 4) + account.slice(-4);
  };

  const getMaskedRoutingNumber = () => {
    const routing = bankingDetails.routingNumber || '';
    if (!routing || routing.length <= 4) return routing;
    return routing.slice(0, 4) + '*'.repeat(routing.length - 4);
  };

  return (
    <div className="banking-details-tab">
      {/* Header Section */}
      <div className="banking-header">
        <div className="banking-header-content">
          <div>
            <h2 className="banking-title">Banking Details</h2>
            <p className="banking-subtitle">
              Configure your banking information to receive payments from tenants
            </p>
          </div>
          <div className="banking-actions">
            {!isEditing ? (
              <button className="btn btn-outline" onClick={handleEdit}>
                <Edit size={16} />
                Edit Details
              </button>
            ) : (
              <div className="edit-actions">
                <button className="btn btn-outline" onClick={handleCancel}>
                  Cancel
                </button>
                <button className="btn btn-primary" onClick={handleSave}>
                  <Save size={16} />
                  Save Changes
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Security Notice */}
      <div className="security-notice">
        <div className="security-icon">
          <Shield size={20} />
        </div>
        <div className="security-content">
          <h4>Secure Banking Information</h4>
          <p>
            Your banking details are encrypted and stored securely. We use industry-standard 
            security measures to protect your financial information.
          </p>
        </div>
      </div>

      {/* Banking Form */}
      <div className="banking-form-container">
        <form className="banking-form" onSubmit={(e) => e.preventDefault()}>
          {/* Account Information */}
          <div className="form-section">
            <h3 className="section-title">
              <CreditCard size={20} />
              Account Information
            </h3>
            <div className="form-grid">
              <div className="form-group">
                <label className="form-label">Account Holder Name *</label>
                <input
                  type="text"
                  className={`form-input ${validationErrors.accountHolderName ? 'error' : ''}`}
                  value={bankingDetails.accountHolderName}
                  onChange={(e) => handleInputChange('accountHolderName', e.target.value)}
                  disabled={!isEditing}
                  placeholder="Enter account holder name"
                />
                {validationErrors.accountHolderName && (
                  <span className="error-message">{validationErrors.accountHolderName}</span>
                )}
              </div>

              <div className="form-group">
                <label className="form-label">Business Name</label>
                <input
                  type="text"
                  className="form-input"
                  value={bankingDetails.businessName}
                  onChange={(e) => handleInputChange('businessName', e.target.value)}
                  disabled={!isEditing}
                  placeholder="Enter business name (if different)"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Bank Name *</label>
                <input
                  type="text"
                  className={`form-input ${validationErrors.bankName ? 'error' : ''}`}
                  value={bankingDetails.bankName}
                  onChange={(e) => handleInputChange('bankName', e.target.value)}
                  disabled={!isEditing}
                  placeholder="Enter bank name"
                />
                {validationErrors.bankName && (
                  <span className="error-message">{validationErrors.bankName}</span>
                )}
              </div>

              <div className="form-group">
                <label className="form-label">Account Type</label>
                <select
                  className="form-select"
                  value={bankingDetails.accountType}
                  onChange={(e) => handleInputChange('accountType', e.target.value)}
                  disabled={!isEditing}
                >
                  <option value="checking">Checking Account</option>
                  <option value="savings">Savings Account</option>
                  <option value="business">Business Account</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Account Number *</label>
                <div className="input-with-toggle">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    className={`form-input ${validationErrors.accountNumber ? 'error' : ''}`}
                    value={isEditing ? bankingDetails.accountNumber : getMaskedAccountNumber()}
                    onChange={(e) => handleInputChange('accountNumber', e.target.value)}
                    disabled={!isEditing}
                    placeholder="Enter account number"
                  />
                  {!isEditing && (
                    <button
                      type="button"
                      className="toggle-visibility"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  )}
                </div>
                {validationErrors.accountNumber && (
                  <span className="error-message">{validationErrors.accountNumber}</span>
                )}
              </div>

              <div className="form-group">
                <label className="form-label">Routing Number *</label>
                <div className="input-with-toggle">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    className={`form-input ${validationErrors.routingNumber ? 'error' : ''}`}
                    value={isEditing ? bankingDetails.routingNumber : getMaskedRoutingNumber()}
                    onChange={(e) => handleInputChange('routingNumber', e.target.value)}
                    disabled={!isEditing}
                    placeholder="Enter routing number"
                  />
                  {!isEditing && (
                    <button
                      type="button"
                      className="toggle-visibility"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  )}
                </div>
                {validationErrors.routingNumber && (
                  <span className="error-message">{validationErrors.routingNumber}</span>
                )}
              </div>
            </div>
          </div>

          {/* International Banking */}
          <div className="form-section">
            <h3 className="section-title">
              <Building size={20} />
              International Banking (Optional)
            </h3>
            <div className="form-grid">
              <div className="form-group">
                <label className="form-label">Country</label>
                <select
                  className="form-select"
                  value={bankingDetails.country}
                  onChange={(e) => handleInputChange('country', e.target.value)}
                  disabled={!isEditing}
                >
                  <option value="US">United States</option>
                  <option value="CA">Canada</option>
                  <option value="GB">United Kingdom</option>
                  <option value="DE">Germany</option>
                  <option value="FR">France</option>
                  <option value="AU">Australia</option>
                  <option value="IN">India</option>
                  <option value="OTHER">Other</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">SWIFT Code</label>
                <input
                  type="text"
                  className={`form-input ${validationErrors.swiftCode ? 'error' : ''}`}
                  value={bankingDetails.swiftCode}
                  onChange={(e) => handleInputChange('swiftCode', e.target.value)}
                  disabled={!isEditing}
                  placeholder="Enter SWIFT code"
                />
                {validationErrors.swiftCode && (
                  <span className="error-message">{validationErrors.swiftCode}</span>
                )}
              </div>

              <div className="form-group">
                <label className="form-label">IBAN</label>
                <input
                  type="text"
                  className={`form-input ${validationErrors.iban ? 'error' : ''}`}
                  value={bankingDetails.iban}
                  onChange={(e) => handleInputChange('iban', e.target.value)}
                  disabled={!isEditing}
                  placeholder="Enter IBAN"
                />
                {validationErrors.iban && (
                  <span className="error-message">{validationErrors.iban}</span>
                )}
              </div>

              <div className="form-group">
                <label className="form-label">Tax ID / EIN</label>
                <input
                  type="text"
                  className="form-input"
                  value={bankingDetails.taxId}
                  onChange={(e) => handleInputChange('taxId', e.target.value)}
                  disabled={!isEditing}
                  placeholder="Enter Tax ID or EIN"
                />
              </div>
            </div>
          </div>

          {/* Business Address */}
          <div className="form-section">
            <h3 className="section-title">
              <User size={20} />
              Business Address
            </h3>
            <div className="form-grid">
              <div className="form-group full">
                <label className="form-label">Street Address</label>
                <input
                  type="text"
                  className="form-input"
                  value={bankingDetails.address}
                  onChange={(e) => handleInputChange('address', e.target.value)}
                  disabled={!isEditing}
                  placeholder="Enter street address"
                />
              </div>

              <div className="form-group">
                <label className="form-label">City</label>
                <input
                  type="text"
                  className="form-input"
                  value={bankingDetails.city}
                  onChange={(e) => handleInputChange('city', e.target.value)}
                  disabled={!isEditing}
                  placeholder="Enter city"
                />
              </div>

              <div className="form-group">
                <label className="form-label">State / Province</label>
                <input
                  type="text"
                  className="form-input"
                  value={bankingDetails.state}
                  onChange={(e) => handleInputChange('state', e.target.value)}
                  disabled={!isEditing}
                  placeholder="Enter state or province"
                />
              </div>

              <div className="form-group">
                <label className="form-label">ZIP / Postal Code</label>
                <input
                  type="text"
                  className="form-input"
                  value={bankingDetails.zipCode}
                  onChange={(e) => handleInputChange('zipCode', e.target.value)}
                  disabled={!isEditing}
                  placeholder="Enter ZIP or postal code"
                />
              </div>
            </div>
          </div>
        </form>
      </div>

      {/* Payment Status */}
      <div className="payment-status">
        <div className="status-header">
          <h3>Payment Setup Status</h3>
        </div>
        <div className="status-grid">
          <div className="status-item completed">
            <CheckCircle size={20} />
            <span>Banking Details</span>
          </div>
          <div className="status-item pending">
            <AlertCircle size={20} />
            <span>Payment Gateway</span>
          </div>
          <div className="status-item pending">
            <AlertCircle size={20} />
            <span>Verification</span>
          </div>
        </div>
        <p className="status-note">
          Complete your banking details to start receiving payments from tenants. 
          Additional verification may be required for security purposes.
        </p>
      </div>
    </div>
  );
};

export default BankingDetailsTab;
