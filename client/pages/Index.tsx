import Header from '../components/Header';
import Hero from '../components/Hero';
import ProductSection from '../components/ProductSection';
import PartsGrid from '../components/PartsGrid';
import CategorySection from '../components/CategorySection';
import Footer from '../components/Footer';

export default function Index() {
  // Sample product data for the sections
  const featuredProducts = [
    { productCode: 'P8004400', description: 'MAZDA AXELA 1.5 1.8L ENGINE', price: 8500, category: 'Engines', inStock: true },
    { productCode: 'P8004401', description: 'VW POLO 6R 1.6T ENGINE', price: 12500, category: 'Engines', inStock: true },
    { productCode: 'P10000', description: 'VW POLO 6R SIDE MIRRORS', price: 1200, category: 'Body Parts', inStock: true },
    { productCode: 'P8000450', description: 'VW GOLF 5 & 6 GTI VW POLO 6R FUEL PUMP', price: 950, category: 'Fuel System', inStock: true },
  ];

  const usedProducts = [
    { productCode: 'P8000', description: 'MAZDA AXELA 1.5 1.8L ENGINE', imageUrl: '/Images/MAZDA AXELA 1.5 1.8 L ENGINE.png', price: 8000, category: 'Engines', inStock: true },
    { productCode: 'P8001', description: 'VW POLO 6R 1.6T ENGINE', imageUrl: '/Images/VW POLO 6R 1.6T ENGINE.png', price: 8000, category: 'Engines', inStock: true },
    { productCode: 'P1000', description: 'VW POLO 6R SIDE MIRRORS', imageUrl: '/Images/VW 6R SIDE MIRRORS.png', price: 1000, category: 'Body Parts', inStock: true },
    { productCode: 'P850', description: 'VW GOLF 5 & 6 GTI VW POLO 6R FUEL PUMP', imageUrl: '/Images/VW GOLF 5 & 6 GTI VW POLO 6R FUEL PUMP.png', price: 850, category: 'Fuel System', inStock: true },
  ];

  const brandNewProducts = [
    { productCode: 'P8002', description: 'MAZDA AXELA 1.5 1.8L ENGINE', price: 15000, category: 'Engines', inStock: true },
    { productCode: 'P10000', description: 'VW POLO 6R 1.6T ENGINE', price: 18500, category: 'Engines', inStock: true },
    { productCode: 'P1001', description: 'VW POLO 6R SIDE MIRRORS', price: 1500, category: 'Body Parts', inStock: true },
    { productCode: 'P851', description: 'VW GOLF 5 & 6 GTI VW POLO 6R FUEL PUMP', price: 1200, category: 'Fuel System', inStock: false },
  ];

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <Hero />
      
      <PartsGrid
        title="Car Parts"
        backgroundColor="bg-gpp-light-blue"
      />
      
      <ProductSection
        title="Used Parts"
        products={usedProducts}
        backgroundColor="bg-white"
      />
      
      <ProductSection 
        title="Brand New" 
        products={brandNewProducts}
        backgroundColor="bg-gpp-light-blue"
      />
      
      <CategorySection />
      
      <Footer />
    </div>
  );
}
