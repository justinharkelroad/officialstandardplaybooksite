
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';

const Terms = () => {
  return (
    <div className="min-h-screen">
      <Navigation />
      
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        <div className="container mx-auto px-4 text-center relative z-10">
          <h1 className="font-rajdhani font-bold text-6xl md:text-8xl uppercase tracking-wide text-white mb-6 animate-fade-up">
            Terms of
            <br />
            <span className="text-gradient">Service</span>
          </h1>
          
          <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto animate-fade-up" style={{ animationDelay: '0.2s' }}>
            Please read these terms carefully before using our services. 
            By engaging our services, you agree to be bound by these Terms of Service.
          </p>
        </div>
      </section>

      {/* Terms Content */}
      <section className="py-20 relative">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto prose prose-invert prose-lg">
            <div className="space-y-12 text-gray-300">
              
              <div className="text-center mb-12">
                <p className="text-lg leading-relaxed">
                  <strong>The Standard Playbook, LLC</strong> ("Company," "we," "us," or "our") provides coaching and consulting 
                  services to insurance agencies ("Client," "you," or "your") under the following terms. By engaging our services, 
                  you agree to be bound by these Terms of Service ("TOS").
                </p>
              </div>

              <div>
                <h2 className="font-rajdhani font-bold text-3xl uppercase tracking-wide text-white mb-6">
                  1. Services Provided
                </h2>
                <div className="space-y-4">
                  <p>
                    The Standard Playbook offers business coaching, consulting, and resources designed to help insurance 
                    agencies grow and improve operations. Services include, but are not limited to:
                  </p>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>One-on-one coaching</li>
                    <li>Group consulting sessions</li>
                    <li>Access to educational materials, courses, and tools</li>
                  </ul>
                  <p>The specific scope of services will be outlined in a separate proposal or agreement.</p>
                </div>
              </div>

              <div>
                <h2 className="font-rajdhani font-bold text-3xl uppercase tracking-wide text-white mb-6">
                  2. Payment Terms
                </h2>
                <div className="space-y-4">
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>All fees are due upfront or on a recurring basis, as specified in your plan</li>
                    <li>By signing up for any recurring service, you authorize us to automatically charge the payment method on file at the agreed-upon intervals</li>
                    <li>Any failure to make timely payments may result in suspension or termination of services</li>
                  </ul>
                </div>
              </div>

              <div>
                <h2 className="font-rajdhani font-bold text-3xl uppercase tracking-wide text-white mb-6">
                  3. Termination of Services & Recurring Charges
                </h2>
                <div className="space-y-4">
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>To terminate any recurring service or subscription, you must submit a written cancellation request via email</li>
                    <li>Cancellations must be received at least three (3) business days before the next billing cycle to avoid being charged</li>
                    <li>No refunds will be issued for partial billing cycles or unused portions of services</li>
                  </ul>
                </div>
              </div>

              <div>
                <h2 className="font-rajdhani font-bold text-3xl uppercase tracking-wide text-white mb-6">
                  4. Refund Policy
                </h2>
                <div className="space-y-4">
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>No refunds are offered once services have been delivered or accessed</li>
                    <li>Physical products such as the Playbook will be shipped within 30 days. No refunds will be provided once the order is placed</li>
                  </ul>
                </div>
              </div>

              <div>
                <h2 className="font-rajdhani font-bold text-3xl uppercase tracking-wide text-white mb-6">
                  5. Confidentiality
                </h2>
                <div className="space-y-4">
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>Both parties agree to maintain confidentiality of any proprietary or sensitive information shared during the course of services</li>
                    <li>This obligation will survive the termination of services</li>
                  </ul>
                </div>
              </div>

              <div>
                <h2 className="font-rajdhani font-bold text-3xl uppercase tracking-wide text-white mb-6">
                  6. Disclaimer
                </h2>
                <div className="space-y-4">
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>Results from coaching and consulting services vary based on client participation and market conditions. We do not guarantee specific outcomes or performance</li>
                    <li>The information provided during sessions is for educational and advisory purposes only and does not constitute legal, financial, or professional advice</li>
                  </ul>
                </div>
              </div>

              <div>
                <h2 className="font-rajdhani font-bold text-3xl uppercase tracking-wide text-white mb-6">
                  7. Liability Limitation
                </h2>
                <div className="space-y-4">
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>In no event shall The Standard Playbook be held liable for any direct, indirect, incidental, or consequential damages arising from the use of our services</li>
                    <li>Our maximum liability to any client shall not exceed the total amount paid for services within the past 12 months</li>
                  </ul>
                </div>
              </div>

              <div>
                <h2 className="font-rajdhani font-bold text-3xl uppercase tracking-wide text-white mb-6">
                  8. Force Majeure
                </h2>
                <div className="space-y-4">
                  <p>
                    We are not responsible for delays or failures to perform due to causes beyond our reasonable control, 
                    including natural disasters, government actions, or technological failures.
                  </p>
                </div>
              </div>

              <div>
                <h2 className="font-rajdhani font-bold text-3xl uppercase tracking-wide text-white mb-6">
                  9. Governing Law
                </h2>
                <div className="space-y-4">
                  <p>
                    These Terms of Service are governed by and construed in accordance with the laws of the State of Indiana, 
                    without regard to its conflict of law principles.
                  </p>
                </div>
              </div>

              <div>
                <h2 className="font-rajdhani font-bold text-3xl uppercase tracking-wide text-white mb-6">
                  10. Amendments
                </h2>
                <div className="space-y-4">
                  <p>
                    We reserve the right to update or modify these TOS at any time without prior notice. Continued use of 
                    services constitutes acceptance of the latest version of the TOS.
                  </p>
                </div>
              </div>

              <div>
                <h2 className="font-rajdhani font-bold text-3xl uppercase tracking-wide text-white mb-6">
                  Contact Information
                </h2>
                <div className="space-y-4">
                  <p>
                    If you have questions about these terms, please contact us:
                  </p>
                  <div className="bg-dark-card border border-primary/20 rounded-lg p-6">
                    <p><strong>The Standard Playbook, LLC</strong></p>
                    <p><strong>Email:</strong> info@standardplaybook.com</p>
                    <p><strong>Phone:</strong> +1 (260) 515-1349</p>
                    <p><strong>Address:</strong> Fort Wayne, IN, USA</p>
                  </div>
                </div>
              </div>

              <div className="border-t border-primary/20 pt-8">
                <p className="text-gray-400 text-center">
                  Last updated: December 2024
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Terms;
