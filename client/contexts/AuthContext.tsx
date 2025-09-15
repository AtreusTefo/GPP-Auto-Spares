import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User as SupabaseUser, Session } from '@supabase/supabase-js';
import { supabase, authHelpers, dbHelpers, UserProfile } from '../lib/supabase';

interface User {
  id: string;
  email: string;
  name: string;
  role: 'owner' | 'user';
  isVerified: boolean;
  token?: string;
}

interface ExtendedUser extends User {
  supabaseUser?: SupabaseUser;
  profile?: UserProfile;
}

interface AuthContextType {
  user: ExtendedUser | null;
  session: Session | null;
  profile: UserProfile | null;
  isAuthenticated: boolean;
  isOwner: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  signUp: (email: string, password: string, userData?: { name?: string }) => Promise<{ data: any; error: any }>;
  signIn: (email: string, password: string) => Promise<{ data: any; error: any }>;
  signOut: () => Promise<{ error: any }>;
  updateProfile: (updates: Partial<UserProfile>) => Promise<{ data: any; error: any }>;
  refreshProfile: () => Promise<void>;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock owner credentials - In production, this should be handled securely on the backend
const OWNER_CREDENTIALS = {
  email: 'owner@gppwebsite.com',
  password: 'admin123', // This should be hashed and stored securely
  user: {
    id: '1',
    email: 'owner@gppwebsite.com',
    name: 'Website Owner',
    role: 'owner' as const,
    isVerified: true
  }
};

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<ExtendedUser | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  // Load user profile from Supabase
  const loadProfile = async (userId: string) => {
    try {
      const { data, error } = await dbHelpers.profiles.get(userId);
      if (error) {
        console.error('Error loading profile:', error);
        return;
      }
      setProfile(data);
    } catch (error) {
      console.error('Error loading profile:', error);
    }
  };

  // Refresh profile data
  const refreshProfile = async () => {
    if (user?.supabaseUser?.id) {
      await loadProfile(user.supabaseUser.id);
    }
  };

  useEffect(() => {
    // Initialize Supabase auth state
    const initializeAuth = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        if (error) {
          console.error('Error getting session:', error);
        } else {
          setSession(session);
          
          if (session?.user) {
            // Create extended user object for Supabase users
            const extendedUser: ExtendedUser = {
              id: session.user.id,
              email: session.user.email!,
              name: session.user.user_metadata?.name || '',
              role: 'user',
              isVerified: session.user.email_confirmed_at !== null,
              supabaseUser: session.user
            };
            setUser(extendedUser);
            await loadProfile(session.user.id);
          }
        }
      } catch (error) {
        console.error('Error initializing auth:', error);
      }
      
      // Also check for stored owner authentication
      const storedUser = localStorage.getItem('auth_user');
      const storedToken = localStorage.getItem('auth_token');
      
      if (storedUser && storedToken && !session) {
        try {
          const parsedUser = JSON.parse(storedUser);
          if (parsedUser.role === 'owner') {
            const userWithToken = { ...parsedUser, token: storedToken };
            setUser(userWithToken);
          }
        } catch (error) {
          localStorage.removeItem('auth_user');
          localStorage.removeItem('auth_token');
        }
      }
      
      setLoading(false);
    };

    initializeAuth();

    // Listen for Supabase auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event, session?.user?.email);
        
        setSession(session);
        
        if (session?.user) {
          const extendedUser: ExtendedUser = {
            id: session.user.id,
            email: session.user.email!,
            name: session.user.user_metadata?.name || '',
            role: 'user',
            isVerified: session.user.email_confirmed_at !== null,
            supabaseUser: session.user
          };
          setUser(extendedUser);
          await loadProfile(session.user.id);
        } else if (!localStorage.getItem('auth_user')) {
          // Only clear user if no owner session exists
          setUser(null);
          setProfile(null);
        }
        
        setLoading(false);
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    setLoading(true);
    
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Check owner credentials
      if (email === OWNER_CREDENTIALS.email && password === OWNER_CREDENTIALS.password) {
        const authToken = `token_${Date.now()}_${Math.random()}`; // Mock token
        const authUser = { ...OWNER_CREDENTIALS.user, token: authToken };
        
        setUser(authUser);
        localStorage.setItem('auth_user', JSON.stringify(authUser));
        localStorage.setItem('auth_token', authToken);
        
        setLoading(false);
        return true;
      }
      
      // Invalid credentials
      setLoading(false);
      return false;
    } catch (error) {
      setLoading(false);
      return false;
    }
  };

  // Supabase sign up function
  const signUp = async (email: string, password: string, userData?: { name?: string }) => {
    try {
      setLoading(true);
      const result = await authHelpers.signUp(email, password, userData);
      
      // If signup successful and user confirmed, create profile
      if (result.data?.user && !result.error) {
        const profileData: Omit<UserProfile, 'created_at' | 'updated_at'> = {
          id: result.data.user.id,
          email: result.data.user.email!,
          name: userData?.name || '',
          phone: '',
          address: '',
          city: '',
          country: '',
          profile_picture: ''
        };
        
        await dbHelpers.profiles.create(profileData);
      }
      
      return result;
    } catch (error) {
      console.error('Sign up error:', error);
      return { data: null, error };
    } finally {
      setLoading(false);
    }
  };

  // Supabase sign in function
  const signIn = async (email: string, password: string) => {
    try {
      setLoading(true);
      return await authHelpers.signIn(email, password);
    } catch (error) {
      console.error('Sign in error:', error);
      return { data: null, error };
    } finally {
      setLoading(false);
    }
  };

  // Supabase sign out function
  const signOut = async () => {
    try {
      setLoading(true);
      const result = await authHelpers.signOut();
      
      // Clear local state
      setSession(null);
      setProfile(null);
      
      // Only clear user if it's a Supabase user
      if (user?.supabaseUser) {
        setUser(null);
      }
      
      return result;
    } catch (error) {
      console.error('Sign out error:', error);
      return { error };
    } finally {
      setLoading(false);
    }
  };

  // Update profile function
  const updateProfile = async (updates: Partial<UserProfile>) => {
    if (!user?.supabaseUser?.id) {
      return { data: null, error: new Error('No authenticated Supabase user') };
    }

    try {
      const result = await dbHelpers.profiles.update(user.supabaseUser.id, updates);
      
      // Update local profile state if successful
      if (result.data && !result.error) {
        setProfile(result.data);
      }
      
      return result;
    } catch (error) {
      console.error('Update profile error:', error);
      return { data: null, error };
    }
  };

  const logout = () => {
    // Handle owner logout
    setUser(null);
    setSession(null);
    setProfile(null);
    localStorage.removeItem('auth_user');
    localStorage.removeItem('auth_token');
    
    // Also sign out from Supabase if there's a session
    if (session) {
      supabase.auth.signOut();
    }
  };

  const value: AuthContextType = {
    user,
    session,
    profile,
    isAuthenticated: !!user,
    isOwner: user?.role === 'owner',
    login,
    logout,
    signUp,
    signIn,
    signOut,
    updateProfile,
    refreshProfile,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;