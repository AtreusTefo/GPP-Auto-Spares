import { Link } from 'react-router-dom';
import { ShoppingCart, Plus } from 'lucide-react';
import { useCart } from '../contexts/CartContext';
import { Button } from './ui/button';
import { useToast } from '../hooks/use-toast';
import { Product } from '../../shared/types';

interface ProductCardProps {
  product: Product;
  viewMode?: 'grid' | 'list';
}

export default function ProductCard({ 
  product,
  viewMode = 'grid'
}: ProductCardProps) {
  const { addToCart } = useCart();
  const { toast } = useToast();
  
  // Create a simple slug from product title for the URL
  const productSlug = product.title.replace(/\s+/g, '-').toLowerCase();
  
  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent navigation when clicking the button
    e.stopPropagation();
    
    const cartProduct = {
      id: product.id,
      productCode: product.id,
      description: product.title,
      price: product.price,
      imageUrl: product.image,
      category: product.category,
      inStock: product.stock > 0
    };
    
    const success = await addToCart(cartProduct, 1);
    if (success) {
      toast({
        title: "Added to cart",
        description: `${product.title} has been added to your cart`
      });
    } else {
      toast({
        title: "Error",
        description: "Failed to add item to cart",
        variant: "destructive"
      });
    }
  };
  
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-ZA', {
      style: 'currency',
      currency: 'ZAR'
    }).format(price);
  };

  return (
    <Link to={`/product/${productSlug}`} className="block group">
      <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-all duration-200 cursor-pointer group-hover:scale-[1.02]">
        {/* Product image placeholder */}
        <div className="h-32 sm:h-36 md:h-40 bg-gray-200 flex items-center justify-center relative">
          {product.image ? (
            <img src={product.image} alt={product.title} className="w-full h-full object-cover" />
          ) : (
            <div className="text-gray-500 text-xs sm:text-sm font-montserrat">No Image</div>
          )}
          {/* Overlay gradient for better text readability */}
          <div className="absolute inset-0 bg-black bg-opacity-20"></div>
        </div>

        {/* Product details */}
        <div className="p-4 sm:p-5">
          <p className="text-sm sm:text-base text-gray-800 font-montserrat leading-tight mb-3 line-clamp-2">
            {product.title}
          </p>
          
          {/* Price and Add to Cart */}
          <div className="flex items-center justify-between mt-4">
            <div className="flex flex-col flex-1 mr-3">
              {product.price > 0 && (
                <span className="text-base sm:text-lg font-bold text-gray-900">
                  {formatPrice(product.price)}
                </span>
              )}
              {product.category && (
                <span className="text-xs sm:text-sm text-gray-500 mt-1">
                  {product.category}
                </span>
              )}
            </div>
            
            {product.stock > 0 && product.price > 0 && (
              <Button
                size="sm"
                onClick={handleAddToCart}
                className="flex items-center space-x-1 text-sm px-3 py-2 min-h-[40px] touch-manipulation"
              >
                <Plus className="h-4 w-4" />
                <span className="hidden sm:inline">Add</span>
              </Button>
            )}
            
            {product.stock === 0 && (
              <span className="text-sm text-red-500 font-medium px-2 py-1 bg-red-50 rounded">
                Out of Stock
              </span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}
