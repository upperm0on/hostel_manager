import React from 'react';
import { Link } from 'react-router-dom';
import { Eye, Edit, Users } from 'lucide-react';
import './TenantComponents.css';

const TenantTable = ({ tenants, onView, onEdit }) => {
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
          {tenants.map((tenant) => (
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
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="tenant-table-pagination">
        <div className="tenant-table-pagination-info">
          Showing {tenants.length} of {tenants.length} tenants
        </div>
        <div className="tenant-table-pagination-controls">
          <button className="tenant-table-pagination-button" disabled>
            Previous
          </button>
          <button className="tenant-table-pagination-button" disabled>
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default TenantTable;
