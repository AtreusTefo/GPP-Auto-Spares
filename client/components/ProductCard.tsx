import { Link } from 'react-router-dom';
import { ShoppingCart, Plus } from 'lucide-react';
import { useCart } from '../contexts/CartContext';
import { Button } from './ui/button';
import { useToast } from '../hooks/use-toast';

interface ProductCardProps {
  productCode: string;
  description: string;
  imageUrl?: string;
  price?: number;
  category?: string;
  inStock?: boolean;
}

export default function ProductCard({ 
  productCode, 
  description, 
  imageUrl, 
  price = 0, 
  category, 
  inStock = true 
}: ProductCardProps) {
  const { addToCart } = useCart();
  const { toast } = useToast();
  
  // Create a simple slug from product code for the URL
  const productSlug = productCode.replace(/\s+/g, '-').toLowerCase();
  
  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent navigation when clicking the button
    e.stopPropagation();
    
    const product = {
      id: productCode,
      productCode,
      description,
      price,
      imageUrl,
      category,
      inStock
    };
    
    const success = await addToCart(product, 1);
    if (success) {
      toast({
        title: "Added to cart",
        description: `${description} has been added to your cart`
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
    <Link to={`/product/${productSlug}`} className="block">
      <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow cursor-pointer">
        {/* Product image placeholder */}
        <div className="h-28 sm:h-32 bg-gray-200 flex items-center justify-center relative">
          {imageUrl ? (
            <img src={imageUrl} alt={description} className="w-full h-full object-cover" />
          ) : (
            <div className="text-gray-500 text-xs sm:text-sm font-montserrat">No Image</div>
          )}
          {/* Overlay gradient for better text readability */}
          <div className="absolute inset-0 bg-black bg-opacity-20"></div>
        </div>

        {/* Product details */}
        <div className="p-3 sm:p-4">
          <p className="text-xs sm:text-sm text-gray-600 font-montserrat font-semibold mb-1">
            {productCode}
          </p>
          <p className="text-xs sm:text-sm text-gray-800 font-montserrat leading-tight mb-2">
            {description}
          </p>
          
          {/* Price and Add to Cart */}
          <div className="flex items-center justify-between mt-3">
            <div className="flex flex-col">
              {price > 0 && (
                <span className="text-sm sm:text-base font-bold text-gray-900">
                  {formatPrice(price)}
                </span>
              )}
              {category && (
                <span className="text-xs text-gray-500">
                  {category}
                </span>
              )}
            </div>
            
            {inStock && price > 0 && (
              <Button
                size="sm"
                onClick={handleAddToCart}
                className="flex items-center space-x-1 text-xs"
              >
                <Plus className="h-3 w-3" />
                <span className="hidden sm:inline">Add</span>
              </Button>
            )}
            
            {!inStock && (
              <span className="text-xs text-red-500 font-medium">
                Out of Stock
              </span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}
