import { ArrowRight, TrendingUp, Settings, Rocket, Heart, Sparkles, Users } from 'lucide-react';

// Slide: From Inefficiency to Profit
export const TransformationSlide = () => (
  <div className="w-full h-full flex flex-col items-center justify-center px-8">
    <div className="text-center animate-fade-in max-w-5xl">
      <h2 className="font-oswald font-bold text-4xl md:text-5xl lg:text-6xl uppercase tracking-tight text-white mb-12">
        The Transformation
      </h2>
      <div className="flex flex-col md:flex-row items-center justify-center gap-8">
        <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-8 w-64 animate-fade-in">
          <h3 className="font-oswald font-bold text-2xl uppercase text-red-400 mb-2">Before</h3>
          <p className="text-gray-400">Chaos. Inconsistency. Guesswork. Profit leaking from every undisciplined detail.</p>
        </div>
        <ArrowRight className="w-12 h-12 text-primary rotate-90 md:rotate-0 animate-fade-in" style={{ animationDelay: '200ms' }} />
        <div className="bg-primary/10 border border-primary/30 rounded-lg p-8 w-64 animate-fade-in" style={{ animationDelay: '400ms' }}>
          <h3 className="font-oswald font-bold text-2xl uppercase text-primary mb-2">After</h3>
          <p className="text-gray-400">Discipline. Clarity. Efficiency. Every detail optimized for maximum profit.</p>
        </div>
      </div>
    </div>
  </div>
);

// Slide: The Promise with Core Four
export const PromiseSlide = () => (
  <div className="w-full h-full flex flex-col items-center justify-center px-8 py-8">
    <div className="text-center animate-fade-in max-w-5xl">
      <h2 className="font-oswald font-bold text-3xl md:text-4xl lg:text-5xl uppercase tracking-tight text-white mb-6">
        The Promise
      </h2>
      <p className="text-xl md:text-2xl text-gray-300 max-w-4xl mx-auto leading-relaxed mb-8">
        <span className="text-primary font-semibold">Profit</span> is not luck.<br /><br />
        Your <span className="text-primary font-semibold">business</span> is a result of your<br />
        <span className="text-primary font-semibold">disciplined attention to detail</span>.
      </p>
      
      {/* Core Focus Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-4xl mx-auto mb-8">
        <div className="bg-dark-card border border-primary/30 rounded-lg p-5 animate-fade-in" style={{ animationDelay: '200ms' }}>
          <div className="p-2 bg-primary/20 rounded-full w-fit mx-auto mb-3">
            <Heart className="w-6 h-6 text-primary" />
          </div>
          <h3 className="font-oswald font-bold text-sm uppercase text-primary mb-2">Body</h3>
          <p className="text-gray-300 text-sm">Your body is a direct result of how you fuel it</p>
        </div>
        <div className="bg-dark-card border border-primary/30 rounded-lg p-5 animate-fade-in" style={{ animationDelay: '350ms' }}>
          <div className="p-2 bg-primary/20 rounded-full w-fit mx-auto mb-3">
            <Sparkles className="w-6 h-6 text-primary" />
          </div>
          <h3 className="font-oswald font-bold text-sm uppercase text-primary mb-2">Being</h3>
          <p className="text-gray-300 text-sm">Your being is a direct result of your pursuit of your connection to God</p>
        </div>
        <div className="bg-dark-card border border-primary/30 rounded-lg p-5 animate-fade-in" style={{ animationDelay: '500ms' }}>
          <div className="p-2 bg-primary/20 rounded-full w-fit mx-auto mb-3">
            <Users className="w-6 h-6 text-primary" />
          </div>
          <h3 className="font-oswald font-bold text-sm uppercase text-primary mb-2">Balance</h3>
          <p className="text-gray-300 text-sm">Your balance is a direct result of your attention to your spouse</p>
        </div>
      </div>
      
      <div className="h-1 w-32 bg-primary/50 mx-auto"></div>
    </div>
  </div>
);
