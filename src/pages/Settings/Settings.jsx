import React, { useState, useEffect, useCallback } from "react";
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
import RoomOccupancy from "../../components/RoomOccupancy/RoomOccupancy";
import {
  SettingsHeader,
  NoHostelState,
  SettingsTabsNavigation,
  TabContent
} from "../../components/Settings";
import "./Settings.css";

// Auto-save and validation utilities
const STORAGE_KEY = 'hostel_settings_progress';

const saveProgressToStorage = (data) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    console.log('Progress saved to localStorage');
  } catch (error) {
    console.error('Failed to save progress:', error);
  }
};

const loadProgressFromStorage = () => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : null;
  } catch (error) {
    console.error('Failed to load progress:', error);
    return null;
  }
};

const clearProgressFromStorage = () => {
  try {
    localStorage.removeItem(STORAGE_KEY);
    console.log('Progress cleared from localStorage');
  } catch (error) {
    console.error('Failed to clear progress:', error);
  }
};

// Heavy validation functions
const validateNumberField = (value, fieldName, min = 0, max = Infinity) => {
  if (value === '' || value === null || value === undefined) {
    return { isValid: false, error: `${fieldName} cannot be empty` };
  }
  
  const numValue = parseFloat(value);
  if (isNaN(numValue)) {
    return { isValid: false, error: `${fieldName} must be a valid number` };
  }
  
  if (numValue < min) {
    return { isValid: false, error: `${fieldName} must be at least ${min}` };
  }
  
  if (numValue > max) {
    return { isValid: false, error: `${fieldName} must not exceed ${max}` };
  }
  
  if (!Number.isInteger(numValue) && fieldName.includes('room')) {
    return { isValid: false, error: `${fieldName} must be a whole number` };
  }
  
  return { isValid: true, value: numValue };
};

const validateStringField = (value, fieldName, minLength = 1) => {
  if (!value || value.trim() === '') {
    return { isValid: false, error: `${fieldName} cannot be empty` };
  }
  
  if (value.trim().length < minLength) {
    return { isValid: false, error: `${fieldName} must be at least ${minLength} characters` };
  }
  
  return { isValid: true, value: value.trim() };
};

const validateRoomData = (room) => {
  const errors = [];
  
  // Validate room label (optional field, but if provided should not be empty)
  if (room.room_label && room.room_label.trim() === '') {
    errors.push('Room Label cannot be empty if provided');
  }
  
  // Validate number in room
  const capacityValidation = validateNumberField(room.number_in_room, 'Room Capacity', 1, 10);
  if (!capacityValidation.isValid) errors.push(capacityValidation.error);
  
  // Validate number of rooms
  const quantityValidation = validateNumberField(room.number_of_rooms, 'Number of Rooms', 1, 100);
  if (!quantityValidation.isValid) errors.push(quantityValidation.error);
  
  // Validate price
  const priceValidation = validateNumberField(room.price, 'Room Price', 0, 100000);
  if (!priceValidation.isValid) errors.push(priceValidation.error);
  
  // Validate gender allocation if mixed
  if (room.gender === 'mixed') {
    const maleValidation = validateNumberField(room.male_rooms, 'Male Rooms', 0, quantityValidation.value || room.number_of_rooms);
    if (!maleValidation.isValid) errors.push(maleValidation.error);
    
    const femaleValidation = validateNumberField(room.female_rooms, 'Female Rooms', 0, quantityValidation.value || room.number_of_rooms);
    if (!femaleValidation.isValid) errors.push(femaleValidation.error);
    
    // Check if total matches
    const totalRooms = (maleValidation.value || 0) + (femaleValidation.value || 0);
    if (totalRooms !== (quantityValidation.value || room.number_of_rooms)) {
      errors.push('Male and female rooms must equal total number of rooms');
    }
  }
  
  return {
    isValid: errors.length === 0,
    errors,
    validatedData: {
      ...room,
      room_label: room.room_label || '',
      number_in_room: capacityValidation.value || room.number_in_room,
      number_of_rooms: quantityValidation.value || room.number_of_rooms,
      price: priceValidation.value || room.price,
      male_rooms: room.gender === 'mixed' ? (validateNumberField(room.male_rooms, 'Male Rooms', 0).value || 0) : 0,
      female_rooms: room.gender === 'mixed' ? (validateNumberField(room.female_rooms, 'Female Rooms', 0).value || 0) : 0,
    }
  };
};

