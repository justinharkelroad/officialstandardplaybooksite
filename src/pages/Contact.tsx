import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { Card, CardContent } from '@/components/ui/card';
import { Mail, Phone, MapPin, Clock } from 'lucide-react';
import Breadcrumb from '@/components/Breadcrumb';

const Contact = () => {
  return (
    <div className="min-h-screen">
      <Navigation />
      
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary/10 rounded-full blur-3xl animate-float" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-primary-accent/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '3s' }} />
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <Breadcrumb />
          <div className="text-center">
            <h1 className="font-rajdhani font-bold text-6xl md:text-8xl uppercase tracking-wide text-white mb-6 animate-fade-up">
              Contact
              <br />
              <span className="text-gradient">The Standard</span>
            </h1>
            
            <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto animate-fade-up" style={{ animationDelay: '0.2s' }}>
              Ready to raise your standard? Get in touch with our team to discuss how 
              we can help accelerate your success.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <main className="py-20 relative">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            
            {/* Contact Info */}
            <div className="space-y-8">
              <div className="text-center">
                <h2 className="font-rajdhani font-bold text-4xl uppercase tracking-wide text-white mb-6">
                  Get In Touch
                </h2>
                <p className="text-lg text-gray-300 leading-relaxed mb-12 max-w-3xl mx-auto">
                  Whether you're ready to start your journey or have questions about our programs, 
                  we're here to help. Reach out and let's discuss how The Standard Playbook can 
                  transform your business.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
                <Card className="bg-dark-card border-primary/20">
                  <CardContent className="p-6">
                    <div className="flex items-center">
                      <div className="w-12 h-12 bg-primary rounded-square flex items-center justify-center mr-4">
                        <Mail className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h3 className="text-white font-rajdhani text-lg uppercase tracking-wide">Email</h3>
                        <p className="text-gray-300">info@standardplaybook.com</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-dark-card border-primary/20">
                  <CardContent className="p-6">
                    <div className="flex items-center">
                      <div className="w-12 h-12 bg-primary-accent rounded-square flex items-center justify-center mr-4">
                        <Phone className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h3 className="text-white font-rajdhani text-lg uppercase tracking-wide">Phone</h3>
                        <p className="text-gray-300">+1 (260) 515-1349</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-dark-card border-primary/20">
                  <CardContent className="p-6">
                    <div className="flex items-center">
                      <div className="w-12 h-12 bg-primary rounded-square flex items-center justify-center mr-4">
                        <MapPin className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h3 className="text-white font-rajdhani text-lg uppercase tracking-wide">Office</h3>
                        <p className="text-gray-300">Fort Wayne, IN, USA</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-dark-card border-primary/20">
                  <CardContent className="p-6">
                    <div className="flex items-center">
                      <div className="w-12 h-12 bg-primary-accent rounded-square flex items-center justify-center mr-4">
                        <Clock className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h3 className="text-white font-rajdhani text-lg uppercase tracking-wide">Response Time</h3>
                        <p className="text-gray-300">Within 24 hours</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Map Section */}
      <section className="py-20 relative">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="font-rajdhani font-bold text-4xl uppercase tracking-wide text-white mb-8 text-center">
              Our Location
            </h2>
            <div className="relative aspect-video bg-dark-card rounded-lg overflow-hidden border border-primary/20">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-primary-accent/20 flex items-center justify-center">
                <div className="text-center">
                  <MapPin className="w-16 h-16 text-primary mx-auto mb-4" />
                  <h3 className="text-white font-rajdhani text-2xl uppercase tracking-wide mb-2">
                    Fort Wayne, Indiana
                  </h3>
                  <p className="text-gray-300">
                    Serving insurance agencies nationwide
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Contact;
