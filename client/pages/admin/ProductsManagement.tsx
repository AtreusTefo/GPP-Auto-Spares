import React, { useState } from 'react';
import { 
  Search, 
  Filter, 
  Edit, 
  Trash2, 
  Plus, 
  Eye, 
  MoreVertical,
  ChevronDown,
  ChevronUp,
  Package,
  X
} from 'lucide-react';
import { Link } from 'react-router-dom';

interface Product {
  id: string;
  title: string;
  price: number;
  status: 'Active' | 'Pending' | 'Sold' | 'Draft';
  category: string;
  image: string;
  dateAdded: string;
  views: number;
  stock: number;
}

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
    status: 'Sold',
    category: 'Engines',
    image: '/Images/VW POLO 6R 1.6T ENGINE.png',
    dateAdded: '2024-01-10',
    views: 156,
    stock: 0
  },
  {
    id: '4',
    title: 'BMW Head Lamps Set',
    price: 3500,
    status: 'Pending',
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
    status: 'Draft',
    category: 'Exteriors',
    image: '/Images/VW 6R SIDE MIRRORS.png',
    dateAdded: '2024-01-05',
    views: 45,
    stock: 6
  }
];

const ProductsManagement: React.FC = () => {
  const [products, setProducts] = useState<Product[]>(mockProducts);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [categoryFilter, setCategoryFilter] = useState<string>('All');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [productToDelete, setProductToDelete] = useState<string | null>(null);

  const categories = ['All', 'Engines', 'Gearboxes', 'Head Lamps', 'Exteriors', 'Interiors', 'Suspension'];
  const statuses = ['All', 'Active', 'Pending', 'Sold', 'Draft'];

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'All' || product.status === statusFilter;
    const matchesCategory = categoryFilter === 'All' || product.category === categoryFilter;
    return matchesSearch && matchesStatus && matchesCategory;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active': return 'bg-green-100 text-green-800';
      case 'Pending': return 'bg-yellow-100 text-yellow-800';
      case 'Sold': return 'bg-blue-100 text-blue-800';
      case 'Draft': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleDeleteProduct = (productId: string) => {
    setProductToDelete(productId);
    setShowDeleteModal(true);
  };

  const confirmDelete = () => {
    if (productToDelete) {
      setProducts(products.filter(p => p.id !== productToDelete));
      setProductToDelete(null);
      setShowDeleteModal(false);
    }
  };

  const handleSelectProduct = (productId: string) => {
    setSelectedProducts(prev => 
      prev.includes(productId) 
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    );
  };

  const handleSelectAll = () => {
    if (selectedProducts.length === filteredProducts.length) {
      setSelectedProducts([]);
    } else {
      setSelectedProducts(filteredProducts.map(p => p.id));
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 font-montserrat">Products Management</h1>
          <p className="text-gray-600 mt-1">Manage your product listings, prices, and inventory</p>
        </div>
        <Link
          to="/admin/add-product"
          className="inline-flex items-center px-4 py-2 bg-gpp-blue text-white rounded-lg hover:bg-gpp-navy transition-colors font-montserrat font-medium"
        >
          <Plus size={20} className="mr-2" />
          Add New Product
        </Link>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6">
        <div className="flex flex-col space-y-4">
          {/* Search */}
          <div className="w-full">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gpp-blue focus:border-transparent font-montserrat text-base"
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center justify-center space-x-2 px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-montserrat touch-manipulation"
            >
              <Filter size={20} />
              <span>Filters</span>
              {showFilters ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </button>
          </div>
        </div>

        {/* Filters */}
        {showFilters && (
          <div className="mt-6 pt-6 border-t border-gray-200">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 font-montserrat">Status</label>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gpp-blue focus:border-transparent font-montserrat text-base min-h-[48px] touch-manipulation"
                  aria-label="Filter by status"
                >
                  {statuses.map(status => (
                    <option key={status} value={status}>{status}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 font-montserrat">Category</label>
                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gpp-blue focus:border-transparent font-montserrat text-base min-h-[48px] touch-manipulation"
                  aria-label="Filter by category"
                >
                  {categories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Products Table/Cards */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        {/* Header */}
        <div className="px-4 sm:px-6 py-4 border-b border-gray-200 bg-gray-50">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <input
                type="checkbox"
                checked={selectedProducts.length === filteredProducts.length && filteredProducts.length > 0}
                onChange={handleSelectAll}
                className="rounded border-gray-300 text-gpp-blue focus:ring-gpp-blue"
              />
              <span className="text-sm font-medium text-gray-700 font-montserrat">
                {selectedProducts.length > 0 ? `${selectedProducts.length} selected` : `${filteredProducts.length} products`}
              </span>
            </div>
            {selectedProducts.length > 0 && (
              <button className="text-sm text-red-600 hover:text-red-800 font-montserrat">
                Delete Selected
              </button>
            )}
          </div>
        </div>

        {/* Mobile Card View */}
        <div className="block lg:hidden" role="region" aria-label="Products list">
          <div className="divide-y divide-gray-200">
            {filteredProducts.map((product) => (
              <div 
                key={product.id} 
                className="p-4 hover:bg-gray-50 transition-colors focus-within:bg-gray-50"
                role="article"
                aria-labelledby={`product-title-${product.id}`}
              >
                <div className="flex items-start space-x-3">
                  <input
                    type="checkbox"
                    checked={selectedProducts.includes(product.id)}
                    onChange={() => handleSelectProduct(product.id)}
                    className="rounded border-gray-300 text-gpp-blue focus:ring-gpp-blue focus:ring-offset-2 mt-1 flex-shrink-0"
                    aria-label={`Select ${product.title}`}
                  />
                  <img
                    src={product.image}
                    alt={`${product.title} product image`}
                    className="w-16 h-16 rounded-lg object-cover bg-gray-100 flex-shrink-0"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = '/placeholder.svg';
                    }}
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <h3 
                          id={`product-title-${product.id}`}
                          className="text-sm font-medium text-gray-900 font-montserrat line-clamp-2 mb-1"
                        >
                          {product.title}
                        </h3>
                        <p className="text-xs text-gray-500 mb-2">Added {product.dateAdded}</p>
                      </div>
                      <div className="flex items-center space-x-1 ml-2" role="group" aria-label="Product actions">
                        <Link
                          to={`/admin/add-product/${product.id}`}
                          className="p-2 text-gray-400 hover:text-gpp-blue transition-colors touch-manipulation focus:outline-none focus:ring-2 focus:ring-gpp-blue focus:ring-offset-2 rounded"
                          aria-label={`Edit ${product.title}`}
                        >
                          <Edit size={16} aria-hidden="true" />
                        </Link>
                        <button
                          onClick={() => handleDeleteProduct(product.id)}
                          className="p-2 text-gray-400 hover:text-red-600 transition-colors touch-manipulation focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 rounded"
                          aria-label={`Delete ${product.title}`}
                        >
                          <Trash2 size={16} aria-hidden="true" />
                        </button>
                        <button 
                          className="p-2 text-gray-400 hover:text-gray-600 transition-colors touch-manipulation focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 rounded"
                          aria-label={`More options for ${product.title}`}
                        >
                          <MoreVertical size={16} aria-hidden="true" />
                        </button>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div>
                        <span className="text-gray-500">Price:</span>
                        <span className="ml-1 font-medium text-gray-900 font-montserrat">P {product.price.toLocaleString()}</span>
                      </div>
                      <div>
                        <span className="text-gray-500">Stock:</span>
                        <span className={`ml-1 font-medium ${
                          product.stock === 0 ? 'text-red-600' : 
                          product.stock <= 2 ? 'text-yellow-600' : 'text-green-600'
                        }`}>
                          {product.stock}
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-500">Status:</span>
                        <span className={`ml-1 inline-flex px-2 py-0.5 text-xs font-medium rounded-full ${getStatusColor(product.status)}`}>
                          {product.status}
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-500">Views:</span>
                        <span className="ml-1 text-gray-600">{product.views}</span>
                      </div>
                    </div>
                    <div className="mt-2">
                      <span className="text-gray-500 text-sm">Category:</span>
                      <span className="ml-1 text-sm text-gray-900 font-montserrat">{product.category}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Desktop Table View */}
        <div className="hidden lg:block overflow-x-auto" role="region" aria-label="Products table">
          <table className="w-full" role="table" aria-label="Products management table">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider font-montserrat">Product</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider font-montserrat">Price</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider font-montserrat">Status</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider font-montserrat">Category</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider font-montserrat">Stock</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider font-montserrat">Views</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider font-montserrat">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredProducts.map((product) => (
                <tr key={product.id} className="hover:bg-gray-50 transition-colors focus-within:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-3">
                      <input
                        type="checkbox"
                        checked={selectedProducts.includes(product.id)}
                        onChange={() => handleSelectProduct(product.id)}
                        className="rounded border-gray-300 text-gpp-blue focus:ring-gpp-blue focus:ring-offset-2"
                        aria-label={`Select ${product.title}`}
                      />
                      <img
                        src={product.image}
                        alt={`${product.title} product image`}
                        className="w-12 h-12 rounded-lg object-cover bg-gray-100"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = '/placeholder.svg';
                        }}
                      />
                      <div>
                        <p className="text-sm font-medium text-gray-900 font-montserrat line-clamp-2">{product.title}</p>
                        <p className="text-xs text-gray-500">Added {product.dateAdded}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm font-medium text-gray-900 font-montserrat">P {product.price.toLocaleString()}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(product.status)}`}>
                      {product.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-gray-900 font-montserrat">{product.category}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`text-sm font-medium ${
                      product.stock === 0 ? 'text-red-600' : 
                      product.stock <= 2 ? 'text-yellow-600' : 'text-green-600'
                    }`}>
                      {product.stock}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-1">
                      <Eye size={14} className="text-gray-400" />
                      <span className="text-sm text-gray-600">{product.views}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-2" role="group" aria-label="Product actions">
                      <Link
                        to={`/admin/add-product/${product.id}`}
                        className="p-1 text-gray-400 hover:text-gpp-blue transition-colors focus:outline-none focus:ring-2 focus:ring-gpp-blue focus:ring-offset-2 rounded"
                        aria-label={`Edit ${product.title}`}
                      >
                        <Edit size={16} aria-hidden="true" />
                      </Link>
                      <button
                        onClick={() => handleDeleteProduct(product.id)}
                        className="p-1 text-gray-400 hover:text-red-600 transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 rounded"
                        aria-label={`Delete ${product.title}`}
                      >
                        <Trash2 size={16} aria-hidden="true" />
                      </button>
                      <button 
                        className="p-1 text-gray-400 hover:text-gray-600 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 rounded"
                        aria-label={`More options for ${product.title}`}
                      >
                        <MoreVertical size={16} aria-hidden="true" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredProducts.length === 0 && (
          <div className="text-center py-12">
            <Package size={48} className="mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 font-montserrat mb-2">No products found</h3>
            <p className="text-gray-600 mb-4">Try adjusting your search or filter criteria</p>
            <Link
              to="/admin/add-product"
              className="inline-flex items-center px-4 py-2 bg-gpp-blue text-white rounded-lg hover:bg-gpp-navy transition-colors font-montserrat"
            >
              <Plus size={20} className="mr-2" />
              Add Your First Product
            </Link>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 font-montserrat">Confirm Delete</h3>
              <button
                onClick={() => setShowDeleteModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X size={20} />
              </button>
            </div>
            <p className="text-gray-600 mb-6">Are you sure you want to delete this product? This action cannot be undone.</p>
            <div className="flex space-x-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-montserrat"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-montserrat"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductsManagement;