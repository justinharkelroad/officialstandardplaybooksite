
import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ChevronDown } from 'lucide-react';
import PackageComparison from '@/components/PackageComparison';

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
      isScrolled ? 'glass-nav py-2' : 'bg-dark-card/90 backdrop-blur-md py-4'
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
            <PackageComparison 
              trigger={
                <button className="text-white hover:text-primary transition-colors">
                  Access Levels
                </button>
              }
            />
            <Link to="/sales-experience" className="text-white hover:text-primary transition-colors">
              8 Week Training
            </Link>
            <Link to="/contact" className="text-white hover:text-primary transition-colors">
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
          <div className="md:hidden mt-4 pb-4 border-t border-primary/20">
            <div className="flex flex-col space-y-4 pt-4">
              {!isHomePage && (
                <Link to="/" className="text-white hover:text-primary transition-colors">
                  Home
                </Link>
              )}
              <PackageComparison 
                trigger={
                  <button className="text-white hover:text-primary transition-colors text-left">
                    Access Levels
                  </button>
                }
              />
              <Link to="/sales-experience" className="text-white hover:text-primary transition-colors">
                8 Week Training
              </Link>
              <Link to="/contact" className="text-white hover:text-primary transition-colors">
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
