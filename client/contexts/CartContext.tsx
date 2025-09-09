import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import { useAuth } from './AuthContext';

// API base URL
const API_BASE_URL = 'http://localhost:3000/api';

// API helper functions
const apiCall = async (endpoint: string, options: RequestInit = {}) => {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    headers: {
      'Content-Type': 'application/json',
      'x-user-id': 'guest', // In production, use actual user ID from auth
      ...options.headers,
    },
    ...options,
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'API request failed');
  }
  
  return response.json();
};

// TypeScript interfaces for cart functionality
export interface Product {
  id: string;
  productCode: string;
  description: string;
  price: number;
  imageUrl?: string;
  category?: string;
  inStock: boolean;
  maxQuantity?: number;
}

export interface CartItem {
  id: string;
  product: Product;
  quantity: number;
  addedAt: Date;
}

export interface SavedItem {
  id: string;
  product: Product;
  savedAt: Date;
}

export interface PromoCode {
  code: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  minOrderValue?: number;
  maxDiscount?: number;
  expiresAt?: Date;
  isActive: boolean;
}

export interface CartSummary {
  subtotal: number;
  discount: number;
  tax: number;
  shipping: number;
  total: number;
  itemCount: number;
}

interface CartState {
  items: CartItem[];
  savedItems: SavedItem[];
  summary: CartSummary;
  appliedPromoCode?: PromoCode;
  isLoading: boolean;
  error?: string;
}

type CartAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | undefined }
  | { type: 'SET_CART_DATA'; payload: { items: CartItem[]; savedItems: SavedItem[]; summary: CartSummary; appliedPromoCode?: PromoCode } }
  | { type: 'SET_ITEMS'; payload: CartItem[] }
  | { type: 'SET_SAVED_ITEMS'; payload: SavedItem[] }
  | { type: 'SET_SUMMARY'; payload: CartSummary }
  | { type: 'SET_PROMO_CODE'; payload: PromoCode | undefined };

const cartReducer = (state: CartState, action: CartAction): CartState => {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload, isLoading: false };
    case 'SET_CART_DATA':
      return {
        ...state,
        items: action.payload.items,
        savedItems: action.payload.savedItems,
        summary: action.payload.summary,
        appliedPromoCode: action.payload.appliedPromoCode,
        isLoading: false,
        error: undefined
      };
    case 'SET_ITEMS':
      return { ...state, items: action.payload };
    case 'SET_SAVED_ITEMS':
      return { ...state, savedItems: action.payload };
    case 'SET_SUMMARY':
      return { ...state, summary: action.payload };
    case 'SET_PROMO_CODE':
      return { ...state, appliedPromoCode: action.payload };
    default:
      return state;
  }
};

interface CartContextType {
  // Cart state
  items: CartItem[];
  savedItems: SavedItem[];
  summary: CartSummary;
  appliedPromoCode?: PromoCode;
  isLoading: boolean;
  error?: string;
  
  // Cart operations
  addToCart: (product: Product, quantity?: number) => Promise<boolean>;
  removeFromCart: (itemId: string) => Promise<boolean>;
  updateQuantity: (itemId: string, quantity: number) => Promise<boolean>;
  clearCart: () => Promise<boolean>;
  
  // Save for later functionality
  saveForLater: (itemId: string) => Promise<boolean>;
  moveToCart: (itemId: string) => Promise<boolean>;
  removeSavedItem: (itemId: string) => Promise<boolean>;
  
  // Promo code functionality
  applyPromoCode: (code: string) => Promise<boolean>;
  removePromoCode: () => Promise<boolean>;
  
  // Utility functions
  getItemQuantity: (productId: string) => number;
  isInCart: (productId: string) => boolean;
  validateCart: () => Promise<boolean>;
  refreshCart: () => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const initialState: CartState = {
  items: [],
  savedItems: [],
  summary: {
    subtotal: 0,
    discount: 0,
    tax: 0,
    shipping: 0,
    total: 0,
    itemCount: 0
  },
  appliedPromoCode: undefined,
  isLoading: false,
  error: undefined
};

export const CartProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { user, isAuthenticated } = useAuth();
  const [state, dispatch] = useReducer(cartReducer, initialState);

  // Load cart data on mount and when auth state changes
  useEffect(() => {
    refreshCart();
  }, [isAuthenticated, user]);

