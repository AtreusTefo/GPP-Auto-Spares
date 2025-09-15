// Validation utilities for form inputs and data

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
  fieldErrors?: Record<string, string>;
}

export interface FieldValidationResult {
  isValid: boolean;
  error?: string;
}

// Email validation
export const validateEmail = (email: string): FieldValidationResult => {
  if (!email) {
    return { isValid: false, error: 'Email is required' };
  }
  
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return { isValid: false, error: 'Please enter a valid email address' };
  }
  
  return { isValid: true };
};

// Password validation
export const validatePassword = (password: string): FieldValidationResult => {
  if (!password) {
    return { isValid: false, error: 'Password is required' };
  }
  
  if (password.length < 8) {
    return { isValid: false, error: 'Password must be at least 8 characters long' };
  }
  
  if (!/(?=.*[a-z])/.test(password)) {
    return { isValid: false, error: 'Password must contain at least one lowercase letter' };
  }
  
  if (!/(?=.*[A-Z])/.test(password)) {
    return { isValid: false, error: 'Password must contain at least one uppercase letter' };
  }
  
  if (!/(?=.*\d)/.test(password)) {
    return { isValid: false, error: 'Password must contain at least one number' };
  }
  
  return { isValid: true };
};

// Name validation
export const validateName = (name: string): FieldValidationResult => {
  if (!name) {
    return { isValid: false, error: 'Name is required' };
  }
  
  if (name.trim().length < 2) {
    return { isValid: false, error: 'Name must be at least 2 characters long' };
  }
  
  if (name.trim().length > 50) {
    return { isValid: false, error: 'Name must be less than 50 characters' };
  }
  
  const nameRegex = /^[a-zA-Z\s'-]+$/;
  if (!nameRegex.test(name)) {
    return { isValid: false, error: 'Name can only contain letters, spaces, hyphens, and apostrophes' };
  }
  
  return { isValid: true };
};

// Phone validation
export const validatePhone = (phone: string): FieldValidationResult => {
  if (!phone) {
    return { isValid: true }; // Phone is optional
  }
  
  // Remove all non-digit characters for validation
  const digitsOnly = phone.replace(/\D/g, '');
  
  if (digitsOnly.length < 10 || digitsOnly.length > 15) {
    return { isValid: false, error: 'Phone number must be between 10 and 15 digits' };
  }
  
  return { isValid: true };
};

// File validation for image uploads
export const validateImageFile = (file: File): FieldValidationResult => {
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
  const maxSize = 5 * 1024 * 1024; // 5MB
  
  if (!allowedTypes.includes(file.type)) {
    return { 
      isValid: false, 
      error: 'Please select a valid image file (JPEG, PNG, GIF, or WebP)' 
    };
  }
  
  if (file.size > maxSize) {
    return { 
      isValid: false, 
      error: 'Image file size must be less than 5MB' 
    };
  }
  
  return { isValid: true };
};

// Profile form validation
export const validateProfileForm = (formData: {
  name: string;
  email: string;
  phone?: string;
  address?: string;
  city?: string;
  country?: string;
}): ValidationResult => {
  const errors: string[] = [];
  const fieldErrors: Record<string, string> = {};
  
  const nameValidation = validateName(formData.name);
  if (!nameValidation.isValid && nameValidation.error) {
    errors.push(nameValidation.error);
    fieldErrors.name = nameValidation.error;
  }
  
  const emailValidation = validateEmail(formData.email);
  if (!emailValidation.isValid && emailValidation.error) {
    errors.push(emailValidation.error);
    fieldErrors.email = emailValidation.error;
  }
  
  if (formData.phone) {
    const phoneValidation = validatePhone(formData.phone);
    if (!phoneValidation.isValid && phoneValidation.error) {
      errors.push(phoneValidation.error);
      fieldErrors.phone = phoneValidation.error;
    }
  }
  
  return {
    isValid: errors.length === 0,
    errors,
    fieldErrors: Object.keys(fieldErrors).length > 0 ? fieldErrors : undefined
  };
};

// Password change form validation
export const validatePasswordChangeForm = (formData: {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}): ValidationResult => {
  const errors: string[] = [];
  const fieldErrors: Record<string, string> = {};
  
  if (!formData.currentPassword) {
    errors.push('Current password is required');
    fieldErrors.currentPassword = 'Current password is required';
  }
  
  const newPasswordValidation = validatePassword(formData.newPassword);
  if (!newPasswordValidation.isValid && newPasswordValidation.error) {
    errors.push(newPasswordValidation.error);
    fieldErrors.newPassword = newPasswordValidation.error;
  }
  
  if (formData.newPassword !== formData.confirmPassword) {
    errors.push('New password and confirmation do not match');
    fieldErrors.confirmPassword = 'New password and confirmation do not match';
  }
  
  if (formData.currentPassword === formData.newPassword) {
    errors.push('New password must be different from current password');
    fieldErrors.newPassword = 'New password must be different from current password';
  }
  
  return {
    isValid: errors.length === 0,
    errors,
    fieldErrors: Object.keys(fieldErrors).length > 0 ? fieldErrors : undefined
  };
};

// Sanitize input to prevent XSS
export const sanitizeInput = (input: string): string => {
  return input
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');
};

// Validate and sanitize form data
export const sanitizeFormData = <T extends Record<string, any>>(data: T): T => {
  const sanitized = { ...data } as T;
  
  Object.keys(sanitized).forEach(key => {
    if (typeof sanitized[key] === 'string') {
      (sanitized as any)[key] = sanitizeInput(sanitized[key].trim());
    }
  });
  
  return sanitized;
};

// Rate limiting helper for client-side
export class ClientRateLimit {
  private attempts: Map<string, { count: number; resetTime: number }> = new Map();
  
  constructor(private maxAttempts: number = 5, private windowMs: number = 15 * 60 * 1000) {}
  
  canAttempt(key: string): boolean {
    const now = Date.now();
    const attempt = this.attempts.get(key);
    
    if (!attempt || now > attempt.resetTime) {
      this.attempts.set(key, { count: 1, resetTime: now + this.windowMs });
      return true;
    }
    
    if (attempt.count >= this.maxAttempts) {
      return false;
    }
    
    attempt.count++;
    return true;
  }
  
  getRemainingTime(key: string): number {
    const attempt = this.attempts.get(key);
    if (!attempt) return 0;
    
    return Math.max(0, attempt.resetTime - Date.now());
  }
  
  reset(key: string): void {
    this.attempts.delete(key);
  }
}

// Network error handling
export const handleNetworkError = (error: any): string => {
  if (!navigator.onLine) {
    return 'No internet connection. Please check your network and try again.';
  }
  
  if (error.name === 'AbortError') {
    return 'Request was cancelled. Please try again.';
  }
  
  if (error.code === 'NETWORK_ERROR' || error.message?.includes('fetch')) {
    return 'Network error occurred. Please check your connection and try again.';
  }
  
  if (error.status) {
    switch (error.status) {
      case 400:
        return 'Invalid request. Please check your input and try again.';
      case 401:
        return 'Authentication required. Please log in and try again.';
      case 403:
        return 'Access denied. You do not have permission to perform this action.';
      case 404:
        return 'The requested resource was not found.';
      case 429:
        return 'Too many requests. Please wait a moment and try again.';
      case 500:
        return 'Server error occurred. Please try again later.';
      case 503:
        return 'Service temporarily unavailable. Please try again later.';
      default:
        return `An error occurred (${error.status}). Please try again.`;
    }
  }
  
  return 'An unexpected error occurred. Please try again.';
};