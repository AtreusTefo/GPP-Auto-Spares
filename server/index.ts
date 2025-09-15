import "dotenv/config";
import express from "express";
import cors from "cors";
import { handleDemo } from "./routes/demo";
import {
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart,
  saveForLater,
  moveToCart,
  removeSavedItem,
  applyPromoCode,
  removePromoCode,
  validateCart
} from './routes/cart';
import { getProfile, updateProfile, uploadProfilePicture, changePassword, getSettings, updateSettings, getActivityLogs, deleteAccount } from './routes/profile';
import { authenticate, requireVerified, validateProfileUpdate, validatePasswordChange, rateLimit } from './middleware/auth';

export function createServer() {
  const app = express();

  // Middleware
  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Example API routes
  app.get("/api/ping", (_req, res) => {
    const ping = process.env.PING_MESSAGE ?? "ping";
    res.json({ message: ping });
  });

  app.get("/api/demo", handleDemo);

  // Cart API routes
  app.get('/api/cart', getCart);
  app.post('/api/cart/add', addToCart);
  app.put('/api/cart/item/:itemId', updateCartItem);
  app.delete('/api/cart/item/:itemId', removeFromCart);
  app.delete('/api/cart/clear', clearCart);
  app.post('/api/cart/save-for-later/:itemId', saveForLater);
  app.post('/api/cart/move-to-cart/:itemId', moveToCart);
  app.delete('/api/cart/saved/:itemId', removeSavedItem);
  app.post('/api/cart/promo-code', applyPromoCode);
  app.delete('/api/cart/promo-code', removePromoCode);
  app.post('/api/cart/validate', validateCart);

  // Profile routes with authentication
app.get('/api/profile', authenticate, requireVerified, getProfile);
app.put('/api/profile', authenticate, requireVerified, validateProfileUpdate, updateProfile);
app.post('/api/profile/upload-picture', authenticate, requireVerified, rateLimit(10, 60000), uploadProfilePicture);
app.post('/api/profile/change-password', authenticate, requireVerified, validatePasswordChange, changePassword);
app.get('/api/profile/settings', authenticate, requireVerified, getSettings);
app.put('/api/profile/settings', authenticate, requireVerified, updateSettings);
app.get('/api/profile/activity', authenticate, requireVerified, getActivityLogs);
app.delete('/api/profile/delete-account', authenticate, requireVerified, rateLimit(1, 300000), deleteAccount);

  return app;
}
