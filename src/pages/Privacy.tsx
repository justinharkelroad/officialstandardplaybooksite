
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';

const Privacy = () => {
  return (
    <div className="min-h-screen">
      <Navigation />
      
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        <div className="container mx-auto px-4 text-center relative z-10">
          <h1 className="font-rajdhani font-bold text-6xl md:text-8xl uppercase tracking-wide text-white mb-6 animate-fade-up">
            Privacy
            <br />
            <span className="text-gradient">Policy</span>
          </h1>
          
          <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto animate-fade-up" style={{ animationDelay: '0.2s' }}>
            At The Standard Playbook INC, we value and prioritize your privacy. 
            This policy outlines how we collect, use, and protect your information.
          </p>
        </div>
      </section>

      {/* Privacy Content */}
      <section className="py-20 relative">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto prose prose-invert prose-lg">
            <div className="space-y-12 text-gray-300">
              
              <div className="text-center mb-12">
                <p className="text-lg leading-relaxed">
                  At <strong>The Standard Playbook INC</strong> ("Company," "we," "our," or "us"), we value and prioritize your privacy. 
                  This Privacy Policy outlines the information we collect, how it is used, and your rights regarding the data you provide 
                  through our services, including our website and coaching programs. By using our services, you agree to the collection 
                  and use of information in accordance with this policy.
                </p>
              </div>

              <div>
                <h2 className="font-rajdhani font-bold text-3xl uppercase tracking-wide text-white mb-6">
                  1. Information We Collect
                </h2>
                <div className="space-y-4">
                  <p>We collect the following types of information:</p>
                  
                  <div className="space-y-4">
                    <div>
                      <h3 className="font-rajdhani font-semibold text-xl text-white mb-2">Personal Information:</h3>
                      <ul className="list-disc list-inside space-y-2 ml-4">
                        <li>Name, email address, phone number, billing information, and other identifying data</li>
                        <li>Communication preferences (email and SMS permissions)</li>
                        <li>Business information related to your insurance agency for consulting purposes</li>
                      </ul>
                    </div>
                    
                    <div>
                      <h3 className="font-rajdhani font-semibold text-xl text-white mb-2">Usage Data:</h3>
                      <ul className="list-disc list-inside space-y-2 ml-4">
                        <li>Information on how you interact with our website, services, and emails (e.g., browser type, IP address, and cookies)</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h2 className="font-rajdhani font-bold text-3xl uppercase tracking-wide text-white mb-6">
                  2. How We Use Your Information
                </h2>
                <div className="space-y-4">
                  <p>The data collected is used for the following purposes:</p>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li><strong>To provide and improve services:</strong> Deliver coaching, track progress, and provide tailored recommendations</li>
                    <li><strong>Communication purposes:</strong> Send important updates, newsletters, marketing messages, or personalized content via email and SMS (as allowed by you)</li>
                    <li><strong>Billing and transactions:</strong> Process payments for our recurring subscription services</li>
                    <li><strong>Compliance:</strong> Ensure compliance with legal obligations, agreements, and contracts</li>
                  </ul>
                </div>
              </div>

              <div>
                <h2 className="font-rajdhani font-bold text-3xl uppercase tracking-wide text-white mb-6">
                  3. Email and SMS Consent
                </h2>
                <div className="space-y-4">
                  <p>
                    By providing your contact information, you consent to receive communications from <strong>The Standard Playbook INC</strong>, including:
                  </p>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>Marketing updates, newsletters, and offers related to our services</li>
                    <li>Important notices and service-related announcements (e.g., billing or policy updates)</li>
                  </ul>
                  <p>
                    You may opt out of non-essential emails and SMS notifications at any time by following the instructions 
                    included in each message or contacting us directly.
                  </p>
                </div>
              </div>

              <div>
                <h2 className="font-rajdhani font-bold text-3xl uppercase tracking-wide text-white mb-6">
                  4. Data Sharing and Selling
                </h2>
                <div className="space-y-4">
                  <p className="text-primary font-semibold">
                    We do not sell your personal data to third parties for marketing or any other purposes.
                  </p>
                  <p>We only share your information:</p>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>With service providers (e.g., payment processors or email platforms) to facilitate our services</li>
                    <li>When legally required or to protect the rights and safety of our business and users</li>
                  </ul>
                </div>
              </div>

              <div>
                <h2 className="font-rajdhani font-bold text-3xl uppercase tracking-wide text-white mb-6">
                  5. Data Security
                </h2>
                <div className="space-y-4">
                  <p>
                    We use commercially reasonable methods to safeguard your data, including encryption and secure storage. 
                    However, no method of transmission over the Internet is 100% secure. We cannot guarantee absolute security, 
                    but we take proactive measures to protect your information.
                  </p>
                </div>
              </div>

              <div>
                <h2 className="font-rajdhani font-bold text-3xl uppercase tracking-wide text-white mb-6">
                  6. Your Rights
                </h2>
                <div className="space-y-4">
                  <p>You have the following rights regarding your personal data:</p>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li><strong>Access and correction:</strong> Request access to the information we hold about you and ask for corrections if needed</li>
                    <li><strong>Data deletion:</strong> Request deletion of your personal data, subject to legal and operational limitations</li>
                    <li><strong>Opt-out:</strong> Withdraw consent for marketing emails and SMS communications at any time</li>
                  </ul>
                </div>
              </div>

              <div>
                <h2 className="font-rajdhani font-bold text-3xl uppercase tracking-wide text-white mb-6">
                  7. Cookies and Tracking Technologies
                </h2>
                <div className="space-y-4">
                  <p>
                    Our website may use cookies to enhance your experience. Cookies help us understand how visitors interact 
                    with our site, enabling us to improve performance and usability. You can adjust your browser settings to 
                    refuse cookies, though some features may be impacted.
                  </p>
                </div>
              </div>

              <div>
                <h2 className="font-rajdhani font-bold text-3xl uppercase tracking-wide text-white mb-6">
                  8. Changes to This Policy
                </h2>
                <div className="space-y-4">
                  <p>
                    We reserve the right to update or modify this Privacy Policy at any time. Changes will be effective 
                    immediately upon posting to our website. Please review this policy periodically to stay informed about 
                    how we protect your information.
                  </p>
                </div>
              </div>

              <div>
                <h2 className="font-rajdhani font-bold text-3xl uppercase tracking-wide text-white mb-6">
                  9. Contact Us
                </h2>
                <div className="space-y-4">
                  <p>
                    If you have any questions or concerns about this Privacy Policy or your data, please contact us:
                  </p>
                  <div className="bg-dark-card border border-primary/20 rounded-lg p-6">
                    <p><strong>The Standard Playbook INC</strong></p>
                    <p><strong>Email:</strong> privacy@standardplaybook.com</p>
                    <p><strong>Phone:</strong> +1 (555) 123-4567</p>
                    <p><strong>Address:</strong> The Standard Playbook, Austin, TX, USA</p>
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

export default Privacy;
