import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

import standardLogo from '@/assets/standard-word-logo.png';

const body = 'Inter, -apple-system, BlinkMacSystemFont, "Helvetica Neue", Arial, sans-serif';
const ink = '#0A0A0B';
const paper = '#F4F2EE';

type NavLink =
  | { label: string; to: string }
  | { label: string; anchor: string }
  | { label: string; external: string };

const links: NavLink[] = [
  { label: 'Programs', anchor: 'programs' },
  { label: 'Software', anchor: 'software' },
  { label: '8-Week', to: '/sales-experience' },
  { label: 'Training', to: '/training' },
  { label: 'Certified', to: '/certified-standard' },
  { label: 'Nutrition', external: 'https://standardnutrition.app' },
  { label: 'Contact', to: '/contact' },
];

const desktopStyle = {
  fontSize: 13,
  fontWeight: 500,
  letterSpacing: '0.06em',
  color: ink,
  textTransform: 'uppercase' as const,
};

const mobileStyle = {
  display: 'block',
  padding: '12px 0',
  fontSize: 16,
  fontWeight: 500,
  letterSpacing: '0.06em',
  color: ink,
  textTransform: 'uppercase' as const,
  borderBottom: `1px solid ${ink}1a`,
};

const BoldNav = () => {
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const isHome = location.pathname === '/';

  const renderLink = (l: NavLink, mobile: boolean, onClick?: () => void) => {
    const style = mobile ? mobileStyle : desktopStyle;
    const cls = mobile ? '' : 'hover:opacity-60 transition-opacity';

    if ('to' in l) {
      return (
        <Link key={l.label} to={l.to} style={style} className={cls} onClick={onClick}>
          {l.label}
        </Link>
      );
    }
    if ('external' in l) {
      return (
        <a
          key={l.label}
          href={l.external}
          target="_blank"
          rel="noopener noreferrer"
          style={style}
          className={cls}
          onClick={onClick}
        >
          {l.label}
        </a>
      );
    }
    // Anchor — in-page on home, cross-page elsewhere.
    const href = isHome ? `#${l.anchor}` : `/#${l.anchor}`;
    return (
      <a key={l.label} href={href} style={style} className={cls} onClick={onClick}>
        {l.label}
      </a>
    );
  };

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50"
      style={{
        background: paper,
        borderBottom: `1px solid ${ink}`,
        height: 56,
        fontFamily: body,
      }}
    >
      <div className="h-full px-6 md:px-10 flex items-center justify-between max-w-[1440px] mx-auto">
        <Link to="/" className="flex items-center" aria-label="Standard Playbook">
          <img
            src={standardLogo}
            alt="Standard Playbook"
            style={{ height: 22, width: 'auto', filter: 'brightness(0)' }}
          />
        </Link>

        <div className="hidden md:flex items-center gap-10">
          {links.map((l) => renderLink(l, false))}
        </div>

        <button
          className="md:hidden"
          onClick={() => setOpen(!open)}
          aria-label="Menu"
          style={{ color: ink }}
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {open ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>

      {open && (
        <div className="md:hidden" style={{ background: paper, borderTop: `1px solid ${ink}`, padding: '16px 24px' }}>
          {links.map((l) => renderLink(l, true, () => setOpen(false)))}
        </div>
      )}
    </nav>
  );
};

export default BoldNav;