const Settings = () => {
  const { hasHostel, hostelInfo, createHostel, updateHostel, deleteHostel, refreshHostelData } =
    useHostel();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [showAddHostel, setShowAddHostel] = useState(false);
  const [activeTab, setActiveTab] = useState('hostel');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});
  const [lastSaved, setLastSaved] = useState(null);

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
      console.log('Original hostel info:', hostelInfo);
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
            room_uuid: room.uuid || `room-${index}`,
            room_label: room.room_label || "",
            number_in_room: room.number_in_room || "",
            number_of_rooms: room.number_of_rooms || "",
            price: room.price || "",
            // Normalize gender selection for UI: prefer explicit male/female if exclusive, otherwise mixed
            gender: (room.gender?.male && !room.gender?.female) ? "male"
              : (room.gender?.female && !room.gender?.male) ? "female"
              : "mixed",
            male_rooms: room.gender?.male || 0,
            female_rooms: room.gender?.female || 0,
            room_image: room.room_image || null,
            amenities: parsedAmenities,
          };
        });
        console.log('Parsed room details:', parsedRoomDetails);
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

  // Load saved progress on component mount
  useEffect(() => {
    const savedProgress = loadProgressFromStorage();
    if (savedProgress && !hasHostel) {
      console.log('Loading saved progress:', savedProgress);
      
      if (savedProgress.hostelDetails) {
        setHostelDetails(savedProgress.hostelDetails);
      }
      
      if (savedProgress.roomDetails) {
        setRoomDetails(savedProgress.roomDetails);
      }
      
      if (savedProgress.generalAmenities) {
        setGeneralAmenities(savedProgress.generalAmenities);
      }
      
      setLastSaved(savedProgress.lastUpdated);
    }
  }, [hasHostel]);

  const handleHostelDetailsChange = useCallback((field, value) => {
    setHostelDetails((prev) => {
      const updated = { ...prev, [field]: value };
      console.log('[HostelDetailsChange]', field, value, '→', updated);
      
      // Auto-save progress to localStorage
      const progressData = {
        hostelDetails: updated,
        roomDetails,
        generalAmenities,
        lastUpdated: new Date().toISOString()
      };
      saveProgressToStorage(progressData);
      setLastSaved(new Date().toISOString());
      
      return updated;
    });
    
    // Clear validation errors for this field
    setValidationErrors(prev => {
      const newErrors = { ...prev };
      delete newErrors[`hostel_${field}`];
      return newErrors;
    });
  }, [roomDetails, generalAmenities]);

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
      room_uuid: `room-${Date.now()}`, // Generate a unique room UUID
      room_label: "", // Custom room label/name
      number_in_room: "", // Number of people per room
      number_of_rooms: "", // Total number of rooms of this type
      price: "", // Price per room
      gender: "", // male, female, or mixed
      male_rooms: "",
      female_rooms: "",
      room_image: null,
      amenities: [],
    };
    setRoomDetails((prev) => [...prev, newRoom]);
  };

  const removeRoom = (id) => {
    setRoomDetails((prev) => prev.filter((room) => room.id !== id));
  };

  const updateRoom = useCallback((id, field, value) => {
    setRoomDetails((prev) => {
      const updated = prev.map((room) => (room.id === id ? { ...room, [field]: value } : room));
      console.log('[RoomUpdate]', { id, field, value, updatedRoom: updated.find(r => r.id === id) });
      
      // Auto-save progress to localStorage
      const progressData = {
        hostelDetails,
        roomDetails: updated,
        generalAmenities,
        lastUpdated: new Date().toISOString()
      };
      saveProgressToStorage(progressData);
      setLastSaved(new Date().toISOString());
      
      return updated;
    });
    
    // Clear validation errors for this field
    setValidationErrors(prev => {
      const newErrors = { ...prev };
      delete newErrors[`room_${id}_${field}`];
      return newErrors;
    });
  }, [hostelDetails, generalAmenities]);

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

    // Remove blocking validation. We proceed to submit with the current
    // state, relying on backend validation. We still clear stored progress
    // after a successful submission below.
    setValidationErrors({});

    // Prepare data for submission (map to backend shape)
    const safeAmenities = (list) =>
      JSON.stringify(
        (list || [])
          .map((item) => (typeof item === 'string' ? item : item?.value))
          .filter((val) => typeof val === 'string' && val.trim() !== '')
      );

    // Use saved progress as fallback if in-memory state is empty
    const savedProgressForSubmit = loadProgressFromStorage();
    console.log('[Submit] current state:', { hostelDetails, roomDetails, generalAmenities });
    console.log('[Submit] saved progress:', savedProgressForSubmit);
    const effectiveHostelDetails = (hostelDetails && (hostelDetails.name || hostelDetails.location))
      ? hostelDetails
      : savedProgressForSubmit?.hostelDetails || hostelDetails;
    const effectiveRoomDetails = (roomDetails && roomDetails.length > 0)
      ? roomDetails
      : savedProgressForSubmit?.roomDetails || roomDetails;

    const mappedRooms = (effectiveRoomDetails || []).map((room) => {
      const numberInRoom = room.number_in_room === '' || room.number_in_room == null ? 0 : parseInt(room.number_in_room, 10);
      const numberOfRooms = room.number_of_rooms === '' || room.number_of_rooms == null ? 0 : parseInt(room.number_of_rooms, 10);
      const priceStr = room.price == null || room.price === '' ? '0' : String(room.price);
      // Normalize gender allocations based on selected gender
      let maleRooms = room.male_rooms === '' || room.male_rooms == null ? 0 : parseInt(room.male_rooms, 10);
      let femaleRooms = room.female_rooms === '' || room.female_rooms == null ? 0 : parseInt(room.female_rooms, 10);
      const genderSelection = room.gender;
      if (genderSelection === 'male') {
        maleRooms = isNaN(numberOfRooms) ? 0 : numberOfRooms;
        femaleRooms = 0;
      } else if (genderSelection === 'female') {
        maleRooms = 0;
        femaleRooms = isNaN(numberOfRooms) ? 0 : numberOfRooms;
      } else if (genderSelection === 'mixed') {
        // Ensure totals don't exceed numberOfRooms and are non-negative
        const totalAllocated = (isNaN(maleRooms) ? 0 : maleRooms) + (isNaN(femaleRooms) ? 0 : femaleRooms);
        if (!isNaN(numberOfRooms) && totalAllocated !== numberOfRooms) {
          // Auto-correct to even split, rounding male up
          const correctedMale = Math.ceil(numberOfRooms / 2);
          const correctedFemale = Math.max(0, numberOfRooms - correctedMale);
          maleRooms = correctedMale;
          femaleRooms = correctedFemale;
        }
      } else {
        // default/undefined gender: treat as mixed auto-split
        const correctedMale = Math.ceil((isNaN(numberOfRooms) ? 0 : numberOfRooms) / 2);
        const correctedFemale = Math.max(0, (isNaN(numberOfRooms) ? 0 : numberOfRooms) - correctedMale);
        maleRooms = correctedMale;
        femaleRooms = correctedFemale;
      }
      const amenitiesStr = Array.isArray(room.amenities)
        ? safeAmenities(room.amenities)
        : typeof room.amenities === 'string'
        ? room.amenities
        : '[]';

      return {
        number_in_room: isNaN(numberInRoom) ? 0 : numberInRoom,
        number_of_rooms: isNaN(numberOfRooms) ? 0 : numberOfRooms,
        price: priceStr,
        gender: {
          male: isNaN(maleRooms) ? 0 : maleRooms,
          female: isNaN(femaleRooms) ? 0 : femaleRooms,
        },
        amenities: amenitiesStr,
        room_image: room.room_image || null,
        room_label: room.room_label || '',
      };
    });

    const campusValue = typeof effectiveHostelDetails?.location === 'string'
      ? effectiveHostelDetails.location
      : (effectiveHostelDetails?.location?.campus || '');

    const payload = {
      name: effectiveHostelDetails?.name || '',
      campus: campusValue,
      additional_details: safeAmenities(generalAmenities),
      room_details: mappedRooms, // send as array, not JSON string
      image: effectiveHostelDetails?.logo || null,
    };

    console.log('Submitting hostel payload:', payload);

    try {
      // Create or update hostel using context
      let result;
      if (hasHostel) {
        result = await updateHostel(payload);
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
        result = await createHostel(payload);
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
          />
          
          {/* Progress Save Indicator */}
          {lastSaved && (
            <div className="progress-save-indicator">
              <span className="save-indicator-text">
                💾 Progress saved: {new Date(lastSaved).toLocaleTimeString()}
              </span>
            </div>
          )}

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
                      validationErrors={validationErrors}
                      hostelInfo={hostelInfo}
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
              onTabChange={setActiveTab}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
