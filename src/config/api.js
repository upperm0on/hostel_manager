// API Configuration
// All endpoints are now relative paths for better deployment flexibility

// API Endpoints
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
  
  // Payments (when you add them)
  PAYMENTS_LIST: '/hq/api/manager/payments',
  PAYMENT_CREATE: '/hq/api/manager/payments/',
  
  // Analytics (when you add them)
  ANALYTICS_DATA: '/hq/api/manager/analytics/',
};

// Helper function to get full URL (now just returns the endpoint as it's already relative)
export const getApiUrl = (endpoint) => {
  return endpoint;
};

// Default export for easy access
export default API_ENDPOINTS;
