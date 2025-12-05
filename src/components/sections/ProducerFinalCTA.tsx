import GHLFormPopup from '@/components/GHLFormPopup';

const ProducerFinalCTA = () => {
  return (
    <section className="py-20 relative">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="font-oswald font-bold text-4xl md:text-5xl uppercase tracking-tight text-white mb-6">
            Ready to Build Your Next Top Producer?
          </h2>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Enroll your producer by Friday to secure their spot for Monday's kickoff.
          </p>
          
          <div className="bg-dark-card border-primary/20 rounded-lg p-12">
            <h3 className="font-oswald font-bold text-3xl md:text-4xl uppercase tracking-tight text-red-500 mb-6">
              COMING IN FALL OF 2025
            </h3>
            <GHLFormPopup 
              buttonText="GET NOTIFIED WHEN AVAILABLE"
              buttonClassName="bg-primary text-primary-foreground hover:bg-primary/90 px-8 py-4 text-lg font-bold rounded-lg"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProducerFinalCTA;
