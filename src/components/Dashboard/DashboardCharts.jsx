import React from 'react';
import { TrendingUp, TrendingDown, Download } from 'lucide-react';
import './DashboardCharts.css';

const DashboardCharts = () => {
  // Mock data for charts
  const occupancyData = [82, 85, 87, 89, 87, 90, 92];
  const revenueData = [42000, 43500, 45600, 47800, 45600, 49000, 52000];
  const labels = ['Week 1', 'Week 2', 'Week 3', 'Week 4', 'Week 5', 'Week 6', 'Week 7'];

  const maxOccupancy = Math.max(...occupancyData);
  const maxRevenue = Math.max(...revenueData);

  const getBarHeight = (value, maxValue) => {
    return (value / maxValue) * 100;
  };

  const getBarColor = (value, maxValue, isRevenue = false) => {
    const percentage = (value / maxValue) * 100;
    if (isRevenue) {
      if (percentage >= 90) return 'var(--success)';
      if (percentage >= 70) return 'var(--warning)';
      return 'var(--primary)';
    } else {
      if (percentage >= 90) return 'var(--success)';
      if (percentage >= 80) return 'var(--primary)';
      return 'var(--warning)';
    }
  };

  return (
    <div className="dashboard-charts">
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
              alert('Failed to export trends. Please try again.');
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
                alert(`Occupancy Rate Details:\n\n${details}\n\nAverage: ${Math.round(occupancyData.reduce((a, b) => a + b, 0) / occupancyData.length)}%`);
              }}
              title="View Details"
            >
              ℹ️
            </button>
          </div>
          <div className="chart-content">
            <div className="chart-bars">
              {occupancyData.map((value, index) => (
                <div key={index} className="chart-bar-group">
                  <div className="chart-bar">
                    <div 
                      className="bar-fill"
                      style={{
                        height: `${getBarHeight(value, maxOccupancy)}%`,
                        backgroundColor: getBarColor(value, maxOccupancy)
                      }}
                      onClick={() => {
                        alert(`Week ${index + 1} Details:\n\nOccupancy Rate: ${value}%\nStatus: ${value >= 90 ? 'Excellent' : value >= 80 ? 'Good' : 'Needs Attention'}\nTrend: ${index > 0 ? (value > occupancyData[index - 1] ? '↗️ Up' : value < occupancyData[index - 1] ? '↘️ Down' : '→ Stable') : 'First Week'}`);
                      }}
                      title={`Click for Week ${index + 1} details`}
                    ></div>
                  </div>
                  <div className="bar-label">{labels[index]}</div>
                  <div className="bar-value">{value}%</div>
                </div>
              ))}
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
                +${((revenueData[revenueData.length - 1] - revenueData[0]) / 1000).toFixed(1)}k
              </span>
            </div>
            <button 
              className="chart-details-btn"
              onClick={() => {
                const details = revenueData.map((value, index) => 
                  `${labels[index]}: $${(value / 1000).toFixed(1)}k`
                ).join('\n');
                alert(`Revenue Details:\n\n${details}\n\nTotal Growth: $${((revenueData[revenueData.length - 1] - revenueData[0]) / 1000).toFixed(1)}k`);
              }}
              title="View Details"
            >
              ℹ️
            </button>
          </div>
          <div className="chart-content">
            <div className="chart-bars">
              {revenueData.map((value, index) => (
                <div key={index} className="chart-bar-group">
                  <div className="chart-bar">
                    <div 
                      className="bar-fill"
                      style={{
                        height: `${getBarHeight(value, maxRevenue)}%`,
                        backgroundColor: getBarColor(value, maxRevenue, true)
                      }}
                      onClick={() => {
                        alert(`Week ${index + 1} Details:\n\nRevenue: $${value.toLocaleString()}\nStatus: ${value >= 50000 ? 'Excellent' : value >= 40000 ? 'Good' : 'Needs Attention'}\nTrend: ${index > 0 ? (value > revenueData[index - 1] ? '↗️ Up' : value < revenueData[index - 1] ? '↘️ Down' : '→ Stable') : 'First Week'}`);
                      }}
                      title={`Click for Week ${index + 1} details`}
                    ></div>
                  </div>
                  <div className="bar-label">{labels[index]}</div>
                  <div className="bar-value">${(value / 1000).toFixed(1)}k</div>
                </div>
              ))}
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
          <div className="summary-label">Average Revenue</div>
          <div className="summary-value">
            ${Math.round(revenueData.reduce((a, b) => a + b, 0) / revenueData.length).toLocaleString()}
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
