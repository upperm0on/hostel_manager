# 🔧 API Configuration

## Overview
All API endpoints are centralized in `/src/config/api.js` for easy management and deployment.

## Current Configuration
- **Development**: `http://localhost:8080`
- **Production**: Change `API_BASE_URL` in `/src/config/api.js`

## Available Endpoints

### Authentication
- `LOGIN` - User login
- `LOGOUT` - User logout

### Hostel Management
- `HOSTEL_CREATE` - Create/update hostel
- `HOSTEL_GET` - Get hostel details
- `HOSTEL_UPDATE` - Update hostel details

### Banking
- `BANKS_LIST` - Get list of banks
- `BANKING_CREATE` - Create banking account

### Tenants
- `TENANTS_LIST` - Get list of tenants
- `TENANT_DETAIL` - Get specific tenant details

### Payments (Future)
- `PAYMENTS_LIST` - Get payment history
- `PAYMENT_CREATE` - Create payment record

### Analytics (Future)
- `ANALYTICS_DATA` - Get analytics data

## How to Change API URL

### Method 1: Manual Edit
1. Open `/src/config/api.js`
2. Change `API_BASE_URL` to your production URL:
   ```javascript
   const API_BASE_URL = 'https://api.yourhostel.com';
   ```

### Method 2: Using Script
```bash
# Update to production URL
node scripts/update-api-url.js https://api.yourhostel.com

# Update to staging URL
node scripts/update-api-url.js https://staging-api.yourhostel.com

# Update back to localhost
node scripts/update-api-url.js http://localhost:8080
```

## Files Updated
The following files now use the centralized API configuration:

- ✅ `src/components/SettingsTabs/BankingDetailsTab.jsx`
- ✅ `src/contexts/HostelContext.jsx`
- ✅ `src/pages/Tenants/Tenants.jsx`
- ✅ `src/pages/Tenants/TenantProfile.jsx`
- ✅ `src/pages/Login/LoginForms.jsx`

## Benefits
- 🎯 **Single Source of Truth** - All API URLs in one place
- 🚀 **Easy Deployment** - Change one variable for production
- 🔧 **Maintainable** - No more hunting for hardcoded URLs
- 📝 **Documented** - Clear list of all available endpoints
- 🛠️ **Automated** - Script to update URLs quickly

## Production Deployment
1. Run the update script with your production API URL
2. Build your React app: `npm run build`
3. Deploy the built files to your hosting service

## Example Production URLs
```javascript
// Production
const API_BASE_URL = 'https://api.yourhostel.com';

// Staging
const API_BASE_URL = 'https://staging-api.yourhostel.com';

// Development
const API_BASE_URL = 'http://localhost:8080';
```
