import React, { useState, useEffect } from 'react';
import { Link, useLocation, Outlet } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Package, 
  DollarSign, 
  Plus, 
  ShoppingCart, 
  Menu, 
  X,
  Home,
  ChevronRight
} from 'lucide-react';

const AdminDashboard: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const location = useLocation();

  // Close sidebar when route changes on mobile
  useEffect(() => {
    setIsSidebarOpen(false);
  }, [location.pathname]);

  // Prevent body scroll when sidebar is open on mobile
  useEffect(() => {
    if (isSidebarOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isSidebarOpen]);

  const navigationItems = [
    {
      name: 'Dashboard Overview',
      path: '/admin/dashboard',
      icon: LayoutDashboard,
      description: 'View KPIs and analytics'
    },
    {
      name: 'Products',
      path: '/admin/products',
      icon: Package,
      description: 'Manage product listings'
    },
    {
      name: 'Pricing',
      path: '/admin/pricing',
      icon: DollarSign,
      description: 'Set and edit prices'
    },
    {
      name: 'Add Product',
      path: '/admin/products/add',
      icon: Plus,
      description: 'Create new listing'
    },
    {
      name: 'Orders',
      path: '/admin/orders',
      icon: ShoppingCart,
      description: 'Manage customer orders'
    }
  ];

  const isActiveRoute = (path: string) => {
    return location.pathname === path || 
           (path === '/admin/dashboard' && location.pathname === '/admin');
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile Header */}
      <div className="lg:hidden bg-white shadow-sm border-b border-gray-200 px-4 py-4 flex items-center justify-between sticky top-0 z-30">
        <div className="flex items-center space-x-3">
          <button
            onClick={toggleSidebar}
            className="p-3 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors touch-manipulation min-w-[48px] min-h-[48px] flex items-center justify-center"
            aria-label="Open navigation menu"
            aria-expanded={isSidebarOpen}
          >
            <Menu size={24} />
          </button>
          <div className="flex-1 min-w-0">
            <h1 className="text-lg font-semibold text-gray-900 font-montserrat truncate">Admin Dashboard</h1>
            <p className="text-xs text-gray-500 font-montserrat">GPP Auto Spares</p>
          </div>
        </div>
        <Link 
          to="/" 
          className="p-3 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors touch-manipulation min-w-[48px] min-h-[48px] flex items-center justify-center"
          title="Back to Main Site"
          aria-label="Back to main website"
        >
          <Home size={24} />
        </Link>
      </div>

      {/* Sidebar Overlay for Mobile */}
      {isSidebarOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-black bg-opacity-60 z-40 transition-opacity duration-300"
          onClick={() => setIsSidebarOpen(false)}
          onKeyDown={(e) => {
            if (e.key === 'Escape') {
              setIsSidebarOpen(false);
            }
          }}
          role="button"
          tabIndex={0}
          aria-label="Close navigation menu"
        />
      )}

      {/* Sidebar */}
      <aside 
        className={`
          fixed top-0 left-0 h-full w-80 sm:w-72 bg-white shadow-xl transform transition-transform duration-300 ease-in-out z-50
          lg:w-64 lg:translate-x-0 lg:static lg:shadow-none lg:border-r lg:border-gray-200
          ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
        role="navigation"
        aria-label="Admin navigation"
        aria-hidden={!isSidebarOpen ? 'true' : 'false'}
      >
        {/* Sidebar Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex-1 min-w-0">
              <h2 className="text-xl font-bold text-gray-900 font-montserrat truncate">Admin Panel</h2>
              <p className="text-sm text-gray-500 mt-1">GPP Auto Spares</p>
            </div>
            <button
              onClick={toggleSidebar}
              className="lg:hidden p-3 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors touch-manipulation min-w-[48px] min-h-[48px] flex items-center justify-center ml-3"
              aria-label="Close navigation menu"
            >
              <X size={24} />
            </button>
          </div>
        </div>

        {/* Navigation */}
        <nav className="p-6 py-8 space-y-3 flex-1 overflow-y-auto" role="menu" aria-label="Admin dashboard navigation">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            const isActive = isActiveRoute(item.path);
            
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setIsSidebarOpen(false)}
                className={`
                  flex items-center space-x-4 px-5 py-4 rounded-xl transition-all duration-200 group touch-manipulation focus:outline-none focus:ring-2 focus:ring-gpp-blue focus:ring-offset-2 min-h-[64px]
                  ${isActive 
                    ? 'bg-gpp-blue text-white shadow-lg transform scale-[0.98]' 
                    : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900 active:bg-gray-200 active:scale-[0.98]'
                  }
                `}
                role="menuitem"
                aria-current={isActive ? 'page' : undefined}
                aria-describedby={`nav-desc-${item.path.replace(/[^a-zA-Z0-9]/g, '-')}`}
              >
                <Icon 
                  size={22} 
                  className={`
                    flex-shrink-0 ${isActive ? 'text-white' : 'text-gray-500 group-hover:text-gray-700'}
                  `} 
                />
                <div className="flex-1 min-w-0">
                  <div className={`font-semibold font-montserrat text-base ${
                    isActive ? 'text-white' : 'text-gray-900'
                  }`}>
                    {item.name}
                  </div>
                  <div 
                    className={`text-sm mt-1 ${
                      isActive ? 'text-blue-100' : 'text-gray-500'
                    }`}
                    id={`nav-desc-${item.path.replace(/[^a-zA-Z0-9]/g, '-')}`}
                  >
                    {item.description}
                  </div>
                </div>
                {isActive && (
                  <ChevronRight 
                    size={18} 
                    className="text-blue-200" 
                  />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Back to Main Site */}
        <div className="p-6 border-t border-gray-200 bg-gray-50 mt-auto">
          <Link
            to="/"
            className="flex items-center space-x-4 px-5 py-4 text-gray-600 hover:text-gpp-blue hover:bg-blue-50 active:bg-blue-100 rounded-xl transition-all duration-200 font-semibold font-montserrat touch-manipulation focus:outline-none focus:ring-2 focus:ring-gpp-blue focus:ring-offset-2 min-h-[64px] active:scale-[0.98]"
            aria-label="Back to main website"
          >
            <Home size={22} className="flex-shrink-0" />
            <span className="text-base">Back to Main Site</span>
            <ChevronRight size={18} className="text-gray-400 ml-auto" />
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <div className="lg:ml-64">
        <div className="p-4 sm:p-6">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;