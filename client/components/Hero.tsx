import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useState, useEffect } from 'react';

export default function Hero() {
  const [currentSlide, setCurrentSlide] = useState(0);
  
  const slides = [
    {
      image: 'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
      title: 'WELCOME TO GPP AUTO SPARES',
      subtitle: 'Brand New and Used Car Parts'
    },
    {
      image: 'https://images.unsplash.com/photo-1580273916550-e323be2ae537?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
      title: 'QUALITY AUTO PARTS',
      subtitle: 'Professional Service & Expert Advice'
    }
  ];

  // Auto-advance slides
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [slides.length]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  return (
    <section className="relative h-64 sm:h-80 md:h-96 bg-gray-900 overflow-hidden">
      {/* Background images */}
      {slides.map((slide, index) => (
        <div
          key={index}
          className={`absolute inset-0 bg-cover bg-center bg-no-repeat transition-opacity duration-1000 ${
            index === currentSlide ? 'opacity-100' : 'opacity-0'
          }`}
          style={{
            backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url('${slide.image}')`
          }}
        />
      ))}
      
      {/* Content overlay */}
      <div className="relative z-10 flex items-center justify-between h-full px-2 sm:px-4 md:px-8">
        {/* Left arrow - Hidden on mobile and tablet for touch swipe */}
        <button 
          onClick={prevSlide}
          className="hidden lg:block text-white hover:text-gray-300 transition-colors p-1 sm:p-2 bg-black bg-opacity-30 rounded-full hover:bg-opacity-50 flex-shrink-0"
        >
          <ChevronLeft size={24} className="sm:w-8 sm:h-8" />
        </button>

        {/* Main content */}
        <div className="text-center text-white px-2 sm:px-4 flex-1 flex flex-col justify-center items-center">
          <h1 className="text-xl sm:text-2xl md:text-4xl lg:text-5xl font-bold font-montserrat mb-2 sm:mb-4 leading-tight text-center">
            {slides[currentSlide].title}
          </h1>
          <p className="text-sm sm:text-base md:text-xl lg:text-2xl font-montserrat text-center">
            {slides[currentSlide].subtitle}
          </p>
        </div>

        {/* Right arrow - Hidden on mobile and tablet for touch swipe */}
        <button 
          onClick={nextSlide}
          className="hidden lg:block text-white hover:text-gray-300 transition-colors p-1 sm:p-2 bg-black bg-opacity-30 rounded-full hover:bg-opacity-50 flex-shrink-0"
        >
          <ChevronRight size={24} className="sm:w-8 sm:h-8" />
        </button>
      </div>

      {/* Slide indicators */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2 z-20">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`w-3 h-3 rounded-full transition-colors ${
              index === currentSlide ? 'bg-white' : 'bg-white bg-opacity-50'
            }`}
          />
        ))}
      </div>
    </section>
  );
}
