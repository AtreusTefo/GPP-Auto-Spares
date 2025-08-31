interface CategoryCardProps {
  name: string;
  bgColor?: string;
}

function CategoryCard({ name, bgColor = 'bg-gray-200' }: CategoryCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow cursor-pointer">
      <div className={`h-20 sm:h-24 ${bgColor} flex items-center justify-center relative`}>
        <div className="text-gray-600 text-xl sm:text-2xl">🔧</div>
        {/* Overlay gradient for better text readability */}
        <div className="absolute inset-0 bg-black bg-opacity-20"></div>
      </div>
      <div className="p-2 sm:p-3">
        <p className="text-xs sm:text-sm font-montserrat font-semibold text-gray-800 text-center leading-tight">
          {name}
        </p>
      </div>
    </div>
  );
}

interface CategoryGridProps {
  title: string;
  backgroundColor?: string;
}

export default function CategoryGrid({ title, backgroundColor = 'bg-gray-50' }: CategoryGridProps) {
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
    <section className={`py-8 sm:py-12 ${backgroundColor}`}>
      <div className="container mx-auto px-4">
        {/* Section header - no View All button */}
        <div className="mb-6 sm:mb-8">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-800 font-montserrat">
            {title}
          </h2>
        </div>

        {/* Categories grid - responsive layout */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-3 sm:gap-4">
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
