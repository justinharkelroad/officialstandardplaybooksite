import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import VideoModal from '@/components/VideoModal';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Target, BookOpen, Video, Users, ArrowRight, Shield, Play } from 'lucide-react';

const AppAccess = () => {
  const scrollToPricing = () => {
    const pricingSection = document.getElementById('pricing');
    if (pricingSection) {
      pricingSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen">
      <Navigation />
      
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary/10 rounded-full blur-3xl animate-float" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-primary-accent/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '3s' }} />
        </div>

        <div className="container mx-auto px-4 text-center relative z-10">
          <div className="w-16 h-16 bg-primary rounded-square flex items-center justify-center mx-auto mb-8 animate-fade-up">
            <Target className="w-8 h-8 text-white" />
          </div>
          
          <h1 className="font-rajdhani font-bold text-6xl md:text-8xl uppercase tracking-wide text-white mb-6 animate-fade-up">
            App Access
            <br />
            <span className="text-gradient">Only</span>
          </h1>
          
          <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto mb-8 animate-fade-up" style={{ animationDelay: '0.2s' }}>
            Even if you aren't ready for group or 1 on 1 coaching, let the app itself start the shift you need in your life. Choose from 2 levels of access below.
          </p>

          {/* Hero Image */}
          <div className="max-w-4xl mx-auto mb-12 animate-fade-up" style={{ animationDelay: '0.3s' }}>
            <img 
              src="/lovable-uploads/c3d40ca0-ec94-4c01-af93-49868153b917.png"
              alt="App Access Interface"
              className="w-full h-auto max-w-2xl mx-auto"
            />
          </div>

          <div className="flex justify-center animate-fade-up" style={{ animationDelay: '0.4s' }}>
            <Button 
              className="btn-primary text-lg px-8 py-4"
              onClick={scrollToPricing}
            >
              Get Started Now
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 relative">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="font-rajdhani font-bold text-4xl md:text-6xl uppercase tracking-wide text-white mb-6">
              Choose Your Access Level
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Select the level that matches your commitment to transformation.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Stack Level Access */}
            <Card className="bg-dark-card border-primary/20 card-hover">
              <CardHeader className="text-center">
                <CardTitle className="text-white font-rajdhani text-2xl uppercase tracking-wide mb-4">
                  Stack Level Access
                </CardTitle>
                <div className="mb-4">
                  <span className="text-5xl font-bold text-white">$70</span>
                  <span className="text-gray-400">/month</span>
                </div>
                <CardDescription className="text-gray-400">
                  Essential tools to start your transformation
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3 mb-8">
                  <li className="flex items-center text-gray-300">
                    <Shield className="w-5 h-5 text-primary mr-3" />
                    Core4
                  </li>
                  <li className="flex items-center text-gray-300">
                    <Shield className="w-5 h-5 text-primary mr-3" />
                    Notes
                  </li>
                  <li className="flex items-center text-gray-300">
                    <Shield className="w-5 h-5 text-primary mr-3" />
                    Assessments
                  </li>
                  <li className="flex items-center text-gray-300">
                    <Shield className="w-5 h-5 text-primary mr-3" />
                    Tribe
                  </li>
                  <li className="flex items-center text-gray-300">
                    <Shield className="w-5 h-5 text-primary mr-3" />
                    Chat
                  </li>
                </ul>
                <Button className="btn-primary w-full">
                  Get Stack Access
                </Button>
              </CardContent>
            </Card>

            {/* Arsenal Level Access */}
            <Card className="bg-dark-card border-primary relative card-hover">
              <CardHeader className="text-center">
                <CardTitle className="text-white font-rajdhani text-2xl uppercase tracking-wide mb-4">
                  Arsenal Level Access
                </CardTitle>
                <div className="mb-4">
                  <span className="text-5xl font-bold text-white">$125</span>
                  <span className="text-gray-400">/month</span>
                </div>
                <CardDescription className="text-gray-400">
                  Complete access to all transformation tools
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3 mb-8">
                  <li className="flex items-center text-gray-300">
                    <Shield className="w-5 h-5 text-primary mr-3" />
                    Core4
                  </li>
                  <li className="flex items-center text-gray-300">
                    <Shield className="w-5 h-5 text-primary mr-3" />
                    Notes
                  </li>
                  <li className="flex items-center text-gray-300">
                    <Shield className="w-5 h-5 text-primary mr-3" />
                    Assessments
                  </li>
                  <li className="flex items-center text-gray-300">
                    <Shield className="w-5 h-5 text-primary mr-3" />
                    Tribe
                  </li>
                  <li className="flex items-center text-gray-300">
                    <Shield className="w-5 h-5 text-primary mr-3" />
                    Chat
                  </li>
                  <li className="flex items-center text-gray-300">
                    <Shield className="w-5 h-5 text-primary mr-3" />
                    Stack
                  </li>
                  <li className="flex items-center text-gray-300">
                    <Shield className="w-5 h-5 text-primary mr-3" />
                    Door
                  </li>
                  <li className="flex items-center text-gray-300">
                    <Shield className="w-5 h-5 text-primary mr-3" />
                    Game
                  </li>
                  <li className="flex items-center text-gray-300">
                    <Shield className="w-5 h-5 text-primary mr-3" />
                    Armory
                  </li>
                </ul>
                <Button className="btn-primary w-full bg-primary-accent hover:bg-primary-light">
                  Get Arsenal Access
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Problem Section */}
      <section className="py-20 relative">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="font-rajdhani font-bold text-4xl md:text-5xl uppercase tracking-wide text-white mb-8">
              The Foundation Problem
            </h2>
            <p className="text-xl text-gray-300 leading-relaxed mb-8">
              Most entrepreneurs jump into advanced strategies without mastering the fundamentals. 
              They chase tactics without understanding the core principles that drive sustainable success.
            </p>
            <p className="text-lg text-gray-400">
              Without a solid foundation, even the best strategies will crumble. You need the right mindset, 
              tools, and systematic approach to build something that lasts.
            </p>
          </div>
        </div>
      </section>

      {/* Solution Section */}
      <section className="py-20 relative">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center mb-16">
            <h2 className="font-rajdhani font-bold text-4xl md:text-5xl uppercase tracking-wide text-white mb-8">
              The Standard Solution
            </h2>
            <p className="text-xl text-gray-300 leading-relaxed">
              App Access Only gives you the essential tools and frameworks to build your entrepreneurial foundation. 
              Master the basics, develop the right habits, and create the mindset for long-term success.
            </p>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <Card className="bg-dark-card border-primary/20 card-hover text-center">
              <CardHeader>
                <div className="w-16 h-16 bg-primary rounded-square flex items-center justify-center mx-auto mb-4">
                  <BookOpen className="w-8 h-8 text-white" />
                </div>
                <CardTitle className="text-white font-rajdhani text-xl uppercase tracking-wide">
                  Core Curriculum
                </CardTitle>
                <CardDescription className="text-gray-400">
                  Essential training modules covering business fundamentals
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="text-gray-300 space-y-2 text-left">
                  <li>• Mindset development frameworks</li>
                  <li>• Goal setting and achievement systems</li>
                  <li>• Time management strategies</li>
                  <li>• Business planning fundamentals</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="bg-dark-card border-primary/20 card-hover text-center">
              <CardHeader>
                <div className="w-16 h-16 bg-primary-accent rounded-square flex items-center justify-center mx-auto mb-4">
                  <Video className="w-8 h-8 text-white" />
                </div>
                <CardTitle className="text-white font-rajdhani text-xl uppercase tracking-wide">
                  Video Library
                </CardTitle>
                <CardDescription className="text-gray-400">
                  Comprehensive training videos and masterclasses
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="text-gray-300 space-y-2 text-left">
                  <li>• Weekly masterclass sessions</li>
                  <li>• Case study breakdowns</li>
                  <li>• Implementation guides</li>
                  <li>• Success story interviews</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="bg-dark-card border-primary/20 card-hover text-center">
              <CardHeader>
                <div className="w-16 h-16 bg-primary rounded-square flex items-center justify-center mx-auto mb-4">
                  <Users className="w-8 h-8 text-white" />
                </div>
                <CardTitle className="text-white font-rajdhani text-xl uppercase tracking-wide">
                  Community Access
                </CardTitle>
                <CardDescription className="text-gray-400">
                  Connect with like-minded entrepreneurs on the same journey
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="text-gray-300 space-y-2 text-left">
                  <li>• Private community forum</li>
                  <li>• Peer networking opportunities</li>
                  <li>• Accountability partnerships</li>
                  <li>• Monthly group challenges</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Video Demo Section */}
      <section className="py-20 relative">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center mb-12">
            <h2 className="font-rajdhani font-bold text-4xl md:text-5xl uppercase tracking-wide text-white mb-8">
              See It In Action
            </h2>
            <p className="text-xl text-gray-300">
              Get a preview of what's inside App Access Only and how it can transform your approach to business.
            </p>
          </div>

          <div className="relative max-w-4xl mx-auto">
            <div className="relative aspect-video bg-dark-card rounded-lg overflow-hidden border border-primary/20">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-primary-accent/20 flex items-center justify-center">
                <VideoModal
                  trigger={
                    <Button className="btn-primary text-lg px-8 py-4">
                      <Play className="w-6 h-6 mr-2" />
                      Watch Demo
                    </Button>
                  }
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 relative">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="font-rajdhani font-bold text-4xl md:text-5xl uppercase tracking-wide text-white mb-6">
              App Access FAQ
            </h2>
          </div>

          <div className="max-w-4xl mx-auto">
            <Accordion type="single" collapsible className="space-y-4">
              <AccordionItem value="item-1" className="bg-dark-card border border-primary/20 rounded-lg px-6">
                <AccordionTrigger className="text-white font-rajdhani text-lg uppercase tracking-wide">
                  What's included in App Access Only?
                </AccordionTrigger>
                <AccordionContent className="text-gray-300">
                  You get access to our complete training library, including video courses, downloadable resources, community forum, and monthly group sessions. Everything you need to build a strong entrepreneurial foundation.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-2" className="bg-dark-card border border-primary/20 rounded-lg px-6">
                <AccordionTrigger className="text-white font-rajdhani text-lg uppercase tracking-wide">
                  Can I upgrade to higher programs later?
                </AccordionTrigger>
                <AccordionContent className="text-gray-300">
                  Absolutely. App Access Only is designed as a stepping stone. Once you've mastered the fundamentals, you can upgrade to The Boardroom, Directive, or Partnership programs at any time.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-3" className="bg-dark-card border border-primary/20 rounded-lg px-6">
                <AccordionTrigger className="text-white font-rajdhani text-lg uppercase tracking-wide">
                  How long does it take to see results?
                </AccordionTrigger>
                <AccordionContent className="text-gray-300">
                  Most members start seeing mindset shifts and improved clarity within the first 30 days. Tangible business results typically follow within 60-90 days of consistent implementation.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-4" className="bg-dark-card border border-primary/20 rounded-lg px-6">
                <AccordionTrigger className="text-white font-rajdhani text-lg uppercase tracking-wide">
                  Is this suitable for complete beginners?
                </AccordionTrigger>
                <AccordionContent className="text-gray-300">
                  Yes, App Access Only is perfect for entrepreneurs at any stage who want to solidify their foundation. Whether you're just starting or have been in business for years, these fundamentals are crucial.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </div>
      </section>

      {/* Sticky CTA for Mobile */}
      <div className="fixed bottom-0 left-0 right-0 bg-dark-card border-t border-primary/20 p-4 md:hidden z-40">
        <Button className="btn-primary w-full">
          Get Started - App Access Only
        </Button>
      </div>

      <Footer />
    </div>
  );
};

export default AppAccess;
