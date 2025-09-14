import React, { useState, useEffect } from "react";
import { useHostel } from "../../contexts/HostelContext";
import { useNavigate } from "react-router-dom";
import { Users } from "lucide-react";
import { TenantSearch, TenantTable } from "../../components/TenantComponents";
import { API_ENDPOINTS } from "../../config/api";
import BankingAlert from "../../components/Common/BankingAlert";
import "./Tenants.css";

const Tenants = () => {
  const { hasHostel, hostelInfo } = useHostel();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [tenants, setTenants] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleCompleteBanking = () => {
    navigate('/settings?tab=banking');
  };

  // Fetch tenants from backend API
  useEffect(() => {
    const fetchTenants = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");

        if (!token) {
          console.log("No authentication token found");
          return;
        }

        const response = await fetch(
          API_ENDPOINTS.TENANTS_LIST,
          {
            method: "GET",
            headers: {
              Authorization: `Token ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (!response.ok) {
          const errorText = await response.text();
          console.log("Error response body:", errorText);
          throw new Error(
            `HTTP error! status: ${response.status} - ${errorText}`
          );
        }

        const data = await response.json();

        // Transform API data to match frontend expected format
        if (data.status === "success" && data.tenants) {
          const transformedTenants = data.tenants.map((tenant) => ({
            id: tenant.id,
            name: tenant.user?.username || "Unknown",
            email: tenant.user?.email || "No email",
            phone: tenant.user?.phone || "No phone",
            room: `${tenant.room_id} in room`,
            checkInDate: tenant.date_created
              ? new Date(tenant.date_created).toISOString().split("T")[0]
              : "Unknown",
            status: "active", // Default status since API doesn't provide this
            rentAmount: tenant.amount || 0,
            // Keep original API data for reference
            originalData: tenant,
          }));

          setTenants(transformedTenants);
        }
      } catch (error) {
        console.error("Error fetching tenants:", error);
        setTenants([]); // Set empty array on error
      } finally {
        setLoading(false);
      }
    };

    // Only fetch if user is authenticated and has a hostel
    if (hasHostel) {
      fetchTenants();
    }
  }, [hasHostel]);

  const handleSetupHostel = () => {
    navigate("/settings");
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
            <p>
              You need to set up your hostel first to manage tenants, track
              payments, and handle check-ins/check-outs.
            </p>
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

  const filteredTenants = tenants.filter((tenant) => {
    const matchesSearch =
      tenant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tenant.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tenant.room.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesFilter =
      filterStatus === "all" || tenant.status === filterStatus;

    return matchesSearch && matchesFilter;
  });

  return (
    <div className="tenants-page">
      <BankingAlert onComplete={handleCompleteBanking} />
      <div className="page-header">
        <div className="page-header-content">
          <div>
            <h1 className="page-title">Tenants</h1>
            <p className="page-subtitle">
              Manage {hostelInfo?.name || "your hostel"} tenants
              {loading ? " (Loading...)" : ` (${tenants.length} total)`}
            </p>
          </div>
        </div>
      </div>

      {/* Tenant Search and Filter Component */}
      <TenantSearch
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        filterStatus={filterStatus}
        onFilterChange={setFilterStatus}
      />

      {/* Tenant Table Component */}
      {loading ? (
        <div className="loading-container">
          <div className="loading-spinner">Loading tenants...</div>
        </div>
      ) : (
        <TenantTable tenants={filteredTenants} />
      )}
    </div>
  );
};

export default Tenants;
