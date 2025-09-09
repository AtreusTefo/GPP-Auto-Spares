import { Request, Response } from 'express';

// In-memory cart storage (in production, use a database)
interface CartItem {
  id: string;
  product: {
    id: string;
    productCode: string;
    description: string;
    price: number;
    imageUrl?: string;
    category?: string;
    inStock: boolean;
    maxQuantity?: number;
  };
  quantity: number;
  addedAt: Date;
}

interface SavedItem {
  id: string;
  product: {
    id: string;
    productCode: string;
    description: string;
    price: number;
    imageUrl?: string;
    category?: string;
    inStock: boolean;
  };
  savedAt: Date;
}

interface PromoCode {
  code: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  minOrderValue?: number;
  maxDiscount?: number;
  expiresAt?: Date;
  isActive: boolean;
}

// Mock data storage (replace with database in production)
const userCarts: Map<string, CartItem[]> = new Map();
const userSavedItems: Map<string, SavedItem[]> = new Map();
const userPromoCodes: Map<string, string> = new Map(); // userId -> applied promo code

// Available promo codes
const availablePromoCodes: PromoCode[] = [
  {
    code: 'SAVE10',
    discountType: 'percentage',
    discountValue: 10,
    minOrderValue: 500,
    isActive: true
  },
  {
    code: 'WELCOME50',
    discountType: 'fixed',
    discountValue: 50,
    minOrderValue: 200,
    isActive: true
  },
  {
    code: 'FREESHIP',
    discountType: 'percentage',
    discountValue: 0, // Special code for free shipping
    isActive: true
  }
];

// Helper functions
function getUserId(req: Request): string {
  // In production, extract from JWT token or session
  return req.headers['x-user-id'] as string || 'guest';
}

function calculateCartSummary(items: CartItem[], promoCode?: PromoCode) {
  const subtotal = items.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
  
  let discount = 0;
  let shipping = subtotal >= 1000 ? 0 : 150; // Free shipping over R1000
  
  if (promoCode) {
    if (promoCode.code === 'FREESHIP') {
      shipping = 0;
    } else if (promoCode.minOrderValue && subtotal >= promoCode.minOrderValue) {
      if (promoCode.discountType === 'percentage') {
        discount = (subtotal * promoCode.discountValue) / 100;
        if (promoCode.maxDiscount) {
          discount = Math.min(discount, promoCode.maxDiscount);
        }
      } else {
        discount = promoCode.discountValue;
      }
    }
  }
  
  const taxableAmount = subtotal - discount;
  const tax = taxableAmount * 0.15; // 15% VAT
  const total = taxableAmount + tax + shipping;
  
  return {
    subtotal,
    discount,
    shipping,
    tax,
    total,
    itemCount
  };
}

// API Handlers
export function getCart(req: Request, res: Response) {
  try {
    const userId = getUserId(req);
    const items = userCarts.get(userId) || [];
    const savedItems = userSavedItems.get(userId) || [];
    const appliedPromoCodeStr = userPromoCodes.get(userId);
    
    let appliedPromoCode: PromoCode | undefined;
    if (appliedPromoCodeStr) {
      appliedPromoCode = availablePromoCodes.find(pc => pc.code === appliedPromoCodeStr && pc.isActive);
    }
    
    const summary = calculateCartSummary(items, appliedPromoCode);
    
    res.json({
      success: true,
      data: {
        items,
        savedItems,
        summary,
        appliedPromoCode
      }
    });
  } catch (error) {
    console.error('Get cart error:', error);
    res.status(500).json({ success: false, error: 'Failed to get cart' });
  }
}

export function addToCart(req: Request, res: Response) {
  try {
    const userId = getUserId(req);
    const { product, quantity = 1 } = req.body;
    
    if (!product || !product.id) {
      return res.status(400).json({ success: false, error: 'Product information is required' });
    }
    
    if (quantity <= 0) {
      return res.status(400).json({ success: false, error: 'Quantity must be greater than 0' });
    }
    
    // Check stock availability
    if (!product.inStock) {
      return res.status(400).json({ success: false, error: 'Product is out of stock' });
    }
    
    const items = userCarts.get(userId) || [];
    const existingItemIndex = items.findIndex(item => item.product.id === product.id);
    
    if (existingItemIndex >= 0) {
      // Update existing item
      const newQuantity = items[existingItemIndex].quantity + quantity;
      
      // Check max quantity limit
      if (product.maxQuantity && newQuantity > product.maxQuantity) {
        return res.status(400).json({ 
          success: false, 
          error: `Maximum quantity of ${product.maxQuantity} exceeded` 
        });
      }
      
      items[existingItemIndex].quantity = newQuantity;
    } else {
      // Add new item
      const cartItem: CartItem = {
        id: `${userId}_${product.id}_${Date.now()}`,
        product,
        quantity,
        addedAt: new Date()
      };
      items.push(cartItem);
    }
    
    userCarts.set(userId, items);
    
    res.json({ success: true, message: 'Item added to cart' });
  } catch (error) {
    console.error('Add to cart error:', error);
    res.status(500).json({ success: false, error: 'Failed to add item to cart' });
  }
}

