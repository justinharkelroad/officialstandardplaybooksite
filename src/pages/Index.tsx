import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import VideoModal from '@/components/VideoModal';
import SoftwareSection from '@/components/SoftwareSection';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Link } from 'react-router-dom';
import { ArrowRight, Play, Target, Users, Zap, Crown, Shield, TrendingUp } from 'lucide-react';
import { useEffect, useState } from 'react';

const Index = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth - 0.5) * 20,
        y: (e.clientY / window.innerHeight - 0.5) * 20
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen">
      <Navigation />
      
      {/* Hero Section */}
      <section id="hero" className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Parallax Background Elements */}
        <div 
          className="absolute inset-0 opacity-20"
          style={{
            transform: `translate(${mousePosition.x * 0.5}px, ${mousePosition.y * 0.5}px)`
          }}
        >
          <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary/10 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-primary-accent/10 rounded-full blur-3xl" />
        </div>

        <div className="container mx-auto px-4 text-center relative z-10">
          <h1 className="font-rajdhani font-bold text-6xl md:text-8xl uppercase tracking-wide text-white mb-6 animate-fade-up">
            Raise Your Standard.
            <br />
            <span className="text-gradient">Live the Playbook.</span>
          </h1>
          
          <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto mb-12 animate-fade-up" style={{ animationDelay: '0.2s' }}>
            Elite coaching for entrepreneurs who refuse to settle. Transform your business, 
            elevate your mindset, and join the ranks of high performers.
          </p>

          {/* Video Frame with Background Glow */}
          <div className="relative max-w-4xl mx-auto mb-12 animate-fade-up" style={{ animationDelay: '0.4s' }}>
            <div className="video-glow absolute -inset-4"></div>
            <div className="relative aspect-video bg-dark-card rounded-lg overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-primary-accent/20 flex items-center justify-center">
                <VideoModal
                  trigger={
                    <Button className="btn-primary text-lg px-8 py-4">
                      <svg className="w-6 h-6 mr-2" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M8 5v14l11-7z"/>
                      </svg>
                      Watch Demo
                    </Button>
                  }
                />
              </div>
            </div>
          </div>

          <div className="animate-fade-up" style={{ animationDelay: '0.6s' }}>
            <Button 
              onClick={() => scrollToSection('offers')}
              className="btn-primary text-lg px-8 py-4"
            >
              SEE OPTIONS
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </div>
        </div>
      </section>

      {/* The Software Section */}
      <SoftwareSection />

      {/* Offers Grid */}
      <section id="offers" className="py-20 relative">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="font-rajdhani font-bold text-4xl md:text-6xl uppercase tracking-wide text-white mb-6">
              Choose Your Path
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Five distinct programs designed for different stages of your entrepreneurial journey.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* App Access */}
            <Link to="/app" className="card-hover">
              <Card className="bg-dark-card border-primary/20 h-full group">
                <CardHeader>
                  <div className="w-12 h-12 bg-primary rounded-square flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <Target className="w-6 h-6 text-white" />
                  </div>
                  <CardTitle className="text-white font-rajdhani text-2xl uppercase tracking-wide">
                    App Access Only
                  </CardTitle>
                  <CardDescription className="text-gray-400">
                    Get started with our foundational tools and resources.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-300 mb-4">
                    Perfect for entrepreneurs just beginning their journey to excellence.
                  </p>
                  <div className="flex items-center text-primary">
                    <span className="font-semibold">Learn More</span>
                    <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </div>
                </CardContent>
              </Card>
            </Link>

            {/* External Link */}
            <a href="https://standardcallscoring.io" target="_blank" rel="noopener noreferrer" className="card-hover">
              <Card className="bg-dark-card border-primary/20 h-full group">
                <CardHeader>
                  <div className="w-12 h-12 bg-primary-accent rounded-square flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <TrendingUp className="w-6 h-6 text-white" />
                  </div>
                  <CardTitle className="text-white font-rajdhani text-2xl uppercase tracking-wide">
                    Call Scoring
                  </CardTitle>
                  <CardDescription className="text-gray-400">
                    Advanced analytics for sales performance optimization.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-300 mb-4">
                    Detailed call analysis and scoring to improve your sales conversions.
                  </p>
                  <div className="flex items-center text-primary-accent">
                    <span className="font-semibold">Visit Platform</span>
                    <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </div>
                </CardContent>
              </Card>
            </a>

            {/* The Boardroom */}
            <Link to="/boardroom" className="card-hover">
              <Card className="bg-dark-card border-primary/20 h-full group">
                <CardHeader>
                  <div className="w-12 h-12 bg-primary rounded-square flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <Users className="w-6 h-6 text-white" />
                  </div>
                  <CardTitle className="text-white font-rajdhani text-2xl uppercase tracking-wide">
                    The Standard Boardroom
                  </CardTitle>
                  <CardDescription className="text-gray-400">
                    Elite community and strategic guidance.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-300 mb-4">
                    Join our exclusive community of high-performing entrepreneurs.
                  </p>
                  <div className="flex items-center text-primary">
                    <span className="font-semibold">Learn More</span>
                    <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </div>
                </CardContent>
              </Card>
            </Link>

            {/* The Directive */}
            <Link to="/directive" className="card-hover lg:col-start-2">
              <Card className="bg-dark-card border-primary/20 h-full group">
                <CardHeader>
                  <div className="w-12 h-12 bg-primary-accent rounded-square flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <Zap className="w-6 h-6 text-white" />
                  </div>
                  <CardTitle className="text-white font-rajdhani text-2xl uppercase tracking-wide">
                    The Directive
                  </CardTitle>
                  <CardDescription className="text-gray-400">
                    Intensive coaching and implementation.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-300 mb-4">
                    Direct access to our coaches with personalized strategies.
                  </p>
                  <div className="flex items-center text-primary-accent">
                    <span className="font-semibold">Learn More</span>
                    <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </div>
                </CardContent>
              </Card>
            </Link>

            {/* The Partnership */}
            <Link to="/partnership" className="card-hover">
              <Card className="bg-dark-card border-primary/20 h-full group">
                <CardHeader>
                  <div className="w-12 h-12 bg-primary rounded-square flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <Crown className="w-6 h-6 text-white" />
                  </div>
                  <CardTitle className="text-white font-rajdhani text-2xl uppercase tracking-wide">
                    The Partnership
                  </CardTitle>
                  <CardDescription className="text-gray-400">
                    Ultimate white-glove service and partnership.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-300 mb-4">
                    The highest level of engagement for serious entrepreneurs.
                  </p>
                  <div className="flex items-center text-primary">
                    <span className="font-semibold">Learn More</span>
                    <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </div>
                </CardContent>
              </Card>
            </Link>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 relative">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="font-rajdhani font-bold text-4xl md:text-6xl uppercase tracking-wide text-white mb-6">
              Investment Levels
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Choose the level of commitment that matches your ambition.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* Boardroom */}
            <Card className="bg-dark-card border-primary/20 card-hover">
              <CardHeader className="text-center">
                <CardTitle className="text-white font-rajdhani text-2xl uppercase tracking-wide mb-4">
                  The Boardroom
                </CardTitle>
                <div className="mb-4">
                  <span className="text-5xl font-bold text-white">$350</span>
                  <span className="text-gray-400">/month</span>
                </div>
                <CardDescription className="text-gray-400">
                  Elite community access and strategic resources
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3 mb-8">
                  <li className="flex items-center text-gray-300">
                    <Shield className="w-5 h-5 text-primary mr-3" />
                    Weekly group coaching calls
                  </li>
                  <li className="flex items-center text-gray-300">
                    <Shield className="w-5 h-5 text-primary mr-3" />
                    Private community access
                  </li>
                  <li className="flex items-center text-gray-300">
                    <Shield className="w-5 h-5 text-primary mr-3" />
                    Monthly strategy sessions
                  </li>
                  <li className="flex items-center text-gray-300">
                    <Shield className="w-5 h-5 text-primary mr-3" />
                    Resource library access
                  </li>
                </ul>
                <Button className="btn-primary w-full">
                  Join The Boardroom
                </Button>
              </CardContent>
            </Card>

            {/* Directive - Featured */}
            <Card className="bg-dark-card border-primary relative card-hover animate-pulse-neon">
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <span className="bg-primary text-white px-4 py-1 rounded-pill text-sm font-semibold uppercase tracking-wide">
                  Most Popular
                </span>
              </div>
              <CardHeader className="text-center">
                <CardTitle className="text-white font-rajdhani text-2xl uppercase tracking-wide mb-4">
                  The Directive
                </CardTitle>
                <div className="mb-4">
                  <span className="text-5xl font-bold text-white">$750</span>
                  <span className="text-gray-400">/month</span>
                </div>
                <CardDescription className="text-gray-400">
                  Intensive coaching with direct implementation support
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3 mb-8">
                  <li className="flex items-center text-gray-300">
                    <Shield className="w-5 h-5 text-primary mr-3" />
                    Everything in Boardroom
                  </li>
                  <li className="flex items-center text-gray-300">
                    <Shield className="w-5 h-5 text-primary mr-3" />
                    Bi-weekly 1:1 coaching
                  </li>
                  <li className="flex items-center text-gray-300">
                    <Shield className="w-5 h-5 text-primary mr-3" />
                    Custom strategy development
                  </li>
                  <li className="flex items-center text-gray-300">
                    <Shield className="w-5 h-5 text-primary mr-3" />
                    Implementation tracking
                  </li>
                  <li className="flex items-center text-gray-300">
                    <Shield className="w-5 h-5 text-primary mr-3" />
                    Priority support
                  </li>
                </ul>
                <Button className="btn-primary w-full bg-primary-accent hover:bg-primary-light">
                  Join The Directive
                </Button>
              </CardContent>
            </Card>

            {/* Partnership */}
            <Card className="bg-dark-card border-primary/20 card-hover">
              <CardHeader className="text-center">
                <CardTitle className="text-white font-rajdhani text-2xl uppercase tracking-wide mb-4">
                  The Partnership
                </CardTitle>
                <div className="mb-4">
                  <span className="text-3xl font-bold text-white">Custom</span>
                </div>
                <CardDescription className="text-gray-400">
                  White-glove service and true partnership
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3 mb-8">
                  <li className="flex items-center text-gray-300">
                    <Crown className="w-5 h-5 text-primary mr-3" />
                    Everything in Directive
                  </li>
                  <li className="flex items-center text-gray-300">
                    <Crown className="w-5 h-5 text-primary mr-3" />
                    Weekly 1:1 sessions
                  </li>
                  <li className="flex items-center text-gray-300">
                    <Crown className="w-5 h-5 text-primary mr-3" />
                    Direct phone access
                  </li>
                  <li className="flex items-center text-gray-300">
                    <Crown className="w-5 h-5 text-primary mr-3" />
                    Business partnership
                  </li>
                  <li className="flex items-center text-gray-300">
                    <Crown className="w-5 h-5 text-primary mr-3" />
                    Revenue sharing opportunities
                  </li>
                </ul>
                <Button className="btn-ghost w-full">
                  Apply Now
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-20 relative">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="font-rajdhani font-bold text-4xl md:text-6xl uppercase tracking-wide text-white mb-6">
              Success Stories
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <Card className="bg-dark-card border-primary/20 card-hover">
              <CardContent className="pt-6">
                <div className="mb-4">
                  <div className="flex text-primary mb-2">
                    {[...Array(5)].map((_, i) => (
                      <svg key={i} className="w-5 h-5 fill-current" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                  <blockquote className="text-gray-300 italic">
                    "The Standard Playbook completely transformed how I approach business. The strategies are game-changing."
                  </blockquote>
                </div>
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center mr-3">
                    <span className="text-white font-semibold">MJ</span>
                  </div>
                  <div>
                    <p className="text-white font-semibold">Michael Johnson</p>
                    <p className="text-gray-400 text-sm">CEO, TechVentures</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-dark-card border-primary/20 card-hover">
              <CardContent className="pt-6">
                <div className="mb-4">
                  <div className="flex text-primary mb-2">
                    {[...Array(5)].map((_, i) => (
                      <svg key={i} className="w-5 h-5 fill-current" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                  <blockquote className="text-gray-300 italic">
                    "Working with The Standard team elevated my business to seven figures. The community is incredible."
                  </blockquote>
                </div>
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-primary-accent rounded-full flex items-center justify-center mr-3">
                    <span className="text-white font-semibold">SR</span>
                  </div>
                  <div>
                    <p className="text-white font-semibold">Sarah Rodriguez</p>
                    <p className="text-gray-400 text-sm">Founder, Digital Empire</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-dark-card border-primary/20 card-hover">
              <CardContent className="pt-6">
                <div className="mb-4">
                  <div className="flex text-primary mb-2">
                    {[...Array(5)].map((_, i) => (
                      <svg key={i} className="w-5 h-5 fill-current" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                  <blockquote className="text-gray-300 italic">
                    "The accountability and strategic guidance helped me scale faster than I ever thought possible."
                  </blockquote>
                </div>
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center mr-3">
                    <span className="text-white font-semibold">DK</span>
                  </div>
                  <div>
                    <p className="text-white font-semibold">David Kim</p>
                    <p className="text-gray-400 text-sm">Co-Founder, Growth Labs</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="py-20 relative">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="font-rajdhani font-bold text-4xl md:text-6xl uppercase tracking-wide text-white mb-6">
              Frequently Asked Questions
            </h2>
          </div>

          <div className="max-w-4xl mx-auto">
            <Accordion type="single" collapsible className="space-y-4">
              <AccordionItem value="item-1" className="bg-dark-card border border-primary/20 rounded-lg px-6">
                <AccordionTrigger className="text-white font-rajdhani text-lg uppercase tracking-wide">
                  What makes The Standard Playbook different?
                </AccordionTrigger>
                <AccordionContent className="text-gray-300">
                  We focus exclusively on high-performing entrepreneurs who are serious about scaling. Our proven systems, elite community, and hands-on approach deliver results that speak for themselves.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-2" className="bg-dark-card border border-primary/20 rounded-lg px-6">
                <AccordionTrigger className="text-white font-rajdhani text-lg uppercase tracking-wide">
                  Can I switch between programs?
                </AccordionTrigger>
                <AccordionContent className="text-gray-300">
                  Absolutely. We understand that your needs evolve as your business grows. You can upgrade or adjust your program at any time to match your current goals and requirements.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-3" className="bg-dark-card border border-primary/20 rounded-lg px-6">
                <AccordionTrigger className="text-white font-rajdhani text-lg uppercase tracking-wide">
                  Is there a free trial available?
                </AccordionTrigger>
                <AccordionContent className="text-gray-300">
                  Yes, we offer a 14-day free trial for new members to experience our platform and community. This gives you full access to see if we're the right fit for your goals.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-4" className="bg-dark-card border border-primary/20 rounded-lg px-6">
                <AccordionTrigger className="text-white font-rajdhani text-lg uppercase tracking-wide">
                  What kind of results can I expect?
                </AccordionTrigger>
                <AccordionContent className="text-gray-300">
                  Our members typically see significant improvements in revenue, operational efficiency, and leadership effectiveness within 90 days. However, results depend on your commitment to implementation.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-5" className="bg-dark-card border border-primary/20 rounded-lg px-6">
                <AccordionTrigger className="text-white font-rajdhani text-lg uppercase tracking-wide">
                  Who is this program for?
                </AccordionTrigger>
                <AccordionContent className="text-gray-300">
                  Our programs are designed for ambitious entrepreneurs, business owners, and executives who are already generating revenue and want to scale to the next level. We work with serious professionals who are committed to excellence.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Index;
