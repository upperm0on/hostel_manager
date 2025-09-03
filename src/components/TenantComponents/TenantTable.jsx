import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Eye, Edit, Users, Trash2 } from 'lucide-react';
import { ConfirmationModal } from '../Common';
import './TenantComponents.css';

const TenantTable = ({ tenants, onView, onEdit, onDelete }) => {
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, tenant: null });
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const getStatusClass = (status) => {
    switch (status) {
      case 'active':
        return 'status-active';
      case 'overdue':
        return 'status-overdue';
      case 'inactive':
        return 'status-inactive';
      default:
        return 'status-active';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'active':
        return <Users size={16} />;
      case 'overdue':
        return '⚠️';
      case 'inactive':
        return '❌';
      default:
        return <Users size={16} />;
    }
  };

  const handleDeleteClick = (tenant) => {
    setDeleteModal({ isOpen: true, tenant });
  };

  const handleDeleteConfirm = () => {
    if (deleteModal.tenant && onDelete) {
      onDelete(deleteModal.tenant);
    }
    setDeleteModal({ isOpen: false, tenant: null });
  };

  const handleDeleteCancel = () => {
    setDeleteModal({ isOpen: false, tenant: null });
  };

  // Pagination logic
  const totalPages = Math.ceil(tenants.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentTenants = tenants.slice(startIndex, endIndex);

  const goToPage = (page) => {
    setCurrentPage(page);
  };

  const goToNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const goToPrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  if (tenants.length === 0) {
    return (
      <div className="tenant-table-container">
        <div className="tenant-table-empty">
          <Users className="tenant-table-empty-icon" />
          <div className="tenant-table-empty-title">No tenants found</div>
          <div className="tenant-table-empty-description">
            There are no tenants to display at the moment.
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="tenant-table-container">
      <div className="tenant-table-header">
        <h2 className="tenant-table-title">Tenant List</h2>
        <div className="tenant-table-actions">
          {/* Additional actions could go here */}
        </div>
      </div>

      <table className="tenant-table">
        <thead>
          <tr>
            <th>Tenant</th>
            <th>Contact</th>
            <th>Room</th>
            <th>Check-in Date</th>
            <th>Status</th>
            <th>Rent Amount</th>
            <th>Next Payment</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {currentTenants.map((tenant) => (
            <tr key={tenant.id} className="tenant-row">
              <td>
                <div className="tenant-info">
                  <div className="tenant-avatar">
                    {tenant.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="tenant-details">
                    <div className="tenant-name">{tenant.name}</div>
                    <div className="tenant-id">ID: {tenant.id}</div>
                  </div>
                </div>
              </td>
              <td>
                <div className="tenant-contact">
                  <div className="contact-email">{tenant.email}</div>
                  <div className="contact-phone">{tenant.phone}</div>
                </div>
              </td>
              <td className="tenant-room">{tenant.room}</td>
              <td className="tenant-checkin">{tenant.checkInDate}</td>
              <td>
                <div className={`tenant-status ${getStatusClass(tenant.status)}`}>
                  {getStatusIcon(tenant.status)}
                  {tenant.status}
                </div>
              </td>
              <td className="tenant-rent">${tenant.rentAmount}</td>
              <td className="tenant-payment">{tenant.nextPayment}</td>
              <td>
                <div className="tenant-actions">
                  <Link
                    to={`/tenants/${tenant.id}`}
                    className="tenant-action-button view"
                    title="View tenant"
                  >
                    <Eye className="tenant-action-icon" />
                  </Link>
                  <button
                    className="tenant-action-button edit"
                    onClick={() => onEdit?.(tenant)}
                    title="Edit tenant"
                  >
                    <Edit className="tenant-action-icon" />
                  </button>
                  <button
                    className="tenant-action-button delete"
                    onClick={() => handleDeleteClick(tenant)}
                    title="Delete tenant"
                  >
                    <Trash2 className="tenant-action-icon" />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="tenant-table-pagination">
        <div className="tenant-table-pagination-info">
          Showing {startIndex + 1}-{Math.min(endIndex, tenants.length)} of {tenants.length} tenants
        </div>
        <div className="tenant-table-pagination-controls">
          <button 
            className="tenant-table-pagination-button" 
            onClick={goToPrevPage}
            disabled={currentPage === 1}
          >
            Previous
          </button>
          
          {/* Page numbers */}
          <div className="page-numbers">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
              <button
                key={page}
                className={`page-number ${page === currentPage ? 'active' : ''}`}
                onClick={() => goToPage(page)}
              >
                {page}
              </button>
            ))}
          </div>
          
          <button 
            className="tenant-table-pagination-button" 
            onClick={goToNextPage}
            disabled={currentPage === totalPages}
          >
            Next
          </button>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        isOpen={deleteModal.isOpen}
        onClose={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
        title="Delete Tenant"
        message={`Are you sure you want to delete ${deleteModal.tenant?.name}? This action cannot be undone.`}
        confirmText="Delete Tenant"
        cancelText="Cancel"
        type="danger"
      />
    </div>
  );
};

export default TenantTable;
