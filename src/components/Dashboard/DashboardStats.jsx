import React, { useState, useEffect } from 'react';
import { Users, Home, DollarSign, AlertCircle } from 'lucide-react';
import { API_ENDPOINTS } from '../../config/api';
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
          // Transform API data to match frontend expected format
          const transformedTenants = data.tenants.map((tenant) => ({
            id: tenant.id,
            name: tenant.user?.username || "Unknown",
            email: tenant.user?.email || "No email",
            phone: tenant.user?.phone || "No phone",
            room: tenant.room_uuid || "No room assigned",
            roomUuid: tenant.room_uuid,
            checkInDate: tenant.date_created
              ? new Date(tenant.date_created).toISOString().split("T")[0]
              : "Unknown",
            status: tenant.is_active ? "active" : "inactive",
            rentAmount: tenant.amount || 0,
            reference: tenant.reference,
            hostel: tenant.hostel,
            // Keep original API data for reference
            originalData: tenant,
          }));
          setTenants(transformedTenants);
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
      
      // Use the correct property names - try both transformed and original data
      const totalRevenue = tenants.reduce((sum, tenant) => {
        const amount = tenant.rentAmount || tenant.amount || tenant.originalData?.amount || 0;
        return sum + parseFloat(amount);
      }, 0);
      
      // Calculate occupied rooms based on unique room_uuid values
      const occupiedRooms = new Set(tenants.map(tenant => {
        return tenant.roomUuid || tenant.room_uuid || tenant.originalData?.room_uuid;
      }).filter(Boolean)).size;
      
      const availableRooms = Math.max(0, totalCapacity - occupiedRooms);
      const occupancyRate = totalCapacity > 0 ? Math.round((occupiedRooms / totalCapacity) * 100) : 0;
      
      // Calculate pending payments (available rooms that could generate revenue)
      const pendingPayments = availableRooms;
      

      setStats({
        totalTenants: currentTenants,
        occupiedRooms: occupiedRooms,
        availableRooms: availableRooms,
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
      title: 'Occupied Rooms',
      value: stats.occupiedRooms,
      change: '+2',
      changeType: 'positive',
      variant: 'secondary'
    },
    {
      icon: DollarSign,
      title: 'Yearly Revenue',
      value: `₵${stats.monthlyRevenue.toLocaleString()}`,
      change: '+12%',
      changeType: 'positive',
      variant: 'warning'
    },
    {
      icon: AlertCircle,
      title: 'Available Rooms',
      value: stats.availableRooms,
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
