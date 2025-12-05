
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import SalesHero from '@/components/sections/SalesHero';
import SalesProblem from '@/components/sections/SalesProblem';
import SalesThreePillars from '@/components/sections/SalesThreePillars';
import SalesPillarOne from '@/components/sections/SalesPillarOne';
import SalesPillarTwo from '@/components/sections/SalesPillarTwo';
import SalesPillarThree from '@/components/sections/SalesPillarThree';
import SalesBoxedFeatures from '@/components/sections/SalesBoxedFeatures';
import SalesSuccessStory from '@/components/sections/SalesSuccessStory';
import SalesTransformation from '@/components/sections/SalesTransformation';
import SalesFAQ from '@/components/sections/SalesFAQ';
import { Button } from '@/components/ui/button';
import BookingModal from '@/components/BookingModal';

const SalesExperience = () => {
  return (
    <div className="min-h-screen">
      <Navigation />
      
      <SalesHero />
      <SalesProblem />
      <SalesThreePillars />
      <SalesPillarOne />
      <SalesPillarTwo />
      <SalesPillarThree />
      <SalesBoxedFeatures />
      <SalesSuccessStory />
      <SalesTransformation />
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
