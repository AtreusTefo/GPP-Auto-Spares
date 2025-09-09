import Header from '../components/Header';
import Footer from '../components/Footer';

export default function About() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      {/* Hero Section */}
      <section className="bg-gpp-navy text-white py-16 sm:py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-montserrat mb-6">
              About GPP Auto Spares
            </h1>
            <p className="text-lg sm:text-xl text-gray-200 font-montserrat leading-relaxed">
              Your trusted partner for quality automotive parts and exceptional service since our establishment.
            </p>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-12 sm:py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 font-montserrat mb-4">
                Our Mission
              </h2>
              <div className="w-20 h-1 bg-gpp-blue mx-auto mb-6"></div>
            </div>
            
            <div className="bg-gpp-light-blue rounded-lg p-8 sm:p-10 text-center">
              <p className="text-lg sm:text-xl text-gray-700 font-montserrat leading-relaxed mb-6">
                At GPP Auto Spares, our mission is to provide high-quality automotive parts and accessories 
                to keep your vehicle running at its best. We are committed to delivering exceptional customer 
                service, competitive pricing, and reliable products that meet the diverse needs of our customers.
              </p>
              <p className="text-base sm:text-lg text-gray-600 font-montserrat leading-relaxed">
                Whether you're looking for brand new parts or quality used components, we strive to be your 
                first choice for automotive solutions in Botswana and beyond.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-12 sm:py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 font-montserrat mb-4">
                Our Core Values
              </h2>
              <div className="w-20 h-1 bg-gpp-blue mx-auto mb-6"></div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {/* Quality */}
              <div className="bg-white rounded-lg p-6 sm:p-8 shadow-md hover:shadow-lg transition-shadow">
                <div className="text-center">
                  <div className="w-16 h-16 bg-gpp-blue rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-white text-2xl">🔧</span>
                  </div>
                  <h3 className="text-xl font-bold text-gray-800 font-montserrat mb-4">Quality</h3>
                  <p className="text-gray-600 font-montserrat leading-relaxed">
                    We source only the highest quality parts from trusted manufacturers and suppliers, 
                    ensuring reliability and performance for every customer.
                  </p>
                </div>
              </div>

              {/* Integrity */}
              <div className="bg-white rounded-lg p-6 sm:p-8 shadow-md hover:shadow-lg transition-shadow">
                <div className="text-center">
                  <div className="w-16 h-16 bg-gpp-blue rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-white text-2xl">🤝</span>
                  </div>
                  <h3 className="text-xl font-bold text-gray-800 font-montserrat mb-4">Integrity</h3>
                  <p className="text-gray-600 font-montserrat leading-relaxed">
                    Honesty and transparency guide all our business practices. We provide accurate 
                    information and fair pricing to build lasting relationships with our customers.
                  </p>
                </div>
              </div>

              {/* Customer Service */}
              <div className="bg-white rounded-lg p-6 sm:p-8 shadow-md hover:shadow-lg transition-shadow">
                <div className="text-center">
                  <div className="w-16 h-16 bg-gpp-blue rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-white text-2xl">💬</span>
                  </div>
                  <h3 className="text-xl font-bold text-gray-800 font-montserrat mb-4">Customer Service</h3>
                  <p className="text-gray-600 font-montserrat leading-relaxed">
                    Our knowledgeable team is dedicated to helping you find the right parts and 
                    providing expert advice to meet your automotive needs.
                  </p>
                </div>
              </div>

              {/* Innovation */}
              <div className="bg-white rounded-lg p-6 sm:p-8 shadow-md hover:shadow-lg transition-shadow">
                <div className="text-center">
                  <div className="w-16 h-16 bg-gpp-blue rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-white text-2xl">💡</span>
                  </div>
                  <h3 className="text-xl font-bold text-gray-800 font-montserrat mb-4">Innovation</h3>
                  <p className="text-gray-600 font-montserrat leading-relaxed">
                    We continuously improve our services and embrace new technologies to enhance 
                    the customer experience and streamline our operations.
                  </p>
                </div>
              </div>

              {/* Reliability */}
              <div className="bg-white rounded-lg p-6 sm:p-8 shadow-md hover:shadow-lg transition-shadow">
                <div className="text-center">
                  <div className="w-16 h-16 bg-gpp-blue rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-white text-2xl">⚡</span>
                  </div>
                  <h3 className="text-xl font-bold text-gray-800 font-montserrat mb-4">Reliability</h3>
                  <p className="text-gray-600 font-montserrat leading-relaxed">
                    Count on us for consistent availability, timely delivery, and dependable service 
                    that keeps your business and personal vehicles running smoothly.
                  </p>
                </div>
              </div>

              {/* Community */}
              <div className="bg-white rounded-lg p-6 sm:p-8 shadow-md hover:shadow-lg transition-shadow">
                <div className="text-center">
                  <div className="w-16 h-16 bg-gpp-blue rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-white text-2xl">🌍</span>
                  </div>
                  <h3 className="text-xl font-bold text-gray-800 font-montserrat mb-4">Community</h3>
                  <p className="text-gray-600 font-montserrat leading-relaxed">
                    We are proud to serve the local automotive community and contribute to the 
                    economic growth and development of our region.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Company Story Section */}
      <section className="py-12 sm:py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 font-montserrat mb-4">
                Our Story
              </h2>
              <div className="w-20 h-1 bg-gpp-blue mx-auto mb-6"></div>
            </div>
            
            <div className="prose prose-lg max-w-none">
              <p className="text-gray-700 font-montserrat leading-relaxed mb-6">
                GPP Auto Spares was founded with a simple vision: to provide automotive enthusiasts, 
                mechanics, and everyday drivers with access to quality auto parts at competitive prices. 
                What started as a small operation has grown into a trusted name in the automotive parts industry.
              </p>
              
              <p className="text-gray-700 font-montserrat leading-relaxed mb-6">
                Over the years, we have built strong relationships with suppliers and manufacturers worldwide, 
                allowing us to offer an extensive inventory of both new and used parts for various vehicle 
                makes and models. Our team's expertise spans across different automotive systems, from engines 
                and transmissions to electrical components and body parts.
              </p>
              
              <p className="text-gray-700 font-montserrat leading-relaxed">
                Today, GPP Auto Spares continues to evolve, embracing digital technologies to better serve 
                our customers while maintaining the personal touch and expert knowledge that has been our 
                hallmark from the beginning. We look forward to serving the automotive community for many years to come.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact CTA Section */}
      <section className="py-12 sm:py-16 bg-gpp-navy text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-2xl sm:text-3xl font-bold font-montserrat mb-4">
              Ready to Find Your Parts?
            </h2>
            <p className="text-lg text-gray-200 font-montserrat mb-8 leading-relaxed">
              Contact our knowledgeable team today and let us help you find the right automotive parts for your needs.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a 
                href="mailto:gppautospares@gmail.com" 
                className="bg-gpp-blue hover:bg-gpp-light-blue text-white px-8 py-3 rounded-md font-montserrat font-semibold transition-colors"
              >
                Email Us
              </a>
              <a 
                href="tel:+26775123456" 
                className="bg-transparent border-2 border-white hover:bg-white hover:text-gpp-navy text-white px-8 py-3 rounded-md font-montserrat font-semibold transition-colors"
              >
                Call Us
              </a>
            </div>
          </div>
        </div>
      </section>
      
      <Footer />
    </div>
  );
}