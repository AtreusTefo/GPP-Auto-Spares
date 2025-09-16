import { useRef, useState, useEffect, useCallback } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import ProductCard from './ProductCard';
import { Product } from '../../shared/types';

interface ProductSectionProps {
  title: string;
  products: Product[];
  backgroundColor?: string;
}

export default function ProductSection({ title, products, backgroundColor = 'bg-gray-50' }: ProductSectionProps) {
  // Carousel state
  const gridRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  // Update scroll button states
  const updateScrollButtons = useCallback(() => {
    if (gridRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = gridRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 1);
    }
  }, []);

  // Scroll functions
  const scrollLeft = () => {
    if (gridRef.current) {
      const cardWidth = 320; // w-80 = 320px
      gridRef.current.scrollBy({ left: -cardWidth, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (gridRef.current) {
      const cardWidth = 320; // w-80 = 320px
      gridRef.current.scrollBy({ left: cardWidth, behavior: 'smooth' });
    }
  };

  // Update scroll buttons on scroll and resize
  useEffect(() => {
    const gridElement = gridRef.current;
    if (gridElement) {
      gridElement.addEventListener('scroll', updateScrollButtons);
      window.addEventListener('resize', updateScrollButtons);
      updateScrollButtons(); // Initial check

      return () => {
        gridElement.removeEventListener('scroll', updateScrollButtons);
        window.removeEventListener('resize', updateScrollButtons);
      };
    }
  }, [updateScrollButtons, products]);

  return (
    <section className={`py-10 sm:py-12 md:py-16 ${backgroundColor}`}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-8 sm:mb-10 space-y-4 sm:space-y-0 text-center sm:text-left">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800 font-montserrat">
            {title}
          </h2>
          <button className="bg-gpp-blue text-white px-6 sm:px-8 py-3 sm:py-4 rounded-lg font-montserrat font-semibold hover:bg-gpp-navy transition-colors text-base sm:text-lg self-center sm:self-auto touch-manipulation min-h-[48px]">
            View All
          </button>
        </div>

        {/* Products carousel */}
        <div className="relative">
          {/* Left arrow */}
          <button
            onClick={scrollLeft}
            disabled={!canScrollLeft}
            className={`absolute left-0 top-1/2 -translate-y-1/2 z-10 p-2 rounded-full shadow-lg transition-all duration-200 ${
              canScrollLeft
                ? 'bg-white hover:bg-gray-50 text-gray-700 hover:text-gray-900'
                : 'bg-gray-100 text-gray-400 cursor-not-allowed'
            }`}
            aria-label="Scroll left"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          {/* Right arrow */}
          <button
            onClick={scrollRight}
            disabled={!canScrollRight}
            className={`absolute right-0 top-1/2 -translate-y-1/2 z-10 p-2 rounded-full shadow-lg transition-all duration-200 ${
              canScrollRight
                ? 'bg-white hover:bg-gray-50 text-gray-700 hover:text-gray-900'
                : 'bg-gray-100 text-gray-400 cursor-not-allowed'
            }`}
            aria-label="Scroll right"
          >
            <ChevronRight className="w-6 h-6" />
          </button>

          {/* Scrollable grid container */}
          <div
            ref={gridRef}
            className="flex gap-6 overflow-x-auto scrollbar-hide px-8 py-2"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {products.map((product, index) => (
              <div key={product.id || index} className="flex-shrink-0 w-72 sm:w-80">
                <ProductCard
                  product={product}
                  viewMode="grid"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
