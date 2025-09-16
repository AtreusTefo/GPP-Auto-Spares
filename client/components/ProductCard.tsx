import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, Plus, Heart, Eye, Loader2 } from 'lucide-react';
import { useCart } from '../contexts/CartContext';
import { Button } from './ui/button';
import { useToast } from '../hooks/use-toast';
import { Product } from '../../shared/types';
import { cn } from '../lib/utils';
import { LazyImage } from './LazyImage';

interface ProductCardProps {
  product: Product;
  viewMode?: 'grid' | 'list';
  isWishlisted?: boolean;
  onToggleWishlist?: (productId: string) => void;
}

export default function ProductCard({ 
  product,
  viewMode = 'grid',
  isWishlisted = false,
  onToggleWishlist
}: ProductCardProps) {
  const { addToCart, isLoading, error, isInCart, getItemQuantity } = useCart();
  const { toast } = useToast();
  const [isAddingToCart, setIsAddingToCart] = React.useState(false);
  
  // Check if item is in cart and get current quantity
  const itemInCart = isInCart(product.id);
  const currentQuantity = getItemQuantity(product.id);
  const maxQuantity = product.stock || 0;
  const canAddMore = !itemInCart || currentQuantity < maxQuantity;
  
  // Create a simple slug from product title for the URL
  const productSlug = product.title.replace(/\s+/g, '-').toLowerCase();
  
  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent navigation when clicking the button
    e.stopPropagation();
    
    // Check stock before attempting to add
    if (isOutOfStock) {
      toast({
        title: "Out of Stock",
        description: `${product.title} is currently out of stock`,
        variant: "destructive"
      });
      return;
    }
    
    setIsAddingToCart(true);
    
    try {
      const cartProduct = {
        id: product.id,
        productCode: product.id,
        description: product.title,
        price: product.price,
        imageUrl: product.image,
        category: product.category,
        inStock: (product.stock || 0) > 0,
        maxQuantity: product.stock || undefined
      };
      
      const success = await addToCart(cartProduct, 1);
      if (success) {
        toast({
          title: "✅ Added to cart",
          description: `${product.title} has been added to your cart`,
          duration: 3000
        });
      } else {
        // Get the specific error message from cart context
        const errorMessage = error || "Failed to add item to cart. Please try again.";
        toast({
          title: "❌ Cannot add to cart",
          description: errorMessage,
          variant: "destructive",
          duration: 4000
        });
      }
    } finally {
      setIsAddingToCart(false);
    }
  };

  const handleToggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (onToggleWishlist) {
      onToggleWishlist(product.id);
      toast({
        title: isWishlisted ? "Removed from wishlist" : "Added to wishlist",
        description: `${product.title} has been ${isWishlisted ? 'removed from' : 'added to'} your wishlist`
      });
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-ZA', {
      style: 'currency',
      currency: 'ZAR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(price);
  };

  const isOutOfStock = (product.stock || 0) <= 0;

  if (viewMode === 'list') {
    return (
      <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-all duration-200">
        <div className="flex flex-col sm:flex-row">
          {/* Product Image */}
          <div className="w-full sm:w-48 h-48 sm:h-32 bg-gray-200 flex items-center justify-center relative flex-shrink-0">
             {product.image ? (
               <LazyImage
                 src={product.image} 
                 alt={product.title} 
                 className="w-full h-full"
               />
             ) : (
               <div className="text-gray-500 text-sm font-montserrat">No Image</div>
             )}
             {isOutOfStock && (
               <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                 <span className="text-white font-semibold">Out of Stock</span>
               </div>
             )}
           </div>

          {/* Product Details */}
          <div className="flex-1 p-4 sm:p-6">
            <div className="flex justify-between items-start mb-2">
              <Link to={`/product/${productSlug}`} className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900 hover:text-gpp-blue transition-colors line-clamp-2 font-montserrat">
                  {product.title}
                </h3>
              </Link>
              
              {/* Wishlist Button */}
              {onToggleWishlist && (
                <button
                  onClick={handleToggleWishlist}
                  className={cn(
                    "ml-2 p-2 rounded-full transition-colors",
                    isWishlisted 
                      ? "text-red-500 bg-red-50 hover:bg-red-100" 
                      : "text-gray-400 hover:text-red-500 hover:bg-red-50"
                  )}
                  aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
                >
                  <Heart size={20} fill={isWishlisted ? "currentColor" : "none"} />
                </button>
              )}
            </div>

            <div className="flex items-center justify-between mt-4">
              <div className="flex flex-col">
                <span className="text-xl font-bold text-gray-900 font-montserrat">
                  {formatPrice(product.price)}
                </span>
                {product.category && (
                  <span className="text-sm text-gray-500 font-montserrat">
                    {product.category}
                  </span>
                )}
                {product.stock !== undefined && (
                  <span className={cn(
                    "text-sm font-montserrat",
                    isOutOfStock ? "text-red-500" : "text-green-600"
                  )}>
                    {isOutOfStock ? "Out of Stock" : `${product.stock} in stock`}
                  </span>
                )}
              </div>

              <div className="flex items-center space-x-2">
                <Link to={`/product/${productSlug}`}>
                  <Button variant="outline" size="sm" className="font-montserrat">
                    <Eye size={16} className="mr-1" />
                    View
                  </Button>
                </Link>
                <Button 
                  onClick={handleAddToCart}
                  disabled={isOutOfStock || isAddingToCart || !canAddMore}
                  size="sm"
                  className="font-montserrat"
                >
                  {isAddingToCart ? (
                    <Loader2 size={16} className="mr-1 animate-spin" />
                  ) : (
                    <ShoppingCart size={16} className="mr-1" />
                  )}
                  {isAddingToCart ? "Adding..." : 
                   itemInCart ? (canAddMore ? `Add More (${currentQuantity}/${maxQuantity})` : `In Cart (${currentQuantity}/${maxQuantity})`) : 
                   "Add to Cart"}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Grid view (default)
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-all duration-200 group">
      {/* Product Image */}
      <div className="relative">
        <Link to={`/product/${productSlug}`}>
          <div className="h-48 bg-gray-200 flex items-center justify-center relative overflow-hidden">
             {product.image ? (
               <LazyImage
                 src={product.image} 
                 alt={product.title} 
                 className="w-full h-full group-hover:scale-105 transition-transform duration-300"
               />
             ) : (
               <div className="text-gray-500 text-sm font-montserrat">No Image</div>
             )}
             {isOutOfStock && (
               <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                 <span className="text-white font-semibold">Out of Stock</span>
               </div>
             )}
           </div>
        </Link>

        {/* Wishlist Button */}
        {onToggleWishlist && (
          <button
            onClick={handleToggleWishlist}
            className={cn(
              "absolute top-2 right-2 p-2 rounded-full transition-all duration-200 backdrop-blur-sm",
              isWishlisted 
                ? "text-red-500 bg-white/90 shadow-md" 
                : "text-gray-600 bg-white/70 hover:bg-white/90 hover:text-red-500"
            )}
            aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
          >
            <Heart size={18} fill={isWishlisted ? "currentColor" : "none"} />
          </button>
        )}
      </div>

      {/* Product Details */}
      <div className="p-4">
        <Link to={`/product/${productSlug}`}>
          <h3 className="text-base font-semibold text-gray-900 hover:text-gpp-blue transition-colors line-clamp-2 font-montserrat mb-2">
            {product.title}
          </h3>
        </Link>
        
        <div className="flex items-center justify-between mb-3">
          <span className="text-lg font-bold text-gray-900 font-montserrat">
            {formatPrice(product.price)}
          </span>
          {product.category && (
            <span className="text-xs text-gray-500 font-montserrat bg-gray-100 px-2 py-1 rounded">
              {product.category}
            </span>
          )}
        </div>

        {product.stock !== undefined && (
          <div className={cn(
            "text-sm font-montserrat mb-3",
            isOutOfStock ? "text-red-500" : "text-green-600"
          )}>
            {isOutOfStock ? "Out of Stock" : `${product.stock} in stock`}
          </div>
        )}

        <Button 
          onClick={handleAddToCart}
          disabled={isOutOfStock || isAddingToCart || !canAddMore}
          className="w-full font-montserrat"
          size="sm"
        >
          {isAddingToCart ? (
            <Loader2 size={16} className="mr-2 animate-spin" />
          ) : (
            <ShoppingCart size={16} className="mr-2" />
          )}
          {isOutOfStock ? "Out of Stock" : 
           isAddingToCart ? "Adding..." : 
           itemInCart ? (canAddMore ? `Add More (${currentQuantity}/${maxQuantity})` : `In Cart (${currentQuantity}/${maxQuantity})`) : 
           "Add to Cart"}
        </Button>
      </div>
    </div>
  );
}
