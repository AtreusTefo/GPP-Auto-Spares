import { Search, ShoppingCart, Menu, X, User, ChevronDown } from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router-dom';

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false); // TODO: Replace with actual auth state

  return (
    <header className="bg-gpp-navy text-white">
      {/* Top bar with contact info and auth buttons */}
      <div className="bg-gpp-blue px-4 py-1 text-xs sm:text-sm">
        <div className="flex flex-col sm:flex-row sm:justify-between items-center space-y-1 sm:space-y-0">
          {/* Contact Info */}
          <div className="flex flex-col sm:flex-row items-center space-y-1 sm:space-y-0">
            <span className="font-montserrat">📞 (+267) 75363264 / 71235651</span>
            <span className="sm:ml-4 font-montserrat">✉️ gastonma@gmail.com</span>
          </div>
          
          {/* Auth Buttons - Only show when not authenticated */}
          {!isAuthenticated && (
            <div className="flex items-center space-x-2 sm:space-x-4">
              <Link
                to="/login"
                className="font-montserrat font-medium hover:text-gray-200 transition-colors px-2 py-1 rounded"
              >
                Sign In
              </Link>
              <span className="text-gray-300">|</span>
              <Link
                to="/signup"
                className="font-montserrat font-medium hover:text-gray-200 transition-colors px-2 py-1 rounded"
              >
                Create Account
              </Link>
            </div>
          )}
        </div>
      </div>
      
      {/* Main header */}
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center">
            <a href="/" className="hover:opacity-80 transition-opacity">
              <img
                src="https://cdn.builder.io/api/v1/image/assets%2F29449c4a506b4f0da87f7d56d9c46785%2Fda0116fa42404c2ebfbf9d24c7d2bf88?format=webp&width=800"
                alt="GPP Auto Spares Logo"
                className="w-auto h-16 sm:h-20 md:h-24"
              />
            </a>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            <a href="/" className="font-montserrat font-semibold hover:text-gray-300 transition-colors">
              Home
            </a>
            <div className="font-montserrat font-semibold hover:text-gray-300 transition-colors">
              Category
            </div>
            <div className="font-montserrat font-semibold hover:text-gray-300 transition-colors">
              How To Buy
            </div>
            <div className="font-montserrat font-semibold hover:text-gray-300 transition-colors">
              Contact Us
            </div>
            <div className="font-montserrat font-semibold hover:text-gray-300 transition-colors">
              About
            </div>
          </nav>

          {/* Icons */}
          <div className="flex items-center space-x-4">
            <button 
              className="hover:text-gray-300 transition-colors"
              onClick={() => setIsSearchOpen(true)}
              title="Search"
            >
              <Search size={20} />
            </button>
            <button className="hover:text-gray-300 transition-colors" title="Shopping Cart">
              <ShoppingCart size={20} />
            </button>
            
            {/* User Menu - Only show when authenticated */}
            {isAuthenticated && (
              <div className="relative">
                <button 
                  className="flex items-center space-x-1 hover:text-gray-300 transition-colors" 
                  title="Account"
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                >
                  <User size={20} />
                  <ChevronDown size={16} className={`transform transition-transform ${isUserMenuOpen ? 'rotate-180' : ''}`} />
                </button>
                
                {/* User Dropdown Menu */}
                {isUserMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50">
                    <a
                      href="#"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 font-montserrat"
                      onClick={() => setIsUserMenuOpen(false)}
                    >
                      My Profile
                    </a>
                    <a
                      href="#"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 font-montserrat"
                      onClick={() => setIsUserMenuOpen(false)}
                    >
                      My Orders
                    </a>
                    <a
                      href="#"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 font-montserrat"
                      onClick={() => setIsUserMenuOpen(false)}
                    >
                      Account Settings
                    </a>
                    <hr className="my-1" />
                    <button
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 font-montserrat"
                      onClick={() => {
                        setIsAuthenticated(false);
                        setIsUserMenuOpen(false);
                      }}
                    >
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            )}
            
            {/* Mobile menu button */}
            <button 
              className="md:hidden hover:text-gray-300 transition-colors"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <nav className="md:hidden mt-4 border-t border-gray-600 pt-4">
            <div className="flex flex-col space-y-3">
              <a href="/" className="font-montserrat font-semibold hover:text-gray-300 transition-colors">
                Home
              </a>
              <div className="font-montserrat font-semibold hover:text-gray-300 transition-colors">
                Category
              </div>
              <div className="font-montserrat font-semibold hover:text-gray-300 transition-colors">
                How To Buy
              </div>
              <div className="font-montserrat font-semibold hover:text-gray-300 transition-colors">
                Contact Us
              </div>
              <div className="font-montserrat font-semibold hover:text-gray-300 transition-colors">
                About
              </div>
              
              {/* Mobile Auth Section */}
              <hr className="my-3 border-gray-600" />
              {!isAuthenticated ? (
                <>
                  <Link
                    to="/login"
                    className="font-montserrat font-semibold hover:text-gray-300 transition-colors"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Sign In
                  </Link>
                  <Link
                    to="/signup"
                    className="font-montserrat font-semibold hover:text-gray-300 transition-colors"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Create Account
                  </Link>
                </>
              ) : (
                <>
                  <a
                    href="#"
                    className="font-montserrat font-semibold hover:text-gray-300 transition-colors"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    My Profile
                  </a>
                  <a
                    href="#"
                    className="font-montserrat font-semibold hover:text-gray-300 transition-colors"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    My Orders
                  </a>
                  <a
                    href="#"
                    className="font-montserrat font-semibold hover:text-gray-300 transition-colors"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Account Settings
                  </a>
                  <button
                    className="font-montserrat font-semibold hover:text-gray-300 transition-colors text-left"
                    onClick={() => {
                      setIsAuthenticated(false);
                      setIsMobileMenuOpen(false);
                    }}
                  >
                    Sign Out
                  </button>
                </>
              )}
            </div>
          </nav>
        )}

        {/* Search Modal */}
        {isSearchOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Search Products</h3>
                <button 
                  onClick={() => setIsSearchOpen(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X size={20} />
                </button>
              </div>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search for car parts..."
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gpp-blue focus:border-transparent text-gray-900"
                  autoFocus
                />
                <Search className="absolute right-3 top-2.5 text-gray-400" size={20} />
              </div>
              <button className="w-full mt-4 bg-gpp-blue text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition-colors">
                Search
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
