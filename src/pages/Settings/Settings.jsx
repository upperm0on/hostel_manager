import React, { useState, useEffect } from "react";
import { useHostel } from "../../contexts/HostelContext";
import {
  Building,
  Home,
  Plus,
  ArrowLeft,
  Edit,
  X,
  CheckCircle,
  Users,
  BarChart3,
  CreditCard,
  Settings as SettingsIcon,
} from "lucide-react";
import {
  HostelDetailsTab,
  GeneralAmenitiesTab,
  RoomDetailsTab,
  SubmissionTab,
  ProgressIndicator,
  NavigationButtons,
  AmenityModal,
  HostelOverview,
  AnalyticsTab,
  BankingDetailsTab,
} from "../../components/SettingsTabs";
import "./Settings.css";

const Settings = () => {
  const { hasHostel, hostelInfo, createHostel, updateHostel, deleteHostel } =
    useHostel();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [showAddHostel, setShowAddHostel] = useState(false);
  const [activeTab, setActiveTab] = useState('hostel');

  // Form data state
  const [hostelDetails, setHostelDetails] = useState({
    name: "",
    location: "",
    description: "",
    logo: null,
  });

  const [generalAmenities, setGeneralAmenities] = useState([]);
  const [roomDetails, setRoomDetails] = useState([]);
  const [additionalInfo, setAdditionalInfo] = useState([]);
  const [bankingDetails, setBankingDetails] = useState({});

  // Room management state
  const [showAmenityModal, setShowAmenityModal] = useState(false);
  const [currentRoomIndex, setCurrentRoomIndex] = useState(null);
  const [currentRoomAmenities, setCurrentRoomAmenities] = useState([]);

  // Initialize form with existing hostel info if available
  useEffect(() => {
    if (hostelInfo) {
      setHostelDetails({
        name: hostelInfo.hostelDetails?.name || "",
        location: hostelInfo.hostelDetails?.location || "",
        description: hostelInfo.hostelDetails?.description || "",
        logo: hostelInfo.hostelDetails?.logo || null,
      });
      setGeneralAmenities(hostelInfo.generalAmenities || []);
      setRoomDetails(hostelInfo.roomDetails || []);
      setAdditionalInfo(hostelInfo.additionalInfo || []);
    }
  }, [hostelInfo]);

  const handleHostelDetailsChange = (field, value) => {
    setHostelDetails((prev) => ({ ...prev, [field]: value }));
  };

  const handleLogoUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setHostelDetails((prev) => ({ ...prev, logo: file }));
    }
  };

  const addGeneralAmenity = () => {
    setGeneralAmenities((prev) => [...prev, { id: Date.now(), value: "" }]);
  };

  const removeGeneralAmenity = (id) => {
    setGeneralAmenities((prev) => prev.filter((item) => item.id !== id));
  };

  const updateGeneralAmenity = (id, value) => {
    setGeneralAmenities((prev) =>
      prev.map((item) => (item.id === id ? { ...item, value } : item))
    );
  };

  const addAdditionalInfo = () => {
    setAdditionalInfo((prev) => [...prev, { id: Date.now(), value: "" }]);
  };

  const removeAdditionalInfo = (id) => {
    setAdditionalInfo((prev) => prev.filter((item) => item.id !== id));
  };

  const updateAdditionalInfo = (id, value) => {
    setAdditionalInfo((prev) =>
      prev.map((item) => (item.id === id ? { ...item, value } : item))
    );
  };

  const addRoom = () => {
    const newRoom = {
      id: Date.now(),
      numberInRoom: "",
      quantity: "",
      price: "",
      gender: "",
      maleRooms: "",
      femaleRooms: "",
      roomImage: null,
      amenities: [],
    };
    setRoomDetails((prev) => [...prev, newRoom]);
  };

  const removeRoom = (id) => {
    setRoomDetails((prev) => prev.filter((room) => room.id !== id));
  };

  const updateRoom = (id, field, value) => {
    setRoomDetails((prev) =>
      prev.map((room) => (room.id === id ? { ...room, [field]: value } : room))
    );
  };

  const openAmenityModal = (roomIndex) => {
    setCurrentRoomIndex(roomIndex);
    setCurrentRoomAmenities(roomDetails[roomIndex]?.amenities || []);
    setShowAmenityModal(true);
  };

  const addRoomAmenity = () => {
    setCurrentRoomAmenities((prev) => [...prev, { id: Date.now(), value: "" }]);
  };

  const removeRoomAmenity = (id) => {
    setCurrentRoomAmenities((prev) => prev.filter((item) => item.id !== id));
  };

  const updateRoomAmenity = (id, value) => {
    setCurrentRoomAmenities((prev) =>
      prev.map((item) => (item.id === id ? { ...item, value } : item))
    );
  };

  const saveRoomAmenities = () => {
    if (currentRoomIndex !== null) {
      setRoomDetails((prev) =>
        prev.map((room, index) =>
          index === currentRoomIndex
            ? {
                ...room,
                amenities: currentRoomAmenities.filter((item) =>
                  item.value.trim()
                ),
              }
            : room
        )
      );
    }
    setShowAmenityModal(false);
    setCurrentRoomIndex(null);
  };

  const nextSlide = () => {
    if (currentSlide < 4) {
      setCurrentSlide(currentSlide + 1);
    }
  };

  const prevSlide = () => {
    if (currentSlide > 0) {
      setCurrentSlide(currentSlide - 1);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validate form data
    if (!hostelDetails.name || !hostelDetails.location) {
      alert("Please fill in all required hostel details");
      return;
    }

    // Prepare data for submission
    const formData = {
      hostelDetails,
      generalAmenities: generalAmenities.filter((item) => item.value.trim()),
      roomDetails: roomDetails.filter(
        (room) => room.numberInRoom || room.price || room.quantity
      ),
      additionalInfo: additionalInfo.filter((item) => item.value.trim()),
    };

    console.log("Submitting hostel data:", formData);

    // Create or update hostel using context
    if (hasHostel) {
      updateHostel(formData);
      alert("Hostel information updated successfully!");
    } else {
      createHostel(formData);
      alert("Hostel created successfully!");
    }

    // Reset form and show success state
    setShowAddHostel(false);
    setCurrentSlide(0);
  };

  const startAddHostel = () => {
    setShowAddHostel(true);
    setCurrentSlide(0);
    // Reset form data
    setHostelDetails({ name: "", location: "", description: "", logo: null });
    setGeneralAmenities([]);
    setRoomDetails([]);
    setAdditionalInfo([]);
  };

  const editHostelInfo = () => {
    setShowAddHostel(true);
    setCurrentSlide(0);
  };

  const handleDeleteHostel = () => {
    if (
      confirm(
        "Are you sure you want to delete this hostel? This action cannot be undone."
      )
    ) {
      deleteHostel();
      alert("Hostel deleted successfully!");
    }
  };

  const handleBankingDetailsSave = (details) => {
    setBankingDetails(details);
    // In a real app, this would save to the backend
    console.log('Saving banking details:', details);
  };

  // If no hostel info exists, show add hostel option
  if (!hasHostel && !showAddHostel) {
    return (
      <div className="hostel-settings">
        <div className="page-header">
          <div className="page-header-content">
            <div>
              <h1 className="page-title">Settings</h1>
              <p className="page-subtitle">
                Configure your hostel settings and preferences
              </p>
            </div>
          </div>
        </div>

        <div className="no-hostel-state">
          <div className="no-hostel-content">
            <Building size={64} className="no-hostel-icon" />
            <h2>No Hostel Information Found</h2>
            <p>
              It looks like you haven't set up your hostel information yet.
              Let's get started!
            </p>
            <button
              className="btn btn-primary btn-large"
              onClick={startAddHostel}
            >
              <Plus size={20} />
              Add New Hostel
            </button>
          </div>
        </div>
      </div>
    );
  }

  // If showing add hostel form
  if (showAddHostel) {
    return (
      <div className="hostel-settings">
        <div className="page-header">
          <div className="page-header-content">
            <div>
              <h1 className="page-title">
                {hasHostel ? "Edit Hostel Information" : "Add New Hostel"}
              </h1>
              <p className="page-subtitle">
                {hasHostel
                  ? "Update your hostel information below"
                  : "Complete the form below to set up your hostel"}
              </p>
            </div>
            <div className="settings-actions">
              <button
                type="button"
                className="btn btn-outline"
                onClick={() => setShowAddHostel(false)}
              >
                <ArrowLeft size={20} />
                Cancel
              </button>
            </div>
          </div>
        </div>

        {/* Progress Indicator Component */}
        <ProgressIndicator currentSlide={currentSlide} />

        {/* Multi-step Form */}
        <form onSubmit={handleSubmit} className="multi-step-form">
          <div className="slideshow-container">
            <div className="slides-wrapper">
              {/* Slide 1: Hostel Details Component */}
              {currentSlide === 0 && (
                <HostelDetailsTab
                  hostelDetails={hostelDetails}
                  onHostelDetailsChange={handleHostelDetailsChange}
                  onLogoUpload={handleLogoUpload}
                />
              )}

              {/* Slide 2: General Amenities Component */}
              {currentSlide === 1 && (
                <GeneralAmenitiesTab
                  generalAmenities={generalAmenities}
                  additionalInfo={additionalInfo}
                  onAddGeneralAmenity={addGeneralAmenity}
                  onRemoveGeneralAmenity={removeGeneralAmenity}
                  onUpdateGeneralAmenity={updateGeneralAmenity}
                  onAddAdditionalInfo={addAdditionalInfo}
                  onRemoveAdditionalInfo={removeAdditionalInfo}
                  onUpdateAdditionalInfo={updateAdditionalInfo}
                />
              )}

              {/* Slide 3: Room Details Component */}
              {currentSlide === 2 && (
                <RoomDetailsTab
                  roomDetails={roomDetails}
                  onAddRoom={addRoom}
                  onRemoveRoom={removeRoom}
                  onUpdateRoom={updateRoom}
                  onOpenAmenityModal={openAmenityModal}
                />
              )}

              {/* Slide 4: Submission Component */}
              {currentSlide === 3 && (
                <SubmissionTab
                  hostelDetails={hostelDetails}
                  generalAmenities={generalAmenities}
                  roomDetails={roomDetails}
                  additionalInfo={additionalInfo}
                />
              )}

              {/* Slide 5: Analytics Component */}
              {currentSlide === 4 && (
                <AnalyticsTab
                  hostelInfo={{
                    hostelDetails,
                    generalAmenities,
                    roomDetails,
                    additionalInfo
                  }}
                />
              )}
            </div>
          </div>

          {/* Navigation Buttons Component */}
          <NavigationButtons
            currentSlide={currentSlide}
            onPrevSlide={prevSlide}
            onNextSlide={nextSlide}
            onSubmit={handleSubmit}
            hasHostel={hasHostel}
          />
        </form>

        {/* Amenity Modal Component */}
        <AmenityModal
          showAmenityModal={showAmenityModal}
          currentRoomAmenities={currentRoomAmenities}
          onClose={() => setShowAmenityModal(false)}
          onAddRoomAmenity={addRoomAmenity}
          onRemoveRoomAmenity={removeRoomAmenity}
          onUpdateRoomAmenity={updateRoomAmenity}
          onSaveRoomAmenities={saveRoomAmenities}
        />
      </div>
    );
  }

  // If hostel info exists, show comprehensive overview
  return (
    <div className="hostel-settings">
      <div className="page-header">
        <div className="page-header-content">
          <div>
            <h1 className="page-title">Settings</h1>
            <p className="page-subtitle">Manage your hostel configuration and preferences</p>
          </div>
          <div className="settings-actions">
            <button
              type="button"
              className="btn btn-outline"
              onClick={editHostelInfo}
            >
              <Edit size={20} />
              Edit Hostel Info
            </button>
            <button
              type="button"
              className="btn btn-error"
              onClick={handleDeleteHostel}
            >
              <X size={20} />
              Delete Hostel
            </button>
          </div>
        </div>
      </div>

      {/* Settings Tabs Navigation */}
      <div className="settings-tabs-navigation">
        <button
          className={`tab-button ${activeTab === 'hostel' ? 'active' : ''}`}
          onClick={() => setActiveTab('hostel')}
        >
          <SettingsIcon size={20} />
          Hostel Settings
        </button>
        <button
          className={`tab-button ${activeTab === 'analytics' ? 'active' : ''}`}
          onClick={() => setActiveTab('analytics')}
        >
          <BarChart3 size={20} />
          Analytics & Reports
        </button>
        <button
          className={`tab-button ${activeTab === 'banking' ? 'active' : ''}`}
          onClick={() => setActiveTab('banking')}
        >
          <CreditCard size={20} />
          Banking Details
        </button>
      </div>

      {/* Tab Content */}
      <div className="tab-content">
        {activeTab === 'hostel' && (
          <div className="tab-panel">
            <HostelOverview hostelInfo={hostelInfo} />
          </div>
        )}
        
        {activeTab === 'analytics' && (
          <div className="tab-panel">
            <AnalyticsTab hostelInfo={hostelInfo} />
          </div>
        )}
        
        {activeTab === 'banking' && (
          <div className="tab-panel">
            <BankingDetailsTab 
              hostelInfo={{ ...hostelInfo, bankingDetails }} 
              onSave={handleBankingDetailsSave}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default Settings;
