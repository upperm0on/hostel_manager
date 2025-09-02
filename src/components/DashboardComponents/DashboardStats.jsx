import React from 'react';
import { Users, Home, DollarSign, AlertCircle } from 'lucide-react';
import StatCard from '../StatCard/StatCard';
import './DashboardComponents.css';

const DashboardStats = ({ stats }) => {
  const statCards = [
    {
      icon: Users,
      title: 'Total Tenants',
      value: stats.totalTenants,
      change: '+5%',
      changeType: 'positive'
    },
    {
      icon: Home,
      title: 'Occupancy Rate',
      value: `${stats.occupancyRate}%`,
      change: '+2%',
      changeType: 'positive'
    },
    {
      icon: DollarSign,
      title: 'Monthly Revenue',
      value: `$${stats.monthlyRevenue.toLocaleString()}`,
      change: '+12%',
      changeType: 'positive'
    },
    {
      icon: AlertCircle,
      title: 'Pending Payments',
      value: stats.pendingPayments,
      change: '-3',
      changeType: 'negative'
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
          />
        ))}
      </div>
    </div>
  );
};

export default DashboardStats;
