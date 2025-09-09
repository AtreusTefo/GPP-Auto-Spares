import express from 'express';
import cors from 'cors';
import path from 'path';

// In-memory cart storage (in production, use a database)
const userCarts = new Map();
const userSavedItems = new Map();
const userPromoCodes = new Map();

// Available promo codes
const availablePromoCodes = [
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
    discountValue: 0,
    isActive: true
  }
];

// Helper functions
function getUserId(req) {
  return req.headers['x-user-id'] || 'guest';
}

function calculateCartSummary(items, promoCode) {
  const subtotal = items.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
  
  let discount = 0;
  let shipping = subtotal >= 1000 ? 0 : 150;
  
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
  const tax = taxableAmount * 0.15;
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

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API Routes
app.get('/api/ping', (req, res) => {
  res.json({ message: 'pong' });
});

// API info endpoint
app.get('/api', (req, res) => {
  res.json({
    message: 'GPP Cart API Server',
    version: '1.0.0',
    endpoints: {
      cart: {
        get: 'GET /api/cart',
        add: 'POST /api/cart/add',
        update: 'PUT /api/cart/item/:itemId',
        remove: 'DELETE /api/cart/item/:itemId',
        clear: 'DELETE /api/cart/clear'
      },
      saved: {
        save: 'POST /api/saved/item/:itemId',
        remove: 'DELETE /api/saved/item/:itemId'
      },
      promo: {
        apply: 'POST /api/promo/apply',
        remove: 'DELETE /api/promo/remove'
      },
      validation: 'POST /api/cart/validate',
      health: 'GET /health'
    }
  });
});

app.get('/api/cart', (req, res) => {
  try {
    const userId = getUserId(req);
    const items = userCarts.get(userId) || [];
    const savedItems = userSavedItems.get(userId) || [];
    const appliedPromoCodeStr = userPromoCodes.get(userId);
    
    let appliedPromoCode;
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
});

app.post('/api/cart/add', (req, res) => {
  try {
    const userId = getUserId(req);
    const { product, quantity = 1 } = req.body;
    
    if (!product || !product.id) {
      return res.status(400).json({ success: false, error: 'Product information is required' });
    }
    
    if (quantity <= 0) {
      return res.status(400).json({ success: false, error: 'Quantity must be greater than 0' });
    }
    
    if (!product.inStock) {
      return res.status(400).json({ success: false, error: 'Product is out of stock' });
    }
    
    const items = userCarts.get(userId) || [];
    const existingItemIndex = items.findIndex(item => item.product.id === product.id);
    
    if (existingItemIndex >= 0) {
      const newQuantity = items[existingItemIndex].quantity + quantity;
      
      if (product.maxQuantity && newQuantity > product.maxQuantity) {
        return res.status(400).json({ 
          success: false, 
          error: `Maximum quantity of ${product.maxQuantity} exceeded` 
        });
      }
      
      items[existingItemIndex].quantity = newQuantity;
    } else {
      const cartItem = {
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
});

app.put('/api/cart/item/:itemId', (req, res) => {
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
});

app.delete('/api/cart/item/:itemId', (req, res) => {
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
});

app.delete('/api/cart/clear', (req, res) => {
  try {
    const userId = getUserId(req);
    userCarts.set(userId, []);
    userPromoCodes.delete(userId);
    
    res.json({ success: true, message: 'Cart cleared' });
  } catch (error) {
    console.error('Clear cart error:', error);
    res.status(500).json({ success: false, error: 'Failed to clear cart' });
  }
});

app.post('/api/cart/promo-code', (req, res) => {
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
    
    if (promoCode.expiresAt && new Date() > promoCode.expiresAt) {
      return res.status(400).json({ success: false, error: 'Promo code has expired' });
    }
    
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
});

app.delete('/api/cart/promo-code', (req, res) => {
  try {
    const userId = getUserId(req);
    userPromoCodes.delete(userId);
    
    res.json({ success: true, message: 'Promo code removed' });
  } catch (error) {
    console.error('Remove promo code error:', error);
    res.status(500).json({ success: false, error: 'Failed to remove promo code' });
  }
});

app.post('/api/cart/validate', (req, res) => {
  try {
    const userId = getUserId(req);
    const items = userCarts.get(userId) || [];
    
    const validationErrors = [];
    const updatedItems = [];
    
    for (const item of items) {
      if (!item.product.inStock) {
        validationErrors.push(`${item.product.description} is no longer in stock`);
        continue;
      }
      
      if (item.product.maxQuantity && item.quantity > item.product.maxQuantity) {
        item.quantity = item.product.maxQuantity;
        validationErrors.push(`${item.product.description} quantity reduced to maximum available (${item.product.maxQuantity})`);
      }
      
      updatedItems.push(item);
    }
    
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
});

app.listen(port, () => {
  console.log(`🚀 Cart API server running on port ${port}`);
  console.log(`🔧 API: http://localhost:${port}/api`);
});