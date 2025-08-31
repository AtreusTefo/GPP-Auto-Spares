import Header from '../components/Header';
import Hero from '../components/Hero';
import ProductSection from '../components/ProductSection';
import CategoryGrid from '../components/CategoryGrid';
import CategorySection from '../components/CategorySection';
import Footer from '../components/Footer';

export default function Index() {
  // Sample product data for the sections
  const featuredProducts = [
    { productCode: 'P8004400', description: 'MAZDA AXELA 1.5 1.8L ENGINE' },
    { productCode: 'P8004401', description: 'VW POLO 6R 1.6T ENGINE' },
    { productCode: 'P10000 EA EACH', description: 'VW POLO 6R SIDE MIRRORS' },
    { productCode: 'P8000450', description: 'VW GOLF 5 & 6 GTI VW POLO 6R FUEL PUMP' },
  ];

  const usedProducts = [
    { productCode: 'P8000.00', description: 'MAZDA AXELA 1.5 1.8L ENGINE' },
    { productCode: 'P8000.00', description: 'VW POLO 6R 1.6T ENGINE' },
    { productCode: 'P1000.00 EACH', description: 'VW POLO 6R SIDE MIRRORS' },
    { productCode: 'P850.00', description: 'VW GOLF 5 & 6 GTI VW POLO 6R FUEL PUMP' },
  ];

  const brandNewProducts = [
    { productCode: 'P8000.00', description: 'MAZDA AXELA 1.5 1.8L ENGINE' },
    { productCode: 'P10000.00', description: 'VW POLO 6R 1.6T ENGINE' },
    { productCode: 'P1000.00 EACH', description: 'VW POLO 6R SIDE MIRRORS' },
    { productCode: 'P850.00', description: 'VW GOLF 5 & 6 GTI VW POLO 6R FUEL PUMP' },
  ];

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <Hero />
      
      <CategoryGrid
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
