import Header from '../components/Header';
import Footer from '../components/Footer';

export default function TermsAndConditions() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      {/* Hero Section */}
      <section className="bg-gpp-navy text-white py-16 sm:py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-montserrat mb-6">
              Terms and Conditions
            </h1>
            <p className="text-lg sm:text-xl text-gray-200 font-montserrat leading-relaxed">
              Please read these terms carefully before using our services and making any purchases.
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
                Agreement to Terms
              </h2>
              <div className="prose prose-lg max-w-none">
                <p className="text-gray-700 font-montserrat leading-relaxed mb-4">
                  These Terms and Conditions ("Terms") govern your use of the GPP Auto Spares website 
                  and services. By accessing our website, making a purchase, or using our services, 
                  you agree to be bound by these Terms.
                </p>
                <p className="text-gray-700 font-montserrat leading-relaxed">
                  If you do not agree to these Terms, please do not use our website or services. 
                  We reserve the right to modify these Terms at any time, and your continued use 
                  constitutes acceptance of any changes.
                </p>
              </div>
            </div>

            {/* Use of Website */}
            <div className="mb-12">
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 font-montserrat mb-6">
                Use of Website and Services
              </h2>
              
              <div className="space-y-8">
                <div className="bg-gray-50 rounded-lg p-6">
                  <h3 className="text-xl font-bold text-gray-800 font-montserrat mb-4">
                    Permitted Use
                  </h3>
                  <p className="text-gray-700 font-montserrat leading-relaxed mb-4">
                    You may use our website and services for lawful purposes only. You agree to:
                  </p>
                  <ul className="list-disc list-inside text-gray-700 font-montserrat space-y-2">
                    <li>Provide accurate and complete information when creating an account</li>
                    <li>Maintain the security of your account credentials</li>
                    <li>Use the website in compliance with all applicable laws and regulations</li>
                    <li>Respect intellectual property rights</li>
                    <li>Not interfere with the website's operation or security</li>
                  </ul>
                </div>

                <div className="bg-gray-50 rounded-lg p-6">
                  <h3 className="text-xl font-bold text-gray-800 font-montserrat mb-4">
                    Prohibited Activities
                  </h3>
                  <p className="text-gray-700 font-montserrat leading-relaxed mb-4">
                    You may not use our website or services to:
                  </p>
                  <ul className="list-disc list-inside text-gray-700 font-montserrat space-y-2">
                    <li>Violate any laws or regulations</li>
                    <li>Infringe on intellectual property rights</li>
                    <li>Transmit harmful or malicious code</li>
                    <li>Attempt unauthorized access to our systems</li>
                    <li>Engage in fraudulent activities</li>
                    <li>Harass or harm other users</li>
                    <li>Spam or send unsolicited communications</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Products and Orders */}
            <div className="mb-12">
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 font-montserrat mb-6">
                Products and Orders
              </h2>
              
              <div className="space-y-6">
                <div className="bg-gpp-light-blue rounded-lg p-6">
                  <h3 className="text-xl font-bold text-gray-800 font-montserrat mb-4">
                    Product Information
                  </h3>
                  <p className="text-gray-700 font-montserrat leading-relaxed mb-4">
                    We strive to provide accurate product descriptions, specifications, and pricing. However:
                  </p>
                  <ul className="list-disc list-inside text-gray-700 font-montserrat space-y-2">
                    <li>Product images may not reflect exact appearance</li>
                    <li>Specifications are subject to manufacturer changes</li>
                    <li>Prices are subject to change without notice</li>
                    <li>Availability is not guaranteed until order confirmation</li>
                    <li>We reserve the right to limit quantities</li>
                  </ul>
                </div>

                <div className="bg-white border border-gray-200 rounded-lg p-6">
                  <h3 className="text-xl font-bold text-gray-800 font-montserrat mb-4">
                    Order Process
                  </h3>
                  <p className="text-gray-700 font-montserrat leading-relaxed mb-4">
                    When you place an order:
                  </p>
                  <ul className="list-disc list-inside text-gray-700 font-montserrat space-y-2">
                    <li>You make an offer to purchase the products</li>
                    <li>We may accept or decline your order at our discretion</li>
                    <li>Order confirmation constitutes acceptance</li>
                    <li>Payment must be received before shipment</li>
                    <li>You are responsible for providing accurate delivery information</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Payment Terms */}
            <div className="mb-12">
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 font-montserrat mb-6">
                Payment Terms
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-gray-50 rounded-lg p-6">
                  <h3 className="text-lg font-bold text-gray-800 font-montserrat mb-3">
                    Payment Methods
                  </h3>
                  <p className="text-gray-700 font-montserrat text-sm leading-relaxed mb-3">
                    We accept various payment methods including credit cards, debit cards, 
                    and other approved payment systems.
                  </p>
                  <ul className="list-disc list-inside text-gray-700 font-montserrat text-sm space-y-1">
                    <li>All payments must be in the specified currency</li>
                    <li>Payment is due at time of order</li>
                    <li>Additional fees may apply for certain payment methods</li>
                  </ul>
                </div>
                
                <div className="bg-gray-50 rounded-lg p-6">
                  <h3 className="text-lg font-bold text-gray-800 font-montserrat mb-3">
                    Pricing and Taxes
                  </h3>
                  <p className="text-gray-700 font-montserrat text-sm leading-relaxed mb-3">
                    All prices are listed in the local currency and may be subject to applicable taxes.
                  </p>
                  <ul className="list-disc list-inside text-gray-700 font-montserrat text-sm space-y-1">
                    <li>Prices may change without notice</li>
                    <li>Taxes and duties are calculated at checkout</li>
                    <li>Customer is responsible for all applicable fees</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Shipping and Delivery */}
            <div className="mb-12">
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 font-montserrat mb-6">
                Shipping and Delivery
              </h2>
              
              <div className="bg-gpp-light-blue rounded-lg p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-lg font-bold text-gray-800 font-montserrat mb-3">
                      Shipping Policy
                    </h3>
                    <ul className="list-disc list-inside text-gray-700 font-montserrat text-sm space-y-2">
                      <li>Shipping costs are calculated based on weight and destination</li>
                      <li>Delivery times are estimates and not guaranteed</li>
                      <li>Risk of loss transfers upon shipment</li>
                      <li>Customer must inspect items upon delivery</li>
                    </ul>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-bold text-gray-800 font-montserrat mb-3">
                      Delivery Terms
                    </h3>
                    <ul className="list-disc list-inside text-gray-700 font-montserrat text-sm space-y-2">
                      <li>Accurate delivery address is customer's responsibility</li>
                      <li>Failed delivery attempts may incur additional charges</li>
                      <li>Signature may be required for delivery</li>
                      <li>Damaged packages should be reported immediately</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            {/* Returns and Warranties */}
            <div className="mb-12">
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 font-montserrat mb-6">
                Returns and Warranties
              </h2>
              
              <div className="space-y-6">
                <div className="bg-white border border-gray-200 rounded-lg p-6">
                  <h3 className="text-xl font-bold text-gray-800 font-montserrat mb-4">
                    Return Policy
                  </h3>
                  <p className="text-gray-700 font-montserrat leading-relaxed mb-4">
                    Returns are subject to our return policy:
                  </p>
                  <ul className="list-disc list-inside text-gray-700 font-montserrat space-y-2">
                    <li>Items must be returned within specified time frame</li>
                    <li>Products must be in original condition and packaging</li>
                    <li>Return authorization may be required</li>
                    <li>Customer may be responsible for return shipping costs</li>
                    <li>Refunds processed after inspection and approval</li>
                    <li>Certain items may not be eligible for return</li>
                  </ul>
                </div>

                <div className="bg-white border border-gray-200 rounded-lg p-6">
                  <h3 className="text-xl font-bold text-gray-800 font-montserrat mb-4">
                    Warranties
                  </h3>
                  <p className="text-gray-700 font-montserrat leading-relaxed mb-4">
                    Product warranties are provided by manufacturers:
                  </p>
                  <ul className="list-disc list-inside text-gray-700 font-montserrat space-y-2">
                    <li>Warranty terms vary by product and manufacturer</li>
                    <li>We facilitate warranty claims but are not the warrantor</li>
                    <li>Used parts may have limited or no warranty</li>
                    <li>Warranty does not cover normal wear or misuse</li>
                    <li>Installation and labor costs are not covered</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Limitation of Liability */}
            <div className="mb-12">
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 font-montserrat mb-6">
                Limitation of Liability
              </h2>
              
              <div className="bg-gray-50 rounded-lg p-6">
                <p className="text-gray-700 font-montserrat leading-relaxed mb-4">
                  To the maximum extent permitted by law:
                </p>
                <ul className="list-disc list-inside text-gray-700 font-montserrat space-y-2">
                  <li>Our liability is limited to the purchase price of the product</li>
                  <li>We are not liable for indirect, incidental, or consequential damages</li>
                  <li>We do not warrant that products will meet your specific requirements</li>
                  <li>Installation and compatibility are customer's responsibility</li>
                  <li>We are not liable for damages caused by improper installation or use</li>
                </ul>
                <p className="text-gray-600 font-montserrat text-sm mt-4">
                  Some jurisdictions do not allow limitation of liability, so these limitations 
                  may not apply to you.
                </p>
              </div>
            </div>

            {/* Intellectual Property */}
            <div className="mb-12">
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 font-montserrat mb-6">
                Intellectual Property
              </h2>
              
              <div className="bg-gpp-light-blue rounded-lg p-6">
                <p className="text-gray-700 font-montserrat leading-relaxed mb-4">
                  All content on our website, including text, graphics, logos, images, and software, 
                  is protected by intellectual property rights:
                </p>
                <ul className="list-disc list-inside text-gray-700 font-montserrat space-y-2">
                  <li>Content is owned by GPP Auto Spares or licensed to us</li>
                  <li>You may not reproduce, distribute, or modify our content</li>
                  <li>Trademarks and logos are protected marks</li>
                  <li>Product names and brands belong to their respective owners</li>
                  <li>Unauthorized use may result in legal action</li>
                </ul>
              </div>
            </div>

            {/* Governing Law */}
            <div className="mb-12">
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 font-montserrat mb-6">
                Governing Law and Disputes
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white border border-gray-200 rounded-lg p-6">
                  <h3 className="text-lg font-bold text-gray-800 font-montserrat mb-3">
                    Applicable Law
                  </h3>
                  <p className="text-gray-700 font-montserrat text-sm leading-relaxed">
                    These Terms are governed by the laws of Botswana. Any disputes will be 
                    resolved in the courts of Botswana, and you consent to their jurisdiction.
                  </p>
                </div>
                
                <div className="bg-white border border-gray-200 rounded-lg p-6">
                  <h3 className="text-lg font-bold text-gray-800 font-montserrat mb-3">
                    Dispute Resolution
                  </h3>
                  <p className="text-gray-700 font-montserrat text-sm leading-relaxed">
                    We encourage resolving disputes through direct communication. 
                    If formal proceedings are necessary, they will be conducted in accordance 
                    with local laws and procedures.
                  </p>
                </div>
              </div>
            </div>

            {/* Contact Information */}
            <div className="mb-12">
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 font-montserrat mb-6">
                Contact Information
              </h2>
              
              <div className="bg-gpp-navy text-white rounded-lg p-6">
                <p className="font-montserrat leading-relaxed mb-4">
                  If you have questions about these Terms and Conditions, please contact us:
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

            {/* Severability */}
            <div className="mb-12">
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 font-montserrat mb-6">
                Severability and Modifications
              </h2>
              
              <div className="bg-gray-50 rounded-lg p-6">
                <p className="text-gray-700 font-montserrat leading-relaxed mb-4">
                  If any provision of these Terms is found to be unenforceable, the remaining 
                  provisions will continue in full force and effect.
                </p>
                <p className="text-gray-700 font-montserrat leading-relaxed">
                  We reserve the right to modify these Terms at any time. Changes will be 
                  effective immediately upon posting. Your continued use of our services 
                  constitutes acceptance of the modified Terms.
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