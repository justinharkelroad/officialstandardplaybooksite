import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import SEOHead from '@/components/SEOHead';
import DecisionOfferHierarchy from '@/components/DecisionOfferHierarchy';

const Decision = () => {

  return (
    <div className="min-h-screen">
      <SEOHead />
      <Navigation />

      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center space-y-6">
            <h1 className="font-rajdhani font-bold text-5xl md:text-6xl lg:text-7xl uppercase tracking-wide text-white">
              MAKE THE DECISION
            </h1>
            <p className="text-xl text-gray-300">
              Every offer. Every level. All the value. Choose what fits your agency.
            </p>
          </div>
        </div>
      </section>

      {/* Offer Hierarchy Section */}
      <section className="pb-24">
        <DecisionOfferHierarchy />
      </section>

      <Footer />
    </div>
  );
};

export default Decision;
