// API Configuration
// Change this URL when deploying to production
const API_BASE_URL = 'http://localhost:8080';

// API Endpoints
export const API_ENDPOINTS = {
  // Authentication
  LOGIN: `${API_BASE_URL}/hq/api/login/`,
  LOGOUT: `${API_BASE_URL}/hq/api/manager/logout/`,
  
  // Hostel Management
  HOSTEL_CREATE: `${API_BASE_URL}/hq/api/manager/update_or_create/`,
  HOSTEL_GET: `${API_BASE_URL}/hq/api/manager/hostel/`,
  HOSTEL_UPDATE: `${API_BASE_URL}/hq/api/manager/update_or_create/`,
  
  // Banking
  BANKS_LIST: `${API_BASE_URL}/hq/api/manager/banks/`,
  BANKING_CREATE: `${API_BASE_URL}/hq/api/manager/banks/`,
  
  // Tenants
  TENANTS_LIST: `${API_BASE_URL}/hq/api/manager/tenants`,
  TENANT_DETAIL: `${API_BASE_URL}/hq/api/manager/tenants/`,
  
  // Payments (when you add them)
  PAYMENTS_LIST: `${API_BASE_URL}/hq/api/manager/payments`,
  PAYMENT_CREATE: `${API_BASE_URL}/hq/api/manager/payments/`,
  
  // Analytics (when you add them)
  ANALYTICS_DATA: `${API_BASE_URL}/hq/api/manager/analytics/`,
};

// Helper function to get full URL
export const getApiUrl = (endpoint) => {
  return `${API_BASE_URL}${endpoint}`;
};

// Default export for easy access
export default API_ENDPOINTS;