export function updateCartItem(req: Request, res: Response) {
  try {
    const userId = getUserId(req);
    const { itemId } = req.params;
    const { quantity } = req.body;
    
    if (quantity <= 0) {
      return res.status(400).json({ success: false, error: 'Quantity must be greater than 0' });
    }
    
    const items = userCarts.get(userId) || [];
    const itemIndex = items.findIndex(item => item.id === itemId);
    
    if (itemIndex === -1) {
      return res.status(404).json({ success: false, error: 'Cart item not found' });
    }
    
    const item = items[itemIndex];
    
    // Check max quantity limit
    if (item.product.maxQuantity && quantity > item.product.maxQuantity) {
      return res.status(400).json({ 
        success: false, 
        error: `Maximum quantity of ${item.product.maxQuantity} exceeded` 
      });
    }
    
    items[itemIndex].quantity = quantity;
    userCarts.set(userId, items);
    
    res.json({ success: true, message: 'Cart item updated' });
  } catch (error) {
    console.error('Update cart item error:', error);
    res.status(500).json({ success: false, error: 'Failed to update cart item' });
  }
}

export function removeFromCart(req: Request, res: Response) {
  try {
    const userId = getUserId(req);
    const { itemId } = req.params;
    
    const items = userCarts.get(userId) || [];
    const filteredItems = items.filter(item => item.id !== itemId);
    
    if (filteredItems.length === items.length) {
      return res.status(404).json({ success: false, error: 'Cart item not found' });
    }
    
    userCarts.set(userId, filteredItems);
    
    res.json({ success: true, message: 'Item removed from cart' });
  } catch (error) {
    console.error('Remove from cart error:', error);
    res.status(500).json({ success: false, error: 'Failed to remove item from cart' });
  }
}

export function clearCart(req: Request, res: Response) {
  try {
    const userId = getUserId(req);
    userCarts.set(userId, []);
    userPromoCodes.delete(userId);
    
    res.json({ success: true, message: 'Cart cleared' });
  } catch (error) {
    console.error('Clear cart error:', error);
    res.status(500).json({ success: false, error: 'Failed to clear cart' });
  }
}

export function saveForLater(req: Request, res: Response) {
  try {
    const userId = getUserId(req);
    const { itemId } = req.params;
    
    const items = userCarts.get(userId) || [];
    const itemIndex = items.findIndex(item => item.id === itemId);
    
    if (itemIndex === -1) {
      return res.status(404).json({ success: false, error: 'Cart item not found' });
    }
    
    const cartItem = items[itemIndex];
    const savedItem: SavedItem = {
      id: `saved_${cartItem.product.id}_${Date.now()}`,
      product: cartItem.product,
      savedAt: new Date()
    };
    
    // Remove from cart
    items.splice(itemIndex, 1);
    userCarts.set(userId, items);
    
    // Add to saved items
    const savedItems = userSavedItems.get(userId) || [];
    savedItems.push(savedItem);
    userSavedItems.set(userId, savedItems);
    
    res.json({ success: true, message: 'Item saved for later' });
  } catch (error) {
    console.error('Save for later error:', error);
    res.status(500).json({ success: false, error: 'Failed to save item for later' });
  }
}

