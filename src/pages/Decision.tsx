import { useState } from 'react';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import DecisionForm from '@/components/DecisionForm';
import DecisionResults from '@/components/DecisionResults';
import SEOHead from '@/components/SEOHead';
import { FormData } from '@/data/decisionEngine';
import { runDecisionEngine, DecisionResult } from '@/utils/decisionEngine';

const Decision = () => {
  const [submitted, setSubmitted] = useState(false);
  const [result, setResult] = useState<DecisionResult | null>(null);

  const handleSubmit = (data: FormData) => {
    const decisionResult = runDecisionEngine(data);
    setResult(decisionResult);
    setSubmitted(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleStartOver = () => {
    setSubmitted(false);
    setResult(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-background">
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
              Tell us where you are. We'll show you the way forward.
            </p>
          </div>
        </div>
      </section>

      {/* Form or Results Section */}
      <section className="py-12 pb-24">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            {!submitted ? (
              <DecisionForm onSubmit={handleSubmit} />
            ) : result ? (
              <DecisionResults result={result} onStartOver={handleStartOver} />
            ) : null}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Decision;
