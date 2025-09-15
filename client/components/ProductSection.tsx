import ProductCard from './ProductCard';
import { Product } from '../../shared/types';

interface ProductSectionProps {
  title: string;
  products: Product[];
  backgroundColor?: string;
}

export default function ProductSection({ title, products, backgroundColor = 'bg-gray-50' }: ProductSectionProps) {
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

        {/* Products grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-8">
          {products.map((product, index) => (
            <ProductCard
              key={product.id || index}
              product={product}
              viewMode="grid"
            />
          ))}
        </div>
      </div>
    </section>
  );
}
