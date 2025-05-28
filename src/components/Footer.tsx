
import { Link } from 'react-router-dom';
import { Facebook, Linkedin } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-dark-card border-t border-primary/20 py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center mb-4">
              <img 
                src="/lovable-uploads/24e794d7-4e09-4244-9d1e-df95f10e3f3f.png" 
                alt="The Standard Logo" 
                className="h-12 w-auto object-contain"
                onError={(e) => {
                  console.log('Logo failed to load:', e);
                  e.currentTarget.style.display = 'none';
                }}
              />
            </div>
            <p className="text-gray-400 max-w-md mb-6">
              High-performance coaching for elite agency owners. Raise your standard and live the playbook.
            </p>
            <div className="flex space-x-4">
              <a href="https://www.facebook.com/profile.php?id=61560049427918" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-primary transition-colors">
                <Facebook className="w-6 h-6" />
              </a>
              <a href="https://www.linkedin.com/in/justinhark/" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-primary transition-colors">
                <Linkedin className="w-6 h-6" />
              </a>
            </div>
          </div>
          
          <div>
            <h4 className="text-white font-rajdhani font-semibold text-lg mb-4 uppercase tracking-wide">
              Programs
            </h4>
            <ul className="space-y-2">
              <li><Link to="/app" className="text-gray-400 hover:text-primary transition-colors">App Access</Link></li>
              <li><Link to="/boardroom" className="text-gray-400 hover:text-primary transition-colors">The Boardroom</Link></li>
              <li><Link to="/directive" className="text-gray-400 hover:text-primary transition-colors">The Directive</Link></li>
              <li><Link to="/partnership" className="text-gray-400 hover:text-primary transition-colors">The Partnership</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-rajdhani font-semibold text-lg mb-4 uppercase tracking-wide">
              Legal
            </h4>
            <ul className="space-y-2">
              <li><Link to="/privacy" className="text-gray-400 hover:text-primary transition-colors">Privacy Policy</Link></li>
              <li><Link to="/terms" className="text-gray-400 hover:text-primary transition-colors">Terms of Service</Link></li>
              <li><Link to="/contact" className="text-gray-400 hover:text-primary transition-colors">Contact</Link></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-primary/20 mt-8 pt-8 text-center">
          <p className="text-gray-400">
            © 2024 The Standard Playbook. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
