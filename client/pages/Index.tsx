import Header from '../components/Header';
import Hero from '../components/Hero';
import ProductSection from '../components/ProductSection';
import PartsGrid from '../components/PartsGrid';
import CategorySection from '../components/CategorySection';
import Footer from '../components/Footer';
import { Product } from '../../shared/types';

export default function Index() {
  // Sample product data for the sections
  const usedProducts: Product[] = [
    {
      id: 'P8000',
      title: 'MAZDA AXELA 1.5 1.8L ENGINE',
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

  const brandNewProducts: Product[] = [
    {
      id: 'P8002',
      title: 'MAZDA AXELA 1.5 1.8L ENGINE (Brand New)',
      price: 15000,
      status: 'Active',
      category: 'Engines',
      image: '/Images/MAZDA AXELA 1.5 1.8 L ENGINE.png',
      dateAdded: '2024-01-14',
      views: 234,
      stock: 1
    },
    {
      id: 'P10000',
      title: 'VW POLO 6R 1.6T ENGINE (Brand New)',
      price: 18500,
      status: 'Active',
      category: 'Engines',
      image: '/Images/VW POLO 6R 1.6T ENGINE.png',
      dateAdded: '2024-01-13',
      views: 189,
      stock: 2
    },
    {
      id: 'P1001',
      title: 'VW POLO 6R SIDE MIRRORS (Brand New)',
      price: 1500,
      status: 'Active',
      category: 'Exteriors',
      image: '/Images/VW 6R SIDE MIRRORS.png',
      dateAdded: '2024-01-11',
      views: 156,
      stock: 5
    },
    {
      id: 'P851',
      title: 'VW GOLF 5 & 6 GTI VW POLO 6R FUEL PUMP (Brand New)',
      price: 1200,
      status: 'Active',
      category: 'Fuel Systems',
      image: '/Images/VW GOLF 5 & 6 GTI VW POLO 6R FUEL PUMP.png',
      dateAdded: '2024-01-09',
      views: 78,
      stock: 0
    },
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
