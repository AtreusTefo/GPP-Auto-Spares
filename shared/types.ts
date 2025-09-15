export interface Product {
  id: string;
  title: string;
  price: number;
  status: 'Active' | 'Pending' | 'Sold' | 'Draft';
  category: string;
  image: string;
  dateAdded: string;
  views: number;
  stock: number;
  description?: string;
  condition?: 'New' | 'Used' | 'Refurbished';
  brand?: string;
  model?: string;
  year?: string;
  partNumber?: string;
}

export interface CartItem {
  id: string;
  productId: string;
  title: string;
  price: number;
  quantity: number;
  image: string;
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'customer';
  token?: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginationInfo {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
}

export interface ProductFilters {
  category?: string;
  status?: string;
  minPrice?: number;
  maxPrice?: number;
  search?: string;
}