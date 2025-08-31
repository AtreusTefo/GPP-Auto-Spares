interface CategoryCardProps {
  name: string;
  imageUrl?: string;
  bgColor?: string;
}

function CategoryCard({ name, imageUrl, bgColor = 'bg-gray-200' }: CategoryCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow cursor-pointer">
      <div className={`h-24 ${bgColor} flex items-center justify-center relative`}>
        {imageUrl ? (
          <img src={imageUrl} alt={name} className="w-full h-full object-cover" />
        ) : (
          <div className="text-gray-600 text-2xl">🔧</div>
        )}
        {/* Overlay gradient for better text readability */}
        <div className="absolute inset-0 bg-black bg-opacity-20"></div>
      </div>
      <div className="p-3">
        <p className="text-sm font-montserrat font-semibold text-gray-800 text-center">
          {name}
        </p>
      </div>
    </div>
  );
}

export default function CategorySection() {
  const categories = [
    { name: 'Suspension Parts', bgColor: 'bg-blue-100' },
    { name: 'Electrical Equipment', bgColor: 'bg-yellow-100' },
    { name: 'Interiors', bgColor: 'bg-green-100' },
    { name: 'Engines', bgColor: 'bg-red-100' },
    { name: 'Exteriors', bgColor: 'bg-purple-100' },
    { name: 'Engine Parts', bgColor: 'bg-orange-100' },
    { name: 'Gearboxes', bgColor: 'bg-pink-100' },
    { name: 'Cooling Systems', bgColor: 'bg-teal-100' },
  ];

  return (
    <section className="py-12 bg-white">
      <div className="container mx-auto px-4">
        {/* Section header */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-800 font-montserrat">
            Category
          </h2>
        </div>

        {/* Categories grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-4">
          {categories.map((category, index) => (
            <CategoryCard
              key={index}
              name={category.name}
              bgColor={category.bgColor}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
