import React, { useState, useEffect } from 'react';
import { 
  X, 
  CreditCard, 
  DollarSign, 
  Calendar,
  User,
  Home,
  FileText,
  Save,
  Plus
} from 'lucide-react';
import './PaymentModal.css';

const PaymentModal = ({ 
  isOpen, 
  onClose, 
  payment = null, 
  onSave, 
  mode = 'add',
  tenants = []
}) => {
  const [formData, setFormData] = useState({
    tenantId: '',
    amount: '',
    paymentDate: '',
    dueDate: '',
    paymentMethod: 'cash',
    reference: '',
    notes: '',
    category: 'rent',
    status: 'paid'
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Initialize form with payment data if editing
  useEffect(() => {
    if (payment && mode === 'edit') {
      setFormData({
        tenantId: payment.tenantId || '',
        amount: payment.amount || '',
        paymentDate: payment.paymentDate || '',
        dueDate: payment.dueDate || '',
        paymentMethod: payment.paymentMethod || 'cash',
        reference: payment.reference || '',
        notes: payment.notes || '',
        category: payment.category || 'rent',
        status: payment.status || 'paid'
      });
    } else {
      // Set default values for new payment
      setFormData({
        tenantId: '',
        amount: '',
        paymentDate: new Date().toISOString().split('T')[0],
        dueDate: '',
        paymentMethod: 'cash',
        reference: '',
        notes: '',
        category: 'rent',
        status: 'paid'
      });
    }
  }, [payment, mode]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.tenantId) {
      newErrors.tenantId = 'Tenant selection is required';
    }

    if (!formData.amount || parseFloat(formData.amount) <= 0) {
      newErrors.amount = 'Valid payment amount is required';
    }

    if (!formData.paymentDate) {
      newErrors.paymentDate = 'Payment date is required';
    }

    if (!formData.dueDate) {
      newErrors.dueDate = 'Due date is required';
    }

    if (formData.paymentDate && formData.dueDate) {
      if (new Date(formData.paymentDate) > new Date(formData.dueDate)) {
        newErrors.paymentDate = 'Payment date cannot be after due date';
      }
    }

    if (!formData.paymentMethod) {
      newErrors.paymentMethod = 'Payment method is required';
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
      console.error('Error saving payment:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      onClose();
    }
  };

  const getSelectedTenant = () => {
    return tenants.find(tenant => tenant.id == formData.tenantId);
  };

  if (!isOpen) return null;

  return (
    <div className="payment-modal-overlay">
      <div className="payment-modal">
        {/* Modal Header */}
        <div className="modal-header">
          <div className="modal-title">
            {mode === 'add' ? (
              <>
                <Plus size={20} />
                <span>Record New Payment</span>
              </>
            ) : (
              <>
                <CreditCard size={20} />
                <span>Edit Payment</span>
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
        <form onSubmit={handleSubmit} className="payment-form">
          <div className="form-sections">
            {/* Payment Details */}
            <div className="form-section">
              <h3 className="section-title">
                <CreditCard size={18} />
                Payment Details
              </h3>
              <div className="form-grid">
                <div className="form-group">
                  <label className="form-label">Tenant *</label>
                  <select
                    className={`form-select ${errors.tenantId ? 'error' : ''}`}
                    value={formData.tenantId}
                    onChange={(e) => handleInputChange('tenantId', e.target.value)}
                    disabled={isSubmitting}
                  >
                    <option value="">Select a tenant</option>
                    {tenants.map(tenant => (
                      <option key={tenant.id} value={tenant.id}>
                        {tenant.name} - {tenant.room}
                      </option>
                    ))}
                  </select>
                  {errors.tenantId && <span className="error-message">{errors.tenantId}</span>}
                </div>

                <div className="form-group">
                  <label className="form-label">Payment Amount *</label>
                  <div className="input-with-icon">
                    <DollarSign size={16} className="input-icon" />
                    <input
                      type="number"
                      className={`form-input ${errors.amount ? 'error' : ''}`}
                      value={formData.amount}
                      onChange={(e) => handleInputChange('amount', e.target.value)}
                      placeholder="0.00"
                      min="0"
                      step="0.01"
                      disabled={isSubmitting}
                    />
                  </div>
                  {errors.amount && <span className="error-message">{errors.amount}</span>}
                </div>

                <div className="form-group">
                  <label className="form-label">Payment Category</label>
                  <select
                    className="form-select"
                    value={formData.category}
                    onChange={(e) => handleInputChange('category', e.target.value)}
                    disabled={isSubmitting}
                  >
                    <option value="rent">Rent</option>
                    <option value="utilities">Utilities</option>
                    <option value="deposit">Deposit</option>
                    <option value="late_fee">Late Fee</option>
                    <option value="maintenance">Maintenance</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Payment Method</label>
                  <select
                    className={`form-select ${errors.paymentMethod ? 'error' : ''}`}
                    value={formData.paymentMethod}
                    onChange={(e) => handleInputChange('paymentMethod', e.target.value)}
                    disabled={isSubmitting}
                  >
                    <option value="cash">Cash</option>
                    <option value="bank_transfer">Bank Transfer</option>
                    <option value="check">Check</option>
                    <option value="credit_card">Credit Card</option>
                    <option value="debit_card">Debit Card</option>
                    <option value="mobile_payment">Mobile Payment</option>
                  </select>
                  {errors.paymentMethod && <span className="error-message">{errors.paymentMethod}</span>}
                </div>
              </div>
            </div>

            {/* Dates */}
            <div className="form-section">
              <h3 className="section-title">
                <Calendar size={18} />
                Important Dates
              </h3>
              <div className="form-grid">
                <div className="form-group">
                  <label className="form-label">Payment Date *</label>
                  <input
                    type="date"
                    className={`form-input ${errors.paymentDate ? 'error' : ''}`}
                    value={formData.paymentDate}
                    onChange={(e) => handleInputChange('paymentDate', e.target.value)}
                    disabled={isSubmitting}
                  />
                  {errors.paymentDate && <span className="error-message">{errors.paymentDate}</span>}
                </div>

                <div className="form-group">
                  <label className="form-label">Due Date *</label>
                  <input
                    type="date"
                    className={`form-input ${errors.dueDate ? 'error' : ''}`}
                    value={formData.dueDate}
                    onChange={(e) => handleInputChange('dueDate', e.target.value)}
                    disabled={isSubmitting}
                  />
                  {errors.dueDate && <span className="error-message">{errors.dueDate}</span>}
                </div>
              </div>
            </div>

            {/* Additional Information */}
            <div className="form-section">
              <h3 className="section-title">
                <FileText size={18} />
                Additional Information
              </h3>
              <div className="form-grid">
                <div className="form-group">
                  <label className="form-label">Reference Number</label>
                  <input
                    type="text"
                    className="form-input"
                    value={formData.reference}
                    onChange={(e) => handleInputChange('reference', e.target.value)}
                    placeholder="Transaction ID, Check #, etc."
                    disabled={isSubmitting}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Payment Status</label>
                  <select
                    className="form-select"
                    value={formData.status}
                    onChange={(e) => handleInputChange('status', e.target.value)}
                    disabled={isSubmitting}
                  >
                    <option value="paid">Paid</option>
                    <option value="pending">Pending</option>
                    <option value="partial">Partial</option>
                    <option value="overdue">Overdue</option>
                  </select>
                </div>
              </div>

              <div className="form-group full">
                <label className="form-label">Notes</label>
                <textarea
                  className="form-textarea"
                  value={formData.notes}
                  onChange={(e) => handleInputChange('notes', e.target.value)}
                  placeholder="Add any additional notes about this payment..."
                  rows={3}
                  disabled={isSubmitting}
                />
              </div>
            </div>

            {/* Tenant Information Display */}
            {getSelectedTenant() && (
              <div className="form-section tenant-info-display">
                <h3 className="section-title">
                  <User size={18} />
                  Tenant Information
                </h3>
                <div className="tenant-info-card">
                  <div className="tenant-info-item">
                    <span className="info-label">Name:</span>
                    <span className="info-value">{getSelectedTenant().name}</span>
                  </div>
                  <div className="tenant-info-item">
                    <span className="info-label">Room:</span>
                    <span className="info-value">{getSelectedTenant().room}</span>
                  </div>
                  <div className="tenant-info-item">
                    <span className="info-label">Monthly Rent:</span>
                    <span className="info-value">${getSelectedTenant().rentAmount}</span>
                  </div>
                  <div className="tenant-info-item">
                    <span className="info-label">Next Payment:</span>
                    <span className="info-value">{getSelectedTenant().nextPayment}</span>
                  </div>
                </div>
              </div>
            )}
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
                  {mode === 'add' ? 'Record Payment' : 'Save Changes'}
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PaymentModal;
