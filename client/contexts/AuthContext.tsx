import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface User {
  id: string;
  email: string;
  name: string;
  role: 'owner' | 'user';
  isVerified: boolean;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isOwner: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
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
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for stored authentication on app load
    const storedUser = localStorage.getItem('auth_user');
    const storedToken = localStorage.getItem('auth_token');
    
    if (storedUser && storedToken) {
      try {
        const parsedUser = JSON.parse(storedUser);
        // Verify token is still valid (in production, verify with backend)
        if (parsedUser.role === 'owner') {
          setUser(parsedUser);
        }
      } catch (error) {
        // Clear invalid stored data
        localStorage.removeItem('auth_user');
        localStorage.removeItem('auth_token');
      }
    }
    
    setLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    setLoading(true);
    
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Check owner credentials
      if (email === OWNER_CREDENTIALS.email && password === OWNER_CREDENTIALS.password) {
        const authUser = OWNER_CREDENTIALS.user;
        const authToken = `token_${Date.now()}_${Math.random()}`; // Mock token
        
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

  const logout = () => {
    setUser(null);
    localStorage.removeItem('auth_user');
    localStorage.removeItem('auth_token');
  };

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isOwner: user?.role === 'owner',
    login,
    logout,
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