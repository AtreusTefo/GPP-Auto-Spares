import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { dbHelpers, Product, subscriptions } from '../lib/supabase';
import { useAuth } from './AuthContext';

interface ProductsContextType {
  products: Product[];
  loading: boolean;
  error: string | null;
  // Product operations
  fetchProducts: (filters?: { category?: string; status?: string; limit?: number }) => Promise<void>;
  getProduct: (productId: string) => Promise<Product | null>;
  createProduct: (product: Omit<Product, 'id' | 'created_at' | 'updated_at' | 'views'>) => Promise<{ data: Product | null; error: any }>;
  updateProduct: (productId: string, updates: Partial<Product>) => Promise<{ data: Product | null; error: any }>;
  deleteProduct: (productId: string) => Promise<{ error: any }>;
  incrementViews: (productId: string) => Promise<void>;
  // Filtering and search
  filterProducts: (filters: { category?: string; status?: string; search?: string }) => Product[];
  getProductsByCategory: (category: string) => Product[];
  getFeaturedProducts: (limit?: number) => Product[];
  // Real-time updates
  subscribeToProducts: () => void;
  unsubscribeFromProducts: () => void;
}

const ProductsContext = createContext<ProductsContextType | undefined>(undefined);

export const useProducts = () => {
  const context = useContext(ProductsContext);
  if (context === undefined) {
    throw new Error('useProducts must be used within a ProductsProvider');
  }
  return context;
};

interface ProductsProviderProps {
  children: ReactNode;
}

export const ProductsProvider: React.FC<ProductsProviderProps> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();
  
  let subscription: any = null;

  // Fetch products from Supabase
  const fetchProducts = async (filters?: { category?: string; status?: string; limit?: number }) => {
    try {
      setLoading(true);
      setError(null);
      
      const { data, error: fetchError } = await dbHelpers.products.getAll(filters);
      
      if (fetchError) {
        throw fetchError;
      }
      
      setProducts(data || []);
    } catch (err: any) {
      console.error('Error fetching products:', err);
      setError(err.message || 'Failed to fetch products');
    } finally {
      setLoading(false);
    }
  };

  // Get single product
  const getProduct = async (productId: string): Promise<Product | null> => {
    try {
      const { data, error: fetchError } = await dbHelpers.products.get(productId);
      
      if (fetchError) {
        console.error('Error fetching product:', fetchError);
        return null;
      }
      
      return data;
    } catch (err) {
      console.error('Error fetching product:', err);
      return null;
    }
  };

  // Create new product
  const createProduct = async (product: Omit<Product, 'id' | 'created_at' | 'updated_at' | 'views'>) => {
    try {
      setError(null);
      
      // Add user_id if user is authenticated
      const productData = {
        ...product,
        user_id: user?.supabaseUser?.id || undefined
      };
      
      const result = await dbHelpers.products.create(productData);
      
      if (result.data && !result.error) {
        // Add to local state
        setProducts(prev => [result.data!, ...prev]);
      }
      
      return result;
    } catch (err: any) {
      console.error('Error creating product:', err);
      const error = err.message || 'Failed to create product';
      setError(error);
      return { data: null, error };
    }
  };

  // Update product
  const updateProduct = async (productId: string, updates: Partial<Product>) => {
    try {
      setError(null);
      
      const result = await dbHelpers.products.update(productId, updates);
      
      if (result.data && !result.error) {
        // Update local state
        setProducts(prev => 
          prev.map(product => 
            product.id === productId ? result.data! : product
          )
        );
      }
      
      return result;
    } catch (err: any) {
      console.error('Error updating product:', err);
      const error = err.message || 'Failed to update product';
      setError(error);
      return { data: null, error };
    }
  };

  // Delete product
  const deleteProduct = async (productId: string) => {
    try {
      setError(null);
      
      const result = await dbHelpers.products.delete(productId);
      
      if (!result.error) {
        // Remove from local state
        setProducts(prev => prev.filter(product => product.id !== productId));
      }
      
      return result;
    } catch (err: any) {
      console.error('Error deleting product:', err);
      const error = err.message || 'Failed to delete product';
      setError(error);
      return { error };
    }
  };

  // Increment product views
  const incrementViews = async (productId: string) => {
    try {
      await dbHelpers.products.incrementViews(productId);
      
      // Update local state
      setProducts(prev => 
        prev.map(product => 
          product.id === productId 
            ? { ...product, views: product.views + 1 }
            : product
        )
      );
    } catch (err) {
      console.error('Error incrementing views:', err);
    }
  };

  // Filter products locally
  const filterProducts = (filters: { category?: string; status?: string; search?: string }) => {
    return products.filter(product => {
      if (filters.category && product.category !== filters.category) {
        return false;
      }
      
      if (filters.status && product.status !== filters.status) {
        return false;
      }
      
      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        return (
          product.title.toLowerCase().includes(searchLower) ||
          product.description?.toLowerCase().includes(searchLower) ||
          product.category.toLowerCase().includes(searchLower)
        );
      }
      
      return true;
    });
  };

  // Get products by category
  const getProductsByCategory = (category: string) => {
    return products.filter(product => product.category === category);
  };

  // Get featured products (highest views or newest)
  const getFeaturedProducts = (limit: number = 6) => {
    return products
      .filter(product => product.status === 'active')
      .sort((a, b) => b.views - a.views || new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
      .slice(0, limit);
  };

  // Subscribe to real-time product updates
  const subscribeToProducts = () => {
    if (subscription) return; // Already subscribed
    
    subscription = subscriptions.subscribeToProducts((payload) => {
      console.log('Product update received:', payload);
      
      const { eventType, new: newRecord, old: oldRecord } = payload;
      
      switch (eventType) {
        case 'INSERT':
          if (newRecord) {
            setProducts(prev => {
              // Check if product already exists to avoid duplicates
              const exists = prev.some(p => p.id === newRecord.id);
              if (!exists) {
                return [newRecord, ...prev];
              }
              return prev;
            });
          }
          break;
          
        case 'UPDATE':
          if (newRecord) {
            setProducts(prev => 
              prev.map(product => 
                product.id === newRecord.id ? newRecord : product
              )
            );
          }
          break;
          
        case 'DELETE':
          if (oldRecord) {
            setProducts(prev => 
              prev.filter(product => product.id !== oldRecord.id)
            );
          }
          break;
      }
    });
  };

  // Unsubscribe from real-time updates
  const unsubscribeFromProducts = () => {
    if (subscription) {
      subscription.unsubscribe();
      subscription = null;
    }
  };

  // Initialize products on mount
  useEffect(() => {
    fetchProducts({ status: 'active' });
    subscribeToProducts();
    
    return () => {
      unsubscribeFromProducts();
    };
  }, []);

  const value: ProductsContextType = {
    products,
    loading,
    error,
    fetchProducts,
    getProduct,
    createProduct,
    updateProduct,
    deleteProduct,
    incrementViews,
    filterProducts,
    getProductsByCategory,
    getFeaturedProducts,
    subscribeToProducts,
    unsubscribeFromProducts
  };

  return (
    <ProductsContext.Provider value={value}>
      {children}
    </ProductsContext.Provider>
  );
};

export default ProductsContext;