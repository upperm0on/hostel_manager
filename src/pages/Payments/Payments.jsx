import React, { useState } from 'react';
import { useHostel } from '../../contexts/HostelContext';
import { useNavigate } from 'react-router-dom';
import { DollarSign, Plus } from 'lucide-react';
import { PaymentSummary, PaymentFilters, PaymentModal } from '../../components/PaymentComponents';
import PaymentTable from '../../components/PaymentTable/PaymentTable';
import BankingAlert from '../../components/Common/BankingAlert';
import './Payments.css';

const Payments = () => {
  const { hasHostel, hostelInfo } = useHostel();
  const navigate = useNavigate();
  const [filterStatus, setFilterStatus] = useState('all');
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [editingPayment, setEditingPayment] = useState(null);
  const [modalMode, setModalMode] = useState('add');

  const handleCompleteBanking = () => {
    navigate('/settings?tab=banking');
  };

  // Mock data for demonstration
  const mockTenants = [
    {
      id: 1,
      name: 'John Doe',
      email: 'john.doe@email.com',
      phone: '+1 (555) 123-4567',
      room: 'Room 101',
      checkInDate: '2024-01-01',
      rentAmount: 750,
      deposit: 750,
      leaseStartDate: '2024-01-01',
      leaseEndDate: '2024-12-31',
      status: 'active',
      nextPayment: '2024-02-01'
    },
    {
      id: 2,
      name: 'Jane Smith',
      email: 'jane.smith@email.com',
      phone: '+1 (555) 234-5678',
      room: 'Room 102',
      checkInDate: '2024-01-05',
      rentAmount: 750,
      deposit: 750,
      leaseStartDate: '2024-01-05',
      leaseEndDate: '2024-12-31',
      status: 'active',
      nextPayment: '2024-02-05'
    },
    {
      id: 3,
      name: 'Mike Johnson',
      email: 'mike.johnson@email.com',
      phone: '+1 (555) 345-6789',
      room: 'Room 103',
      checkInDate: '2024-01-10',
      rentAmount: 750,
      deposit: 750,
      leaseStartDate: '2024-01-10',
      leaseEndDate: '2024-12-31',
      status: 'overdue',
      nextPayment: '2024-01-15'
    },
    {
      id: 4,
      name: 'Sarah Wilson',
      email: 'sarah.wilson@email.com',
      phone: '+1 (555) 456-7890',
      room: 'Room 104',
      checkInDate: '2024-01-15',
      rentAmount: 800,
      deposit: 800,
      leaseStartDate: '2024-01-15',
      leaseEndDate: '2024-12-31',
      status: 'active',
      nextPayment: '2024-02-10'
    }
  ];

  const mockPayments = [
    {
      id: 1,
      tenantId: 1,
      tenant: 'John Doe',
      room: 'Room 101',
      amount: 750,
      dueDate: '2024-02-01',
      status: 'paid',
      paidDate: '2024-01-28'
    },
    {
      id: 2,
      tenantId: 2,
      tenant: 'Jane Smith',
      room: 'Room 102',
      amount: 750,
      dueDate: '2024-02-05',
      status: 'pending',
      paidDate: null
    },
    {
      id: 3,
      tenantId: 3,
      tenant: 'Mike Johnson',
      room: 'Room 103',
      amount: 750,
      dueDate: '2024-01-15',
      status: 'overdue',
      paidDate: null
    },
    {
      id: 4,
      tenantId: 4,
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
    try {
      // Create CSV data
      const csvData = [
        ['Tenant', 'Room', 'Amount', 'Due Date', 'Status', 'Paid Date'],
        ...filteredPayments.map(payment => [
          payment.tenant,
          payment.room,
          `$${payment.amount}`,
          payment.dueDate,
          payment.status,
          payment.paidDate || 'N/A'
        ])
      ];
      
      // Convert to CSV string
      const csvString = csvData.map(row => row.join(',')).join('\n');
      
      // Create and download file
      const blob = new Blob([csvString], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `payments-report-${new Date().toISOString().slice(0, 10)}.csv`;
      a.click();
      URL.revokeObjectURL(url);
      
      console.log('Payment report exported successfully');
    } catch (error) {
      console.error('Error exporting report:', error);
      alert('Failed to export report. Please try again.');
    }
  };

  const handleRecordPayment = () => {
    setModalMode('add');
    setEditingPayment(null);
    setShowPaymentModal(true);
  };

  const handleEditPayment = (payment) => {
    setModalMode('edit');
    setEditingPayment(payment);
    setShowPaymentModal(true);
  };

  const handleSavePayment = async (paymentData) => {
    try {
      if (modalMode === 'add') {
        // Add new payment logic
        const newPayment = {
          id: Date.now(),
          ...paymentData
        };
        console.log('Adding new payment:', newPayment);
        // In a real app, this would save to backend
      } else {
        // Edit payment logic
        const updatedPayment = { ...editingPayment, ...paymentData };
        console.log('Updating payment:', updatedPayment);
        // In a real app, this would update in backend
      }
    } catch (error) {
      console.error('Error saving payment:', error);
    }
  };

  const handleCloseModal = () => {
    setShowPaymentModal(false);
    setEditingPayment(null);
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
      <BankingAlert onComplete={handleCompleteBanking} />
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
        onEdit={handleEditPayment}
      />

      {/* Payment Modal */}
      <PaymentModal
        isOpen={showPaymentModal}
        onClose={handleCloseModal}
        payment={editingPayment}
        onSave={handleSavePayment}
        mode={modalMode}
        tenants={mockTenants}
      />
    </div>
  );
};

export default Payments;
