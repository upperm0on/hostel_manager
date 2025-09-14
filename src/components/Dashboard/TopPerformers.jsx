import React, { useState, useEffect } from 'react';
import { Users, Calendar, ArrowRight } from 'lucide-react';
import { API_ENDPOINTS } from '../../config/api';
import './DashboardComponents.css';

const RecentTenants = () => {
  const [recentTenants, setRecentTenants] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch tenants data for recent tenants
  useEffect(() => {
    const fetchTenants = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('token');
        
        if (!token) {
          console.log('No authentication token found');
          return;
        }

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
          // Transform tenant data into recent tenants (sorted by date created)
          const recentTenantsList = data.tenants
            .sort((a, b) => new Date(b.date_created) - new Date(a.date_created)) // Sort by most recent
            .slice(0, 3) // Show only 3 most recent
            .map((tenant, index) => ({
              id: tenant.id,
              name: tenant.user?.username || 'Unknown',
              room: `${tenant.room_id} in room`,
              moveInDate: new Date(tenant.date_created).toLocaleDateString('en-US', { 
                month: 'short', 
                day: 'numeric' 
              }),
              rentAmount: `$${parseFloat(tenant.amount || 0).toLocaleString()}`
            }));
          
          setRecentTenants(recentTenantsList);
        }
        
      } catch (err) {
        console.error('Error fetching tenants for recent tenants:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchTenants();
  }, []);
  return (
    <div className="dashboard-section">
      <div className="section-header">
        <h3 className="section-title">Recent Tenants</h3>
        <button 
          className="section-action"
          onClick={() => window.location.href = '/tenants'}
        >
          View All
          <ArrowRight size={16} />
        </button>
      </div>
      
      <div className="performers-list">
        {recentTenants.map((tenant, index) => (
          <div key={tenant.id} className="performer-item">
            <div className="performer-rank">
              <Users size={16} className="rank-icon" />
              <span className="rank-number">{index + 1}</span>
            </div>
            <div className="performer-info">
              <div className="performer-name">{tenant.name}</div>
              <div className="performer-room">{tenant.room}</div>
            </div>
            <div className="performer-rating">
              <Calendar size={14} className="star-icon" />
              <span>{tenant.moveInDate}</span>
            </div>
            <div className="performer-payment">
              {tenant.rentAmount}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecentTenants;
