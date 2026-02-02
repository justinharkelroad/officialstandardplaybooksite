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

// Slide 9: Combined Three-Part Process
export const ThreePartProcessSlide = () => (
  <div className="w-full h-full flex flex-col items-center justify-center px-8 py-8">
    <h2 className="font-oswald font-bold text-3xl md:text-4xl uppercase tracking-tight text-white mb-8 text-center">
      The Three-Part Disciplined Process
    </h2>
    
    <div className="grid md:grid-cols-3 gap-6 max-w-6xl w-full">
      {/* Part 1: Rapport */}
      <div className="bg-dark-card border border-primary/20 rounded-lg p-5 animate-fade-in">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-primary/20 rounded-lg">
            <MessageSquare className="w-6 h-6 text-primary" />
          </div>
          <div>
            <span className="text-primary text-xs font-medium uppercase tracking-wider">Part 1</span>
            <h3 className="font-oswald font-bold text-lg uppercase text-white">Rapport & Discovery</h3>
          </div>
        </div>
        <ul className="space-y-2 text-gray-300 text-sm mb-4">
          <li className="flex items-start gap-2">
            <CheckCircle className="w-4 h-4 text-primary mt-0.5 shrink-0" />
            <span>Control the frame from first 30 seconds</span>
          </li>
          <li className="flex items-start gap-2">
            <CheckCircle className="w-4 h-4 text-primary mt-0.5 shrink-0" />
            <span>Position as expert, not vendor</span>
          </li>
          <li className="flex items-start gap-2">
            <CheckCircle className="w-4 h-4 text-primary mt-0.5 shrink-0" />
            <span>Uncover all lines of business</span>
          </li>
        </ul>
        <div className="bg-red-500/10 border border-red-500/20 rounded p-3">
          <p className="text-xs text-gray-400">
            <span className="text-red-400 font-semibold">Profit Leak:</span> Missed cross-sells
          </p>
        </div>
      </div>

      {/* Part 2: Liability */}
      <div className="bg-dark-card border border-primary/20 rounded-lg p-5 animate-fade-in" style={{ animationDelay: '150ms' }}>
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-primary/20 rounded-lg">
            <Shield className="w-6 h-6 text-primary" />
          </div>
          <div>
            <span className="text-primary text-xs font-medium uppercase tracking-wider">Part 2</span>
            <h3 className="font-oswald font-bold text-lg uppercase text-white">Liability Conversation</h3>
          </div>
        </div>
        <ul className="space-y-2 text-gray-300 text-sm mb-4">
          <li className="flex items-start gap-2">
            <CheckCircle className="w-4 h-4 text-primary mt-0.5 shrink-0" />
            <span>Shift from cost to protection</span>
          </li>
          <li className="flex items-start gap-2">
            <CheckCircle className="w-4 h-4 text-primary mt-0.5 shrink-0" />
            <span>Expose coverage gaps</span>
          </li>
          <li className="flex items-start gap-2">
            <CheckCircle className="w-4 h-4 text-primary mt-0.5 shrink-0" />
            <span>Create urgency through risk</span>
          </li>
        </ul>
        <div className="bg-red-500/10 border border-red-500/20 rounded p-3">
          <p className="text-xs text-gray-400">
            <span className="text-red-400 font-semibold">Profit Leak:</span> Shortcuts cost premium
          </p>
        </div>
      </div>

      {/* Part 3: Close */}
      <div className="bg-dark-card border border-primary/20 rounded-lg p-5 animate-fade-in" style={{ animationDelay: '300ms' }}>
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-primary/20 rounded-lg">
            <Target className="w-6 h-6 text-primary" />
          </div>
          <div>
            <span className="text-primary text-xs font-medium uppercase tracking-wider">Part 3</span>
            <h3 className="font-oswald font-bold text-lg uppercase text-white">Assumptive Close</h3>
          </div>
        </div>
        <ul className="space-y-2 text-gray-300 text-sm mb-4">
          <li className="flex items-start gap-2">
            <CheckCircle className="w-4 h-4 text-primary mt-0.5 shrink-0" />
            <span>Ask for business—twice if needed</span>
          </li>
          <li className="flex items-start gap-2">
            <CheckCircle className="w-4 h-4 text-primary mt-0.5 shrink-0" />
            <span>Handle objections prepared</span>
          </li>
          <li className="flex items-start gap-2">
            <CheckCircle className="w-4 h-4 text-primary mt-0.5 shrink-0" />
            <span>Assume the sale; guide next steps</span>
          </li>
        </ul>
        <div className="bg-red-500/10 border border-red-500/20 rounded p-3">
          <p className="text-xs text-gray-400">
            <span className="text-red-400 font-semibold">Profit Leak:</span> Follow-ups are inefficient
          </p>
        </div>
      </div>
    </div>
  </div>
);

// Slide 10: Visual Flow
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
