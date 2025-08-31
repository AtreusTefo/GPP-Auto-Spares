import { Search, ShoppingCart, Menu, X, User } from 'lucide-react';
import { useState } from 'react';

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  return (
    <header className="bg-gpp-navy text-white">
      {/* Top bar with contact info */}
      <div className="bg-gpp-blue px-4 py-1 text-right text-sm">
        <span className="font-montserrat">📞 (+267) 75363264 / 71235651</span>
        <span className="ml-4">✉️ gastonma@gmail.com</span>
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
                className="w-auto"
                style={{ height: '98px' }}
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
            <button className="hover:text-gray-300 transition-colors" title="Profile">
              <User size={20} />
            </button>
            
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
