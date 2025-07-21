
import { ChevronRight, Home } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

const Breadcrumb = () => {
  const location = useLocation();
  const pathnames = location.pathname.split('/').filter((x) => x);

  const getBreadcrumbName = (path: string): string => {
    const breadcrumbNames: Record<string, string> = {
      'app': 'App Access',
      'boardroom': 'The Boardroom',
      'directive': 'Directive',
      'partnership': 'Partnership',
      'sales-experience': 'Sales Experience',
      'producer-power-up': 'Producer Power Up',
      'owner-challenge': 'Owner Challenge',
      'about': 'About',
      'contact': 'Contact',
      'privacy': 'Privacy Policy',
      'terms': 'Terms of Service'
    };
    return breadcrumbNames[path] || path;
  };

  if (pathnames.length === 0) return null;

  return (
    <nav className="flex items-center space-x-2 text-sm text-gray-400 mb-6" aria-label="Breadcrumb">
      <Link to="/" className="hover:text-primary transition-colors flex items-center">
        <Home className="w-4 h-4" />
        <span className="sr-only">Home</span>
      </Link>
      
      {pathnames.map((value, index) => {
        const to = `/${pathnames.slice(0, index + 1).join('/')}`;
        const isLast = index === pathnames.length - 1;
        
        return (
          <div key={to} className="flex items-center">
            <ChevronRight className="w-4 h-4 mx-2" />
            {isLast ? (
              <span className="text-white font-medium" aria-current="page">
                {getBreadcrumbName(value)}
              </span>
            ) : (
              <Link 
                to={to} 
                className="hover:text-primary transition-colors"
              >
                {getBreadcrumbName(value)}
              </Link>
            )}
          </div>
        );
      })}
    </nav>
  );
};

export default Breadcrumb;
