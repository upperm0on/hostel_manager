/**
 * Email validation utilities
 */

/**
 * Comprehensive email validation regex
 * More strict than basic validation to ensure proper email format
 */
const EMAIL_REGEX = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;

/**
 * Basic email validation regex (less strict)
 */
const BASIC_EMAIL_REGEX = /\S+@\S+\.\S+/;

/**
 * Validate email format
 * @param {string} email - Email to validate
 * @param {boolean} strict - Whether to use strict validation (default: true)
 * @returns {object} - Validation result with isValid and error message
 */
export const validateEmailFormat = (email, strict = true) => {
  if (!email || typeof email !== 'string') {
    return { isValid: false, error: 'Email is required' };
  }

  const trimmedEmail = email.trim();
  
  if (trimmedEmail === '') {
    return { isValid: false, error: 'Email is required' };
  }

  if (trimmedEmail.length > 254) {
    return { isValid: false, error: 'Email is too long (maximum 254 characters)' };
  }

  const regex = strict ? EMAIL_REGEX : BASIC_EMAIL_REGEX;
  
  if (!regex.test(trimmedEmail)) {
    return { isValid: false, error: 'Please enter a valid email address' };
  }

  // Additional checks for strict validation
  if (strict) {
    const [localPart, domain] = trimmedEmail.split('@');
    
    // Check local part length
    if (localPart.length > 64) {
      return { isValid: false, error: 'Email username part is too long' };
    }
    
    // Check for consecutive dots
    if (localPart.includes('..') || domain.includes('..')) {
      return { isValid: false, error: 'Email cannot contain consecutive dots' };
    }
    
    // Check for leading/trailing dots
    if (localPart.startsWith('.') || localPart.endsWith('.') || 
        domain.startsWith('.') || domain.endsWith('.')) {
      return { isValid: false, error: 'Email cannot start or end with dots' };
    }
  }

  return { isValid: true, email: trimmedEmail };
};

/**
 * Check if email is unique among existing tenants
 * @param {string} email - Email to check
 * @param {array} existingTenants - Array of existing tenant objects
 * @param {string} excludeTenantId - ID of tenant to exclude from check (for editing)
 * @returns {Promise<object>} - Validation result with isValid and error message
 */
export const validateEmailUniqueness = async (email, existingTenants = [], excludeTenantId = null) => {
  const formatValidation = validateEmailFormat(email);
  if (!formatValidation.isValid) {
    return formatValidation;
  }

  const normalizedEmail = formatValidation.email.toLowerCase();
  
  // Check against existing tenants
  const duplicateTenant = existingTenants.find(tenant => {
    // Skip the tenant being edited
    if (excludeTenantId && tenant.id === excludeTenantId) {
      return false;
    }
    
    // Check both direct email and nested user email
    const tenantEmail = (tenant.email || tenant.user?.email || '').toLowerCase();
    return tenantEmail === normalizedEmail;
  });

  if (duplicateTenant) {
    return { 
      isValid: false, 
      error: 'This email address is already registered to another tenant' 
    };
  }

  return { isValid: true, email: normalizedEmail };
};

/**
 * Validate email with both format and uniqueness checks
 * @param {string} email - Email to validate
 * @param {array} existingTenants - Array of existing tenant objects
 * @param {string} excludeTenantId - ID of tenant to exclude from uniqueness check
 * @param {boolean} strict - Whether to use strict format validation
 * @returns {Promise<object>} - Validation result with isValid and error message
 */
export const validateEmail = async (email, existingTenants = [], excludeTenantId = null, strict = true) => {
  // First check format
  const formatValidation = validateEmailFormat(email, strict);
  if (!formatValidation.isValid) {
    return formatValidation;
  }

  // Then check uniqueness
  return await validateEmailUniqueness(email, existingTenants, excludeTenantId);
};

/**
 * Real-time email validation for form inputs
 * @param {string} email - Email to validate
 * @param {array} existingTenants - Array of existing tenant objects
 * @param {string} excludeTenantId - ID of tenant to exclude from uniqueness check
 * @returns {Promise<object>} - Validation result with isValid, error, and isChecking
 */
export const validateEmailRealTime = async (email, existingTenants = [], excludeTenantId = null) => {
  // Quick format check first
  const formatValidation = validateEmailFormat(email);
  if (!formatValidation.isValid) {
    return { ...formatValidation, isChecking: false };
  }

  // If format is valid, check uniqueness
  const uniquenessValidation = await validateEmailUniqueness(email, existingTenants, excludeTenantId);
  return { ...uniquenessValidation, isChecking: false };
};

/**
 * Get email validation error message for display
 * @param {string} email - Email to validate
 * @param {array} existingTenants - Array of existing tenant objects
 * @param {string} excludeTenantId - ID of tenant to exclude from uniqueness check
 * @returns {Promise<string>} - Error message or empty string if valid
 */
export const getEmailValidationError = async (email, existingTenants = [], excludeTenantId = null) => {
  const validation = await validateEmail(email, existingTenants, excludeTenantId);
  return validation.isValid ? '' : validation.error;
};

/**
 * Check if email domain is from a common provider
 * @param {string} email - Email to check
 * @returns {object} - Result with isCommon and provider name
 */
export const getEmailProvider = (email) => {
  const commonProviders = [
    'gmail.com', 'yahoo.com', 'hotmail.com', 'outlook.com', 'aol.com',
    'icloud.com', 'protonmail.com', 'yandex.com', 'mail.com', 'zoho.com'
  ];

  const domain = email.split('@')[1]?.toLowerCase();
  
  if (!domain) {
    return { isCommon: false, provider: null };
  }

  const provider = commonProviders.find(p => domain === p || domain.endsWith(`.${p}`));
  
  return {
    isCommon: !!provider,
    provider: provider || domain
  };
};

/**
 * Sanitize email input
 * @param {string} email - Email to sanitize
 * @returns {string} - Sanitized email
 */
export const sanitizeEmail = (email) => {
  if (!email || typeof email !== 'string') {
    return '';
  }
  
  return email.trim().toLowerCase();
};
