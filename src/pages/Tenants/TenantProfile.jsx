import React, { useState, useEffect } from 'react';
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
import { API_ENDPOINTS } from '../../config/api';
import './TenantProfile.css';

const TenantProfile = () => {
  const { id } = useParams();
  const [tenant, setTenant] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch tenant data from API
  useEffect(() => {
    const fetchTenant = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('token');
        
        if (!token) {
          setError('No authentication token found');
          return;
        }

        // First, get all tenants to find the specific one
        const response = await fetch(API_ENDPOINTS.TENANTS_LIST, {
          method: 'GET',
          headers: {
            'Authorization': `Token ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error(`Failed to fetch tenants: ${response.status}`);
        }

        const data = await response.json();
        
        if (data.status === 'success' && data.tenants) {
          // Find the specific tenant by ID
          const foundTenant = data.tenants.find(t => t.id === parseInt(id));
          
          if (foundTenant) {
            // Transform the API data to match the component's expected format
            const transformedTenant = {
              id: foundTenant.id,
              name: foundTenant.user?.username || 'Unknown',
              email: foundTenant.user?.email || 'No email',
              phone: foundTenant.user?.phone || 'No phone',
              room: `${foundTenant.room_id} in room`,
              status: 'active', // Default status
              moveInDate: foundTenant.date_created ? new Date(foundTenant.date_created).toISOString().split('T')[0] : 'Unknown',
              rentAmount: foundTenant.amount || 0,
              emergencyContact: 'Not provided', // API doesn't provide this
              emergencyPhone: 'Not provided', // API doesn't provide this
              paymentHistory: [
                // For now, show the single payment from the API
                {
                  id: foundTenant.id,
                  month: foundTenant.date_created ? new Date(foundTenant.date_created).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) : 'Unknown',
                  amount: foundTenant.amount || 0,
                  status: 'paid',
                  date: foundTenant.date_created ? new Date(foundTenant.date_created).toISOString().split('T')[0] : 'Unknown'
                }
              ],
              hostelHistory: [
                {
                  id: foundTenant.id,
                  hostelName: 'Current Hostel', // You might want to get this from hostel context
                  room: `${foundTenant.room_id} in room`,
                  period: foundTenant.date_created ? `${new Date(foundTenant.date_created).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })} - Present` : 'Unknown - Present',
                  status: 'Current'
                }
              ],
              // Keep original API data for reference
              originalData: foundTenant
            };
            
            setTenant(transformedTenant);
          } else {
            setError('Tenant not found');
          }
        } else {
          setError('Failed to load tenant data');
        }
        
      } catch (err) {
        console.error('Error fetching tenant:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchTenant();
    }
  }, [id]);

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

  // Loading state
  if (loading) {
    return (
      <div className="tenant-profile">
        <div className="profile-back">
          <Link to="/tenants" className="back-button">
            <ArrowLeft size={20} />
            Back to Tenants
          </Link>
        </div>
        <div className="loading-container">
          <div className="loading-spinner">Loading tenant profile...</div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="tenant-profile">
        <div className="profile-back">
          <Link to="/tenants" className="back-button">
            <ArrowLeft size={20} />
            Back to Tenants
          </Link>
        </div>
        <div className="error-container">
          <div className="error-message">
            <h2>Error Loading Tenant</h2>
            <p>{error}</p>
            <button 
              className="btn btn-primary"
              onClick={() => window.location.reload()}
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  // No tenant found
  if (!tenant) {
    return (
      <div className="tenant-profile">
        <div className="profile-back">
          <Link to="/tenants" className="back-button">
            <ArrowLeft size={20} />
            Back to Tenants
          </Link>
        </div>
        <div className="error-container">
          <div className="error-message">
            <h2>Tenant Not Found</h2>
            <p>The tenant you're looking for doesn't exist or has been removed.</p>
            <Link to="/tenants" className="btn btn-primary">
              Back to Tenants
            </Link>
          </div>
        </div>
      </div>
    );
  }

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
        <Link 
          to={`/tenants`} 
          state={{ editTenant: tenant }}
          className="btn btn-outline"
        >
          <Edit size={20} />
          Edit Profile
        </Link>
        <Link 
          to="/payments" 
          state={{ recordPaymentFor: tenant }}
          className="btn btn-primary"
        >
          <CreditCard size={20} />
          Record Payment
        </Link>
      </div>
    </div>
  );
};

export default TenantProfile;
