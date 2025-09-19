import React, { useState, useEffect } from 'react';
import { 
  CreditCard, 
  Shield, 
  Save,
  Edit,
  CheckCircle,
  Trash2
} from 'lucide-react';
import { API_ENDPOINTS } from '../../config/api';
import './BankingDetailsTab.css';

const BankingDetailsTab = ({ hostelInfo, onSave }) => {
  const [bankingDetails, setBankingDetails] = useState({
    bankId: hostelInfo?.bankingDetails?.bankId || '',
    bankName: hostelInfo?.bankingDetails?.bankName || '',
    accountNumber: hostelInfo?.bankingDetails?.accountNumber || '',
    accountHolderName: hostelInfo?.bankingDetails?.accountHolderName || ''
  });

  const [isEditing, setIsEditing] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});
  const [banksData, setBanksData] = useState([]);
  const [filteredBanks, setFilteredBanks] = useState([]);
  const [showBankDropdown, setShowBankDropdown] = useState(false);
  const [bankSearchTerm, setBankSearchTerm] = useState(hostelInfo?.bankingDetails?.bankName || '');
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [hasExistingAccount, setHasExistingAccount] = useState(false);
  const [savedAccountDetails, setSavedAccountDetails] = useState(null);

  // Check for existing account on component mount
  useEffect(() => {
    const checkExistingAccount = async () => {
      const token = localStorage.getItem('token');
      
      if (!token) {
        console.log('No token found, user not authenticated');
        return;
      }

      try {
        // First check localStorage
        const savedAccountName = localStorage.getItem('userAccountName');
        const savedBankingDetails = localStorage.getItem('userBankingDetails');

        console.log('Checking localStorage:');
        console.log('savedAccountName:', savedAccountName);
        console.log('savedBankingDetails:', savedBankingDetails);

        // If we have data in localStorage, use it
        if (savedAccountName && savedBankingDetails) {
          setHasExistingAccount(true);
          setSavedAccountDetails(JSON.parse(savedBankingDetails));
          console.log('Found existing account in localStorage, setting hasExistingAccount to true');
        } else {
          // If no localStorage data, check backend
          console.log('No localStorage data, checking backend...');
          
          const response = await fetch(API_ENDPOINTS.BANKS_LIST, {
            method: 'GET',
            headers: {
              'Authorization': `Token ${token}`
            }
          });

          if (response.ok) {
            const responseData = await response.json();
            console.log('Backend response:', responseData);
            
            // Check if user has existing banking details
            if (responseData.status === 'success' && responseData.data && responseData.data.account_number) {
              // User has existing account in backend
              const existingAccount = responseData.data; // Account data is directly in data field
              const accountDetails = {
                bankId: existingAccount.bank_id,
                bankName: existingAccount.settlement_bank || existingAccount.bank_name,
                accountNumber: existingAccount.account_number,
                accountHolderName: existingAccount.account_name,
                subaccountCode: existingAccount.subaccount_code,
                accountName: existingAccount.account_name,
                settlementBank: existingAccount.settlement_bank,
                currency: existingAccount.currency,
                percentageCharge: existingAccount.percentage_charge,
                isVerified: existingAccount.is_verified,
                active: existingAccount.active,
                createdAt: existingAccount.createdAt
              };
              
              setHasExistingAccount(true);
              setSavedAccountDetails(accountDetails);
              
              // Update localStorage with backend data
              localStorage.setItem('userAccountName', existingAccount.account_name);
              localStorage.setItem('userBankingDetails', JSON.stringify(accountDetails));
              
              console.log('Found existing account in backend, synced to localStorage');
            } else {
              console.log('No existing account found in backend');
            }
          } else {
            console.log('Failed to check backend for existing account:', response.status);
          }
        }
      } catch (error) {
        console.error('Error checking for existing account:', error);
      }
    };

    checkExistingAccount();
  }, []);

  // Fetch banks data when component mounts
  useEffect(() => {
    const fetchBanks = async () => {
      const token = localStorage.getItem('token');
      
      try {
        console.log('Fetching banks data from hq/api/manager/banks...');
        const response = await fetch(API_ENDPOINTS.BANKS_LIST, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            // Add authorization header if needed
            'Authorization': `Token ${token}`
          }
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const banksData = await response.json();
        console.log('Banks API Response:', banksData);
        
        if (banksData.status === 'success' && banksData.response) {
          setBanksData(banksData.response);
          setFilteredBanks(banksData.response);
        }
        
      } catch (error) {
        console.error('Error fetching banks data:', error);
      }
    };

    fetchBanks();
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest('.bank-search-container')) {
        setShowBankDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Filter banks based on search term
  const handleBankSearch = (searchTerm) => {
    setBankSearchTerm(searchTerm);
    setBankingDetails(prev => ({ ...prev, bankName: searchTerm }));
    
    if (searchTerm.trim() === '') {
      setFilteredBanks(banksData);
      // Clear validation error when field is empty
      setValidationErrors(prev => ({ ...prev, bankName: '' }));
    } else {
      const filtered = banksData.filter(bank => 
        bank.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredBanks(filtered);
      
      // Validate if the entered bank exists in the list and get the bank ID
      const foundBank = banksData.find(bank => 
        bank.name.toLowerCase() === searchTerm.toLowerCase()
      );
      
      if (!foundBank) {
        setValidationErrors(prev => ({ 
          ...prev, 
          bankName: 'The bank entered is not in the accepted banks list' 
        }));
        setBankingDetails(prev => ({ ...prev, bankId: '' }));
      } else {
        setValidationErrors(prev => ({ 
          ...prev, 
          bankName: '' 
        }));
        setBankingDetails(prev => ({ ...prev, bankId: foundBank.id }));
      }
    }
    setShowBankDropdown(true);
  };

  // Select a bank from dropdown
  const selectBank = (bank) => {
    setBankingDetails(prev => ({ ...prev, bankName: bank.name, bankId: bank.id }));
    setBankSearchTerm(bank.name);
    setShowBankDropdown(false);
    // Clear any validation errors when a valid bank is selected
    setValidationErrors(prev => ({ ...prev, bankName: '' }));
  };

  const handleInputChange = (field, value) => {
    if (field === 'bankName') {
      handleBankSearch(value);
    } else {
    setBankingDetails(prev => ({ ...prev, [field]: value }));
      // Clear validation error when user starts typing (for non-bank fields)
    if (validationErrors[field]) {
      setValidationErrors(prev => ({ ...prev, [field]: '' }));
      }
    }
  };

  const validateForm = () => {
    const errors = {};
    
    if (!bankingDetails.bankName.trim()) {
      errors.bankName = 'Bank name is required';
    } else if (!bankingDetails.bankId) {
      errors.bankName = 'The bank entered is not in the accepted banks list';
    }
    
    if (!bankingDetails.accountNumber.trim()) {
      errors.accountNumber = 'Account number is required';
    }
    
    if (!bankingDetails.accountHolderName.trim()) {
      errors.accountHolderName = 'Account holder name is required';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSave = async () => {
    if (validateForm()) {
      const token = localStorage.getItem('token');
      
      try {
        // Prepare data to send - only send bankId, not bankName
        const dataToSend = {
          bankId: bankingDetails.bankId,
          accountNumber: bankingDetails.accountNumber,
          accountHolderName: bankingDetails.accountHolderName
        };
        
        console.log('Saving banking details to hq/api/manager/banks...');
        console.log('Banking details to save:', dataToSend);
        console.log('Request headers:', {
          'Content-Type': 'application/json',
          'Authorization': `Token ${token}`
        });
        
        const response = await fetch(API_ENDPOINTS.BANKING_CREATE, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Token ${token}`
          },
          body: JSON.stringify(dataToSend)
        });

        console.log('Response status:', response.status);
        console.log('Response headers:', Object.fromEntries(response.headers.entries()));

        if (!response.ok) {
          // Try to get error details from response
          let errorDetails = '';
          try {
            const errorResponse = await response.json();
            errorDetails = JSON.stringify(errorResponse);
            console.error('Error response details:', errorResponse);
          } catch (e) {
            errorDetails = await response.text();
            console.error('Error response text:', errorDetails);
          }
          throw new Error(`HTTP error! status: ${response.status}, details: ${errorDetails}`);
        }

        const responseData = await response.json();
        console.log('Banking details save response:', responseData);
        
        // Handle the response based on the structure
        if (responseData.status === 'success' && responseData.data) {
          const { data } = responseData.data; // data is nested in responseData.data
          
          // Update banking details with the response data
          const updatedBankingDetails = {
            ...bankingDetails,
            subaccountCode: data.subaccount_code,
            accountName: data.account_name,
            accountNumber: data.account_number,
            settlementBank: data.settlement_bank,
            currency: data.currency,
            percentageCharge: data.percentage_charge,
            isVerified: data.is_verified,
            active: data.active,
            createdAt: data.createdAt
          };
          
          // Save account name to localStorage
          localStorage.setItem('userAccountName', data.account_name);
          localStorage.setItem('userBankingDetails', JSON.stringify(updatedBankingDetails));
          
          // Update the saved account details state
          setSavedAccountDetails(updatedBankingDetails);
          setHasExistingAccount(true);
          
          // Call the parent onSave function with updated details
          onSave(updatedBankingDetails);
          setIsEditing(false);
          
          // Show success message
          setShowSuccessMessage(true);
          
          // Auto-hide success message after 5 seconds
          setTimeout(() => {
            setShowSuccessMessage(false);
          }, 5000);
        } else {
          // Handle error response
          const errorMessage = responseData.message || 'Failed to save banking details';
          alert(`Error: ${errorMessage}`);
        }
        
      } catch (error) {
        console.error('Error saving banking details:', error);
        alert('Failed to save banking details. Please try again.');
      }
    }
  };

  const handleEdit = () => {
    // Populate form with existing account data
    setBankingDetails({
      bankId: savedAccountDetails.bankId || '',
      bankName: savedAccountDetails.settlementBank || '',
      accountNumber: savedAccountDetails.accountNumber || '',
      accountHolderName: savedAccountDetails.accountName || ''
    });
    setBankSearchTerm(savedAccountDetails.settlementBank || '');
    setValidationErrors({});
    setIsEditing(true);
  };

  const handleDeleteAccount = () => {
    if (window.confirm('Are you sure you want to delete your banking information? This action cannot be undone.')) {
      // Clear existing account data
      localStorage.removeItem('userAccountName');
      localStorage.removeItem('userBankingDetails');
      setHasExistingAccount(false);
      setSavedAccountDetails(null);
      
      // Reset form
      setBankingDetails({
        bankId: '',
        bankName: '',
        accountNumber: '',
        accountHolderName: ''
      });
      setBankSearchTerm('');
      setValidationErrors({});
      setIsEditing(false);
      
      console.log('Account deleted, localStorage cleared');
    }
  };


  const handleCancel = () => {
    // If we have existing account data, reset to that
    if (hasExistingAccount && savedAccountDetails) {
      setBankingDetails({
        bankId: savedAccountDetails.bankId || '',
        bankName: savedAccountDetails.settlementBank || '',
        accountNumber: savedAccountDetails.accountNumber || '',
        accountHolderName: savedAccountDetails.accountName || ''
      });
      setBankSearchTerm(savedAccountDetails.settlementBank || '');
    } else {
      // Reset to original values
      setBankingDetails(hostelInfo?.bankingDetails || {
        bankId: '',
        bankName: '',
        accountNumber: '',
        accountHolderName: ''
      });
      setBankSearchTerm(hostelInfo?.bankingDetails?.bankName || '');
    }
    setValidationErrors({});
    setIsEditing(false);
  };

  const getMaskedAccountNumber = () => {
    const account = bankingDetails.accountNumber || '';
    if (!account || account.length <= 4) return account;
    return '*'.repeat(account.length - 4) + account.slice(-4);
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
            {isEditing ? (
              <div className="edit-actions">
                <button className="btn btn-outline" onClick={handleCancel}>
                  Cancel
                </button>
                <button className="btn btn-primary" onClick={handleSave}>
                  <Save size={16} />
                  {hasExistingAccount ? 'Update Account' : 'Create Account'}
                </button>
              </div>
            ) : !hasExistingAccount && (
              <button className="btn btn-primary" onClick={handleSave}>
                <Save size={16} />
                Create Account
              </button>
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

      {/* Success Message */}
      {showSuccessMessage && (
        <div className="success-notification">
          <div className="success-content">
            <div className="success-icon">
              <CheckCircle size={24} />
            </div>
            <div className="success-text">
              <h4>{hasExistingAccount ? 'Account Updated Successfully!' : 'Account Created Successfully!'}</h4>
              <p>Your payment account has been verified and is ready to receive payments from tenants.</p>
            </div>
            <button 
              className="success-close"
              onClick={() => setShowSuccessMessage(false)}
            >
              ×
            </button>
          </div>
        </div>
      )}

      {/* Show Account View if user has account and not editing */}
      {hasExistingAccount && savedAccountDetails && !isEditing && (
        <div className="existing-account-container">
          <div className="account-overview">
            <div className="account-header">
              <h3>Your Payment Account</h3>
              <div className="account-actions">
                <button className="btn btn-outline" onClick={handleEdit}>
                  <Edit size={16} />
                  Edit Details
                </button>
                <button className="btn btn-danger" onClick={handleDeleteAccount}>
                  <Trash2 size={16} />
                  Delete Account
                </button>
              </div>
            </div>
            
            <div className="account-summary">
              <div className="account-info-card">
                <div className="info-item">
                  <span className="info-label">Account Name:</span>
                  <span className="info-value">{savedAccountDetails.accountName}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Account Number:</span>
                  <span className="info-value">{savedAccountDetails.accountNumber}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Bank:</span>
                  <span className="info-value">{savedAccountDetails.settlementBank}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Currency:</span>
                  <span className="info-value">{savedAccountDetails.currency}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Show Form if no account OR if editing */}
      {(!hasExistingAccount || isEditing) && (
      <div className="banking-form-container">
        <form className="banking-form" onSubmit={(e) => e.preventDefault()}>
          {/* Account Information */}
          <div className="form-section">
            <h3 className="section-title">
              <CreditCard size={20} />
              {hasExistingAccount ? 'Edit Account Information' : 'Account Information'}
            </h3>
              <div className="modern-form-grid">
              <div className="form-group">
                <label className="form-label">Bank Name *</label>
                  <div className="bank-search-container">
                <input
                  type="text"
                  className={`form-input ${validationErrors.bankName ? 'error' : ''}`}
                      value={bankSearchTerm}
                  onChange={(e) => handleInputChange('bankName', e.target.value)}
                      onFocus={() => setShowBankDropdown(true)}
                  disabled={hasExistingAccount && !isEditing}
                      placeholder="Search for your bank..."
                      autoComplete="off"
                    />
                    {showBankDropdown && (isEditing || !hasExistingAccount) && filteredBanks.length > 0 && (
                      <div className="bank-dropdown">
                        {filteredBanks.slice(0, 10).map((bank) => (
                          <div
                            key={bank.id}
                            className="bank-option"
                            onClick={() => selectBank(bank)}
                          >
                            {bank.name}
                          </div>
                        ))}
                        {filteredBanks.length > 10 && (
                          <div className="bank-option-more">
                            ... and {filteredBanks.length - 10} more banks
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                {validationErrors.bankName && (
                  <span className="error-message">{validationErrors.bankName}</span>
                )}
              </div>

              <div className="form-group">
                <label className="form-label">Account Number *</label>
                  <input
                    type="text"
                    className={`form-input ${validationErrors.accountNumber ? 'error' : ''}`}
                    value={hasExistingAccount && !isEditing ? getMaskedAccountNumber() : bankingDetails.accountNumber}
                    onChange={(e) => handleInputChange('accountNumber', e.target.value)}
                    disabled={hasExistingAccount && !isEditing}
                    placeholder="Enter account number"
                  />
                {validationErrors.accountNumber && (
                  <span className="error-message">{validationErrors.accountNumber}</span>
                )}
              </div>

              <div className="form-group">
                  <label className="form-label">Account Holder Name *</label>
                  <input
                    type="text"
                    className={`form-input ${validationErrors.accountHolderName ? 'error' : ''}`}
                    value={bankingDetails.accountHolderName}
                    onChange={(e) => handleInputChange('accountHolderName', e.target.value)}
                    disabled={hasExistingAccount && !isEditing}
                    placeholder="Enter account holder name"
                  />
                  {validationErrors.accountHolderName && (
                    <span className="error-message">{validationErrors.accountHolderName}</span>
                )}
              </div>
            </div>
          </div>

          </form>
        </div>
      )}


    </div>
  );
};

export default BankingDetailsTab;
