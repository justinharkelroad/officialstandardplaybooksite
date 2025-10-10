import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import VideoPlayer from '@/components/VideoPlayer';
import SEOHead from '@/components/SEOHead';
import { Circle } from 'lucide-react';

const FormulaAI = () => {
  return (
    <div className="min-h-screen">
      <SEOHead 
        config={{
          title: "FORMULA AI WALKTHROUGHS | Agency Coaching Co",
          description: "Step-by-step AI tutorials and walkthroughs for building custom voice agents and automation tools.",
          keywords: ['AI tutorials', 'voice agents', 'ElevenLabs', 'AI walkthroughs', 'automation'],
          canonical: "/formulaai",
          type: 'article'
        }}
      />
      <Navigation />
      
      {/* Hero Section */}
      <section className="pt-32 pb-20 relative">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h1 className="font-rajdhani font-bold text-5xl md:text-6xl uppercase tracking-wide text-white mb-6">
                FORMULA AI WALKTHROUGHS
              </h1>
            </div>
            
            <div className="relative max-w-4xl mx-auto mb-20">
              <div className="video-glow absolute -inset-4"></div>
              <div className="relative bg-dark-card rounded-lg overflow-hidden border border-primary/20">
                <VideoPlayer 
                  videoId="o1bopwNr75U"
                  title="FORMULA AI Introduction"
                  className="w-full aspect-video"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* AI Call Scoring Section */}
      <section className="py-12 relative">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <a 
              href="https://standardcallscoring.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-block"
            >
              <h2 className="font-rajdhani font-bold text-4xl md:text-5xl uppercase tracking-wide text-white hover:text-primary transition-colors mb-6">
                AI TRAINING
              </h2>
            </a>
            <a 
              href="/Insurance_Agency_Prompts_Formula.pdf" 
              download="Insurance_Agency_Prompts_Formula.pdf"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-primary text-primary-foreground hover:bg-primary/90 rounded-md font-medium transition-all"
            >
              Download Insurance Agency Prompts
            </a>
          </div>
        </div>
      </section>

      {/* Video Tutorials Section */}
      <section className="py-20 relative">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            
            {/* First Video */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start mb-16">
              {/* Left Column - Text */}
              <div className="order-2 lg:order-1">
                <div className="flex items-center gap-3 mb-4">
                  <div className="relative">
                    <Circle className="w-8 h-8 text-primary fill-primary/20" />
                    <span className="absolute inset-0 flex items-center justify-center text-white font-bold text-sm">1</span>
                  </div>
                </div>
                <h2 className="font-rajdhani font-bold text-3xl md:text-4xl uppercase tracking-wide text-white mb-4">
                  Build Your Own Role-Play Voice Agent
                </h2>
                <div className="text-gray-300 leading-relaxed text-sm md:text-base">
                  <p>
                    Step-by-step tutorial on building a custom AI voice bot with ElevenLabs. The video covers account setup, creating a new conversational agent, adding system prompts, configuring LLM settings, adjusting personality sliders, and uploading your own sales process documents to the knowledge base. It explains cost options, default model choices, and how to extend conversation time. The walkthrough ends with testing your agent, copying the link to share with your team for role play practice, and tips for customizing prompts, voices, and knowledge sources.
                  </p>
                </div>
              </div>

              {/* Right Column - Video */}
              <div className="order-1 lg:order-2">
                <div className="relative">
                  <div className="video-glow absolute -inset-4"></div>
                  <div className="relative bg-dark-card rounded-lg overflow-hidden border border-primary/20">
                    <VideoPlayer 
                      videoId="ifcjsowTb_o"
                      title="Build Your Own Role-Play Voice Agent"
                      className="w-full aspect-video"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Second Video */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
              {/* Left Column - Text */}
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="relative">
                    <Circle className="w-8 h-8 text-primary fill-primary/20" />
                    <span className="absolute inset-0 flex items-center justify-center text-white font-bold text-sm">2</span>
                  </div>
                </div>
                <h2 className="font-rajdhani font-bold text-3xl md:text-4xl uppercase tracking-wide text-white mb-4">
                  Crafting Powerful AI Prompts
                </h2>
                <div className="text-gray-300 leading-relaxed text-sm md:text-base">
                  <p>
                    This video breaks down how to craft powerful AI prompts that actually produce useful, high-quality results. Justin explains why simply asking a chatbot for answers isn't enough—you must define its role, goal, audience, inputs, deliverables, format, and quality bar. Using a real insurance marketing example, he shows how specificity turns vague requests into complete, actionable outputs like email sequences, call flows, and KPI dashboards. The key lesson: the more context and detail you give the model, the more value and clarity you'll get back.
                  </p>
                </div>
              </div>

              {/* Right Column - Video */}
              <div>
                <div className="relative">
                  <div className="video-glow absolute -inset-4"></div>
                  <div className="relative bg-dark-card rounded-lg overflow-hidden border border-primary/20">
                    <VideoPlayer 
                      videoId="q1lGz1G0baQ"
                      title="Crafting Powerful AI Prompts"
                      className="w-full aspect-video"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Third Video */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start mt-16">
              {/* Left Column - Text */}
              <div className="order-2 lg:order-1">
                <div className="flex items-center gap-3 mb-4">
                  <div className="relative">
                    <Circle className="w-8 h-8 text-primary fill-primary/20" />
                    <span className="absolute inset-0 flex items-center justify-center text-white font-bold text-sm">3</span>
                  </div>
                </div>
                <h2 className="font-rajdhani font-bold text-3xl md:text-4xl uppercase tracking-wide text-white mb-4">
                  Google Notebook LM for Agency Training
                </h2>
                <div className="text-gray-300 leading-relaxed text-sm md:text-base">
                  <p>
                    Justin gives a practical tour of Google's Notebook LM for agency training. He loads the Requote Process PDF and shows how it becomes an interactive audio overview, a video explainer, flashcards, and ready-made reports and study guides. He demonstrates editing the audio host focus, building quizzes, and using these outputs to onboard new hires and reinforce SOPs. A fast, free way to turn your own documents into repeatable training assets.
                  </p>
                </div>
              </div>

              {/* Right Column - Video */}
              <div className="order-1 lg:order-2">
                <div className="relative">
                  <div className="video-glow absolute -inset-4"></div>
                  <div className="relative bg-dark-card rounded-lg overflow-hidden border border-primary/20">
                    <VideoPlayer 
                      videoId="yfTMa_9TEsU"
                      title="Google Notebook LM for Agency Training"
                      className="w-full aspect-video"
                    />
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default FormulaAI;