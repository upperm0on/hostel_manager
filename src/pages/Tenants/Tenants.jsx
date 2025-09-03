import React, { useState } from 'react';
import { useHostel } from '../../contexts/HostelContext';
import { useNavigate } from 'react-router-dom';
import { Users, Plus } from 'lucide-react';
import { TenantSearch, TenantTable, TenantModal } from '../../components/TenantComponents';
import './Tenants.css';

const Tenants = () => {
  const { hasHostel, hostelInfo } = useHostel();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [showTenantModal, setShowTenantModal] = useState(false);
  const [editingTenant, setEditingTenant] = useState(null);
  const [modalMode, setModalMode] = useState('add');

  // Mock data for demonstration
  const mockTenants = [
    {
      id: 1,
      name: 'John Doe',
      email: 'john.doe@email.com',
      phone: '+1 (555) 123-4567',
      room: 'Room 101',
      checkInDate: '2024-01-01',
      status: 'active',
      rentAmount: 750,
      nextPayment: '2024-02-01'
    },
    {
      id: 2,
      name: 'Jane Smith',
      email: 'jane.smith@email.com',
      phone: '+1 (555) 234-5678',
      room: 'Room 102',
      checkInDate: '2024-01-05',
      status: 'active',
      rentAmount: 750,
      nextPayment: '2024-02-05'
    },
    {
      id: 3,
      name: 'Mike Johnson',
      email: 'mike.johnson@email.com',
      phone: '+1 (555) 345-6789',
      room: 'Room 103',
      checkInDate: '2023-12-15',
      status: 'overdue',
      rentAmount: 750,
      nextPayment: '2024-01-15'
    },
    {
      id: 4,
      name: 'Sarah Wilson',
      email: 'sarah.wilson@email.com',
      phone: '+1 (555) 456-7890',
      room: 'Room 104',
      checkInDate: '2024-01-10',
      status: 'active',
      rentAmount: 800,
      nextPayment: '2024-02-10'
    }
  ];

  const handleSetupHostel = () => {
    navigate('/settings');
  };

  const handleAddTenant = () => {
    setModalMode('add');
    setEditingTenant(null);
    setShowTenantModal(true);
  };

  const handleEditTenant = (tenant) => {
    setModalMode('edit');
    setEditingTenant(tenant);
    setShowTenantModal(true);
  };

  const handleSaveTenant = async (tenantData) => {
    try {
      if (modalMode === 'add') {
        // Add new tenant logic
        const newTenant = {
          id: Date.now(),
          ...tenantData,
          status: 'active'
        };
        console.log('Adding new tenant:', newTenant);
        // In a real app, this would save to backend
      } else {
        // Edit tenant logic
        const updatedTenant = { ...editingTenant, ...tenantData };
        console.log('Updating tenant:', updatedTenant);
        // In a real app, this would update in backend
      }
    } catch (error) {
      console.error('Error saving tenant:', error);
    }
  };

  const handleCloseModal = () => {
    setShowTenantModal(false);
    setEditingTenant(null);
  };

  const handleDeleteTenant = async (tenant) => {
    try {
      console.log('Deleting tenant:', tenant);
      // In a real app, this would delete from backend
      // For now, just log the action
    } catch (error) {
      console.error('Error deleting tenant:', error);
    }
  };

  // If no hostel exists, show setup message
  if (!hasHostel) {
    return (
      <div className="tenants-page">
        <div className="page-header">
          <div className="page-header-content">
            <div>
              <h1 className="page-title">Tenants</h1>
              <p className="page-subtitle">Manage your hostel tenants</p>
            </div>
          </div>
        </div>
        
        <div className="no-hostel-tenants">
          <div className="no-hostel-content">
            <Users size={64} className="no-hostel-icon" />
            <h2>Tenant Management Not Available</h2>
            <p>You need to set up your hostel first to manage tenants, track payments, and handle check-ins/check-outs.</p>
            <div className="tenants-actions">
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

  const filteredTenants = mockTenants.filter(tenant => {
    const matchesSearch = tenant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         tenant.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         tenant.room.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = filterStatus === 'all' || tenant.status === filterStatus;
    
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="tenants-page">
      <div className="page-header">
        <div className="page-header-content">
          <div>
            <h1 className="page-title">Tenants</h1>
            <p className="page-subtitle">Manage {hostelInfo?.hostelDetails?.name || 'your hostel'} tenants</p>
          </div>
        </div>
      </div>

      {/* Tenant Search and Filter Component */}
      <TenantSearch
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        filterStatus={filterStatus}
        onFilterChange={setFilterStatus}
        onAddTenant={handleAddTenant}
      />

      {/* Tenant Table Component */}
      <TenantTable
        tenants={filteredTenants}
        onEdit={handleEditTenant}
        onDelete={handleDeleteTenant}
      />

      {/* Tenant Modal */}
      <TenantModal
        isOpen={showTenantModal}
        onClose={handleCloseModal}
        tenant={editingTenant}
        onSave={handleSaveTenant}
        mode={modalMode}
      />
    </div>
  );
};

export default Tenants;
