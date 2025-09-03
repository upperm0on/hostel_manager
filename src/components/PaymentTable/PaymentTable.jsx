import React from 'react';
import { Eye, Edit, CheckCircle, XCircle, Clock } from 'lucide-react';
import './PaymentTable.css';

const PaymentTable = ({ payments = [], onView, onEdit }) => {
  const [currentPage, setCurrentPage] = React.useState(1);
  const [itemsPerPage] = React.useState(10);
  const getStatusIcon = (status) => {
    switch (status) {
      case 'paid':
        return <CheckCircle size={12} />;
      case 'overdue':
        return <XCircle size={12} />;
      case 'pending':
        return <Clock size={12} />;
      default:
        return <Clock size={12} />;
    }
  };

  const getStatusClass = (status) => {
    switch (status) {
      case 'paid':
        return 'paid';
      case 'overdue':
        return 'overdue';
      case 'pending':
        return 'pending';
      default:
        return 'pending';
    }
  };

  // Pagination logic
  const totalPages = Math.ceil(payments.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentPayments = payments.slice(startIndex, endIndex);

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

  if (payments.length === 0) {
    return (
      <div className="payment-table-container">
        <div className="payment-table-empty">
          <Clock className="payment-table-empty-icon" />
          <div className="payment-table-empty-title">No payments found</div>
          <div className="payment-table-empty-description">
            There are no payments to display at the moment.
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="payment-table-container">
      <div className="payment-table-header">
        <h2 className="payment-table-title">Payment Records</h2>
        <div className="payment-table-actions">
          {/* Add payment button could go here */}
        </div>
      </div>

      <table className="payment-table">
        <thead>
          <tr>
            <th>Tenant</th>
            <th>Room</th>
            <th>Amount</th>
            <th>Due Date</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {currentPayments.map((payment) => (
            <tr key={payment.id} className="payment-row">
              <td>
                <div className="payment-tenant">
                  <div className="payment-tenant-avatar">
                    {payment.tenant && typeof payment.tenant === 'string' 
                      ? payment.tenant.charAt(0).toUpperCase()
                      : '?'}
                  </div>
                  <div className="payment-tenant-info">
                    <div className="payment-tenant-name">
                      {payment.tenant || 'Unknown Tenant'}
                    </div>
                    <div className="payment-tenant-room">
                      {payment.room || 'No Room'}
                    </div>
                  </div>
                </div>
              </td>
              <td>{payment.room || 'N/A'}</td>
              <td>
                <span className="payment-amount">${payment.amount || 0}</span>
                <span className="payment-currency">USD</span>
              </td>
              <td className="payment-date">
                {payment.dueDate ? new Date(payment.dueDate).toLocaleDateString() : 'N/A'}
              </td>
              <td>
                <div className={`payment-status ${getStatusClass(payment.status)}`}>
                  {getStatusIcon(payment.status)}
                  {payment.status || 'unknown'}
                </div>
              </td>
              <td>
                <div className="payment-actions">
                  <button
                    className="payment-action-button view"
                    onClick={() => onView?.(payment)}
                    title="View payment"
                  >
                    <Eye className="payment-action-icon" />
                  </button>
                  <button
                    className="payment-action-button edit"
                    onClick={() => onEdit?.(payment)}
                    title="Edit payment"
                  >
                    <Edit className="payment-action-icon" />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="payment-table-pagination">
        <div className="payment-table-pagination-info">
          Showing {startIndex + 1}-{Math.min(endIndex, payments.length)} of {payments.length} payments
        </div>
        <div className="payment-table-pagination-controls">
          <button 
            className="payment-table-pagination-button" 
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
            className="payment-table-pagination-button" 
            onClick={goToNextPage}
            disabled={currentPage === totalPages}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentTable;
