import { RequestHandler } from 'express';

// Mock authentication - In production, use JWT tokens and proper authentication
const mockUsers = new Map([
  ['1', {
    id: '1',
    email: 'owner@gppwebsite.com',
    role: 'owner',
    isVerified: true
  }],
  ['2', {
    id: '2',
    email: 'user@example.com',
    role: 'user',
    isVerified: true
  }]
]);

// Authentication middleware
export const authenticate: RequestHandler = (req, res, next) => {
  try {
    // Get user ID from headers (in production, extract from JWT token)
    const userId = req.headers['x-user-id'] as string;
    const authToken = req.headers['authorization'];
    
    if (!userId) {
      return res.status(401).json({ error: 'Authentication required' });
    }
    
    // Verify user exists (in production, verify JWT token)
    const user = mockUsers.get(userId);
    if (!user) {
      return res.status(401).json({ error: 'Invalid authentication credentials' });
    }
    
    // Add user to request object
    (req as any).user = user;
    next();
  } catch (error) {
    console.error('Authentication error:', error);
    res.status(401).json({ error: 'Authentication failed' });
  }
};

// Authorization middleware for owner-only routes
export const requireOwner: RequestHandler = (req, res, next) => {
  try {
    const user = (req as any).user;
    
    if (!user) {
      return res.status(401).json({ error: 'Authentication required' });
    }
    
    if (user.role !== 'owner') {
      return res.status(403).json({ error: 'Owner access required' });
    }
    
    next();
  } catch (error) {
    console.error('Authorization error:', error);
    res.status(403).json({ error: 'Authorization failed' });
  }
};

// Authorization middleware for verified users only
export const requireVerified: RequestHandler = (req, res, next) => {
  try {
    const user = (req as any).user;
    
    if (!user) {
      return res.status(401).json({ error: 'Authentication required' });
    }
    
    if (!user.isVerified) {
      return res.status(403).json({ error: 'Account verification required' });
    }
    
    next();
  } catch (error) {
    console.error('Verification check error:', error);
    res.status(403).json({ error: 'Verification check failed' });
  }
};

// Rate limiting middleware (basic implementation)
const requestCounts = new Map<string, { count: number; resetTime: number }>();

export const rateLimit = (maxRequests: number = 100, windowMs: number = 15 * 60 * 1000): RequestHandler => {
  return (req, res, next) => {
    try {
      const clientId = req.ip || req.headers['x-forwarded-for'] as string || 'unknown';
      const now = Date.now();
      
      const clientData = requestCounts.get(clientId);
      
      if (!clientData || now > clientData.resetTime) {
        // Reset or initialize counter
        requestCounts.set(clientId, {
          count: 1,
          resetTime: now + windowMs
        });
        return next();
      }
      
      if (clientData.count >= maxRequests) {
        return res.status(429).json({
          error: 'Too many requests',
          retryAfter: Math.ceil((clientData.resetTime - now) / 1000)
        });
      }
      
      clientData.count++;
      next();
    } catch (error) {
      console.error('Rate limiting error:', error);
      next(); // Continue on error to avoid blocking legitimate requests
    }
  };
};

// Input validation middleware
export const validateProfileUpdate: RequestHandler = (req, res, next) => {
  try {
    const { name, email, phone, address, city, country } = req.body;
    const errors: string[] = [];
    
    // Validate name
    if (name && (typeof name !== 'string' || name.trim().length < 2)) {
      errors.push('Name must be at least 2 characters long');
    }
    
    // Validate email
    if (email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (typeof email !== 'string' || !emailRegex.test(email)) {
        errors.push('Please provide a valid email address');
      }
    }
    
    // Validate phone (optional)
    if (phone && typeof phone !== 'string') {
      errors.push('Phone number must be a string');
    }
    
    // Validate address fields (optional)
    if (address && typeof address !== 'string') {
      errors.push('Address must be a string');
    }
    
    if (city && typeof city !== 'string') {
      errors.push('City must be a string');
    }
    
    if (country && typeof country !== 'string') {
      errors.push('Country must be a string');
    }
    
    if (errors.length > 0) {
      return res.status(400).json({ error: 'Validation failed', details: errors });
    }
    
    next();
  } catch (error) {
    console.error('Validation error:', error);
    res.status(400).json({ error: 'Validation failed' });
  }
};

// Password validation middleware
export const validatePasswordChange: RequestHandler = (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const errors: string[] = [];
    
    if (!currentPassword || typeof currentPassword !== 'string') {
      errors.push('Current password is required');
    }
    
    if (!newPassword || typeof newPassword !== 'string') {
      errors.push('New password is required');
    } else {
      // Password strength validation
      if (newPassword.length < 8) {
        errors.push('New password must be at least 8 characters long');
      }
      
      if (!/(?=.*[a-z])/.test(newPassword)) {
        errors.push('New password must contain at least one lowercase letter');
      }
      
      if (!/(?=.*[A-Z])/.test(newPassword)) {
        errors.push('New password must contain at least one uppercase letter');
      }
      
      if (!/(?=.*\d)/.test(newPassword)) {
        errors.push('New password must contain at least one number');
      }
    }
    
    if (errors.length > 0) {
      return res.status(400).json({ error: 'Password validation failed', details: errors });
    }
    
    next();
  } catch (error) {
    console.error('Password validation error:', error);
    res.status(400).json({ error: 'Password validation failed' });
  }
};