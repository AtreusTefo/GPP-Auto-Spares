import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { Search, Filter, Grid, List, SlidersHorizontal, Heart, RefreshCw, AlertCircle, ChevronLeft, ChevronRight } from 'lucide-react';
import { useSearchParams } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import ProductCard from '../components/ProductCard';
import LoadingSpinner from '../components/LoadingSpinner';
import Pagination from '../components/Pagination';
import { Product, ProductFilters, PaginationInfo } from '../../shared/types';
import { useProducts } from '../contexts/ProductsContext';
import { cn } from '@/lib/utils';
import { useToast } from '../hooks/use-toast';
import { Helmet } from 'react-helmet-async';
import { Product as SupabaseProduct } from '../lib/supabase';

// Debounce hook for search optimization
const useDebounce = (value: string, delay: number) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

// Convert SupabaseProduct to shared Product type
const mapSupabaseProductToShared = (supabaseProduct: SupabaseProduct): Product => {
  return {
    id: supabaseProduct.id,
    title: supabaseProduct.title,
    price: supabaseProduct.price,
    status: supabaseProduct.status === 'active' ? 'Active' : 
            supabaseProduct.status === 'pending' ? 'Pending' :
            supabaseProduct.status === 'sold' ? 'Sold' : 'Draft',
    category: supabaseProduct.category,
    image: supabaseProduct.image_url || '',
    dateAdded: supabaseProduct.created_at,
    views: supabaseProduct.views,
    stock: supabaseProduct.stock,
    description: supabaseProduct.description,
  };
};

const categories = ['All', 'Engines', 'Gearboxes', 'Head Lamps', 'Exteriors', 'Interiors', 'Suspension', 'Fuel Systems', 'Cooling Systems', 'Electrical Equipment'];
const sortOptions = [
  { value: 'newest', label: 'Newest First' },
  { value: 'oldest', label: 'Oldest First' },
  { value: 'price-low', label: 'Price: Low to High' },
  { value: 'price-high', label: 'Price: High to Low' },
  { value: 'popular', label: 'Most Popular' },
  { value: 'name-asc', label: 'Name A-Z' },
  { value: 'name-desc', label: 'Name Z-A' }
];

