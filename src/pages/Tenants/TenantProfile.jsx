import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  User, 
  CreditCard, 
  Home, 
  ArrowLeft,
  Edit,
  Mail,
  Phone,
  Calendar,
  DollarSign
} from 'lucide-react';
import './TenantProfile.css';

const TenantProfile = () => {
  const { id } = useParams();

  // Mock tenant data - in a real app this would come from an API
  const tenant = {
    id: parseInt(id),
    name: 'John Doe',
    email: 'john.doe@email.com',
    phone: '+1 (555) 123-4567',
    room: '101',
    status: 'active',
    moveInDate: '2024-01-15',
    rentAmount: 800,
    emergencyContact: 'Jane Doe',
    emergencyPhone: '+1 (555) 987-6543',
    paymentHistory: [
      {
        id: 1,
        month: 'March 2024',
        amount: 800,
        status: 'paid',
        date: '2024-03-01'
      },
      {
        id: 2,
        month: 'February 2024',
        amount: 800,
        status: 'paid',
        date: '2024-02-01'
      },
      {
        id: 3,
        month: 'January 2024',
        amount: 800,
        status: 'paid',
        date: '2024-01-15'
      }
    ],
    hostelHistory: [
      {
        id: 1,
        hostelName: 'Sunset Hostel',
        room: '101',
        period: 'Jan 2024 - Present',
        status: 'Current'
      }
    ]
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

  return (
    <div className="tenant-profile">
      {/* Back Button */}
      <div className="profile-back">
        <Link to="/tenants" className="back-button">
          <ArrowLeft size={20} />
          Back to Tenants
        </Link>
      </div>

      {/* Profile Header */}
      <div className="profile-header">
        <div className="profile-header-avatar">
          {tenant.name.charAt(0).toUpperCase()}
        </div>
        <h1 className="profile-header-name">{tenant.name}</h1>
        <p className="profile-header-email">{tenant.email}</p>
        
        <div className="profile-header-details">
          <div className="profile-header-detail">
            <div className="profile-header-detail-label">Room</div>
            <div className="profile-header-detail-value">{tenant.room}</div>
          </div>
          <div className="profile-header-detail">
            <div className="profile-header-detail-label">Rent</div>
            <div className="profile-header-detail-value">${tenant.rentAmount}</div>
          </div>
          <div className="profile-header-detail">
            <div className="profile-header-detail-label">Move-in Date</div>
            <div className="profile-header-detail-value">{tenant.moveInDate}</div>
          </div>
          <div className="profile-header-detail">
            <div className="profile-header-detail-label">Status</div>
            <div className="profile-header-detail-value">
              <span className={`tenant-status ${tenant.status}`}>
                {tenant.status}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Contact Information */}
      <div className="profile-section">
        <div className="profile-section-header">
          <User className="profile-section-icon" />
          <h2 className="profile-section-title">Contact Information</h2>
        </div>
        
        <div className="contact-info-grid">
          <div className="contact-info-item">
            <Mail className="contact-info-icon" />
            <div className="contact-info-content">
              <div className="contact-info-label">Email</div>
              <div className="contact-info-value">{tenant.email}</div>
            </div>
          </div>
          
          <div className="contact-info-item">
            <Phone className="contact-info-icon" />
            <div className="contact-info-content">
              <div className="contact-info-label">Phone</div>
              <div className="contact-info-value">{tenant.phone}</div>
            </div>
          </div>
          
          <div className="contact-info-item">
            <User className="contact-info-icon" />
            <div className="contact-info-content">
              <div className="contact-info-label">Emergency Contact</div>
              <div className="contact-info-value">{tenant.emergencyContact}</div>
            </div>
          </div>
          
          <div className="contact-info-item">
            <Phone className="contact-info-icon" />
            <div className="contact-info-content">
              <div className="contact-info-label">Emergency Phone</div>
              <div className="contact-info-value">{tenant.emergencyPhone}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Payment History */}
      <div className="profile-section">
        <div className="profile-section-header">
          <CreditCard className="profile-section-icon" />
          <h2 className="profile-section-title">Payment History</h2>
        </div>
        
        <div className="profile-payments-list">
          {tenant.paymentHistory.map((payment) => (
            <div key={payment.id} className="profile-payment-item">
              <div className="profile-payment-info">
                <div className={`profile-payment-icon ${getStatusClass(payment.status)}`}>
                  <DollarSign size={20} />
                </div>
                <div className="profile-payment-details">
                  <div className="profile-payment-amount">${payment.amount}</div>
                  <div className="profile-payment-date">{payment.month}</div>
                </div>
              </div>
              <span className={`profile-payment-status ${getStatusClass(payment.status)}`}>
                {payment.status}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Hostel History */}
      <div className="profile-section">
        <div className="profile-section-header">
          <Home className="profile-section-icon" />
          <h2 className="profile-section-title">Hostel History</h2>
        </div>
        
        <div className="profile-hostel-history-list">
          {tenant.hostelHistory.map((history) => (
            <div key={history.id} className="profile-hostel-history-item">
              <div className="profile-hostel-history-icon">
                <Home size={20} />
              </div>
              <div className="profile-hostel-history-details">
                <div className="profile-hostel-history-name">{history.hostelName}</div>
                <div className="profile-hostel-history-location">Room {history.room}</div>
                <div className="profile-hostel-history-period">{history.period}</div>
              </div>
              <span className="profile-hostel-history-status">{history.status}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Profile Actions */}
      <div className="profile-actions">
        <button className="btn btn-outline">
          <Edit size={20} />
          Edit Profile
        </button>
        <button className="btn btn-primary">
          <CreditCard size={20} />
          Record Payment
        </button>
      </div>
    </div>
  );
};

export default TenantProfile;
