import { Link } from 'react-router-dom';
import standardLogo from '@/assets/standard-word-logo.png';

/** Logo-only header. Funnel pages carry no navigation on purpose. */
export const FunnelHeader = () => (
  <header className="fn-header">
    <Link to="/" aria-label="The Standard Playbook home">
      <img src={standardLogo} alt="The Standard Playbook" />
    </Link>
  </header>
);

export const FunnelFooter = () => (
  <footer className="fn-footer">
    <div className="fn-shell">
      <p style={{ margin: 0 }}>© {new Date().getFullYear()} The Standard Playbook</p>
      <nav aria-label="Legal">
        <Link to="/privacy">Privacy</Link>
        <Link to="/terms">Terms</Link>
        <Link to="/contact">Contact</Link>
      </nav>
    </div>
  </footer>
);
