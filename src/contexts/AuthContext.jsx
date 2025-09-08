import React, { createContext, useContext, useState, useEffect } from 'react';
import { API_ENDPOINTS } from '../config/api';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is already logged in
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('userData');
    
    if (token && userData) {
      try {
        const parsedUserData = JSON.parse(userData);
        setIsAuthenticated(true);
        setUser(parsedUserData);
      } catch (e) {
        console.error('Error parsing stored user data:', e);
        // Clear corrupted data
        localStorage.removeItem('token');
        localStorage.removeItem('userData');
        localStorage.removeItem('hostelInfo');
      }
    }
    
    setLoading(false);
  }, []);

  const login = async (loginResponse) => {
    // Save token
    localStorage.setItem('token', loginResponse.token);
    
    // Save user data
    const userData = {
      username: loginResponse.username,
      is_manager: loginResponse.is_manager,
      token: loginResponse.token
    };
    localStorage.setItem('userData', JSON.stringify(userData));
    
    // Check for hostel data BEFORE setting authentication state
    try {
      console.log('Checking for hostel data after login...');
      console.log('Using endpoint:', API_ENDPOINTS.HOSTEL_UPDATE);
      console.log('Token:', loginResponse.token);
      
      // Try the update_or_create endpoint with GET first (this is what works)
      let response = await fetch(API_ENDPOINTS.HOSTEL_UPDATE, {
        method: 'GET',
        headers: {
          'Authorization': `Token ${loginResponse.token}`,
          'Content-Type': 'application/json',
        }
      });

      console.log('Response status:', response.status);
      console.log('Response ok:', response.ok);

      // If that doesn't work, try the dedicated hostel endpoint
      if (!response.ok) {
        console.log('First request failed, trying alternative endpoint...');
        response = await fetch(API_ENDPOINTS.HOSTEL_GET, {
          method: 'GET',
          headers: {
            'Authorization': `Token ${loginResponse.token}`,
            'Content-Type': 'application/json',
          }
        });
        console.log('Second response status:', response.status);
        console.log('Second response ok:', response.ok);
      }

      if (response.ok) {
        const data = await response.json();
        console.log('Raw response data:', data);
        console.log('Response status field:', data.status);
        console.log('Response hostel field:', data.hostel);
        
        if (data.status === 'success' && data.hostel) {
          console.log('Hostel data found, processing...');
          // Parse additional_details and room_details if they're strings
          const processedHostelData = { ...data.hostel };
          if (processedHostelData.additional_details && typeof processedHostelData.additional_details === 'string') {
            processedHostelData.additional_details = JSON.parse(processedHostelData.additional_details);
          }
          if (processedHostelData.room_details && typeof processedHostelData.room_details === 'string') {
            processedHostelData.room_details = JSON.parse(processedHostelData.room_details);
          }
          
          localStorage.setItem('hostelInfo', JSON.stringify(processedHostelData));
          console.log('Hostel data saved to localStorage:', processedHostelData);
        } else {
          console.log('No hostel data found in response - status:', data.status, 'hostel:', data.hostel);
          // Clear any existing hostel data
          localStorage.removeItem('hostelInfo');
        }
      } else {
        console.log('No hostel data found - response not ok, status:', response.status);
        // Clear any existing hostel data
        localStorage.removeItem('hostelInfo');
      }
    } catch (error) {
      console.error('Error checking for hostel data:', error);
      // Clear any existing hostel data on error
      localStorage.removeItem('hostelInfo');
    }
    
    // Set authentication state AFTER hostel check is complete
    setIsAuthenticated(true);
    setUser(userData);
  };

  const logout = () => {
    // Clear ALL localStorage data
    localStorage.clear();
    setIsAuthenticated(false);
    setUser(null);
  };

  const value = {
    isAuthenticated,
    user,
    loading,
    login,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
