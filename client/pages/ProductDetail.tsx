import { useState } from 'react';
import { ShoppingCart, MessageCircle, Plus, Minus } from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import ProductCard from '../components/ProductCard';
import { Product } from '../../shared/types';

export default function ProductDetail() {
  const [quantity, setQuantity] = useState(1);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  const productImages = [
    'https://cdn.builder.io/api/v1/image/assets%2F29449c4a506b4f0da87f7d56d9c46785%2F7bd48f0481d84c1b91e6e9bf64be0fa6?format=webp&width=800',
    'https://cdn.builder.io/api/v1/image/assets%2F29449c4a506b4f0da87f7d56d9c46785%2F7bd48f0481d84c1b91e6e9bf64be0fa6?format=webp&width=800',
    'https://cdn.builder.io/api/v1/image/assets%2F29449c4a506b4f0da87f7d56d9c46785%2F7bd48f0481d84c1b91e6e9bf64be0fa6?format=webp&width=800',
    'https://cdn.builder.io/api/v1/image/assets%2F29449c4a506b4f0da87f7d56d9c46785%2F7bd48f0481d84c1b91e6e9bf64be0fa6?format=webp&width=800',
  ];

  const specifications = [
    { label: 'Make', value: 'VOLKSWAGEN' },
    { label: 'Model', value: 'POLO' },
    { label: 'Car Model', value: 'VW POLO 6R' },
    { label: 'Car Year', value: 'POLO' },
    { label: 'Year', value: '2005' },
    { label: 'Fuel Type', value: 'PETROL' },
    { label: 'Engine Number', value: 'BKY' },
    { label: 'Displacement', value: '1200' },
    { label: 'Transmission', value: 'AUTOMATIC' },
  ];

  const relatedProducts: Product[] = [
    {
      id: 'P8000',
      title: 'MAZDA AXELA 1.5 2.0L ENGINE',
      price: 8000,
      status: 'Active',
      category: 'Engines',
      image: '/Images/MAZDA AXELA 1.5 1.8 L ENGINE.png',
      dateAdded: '2024-01-15',
      views: 145,
      stock: 2
    },
    {
      id: 'P8001',
      title: 'VW POLO 6R 1.6T ENGINE',
      price: 8000,
      status: 'Active',
      category: 'Engines',
      image: '/Images/VW POLO 6R 1.6T ENGINE.png',
      dateAdded: '2024-01-12',
      views: 98,
      stock: 1
    },
    {
      id: 'P1000',
      title: 'VW POLO 6R SIDE MIRRORS',
      price: 1000,
      status: 'Active',
      category: 'Exteriors',
      image: '/Images/VW 6R SIDE MIRRORS.png',
      dateAdded: '2024-01-10',
      views: 67,
      stock: 3
    },
    {
      id: 'P850',
      title: 'VW GOLF 5 & 6 GTI VW POLO 6R FUEL PUMP',
      price: 850,
      status: 'Active',
      category: 'Fuel Systems',
      image: '/Images/VW GOLF 5 & 6 GTI VW POLO 6R FUEL PUMP.png',
      dateAdded: '2024-01-08',
      views: 89,
      stock: 4
    },
  ];

  const incrementQuantity = () => setQuantity(prev => prev + 1);
  const decrementQuantity = () => setQuantity(prev => Math.max(1, prev - 1));

  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      {/* Product Detail Section */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Product Images */}
          <div className="space-y-4">
            {/* Main Image */}
            <div className="bg-gray-100 rounded-lg overflow-hidden">
              <img 
                src={productImages[selectedImageIndex]} 
                alt="VW Polo Engine"
                className="w-full h-80 object-cover"
              />
            </div>
            
            {/* Image Thumbnails */}
            <div className="flex space-x-2">
              {productImages.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImageIndex(index)}
                  className={`w-16 h-16 bg-gpp-beige rounded border-2 overflow-hidden ${
                    selectedImageIndex === index ? 'border-gpp-blue' : 'border-transparent'
                  }`}
                >
                  <img 
                    src={image} 
                    alt={`Product view ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Product Information */}
          <div className="space-y-6">
            {/* Product Title */}
            <div>
              <h1 className="text-2xl font-bold text-gray-800 font-montserrat mb-2">
                [USED ENGINE]
              </h1>
              <h2 className="text-xl font-semibold text-gray-700 font-montserrat">
                VW POLO 6R CBZ 1.2L ENGINE BKY 2005 AUTOMATIC #000324771445
              </h2>
            </div>

            {/* Price */}
            <div>
              <span className="text-3xl font-bold text-gray-800 font-montserrat">
                P8000.00
              </span>
            </div>

            {/* Quantity Selector */}
            <div className="flex items-center space-x-4">
              <span className="font-montserrat font-semibold text-gray-700">Quantity:</span>
              <div className="flex items-center border border-gray-300 rounded">
                <button
                  onClick={decrementQuantity}
                  className="p-3 hover:bg-gray-100 transition-colors touch-manipulation min-w-[48px] min-h-[48px] flex items-center justify-center"
                  aria-label="Decrease quantity"
                >
                  <Minus size={18} />
                </button>
                <span className="px-4 py-2 font-montserrat font-semibold">{quantity}</span>
                <button
                  onClick={incrementQuantity}
                  className="p-3 hover:bg-gray-100 transition-colors touch-manipulation min-w-[48px] min-h-[48px] flex items-center justify-center"
                  aria-label="Increase quantity"
                >
                  <Plus size={18} />
                </button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              <button className="w-full bg-gpp-blue text-white py-4 rounded-md font-montserrat font-semibold hover:bg-gpp-navy transition-colors flex items-center justify-center gap-2 min-h-[48px] touch-manipulation">
                <ShoppingCart size={20} />
                Add to Cart
              </button>
              <button className="w-full bg-blue-600 text-white py-4 rounded-md font-montserrat font-semibold hover:bg-blue-700 transition-colors min-h-[48px] touch-manipulation">
                Buy Now
              </button>
              <button className="w-full bg-green-500 text-white py-4 rounded-md font-montserrat font-semibold hover:bg-green-600 transition-colors flex items-center justify-center gap-2 min-h-[48px] touch-manipulation">
                <MessageCircle size={20} />
                WhatsApp
              </button>
            </div>

            {/* Availability Notice */}
            <div className="bg-gray-50 p-4 rounded-md">
              <p className="text-sm text-gray-600 font-montserrat">
                Pickup available at <b>GPP AUTO SPARES SHOP</b>
              </p>
              <p className="text-sm text-gray-600 font-montserrat">
                Usually ready in 24 hours
              </p>
              <a href="#" className="text-sm text-gpp-blue font-montserrat hover:underline">
                View store information
              </a>
            </div>

            {/* Specifications Table */}
            <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
              <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
                <h3 className="font-montserrat font-semibold text-gray-800">Specifications</h3>
              </div>
              <div className="divide-y divide-gray-200">
                {specifications.map((spec, index) => (
                  <div key={index} className="px-4 py-2 grid grid-cols-2 gap-4">
                    <span className="font-montserrat text-gray-600">{spec.label}</span>
                    <span className="font-montserrat text-gray-800">{spec.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Related Products */}
        <div>
          <h3 className="text-2xl font-bold text-gray-800 font-montserrat mb-6">
            Related Products
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {relatedProducts.map((product, index) => (
              <ProductCard
                key={index}
                product={product}
                viewMode="grid"
              />
            ))}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
