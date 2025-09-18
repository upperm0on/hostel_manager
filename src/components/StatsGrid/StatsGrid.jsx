import React from 'react';
import { Users, Home, DollarSign, AlertCircle, TrendingUp, TrendingDown } from 'lucide-react';
import StatCard from '../StatCard/StatCard';
import { useHostelStats } from '../../hooks/useHostelStats';
import './StatsGrid.css';

const StatsGrid = ({ variant = 'dashboard', hostelInfo }) => {
  const { stats, loading } = useHostelStats(hostelInfo);

  if (loading) {
    return (
      <div className="stats-grid">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="stat-card loading">
            <div className="loading-skeleton"></div>
          </div>
        ))}
      </div>
    );
  }

  // Calculate dynamic change values based on real data
  const getChangeValue = (current, previous, isPercentage = false) => {
    if (previous === 0) return '0%';
    const change = current - previous;
    const changePercent = Math.round((change / previous) * 100);
    const sign = change >= 0 ? '+' : '';
    return isPercentage ? `${sign}${changePercent}%` : `${sign}${change}`;
  };

  const getChangeType = (current, previous) => {
    return current >= previous ? 'positive' : 'negative';
  };

  const getTrendIcon = (current, previous) => {
    return current >= previous ? TrendingUp : TrendingDown;
  };

  // Simulate previous period data (in a real app, this would come from historical data)
  const previousStats = {
    totalTenants: Math.max(0, stats.totalTenants - Math.floor(Math.random() * 3)),
    occupiedRooms: Math.max(0, stats.occupiedRooms - Math.floor(Math.random() * 2)),
    monthlyRevenue: Math.round(stats.monthlyRevenue * (0.85 + Math.random() * 0.2)),
    availableRooms: Math.max(0, stats.availableRooms + Math.floor(Math.random() * 2)),
    occupancyRate: Math.max(0, stats.occupancyRate - Math.floor(Math.random() * 10)),
    newTenants: Math.max(0, stats.newTenants - Math.floor(Math.random() * 2))
  };

  const statCards = [
    {
      icon: Users,
      title: 'Total Tenants',
      value: stats.totalTenants,
      change: getChangeValue(stats.totalTenants, previousStats.totalTenants),
      changeType: getChangeType(stats.totalTenants, previousStats.totalTenants),
      variant: 'primary'
    },
    {
      icon: Home,
      title: variant === 'dashboard' ? 'Occupied Rooms' : 'Occupancy Rate',
      value: variant === 'dashboard' ? stats.occupiedRooms : `${stats.occupancyRate}%`,
      change: variant === 'dashboard' 
        ? getChangeValue(stats.occupiedRooms, previousStats.occupiedRooms)
        : getChangeValue(stats.occupancyRate, previousStats.occupancyRate, true),
      changeType: variant === 'dashboard' 
        ? getChangeType(stats.occupiedRooms, previousStats.occupiedRooms)
        : getChangeType(stats.occupancyRate, previousStats.occupancyRate),
      variant: 'secondary'
    },
    {
      icon: DollarSign,
      title: 'Monthly Revenue',
      value: `₵${stats.monthlyRevenue.toLocaleString()}`,
      change: getChangeValue(stats.monthlyRevenue, previousStats.monthlyRevenue, true),
      changeType: getChangeType(stats.monthlyRevenue, previousStats.monthlyRevenue),
      variant: 'warning'
    },
    {
      icon: AlertCircle,
      title: variant === 'dashboard' ? 'Available Rooms' : 'Pending Payments',
      value: variant === 'dashboard' ? stats.availableRooms : stats.pendingPayments,
      change: variant === 'dashboard' 
        ? getChangeValue(stats.availableRooms, previousStats.availableRooms)
        : getChangeValue(stats.pendingPayments, previousStats.availableRooms),
      changeType: variant === 'dashboard' 
        ? getChangeType(stats.availableRooms, previousStats.availableRooms)
        : 'negative', // Pending payments are always negative
      variant: 'error'
    }
  ];

  return (
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
  );
};

export default StatsGrid;
