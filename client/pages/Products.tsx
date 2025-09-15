import React, { useState, useEffect } from 'react';
import { Search, Filter, Grid, List, SlidersHorizontal } from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import ProductCard from '../components/ProductCard';
import LoadingSpinner from '../components/LoadingSpinner';
import Pagination from '../components/Pagination';
import { Product, ProductFilters, PaginationInfo } from '../../shared/types';
import { cn } from '@/lib/utils';

// Mock products data - in a real app, this would come from an API
const mockProducts: Product[] = [
  {
    id: '1',
    title: 'VW Golf 6 GTI DSG 6 Speed Automatic Gearbox',
    price: 25000,
    status: 'Active',
    category: 'Gearboxes',
    image: '/Images/Golf 6 GTI DSG 6 speed automatic gearbox.png',
    dateAdded: '2024-01-15',
    views: 234,
    stock: 2
  },
  {
    id: '2',
    title: 'MAZDA AXELA 1.5 1.8 L ENGINE',
    price: 18500,
    status: 'Active',
    category: 'Engines',
    image: '/Images/MAZDA AXELA 1.5 1.8 L ENGINE.png',
    dateAdded: '2024-01-12',
    views: 189,
    stock: 1
  },
  {
    id: '3',
    title: 'VW POLO 6R 1.6T ENGINE',
    price: 22000,
    status: 'Active',
    category: 'Engines',
    image: '/Images/VW POLO 6R 1.6T ENGINE.png',
    dateAdded: '2024-01-10',
    views: 156,
    stock: 3
  },
  {
    id: '4',
    title: 'BMW Head Lamps Set',
    price: 3500,
    status: 'Active',
    category: 'Head Lamps',
    image: '/Images/Head Lamps.png',
    dateAdded: '2024-01-08',
    views: 98,
    stock: 4
  },
  {
    id: '5',
    title: 'VW 6R Side Mirrors',
    price: 1200,
    status: 'Active',
    category: 'Exteriors',
    image: '/Images/VW 6R SIDE MIRRORS.png',
    dateAdded: '2024-01-05',
    views: 45,
    stock: 6
  },
  {
    id: '6',
    title: 'Mazda Head Lamps',
    price: 2800,
    status: 'Active',
    category: 'Head Lamps',
    image: '/Images/Mazda HL.png',
    dateAdded: '2024-01-03',
    views: 67,
    stock: 2
  }
];

const categories = ['All', 'Engines', 'Gearboxes', 'Head Lamps', 'Exteriors', 'Interiors', 'Suspension'];
const sortOptions = [
  { value: 'newest', label: 'Newest First' },
  { value: 'oldest', label: 'Oldest First' },
  { value: 'price-low', label: 'Price: Low to High' },
  { value: 'price-high', label: 'Price: High to Low' },
  { value: 'popular', label: 'Most Popular' }
];

