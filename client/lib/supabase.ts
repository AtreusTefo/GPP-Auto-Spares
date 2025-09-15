import { createClient } from '@supabase/supabase-js';

// Supabase configuration
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables. Please check your .env file.');
}

// Create Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
});

// Database table types
export interface UserProfile {
  id: string;
  email: string;
  name: string;
  phone?: string;
  address?: string;
  city?: string;
  country?: string;
  profile_picture?: string;
  created_at: string;
  updated_at: string;
}

export interface Product {
  id: string;
  title: string;
  description?: string;
  price: number;
  category: string;
  image_url?: string;
  stock: number;
  status: 'active' | 'pending' | 'sold' | 'draft';
  views: number;
  created_at: string;
  updated_at: string;
  user_id?: string;
}

// Auth helper functions
export const authHelpers = {
  // Sign up new user
  signUp: async (email: string, password: string, userData?: { name?: string }) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: userData
        }
      });
      
      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error('Sign up error:', error);
      return { data: null, error };
    }
  },

  // Sign in user
  signIn: async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error('Sign in error:', error);
      return { data: null, error };
    }
  },

  // Sign out user
  signOut: async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      return { error: null };
    } catch (error) {
      console.error('Sign out error:', error);
      return { error };
    }
  },

  // Get current user
  getCurrentUser: async () => {
    try {
      const { data: { user }, error } = await supabase.auth.getUser();
      if (error) throw error;
      return { user, error: null };
    } catch (error) {
      console.error('Get user error:', error);
      return { user: null, error };
    }
  }
};

// Database helper functions
export const dbHelpers = {
  // User Profile operations
  profiles: {
    // Get user profile
    get: async (userId: string) => {
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', userId)
          .single();
        
        if (error) throw error;
        return { data, error: null };
      } catch (error) {
        console.error('Get profile error:', error);
        return { data: null, error };
      }
    },

    // Update user profile
    update: async (userId: string, updates: Partial<UserProfile>) => {
      try {
        const { data, error } = await supabase
          .from('profiles')
          .update({ ...updates, updated_at: new Date().toISOString() })
          .eq('id', userId)
          .select()
          .single();
        
        if (error) throw error;
        return { data, error: null };
      } catch (error) {
        console.error('Update profile error:', error);
        return { data: null, error };
      }
    },

    // Create user profile
    create: async (profile: Omit<UserProfile, 'created_at' | 'updated_at'>) => {
      try {
        const now = new Date().toISOString();
        const { data, error } = await supabase
          .from('profiles')
          .insert({ ...profile, created_at: now, updated_at: now })
          .select()
          .single();
        
        if (error) throw error;
        return { data, error: null };
      } catch (error) {
        console.error('Create profile error:', error);
        return { data: null, error };
      }
    }
  },

  // Product operations
  products: {
    // Get all products with optional filtering
    getAll: async (filters?: { category?: string; status?: string; limit?: number }) => {
      try {
        let query = supabase.from('products').select('*');
        
        if (filters?.category) {
          query = query.eq('category', filters.category);
        }
        
        if (filters?.status) {
          query = query.eq('status', filters.status);
        }
        
        if (filters?.limit) {
          query = query.limit(filters.limit);
        }
        
        query = query.order('created_at', { ascending: false });
        
        const { data, error } = await query;
        
        if (error) throw error;
        return { data, error: null };
      } catch (error) {
        console.error('Get products error:', error);
        return { data: null, error };
      }
    },

    // Get single product
    get: async (productId: string) => {
      try {
        const { data, error } = await supabase
          .from('products')
          .select('*')
          .eq('id', productId)
          .single();
        
        if (error) throw error;
        return { data, error: null };
      } catch (error) {
        console.error('Get product error:', error);
        return { data: null, error };
      }
    },

    // Create new product
    create: async (product: Omit<Product, 'id' | 'created_at' | 'updated_at' | 'views'>) => {
      try {
        const now = new Date().toISOString();
        const { data, error } = await supabase
          .from('products')
          .insert({ 
            ...product, 
            views: 0,
            created_at: now, 
            updated_at: now 
          })
          .select()
          .single();
        
        if (error) throw error;
        return { data, error: null };
      } catch (error) {
        console.error('Create product error:', error);
        return { data: null, error };
      }
    },

    // Update product
    update: async (productId: string, updates: Partial<Product>) => {
      try {
        const { data, error } = await supabase
          .from('products')
          .update({ ...updates, updated_at: new Date().toISOString() })
          .eq('id', productId)
          .select()
          .single();
        
        if (error) throw error;
        return { data, error: null };
      } catch (error) {
        console.error('Update product error:', error);
        return { data: null, error };
      }
    },

    // Delete product
    delete: async (productId: string) => {
      try {
        const { error } = await supabase
          .from('products')
          .delete()
          .eq('id', productId);
        
        if (error) throw error;
        return { error: null };
      } catch (error) {
        console.error('Delete product error:', error);
        return { error };
      }
    },

    // Increment product views
    incrementViews: async (productId: string) => {
      try {
        const { error } = await supabase.rpc('increment_product_views', {
          product_id: productId
        });
        
        if (error) throw error;
        return { error: null };
      } catch (error) {
        console.error('Increment views error:', error);
        return { error };
      }
    }
  }
};

// Real-time subscriptions
export const subscriptions = {
  // Subscribe to product changes
  subscribeToProducts: (callback: (payload: any) => void) => {
    return supabase
      .channel('products')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'products' }, 
        callback
      )
      .subscribe();
  },

  // Subscribe to profile changes
  subscribeToProfile: (userId: string, callback: (payload: any) => void) => {
    return supabase
      .channel(`profile-${userId}`)
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'profiles', filter: `id=eq.${userId}` }, 
        callback
      )
      .subscribe();
  }
};

export default supabase;