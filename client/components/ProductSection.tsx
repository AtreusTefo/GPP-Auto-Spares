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
    <section className={`py-12 ${backgroundColor}`}>
      <div className="container mx-auto px-4">
        {/* Section header */}
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold text-gray-800 font-montserrat">
            {title}
          </h2>
          <button className="bg-gpp-blue text-white px-6 py-2 rounded-md font-montserrat font-semibold hover:bg-gpp-navy transition-colors">
            View All
          </button>
        </div>

        {/* Products grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
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
