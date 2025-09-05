interface CategoryCardProps {
  name: string;
  bgColor?: string;
  imageUrl?: string;
}

function CategoryCard({ name, bgColor = 'bg-gray-200', imageUrl }: CategoryCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow cursor-pointer">
      <div className={`h-20 sm:h-24 ${bgColor} flex items-center justify-center relative`}>
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

interface PartsGridProps {
  title: string;
  backgroundColor?: string;
}

export default function PartsGrid({ title, backgroundColor = 'bg-gray-50' }: PartsGridProps) {
  const bgColor = 'bg-gray-200';
  const categories = [
    { name: 'Engine with Transmission', bgColor, imageUrl: '/Images/golf engine.png' },
    { name: 'Head Lamps', bgColor, imageUrl: '/Images/Head Lamps.png' },
    { name: 'Alternator', bgColor, imageUrl: '/Images/Alternator.png' },
    { name: 'Fender', bgColor, imageUrl: '/Images/Fender.png' },
    { name: 'Side Mirrors', bgColor, imageUrl: '/Images/VW 6R SIDE MIRRORS.png' },
    { name: 'Tail Lamps', bgColor, imageUrl: '/Images/Tail Lamps.png' },
    { name: 'Bumper', bgColor, imageUrl: '/Images/Bumper.png' },
    { name: 'Grill', bgColor, imageUrl: '/Images/Grill.png' },
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
              imageUrl={category.imageUrl}
            />
          ))}
        </div>
      </div>
    </section>
  );
}