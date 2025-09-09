import { Link } from 'react-router-dom';

interface ProductCardProps {
  productCode: string;
  description: string;
  imageUrl?: string;
}

export default function ProductCard({ productCode, description, imageUrl }: ProductCardProps) {
  // Create a simple slug from product code for the URL
  const productSlug = productCode.replace(/\s+/g, '-').toLowerCase();

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
          <p className="text-xs sm:text-sm text-gray-800 font-montserrat leading-tight">
            {description}
          </p>
        </div>
      </div>
    </Link>
  );
}
