import { Target, MessageSquare, Shield, CheckCircle, ArrowRight } from 'lucide-react';

// Slide 7: Pillar 1 Title
export const Pillar1TitleSlide = () => (
  <div className="w-full h-full flex flex-col items-center justify-center px-8">
    <div className="text-center animate-fade-in">
      <div className="inline-block px-4 py-2 bg-primary/20 border border-primary/30 rounded-full mb-8">
        <span className="text-primary font-medium uppercase tracking-widest">Pillar 1</span>
      </div>
      <h2 className="font-oswald font-bold text-5xl md:text-6xl lg:text-7xl uppercase tracking-tight text-white mb-6">
        The Details That<br />
        <span className="text-primary">Capture Every Dollar</span>
      </h2>
      <p className="text-xl md:text-2xl text-gray-400 max-w-3xl mx-auto">
        A proven sales process that leaves no opportunity behind.
      </p>
    </div>
  </div>
);

// Slide 8: Why It Matters
export const WhyItMattersSlide = () => (
  <div className="w-full h-full flex flex-col items-center justify-center px-8">
    <div className="text-center animate-fade-in max-w-5xl">
      <h2 className="font-oswald font-bold text-4xl md:text-5xl uppercase tracking-tight text-white mb-12">
        Why Process Matters
      </h2>
      <div className="flex flex-col md:flex-row items-center justify-center gap-6 text-2xl md:text-3xl">
        <span className="text-gray-300">Sloppy Calls</span>
        <ArrowRight className="w-8 h-8 text-red-400 rotate-90 md:rotate-0" />
        <span className="text-gray-300">Leaked Opportunities</span>
        <ArrowRight className="w-8 h-8 text-red-400 rotate-90 md:rotate-0" />
        <span className="text-red-400 font-semibold">Lost Profit</span>
      </div>
      <div className="mt-12 h-1 w-32 bg-primary/50 mx-auto"></div>
      <p className="text-xl text-gray-400 mt-8">
        Every call without structure is a gamble. Winners don't gamble with their profit.
      </p>
    </div>
  </div>
);

// Slide 9: Rapport and Discovery
export const RapportSlide = () => (
  <div className="w-full h-full flex flex-col items-center justify-center px-8 py-12">
    <div className="max-w-5xl w-full">
      <div className="flex items-center gap-4 mb-8">
        <div className="p-3 bg-primary/20 rounded-lg">
          <MessageSquare className="w-8 h-8 text-primary" />
        </div>
        <div>
          <span className="text-primary text-sm font-medium uppercase tracking-wider">Part 1</span>
          <h2 className="font-oswald font-bold text-4xl md:text-5xl uppercase tracking-tight text-white">
            Rapport & Discovery
          </h2>
        </div>
      </div>
      
      <div className="grid md:grid-cols-2 gap-8">
        <div className="bg-dark-card border border-primary/20 rounded-lg p-6 animate-fade-in">
          <h3 className="font-oswald font-bold text-xl uppercase text-white mb-4">Control The Frame</h3>
          <ul className="space-y-3 text-gray-300">
            <li className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-primary mt-1 shrink-0" />
              <span>Set expectations from the first 30 seconds</span>
            </li>
            <li className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-primary mt-1 shrink-0" />
              <span>Position yourself as the expert, not the vendor</span>
            </li>
            <li className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-primary mt-1 shrink-0" />
              <span>Guide the conversation toward all lines of business</span>
            </li>
          </ul>
        </div>
        
        <div className="bg-dark-card border border-red-500/20 rounded-lg p-6 animate-fade-in" style={{ animationDelay: '200ms' }}>
          <h3 className="font-oswald font-bold text-xl uppercase text-red-400 mb-4">The Hidden Profit Leak</h3>
          <p className="text-gray-300 leading-relaxed">
            Missed cross-sells are <span className="text-red-400 font-semibold">hidden profit leaks</span>. Every line of business you don't uncover is premium you're leaving for your competitor.
          </p>
        </div>
      </div>
    </div>
  </div>
);

// Slide 10: Liability Conversation
export const LiabilitySlide = () => (
  <div className="w-full h-full flex flex-col items-center justify-center px-8 py-12">
    <div className="max-w-5xl w-full">
      <div className="flex items-center gap-4 mb-8">
        <div className="p-3 bg-primary/20 rounded-lg">
          <Shield className="w-8 h-8 text-primary" />
        </div>
        <div>
          <span className="text-primary text-sm font-medium uppercase tracking-wider">Part 2</span>
          <h2 className="font-oswald font-bold text-4xl md:text-5xl uppercase tracking-tight text-white">
            The Liability Conversation
          </h2>
        </div>
      </div>
      
      <div className="grid md:grid-cols-2 gap-8">
        <div className="bg-dark-card border border-primary/20 rounded-lg p-6 animate-fade-in">
          <h3 className="font-oswald font-bold text-xl uppercase text-white mb-4">Build Value Before Price</h3>
          <ul className="space-y-3 text-gray-300">
            <li className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-primary mt-1 shrink-0" />
              <span>Shift the conversation from cost to protection</span>
            </li>
            <li className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-primary mt-1 shrink-0" />
              <span>Expose gaps in their current coverage</span>
            </li>
            <li className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-primary mt-1 shrink-0" />
              <span>Create urgency through risk awareness</span>
            </li>
          </ul>
        </div>
        
        <div className="bg-dark-card border border-red-500/20 rounded-lg p-6 animate-fade-in" style={{ animationDelay: '200ms' }}>
          <h3 className="font-oswald font-bold text-xl uppercase text-red-400 mb-4">The Hidden Profit Leak</h3>
          <p className="text-gray-300 leading-relaxed">
            Shortcuts in the liability conversation <span className="text-red-400 font-semibold">cost you premium</span>. When you skip value-building, you compete on price—and lose margin.
          </p>
        </div>
      </div>
    </div>
  </div>
);

