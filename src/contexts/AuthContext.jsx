import React, { createContext, useContext, useState, useEffect } from 'react';

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

  const login = (loginResponse) => {
    // Save token
    localStorage.setItem('token', loginResponse.token);
    
    // Save user data
    const userData = {
      username: loginResponse.username,
      is_manager: loginResponse.is_manager,
      token: loginResponse.token
    };
    localStorage.setItem('userData', JSON.stringify(userData));
    
    // Save hostel data (only in hostelInfo - single source of truth)
    if (loginResponse.hostel) {
      // Parse additional_details and room_details if they're strings
      const processedHostelData = { ...loginResponse.hostel };
      if (processedHostelData.additional_details && typeof processedHostelData.additional_details === 'string') {
        processedHostelData.additional_details = JSON.parse(processedHostelData.additional_details);
      }
      if (processedHostelData.room_details && typeof processedHostelData.room_details === 'string') {
        processedHostelData.room_details = JSON.parse(processedHostelData.room_details);
      }
      
      localStorage.setItem('hostelInfo', JSON.stringify(processedHostelData));
    }
    
    setIsAuthenticated(true);
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userData');
    localStorage.removeItem('hostelInfo');
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