const Products: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<ProductFilters>({
    category: 'All',
    search: '',
    minPrice: undefined,
    maxPrice: undefined
  });
  const [sortBy, setSortBy] = useState('newest');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

  // Simulate API call
  useEffect(() => {
    const loadProducts = async () => {
      setLoading(true);
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      setProducts(mockProducts);
      setLoading(false);
    };

    loadProducts();
  }, []);

  // Filter and sort products
  const filteredProducts = React.useMemo(() => {
    let filtered = products.filter(product => {
      // Category filter
      if (filters.category && filters.category !== 'All' && product.category !== filters.category) {
        return false;
      }

      // Search filter
      if (filters.search) {
        const searchTerm = filters.search.toLowerCase();
        if (!product.title.toLowerCase().includes(searchTerm) && 
            !product.category.toLowerCase().includes(searchTerm)) {
          return false;
        }
      }

      // Price filters
      if (filters.minPrice && product.price < filters.minPrice) {
        return false;
      }
      if (filters.maxPrice && product.price > filters.maxPrice) {
        return false;
      }

      // Only show active products with stock
      return product.status === 'Active' && product.stock > 0;
    });

    // Sort products
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return new Date(b.dateAdded).getTime() - new Date(a.dateAdded).getTime();
        case 'oldest':
          return new Date(a.dateAdded).getTime() - new Date(b.dateAdded).getTime();
        case 'price-low':
          return a.price - b.price;
        case 'price-high':
          return b.price - a.price;
        case 'popular':
          return b.views - a.views;
        default:
          return 0;
      }
    });

    return filtered;
  }, [products, filters, sortBy]);

  // Pagination
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedProducts = filteredProducts.slice(startIndex, startIndex + itemsPerPage);
  
  const paginationInfo: PaginationInfo = {
    currentPage,
    totalPages,
    totalItems: filteredProducts.length,
    itemsPerPage
  };

  const handleFilterChange = (key: keyof ProductFilters, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setCurrentPage(1); // Reset to first page when filters change
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const clearFilters = () => {
    setFilters({
      category: 'All',
      search: '',
      minPrice: undefined,
      maxPrice: undefined
    });
    setCurrentPage(1);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="flex items-center justify-center py-20">
          <LoadingSpinner size="lg" text="Loading products..." />
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 font-montserrat mb-2">
            Our Products
          </h1>
          <p className="text-gray-600 font-montserrat">
            Browse our extensive collection of quality auto parts
          </p>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          {/* Search Bar */}
          <div className="mb-6">
            <div className="relative max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search products..."
                value={filters.search || ''}
                onChange={(e) => handleFilterChange('search', e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gpp-blue focus:border-transparent font-montserrat"
              />
            </div>
          </div>

          {/* Filter Toggle */}
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center space-x-2 text-gray-700 hover:text-gpp-blue transition-colors font-montserrat py-3 px-4 rounded-lg hover:bg-gray-50 touch-manipulation min-h-[48px]"
              aria-label={showFilters ? "Hide filters" : "Show filters"}
            >
              <SlidersHorizontal size={20} />
              <span>Filters</span>
            </button>
            
            <div className="flex items-center space-x-4">
              {/* View Mode Toggle */}
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setViewMode('grid')}
                  className={cn(
                    'p-3 rounded-lg transition-colors touch-manipulation min-w-[48px] min-h-[48px] flex items-center justify-center',
                    viewMode === 'grid' ? 'bg-gpp-blue text-white' : 'text-gray-600 hover:bg-gray-100'
                  )}
                  aria-label="Grid view"
                >
                  <Grid size={20} />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={cn(
                    'p-3 rounded-lg transition-colors touch-manipulation min-w-[48px] min-h-[48px] flex items-center justify-center',
                    viewMode === 'list' ? 'bg-gpp-blue text-white' : 'text-gray-600 hover:bg-gray-100'
                  )}
                  aria-label="List view"
                >
                  <List size={20} />
                </button>
              </div>

              {/* Sort Dropdown */}
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gpp-blue focus:border-transparent font-montserrat text-base min-h-[48px] touch-manipulation"
                aria-label="Sort products"
              >
                {sortOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Filters Panel */}
          {showFilters && (
            <div className="border-t pt-4 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Category Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 font-montserrat">
                    Category
                  </label>
                  <select
                    value={filters.category || 'All'}
                    onChange={(e) => handleFilterChange('category', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gpp-blue focus:border-transparent font-montserrat"
                  >
                    {categories.map(category => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Price Range */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 font-montserrat">
                    Min Price
                  </label>
                  <input
                    type="number"
                    placeholder="0"
                    value={filters.minPrice || ''}
                    onChange={(e) => handleFilterChange('minPrice', e.target.value ? Number(e.target.value) : undefined)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gpp-blue focus:border-transparent font-montserrat"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 font-montserrat">
                    Max Price
                  </label>
                  <input
                    type="number"
                    placeholder="No limit"
                    value={filters.maxPrice || ''}
                    onChange={(e) => handleFilterChange('maxPrice', e.target.value ? Number(e.target.value) : undefined)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gpp-blue focus:border-transparent font-montserrat"
                  />
                </div>
              </div>

              <div className="flex justify-end">
                <button
                  onClick={clearFilters}
                  className="px-4 py-2 text-sm text-gray-600 hover:text-gpp-blue transition-colors font-montserrat"
                >
                  Clear Filters
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Results Info */}
        <div className="flex items-center justify-between mb-6">
          <p className="text-gray-600 font-montserrat">
            Showing {paginatedProducts.length} of {filteredProducts.length} products
          </p>
        </div>

        {/* Products Grid/List */}
        {paginatedProducts.length > 0 ? (
          <div className={cn(
            'mb-8',
            viewMode === 'grid' 
              ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'
              : 'space-y-4'
          )}>
            {paginatedProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                viewMode={viewMode}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <Filter size={48} className="mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 font-montserrat mb-2">
              No products found
            </h3>
            <p className="text-gray-600 mb-4">
              Try adjusting your search or filter criteria
            </p>
            <button
              onClick={clearFilters}
              className="px-4 py-2 bg-gpp-blue text-white rounded-lg hover:bg-gpp-navy transition-colors font-montserrat"
            >
              Clear Filters
            </button>
          </div>
        )}

        {/* Pagination */}
        {paginatedProducts.length > 0 && totalPages > 1 && (
          <Pagination
            paginationInfo={paginationInfo}
            onPageChange={handlePageChange}
            className="mt-8"
          />
        )}
      </main>

      <Footer />
    </div>
  );
};

export default Products;