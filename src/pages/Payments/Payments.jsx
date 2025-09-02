import React, { useState } from 'react';
import { useHostel } from '../../contexts/HostelContext';
import { useNavigate } from 'react-router-dom';
import { DollarSign, Plus } from 'lucide-react';
import { PaymentSummary, PaymentFilters } from '../../components/PaymentComponents';
import PaymentTable from '../../components/PaymentTable/PaymentTable';
import './Payments.css';

const Payments = () => {
  const { hasHostel, hostelInfo } = useHostel();
  const navigate = useNavigate();
  const [filterStatus, setFilterStatus] = useState('all');

  // Mock data for demonstration
  const mockPayments = [
    {
      id: 1,
      tenant: 'John Doe',
      room: 'Room 101',
      amount: 750,
      dueDate: '2024-02-01',
      status: 'paid',
      paidDate: '2024-01-28'
    },
    {
      id: 2,
      tenant: 'Jane Smith',
      room: 'Room 102',
      amount: 750,
      dueDate: '2024-02-05',
      status: 'pending',
      paidDate: null
    },
    {
      id: 3,
      tenant: 'Mike Johnson',
      room: 'Room 103',
      amount: 750,
      dueDate: '2024-01-15',
      status: 'overdue',
      paidDate: null
    },
    {
      id: 4,
      tenant: 'Sarah Wilson',
      room: 'Room 104',
      amount: 800,
      dueDate: '2024-02-10',
      status: 'paid',
      paidDate: '2024-01-30'
    }
  ];

  // Calculate summary metrics
  const totalExpected = mockPayments.reduce((sum, payment) => sum + payment.amount, 0);
  const totalPaid = mockPayments.filter(p => p.status === 'paid').reduce((sum, payment) => sum + payment.amount, 0);
  const totalPending = mockPayments.filter(p => p.status === 'pending').reduce((sum, payment) => sum + payment.amount, 0);
  const totalOverdue = mockPayments.filter(p => p.status === 'overdue').reduce((sum, payment) => sum + payment.amount, 0);

  const handleSetupHostel = () => {
    navigate('/settings');
  };

  const handleExportReport = () => {
    // Handle export report
    console.log('Export report');
  };

  const handleRecordPayment = () => {
    // Handle record payment
    console.log('Record payment');
  };

  // If no hostel exists, show setup message
  if (!hasHostel) {
    return (
      <div className="payments-page">
        <div className="page-header">
          <div className="page-header-content">
            <div>
              <h1 className="page-title">Payments</h1>
              <p className="page-subtitle">Track rent payments and financial metrics</p>
            </div>
          </div>
        </div>
        
        <div className="no-hostel-payments">
          <div className="no-hostel-content">
            <DollarSign size={64} className="no-hostel-icon" />
            <h2>Payment Tracking Not Available</h2>
            <p>You need to set up your hostel first to track rent payments, monitor financial metrics, and manage tenant billing.</p>
            <div className="payments-actions">
              <button onClick={handleSetupHostel} className="btn btn-primary">
                <Plus size={20} />
                Set Up Hostel
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const filteredPayments = filterStatus === 'all' 
    ? mockPayments 
    : mockPayments.filter(payment => payment.status === filterStatus);

  const summaryData = {
    totalExpected,
    totalPaid,
    totalPending,
    totalOverdue
  };

  return (
    <div className="payments-page">
      <div className="page-header">
        <div className="page-header-content">
          <div>
            <h1 className="page-title">Payments</h1>
            <p className="page-subtitle">Track {hostelInfo?.hostelDetails?.name || 'your hostel'} financial metrics</p>
          </div>
        </div>
      </div>

      {/* Payment Summary Component */}
      <PaymentSummary summary={summaryData} />

      {/* Payment Filters Component */}
      <PaymentFilters
        filterStatus={filterStatus}
        onFilterChange={setFilterStatus}
        onExportReport={handleExportReport}
        onRecordPayment={handleRecordPayment}
      />

      {/* Payment Table Component */}
      <PaymentTable
        payments={filteredPayments}
        onView={(payment) => console.log('View payment:', payment)}
        onEdit={(payment) => console.log('Edit payment:', payment)}
      />
    </div>
  );
};

export default Payments;
