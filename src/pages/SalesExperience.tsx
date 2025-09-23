
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import SalesHero from '@/components/sections/SalesHero';
import SalesBoxedFeatures from '@/components/sections/SalesBoxedFeatures';
import SalesButtonCTA from '@/components/sections/SalesButtonCTA';
import SalesSuccessStory from '@/components/sections/SalesSuccessStory';
import SalesFramework from '@/components/sections/SalesFramework';
import SalesFAQ from '@/components/sections/SalesFAQ';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import BookingModal from '@/components/BookingModal';

const SalesExperience = () => {
  const navigate = useNavigate();
  
  const scrollToChoosePath = () => {
    navigate('/', { state: { scrollToPricing: true } });
  };

  return (
    <div className="min-h-screen">
      <Navigation />
      
      <SalesHero />
      <SalesButtonCTA />
      <SalesBoxedFeatures />
      <SalesSuccessStory />
      <SalesFramework />
      <SalesFAQ />

      {/* Sticky CTA for Mobile */}
      <div className="fixed bottom-0 left-0 right-0 bg-dark-card border-t border-primary/20 p-4 md:hidden z-40">
        <BookingModal
          trigger={
            <Button className="btn-primary w-full">
              Book A Call
            </Button>
          }
        />
      </div>

      <Footer />
    </div>
  );
};

export default SalesExperience;
