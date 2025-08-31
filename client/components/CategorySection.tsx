interface CategoryCardProps {
  name: string;
  imageUrl?: string;
  bgColor?: string;
}

function CategoryCard({ name, imageUrl, bgColor = 'bg-gray-200' }: CategoryCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow cursor-pointer">
      <div className={`h-20 sm:h-24 md:h-28 ${bgColor} flex items-center justify-center relative`}>
        {imageUrl ? (
          <img src={imageUrl} alt={name} className="w-full h-full object-cover" />
        ) : (
          <div className="text-gray-600 text-xl sm:text-2xl">🔧</div>
        )}
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

export default function CategorySection() {
  const categories = [
    { name: 'Suspension Parts', bgColor: 'bg-blue-100', imageUrl: '/Images/Suspension Parts.jpg' },
    { name: 'Electrical Equipment', bgColor: 'bg-yellow-100', imageUrl: '/Images/Electrical Equipment.jpg' },
    { name: 'Interiors', bgColor: 'bg-green-100', imageUrl: '/Images/Interiors.jpg' },
    { name: 'Engines', bgColor: 'bg-red-100', imageUrl: '/Images/Engines.jpg' },
    { name: 'Exteriors', bgColor: 'bg-purple-100', imageUrl: '/Images/Exteriors.jpg' },
    { name: 'Engine Parts', bgColor: 'bg-orange-100', imageUrl: '/Images/Engine Parts.jpg' },
    { name: 'Gearboxes', bgColor: 'bg-pink-100', imageUrl: '/Images/Gearboxes.jpg' },
    { name: 'Cooling Systems', bgColor: 'bg-teal-100', imageUrl: '/Images/Cooling Systems.png' },
  ];

  return (
    <section className="py-8 sm:py-12 bg-white">
      <div className="container mx-auto px-2 sm:px-4">
        {/* Section header */}
        <div className="mb-6 sm:mb-8 text-center sm:text-left">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-800 font-montserrat">
            Category
          </h2>
        </div>

        {/* Categories grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-3 sm:gap-4">
          {categories.map((category, index) => (
            <CategoryCard
              key={index}
              name={category.name}
              bgColor={category.bgColor}
              imageUrl={category.imageUrl}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
