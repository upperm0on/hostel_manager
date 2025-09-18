#!/usr/bin/env node

/**
 * Script to update API URL for production deployment
 * Usage: node scripts/update-api-url.js <new-api-url>
 * Example: node scripts/update-api-url.js https://api.yourhostel.com
 */

const fs = require('fs');
const path = require('path');

// Get the new API URL from command line arguments
const newApiUrl = process.argv[2];

if (!newApiUrl) {
  console.error('❌ Please provide the new API URL');
  console.log('Usage: node scripts/update-api-url.js <new-api-url>');
  console.log('Example: node scripts/update-api-url.js https://api.yourhostel.com');
  process.exit(1);
}

// Validate URL format
try {
  new URL(newApiUrl);
} catch (error) {
  console.error('❌ Invalid URL format:', newApiUrl);
  process.exit(1);
}

// Path to the API config file
const apiConfigPath = path.join(__dirname, '..', 'src', 'config', 'api.js');

try {
  // Read the current API config
  let apiConfig = fs.readFileSync(apiConfigPath, 'utf8');
  
  // Replace the BASE_URL
  const updatedConfig = apiConfig.replace(
    /const BASE_URL = '[^']*';/,
    `const BASE_URL = '${newApiUrl}';`
  );
  
  // Write the updated config
  fs.writeFileSync(apiConfigPath, updatedConfig);
  
  console.log('✅ API URL updated successfully!');
  console.log(`📡 New API URL: ${newApiUrl}`);
  console.log('🚀 Ready for production deployment!');
  
} catch (error) {
  console.error('❌ Error updating API URL:', error.message);
  process.exit(1);
}
