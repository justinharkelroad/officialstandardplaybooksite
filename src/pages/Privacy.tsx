
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
            Your privacy is important to us. This policy outlines how we collect, 
            use, and protect your personal information.
          </p>
        </div>
      </section>

      {/* Privacy Content */}
      <section className="py-20 relative">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto prose prose-invert prose-lg">
            <div className="space-y-12 text-gray-300">
              
              <div>
                <h2 className="font-rajdhani font-bold text-3xl uppercase tracking-wide text-white mb-6">
                  Information We Collect
                </h2>
                <div className="space-y-4">
                  <p>
                    We collect information you provide directly to us, such as when you create an account, 
                    subscribe to our services, participate in our programs, or contact us for support.
                  </p>
                  <p>
                    This may include:
                  </p>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>Name, email address, and contact information</li>
                    <li>Business information and goals</li>
                    <li>Payment and billing information</li>
                    <li>Communications with our team</li>
                    <li>Program participation and progress data</li>
                  </ul>
                </div>
              </div>

              <div>
                <h2 className="font-rajdhani font-bold text-3xl uppercase tracking-wide text-white mb-6">
                  How We Use Your Information
                </h2>
                <div className="space-y-4">
                  <p>
                    We use the information we collect to:
                  </p>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>Provide, maintain, and improve our services</li>
                    <li>Process transactions and send related information</li>
                    <li>Send technical notices, updates, and support messages</li>
                    <li>Respond to your comments, questions, and requests</li>
                    <li>Communicate about programs, features, and promotional offers</li>
                    <li>Monitor and analyze trends and usage</li>
                    <li>Detect, investigate, and prevent fraudulent transactions</li>
                  </ul>
                </div>
              </div>

              <div>
                <h2 className="font-rajdhani font-bold text-3xl uppercase tracking-wide text-white mb-6">
                  Information Sharing
                </h2>
                <div className="space-y-4">
                  <p>
                    We do not sell, trade, or otherwise transfer your personal information to third parties 
                    without your consent, except as described in this policy.
                  </p>
                  <p>
                    We may share your information in the following situations:
                  </p>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>With service providers who assist in operating our business</li>
                    <li>To comply with legal obligations or protect our rights</li>
                    <li>In connection with a business transfer or acquisition</li>
                    <li>With your explicit consent</li>
                  </ul>
                </div>
              </div>

              <div>
                <h2 className="font-rajdhani font-bold text-3xl uppercase tracking-wide text-white mb-6">
                  Data Security
                </h2>
                <div className="space-y-4">
                  <p>
                    We implement appropriate technical and organizational measures to protect your personal 
                    information against unauthorized access, alteration, disclosure, or destruction.
                  </p>
                  <p>
                    These measures include:
                  </p>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>Encryption of sensitive data in transit and at rest</li>
                    <li>Regular security assessments and updates</li>
                    <li>Access controls and authentication requirements</li>
                    <li>Employee training on data protection practices</li>
                  </ul>
                </div>
              </div>

              <div>
                <h2 className="font-rajdhani font-bold text-3xl uppercase tracking-wide text-white mb-6">
                  Your Rights
                </h2>
                <div className="space-y-4">
                  <p>
                    Depending on your location, you may have certain rights regarding your personal information:
                  </p>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>Access to your personal information</li>
                    <li>Correction of inaccurate information</li>
                    <li>Deletion of your personal information</li>
                    <li>Restriction of processing</li>
                    <li>Data portability</li>
                    <li>Objection to processing</li>
                  </ul>
                  <p>
                    To exercise these rights, please contact us using the information provided below.
                  </p>
                </div>
              </div>

              <div>
                <h2 className="font-rajdhani font-bold text-3xl uppercase tracking-wide text-white mb-6">
                  Cookies and Tracking
                </h2>
                <div className="space-y-4">
                  <p>
                    We use cookies and similar tracking technologies to collect and use personal information. 
                    This helps us provide a better user experience and analyze how our services are used.
                  </p>
                  <p>
                    You can control cookie settings through your browser, but disabling cookies may affect 
                    the functionality of our services.
                  </p>
                </div>
              </div>

              <div>
                <h2 className="font-rajdhani font-bold text-3xl uppercase tracking-wide text-white mb-6">
                  Changes to This Policy
                </h2>
                <div className="space-y-4">
                  <p>
                    We may update this privacy policy from time to time. We will notify you of any changes 
                    by posting the new policy on this page and updating the "Last Updated" date.
                  </p>
                  <p>
                    We encourage you to review this policy periodically to stay informed about how we 
                    protect your information.
                  </p>
                </div>
              </div>

              <div>
                <h2 className="font-rajdhani font-bold text-3xl uppercase tracking-wide text-white mb-6">
                  Contact Information
                </h2>
                <div className="space-y-4">
                  <p>
                    If you have any questions about this privacy policy or our data practices, please contact us:
                  </p>
                  <div className="bg-dark-card border border-primary/20 rounded-lg p-6">
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
