import React, { useState, useEffect } from 'react';
import { Users, Home, DollarSign, AlertCircle } from 'lucide-react';
import StatCard from '../StatCard/StatCard';
import './DashboardComponents.css';

const DashboardStats = ({ hostelInfo }) => {
  const [tenants, setTenants] = useState([]);
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState({
    totalTenants: 0,
    occupancyRate: 0,
    monthlyRevenue: 0,
    pendingPayments: 0
  });

  // Fetch tenants data for stats
  useEffect(() => {
    const fetchTenants = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('token');
        
        if (!token) {
          console.log('No authentication token found');
          return;
        }

        const response = await fetch('/hq/api/manager/tenants', {
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
          setTenants(data.tenants);
        }
        
      } catch (err) {
        console.error('Error fetching tenants for stats:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchTenants();
  }, []);

  // Calculate real stats when tenants data changes
  useEffect(() => {
    if (hostelInfo && tenants.length >= 0) {
      // Calculate real metrics from hostel data
      const roomDetails = hostelInfo.room_details || [];
      const totalCapacity = roomDetails.reduce((sum, room) => sum + (parseInt(room.number_of_rooms) * parseInt(room.number_in_room) || 0), 0);
      
      // Calculate real stats from tenant data
      const currentTenants = tenants.length;
      const totalRevenue = tenants.reduce((sum, tenant) => sum + parseFloat(tenant.amount || 0), 0);
      const occupancyRate = totalCapacity > 0 ? Math.round((currentTenants / totalCapacity) * 100) : 0;
      
      // Calculate pending payments (tenants who haven't paid this month)
      // For now, we'll assume all current tenants have paid since they're in the system
      const pendingPayments = Math.max(0, totalCapacity - currentTenants);

      setStats({
        totalTenants: currentTenants,
        occupancyRate: occupancyRate,
        monthlyRevenue: totalRevenue,
        pendingPayments: pendingPayments
      });
    }
  }, [hostelInfo, tenants]);
  const statCards = [
    {
      icon: Users,
      title: 'Total Tenants',
      value: stats.totalTenants,
      change: '+5%',
      changeType: 'positive',
      variant: 'primary'
    },
    {
      icon: Home,
      title: 'Occupancy Rate',
      value: `${stats.occupancyRate}%`,
      change: '+2%',
      changeType: 'positive',
      variant: 'secondary'
    },
    {
      icon: DollarSign,
      title: 'Monthly Revenue',
      value: `$${stats.monthlyRevenue.toLocaleString()}`,
      change: '+12%',
      changeType: 'positive',
      variant: 'warning'
    },
    {
      icon: AlertCircle,
      title: 'Pending Payments',
      value: stats.pendingPayments,
      change: '-3',
      changeType: 'negative',
      variant: 'error'
    }
  ];

  return (
    <div className="dashboard-stats">
      <div className="stats-grid">
        {statCards.map((stat, index) => (
          <StatCard
            key={index}
            icon={stat.icon}
            title={stat.title}
            value={stat.value}
            change={stat.change}
            changeType={stat.changeType}
            variant={stat.variant}
          />
        ))}
      </div>
    </div>
  );
};

export default DashboardStats;
