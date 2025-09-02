import React, { createContext, useContext, useState, useEffect } from 'react';

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

  // Check if hostel exists (in real app, this would check backend)
  useEffect(() => {
    // Simulate checking if hostel exists
    const checkHostelExists = () => {
      // For demo purposes, we'll assume no hostel exists initially
      // In a real app, this would be an API call
      const existingHostel = localStorage.getItem('hostelInfo');
      if (existingHostel) {
        try {
          const parsed = JSON.parse(existingHostel);
          setHostelInfo(parsed);
          setHasHostel(true);
        } catch (e) {
          setHasHostel(false);
        }
      } else {
        setHasHostel(false);
      }
    };
    
    checkHostelExists();
  }, []);

  const createHostel = (hostelData) => {
    setHostelInfo(hostelData);
    setHasHostel(true);
    localStorage.setItem('hostelInfo', JSON.stringify(hostelData));
  };

  const updateHostel = (updatedData) => {
    const newData = { ...hostelInfo, ...updatedData };
    setHostelInfo(newData);
    localStorage.setItem('hostelInfo', JSON.stringify(newData));
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
    deleteHostel
  };

  return (
    <HostelContext.Provider value={contextValue}>
      {children}
    </HostelContext.Provider>
  );
};
