import { Button } from '@/components/ui/button';
import { useScrollDirection } from '@/hooks/useScrollDirection';
import { useLocation } from 'react-router-dom';

const StickyCTA = () => {
  const scrollDirection = useScrollDirection();
  const location = useLocation();
  
  const getContextualCTA = () => {
    const path = location.pathname;
    
    switch (path) {
      case '/boardroom':
        return {
          text: 'JOIN THE BOARDROOM',
          link: 'https://link.fastpaydirect.com/payment-link/68371b280a5741f8835218c8',
        };
      case '/directive':
      case '/sales-experience':
      case '/producer-challenge':
      case '/':
      default:
        return {
          text: 'BOOK FREE CALL',
          link: 'https://AGENCYCOACHING.as.me/standardfit',
        };
      case '/app-access':
        return {
          text: 'GET APP ACCESS',
          link: 'https://AGENCYCOACHING.as.me/standardfit',
        };
    }
  };

  const { text, link } = getContextualCTA();

  return (
    <div
      className={`fixed bottom-0 left-0 right-0 bg-dark-surface/95 backdrop-blur-lg border-t border-primary/20 p-4 md:hidden z-50 transition-transform duration-300 ${
        scrollDirection === 'down' ? 'translate-y-full' : 'translate-y-0'
      }`}
    >
      <Button
        className="w-full bg-primary hover:bg-primary-light text-white font-bold py-4 rounded-pill"
        onClick={() => window.open(link, '_blank')}
      >
        {text}
      </Button>
    </div>
  );
};

export default StickyCTA;
