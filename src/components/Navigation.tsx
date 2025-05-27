
import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const Navigation = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const isHomePage = location.pathname === '/';

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (sectionId: string) => {
    if (isHomePage) {
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      window.location.href = `/#${sectionId}`;
    }
    setIsMobileMenuOpen(false);
  };

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      isScrolled ? 'glass-nav py-2' : 'bg-transparent py-4'
    }`}>
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-3">
            <img 
              src="/lovable-uploads/4deb3fe9-ca1d-47f7-83bb-8df8138f576b.png" 
              alt="The Standard Logo" 
              className="h-10 w-auto"
            />
            <span className="text-white font-rajdhani font-bold text-xl uppercase tracking-wide">
              The Standard
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-white hover:text-primary transition-colors">
              Home
            </Link>
            <button 
              onClick={() => scrollToSection('offers')}
              className="text-white hover:text-primary transition-colors"
            >
              Offers
            </button>
            <button 
              onClick={() => scrollToSection('pricing')}
              className="text-white hover:text-primary transition-colors"
            >
              Pricing
            </button>
            <button 
              onClick={() => scrollToSection('testimonials')}
              className="text-white hover:text-primary transition-colors"
            >
              Testimonials
            </button>
            <button 
              onClick={() => scrollToSection('faq')}
              className="text-white hover:text-primary transition-colors"
            >
              FAQ
            </button>
            <Link to="/about" className="text-white hover:text-primary transition-colors">
              About
            </Link>
            <Link to="/contact" className="text-white hover:text-primary transition-colors">
              Contact
            </Link>
          </div>

          <div className="hidden md:block">
            <Button 
              onClick={() => scrollToSection('pricing')}
              className="btn-primary"
            >
              Join Now
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-white"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {isMobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden mt-4 pb-4 border-t border-primary/20">
            <div className="flex flex-col space-y-4 pt-4">
              <Link to="/" className="text-white hover:text-primary transition-colors">
                Home
              </Link>
              <button 
                onClick={() => scrollToSection('offers')}
                className="text-white hover:text-primary transition-colors text-left"
              >
                Offers
              </button>
              <button 
                onClick={() => scrollToSection('pricing')}
                className="text-white hover:text-primary transition-colors text-left"
              >
                Pricing
              </button>
              <button 
                onClick={() => scrollToSection('testimonials')}
                className="text-white hover:text-primary transition-colors text-left"
              >
                Testimonials
              </button>
              <button 
                onClick={() => scrollToSection('faq')}
                className="text-white hover:text-primary transition-colors text-left"
              >
                FAQ
              </button>
              <Link to="/about" className="text-white hover:text-primary transition-colors">
                About
              </Link>
              <Link to="/contact" className="text-white hover:text-primary transition-colors">
                Contact
              </Link>
              <Button 
                onClick={() => scrollToSection('pricing')}
                className="btn-primary self-start"
              >
                Join Now
              </Button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;
