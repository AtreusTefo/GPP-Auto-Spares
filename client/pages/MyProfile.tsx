import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  User,
  Camera,
  Edit3,
  Save,
  X,
  Settings,
  Activity,
  Trash2,
  Eye,
  EyeOff,
  Upload,
  AlertTriangle,
  Check,
  Clock,
  Shield
} from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { Button } from '../components/ui/button';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../hooks/use-toast';
import { 
  validateProfileForm, 
  validatePasswordChangeForm, 
  validateImageFile, 
  sanitizeFormData, 
  handleNetworkError,
  ClientRateLimit 
} from '../lib/validation';

interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone?: string;
  address?: string;
  city?: string;
  country?: string;
  profilePicture?: string;
  joinedDate: string;
  lastLogin: string;
}

interface ActivityLog {
  id: string;
  action: string;
  timestamp: string;
  details: string;
  ipAddress?: string;
}

interface AccountSettings {
  emailNotifications: boolean;
  smsNotifications: boolean;
  marketingEmails: boolean;
  twoFactorAuth: boolean;
}

const MyProfile: React.FC = () => {
  const { user, logout } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Rate limiting instances
  const profileUpdateRateLimit = useRef(new ClientRateLimit(5, 60000)); // 5 attempts per minute
  const passwordChangeRateLimit = useRef(new ClientRateLimit(3, 300000)); // 3 attempts per 5 minutes
  const imageUploadRateLimit = useRef(new ClientRateLimit(10, 60000)); // 10 uploads per minute

  // State management
  const [activeTab, setActiveTab] = useState<'profile' | 'settings' | 'activity' | 'security'>('profile');
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showPasswordChange, setShowPasswordChange] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  
  // Profile data
  const [profile, setProfile] = useState<UserProfile>({
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
  });

  // Form data for editing
  const [editForm, setEditForm] = useState(profile);
  
  // Password change form
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  
  // Account settings
  const [settings, setSettings] = useState<AccountSettings>({
    emailNotifications: true,
    smsNotifications: false,
    marketingEmails: true,
    twoFactorAuth: false
  });
  
  // Activity logs
  const [activityLogs, setActivityLogs] = useState<any[]>([]);
  const [activityPagination, setActivityPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    hasNext: false,
    hasPrev: false
  });

  // Error states
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false
  });

  useEffect(() => {
    // Load user profile data
    loadProfileData();
    loadSettings();
  }, []);

  // Load activity logs when activity tab is selected
  useEffect(() => {
    if (activeTab === 'activity') {
      loadActivityLogs();
    }
  }, [activeTab]);

  const loadProfileData = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/profile', {
        headers: {
          'x-user-id': user?.id || '1',
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user?.token || ''}`
        }
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to fetch profile');
      }
      
      const data = await response.json();
      setProfile(data);
      setEditForm(data);
    } catch (error) {
      console.error('Failed to load profile:', error);
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to load profile data',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const loadSettings = async () => {
    try {
      const response = await fetch('/api/profile/settings', {
        headers: {
          'x-user-id': user?.id || '1',
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user?.token || ''}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setSettings(data);
      } else {
        const errorData = await response.json();
        toast({
          title: 'Error',
          description: errorData.error || 'Failed to load settings',
          variant: 'destructive'
        });
      }
    } catch (error) {
      console.error('Failed to load settings:', error);
      toast({
        title: 'Error',
        description: 'Network error while loading settings',
        variant: 'destructive'
      });
    }
  };

  const loadActivityLogs = async (page: number = 1) => {
    try {
      const response = await fetch(`/api/profile/activity?page=${page}&limit=10`, {
        headers: {
          'x-user-id': user?.id || '1',
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user?.token || ''}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setActivityLogs(data.logs);
        setActivityPagination(data.pagination);
      } else {
        const errorData = await response.json();
        toast({
          title: 'Error',
          description: errorData.error || 'Failed to load activity logs',
          variant: 'destructive'
        });
      }
    } catch (error) {
      console.error('Failed to load activity logs:', error);
      toast({
        title: 'Error',
        description: 'Network error while loading activity logs',
        variant: 'destructive'
      });
    }
  };

  const handleEditToggle = () => {
    if (isEditing) {
      setEditForm(profile);
      setErrors({});
    }
    setIsEditing(!isEditing);
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!editForm.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!editForm.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(editForm.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (editForm.phone && !/^\+?[1-9]\d{1,14}$/.test(editForm.phone.replace(/\s/g, ''))) {
      newErrors.phone = 'Please enter a valid phone number';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSaveProfile = async () => {
    // Rate limiting check
    if (!profileUpdateRateLimit.current.canAttempt('profile-update')) {
      const remainingTime = Math.ceil(profileUpdateRateLimit.current.getRemainingTime('profile-update') / 1000);
      toast({
        title: "Rate Limit Exceeded",
        description: `Too many update attempts. Please wait ${remainingTime} seconds.`,
        variant: "destructive"
      });
      return;
    }
    
    // Validate form data
    const validation = validateProfileForm(editForm);
    if (!validation.isValid) {
      toast({
        title: "Validation Error",
        description: validation.errors.join(', '),
        variant: "destructive"
      });
      return;
    }

    try {
      setLoading(true);
      
      // Sanitize form data
      const sanitizedData = sanitizeFormData(editForm);
      
      const response = await fetch('/api/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'x-user-id': user?.id || '1',
          'Authorization': `Bearer ${user?.token || ''}`
        },
        body: JSON.stringify(sanitizedData)
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update profile');
      }
      
      const updatedProfile = await response.json();
      setProfile(updatedProfile);
      setIsEditing(false);
      setErrors({});
      profileUpdateRateLimit.current.reset('profile-update');
      toast({
        title: 'Success',
        description: 'Profile updated successfully'
      });
    } catch (error) {
      console.error('Failed to update profile:', error);
      const errorMessage = handleNetworkError(error);
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Rate limiting check
    if (!imageUploadRateLimit.current.canAttempt('image-upload')) {
      const remainingTime = Math.ceil(imageUploadRateLimit.current.getRemainingTime('image-upload') / 1000);
      toast({
        title: "Rate Limit Exceeded",
        description: `Too many upload attempts. Please wait ${remainingTime} seconds.`,
        variant: "destructive"
      });
      return;
    }

    // Validate file using validation utility
    const validation = validateImageFile(file);
    if (!validation.isValid) {
      toast({
        title: "Invalid File",
        description: validation.error || 'Invalid file selected',
        variant: "destructive"
      });
      return;
    }

    setIsUploading(true);
    try {
      // Create preview URL
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);
      
      // Upload to server
      const formData = new FormData();
      formData.append('profilePicture', file);
      
      const response = await fetch('/api/profile/picture', {
        method: 'POST',
        headers: {
          'x-user-id': user?.id || '1',
          'Authorization': `Bearer ${user?.token || ''}`
        },
        body: formData
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to upload image');
      }
      
      const data = await response.json();
      
      // Update profile image
      setProfile(data.profile);
      setEditForm(data.profile);
      setImagePreview(null);
      imageUploadRateLimit.current.reset('image-upload');
      
      toast({
        title: 'Success',
        description: 'Profile picture updated successfully!'
      });
    } catch (error) {
      setImagePreview(null);
      const errorMessage = handleNetworkError(error);
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive'
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handlePasswordChange = async () => {
    // Rate limiting check
    if (!passwordChangeRateLimit.current.canAttempt('password-change')) {
      const remainingTime = Math.ceil(passwordChangeRateLimit.current.getRemainingTime('password-change') / 1000);
      toast({
        title: "Rate Limit Exceeded",
        description: `Too many password change attempts. Please wait ${remainingTime} seconds.`,
        variant: "destructive"
      });
      return;
    }

    // Validate password form
    const validation = validatePasswordChangeForm(passwordForm);
    if (!validation.isValid) {
      setErrors(validation.fieldErrors || {});
      toast({
        title: "Validation Error",
        description: validation.errors.join(', '),
        variant: "destructive"
      });
      return;
    }

    try {
      setLoading(true);
      const response = await fetch('/api/profile/change-password', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'x-user-id': user?.id || '1',
          'Authorization': `Bearer ${user?.token || ''}`
        },
        body: JSON.stringify({
          currentPassword: passwordForm.currentPassword,
          newPassword: passwordForm.newPassword
        })
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to change password');
      }
      
      setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
      setShowPasswordChange(false);
      setErrors({});
      passwordChangeRateLimit.current.reset('password-change');
      toast({
        title: 'Success',
        description: 'Password changed successfully'
      });
    } catch (error) {
      console.error('Failed to change password:', error);
      const errorMessage = handleNetworkError(error);
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSettingChange = async (setting: keyof AccountSettings, value: boolean) => {
    try {
      const newSettings = { ...settings, [setting]: value };
      setSettings(newSettings);
      
      const response = await fetch('/api/profile/settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'x-user-id': user?.id || '1',
          'Authorization': `Bearer ${user?.token || ''}`
        },
        body: JSON.stringify(newSettings)
      });
      
      if (!response.ok) {
        throw new Error('Failed to update settings');
      }
      
      toast({
        title: 'Success',
        description: 'Settings updated successfully'
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update settings',
        variant: 'destructive'
      });
    }
  };

  const handleDeleteAccount = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/profile', {
        method: 'DELETE',
        headers: {
          'x-user-id': user?.id || '1',
          'Authorization': `Bearer ${user?.token || ''}`
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to delete account');
      }
      
      logout();
      navigate('/');
      toast({
        title: 'Account Deleted',
        description: 'Your account has been permanently deleted'
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete account',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
      setShowDeleteModal(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'settings', label: 'Settings', icon: Settings },
    { id: 'activity', label: 'Activity', icon: Activity },
    { id: 'security', label: 'Security', icon: Shield }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 font-montserrat mb-2">
            My Profile
          </h1>
          <p className="text-gray-600 font-montserrat">
            Manage your account settings and preferences
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar Navigation */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex flex-col items-center mb-6">
                <div className="relative">
                  <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center overflow-hidden">
                    {(imagePreview || profile.profilePicture) ? (
                      <img
                        src={imagePreview || profile.profilePicture}
                        alt="Profile"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <User className="w-8 h-8 text-gray-400" />
                    )}
                  </div>
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="absolute -bottom-1 -right-1 bg-gpp-blue text-white rounded-full p-1.5 hover:bg-blue-600 transition-colors"
                    disabled={isUploading}
                  >
                    <Camera className="w-3 h-3" />
                  </button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/jpeg,image/jpg,image/png,image/webp"
                    onChange={handleImageUpload}
                    className="hidden"
                    disabled={isUploading}
                  />
                  {isUploading && (
                    <div className="absolute inset-0 bg-black bg-opacity-50 rounded-full flex items-center justify-center">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                    </div>
                  )}
                  {imagePreview && (
                    <div className="absolute -top-1 -left-1 bg-yellow-500 text-white text-xs px-1 py-0.5 rounded-full">
                      Preview
                    </div>
                  )}
                </div>
                <h3 className="font-semibold text-gray-900 font-montserrat mt-3">
                  {profile.name}
                </h3>
                <p className="text-sm text-gray-500 font-montserrat">
                  {profile.email}
                </p>
              </div>
              
              <nav className="space-y-2">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id as any)}
                      className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors font-montserrat ${
                        activeTab === tab.id
                          ? 'bg-gpp-blue text-white'
                          : 'text-gray-600 hover:bg-gray-100'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      <span>{tab.label}</span>
                    </button>
                  );
                })}
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              {/* Profile Tab */}
              {activeTab === 'profile' && (
                <div className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-semibold text-gray-900 font-montserrat">
                      Personal Information
                    </h2>
                    <Button
                      onClick={isEditing ? handleSaveProfile : handleEditToggle}
                      disabled={loading}
                      className="flex items-center space-x-2"
                    >
                      {isEditing ? (
                        <>
                          <Save className="w-4 h-4" />
                          <span>Save Changes</span>
                        </>
                      ) : (
                        <>
                          <Edit3 className="w-4 h-4" />
                          <span>Edit Profile</span>
                        </>
                      )}
                    </Button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2 font-montserrat">
                        Full Name
                      </label>
                      {isEditing ? (
                        <input
                          type="text"
                          value={editForm.name}
                          onChange={(e) => {
                            setEditForm(prev => ({ ...prev, name: e.target.value }));
                            // Clear error when user starts typing
                            if (errors.name) {
                              setErrors(prev => ({ ...prev, name: '' }));
                            }
                          }}
                          className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-gpp-blue focus:border-transparent font-montserrat ${
                            errors.name ? 'border-red-500' : 'border-gray-300'
                          }`}
                        />
                      ) : (
                        <p className="text-gray-900 font-montserrat">{profile.name}</p>
                      )}
                      {errors.name && (
                        <p className="text-red-500 text-sm mt-1 font-montserrat">{errors.name}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2 font-montserrat">
                        Email Address
                      </label>
                      {isEditing ? (
                        <input
                          type="email"
                          value={editForm.email}
                          onChange={(e) => {
                            setEditForm(prev => ({ ...prev, email: e.target.value }));
                            // Clear error when user starts typing
                            if (errors.email) {
                              setErrors(prev => ({ ...prev, email: '' }));
                            }
                          }}
                          className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-gpp-blue focus:border-transparent font-montserrat min-h-[48px] touch-manipulation text-base ${
                            errors.email ? 'border-red-500' : 'border-gray-300'
                          }`}
                        />
                      ) : (
                        <p className="text-gray-900 font-montserrat">{profile.email}</p>
                      )}
                      {errors.email && (
                        <p className="text-red-500 text-sm mt-1 font-montserrat">{errors.email}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2 font-montserrat">
                        Phone Number
                      </label>
                      {isEditing ? (
                        <input
                          type="tel"
                          value={editForm.phone || ''}
                          onChange={(e) => {
                            setEditForm(prev => ({ ...prev, phone: e.target.value }));
                            // Clear error when user starts typing
                            if (errors.phone) {
                              setErrors(prev => ({ ...prev, phone: '' }));
                            }
                          }}
                          className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-gpp-blue focus:border-transparent font-montserrat min-h-[48px] touch-manipulation text-base ${
                            errors.phone ? 'border-red-500' : 'border-gray-300'
                          }`}
                        />
                      ) : (
                        <p className="text-gray-900 font-montserrat">{profile.phone || 'Not provided'}</p>
                      )}
                      {errors.phone && (
                        <p className="text-red-500 text-sm mt-1 font-montserrat">{errors.phone}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2 font-montserrat">
                        Address
                      </label>
                      {isEditing ? (
                        <input
                          type="text"
                          value={editForm.address || ''}
                          onChange={(e) => setEditForm(prev => ({ ...prev, address: e.target.value }))}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gpp-blue focus:border-transparent font-montserrat min-h-[48px] touch-manipulation text-base"
                        />
                      ) : (
                        <p className="text-gray-900 font-montserrat">{profile.address || 'Not provided'}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2 font-montserrat">
                        City
                      </label>
                      {isEditing ? (
                        <input
                          type="text"
                          value={editForm.city || ''}
                          onChange={(e) => setEditForm(prev => ({ ...prev, city: e.target.value }))}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gpp-blue focus:border-transparent font-montserrat min-h-[48px] touch-manipulation text-base"
                        />
                      ) : (
                        <p className="text-gray-900 font-montserrat">{profile.city || 'Not provided'}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2 font-montserrat">
                        Country
                      </label>
                      {isEditing ? (
                        <input
                          type="text"
                          value={editForm.country || ''}
                          onChange={(e) => setEditForm(prev => ({ ...prev, country: e.target.value }))}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gpp-blue focus:border-transparent font-montserrat min-h-[48px] touch-manipulation text-base"
                        />
                      ) : (
                        <p className="text-gray-900 font-montserrat">{profile.country || 'Not provided'}</p>
                      )}
                    </div>
                  </div>

                  {isEditing && (
                    <div className="flex justify-end space-x-3 mt-6 pt-6 border-t border-gray-200">
                      <Button
                        variant="outline"
                        onClick={handleEditToggle}
                        disabled={loading}
                      >
                        Cancel
                      </Button>
                      <Button
                        onClick={handleSaveProfile}
                        disabled={loading}
                        className="flex items-center space-x-2"
                      >
                        <Save className="w-4 h-4" />
                        <span>Save Changes</span>
                      </Button>
                    </div>
                  )}

                  <div className="mt-8 pt-6 border-t border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-900 font-montserrat mb-4">
                      Account Information
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-gray-500 font-montserrat">Member Since</p>
                        <p className="text-gray-900 font-montserrat">{formatDate(profile.joinedDate)}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500 font-montserrat">Last Login</p>
                        <p className="text-gray-900 font-montserrat">{formatDate(profile.lastLogin)}</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Settings Tab */}
              {activeTab === 'settings' && (
                <div className="p-6">
                  <h2 className="text-xl font-semibold text-gray-900 font-montserrat mb-6">
                    Account Settings
                  </h2>

                  <div className="space-y-6">
                    <div className="flex items-center justify-between py-4 border-b border-gray-200">
                      <div>
                        <h3 className="text-sm font-medium text-gray-900 font-montserrat">
                          Email Notifications
                        </h3>
                        <p className="text-sm text-gray-500 font-montserrat">
                          Receive notifications about your orders and account activity
                        </p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={settings.emailNotifications}
                          onChange={(e) => handleSettingChange('emailNotifications', e.target.checked)}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gpp-blue"></div>
                      </label>
                    </div>

                    <div className="flex items-center justify-between py-4 border-b border-gray-200">
                      <div>
                        <h3 className="text-sm font-medium text-gray-900 font-montserrat">
                          SMS Notifications
                        </h3>
                        <p className="text-sm text-gray-500 font-montserrat">
                          Receive text messages for important updates
                        </p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={settings.smsNotifications}
                          onChange={(e) => handleSettingChange('smsNotifications', e.target.checked)}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gpp-blue"></div>
                      </label>
                    </div>

                    <div className="flex items-center justify-between py-4 border-b border-gray-200">
                      <div>
                        <h3 className="text-sm font-medium text-gray-900 font-montserrat">
                          Marketing Emails
                        </h3>
                        <p className="text-sm text-gray-500 font-montserrat">
                          Receive promotional offers and product updates
                        </p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={settings.marketingEmails}
                          onChange={(e) => handleSettingChange('marketingEmails', e.target.checked)}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gpp-blue"></div>
                      </label>
                    </div>

                    <div className="flex items-center justify-between py-4">
                      <div>
                        <h3 className="text-sm font-medium text-gray-900 font-montserrat">
                          Two-Factor Authentication
                        </h3>
                        <p className="text-sm text-gray-500 font-montserrat">
                          Add an extra layer of security to your account
                        </p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={settings.twoFactorAuth}
                          onChange={(e) => handleSettingChange('twoFactorAuth', e.target.checked)}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gpp-blue"></div>
                      </label>
                    </div>
                  </div>
                </div>
              )}

              {/* Activity Tab */}
              {activeTab === 'activity' && (
                <div className="p-6">
                  <h2 className="text-xl font-semibold text-gray-900 font-montserrat mb-6">
                    Account Activity
                  </h2>

                  <div className="space-y-4">
                    {activityLogs.length > 0 ? (
                      activityLogs.map((log) => (
                        <div key={log.id} className="flex items-start space-x-4 p-4 bg-gray-50 rounded-lg">
                          <div className="flex-shrink-0">
                            <div className="w-8 h-8 bg-gpp-blue rounded-full flex items-center justify-center">
                              <Clock className="w-4 h-4 text-white" />
                            </div>
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between">
                              <p className="text-sm font-medium text-gray-900 font-montserrat">
                                {log.action}
                              </p>
                              <p className="text-xs text-gray-500 font-montserrat">
                                {formatDate(log.timestamp)}
                              </p>
                            </div>
                            <p className="text-sm text-gray-600 font-montserrat mt-1">
                              {log.details}
                            </p>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-8">
                        <Clock className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-500 font-montserrat">No activity logs found</p>
                      </div>
                    )}
                  </div>
                  
                  {/* Pagination */}
                  {activityLogs.length > 0 && (
                    <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-200">
                      <div className="text-sm text-gray-500 font-montserrat">
                        Page {activityPagination.currentPage} of {activityPagination.totalPages}
                      </div>
                      <div className="flex space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => loadActivityLogs(activityPagination.currentPage - 1)}
                          disabled={!activityPagination.hasPrev}
                        >
                          Previous
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => loadActivityLogs(activityPagination.currentPage + 1)}
                          disabled={!activityPagination.hasNext}
                        >
                          Next
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Security Tab */}
              {activeTab === 'security' && (
                <div className="p-6">
                  <h2 className="text-xl font-semibold text-gray-900 font-montserrat mb-6">
                    Security Settings
                  </h2>

                  <div className="space-y-6">
                    {/* Password Change Section */}
                    <div className="border border-gray-200 rounded-lg p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <h3 className="text-lg font-medium text-gray-900 font-montserrat">
                            Change Password
                          </h3>
                          <p className="text-sm text-gray-500 font-montserrat">
                            Update your password to keep your account secure
                          </p>
                        </div>
                        <Button
                          onClick={() => setShowPasswordChange(!showPasswordChange)}
                          variant="outline"
                        >
                          {showPasswordChange ? 'Cancel' : 'Change Password'}
                        </Button>
                      </div>

                      {showPasswordChange && (
                        <div className="space-y-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2 font-montserrat">
                              Current Password
                            </label>
                            <div className="relative">
                              <input
                                type={showPasswords.current ? 'text' : 'password'}
                                value={passwordForm.currentPassword}
                                onChange={(e) => {
                                  setPasswordForm(prev => ({ ...prev, currentPassword: e.target.value }));
                                  // Clear error when user starts typing
                                  if (errors.currentPassword) {
                                    setErrors(prev => ({ ...prev, currentPassword: '' }));
                                  }
                                }}
                                className={`w-full px-4 py-3 pr-12 border rounded-lg focus:ring-2 focus:ring-gpp-blue focus:border-transparent font-montserrat min-h-[48px] touch-manipulation text-base ${
                                  errors.currentPassword ? 'border-red-500' : 'border-gray-300'
                                }`}
                              />
                              <button
                                type="button"
                                onClick={() => setShowPasswords(prev => ({ ...prev, current: !prev.current }))}
                                className="absolute inset-y-0 right-0 pr-3 flex items-center touch-manipulation min-w-[48px] min-h-[48px] justify-center"
                              >
                                {showPasswords.current ? (
                                  <EyeOff className="w-4 h-4 text-gray-400" />
                                ) : (
                                  <Eye className="w-4 h-4 text-gray-400" />
                                )}
                              </button>
                            </div>
                            {errors.currentPassword && (
                              <p className="text-red-500 text-sm mt-1 font-montserrat">{errors.currentPassword}</p>
                            )}
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2 font-montserrat">
                              New Password
                            </label>
                            <div className="relative">
                              <input
                                type={showPasswords.new ? 'text' : 'password'}
                                value={passwordForm.newPassword}
                                onChange={(e) => {
                                  setPasswordForm(prev => ({ ...prev, newPassword: e.target.value }));
                                  // Clear error when user starts typing
                                  if (errors.newPassword) {
                                    setErrors(prev => ({ ...prev, newPassword: '' }));
                                  }
                                }}
                                className={`w-full px-4 py-3 pr-12 border rounded-lg focus:ring-2 focus:ring-gpp-blue focus:border-transparent font-montserrat min-h-[48px] touch-manipulation text-base ${
                                  errors.newPassword ? 'border-red-500' : 'border-gray-300'
                                }`}
                              />
                              <button
                                type="button"
                                onClick={() => setShowPasswords(prev => ({ ...prev, new: !prev.new }))}
                                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                              >
                                {showPasswords.new ? (
                                  <EyeOff className="w-4 h-4 text-gray-400" />
                                ) : (
                                  <Eye className="w-4 h-4 text-gray-400" />
                                )}
                              </button>
                            </div>
                            {errors.newPassword && (
                              <p className="text-red-500 text-sm mt-1 font-montserrat">{errors.newPassword}</p>
                            )}
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2 font-montserrat">
                              Confirm New Password
                            </label>
                            <div className="relative">
                              <input
                                type={showPasswords.confirm ? 'text' : 'password'}
                                value={passwordForm.confirmPassword}
                                onChange={(e) => {
                                  setPasswordForm(prev => ({ ...prev, confirmPassword: e.target.value }));
                                  // Clear error when user starts typing
                                  if (errors.confirmPassword) {
                                    setErrors(prev => ({ ...prev, confirmPassword: '' }));
                                  }
                                }}
                                className={`w-full px-4 py-3 pr-12 border rounded-lg focus:ring-2 focus:ring-gpp-blue focus:border-transparent font-montserrat min-h-[48px] touch-manipulation text-base ${
                                  errors.confirmPassword ? 'border-red-500' : 'border-gray-300'
                                }`}
                              />
                              <button
                                type="button"
                                onClick={() => setShowPasswords(prev => ({ ...prev, confirm: !prev.confirm }))}
                                className="absolute inset-y-0 right-0 pr-3 flex items-center touch-manipulation min-w-[48px] min-h-[48px] justify-center"
                              >
                                {showPasswords.confirm ? (
                                  <EyeOff className="w-4 h-4 text-gray-400" />
                                ) : (
                                  <Eye className="w-4 h-4 text-gray-400" />
                                )}
                              </button>
                            </div>
                            {errors.confirmPassword && (
                              <p className="text-red-500 text-sm mt-1 font-montserrat">{errors.confirmPassword}</p>
                            )}
                          </div>

                          <div className="flex justify-end space-x-3">
                            <Button
                              variant="outline"
                              onClick={() => {
                                setShowPasswordChange(false);
                                setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
                                setErrors({});
                              }}
                            >
                              Cancel
                            </Button>
                            <Button
                              onClick={handlePasswordChange}
                              disabled={loading}
                              className="flex items-center space-x-2"
                            >
                              <Save className="w-4 h-4" />
                              <span>Update Password</span>
                            </Button>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Delete Account Section */}
                    <div className="border border-red-200 rounded-lg p-6 bg-red-50">
                      <div className="flex items-start space-x-3">
                        <AlertTriangle className="w-5 h-5 text-red-500 mt-0.5" />
                        <div className="flex-1">
                          <h3 className="text-lg font-medium text-red-900 font-montserrat">
                            Delete Account
                          </h3>
                          <p className="text-sm text-red-700 font-montserrat mt-1">
                            Once you delete your account, there is no going back. Please be certain.
                          </p>
                          <Button
                            variant="destructive"
                            onClick={() => setShowDeleteModal(true)}
                            className="mt-4 flex items-center space-x-2"
                          >
                            <Trash2 className="w-4 h-4" />
                            <span>Delete Account</span>
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Delete Account Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <div className="flex items-center space-x-3 mb-4">
              <AlertTriangle className="w-6 h-6 text-red-500" />
              <h3 className="text-lg font-semibold text-gray-900 font-montserrat">
                Delete Account
              </h3>
            </div>
            <p className="text-gray-600 font-montserrat mb-6">
              Are you sure you want to delete your account? This action cannot be undone and all your data will be permanently removed.
            </p>
            <div className="flex justify-end space-x-3">
              <Button
                variant="outline"
                onClick={() => setShowDeleteModal(false)}
                disabled={loading}
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={handleDeleteAccount}
                disabled={loading}
                className="flex items-center space-x-2"
              >
                <Trash2 className="w-4 h-4" />
                <span>Delete Account</span>
              </Button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default MyProfile;