import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

const sf = '-apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", "Helvetica Neue", Helvetica, Arial, sans-serif';

const Navigation = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const isHomePage = location.pathname === '/';

  const navLinks = [
    { label: 'Agency Brain', href: isHomePage ? '#agency-brain' : '/#agency-brain' },
    { label: 'Programs', href: isHomePage ? '#programs' : '/#programs' },
    { label: '8-Week', to: '/sales-experience' },
    { label: 'Training', to: '/training' },
    { label: 'Contact', to: '/contact' },
    { label: 'Nutrition', href: 'https://standardnutrition.app', external: true },
  ];

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50"
      style={{
        height: 48,
        background: 'rgba(0, 0, 0, 0.8)',
        backdropFilter: 'saturate(180%) blur(20px)',
        WebkitBackdropFilter: 'saturate(180%) blur(20px)',
        fontFamily: sf,
      }}
    >
      <div className="max-w-[980px] mx-auto h-full px-6 flex items-center justify-center">
        {/* Desktop — centered links */}
        <div className="hidden md:flex items-center gap-10">
          {navLinks.map((link) =>
            link.to ? (
              <Link
                key={link.label}
                to={link.to}
                className="text-white/80 hover:text-white transition-colors"
                style={{ fontSize: 12, fontWeight: 400, letterSpacing: '-0.01em' }}
              >
                {link.label}
              </Link>
            ) : (
              <a
                key={link.label}
                href={link.href}
                {...(link.external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                className="text-white/80 hover:text-white transition-colors"
                style={{ fontSize: 12, fontWeight: 400, letterSpacing: '-0.01em' }}
              >
                {link.label}
              </a>
            )
          )}
        </div>

        {/* Mobile hamburger */}
        <button className="md:hidden text-white/80 ml-auto" onClick={() => setMobileOpen(!mobileOpen)}>
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {mobileOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile menu overlay */}
      {mobileOpen && (
        <div
          className="md:hidden"
          style={{
            background: 'rgba(0, 0, 0, 0.95)',
            backdropFilter: 'saturate(180%) blur(20px)',
            padding: '20px 24px',
          }}
        >
          {navLinks.map((link) =>
            link.to ? (
              <Link
                key={link.label}
                to={link.to}
                className="block py-3 text-white/80 hover:text-white transition-colors border-b border-white/5"
                style={{ fontSize: 17, fontWeight: 400, letterSpacing: '-0.374px' }}
                onClick={() => setMobileOpen(false)}
              >
                {link.label}
              </Link>
            ) : (
              <a
                key={link.label}
                href={link.href}
                {...(link.external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                className="block py-3 text-white/80 hover:text-white transition-colors border-b border-white/5"
                style={{ fontSize: 17, fontWeight: 400, letterSpacing: '-0.374px' }}
                onClick={() => setMobileOpen(false)}
              >
                {link.label}
              </a>
            )
          )}
        </div>
      )}
    </nav>
  );
};

export default Navigation;
