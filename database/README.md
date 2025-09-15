# GPP Website - Supabase Database Setup

This directory contains the database schema and setup instructions for the GPP Website Supabase integration.

## Quick Setup

### 1. Environment Variables

The following environment variables are already configured in your `.env` file:

```env
VITE_SUPABASE_URL=https://bdyqcefcjfwbiuicsbbq.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJkeXFjZWZjamZ3Yml1aWNzYmJxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc5NDI3NDksImV4cCI6MjA3MzUxODc0OX0.BFqZo0kDdc_TuCW_uu5HRaP0P-wktrQKUahK9XBMH7Q
```

### 2. Database Schema

To set up the database schema in your Supabase project:

1. Go to your Supabase Dashboard: https://supabase.com/dashboard
2. Navigate to your project: `bdyqcefcjfwbiuicsbbq`
3. Go to the SQL Editor
4. Copy and paste the contents of `schema.sql` into the editor
5. Click "Run" to execute the schema

### 3. Database Tables

The schema creates the following tables:

#### `profiles`
- User profile information
- Automatically created when users sign up
- Linked to Supabase Auth users

#### `products`
- Product catalog with inventory tracking
- Supports categories, pricing, and status management
- Includes view counting and user association

#### `orders` (Future use)
- Customer order tracking
- Payment and shipping status
- Linked to user profiles

#### `order_items` (Future use)
- Individual items within orders
- Quantity and pricing per item

### 4. Security Features

#### Row Level Security (RLS)
- All tables have RLS enabled
- Users can only access their own data
- Products are publicly viewable when active
- Secure by default

#### Authentication
- Integrated with Supabase Auth
- Automatic profile creation on signup
- Session management handled automatically

### 5. Real-time Features

- Real-time product updates
- Live inventory tracking
- Automatic UI updates when data changes

## Usage in the Application

### Authentication

```typescript
import { useAuth } from './contexts/AuthContext';

const { user, signIn, signUp, signOut, profile, updateProfile } = useAuth();

// Sign up new user
const handleSignUp = async () => {
  const { data, error } = await signUp('user@example.com', 'password', { name: 'John Doe' });
};

// Sign in existing user
const handleSignIn = async () => {
  const { data, error } = await signIn('user@example.com', 'password');
};

// Update user profile
const handleUpdateProfile = async () => {
  const { data, error } = await updateProfile({ name: 'New Name', city: 'New City' });
};
```

### Products Management

```typescript
import { useProducts } from './contexts/ProductsContext';

const { products, createProduct, updateProduct, deleteProduct, fetchProducts } = useProducts();

// Create new product
const handleCreateProduct = async () => {
  const { data, error } = await createProduct({
    title: 'New Product',
    description: 'Product description',
    price: 29.99,
    category: 'Electronics',
    stock: 10,
    status: 'active'
  });
};

// Fetch products with filters
const handleFetchProducts = async () => {
  await fetchProducts({ category: 'Electronics', status: 'active', limit: 20 });
};
```

### Direct Database Access

```typescript
import { dbHelpers } from './lib/supabase';

// Get user profile
const { data: profile, error } = await dbHelpers.profiles.get(userId);

// Get all products
const { data: products, error } = await dbHelpers.products.getAll({ category: 'Electronics' });

// Create new product
const { data: product, error } = await dbHelpers.products.create(productData);
```

## Error Handling

All database operations include comprehensive error handling:

- Network errors
- Authentication errors
- Validation errors
- Permission errors
- Database constraint violations

Errors are logged to the console and returned to the calling code for appropriate user feedback.

## Performance Optimizations

- Database indexes on frequently queried columns
- Efficient RLS policies
- Real-time subscriptions only when needed
- Local state caching in React contexts
- Optimistic updates for better UX

## Security Best Practices

- Environment variables for sensitive data
- Row Level Security on all tables
- Input validation and sanitization
- Secure authentication flows
- Proper error handling without data leakage

## Troubleshooting

### Common Issues

1. **Connection Issues**
   - Verify environment variables are correct
   - Check Supabase project status
   - Ensure network connectivity

2. **Authentication Issues**
   - Check if email confirmation is required
   - Verify user credentials
   - Check Supabase Auth settings

3. **Permission Issues**
   - Verify RLS policies are correctly applied
   - Check user authentication status
   - Ensure proper table permissions

4. **Real-time Issues**
   - Check if real-time is enabled in Supabase
   - Verify subscription setup
   - Check browser console for errors

### Getting Help

- Supabase Documentation: https://supabase.com/docs
- Supabase Community: https://github.com/supabase/supabase/discussions
- Project Issues: Check the project's GitHub issues

## Migration Notes

This integration maintains backward compatibility with the existing authentication system:

- Owner authentication still works via localStorage
- New Supabase users get the 'user' role
- Existing UI components work with both systems
- Gradual migration path available