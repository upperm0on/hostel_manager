import React, { createContext, useContext, useState, useEffect } from 'react';
import { API_ENDPOINTS } from '../config/api';
import { useAuth } from './AuthContext';

// Create context for hostel state
const HostelContext = createContext();

// Custom hook for using hostel context
export const useHostel = () => {
  const context = useContext(HostelContext);
  if (!context) {
    throw new Error('useHostel must be used within a HostelProvider');
  }
  return context;
};

// Hostel provider component
export const HostelProvider = ({ children }) => {
  const [hasHostel, setHasHostel] = useState(false);
  const [hostelInfo, setHostelInfo] = useState(null);
  const { isAuthenticated } = useAuth();

  // Check if hostel exists and load data
  useEffect(() => {
    const initializeHostelData = async () => {
      const token = localStorage.getItem('token');
      
      if (!token) {
        console.log('No token found, user not authenticated');
        setHasHostel(false);
        return;
      }

      try {
        // Clean up old duplicate hostelData if it exists
        const oldHostelData = localStorage.getItem('hostelData');
        if (oldHostelData) {
          console.log('Cleaning up old hostelData from localStorage');
          localStorage.removeItem('hostelData');
        }
        
        // First check localStorage
        const existingHostel = localStorage.getItem('hostelInfo');
        if (existingHostel) {
          try {
            const parsed = JSON.parse(existingHostel);
            // Parse additional_details and room_details if they're strings
            if (parsed.additional_details && typeof parsed.additional_details === 'string') {
              parsed.additional_details = JSON.parse(parsed.additional_details);
            }
            if (parsed.room_details && typeof parsed.room_details === 'string') {
              parsed.room_details = JSON.parse(parsed.room_details);
            }
            setHostelInfo(parsed);
            setHasHostel(true);
            console.log('Hostel data loaded from localStorage');
          } catch (e) {
            console.error('Error parsing hostel data from localStorage:', e);
            setHasHostel(false);
            setHostelInfo(null);
          }
        } else {
          console.log('No hostel data found in localStorage');
          setHasHostel(false);
          setHostelInfo(null);
        }
      } catch (error) {
        console.error('Error initializing hostel data:', error);
        setHasHostel(false);
      }
    };

    
    initializeHostelData();
  }, [isAuthenticated]); // Re-run when authentication state changes

  // Helper function to transform data to backend format
  const transformToBackendFormat = (data) => {
    // New path: data already in backend shape coming from Settings submit
    if (data && typeof data.name === 'string') {
      const additional = Array.isArray(data.additional_details)
        ? JSON.stringify(data.additional_details)
        : (typeof data.additional_details === 'string' ? data.additional_details : '[]');

      const normalizedRooms = Array.isArray(data.room_details)
        ? data.room_details.map((room) => {
            // Ensure amenities is a JSON string as backend expects
            const amenities = Array.isArray(room.amenities)
              ? JSON.stringify(room.amenities)
              : (typeof room.amenities === 'string' ? room.amenities : '[]');
            return {
              number_in_room: room.number_in_room ?? 0,
              number_of_rooms: room.number_of_rooms ?? 0,
              price: room.price ?? '0',
              gender: {
                male: room.gender?.male ?? 0,
                female: room.gender?.female ?? 0,
              },
              amenities,
              room_image: room.room_image ?? null,
              room_label: room.room_label ?? '',
            };
          })
        : [];

      const backendData = {
        name: data.name || '',
        campus: typeof data.campus === 'string' ? data.campus : (data.campus?.campus || ''),
        additional_details: additional,
        room_details: normalizedRooms,
        image: data.image || null,
      };
      return backendData;
    }

    // Legacy path: transform from old form state shape
    const hostelData = data || {};
    return {
      name: hostelData.hostelDetails?.name || '',
      campus: hostelData.hostelDetails?.location || '',
      additional_details: JSON.stringify(
        hostelData.generalAmenities?.map(item => item.value) || []
      ),
      room_details: (hostelData.roomDetails || []).map(room => ({
        number_in_room: room.number_in_room || 0,
        number_of_rooms: room.number_of_rooms || 0,
        price: room.price || '0',
        gender: {
          male: room.male_rooms || 0,
          female: room.female_rooms || 0
        },
        amenities: JSON.stringify(
          (room.amenities || []).map(amenity => amenity.value)
        ),
        room_image: room.room_image || null,
        room_label: room.room_label || ''
      })),
      image: hostelData.hostelDetails?.logo || null
    };
  };

  // Helper function to parse hostel data from backend
  const parseHostelData = (responseData) => {
    // Handle the response structure: {status: "success", hostel: {...}}
    let processedData;
    if (responseData.hostel) {
      processedData = { ...responseData.hostel };
    } else {
      processedData = { ...responseData };
    }
    
    // Parse additional_details if it's a string
    if (processedData.additional_details && typeof processedData.additional_details === 'string') {
      try {
        processedData.additional_details = JSON.parse(processedData.additional_details);
      } catch (e) {
        console.error('Error parsing additional_details:', e);
        processedData.additional_details = [];
      }
    }
    
    // Parse room_details if it's a string
    if (processedData.room_details && typeof processedData.room_details === 'string') {
      try {
        processedData.room_details = JSON.parse(processedData.room_details);
      } catch (e) {
        console.error('Error parsing room_details:', e);
        processedData.room_details = [];
      }
    }
    
    return processedData;
  };

  const createHostel = async (hostelData) => {
    try {
      const token = localStorage.getItem('token');
      
      // Transform frontend format to backend format
      const backendData = transformToBackendFormat(hostelData);
      
      console.log('Sending data to backend:', backendData);
      
      const response = await fetch(API_ENDPOINTS.HOSTEL_CREATE, {
        method: 'POST',
        headers: {
          'Authorization': `Token ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(backendData)
      });

      if (response.ok) {
        const result = await response.json();
        console.log('Hostel created successfully:', result);
        
        // Parse additional_details and room_details if they're strings
        const processedData = parseHostelData(result);
        
        // Update state immediately
        setHostelInfo(processedData);
        setHasHostel(true);
        localStorage.setItem('hostelInfo', JSON.stringify(processedData));
        
        console.log('Hostel state updated after creation');
        return { success: true, data: processedData };
      } else {
        const errorData = await response.json();
        console.error('Error creating hostel:', errorData);
        return { success: false, error: errorData };
      }
    } catch (error) {
      console.error('Error creating hostel:', error);
      return { success: false, error: error.message };
    }
  };

  const updateHostel = async (updatedData) => {
    try {
      const token = localStorage.getItem('token');
      
      // Transform frontend format to backend format
      const backendData = transformToBackendFormat(updatedData);
      
      console.log('Sending data to backend:', backendData);
      
      const response = await fetch(API_ENDPOINTS.HOSTEL_CREATE, {
        method: 'POST',
        headers: {
          'Authorization': `Token ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(backendData)
      });

      if (response.ok) {
        const result = await response.json();
        console.log('Hostel updated successfully:', result);
        
        // Parse additional_details and room_details if they're strings
        const processedData = parseHostelData(result);
        setHostelInfo(processedData);
        localStorage.setItem('hostelInfo', JSON.stringify(processedData));
        
        // Force a re-render by updating the state
        setHasHostel(true);
        
        return { success: true, data: processedData };
      } else {
        const errorData = await response.json();
        console.error('Error updating hostel:', errorData);
        return { success: false, error: errorData };
      }
    } catch (error) {
      console.error('Error updating hostel:', error);
      return { success: false, error: error.message };
    }
  };

  // Function to fetch hostel data from backend
  const fetchHostelData = async () => {
    try {
      const token = localStorage.getItem('token');
      
      // Try the update_or_create endpoint with GET first
      let response = await fetch(API_ENDPOINTS.HOSTEL_GET, {
        method: 'GET',
        headers: {
          'Authorization': `Token ${token}`,
          'Content-Type': 'application/json',
        }
      });

      // If that doesn't work, try a dedicated hostel endpoint
      if (!response.ok) {
        response = await fetch(API_ENDPOINTS.HOSTEL_GET, {
          method: 'GET',
          headers: {
            'Authorization': `Token ${token}`,
            'Content-Type': 'application/json',
          }
        });
      }

      if (response.ok) {
        const result = await response.json();
        console.log('Hostel data fetched:', result);
        
        // Parse additional_details and room_details if they're strings
        const processedData = parseHostelData(result);
        
        // Update state immediately
        setHostelInfo(processedData);
        setHasHostel(true);
        localStorage.setItem('hostelInfo', JSON.stringify(processedData));
        
        console.log('Hostel state updated successfully');
        return { success: true, data: processedData };
      } else {
        console.error('Error fetching hostel data:', response.status);
        return { success: false, error: 'Failed to fetch data' };
      }
    } catch (error) {
      console.error('Error fetching hostel data:', error);
      return { success: false, error: error.message };
    }
  };

  // Function to refresh hostel data from backend
  const refreshHostelData = async () => {
    console.log('Refreshing hostel data...');
    try {
      const result = await fetchHostelData();
      
      if (result.success) {
        console.log('Hostel data refreshed successfully:', result.data);
        // Force a re-render by updating the state
        setHasHostel(true);
        return result;
      } else {
        console.error('Failed to refresh hostel data:', result.error);
        return result;
      }
    } catch (error) {
      console.error('Error in refreshHostelData:', error);
      return { success: false, error: error.message };
    }
  };

  const deleteHostel = () => {
    setHostelInfo(null);
    setHasHostel(false);
    localStorage.removeItem('hostelInfo');
  };

  const contextValue = {
    hasHostel,
    hostelInfo,
    createHostel,
    updateHostel,
    deleteHostel,
    refreshHostelData,
    fetchHostelData
  };

  return (
    <HostelContext.Provider value={contextValue}>
      {children}
    </HostelContext.Provider>
  );
};
