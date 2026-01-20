import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import profileImage from '@/assets/profile-image.png';

const Links = () => {
  const links = [
    {
      title: 'THE BOARDROOM',
      href: '/boardroom',
      external: false,
    },
    {
      title: '8 WEEK SALES MANAGEMENT TRAINING',
      href: '/sales-experience',
      external: false,
    },
    {
      title: 'AI CALL SCORING',
      href: 'https://standardcallscoring.com',
      external: true,
    },
    {
      title: 'FORMULA FORUM',
      href: 'https://f3florida.com',
      external: true,
    },
  ];

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-xl space-y-8">
        {/* Profile Image */}
        <div className="flex justify-center mb-12">
          <img 
            src={profileImage} 
            alt="Profile" 
            className="w-48 h-48 rounded-full object-cover object-center border-4 border-primary/40 shadow-xl shadow-primary/20"
          />
        </div>

        {/* Links */}
        <div className="space-y-4">
          {links.map((link) => (
            link.external ? (
              <a
                key={link.title}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary w-full h-16 flex items-center justify-between px-8 text-lg font-rajdhani font-bold tracking-wide group"
              >
                <span>{link.title}</span>
                <ArrowRight className="w-6 h-6 transition-transform group-hover:translate-x-1" />
              </a>
            ) : (
              <Link
                key={link.title}
                to={link.href}
                className="btn-primary w-full h-16 flex items-center justify-between px-8 text-lg font-rajdhani font-bold tracking-wide group"
              >
                <span>{link.title}</span>
                <ArrowRight className="w-6 h-6 transition-transform group-hover:translate-x-1" />
              </Link>
            )
          ))}

          {/* Book a Call Button */}
          <a
            href="https://AGENCYCOACHING.as.me/standardfit"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary w-full h-16 flex items-center justify-between px-8 text-lg font-rajdhani font-bold tracking-wide group"
          >
            <span>BOOK FREE CALL</span>
            <ArrowRight className="w-6 h-6 transition-transform group-hover:translate-x-1" />
          </a>
        </div>
      </div>
    </div>
  );
};

export default Links;
