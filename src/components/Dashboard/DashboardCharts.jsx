import React, { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, Download } from 'lucide-react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  PointElement,
  LineElement,
  Filler,
} from 'chart.js';
import { Bar, Line } from 'react-chartjs-2';
import { API_ENDPOINTS } from '../../config/api';
import ConfirmationModal from '../Common/ConfirmationModal';
import './DashboardCharts.css';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  PointElement,
  LineElement,
  Filler
);

const DashboardCharts = ({ hostelInfo }) => {
  const [tenants, setTenants] = useState([]);
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [chartData, setChartData] = useState({
    occupancyData: [0, 0, 0, 0, 0, 0, 0],
    revenueData: [0, 0, 0, 0, 0, 0, 0],
    labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4', 'Week 5', 'Week 6', 'Week 7']
  });
  const [modalState, setModalState] = useState({
    isOpen: false,
    title: '',
    message: '',
    type: 'info',
    showCancel: false,
    showConfirm: true,
    confirmText: 'OK',
    onConfirm: null,
  });

  // Generate unique chart IDs to prevent canvas reuse issues
  const occupancyChartId = `occupancy-chart-${Date.now()}`;
  const revenueChartId = `revenue-chart-${Date.now()}`;

  // Cleanup effect to prevent memory leaks
  useEffect(() => {
    return () => {
      // Cleanup any existing charts when component unmounts
      ChartJS.getChart(occupancyChartId)?.destroy();
      ChartJS.getChart(revenueChartId)?.destroy();
    };
  }, [occupancyChartId, revenueChartId]);

  // Fetch tenants and payments data for charts
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('token');
        
        if (!token) {
          console.log('No authentication token found');
          return;
        }

        // Fetch tenants data
        const tenantsResponse = await fetch(API_ENDPOINTS.TENANTS_LIST, {
          method: 'GET',
          headers: {
            'Authorization': `Token ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (tenantsResponse.ok) {
          const tenantsData = await tenantsResponse.json();
          if (tenantsData.status === 'success' && tenantsData.tenants) {
            // Transform API data to match frontend expected format
            const transformedTenants = tenantsData.tenants.map((tenant) => ({
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
        }

        // Fetch payments data
        const paymentsResponse = await fetch(API_ENDPOINTS.PAYMENTS_LIST, {
          method: 'GET',
          headers: {
            'Authorization': `Token ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (paymentsResponse.ok) {
          const paymentsData = await paymentsResponse.json();
          if (paymentsData.status === 'success' && paymentsData.payments) {
            setPayments(paymentsData.payments);
          }
        }
        
      } catch (err) {
        console.error('Error fetching data for charts:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Calculate chart data when data changes
  useEffect(() => {
    if (hostelInfo && (tenants.length >= 0 || payments.length >= 0)) {
      // Calculate real metrics from hostel data
      const roomDetails = hostelInfo.room_details || [];
      const totalCapacity = roomDetails.reduce((sum, room) => sum + (parseInt(room.number_of_rooms) * parseInt(room.number_in_room) || 0), 0);
      
      // Calculate current occupancy based on unique room_uuid values
      const currentTenants = tenants.length;
      
      
      const occupiedRooms = new Set(tenants.map(tenant => {
        return tenant.roomUuid || tenant.room_uuid || tenant.originalData?.room_uuid;
      }).filter(Boolean)).size;
      const currentOccupancy = totalCapacity > 0 ? Math.round((occupiedRooms / totalCapacity) * 100) : 0;
      
      // Calculate real revenue from payments data, or use tenant data as fallback
      let currentRevenue = 0;
      
      if (payments.length > 0) {
        currentRevenue = payments.reduce((sum, payment) => {
          return sum + parseFloat(payment.amount || 0);
        }, 0);
      } else {
        // Fallback to tenant data
        currentRevenue = tenants.reduce((sum, tenant) => {
          const amount = tenant.rentAmount || tenant.amount || tenant.originalData?.amount || 0;
          return sum + parseFloat(amount);
        }, 0);
      }
      
      // Generate weekly trend data based on real data
      const occupancyData = [];
      const revenueData = [];
      const labels = [];
      
      // Create weekly labels for the last 7 weeks with actual dates
      const today = new Date();
      for (let i = 6; i >= 0; i--) {
        const weekDate = new Date(today);
        weekDate.setDate(today.getDate() - (i * 7));
        const weekStart = new Date(weekDate);
        weekStart.setDate(weekDate.getDate() - 6);
        
        const formatDate = (date) => {
          return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        };
        
        labels.push(`${formatDate(weekStart)} - ${formatDate(weekDate)}`);
      }
      
      // Calculate weekly occupancy based on tenant creation dates
      for (let i = 6; i >= 0; i--) {
        const weekStart = new Date(today);
        weekStart.setDate(today.getDate() - ((i + 1) * 7));
        const weekEnd = new Date(today);
        weekEnd.setDate(today.getDate() - (i * 7));
        
        // Count unique rooms occupied by tenants who moved in before or during this week
        const tenantsInWeek = tenants.filter(tenant => {
          const checkInDate = tenant.checkInDate || tenant.date_created || tenant.originalData?.date_created;
          if (!checkInDate) return false;
          const moveInDate = new Date(checkInDate);
          return moveInDate <= weekEnd;
        });
        
        const occupiedRoomsInWeek = new Set(tenantsInWeek.map(tenant => {
          return tenant.roomUuid || tenant.room_uuid || tenant.originalData?.room_uuid;
        }).filter(Boolean)).size;
        const weeklyOccupancy = totalCapacity > 0 ? Math.round((occupiedRoomsInWeek / totalCapacity) * 100) : 0;
        occupancyData.push(weeklyOccupancy);
      }
      
      // Calculate weekly revenue based on payment dates
      for (let i = 6; i >= 0; i--) {
        const weekStart = new Date(today);
        weekStart.setDate(today.getDate() - ((i + 1) * 7));
        const weekEnd = new Date(today);
        weekEnd.setDate(today.getDate() - (i * 7));
        
        // Sum payments made during this week, or use tenant data as fallback
        let weeklyRevenue = 0;
        
        if (payments.length > 0) {
          // Use payments data if available
          weeklyRevenue = payments.reduce((sum, payment) => {
            if (!payment.date_created) return sum;
            const paymentDate = new Date(payment.date_created);
            if (paymentDate >= weekStart && paymentDate <= weekEnd) {
              return sum + parseFloat(payment.amount || 0);
            }
            return sum;
          }, 0);
        } else {
          // Fallback to tenant data - estimate revenue based on tenants who moved in during this week
          const tenantsInWeek = tenants.filter(tenant => {
            const checkInDate = tenant.checkInDate || tenant.date_created || tenant.originalData?.date_created;
            if (!checkInDate) return false;
            const moveInDate = new Date(checkInDate);
            return moveInDate >= weekStart && moveInDate <= weekEnd;
          });
          
          weeklyRevenue = tenantsInWeek.reduce((sum, tenant) => {
            const amount = tenant.rentAmount || tenant.amount || tenant.originalData?.amount || 0;
            return sum + parseFloat(amount);
          }, 0);
        }
        
        revenueData.push(Math.round(weeklyRevenue));
      }
      
      console.log('DashboardCharts - Calculated data:', {
        tenants: tenants.length,
        payments: payments.length,
        totalCapacity,
        occupiedRooms,
        currentOccupancy,
        currentRevenue,
        occupancyData,
        revenueData,
        labels
      });

      setChartData({
        occupancyData,
        revenueData,
        labels
      });
    }
  }, [hostelInfo, tenants, payments]);

  const { occupancyData, revenueData, labels } = chartData;

  // Chart configuration
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: 'white',
        bodyColor: 'white',
        borderColor: 'rgba(255, 255, 255, 0.1)',
        borderWidth: 1,
      },
    },
    scales: {
      y: {
        type: 'linear',
        beginAtZero: true,
        grid: {
          color: 'rgba(0, 0, 0, 0.1)',
        },
        ticks: {
          color: '#666',
        },
      },
      x: {
        type: 'category',
        grid: {
          display: false,
        },
        ticks: {
          color: '#666',
        },
      },
    },
    interaction: {
      intersect: false,
      mode: 'index',
    },
  };

  // Occupancy chart data with safety checks
  const occupancyChartData = {
    labels: labels || [],
    datasets: [
      {
        label: 'Occupancy Rate (%)',
        data: occupancyData || [],
        backgroundColor: (occupancyData || []).map(value => {
          const numValue = Number(value) || 0;
          if (numValue >= 90) return 'rgba(34, 197, 94, 0.8)'; // Green
          if (numValue >= 80) return 'rgba(59, 130, 246, 0.8)'; // Blue
          return 'rgba(245, 158, 11, 0.8)'; // Orange
        }),
        borderColor: (occupancyData || []).map(value => {
          const numValue = Number(value) || 0;
          if (numValue >= 90) return 'rgba(34, 197, 94, 1)';
          if (numValue >= 80) return 'rgba(59, 130, 246, 1)';
          return 'rgba(245, 158, 11, 1)';
        }),
        borderWidth: 2,
        borderRadius: 4,
        borderSkipped: false,
      },
    ],
  };

  // Revenue chart data with safety checks
  const revenueChartData = {
    labels: labels || [],
    datasets: [
      {
        label: 'Revenue (₵)',
        data: revenueData || [],
        backgroundColor: 'rgba(34, 197, 94, 0.1)',
        borderColor: 'rgba(34, 197, 94, 1)',
        borderWidth: 3,
        fill: true,
        tension: 0.4,
        pointBackgroundColor: 'rgba(34, 197, 94, 1)',
        pointBorderColor: 'white',
        pointBorderWidth: 2,
        pointRadius: 6,
        pointHoverRadius: 8,
      },
    ],
  };

  if (loading) {
    return (
      <div className="dashboard-charts">
        <div className="charts-header">
          <div className="charts-title">
            <h3>Performance Trends</h3>
            <p>Loading chart data...</p>
          </div>
        </div>
        <div className="loading-container">
          <div className="loading-spinner">Loading performance data...</div>
        </div>
      </div>
    );
  }

  // Don't render charts if we don't have valid data
  if (!occupancyData || !revenueData || occupancyData.length === 0 || revenueData.length === 0) {
    return (
      <div className="dashboard-charts">
        <div className="charts-header">
          <div className="charts-title">
            <h3>Performance Trends</h3>
            <p>No historical data available yet</p>
          </div>
        </div>
        <div className="loading-container">
          <div className="loading-spinner">
            {tenants.length === 0 && payments.length === 0 
              ? "Waiting for tenant and payment data..." 
              : "Calculating trends from available data..."
            }
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-charts">
      <ConfirmationModal
        isOpen={modalState.isOpen}
        onClose={() => setModalState((s) => ({ ...s, isOpen: false }))}
        onConfirm={() => {
          if (typeof modalState.onConfirm === 'function') {
            const cb = modalState.onConfirm;
            setModalState((s) => ({ ...s, isOpen: false }));
            cb();
          } else {
            setModalState((s) => ({ ...s, isOpen: false }));
          }
        }}
        title={modalState.title}
        message={modalState.message}
        type={modalState.type}
        isLoading={false}
        showCancel={modalState.showCancel}
        showConfirm={modalState.showConfirm}
        confirmText={modalState.confirmText}
      />
      <div className="charts-header">
        <div className="charts-title">
          <h3>Performance Trends</h3>
          <p>Last 7 weeks overview</p>
        </div>
        <button 
          className="btn btn-outline btn-sm"
          onClick={() => {
            try {
              const exportData = {
                type: 'performance-trends',
                timestamp: new Date().toISOString(),
                period: '7 weeks',
                occupancy: {
                  data: occupancyData,
                  labels: labels,
                  average: Math.round(occupancyData.reduce((a, b) => a + b, 0) / occupancyData.length)
                },
                revenue: {
                  data: revenueData,
                  labels: labels,
                  average: Math.round(revenueData.reduce((a, b) => a + b, 0) / revenueData.length)
                }
              };
              
              const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
              const url = URL.createObjectURL(blob);
              const a = document.createElement('a');
              a.href = url;
              a.download = `performance-trends-${new Date().toISOString().slice(0, 10)}.json`;
              a.click();
              URL.revokeObjectURL(url);
              
              console.log('Performance trends exported successfully');
            } catch (error) {
              console.error('Error exporting trends:', error);
              setModalState({
                isOpen: true,
                title: 'Export Failed',
                message: 'Failed to export trends. Please try again.',
                type: 'danger',
                showCancel: false,
                showConfirm: true,
                confirmText: 'OK',
                onConfirm: () => setModalState((s) => ({ ...s, isOpen: false })),
              });
            }
          }}
        >
          <Download size={16} />
          Export Data
        </button>
      </div>

      <div className="charts-grid">
        {/* Occupancy Chart */}
        <div className="chart-card">
          <div className="chart-header">
            <h4>Occupancy Rate Trend</h4>
            <div className="chart-trend">
              <TrendingUp size={16} />
              <span className="trend-value positive">+{occupancyData[occupancyData.length - 1] - occupancyData[0]}%</span>
            </div>
            <button 
              className="chart-details-btn"
              onClick={() => {
                const details = occupancyData.map((value, index) => 
                  `${labels[index]}: ${value}%`
                ).join('\n');
                setModalState({
                  isOpen: true,
                  title: 'Occupancy Rate Details',
                  message: `${details}\n\nAverage: ${Math.round(occupancyData.reduce((a, b) => a + b, 0) / occupancyData.length)}%`,
                  type: 'info',
                  showCancel: false,
                  showConfirm: true,
                  confirmText: 'Close',
                  onConfirm: () => setModalState((s) => ({ ...s, isOpen: false })),
                });
              }}
              title="View Details"
            >
              ℹ️
            </button>
          </div>
          <div className="chart-content">
            <div className="chart-container">
              <Bar 
                key={occupancyChartId}
                data={occupancyChartData} 
                options={chartOptions} 
              />
            </div>
          </div>
        </div>

        {/* Revenue Chart */}
        <div className="chart-card">
          <div className="chart-header">
            <h4>Revenue Trend</h4>
            <div className="chart-trend">
              <TrendingUp size={16} />
              <span className="trend-value positive">
                +₵{((revenueData[revenueData.length - 1] - revenueData[0]) / 1000).toFixed(1)}k
              </span>
            </div>
            <button 
              className="chart-details-btn"
              onClick={() => {
                const details = (revenueData || []).map((value, index) =>
                  `${labels[index]}: ₵${(Number(value || 0) / 1000).toFixed(1)}k`
                ).join('\n');
                setModalState({
                  isOpen: true,
                  title: 'Revenue Details',
                  message: `${details}\n\nTotal Growth: ₵${((revenueData[revenueData.length - 1] - revenueData[0]) / 1000).toFixed(1)}k`,
                  type: 'info',
                  showCancel: false,
                  showConfirm: true,
                  confirmText: 'Close',
                  onConfirm: () => setModalState((s) => ({ ...s, isOpen: false })),
                });
              }}
              title="View Details"
            >
              ℹ️
            </button>
          </div>
          <div className="chart-content">
            <div className="chart-container">
              <Line 
                key={revenueChartId}
                data={revenueChartData} 
                options={chartOptions} 
              />
            </div>
          </div>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="charts-summary">
        <div className="summary-item">
          <div className="summary-label">Average Occupancy</div>
          <div className="summary-value">
            {Math.round(occupancyData.reduce((a, b) => a + b, 0) / occupancyData.length)}%
          </div>
        </div>
        <div className="summary-item">
          <div className="summary-label">Average Revenue (Yearly)</div>
          <div className="summary-value">
            ₵{Math.round(revenueData.reduce((a, b) => a + b, 0) / revenueData.length).toLocaleString()}
          </div>
        </div>
        <div className="summary-item">
          <div className="summary-label">Growth Rate</div>
          <div className="summary-value positive">
            +{Math.round(((occupancyData[occupancyData.length - 1] - occupancyData[0]) / occupancyData[0]) * 100)}%
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardCharts;
