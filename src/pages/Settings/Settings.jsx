import React, { useState, useEffect } from "react";
import { useHostel } from "../../contexts/HostelContext";
import { Edit, X, ArrowLeft } from "lucide-react";
import {
  HostelDetailsTab,
  GeneralAmenitiesTab,
  RoomDetailsTab,
  SubmissionTab,
  ProgressIndicator,
  NavigationButtons,
  AmenityModal,
  HostelOverview,
  BankingDetailsTab,
} from "../../components/SettingsTabs";
import {
  SettingsHeader,
  NoHostelState,
  SettingsTabsNavigation,
  TabContent
} from "../../components/Settings";
import "./Settings.css";

const Settings = () => {
  const { hasHostel, hostelInfo, createHostel, updateHostel, deleteHostel, refreshHostelData } =
    useHostel();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [showAddHostel, setShowAddHostel] = useState(false);
  const [activeTab, setActiveTab] = useState('hostel');
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Handle refresh with loading state
  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      const result = await refreshHostelData();
      if (result.success) {
        console.log('Manual refresh successful');
      } else {
        console.error('Manual refresh failed:', result.error);
        alert('Failed to refresh data. Please try again.');
      }
    } catch (error) {
      console.error('Error during manual refresh:', error);
      alert('Error refreshing data. Please try again.');
    } finally {
      setIsRefreshing(false);
    }
  };

  // Form data state
  const [hostelDetails, setHostelDetails] = useState({
    name: "",
    location: "",
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
        name: hostelInfo.name || "",
        location: hostelInfo.campus?.campus || "",
        logo: hostelInfo.image || null,
      });
      
      // Parse room details from the backend structure
      if (hostelInfo.room_details && Array.isArray(hostelInfo.room_details)) {
        const parsedRoomDetails = hostelInfo.room_details.map((room, index) => {
          // Parse amenities if it's a string
          let parsedAmenities = [];
          if (room.amenities) {
            if (typeof room.amenities === 'string') {
              try {
                const rawAmenities = JSON.parse(room.amenities);
                // Ensure amenities have proper structure
                parsedAmenities = rawAmenities.map((amenity, amenityIndex) => ({
                  id: amenity.id || `amenity-${index}-${amenityIndex}`,
                  value: amenity.value || amenity || ''
                }));
              } catch (e) {
                console.error('Error parsing amenities:', e);
                parsedAmenities = [];
              }
            } else if (Array.isArray(room.amenities)) {
              // Ensure amenities have proper structure
              parsedAmenities = room.amenities.map((amenity, amenityIndex) => ({
                id: amenity.id || `amenity-${index}-${amenityIndex}`,
                value: amenity.value || amenity || ''
              }));
            }
          }
          
          return {
            id: index + 1,
            numberInRoom: room.number_in_room || "",
            quantity: room.number_of_rooms || "",
            price: room.price || "",
            gender: room.gender?.male ? "male" : room.gender?.female ? "female" : "mixed",
            maleRooms: room.gender?.male || "",
            femaleRooms: room.gender?.female || "",
            roomImage: room.room_image || null,
            amenities: parsedAmenities,
          };
        });
        setRoomDetails(parsedRoomDetails);
      }
      
      // Parse general amenities from additional_details if it exists
      let parsedGeneralAmenities = [];
      if (hostelInfo.additional_details) {
        if (typeof hostelInfo.additional_details === 'string') {
          try {
            const parsed = JSON.parse(hostelInfo.additional_details);
            if (Array.isArray(parsed)) {
              parsedGeneralAmenities = parsed.map((item, index) => ({
                id: index + 1,
                value: typeof item === 'string' ? item : item.value || item
              }));
            }
          } catch (e) {
            console.error('Error parsing additional_details:', e);
            parsedGeneralAmenities = [];
          }
        } else if (Array.isArray(hostelInfo.additional_details)) {
          parsedGeneralAmenities = hostelInfo.additional_details.map((item, index) => ({
            id: index + 1,
            value: typeof item === 'string' ? item : item.value || item
          }));
        }
      }
      setGeneralAmenities(parsedGeneralAmenities);
      setAdditionalInfo([]);
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
    const amenities = roomDetails[roomIndex]?.amenities || [];
    // Ensure all amenities have proper structure
    const validAmenities = amenities.map((amenity, index) => ({
      id: amenity.id || `amenity-${index}`,
      value: amenity.value || ''
    }));
    setCurrentRoomAmenities(validAmenities);
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
                  item.value && item.value.trim()
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
    if (currentSlide < 3) {
      setCurrentSlide(currentSlide + 1);
    }
  };

  const prevSlide = () => {
    if (currentSlide > 0) {
      setCurrentSlide(currentSlide - 1);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate form data
    if (!hostelDetails.name || !hostelDetails.location) {
      alert("Please fill in all required hostel details");
      return;
    }

    // Prepare data for submission
    const formData = {
      hostelDetails,
      generalAmenities: generalAmenities.filter((item) => item.value && item.value.trim()),
      roomDetails: roomDetails.filter(
        (room) => room.numberInRoom || room.price || room.quantity
      ),
      additionalInfo: additionalInfo.filter((item) => item.value && item.value.trim()),
    };

    console.log("Submitting hostel data:", formData);

    try {
      // Create or update hostel using context
      let result;
      if (hasHostel) {
        result = await updateHostel(formData);
        if (result.success) {
          alert("Hostel information updated successfully!");
          // Refresh data from backend to ensure UI shows latest data
          console.log("Refreshing data after update...");
          const refreshResult = await refreshHostelData();
          if (refreshResult.success) {
            console.log("Data refreshed successfully after update");
          } else {
            console.error("Failed to refresh data after update:", refreshResult.error);
          }
        } else {
          alert(`Error updating hostel: ${result.error?.message || result.error}`);
          return;
        }
      } else {
        result = await createHostel(formData);
        if (result.success) {
          alert("Hostel created successfully!");
          // Refresh data from backend to ensure UI shows latest data
          console.log("Refreshing data after creation...");
          const refreshResult = await refreshHostelData();
          if (refreshResult.success) {
            console.log("Data refreshed successfully after creation");
          } else {
            console.error("Failed to refresh data after creation:", refreshResult.error);
          }
        } else {
          alert(`Error creating hostel: ${result.error?.message || result.error}`);
          return;
        }
      }

      // Reset form and show success state
      setShowAddHostel(false);
      setCurrentSlide(0);
    } catch (error) {
      console.error('Error submitting hostel data:', error);
      alert(`Error submitting hostel data: ${error.message}`);
    }
  };

  const startAddHostel = () => {
    setShowAddHostel(true);
    setCurrentSlide(0);
    // Reset form data
    setHostelDetails({ name: "", location: "", logo: null });
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
      <div className="hostel-settings-modern">
        <div className="settings-container-modern">
          <SettingsHeader
            title="Settings"
            subtitle="Configure your hostel settings and preferences"
          />
          <NoHostelState onAddHostel={startAddHostel} />
        </div>
      </div>
    );
  }

  // If showing add hostel form
  if (showAddHostel) {
    return (
      <div className="hostel-settings-modern">
        <div className="settings-container-modern">
          <SettingsHeader
            title={hasHostel ? "Edit Hostel Information" : "Add New Hostel"}
            subtitle={
              hasHostel
                ? "Update your hostel information below"
                : "Complete the form below to set up your hostel"
            }
            showActions={true}
            onEdit={() => setShowAddHostel(false)}
            onDelete={() => setShowAddHostel(false)}
          />

          {/* Progress Indicator Component */}
          <div className="progress-section-modern">
            <ProgressIndicator currentSlide={currentSlide} />
          </div>

          {/* Multi-step Form */}
          <form onSubmit={handleSubmit} className="multi-step-form-modern">
            <div className="form-container-modern">
              <div className="slides-wrapper-modern">
                {/* Slide 1: Hostel Details Component */}
                {currentSlide === 0 && (
                  <div className="slide-content-modern">
                    <HostelDetailsTab
                      hostelDetails={hostelDetails}
                      onHostelDetailsChange={handleHostelDetailsChange}
                      onLogoUpload={handleLogoUpload}
                    />
                  </div>
                )}

                {/* Slide 2: General Amenities Component */}
                {currentSlide === 1 && (
                  <div className="slide-content-modern">
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
                  </div>
                )}

                {/* Slide 3: Room Details Component */}
                {currentSlide === 2 && (
                  <div className="slide-content-modern">
                    <RoomDetailsTab
                      roomDetails={roomDetails}
                      onAddRoom={addRoom}
                      onRemoveRoom={removeRoom}
                      onUpdateRoom={updateRoom}
                      onOpenAmenityModal={openAmenityModal}
                    />
                  </div>
                )}

                {/* Slide 4: Submission Component */}
                {currentSlide === 3 && (
                  <div className="slide-content-modern">
                    <SubmissionTab
                      hostelDetails={hostelDetails}
                      generalAmenities={generalAmenities}
                      roomDetails={roomDetails}
                      additionalInfo={additionalInfo}
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Navigation Buttons Component */}
            <div className="navigation-section-modern">
              <NavigationButtons
                currentSlide={currentSlide}
                onPrevSlide={prevSlide}
                onNextSlide={nextSlide}
                onSubmit={handleSubmit}
                hasHostel={hasHostel}
              />
            </div>
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
      </div>
    );
  }

  // If hostel info exists, show comprehensive overview
  return (
    <div className="hostel-settings-modern">
      <div className="settings-container-modern">
        <SettingsHeader
          title="Settings"
          subtitle="Manage your hostel configuration and preferences"
          showActions={true}
          onEdit={editHostelInfo}
          onDelete={handleDeleteHostel}
          onRefresh={handleRefresh}
          isRefreshing={isRefreshing}
        />

        <div className="settings-content-modern">
          <SettingsTabsNavigation
            activeTab={activeTab}
            onTabChange={setActiveTab}
          />

          <div className="tab-content-wrapper-modern">
            <TabContent
              activeTab={activeTab}
              hostelInfo={hostelInfo}
              bankingDetails={bankingDetails}
              onBankingSave={handleBankingDetailsSave}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
