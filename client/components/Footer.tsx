import { Facebook } from 'lucide-react';

// Custom TikTok icon component
const TikTokIcon = ({ size = 20 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="currentColor"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
  </svg>
);

export default function Footer() {
  return (
    <footer className="bg-gpp-navy text-white">
      <div className="container mx-auto px-4 py-6 sm:py-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8">
          {/* Company Info */}
          <div className="col-span-1 sm:col-span-2 md:col-span-1">
            <div className="flex items-center mb-3 sm:mb-4">
              <div>
                <h3 className="text-base sm:text-lg font-bold font-montserrat">GPP</h3>
                <p className="text-xs sm:text-sm text-gray-300 font-montserrat">AUTO SPARES</p>
              </div>
            </div>
            
            {/* Social Media Icons */}
            <div className="flex space-x-3">
              <a href="https://www.facebook.com/profile.php?id=61571614956170" className="text-gray-300 hover:text-white transition-colors">
                <Facebook size={18} className="sm:w-5 sm:h-5" />
              </a>
              <a href="#" className="text-gray-300 hover:text-white transition-colors">
                <TikTokIcon size={18} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-base sm:text-lg font-semibold font-montserrat mb-3 sm:mb-4">QUICK LINKS</h4>
            <ul className="space-y-1 sm:space-y-2">
              <li>
                <a href="index.html" className="text-gray-300 hover:text-white transition-colors font-montserrat text-sm sm:text-base">
                  Home
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-white transition-colors font-montserrat text-sm sm:text-base">
                  About
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-white transition-colors font-montserrat text-sm sm:text-base">
                  How To Buy
                </a>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="text-base sm:text-lg font-semibold font-montserrat mb-3 sm:mb-4">LEGAL</h4>
            <ul className="space-y-1 sm:space-y-2">
              <li>
                <a href="#" className="text-gray-300 hover:text-white transition-colors font-montserrat text-sm sm:text-base">
                  Privacy Policies
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-white transition-colors font-montserrat text-sm sm:text-base">
                  Terms and Conditions
                </a>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-base sm:text-lg font-semibold font-montserrat mb-3 sm:mb-4">CONTACT</h4>
            <p className="text-gray-300 font-montserrat text-sm sm:text-base">
              gppautospares@gmail.com
            </p>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-gray-600 mt-6 sm:mt-8 pt-4 sm:pt-6 text-center">
          <p className="text-gray-300 text-xs sm:text-sm font-montserrat">
            © 2025 GPP Auto Spares | Website by Tefo Ramokate
          </p>
        </div>
      </div>
    </footer>
  );
}
