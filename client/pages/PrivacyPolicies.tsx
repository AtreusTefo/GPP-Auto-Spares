import Header from '../components/Header';
import Footer from '../components/Footer';

export default function PrivacyPolicies() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      {/* Hero Section */}
      <section className="bg-gpp-navy text-white py-16 sm:py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-montserrat mb-6">
              Privacy Policies
            </h1>
            <p className="text-lg sm:text-xl text-gray-200 font-montserrat leading-relaxed">
              Your privacy is important to us. Learn how we collect, use, and protect your personal information.
            </p>
            <p className="text-sm text-gray-300 font-montserrat mt-4">
              Last updated: January 2025
            </p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12 sm:py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            
            {/* Introduction */}
            <div className="mb-12">
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 font-montserrat mb-6">
                Introduction
              </h2>
              <div className="prose prose-lg max-w-none">
                <p className="text-gray-700 font-montserrat leading-relaxed mb-4">
                  At GPP Auto Spares, we are committed to protecting your privacy and ensuring the security 
                  of your personal information. This Privacy Policy explains how we collect, use, disclose, 
                  and safeguard your information when you visit our website or use our services.
                </p>
                <p className="text-gray-700 font-montserrat leading-relaxed">
                  By using our website and services, you consent to the practices described in this Privacy Policy. 
                  If you do not agree with our policies and practices, please do not use our services.
                </p>
              </div>
            </div>

            {/* Information We Collect */}
            <div className="mb-12">
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 font-montserrat mb-6">
                Information We Collect
              </h2>
              
              <div className="space-y-8">
                <div className="bg-gray-50 rounded-lg p-6">
                  <h3 className="text-xl font-bold text-gray-800 font-montserrat mb-4">
                    Personal Information
                  </h3>
                  <p className="text-gray-700 font-montserrat leading-relaxed mb-4">
                    We may collect personal information that you voluntarily provide to us, including:
                  </p>
                  <ul className="list-disc list-inside text-gray-700 font-montserrat space-y-2">
                    <li>Name and contact information (email address, phone number, mailing address)</li>
                    <li>Account credentials (username and password)</li>
                    <li>Payment information (credit card details, billing address)</li>
                    <li>Vehicle information (make, model, year, VIN)</li>
                    <li>Purchase history and preferences</li>
                    <li>Communication records (emails, chat messages, support tickets)</li>
                  </ul>
                </div>

                <div className="bg-gray-50 rounded-lg p-6">
                  <h3 className="text-xl font-bold text-gray-800 font-montserrat mb-4">
                    Automatically Collected Information
                  </h3>
                  <p className="text-gray-700 font-montserrat leading-relaxed mb-4">
                    When you visit our website, we automatically collect certain information, including:
                  </p>
                  <ul className="list-disc list-inside text-gray-700 font-montserrat space-y-2">
                    <li>IP address and geographic location</li>
                    <li>Browser type and version</li>
                    <li>Operating system and device information</li>
                    <li>Pages visited and time spent on our website</li>
                    <li>Referring website and search terms</li>
                    <li>Cookies and similar tracking technologies</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* How We Use Your Information */}
            <div className="mb-12">
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 font-montserrat mb-6">
                How We Use Your Information
              </h2>
              
              <div className="bg-gpp-light-blue rounded-lg p-6">
                <p className="text-gray-700 font-montserrat leading-relaxed mb-4">
                  We use the information we collect for various purposes, including:
                </p>
                <ul className="list-disc list-inside text-gray-700 font-montserrat space-y-2">
                  <li>Processing and fulfilling your orders</li>
                  <li>Providing customer support and responding to inquiries</li>
                  <li>Creating and managing your account</li>
                  <li>Sending order confirmations, shipping updates, and receipts</li>
                  <li>Improving our website, products, and services</li>
                  <li>Personalizing your shopping experience</li>
                  <li>Sending promotional emails and marketing communications (with your consent)</li>
                  <li>Preventing fraud and ensuring security</li>
                  <li>Complying with legal obligations</li>
                  <li>Analyzing website usage and performance</li>
                </ul>
              </div>
            </div>

            {/* Information Sharing */}
            <div className="mb-12">
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 font-montserrat mb-6">
                Information Sharing and Disclosure
              </h2>
              
              <div className="space-y-6">
                <p className="text-gray-700 font-montserrat leading-relaxed">
                  We do not sell, trade, or rent your personal information to third parties. However, 
                  we may share your information in the following circumstances:
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-white border border-gray-200 rounded-lg p-6">
                    <h3 className="text-lg font-bold text-gray-800 font-montserrat mb-3">
                      Service Providers
                    </h3>
                    <p className="text-gray-700 font-montserrat text-sm leading-relaxed">
                      We may share information with trusted third-party service providers who assist us 
                      in operating our website, processing payments, and delivering services.
                    </p>
                  </div>
                  
                  <div className="bg-white border border-gray-200 rounded-lg p-6">
                    <h3 className="text-lg font-bold text-gray-800 font-montserrat mb-3">
                      Legal Requirements
                    </h3>
                    <p className="text-gray-700 font-montserrat text-sm leading-relaxed">
                      We may disclose information when required by law, court order, or government 
                      regulation, or to protect our rights and safety.
                    </p>
                  </div>
                  
                  <div className="bg-white border border-gray-200 rounded-lg p-6">
                    <h3 className="text-lg font-bold text-gray-800 font-montserrat mb-3">
                      Business Transfers
                    </h3>
                    <p className="text-gray-700 font-montserrat text-sm leading-relaxed">
                      In the event of a merger, acquisition, or sale of assets, your information 
                      may be transferred as part of the business transaction.
                    </p>
                  </div>
                  
                  <div className="bg-white border border-gray-200 rounded-lg p-6">
                    <h3 className="text-lg font-bold text-gray-800 font-montserrat mb-3">
                      Consent
                    </h3>
                    <p className="text-gray-700 font-montserrat text-sm leading-relaxed">
                      We may share information with your explicit consent or at your direction 
                      for specific purposes you have authorized.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Data Security */}
            <div className="mb-12">
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 font-montserrat mb-6">
                Data Security
              </h2>
              
              <div className="bg-gray-50 rounded-lg p-6">
                <p className="text-gray-700 font-montserrat leading-relaxed mb-4">
                  We implement appropriate technical and organizational security measures to protect 
                  your personal information against unauthorized access, alteration, disclosure, or destruction:
                </p>
                <ul className="list-disc list-inside text-gray-700 font-montserrat space-y-2">
                  <li>SSL encryption for data transmission</li>
                  <li>Secure servers and databases</li>
                  <li>Regular security audits and updates</li>
                  <li>Access controls and authentication</li>
                  <li>Employee training on data protection</li>
                  <li>Incident response procedures</li>
                </ul>
                <p className="text-gray-600 font-montserrat text-sm mt-4">
                  While we strive to protect your information, no method of transmission over the internet 
                  or electronic storage is 100% secure. We cannot guarantee absolute security.
                </p>
              </div>
            </div>

            {/* Your Rights */}
            <div className="mb-12">
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 font-montserrat mb-6">
                Your Rights and Choices
              </h2>
              
              <div className="space-y-6">
                <p className="text-gray-700 font-montserrat leading-relaxed">
                  You have certain rights regarding your personal information:
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-gpp-light-blue rounded-lg p-6">
                    <h3 className="text-lg font-bold text-gray-800 font-montserrat mb-3">
                      Access and Update
                    </h3>
                    <p className="text-gray-700 font-montserrat text-sm leading-relaxed">
                      You can access and update your account information at any time through 
                      your account dashboard or by contacting us.
                    </p>
                  </div>
                  
                  <div className="bg-gpp-light-blue rounded-lg p-6">
                    <h3 className="text-lg font-bold text-gray-800 font-montserrat mb-3">
                      Marketing Communications
                    </h3>
                    <p className="text-gray-700 font-montserrat text-sm leading-relaxed">
                      You can opt out of marketing emails by clicking the unsubscribe link 
                      or updating your communication preferences.
                    </p>
                  </div>
                  
                  <div className="bg-gpp-light-blue rounded-lg p-6">
                    <h3 className="text-lg font-bold text-gray-800 font-montserrat mb-3">
                      Data Deletion
                    </h3>
                    <p className="text-gray-700 font-montserrat text-sm leading-relaxed">
                      You can request deletion of your personal information, subject to 
                      legal and business requirements.
                    </p>
                  </div>
                  
                  <div className="bg-gpp-light-blue rounded-lg p-6">
                    <h3 className="text-lg font-bold text-gray-800 font-montserrat mb-3">
                      Cookies
                    </h3>
                    <p className="text-gray-700 font-montserrat text-sm leading-relaxed">
                      You can control cookies through your browser settings, though this 
                      may affect website functionality.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Information */}
            <div className="mb-12">
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 font-montserrat mb-6">
                Contact Us
              </h2>
              
              <div className="bg-gpp-navy text-white rounded-lg p-6">
                <p className="font-montserrat leading-relaxed mb-4">
                  If you have any questions about this Privacy Policy or our data practices, 
                  please contact us:
                </p>
                <div className="space-y-2">
                  <p className="font-montserrat">
                    <strong>Email:</strong> gppautospares@gmail.com
                  </p>
                  <p className="font-montserrat">
                    <strong>Phone:</strong> +267 75 123 456
                  </p>
                  <p className="font-montserrat">
                    <strong>Address:</strong> GPP Auto Spares, Gaborone, Botswana
                  </p>
                </div>
              </div>
            </div>

            {/* Updates */}
            <div className="mb-12">
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 font-montserrat mb-6">
                Policy Updates
              </h2>
              
              <div className="bg-gray-50 rounded-lg p-6">
                <p className="text-gray-700 font-montserrat leading-relaxed">
                  We may update this Privacy Policy from time to time to reflect changes in our 
                  practices or legal requirements. We will notify you of any material changes by 
                  posting the updated policy on our website and updating the "Last updated" date. 
                  Your continued use of our services after such changes constitutes acceptance of 
                  the updated policy.
                </p>
              </div>
            </div>
            
          </div>
        </div>
      </section>
      
      <Footer />
    </div>
  );
}