const Products: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { products, loading, error, fetchProducts, subscribeToProducts, unsubscribeFromProducts } = useProducts();
  const { toast } = useToast();
  
  // State management
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showFilters, setShowFilters] = useState(false);
  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '');
  const [filters, setFilters] = useState<ProductFilters>({
    category: searchParams.get('category') || 'All',
    search: searchParams.get('search') || '',
    minPrice: searchParams.get('minPrice') ? Number(searchParams.get('minPrice')) : undefined,
    maxPrice: searchParams.get('maxPrice') ? Number(searchParams.get('maxPrice')) : undefined
  });
  const [sortBy, setSortBy] = useState(searchParams.get('sort') || 'newest');
  const [currentPage, setCurrentPage] = useState(Number(searchParams.get('page')) || 1);
  const [wishlist, setWishlist] = useState<string[]>([]);
  const itemsPerPage = 12;

  // Carousel state and refs
  const gridRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  // Debounced search for performance
  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  // Initialize data and subscriptions
  useEffect(() => {
    const initializeProducts = async () => {
      try {
        await fetchProducts({ status: 'active' });
        subscribeToProducts();
      } catch (err) {
        console.error('Failed to initialize products:', err);
        toast({
          title: "Error",
          description: "Failed to load products. Please try again.",
          variant: "destructive",
        });
      }
    };

    initializeProducts();

    return () => {
      unsubscribeFromProducts();
    };
  }, []);

  // Update URL parameters when filters change
  useEffect(() => {
    const params = new URLSearchParams();
    if (filters.category && filters.category !== 'All') params.set('category', filters.category);
    if (debouncedSearchTerm) params.set('search', debouncedSearchTerm);
    if (filters.minPrice) params.set('minPrice', filters.minPrice.toString());
    if (filters.maxPrice) params.set('maxPrice', filters.maxPrice.toString());
    if (sortBy !== 'newest') params.set('sort', sortBy);
    if (currentPage > 1) params.set('page', currentPage.toString());
    
    setSearchParams(params);
  }, [filters, debouncedSearchTerm, sortBy, currentPage, setSearchParams]);

  // Update search filter when debounced term changes
  useEffect(() => {
    setFilters(prev => ({ ...prev, search: debouncedSearchTerm }));
    setCurrentPage(1); // Reset to first page on search
  }, [debouncedSearchTerm]);

  // Wishlist management
  const toggleWishlist = useCallback((productId: string) => {
    setWishlist(prev => 
      prev.includes(productId) 
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    );
  }, []);

  // Carousel scroll functions
  const updateScrollButtons = useCallback(() => {
    if (gridRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = gridRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 1);
    }
  }, []);

  const scrollLeft = useCallback(() => {
    if (gridRef.current) {
      const cardWidth = gridRef.current.children[0]?.getBoundingClientRect().width || 300;
      const gap = 24; // 6 * 4px (gap-6)
      const scrollAmount = cardWidth + gap;
      gridRef.current.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
    }
  }, []);

  const scrollRight = useCallback(() => {
    if (gridRef.current) {
      const cardWidth = gridRef.current.children[0]?.getBoundingClientRect().width || 300;
      const gap = 24; // 6 * 4px (gap-6)
      const scrollAmount = cardWidth + gap;
      gridRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  }, []);

  // Filter and sort products with memoization for performance
  const filteredProducts = useMemo(() => {
    if (!products || products.length === 0) return [];
    
    let filtered = products.filter(product => {
      const matchesCategory = filters.category === 'All' || product.category === filters.category;
      const matchesSearch = !filters.search || 
        product.title.toLowerCase().includes(filters.search.toLowerCase()) ||
        product.category.toLowerCase().includes(filters.search.toLowerCase()) ||
        (product.description && product.description.toLowerCase().includes(filters.search.toLowerCase()));
      const matchesMinPrice = !filters.minPrice || product.price >= filters.minPrice;
      const matchesMaxPrice = !filters.maxPrice || product.price <= filters.maxPrice;
      const isActive = product.status === 'active' || product.status === 'pending' || product.status === 'sold' || product.status === 'draft';
      
      return matchesCategory && matchesSearch && matchesMinPrice && matchesMaxPrice && isActive;
    });

    // Sort products
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'price-low':
          return a.price - b.price;
        case 'price-high':
          return b.price - a.price;
        case 'oldest':
          return new Date(a.created_at || '').getTime() - new Date(b.created_at || '').getTime();
        case 'popular':
          return (b.views || 0) - (a.views || 0);
        case 'name-asc':
          return a.title.localeCompare(b.title);
        case 'name-desc':
          return b.title.localeCompare(a.title);
        case 'newest':
        default:
          return new Date(b.created_at || '').getTime() - new Date(a.created_at || '').getTime();
      }
    });

    return filtered;
  }, [products, filters, sortBy]);

  // Pagination with memoization
  const paginationData = useMemo(() => {
    const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const paginatedProducts = filteredProducts.slice(startIndex, startIndex + itemsPerPage);

    return {
      products: paginatedProducts,
      pagination: {
        currentPage,
        totalPages,
        totalItems: filteredProducts.length,
        itemsPerPage
      } as PaginationInfo
    };
  }, [filteredProducts, currentPage, itemsPerPage]);

  // Update scroll buttons when products change or on scroll
  useEffect(() => {
    updateScrollButtons();
    const handleScroll = () => updateScrollButtons();
    const gridElement = gridRef.current;
    
    if (gridElement) {
      gridElement.addEventListener('scroll', handleScroll);
      return () => gridElement.removeEventListener('scroll', handleScroll);
    }
  }, [updateScrollButtons, paginationData.products]);

  // Update scroll buttons when window resizes
  useEffect(() => {
    const handleResize = () => updateScrollButtons();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [updateScrollButtons]);

  // Event handlers with useCallback for performance

  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const handleRefresh = useCallback(async () => {
    try {
      await fetchProducts({ status: 'active' });
      toast({
        title: "Success",
        description: "Products refreshed successfully.",
      });
    } catch (err) {
      console.error('Failed to refresh products:', err);
      toast({
        title: "Error",
        description: "Failed to refresh products. Please try again.",
        variant: "destructive",
      });
    }
  }, [fetchProducts, toast]);

  // SEO meta data
  useEffect(() => {
    const title = filters.category !== 'All' 
      ? `${filters.category} - GPP Auto Spares`
      : 'Auto Parts & Spares - GPP Auto Spares';
    
    const description = filters.search
      ? `Search results for "${filters.search}" in auto parts and spares`
      : `Browse our extensive collection of ${filters.category !== 'All' ? filters.category.toLowerCase() : 'auto parts and spares'}. Quality guaranteed.`;

    document.title = title;
    
    // Update meta description
    let metaDescription = document.querySelector('meta[name="description"]');
    if (!metaDescription) {
      metaDescription = document.createElement('meta');
      metaDescription.setAttribute('name', 'description');
      document.head.appendChild(metaDescription);
    }
    metaDescription.setAttribute('content', description);
  }, [filters.category, filters.search]);

  const clearFilters = useCallback(() => {
    setFilters({
      category: 'All',
      search: '',
      minPrice: undefined,
      maxPrice: undefined
    });
    setSearchTerm('');
    setCurrentPage(1);
  }, []);

  // Event handlers with useCallback for performance
  const handleSearchChange = useCallback((value: string) => {
    setSearchTerm(value);
  }, []);

  const handleFilterChange = useCallback((updates: Partial<ProductFilters>) => {
    setFilters(prev => ({ ...prev, ...updates }));
    setCurrentPage(1);
  }, []);

  const handleSortChange = useCallback((value: string) => {
    setSortBy(value);
  }, []);

  // SEO and meta data - must be before any conditional returns
  const pageTitle = useMemo(() => {
    const parts = ['Products'];
    if (filters.category && filters.category !== 'All') {
      parts.unshift(filters.category);
    }
    if (filters.search) {
      parts.unshift(`"${filters.search}"`);
    }
    parts.push('GPP Auto Spares');
    return parts.join(' - ');
  }, [filters.category, filters.search]);

  const metaDescription = useMemo(() => {
    let description = 'Browse our extensive collection of quality auto parts and accessories at GPP Auto Spares.';
    if (filters.category && filters.category !== 'All') {
      description = `Shop ${filters.category} parts and accessories at GPP Auto Spares.`;
    }
    if (filters.search) {
      description = `Search results for "${filters.search}" at GPP Auto Spares.`;
    }
    return description;
  }, [filters.category, filters.search]);

  // Error boundary fallback
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="container mx-auto px-4 py-16">
          <div className="text-center">
            <AlertCircle className="mx-auto h-16 w-16 text-red-500 mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Something went wrong</h2>
            <p className="text-gray-600 mb-6">We couldn't load the products. Please try again.</p>
            <button
              onClick={handleRefresh}
              className="bg-gpp-blue text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-montserrat"
            >
              Try Again
            </button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

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
    <>
      <Helmet>
        <title>{pageTitle}</title>
        <meta name="description" content={metaDescription} />
        <meta name="keywords" content="auto parts, car parts, automotive accessories, spare parts, GPP Auto Spares" />
        <meta property="og:title" content={pageTitle} />
        <meta property="og:description" content={metaDescription} />
        <meta property="og:type" content="website" />
        <link rel="canonical" href={`${window.location.origin}/products${searchParams.toString() ? `?${searchParams.toString()}` : ''}`} />
        
        {/* Structured data for products */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "CollectionPage",
            "name": pageTitle,
            "description": metaDescription,
            "url": `${window.location.origin}/products`,
            "mainEntity": {
              "@type": "ItemList",
              "numberOfItems": filteredProducts.length,
              "itemListElement": filteredProducts.slice(0, 10).map((product, index) => ({
                "@type": "Product",
                "position": index + 1,
                "name": product.title,
                "description": product.description || product.title,
                "offers": {
                  "@type": "Offer",
                  "price": product.price,
                  "priceCurrency": "ZAR",
                  "availability": product.stock > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock"
                }
              }))
            }
          })}
        </script>
      </Helmet>

      <div className="min-h-screen bg-gray-50">
        <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 font-montserrat mb-2">
            {filters.category !== 'All' ? filters.category : 'Our Products'}
          </h1>
          <p className="text-gray-600 font-montserrat">
            {filters.search 
              ? `Search results for "${filters.search}"`
              : 'Browse our extensive collection of quality auto parts'
            }
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
                value={searchTerm}
                onChange={(e) => handleSearchChange(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gpp-blue focus:border-transparent font-montserrat"
                aria-label="Search products"
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
                onChange={(e) => handleSortChange(e.target.value)}
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
                    onChange={(e) => handleFilterChange({ category: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gpp-blue focus:border-transparent font-montserrat"
                    aria-label="Filter by category"
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
                    Min Price (R)
                  </label>
                  <input
                    type="number"
                    placeholder="0"
                    value={filters.minPrice || ''}
                    onChange={(e) => handleFilterChange({ minPrice: e.target.value ? Number(e.target.value) : undefined })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gpp-blue focus:border-transparent font-montserrat"
                    min="0"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 font-montserrat">
                    Max Price (R)
                  </label>
                  <input
                    type="number"
                    placeholder="No limit"
                    value={filters.maxPrice || ''}
                    onChange={(e) => handleFilterChange({ maxPrice: e.target.value ? Number(e.target.value) : undefined })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gpp-blue focus:border-transparent font-montserrat"
                    min="0"
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
            Showing {paginationData.products.length} of {filteredProducts.length} products
          </p>
          <button
            onClick={handleRefresh}
            className="flex items-center space-x-2 px-3 py-2 text-sm text-gray-600 hover:text-gpp-blue transition-colors font-montserrat rounded-lg hover:bg-gray-50"
            aria-label="Refresh products"
          >
            <RefreshCw size={16} />
            <span>Refresh</span>
          </button>
        </div>

        {/* Products Grid/List */}
        {paginationData.products.length > 0 ? (
          viewMode === 'grid' ? (
            <div className="relative mb-8">
              {/* Left Arrow */}
              <button
                onClick={scrollLeft}
                className={cn(
                  'absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white shadow-lg rounded-full p-3 transition-all duration-200 hover:shadow-xl',
                  canScrollLeft 
                    ? 'text-gray-700 hover:text-gpp-blue cursor-pointer' 
                    : 'text-gray-300 cursor-not-allowed opacity-50'
                )}
                disabled={!canScrollLeft}
                aria-label="Scroll left"
              >
                <ChevronLeft size={24} />
              </button>

              {/* Right Arrow */}
              <button
                onClick={scrollRight}
                className={cn(
                  'absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white shadow-lg rounded-full p-3 transition-all duration-200 hover:shadow-xl',
                  canScrollRight 
                    ? 'text-gray-700 hover:text-gpp-blue cursor-pointer' 
                    : 'text-gray-300 cursor-not-allowed opacity-50'
                )}
                disabled={!canScrollRight}
                aria-label="Scroll right"
              >
                <ChevronRight size={24} />
              </button>

              {/* Scrollable Grid Container */}
              <div 
                ref={gridRef}
                className="overflow-x-auto scrollbar-hide px-12"
                style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
              >
                <div className="flex gap-6 pb-4">
                  {paginationData.products.map((product) => (
                    <div key={product.id} className="flex-none w-72 sm:w-80">
                      <ProductCard
                        product={mapSupabaseProductToShared(product)}
                        viewMode={viewMode}
                        isWishlisted={wishlist.includes(product.id)}
                        onToggleWishlist={toggleWishlist}
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-4 mb-8">
              {paginationData.products.map((product) => (
                <ProductCard
                  key={product.id}
                  product={mapSupabaseProductToShared(product)}
                  viewMode={viewMode}
                  isWishlisted={wishlist.includes(product.id)}
                  onToggleWishlist={toggleWishlist}
                />
              ))}
            </div>
          )
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
        {paginationData.products.length > 0 && paginationData.pagination.totalPages > 1 && (
          <Pagination
            paginationInfo={paginationData.pagination}
            onPageChange={handlePageChange}
            className="mt-8"
          />
        )}
      </main>

        <Footer />
      </div>
    </>
  );
};

export default Products;