// Slide 11: Assumptive Close
export const AssumptiveCloseSlide = () => (
  <div className="w-full h-full flex flex-col items-center justify-center px-8 py-12">
    <div className="max-w-5xl w-full">
      <div className="flex items-center gap-4 mb-8">
        <div className="p-3 bg-primary/20 rounded-lg">
          <Target className="w-8 h-8 text-primary" />
        </div>
        <div>
          <span className="text-primary text-sm font-medium uppercase tracking-wider">Part 3</span>
          <h2 className="font-oswald font-bold text-4xl md:text-5xl uppercase tracking-tight text-white">
            The Assumptive Close
          </h2>
        </div>
      </div>
      
      <div className="grid md:grid-cols-2 gap-8">
        <div className="bg-dark-card border border-primary/20 rounded-lg p-6 animate-fade-in">
          <h3 className="font-oswald font-bold text-xl uppercase text-white mb-4">Close On The First Call</h3>
          <ul className="space-y-3 text-gray-300">
            <li className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-primary mt-1 shrink-0" />
              <span>Ask for the business—twice if needed</span>
            </li>
            <li className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-primary mt-1 shrink-0" />
              <span>Handle objections with prepared responses</span>
            </li>
            <li className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-primary mt-1 shrink-0" />
              <span>Assume the sale; guide them to next steps</span>
            </li>
          </ul>
        </div>
        
        <div className="bg-dark-card border border-red-500/20 rounded-lg p-6 animate-fade-in" style={{ animationDelay: '200ms' }}>
          <h3 className="font-oswald font-bold text-xl uppercase text-red-400 mb-4">The Hidden Profit Leak</h3>
          <p className="text-gray-300 leading-relaxed">
            Follow-ups are <span className="text-red-400 font-semibold">inefficient</span>. Every callback is wasted time, wasted energy, and a deal that might never close. Close now.
          </p>
        </div>
      </div>
    </div>
  </div>
);

// Slide 12: Visual Flow
export const ProcessFlowSlide = () => (
  <div className="w-full h-full flex flex-col items-center justify-center px-8 py-12">
    <h2 className="font-oswald font-bold text-4xl md:text-5xl uppercase tracking-tight text-white mb-4 text-center">
      The Disciplined Process
    </h2>
    <p className="text-lg text-gray-400 mb-12 text-center">Capturing maximum value from every conversation</p>
    
    <div className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-8 max-w-5xl">
      <div className="bg-dark-card border border-primary/30 rounded-lg p-6 text-center animate-fade-in w-64">
        <div className="text-4xl font-oswald font-bold text-primary mb-2">01</div>
        <h3 className="font-oswald font-bold text-lg uppercase text-white mb-2">Rapport & Discovery</h3>
        <p className="text-gray-400 text-sm">Control the frame, uncover all opportunities</p>
      </div>
      
      <ArrowRight className="w-8 h-8 text-primary rotate-90 md:rotate-0 animate-fade-in" style={{ animationDelay: '150ms' }} />
      
      <div className="bg-dark-card border border-primary/30 rounded-lg p-6 text-center animate-fade-in w-64" style={{ animationDelay: '200ms' }}>
        <div className="text-4xl font-oswald font-bold text-primary mb-2">02</div>
        <h3 className="font-oswald font-bold text-lg uppercase text-white mb-2">Liability Conversation</h3>
        <p className="text-gray-400 text-sm">Build value, shift from price to protection</p>
      </div>
      
      <ArrowRight className="w-8 h-8 text-primary rotate-90 md:rotate-0 animate-fade-in" style={{ animationDelay: '350ms' }} />
      
      <div className="bg-dark-card border border-primary/30 rounded-lg p-6 text-center animate-fade-in w-64" style={{ animationDelay: '400ms' }}>
        <div className="text-4xl font-oswald font-bold text-primary mb-2">03</div>
        <h3 className="font-oswald font-bold text-lg uppercase text-white mb-2">Assumptive Close</h3>
        <p className="text-gray-400 text-sm">Close on the first call, no exceptions</p>
      </div>
    </div>
    
    <div className="mt-12 bg-primary/10 border border-primary/30 rounded-lg p-6 max-w-2xl text-center animate-fade-in" style={{ animationDelay: '600ms' }}>
      <p className="text-gray-300">
        <span className="text-primary font-semibold">The Result:</span> Every call follows a structure that captures maximum premium and closes efficiently.
      </p>
    </div>
  </div>
);
