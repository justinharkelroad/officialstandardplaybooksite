
const SalesGuarantee = () => {
  return (
    <section className="py-20 relative">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="relative mb-12">
            <div className="inline-flex items-center justify-center w-32 h-32 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full border-8 border-yellow-300 shadow-2xl mb-8">
              <div className="text-center">
                <div className="text-2xl font-bold text-black">100%</div>
                <div className="text-xs font-semibold text-black uppercase">Money Back</div>
                <div className="text-xs font-semibold text-black uppercase">Guarantee</div>
              </div>
            </div>
          </div>
          
          <h2 className="font-rajdhani font-bold text-4xl md:text-5xl uppercase tracking-wide text-white mb-8">
            If You Don't See The Value After [8] Weeks, I'll Give You Your Money Back... Straight Up
          </h2>
          <p className="text-xl text-gray-300 leading-relaxed">
            All I ask is you <span className="text-primary font-semibold underline">COMMIT TO THE WORK</span>
          </p>
        </div>
      </div>
    </section>
  );
};

export default SalesGuarantee;
