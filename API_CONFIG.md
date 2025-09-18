# 🔧 API Configuration

## Overview
All API endpoints are centralized in `/src/config/api.js` for easy management and deployment.

## Current Configuration
- **All Environments**: Uses relative paths starting with `/hq/api/`
- **All Endpoints**: Prefixed with `/hq/api/` for deployment flexibility

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

## How API URLs Work

### Relative Paths
All API endpoints now use relative paths starting with `/hq/api/`. This means:
- ✅ **Deployment flexible** - works with any domain automatically
- ✅ **No hardcoded URLs** - adapts to current domain
- ✅ **Production ready** - same code works in all environments
- ✅ **Proxy friendly** - works with reverse proxies and load balancers

### Examples
- Login: `/hq/api/login/`
- Tenants: `/hq/api/manager/tenants`
- Hostel: `/hq/api/manager/hostel/`

## Files Updated
The following files now use the centralized API configuration:

- ✅ `src/components/SettingsTabs/BankingDetailsTab.jsx`
- ✅ `src/contexts/HostelContext.jsx`
- ✅ `src/pages/Tenants/Tenants.jsx`
- ✅ `src/pages/Tenants/TenantProfile.jsx`
- ✅ `src/pages/Login/LoginForms.jsx`

## Benefits
- 🎯 **Single Source of Truth** - All API URLs in one place
- 🚀 **Zero Configuration Deployment** - Works with any domain automatically
- 🔧 **Maintainable** - No more hunting for hardcoded URLs
- 📝 **Documented** - Clear list of all available endpoints
- 🌐 **Environment Agnostic** - Same code works everywhere
- 🔄 **Proxy Compatible** - Works with reverse proxies and load balancers

## Production Deployment
1. Deploy your frontend to any domain
2. Ensure your backend API is available at the same domain
3. That's it! No configuration needed
4. Build your React app: `npm run build`
5. Deploy the built files to your hosting service

## Example URLs by Environment
```javascript
// All environments use the same relative paths:
// Development: http://localhost:3000/hq/api/login/
// Staging: https://staging.yourhostel.com/hq/api/login/
// Production: https://yourhostel.com/hq/api/login/

// No configuration needed - works automatically!
```

## Development Setup
For local development, you may need to configure a proxy in your Vite config:

```javascript
// vite.config.js
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    proxy: {
      '/hq/api': {
        target: 'http://localhost:8000',
        changeOrigin: true,
        secure: false
      }
    }
  }
})
```
