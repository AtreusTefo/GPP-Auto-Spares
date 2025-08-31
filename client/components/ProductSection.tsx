import ProductCard from './ProductCard';

interface Product {
  productCode: string;
  description: string;
  imageUrl?: string;
}

interface ProductSectionProps {
  title: string;
  products: Product[];
  backgroundColor?: string;
}

export default function ProductSection({ title, products, backgroundColor = 'bg-gray-50' }: ProductSectionProps) {
  return (
    <section className={`py-8 sm:py-12 ${backgroundColor}`}>
      <div className="container mx-auto px-4">
        {/* Section header */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6 sm:mb-8 space-y-3 sm:space-y-0">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-800 font-montserrat">
            {title}
          </h2>
          <button className="bg-gpp-blue text-white px-4 sm:px-6 py-2 rounded-md font-montserrat font-semibold hover:bg-gpp-navy transition-colors text-sm sm:text-base self-start sm:self-auto">
            View All
          </button>
        </div>

        {/* Products grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {products.map((product, index) => (
            <ProductCard
              key={index}
              productCode={product.productCode}
              description={product.description}
              imageUrl={product.imageUrl}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
