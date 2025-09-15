import { RequestHandler } from 'express';
import { authenticate, requireVerified, validateProfileUpdate, validatePasswordChange, rateLimit } from '../middleware/auth';

// Mock user profile data - In production, this would come from a database
const mockProfiles = new Map([
  ['1', {
    id: '1',
    name: 'John Doe',
    email: 'john.doe@example.com',
    phone: '+27 123 456 789',
    address: '123 Main Street',
    city: 'Cape Town',
    country: 'South Africa',
    profilePicture: '',
    joinedDate: '2024-01-15',
    lastLogin: '2024-01-20T10:30:00Z'
  }]
]);

// Mock activity logs
const mockActivityLogs = [
  {
    id: '1',
    action: 'Profile Updated',
    timestamp: '2024-01-20T10:30:00Z',
    details: 'Updated personal information'
  },
  {
    id: '2',
    action: 'Password Changed',
    timestamp: '2024-01-19T14:15:00Z',
    details: 'Password successfully changed'
  },
  {
    id: '3',
    action: 'Login',
    timestamp: '2024-01-18T09:00:00Z',
    details: 'Logged in from Cape Town, South Africa'
  }
];

// Mock account settings
const mockSettings = new Map([
  ['1', {
    emailNotifications: true,
    smsNotifications: false,
    marketingEmails: true,
    twoFactorAuth: false
  }]
]);

// Get user profile
export const getProfile: RequestHandler = (req, res) => {
  try {
    const userId = req.headers['x-user-id'] as string || '1';
    const profile = mockProfiles.get(userId);
    
    if (!profile) {
      return res.status(404).json({ error: 'Profile not found' });
    }
    
    res.json(profile);
  } catch (error) {
    console.error('Error fetching profile:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Update user profile
export const updateProfile: RequestHandler = (req, res) => {
  try {
    const userId = req.headers['x-user-id'] as string || '1';
    const profile = mockProfiles.get(userId);
    
    if (!profile) {
      return res.status(404).json({ error: 'Profile not found' });
    }
    
    const updatedProfile = {
      ...profile,
      ...req.body,
      id: userId, // Ensure ID cannot be changed
      lastLogin: new Date().toISOString()
    };
    
    mockProfiles.set(userId, updatedProfile);
    
    // Add activity log
    mockActivityLogs.unshift({
      id: Date.now().toString(),
      action: 'Profile Updated',
      timestamp: new Date().toISOString(),
      details: 'Updated personal information'
    });
    
    res.json(updatedProfile);
  } catch (error) {
    console.error('Error updating profile:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Upload profile picture
export const uploadProfilePicture: RequestHandler = (req, res) => {
  try {
    const userId = req.headers['x-user-id'] as string || '1';
    const profile = mockProfiles.get(userId);
    
    if (!profile) {
      return res.status(404).json({ error: 'Profile not found' });
    }
    
    // In production, handle actual file upload to cloud storage
    // For now, simulate successful upload
    const mockImageUrl = `/uploads/profile-${userId}-${Date.now()}.jpg`;
    
    const updatedProfile = {
      ...profile,
      profilePicture: mockImageUrl
    };
    
    mockProfiles.set(userId, updatedProfile);
    
    // Add activity log
    mockActivityLogs.unshift({
      id: Date.now().toString(),
      action: 'Profile Picture Updated',
      timestamp: new Date().toISOString(),
      details: 'Updated profile picture'
    });
    
    res.json({ url: mockImageUrl, profile: updatedProfile });
  } catch (error) {
    console.error('Error uploading profile picture:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Change password
export const changePassword: RequestHandler = (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ error: 'Current password and new password are required' });
    }
    
    if (newPassword.length < 8) {
      return res.status(400).json({ error: 'New password must be at least 8 characters long' });
    }
    
    // In production, verify current password against hashed password in database
    // For now, simulate successful password change
    
    // Add activity log
    mockActivityLogs.unshift({
      id: Date.now().toString(),
      action: 'Password Changed',
      timestamp: new Date().toISOString(),
      details: 'Password successfully changed'
    });
    
    res.json({ message: 'Password changed successfully' });
  } catch (error) {
    console.error('Error changing password:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Get account settings
export const getSettings: RequestHandler = (req, res) => {
  try {
    const userId = req.headers['x-user-id'] as string || '1';
    const settings = mockSettings.get(userId);
    
    if (!settings) {
      return res.status(404).json({ error: 'Settings not found' });
    }
    
    res.json(settings);
  } catch (error) {
    console.error('Error fetching settings:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Update account settings
export const updateSettings: RequestHandler = (req, res) => {
  try {
    const userId = req.headers['x-user-id'] as string || '1';
    const currentSettings = mockSettings.get(userId);
    
    if (!currentSettings) {
      return res.status(404).json({ error: 'Settings not found' });
    }
    
    const updatedSettings = {
      ...currentSettings,
      ...req.body
    };
    
    mockSettings.set(userId, updatedSettings);
    
    // Add activity log
    mockActivityLogs.unshift({
      id: Date.now().toString(),
      action: 'Settings Updated',
      timestamp: new Date().toISOString(),
      details: 'Updated account settings'
    });
    
    res.json(updatedSettings);
  } catch (error) {
    console.error('Error updating settings:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Get activity logs
export const getActivityLogs: RequestHandler = (req, res) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    
    const paginatedLogs = mockActivityLogs.slice(startIndex, endIndex);
    
    res.json({
      logs: paginatedLogs,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(mockActivityLogs.length / limit),
        totalItems: mockActivityLogs.length,
        hasNext: endIndex < mockActivityLogs.length,
        hasPrev: page > 1
      }
    });
  } catch (error) {
    console.error('Error fetching activity logs:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Delete account
export const deleteAccount: RequestHandler = (req, res) => {
  try {
    const userId = req.headers['x-user-id'] as string || '1';
    const { confirmPassword } = req.body;
    
    if (!confirmPassword) {
      return res.status(400).json({ error: 'Password confirmation is required' });
    }
    
    // In production, verify password and perform actual account deletion
    // For now, simulate successful deletion
    
    mockProfiles.delete(userId);
    mockSettings.delete(userId);
    
    res.json({ message: 'Account deleted successfully' });
  } catch (error) {
    console.error('Error deleting account:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};