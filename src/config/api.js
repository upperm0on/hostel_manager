// API Configuration
// Using relative endpoints for better deployment flexibility

// API Endpoints - All relative paths
export const API_ENDPOINTS = {
  // Authentication
  LOGIN: '/hq/api/login/',
  LOGOUT: '/hq/api/manager/logout/',
  
  // Hostel Management
  HOSTEL_CREATE: '/hq/api/manager/update_or_create/',
  HOSTEL_GET: '/hq/api/manager/hostel/',
  HOSTEL_UPDATE: '/hq/api/manager/update_or_create/',
  
  // Banking
  BANKS_LIST: '/hq/api/manager/banks/',
  BANKING_CREATE: '/hq/api/manager/banks/',
  
  // Tenants
  TENANTS_LIST: '/hq/api/manager/tenants',
  TENANT_DETAIL: '/hq/api/manager/tenants/',
  
  // Payments
  PAYMENTS_LIST: '/hq/api/manager/payments',
  PAYMENT_CREATE: '/hq/api/manager/payments/',
  
  // Analytics
  ANALYTICS_DATA: '/hq/api/manager/analytics/',
  
  // Campus Search
  CAMPUS_SEARCH: '/hq/api/search_request/',
};

// Helper function to get API URL
export const getApiUrl = (endpoint) => {
  // If endpoint is already absolute, return as-is
  if (endpoint.startsWith('http://') || endpoint.startsWith('https://')) {
    return endpoint;
  }
  // Return relative endpoint as-is (browser will resolve relative to current domain)
  return endpoint;
};

// Default export for easy access
export default API_ENDPOINTS;
