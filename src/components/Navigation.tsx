
import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useScrollDirection } from '@/hooks/useScrollDirection';

const Navigation = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const scrollDirection = useScrollDirection();
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
      isScrolled ? 'glass-nav py-2' : 'bg-dark-surface/95 backdrop-blur-lg py-4'
    } ${
      scrollDirection === 'down' && isScrolled ? '-translate-y-full' : 'translate-y-0'
    }`}>
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center">
            <img 
              src="/lovable-uploads/24e794d7-4e09-4244-9d1e-df95f10e3f3f.png" 
              alt="The Standard Logo" 
              className="h-12 w-auto object-contain"
              onError={(e) => {
                console.log('Logo failed to load:', e);
                e.currentTarget.style.display = 'none';
              }}
            />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {!isHomePage && (
              <Link to="/" className="text-white hover:text-primary transition-colors">
                Home
              </Link>
            )}
            <Link to="/app" className="text-white hover:text-primary transition-colors link-underline">
              Standard App
            </Link>
            <Link to="/thechallenge" className="text-white hover:text-primary transition-colors link-underline">
              LSP Challenge
            </Link>
            <Link to="/sales-experience" className="text-white hover:text-primary transition-colors link-underline">
              8 Week Training
            </Link>
            <Link to="/boardroom" className="text-white hover:text-primary transition-colors link-underline">
              Boardroom
            </Link>
            <Link to="/directive" className="text-white hover:text-primary transition-colors link-underline">
              Directive
            </Link>
            <Link to="/partnership" className="text-white hover:text-primary transition-colors link-underline">
              Partnership
            </Link>
            <Link to="/about" className="text-white hover:text-primary transition-colors link-underline">
              About
            </Link>
            <Link to="/contact" className="text-white hover:text-primary transition-colors link-underline">
              Contact
            </Link>
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
          <div className="md:hidden fixed inset-0 top-[72px] bg-dark-surface/98 backdrop-blur-xl z-40 animate-fade-in">
            <div className="flex flex-col space-y-6 p-8 h-full overflow-y-auto">
              {!isHomePage && (
                <Link to="/" className="text-white text-xl font-medium hover:text-primary transition-colors" onClick={() => setIsMobileMenuOpen(false)}>
                  Home
                </Link>
              )}
              <Link to="/app" className="text-white text-xl font-medium hover:text-primary transition-colors" onClick={() => setIsMobileMenuOpen(false)}>
                Standard App
              </Link>
              <Link to="/thechallenge" className="text-white text-xl font-medium hover:text-primary transition-colors" onClick={() => setIsMobileMenuOpen(false)}>
                LSP Challenge
              </Link>
              <Link to="/sales-experience" className="text-white text-xl font-medium hover:text-primary transition-colors" onClick={() => setIsMobileMenuOpen(false)}>
                8 Week Training
              </Link>
              <Link to="/boardroom" className="text-white text-xl font-medium hover:text-primary transition-colors" onClick={() => setIsMobileMenuOpen(false)}>
                Boardroom
              </Link>
              <Link to="/directive" className="text-white text-xl font-medium hover:text-primary transition-colors" onClick={() => setIsMobileMenuOpen(false)}>
                Directive
              </Link>
              <Link to="/partnership" className="text-white text-xl font-medium hover:text-primary transition-colors" onClick={() => setIsMobileMenuOpen(false)}>
                Partnership
              </Link>
              <Link to="/about" className="text-white text-xl font-medium hover:text-primary transition-colors" onClick={() => setIsMobileMenuOpen(false)}>
                About
              </Link>
              <Link to="/contact" className="text-white text-xl font-medium hover:text-primary transition-colors" onClick={() => setIsMobileMenuOpen(false)}>
                Contact
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;