export function moveToCart(req: Request, res: Response) {
  try {
    const userId = getUserId(req);
    const { itemId } = req.params;
    
    const savedItems = userSavedItems.get(userId) || [];
    const itemIndex = savedItems.findIndex(item => item.id === itemId);
    
    if (itemIndex === -1) {
      return res.status(404).json({ success: false, error: 'Saved item not found' });
    }
    
    const savedItem = savedItems[itemIndex];
    
    // Check if product is still in stock
    if (!savedItem.product.inStock) {
      return res.status(400).json({ success: false, error: 'Product is no longer in stock' });
    }
    
    const cartItem: CartItem = {
      id: `${userId}_${savedItem.product.id}_${Date.now()}`,
      product: savedItem.product,
      quantity: 1,
      addedAt: new Date()
    };
    
    // Remove from saved items
    savedItems.splice(itemIndex, 1);
    userSavedItems.set(userId, savedItems);
    
    // Add to cart
    const items = userCarts.get(userId) || [];
    items.push(cartItem);
    userCarts.set(userId, items);
    
    res.json({ success: true, message: 'Item moved to cart' });
  } catch (error) {
    console.error('Move to cart error:', error);
    res.status(500).json({ success: false, error: 'Failed to move item to cart' });
  }
}

export function removeSavedItem(req: Request, res: Response) {
  try {
    const userId = getUserId(req);
    const { itemId } = req.params;
    
    const savedItems = userSavedItems.get(userId) || [];
    const filteredItems = savedItems.filter(item => item.id !== itemId);
    
    if (filteredItems.length === savedItems.length) {
      return res.status(404).json({ success: false, error: 'Saved item not found' });
    }
    
    userSavedItems.set(userId, filteredItems);
    
    res.json({ success: true, message: 'Saved item removed' });
  } catch (error) {
    console.error('Remove saved item error:', error);
    res.status(500).json({ success: false, error: 'Failed to remove saved item' });
  }
}

export function applyPromoCode(req: Request, res: Response) {
  try {
    const userId = getUserId(req);
    const { code } = req.body;
    
    if (!code) {
      return res.status(400).json({ success: false, error: 'Promo code is required' });
    }
    
    const promoCode = availablePromoCodes.find(pc => 
      pc.code.toLowerCase() === code.toLowerCase() && pc.isActive
    );
    
    if (!promoCode) {
      return res.status(400).json({ success: false, error: 'Invalid or expired promo code' });
    }
    
    // Check if promo code has expired
    if (promoCode.expiresAt && new Date() > promoCode.expiresAt) {
      return res.status(400).json({ success: false, error: 'Promo code has expired' });
    }
    
    // Check minimum order value
    const items = userCarts.get(userId) || [];
    const subtotal = items.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
    
    if (promoCode.minOrderValue && subtotal < promoCode.minOrderValue) {
      return res.status(400).json({ 
        success: false, 
        error: `Minimum order value of R${promoCode.minOrderValue} required` 
      });
    }
    
    userPromoCodes.set(userId, promoCode.code);
    
    res.json({ 
      success: true, 
      message: 'Promo code applied successfully',
      promoCode 
    });
  } catch (error) {
    console.error('Apply promo code error:', error);
    res.status(500).json({ success: false, error: 'Failed to apply promo code' });
  }
}

export function removePromoCode(req: Request, res: Response) {
  try {
    const userId = getUserId(req);
    userPromoCodes.delete(userId);
    
    res.json({ success: true, message: 'Promo code removed' });
  } catch (error) {
    console.error('Remove promo code error:', error);
    res.status(500).json({ success: false, error: 'Failed to remove promo code' });
  }
}

export function validateCart(req: Request, res: Response) {
  try {
    const userId = getUserId(req);
    const items = userCarts.get(userId) || [];
    
    const validationErrors: string[] = [];
    const updatedItems: CartItem[] = [];
    
    for (const item of items) {
      // Check if product is still in stock
      if (!item.product.inStock) {
        validationErrors.push(`${item.product.description} is no longer in stock`);
        continue;
      }
      
      // Check quantity limits
      if (item.product.maxQuantity && item.quantity > item.product.maxQuantity) {
        item.quantity = item.product.maxQuantity;
        validationErrors.push(`${item.product.description} quantity reduced to maximum available (${item.product.maxQuantity})`);
      }
      
      updatedItems.push(item);
    }
    
    // Update cart with validated items
    userCarts.set(userId, updatedItems);
    
    res.json({ 
      success: validationErrors.length === 0,
      validationErrors,
      message: validationErrors.length > 0 ? 'Cart updated with validation changes' : 'Cart is valid'
    });
  } catch (error) {
    console.error('Validate cart error:', error);
    res.status(500).json({ success: false, error: 'Failed to validate cart' });
  }
}