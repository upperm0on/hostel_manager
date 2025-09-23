import React from 'react';
import { AlertTriangle, X } from 'lucide-react';
import './ConfirmationModal.css';

const ConfirmationModal = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  title = 'Confirm Action',
  message = 'Are you sure you want to proceed?',
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  type = 'warning',
  isLoading = false,
  showCancel = true,
  showConfirm = true
}) => {
  if (!isOpen) return null;

  const handleConfirm = () => {
    onConfirm();
  };

  const handleClose = () => {
    if (!isLoading) {
      onClose();
    }
  };

  const getIcon = () => {
    switch (type) {
      case 'danger':
        return <AlertTriangle size={24} className="danger" />;
      case 'warning':
        return <AlertTriangle size={24} className="warning" />;
      case 'info':
        return <AlertTriangle size={24} className="info" />;
      default:
        return <AlertTriangle size={24} className="warning" />;
    }
  };

  const getTypeClass = () => {
    return `confirmation-modal ${type}`;
  };

  return (
    <div className="confirmation-modal-overlay">
      <div className={getTypeClass()}>
        {/* Modal Header */}
        <div className="modal-header">
          <div className="modal-title">
            {getIcon()}
            <span>{title}</span>
          </div>
          <button 
            className="modal-close" 
            onClick={handleClose}
            disabled={isLoading}
          >
            <X size={20} />
          </button>
        </div>

        {/* Modal Content */}
        <div className="modal-content">
          <p className="confirmation-message">{message}</p>
        </div>

        {/* Modal Actions */}
        <div className="modal-actions">
          {showCancel && (
            <button
              type="button"
              className="btn btn-outline"
              onClick={handleClose}
              disabled={isLoading}
            >
              {cancelText}
            </button>
          )}
          {showConfirm && (
            <button
              type="button"
              className={`btn btn-${type === 'danger' ? 'danger' : 'primary'}`}
              onClick={handleConfirm}
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <div className="spinner"></div>
                  Processing...
                </>
              ) : (
                confirmText
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;