  const refreshCart = async (): Promise<void> => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const cartData = await apiCall('/cart');
      dispatch({ type: 'SET_CART_DATA', payload: cartData });
    } catch (error) {
      console.error('Error loading cart:', error);
      dispatch({ type: 'SET_ERROR', payload: error instanceof Error ? error.message : 'Failed to load cart' });
    }
  };



  const addToCart = async (product: Product, quantity: number = 1): Promise<boolean> => {
     try {
       dispatch({ type: 'SET_LOADING', payload: true });
       
       await apiCall('/cart/add', {
         method: 'POST',
         body: JSON.stringify({ product, quantity })
       });
       
       // Refresh cart data after adding
       await refreshCart();
       return true;
     } catch (error) {
       console.error('Error adding to cart:', error);
       dispatch({ type: 'SET_ERROR', payload: error instanceof Error ? error.message : 'Failed to add item to cart' });
       return false;
     }
   };

  const removeFromCart = async (itemId: string): Promise<boolean> => {
     try {
       dispatch({ type: 'SET_LOADING', payload: true });
       
       await apiCall(`/cart/item/${itemId}`, {
         method: 'DELETE'
       });
       
       // Refresh cart data after removing
       await refreshCart();
       return true;
     } catch (error) {
       console.error('Error removing from cart:', error);
       dispatch({ type: 'SET_ERROR', payload: error instanceof Error ? error.message : 'Failed to remove item from cart' });
       return false;
     }
   };

  const updateQuantity = async (itemId: string, quantity: number): Promise<boolean> => {
     try {
       if (quantity <= 0) {
         return removeFromCart(itemId);
       }
 
       dispatch({ type: 'SET_LOADING', payload: true });
       
       await apiCall(`/cart/item/${itemId}`, {
         method: 'PUT',
         body: JSON.stringify({ quantity })
       });
       
       // Refresh cart data after updating
       await refreshCart();
       return true;
     } catch (error) {
       console.error('Error updating quantity:', error);
       dispatch({ type: 'SET_ERROR', payload: error instanceof Error ? error.message : 'Failed to update item quantity' });
       return false;
     }
   };

  const clearCart = async (): Promise<boolean> => {
     try {
       dispatch({ type: 'SET_LOADING', payload: true });
       
       await apiCall('/cart/clear', {
         method: 'DELETE'
       });
       
       // Refresh cart data after clearing
       await refreshCart();
       return true;
     } catch (error) {
       console.error('Error clearing cart:', error);
       dispatch({ type: 'SET_ERROR', payload: error instanceof Error ? error.message : 'Failed to clear cart' });
       return false;
     }
   };

  const saveForLater = async (itemId: string): Promise<boolean> => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      
      await apiCall(`/saved/item/${itemId}`, {
        method: 'POST'
      });
      
      // Refresh cart data after saving
      await refreshCart();
      return true;
    } catch (error) {
      console.error('Error saving item for later:', error);
      dispatch({ type: 'SET_ERROR', payload: error instanceof Error ? error.message : 'Failed to save item for later' });
      return false;
    }
  };

  const moveToCart = async (itemId: string): Promise<boolean> => {
     try {
       dispatch({ type: 'SET_LOADING', payload: true });
       
       await apiCall(`/saved/item/${itemId}`, {
         method: 'DELETE'
       });
       
       // Refresh cart data after moving
       await refreshCart();
       return true;
     } catch (error) {
       console.error('Error moving item to cart:', error);
       dispatch({ type: 'SET_ERROR', payload: error instanceof Error ? error.message : 'Failed to move item to cart' });
       return false;
     }
   };

  const removeSavedItem = async (itemId: string): Promise<boolean> => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      
      await apiCall(`/saved/item/${itemId}`, {
        method: 'DELETE'
      });
      
      // Refresh cart data after removing saved item
      await refreshCart();
      return true;
    } catch (error) {
      console.error('Error removing saved item:', error);
      dispatch({ type: 'SET_ERROR', payload: error instanceof Error ? error.message : 'Failed to remove saved item' });
      return false;
    }
  };

  const applyPromoCode = async (code: string): Promise<boolean> => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      
      await apiCall('/promo/apply', {
        method: 'POST',
        body: JSON.stringify({ code })
      });
      
      // Refresh cart data after applying promo
      await refreshCart();
      return true;
    } catch (error) {
      console.error('Error applying promo code:', error);
      dispatch({ type: 'SET_ERROR', payload: error instanceof Error ? error.message : 'Failed to apply promo code' });
      return false;
    }
  };

  const removePromoCode = async (): Promise<boolean> => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      
      await apiCall('/promo/remove', {
        method: 'DELETE'
      });
      
      // Refresh cart data after removing promo
      await refreshCart();
      return true;
    } catch (error) {
      console.error('Error removing promo code:', error);
      dispatch({ type: 'SET_ERROR', payload: error instanceof Error ? error.message : 'Failed to remove promo code' });
      return false;
    }
  };

  const getItemQuantity = (productId: string): number => {
    const item = state.items.find(item => item.product.id === productId);
    return item ? item.quantity : 0;
  };

  const isInCart = (productId: string): boolean => {
    return state.items.some(item => item.product.id === productId);
  };

  const validateCart = async (): Promise<boolean> => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      
      const cartData = await apiCall('/cart/validate', {
        method: 'POST'
      });
      
      dispatch({ type: 'SET_CART_DATA', payload: cartData });
      return true;
    } catch (error) {
      console.error('Error validating cart:', error);
      dispatch({ type: 'SET_ERROR', payload: error instanceof Error ? error.message : 'Failed to validate cart' });
      return false;
    }
  };

  const contextValue: CartContextType = {
    items: state.items,
    savedItems: state.savedItems,
    summary: state.summary,
    appliedPromoCode: state.appliedPromoCode,
    isLoading: state.isLoading,
    error: state.error,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    saveForLater,
    moveToCart,
    removeSavedItem,
    applyPromoCode,
    removePromoCode,
    getItemQuantity,
    isInCart,
    validateCart,
    refreshCart
  };

  return (
    <CartContext.Provider value={contextValue}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = (): CartContextType => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export default CartContext;