import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, Menu, X, User, ShoppingCart, Phone, Mail, MapPin, ChevronDown, Shield, LogOut } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext';

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const { isAuthenticated, isOwner, user, logout } = useAuth();
  const { summary } = useCart();
  const navigate = useNavigate();

  return (
    <header className="bg-white text-black">
      {/* Top bar with contact info and auth buttons */}
      <div className="bg-gpp-blue px-2 sm:px-4 py-1 text-xs sm:text-sm hidden lg:block text-white">
        <div className="flex flex-col sm:flex-row sm:justify-between items-center space-y-1 sm:space-y-0">
          {/* Contact Info */}
          <div className="flex flex-col sm:flex-row items-center space-y-1 sm:space-y-0 text-center sm:text-left w-full sm:w-auto justify-center sm:justify-start">
            <span className="font-montserrat text-xs sm:text-sm flex items-center gap-1 justify-center"><Phone size={14} className="sm:w-4 sm:h-4" /> (+267) 75363264 / 71235651</span>
            <span className="sm:ml-4 font-montserrat text-xs sm:text-sm">✉️ gastonmaks@gmail.com</span>
          </div>
          
          {/* Auth Buttons - Only show when not authenticated */}
          {!isAuthenticated && (
            <div className="flex items-center space-x-2 sm:space-x-4 mt-1 sm:mt-0">
              <Link
                to="/login"
                className="font-montserrat font-medium hover:text-gray-200 transition-colors px-2 py-1 rounded text-xs sm:text-sm"
              >
                Sign In
              </Link>
              <span className="text-gray-300">|</span>
              <Link
                to="/signup"
                className="font-montserrat font-medium hover:text-gray-200 transition-colors px-2 py-1 rounded text-xs sm:text-sm"
              >
                Create Account
              </Link>
            </div>
          )}
        </div>
      </div>
      
      {/* Main header */}
      <div className="container mx-auto px-2 sm:px-4 py-2 sm:py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center flex-shrink-0">
            <Link to="/" className="hover:opacity-80 transition-opacity">
              <img
                src="https://cdn.builder.io/api/v1/image/assets%2F29449c4a506b4f0da87f7d56d9c46785%2Fda0116fa42404c2ebfbf9d24c7d2bf88?format=webp&width=800"
                alt="GPP Auto Spares Logo"
                className="w-auto h-12 sm:h-16 md:h-20 lg:h-24"
              />
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex space-x-4 xl:space-x-8">
            <Link to="/" className="font-montserrat font-semibold hover:text-gray-600 transition-colors text-sm xl:text-base">
              Home
            </Link>
            <div className="font-montserrat font-semibold hover:text-gray-600 transition-colors text-sm xl:text-base cursor-pointer">
              Category
            </div>
            <div className="font-montserrat font-semibold hover:text-gray-600 transition-colors text-sm xl:text-base cursor-pointer">
              How To Buy
            </div>
            <div className="font-montserrat font-semibold hover:text-gray-600 transition-colors text-sm xl:text-base cursor-pointer">
              Contact Us
            </div>
            <div className="font-montserrat font-semibold hover:text-gray-600 transition-colors text-sm xl:text-base cursor-pointer">
              About
            </div>
          </nav>

          {/* Icons */}
          <div className="flex items-center space-x-2 sm:space-x-4">
            <button 
              className="hover:text-gray-600 transition-colors p-3 rounded-md hover:bg-gray-100 touch-manipulation min-w-[48px] min-h-[48px] flex items-center justify-center"
              onClick={() => setIsSearchOpen(true)}
              title="Search"
              aria-label="Search products"
            >
              <Search size={20} />
            </button>
            <Link 
              to="/cart" 
              className="relative hover:text-gray-600 transition-colors p-3 rounded-md hover:bg-gray-100 touch-manipulation min-w-[48px] min-h-[48px] flex items-center justify-center" 
              title="Shopping Cart"
              aria-label={`Shopping cart with ${summary?.itemCount || 0} items`}
            >
              <ShoppingCart size={20} />
              {summary?.itemCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold">
                  {summary?.itemCount > 99 ? '99+' : summary?.itemCount}
                </span>
              )}
            </Link>
            
            {/* User Menu - Only show when authenticated */}
            {isAuthenticated && (
              <div className="relative">
                <button 
                  className="flex items-center space-x-1 hover:text-gray-600 transition-colors" 
                  title="Account"
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                >
                  <User size={20} />
                  <ChevronDown size={16} className={`transform transition-transform ${isUserMenuOpen ? 'rotate-180' : ''}`} />
                </button>
                
                {/* User Dropdown Menu */}
                {isUserMenuOpen && (
                  <div className="absolute right-0 mt-2 w-44 sm:w-48 bg-white rounded-md shadow-lg py-1 z-50 border border-gray-200">
                    {isOwner && (
                      <Link
                        to="/admin"
                        className="flex items-center px-3 sm:px-4 py-2 text-xs sm:text-sm text-gray-700 hover:bg-gray-100 font-montserrat transition-colors"
                        onClick={() => setIsUserMenuOpen(false)}
                      >
                        <Shield className="h-4 w-4 mr-2" />
                        Admin Dashboard
                      </Link>
                    )}
                    <hr className="my-1 border-gray-200" />
                    <Link
                      to="/profile"
                      className="block px-3 sm:px-4 py-2 text-xs sm:text-sm text-gray-700 hover:bg-gray-100 font-montserrat transition-colors"
                      onClick={() => setIsUserMenuOpen(false)}
                    >
                      My Profile
                    </Link>
                    <a
                      href="#"
                      className="block px-3 sm:px-4 py-2 text-xs sm:text-sm text-gray-700 hover:bg-gray-100 font-montserrat transition-colors"
                      onClick={() => setIsUserMenuOpen(false)}
                    >
                      My Orders
                    </a>
                    <a
                      href="#"
                      className="block px-3 sm:px-4 py-2 text-xs sm:text-sm text-gray-700 hover:bg-gray-100 font-montserrat transition-colors"
                      onClick={() => setIsUserMenuOpen(false)}
                    >
                      Account Settings
                    </a>
                    <hr className="my-1 border-gray-200" />
                    <button
                      onClick={() => {
                        logout();
                        setIsUserMenuOpen(false);
                        navigate('/');
                      }}
                      className="flex items-center w-full text-left px-3 sm:px-4 py-2 text-xs sm:text-sm text-gray-700 hover:bg-gray-100 font-montserrat transition-colors"
                    >
                      <LogOut className="h-4 w-4 mr-2" />
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            )}
            
            {/* Mobile menu button */}
            <button 
              className="lg:hidden hover:text-gray-600 transition-colors p-3 rounded-md hover:bg-gray-100 touch-manipulation min-w-[48px] min-h-[48px] flex items-center justify-center"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
              aria-expanded={isMobileMenuOpen}
            >
              {isMobileMenuOpen ? <X size={20} className="sm:w-6 sm:h-6" /> : <Menu size={20} className="sm:w-6 sm:h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <nav className="lg:hidden mt-3 sm:mt-4 border-t border-gray-300 pt-3 sm:pt-4">
            <div className="flex flex-col space-y-1">
              <Link to="/" className="font-montserrat font-semibold hover:text-gray-600 transition-colors text-base py-3 px-2 rounded-md hover:bg-gray-50 touch-manipulation">
                Home
              </Link>
              <div className="font-montserrat font-semibold hover:text-gray-600 transition-colors text-base py-3 px-2 cursor-pointer rounded-md hover:bg-gray-50 touch-manipulation">
                Category
              </div>
              <div className="font-montserrat font-semibold hover:text-gray-600 transition-colors text-base py-3 px-2 cursor-pointer rounded-md hover:bg-gray-50 touch-manipulation">
                How To Buy
              </div>
              <div className="font-montserrat font-semibold hover:text-gray-600 transition-colors text-base py-3 px-2 cursor-pointer rounded-md hover:bg-gray-50 touch-manipulation">
                Contact Us
              </div>
              <div className="font-montserrat font-semibold hover:text-gray-600 transition-colors text-base py-3 px-2 cursor-pointer rounded-md hover:bg-gray-50 touch-manipulation">
                About
              </div>
              
              {/* Mobile Auth Section */}
              <hr className="my-3 border-gray-300" />
              {!isAuthenticated ? (
                <>
                  <Link
                    to="/login"
                    className="font-montserrat font-semibold hover:text-gray-600 transition-colors text-base py-3 px-2 rounded-md hover:bg-gray-50 touch-manipulation"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Sign In
                  </Link>
                  <Link
                    to="/signup"
                    className="font-montserrat font-semibold hover:text-gray-600 transition-colors text-base py-3 px-2 rounded-md hover:bg-gray-50 touch-manipulation"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Create Account
                  </Link>
                </>
              ) : (
                <>
                  {isOwner && (
                    <Link
                      to="/admin"
                      className="flex items-center font-montserrat font-semibold hover:text-gray-600 transition-colors text-base py-3 px-2 rounded-md hover:bg-gray-50 touch-manipulation"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <Shield className="h-4 w-4 mr-2" />
                      Admin Dashboard
                    </Link>
                  )}
                  <Link
                    to="/profile"
                    className="font-montserrat font-semibold hover:text-gray-600 transition-colors text-base py-3 px-2 rounded-md hover:bg-gray-50 touch-manipulation"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    My Profile
                  </Link>
                  <a
                    href="#"
                    className="font-montserrat font-semibold hover:text-gray-600 transition-colors text-base py-3 px-2 rounded-md hover:bg-gray-50 touch-manipulation"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    My Orders
                  </a>
                  <a
                    href="#"
                    className="font-montserrat font-semibold hover:text-gray-600 transition-colors text-base py-3 px-2 rounded-md hover:bg-gray-50 touch-manipulation"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Account Settings
                  </a>
                  <button
                    onClick={() => {
                      logout();
                      setIsMobileMenuOpen(false);
                      navigate('/');
                    }}
                    className="flex items-center font-montserrat font-semibold hover:text-gray-600 transition-colors text-left text-base py-3 px-2 rounded-md hover:bg-gray-50 touch-manipulation w-full"
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    Sign Out
                  </button>
                </>
              )}
            </div>
          </nav>
        )}

        {/* Search Modal */}
        {isSearchOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-2 sm:p-4">
            <div className="bg-white rounded-lg p-4 sm:p-6 w-full max-w-sm sm:max-w-md mx-2">
              <div className="flex items-center justify-between mb-3 sm:mb-4">
                <h3 className="text-base sm:text-lg font-semibold text-gray-900 font-montserrat">Search Products</h3>
                <button 
                  onClick={() => setIsSearchOpen(false)}
                  className="text-gray-500 hover:text-gray-700 p-3 rounded-md hover:bg-gray-100 touch-manipulation min-w-[48px] min-h-[48px] flex items-center justify-center"
                  aria-label="Close search"
                >
                  <X size={20} />
                </button>
              </div>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search for car parts..."
                  className="w-full px-4 py-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gpp-blue focus:border-transparent text-gray-900 text-base font-montserrat min-h-[48px] touch-manipulation"
                  autoFocus
                />
                <Search className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              </div>
              <button className="w-full mt-4 bg-gpp-blue text-white py-4 px-4 rounded-lg hover:bg-blue-600 transition-colors text-base font-montserrat font-semibold min-h-[48px] touch-manipulation">
                Search
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
