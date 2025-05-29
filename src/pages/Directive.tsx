import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Zap, User, Target, BarChart, ArrowRight } from 'lucide-react';
import VideoPlayer from '@/components/VideoPlayer';

const Directive = () => {
  return (
    <div className="min-h-screen">
      <Navigation />
      
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary-accent/10 rounded-full blur-3xl animate-float" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '3s' }} />
        </div>

        <div className="container mx-auto px-4 text-center relative z-10">
          <div className="w-16 h-16 bg-primary-accent rounded-square flex items-center justify-center mx-auto mb-8 animate-fade-up">
            <Zap className="w-8 h-8 text-white" />
          </div>
          
          <h1 className="font-rajdhani font-bold text-6xl md:text-8xl uppercase tracking-wide text-white mb-6 animate-fade-up">
            The
            <br />
            <span className="text-gradient">Directive</span>
          </h1>
          
          <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto mb-12 animate-fade-up" style={{ animationDelay: '0.2s' }}>
            Intensive coaching with direct implementation support. Get personalized strategies, 
            accountability, and hands-on guidance to accelerate your growth exponentially.
          </p>

          {/* Hero Image */}
          <div className="max-w-4xl mx-auto mb-12 animate-fade-up" style={{ animationDelay: '0.3s' }}>
            <div className="relative aspect-video bg-dark-card rounded-lg overflow-hidden">
              <img 
                src="/lovable-uploads/c046f138-ec79-47c2-8cee-9e5198756308.png"
                alt="1v1 Coaching Session"
                className="w-full h-full object-cover rounded-lg"
              />
            </div>
          </div>

          <div className="flex justify-center animate-fade-up" style={{ animationDelay: '0.4s' }}>
            <Button 
              className="btn-primary text-lg px-8 py-4 bg-primary-accent hover:bg-primary-light"
              onClick={() => window.open('https://link.fastpaydirect.com/payment-link/670ff5735146ea77a16c5106', '_blank')}
            >
              Join The Directive
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </div>
        </div>
      </section>

      {/* Problem Section */}
      <section className="py-20 relative">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="font-rajdhani font-bold text-4xl md:text-5xl uppercase tracking-wide text-white mb-8">
              The Implementation Gap
            </h2>
            <p className="text-xl text-gray-300 leading-relaxed mb-8">
              You know what to do, but struggle with execution. Between information overload, competing priorities, 
              and the daily grind of running a business, critical strategies fall through the cracks. 
              You need more than advice—you need implementation support.
            </p>
            <p className="text-lg text-gray-400">
              Generic advice doesn't work for your unique situation. You need customized strategies, 
              direct accountability, and someone who understands your specific challenges and opportunities.
            </p>
          </div>
        </div>
      </section>

      {/* Solution Section */}
      <section className="py-20 relative">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center mb-16">
            <h2 className="font-rajdhani font-bold text-4xl md:text-5xl uppercase tracking-wide text-white mb-8">
              Intensive Implementation
            </h2>
            <p className="text-xl text-gray-300 leading-relaxed">
              The Directive provides personalized coaching and implementation support. Work directly with Justin 
              to develop custom strategies, execute systematically, and achieve breakthrough results.
            </p>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <Card className="bg-dark-card border-primary-accent/20 card-hover text-center">
              <CardHeader>
                <div className="w-16 h-16 bg-primary-accent rounded-square flex items-center justify-center mx-auto mb-4">
                  <User className="w-8 h-8 text-white" />
                </div>
                <CardTitle className="text-white font-rajdhani text-xl uppercase tracking-wide">
                  PRIVATE 1:1 COACHING
                </CardTitle>
                <CardDescription className="text-gray-400">
                  Direct access to Justin for personalized guidance
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="text-gray-300 space-y-2 text-left">
                  <li>• One 2 Hour Call Per Month</li>
                  <li>• Custom strategy development and deployment</li>
                  <li>• Real-time problem solving</li>
                  <li>• Performance optimization</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="bg-dark-card border-primary-accent/20 card-hover text-center">
              <CardHeader>
                <div className="w-16 h-16 bg-primary rounded-square flex items-center justify-center mx-auto mb-4">
                  <Target className="w-8 h-8 text-white" />
                </div>
                <CardTitle className="text-white font-rajdhani text-xl uppercase tracking-wide">
                  AUTHENTIC ACCOUNTABILITY
                </CardTitle>
                <CardDescription className="text-gray-400">
                  Systematic execution with accountability and progress monitoring
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="text-gray-300 space-y-2 text-left">
                  <li>• Weekly Check In Protocols</li>
                  <li>• Custom strategy development and deployment</li>
                  <li>• Monthly Mission Check In's</li>
                  <li>• Course Correction Strategies</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="bg-dark-card border-primary-accent/20 card-hover text-center">
              <CardHeader>
                <div className="w-16 h-16 bg-primary-accent rounded-square flex items-center justify-center mx-auto mb-4">
                  <BarChart className="w-8 h-8 text-white" />
                </div>
                <CardTitle className="text-white font-rajdhani text-xl uppercase tracking-wide">
                  TECHNOLOGY & AI STRATEGIES
                </CardTitle>
                <CardDescription className="text-gray-400">
                  Work 1 on 1 w/ Justin to implement and deploy the latest tech and AI solutions
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="text-gray-300 space-y-2 text-left">
                  <li>• 100 Calls Graded Per Month Included</li>
                  <li>• Custom AI Agent Buildouts on calls</li>
                  <li>• Custom Reporting Build outs for your agency</li>
                  <li>• Process Optimization</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* ITS NOT JUST BUSINESS Section */}
      <section className="py-20 relative">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="font-rajdhani font-bold text-4xl md:text-5xl uppercase tracking-wide text-white mb-8">
              ITS NOT JUST BUSINESS...
            </h2>
          </div>

          <div className="max-w-6xl mx-auto space-y-16">
            {/* First Video - BEING */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
              <div className="relative aspect-video bg-dark-card rounded-lg overflow-hidden">
                <VideoPlayer 
                  videoId="jFDqWyLuwHI"
                  title="Being - Your Connection To God"
                  className="w-full h-full rounded-lg"
                />
              </div>
              <div className="text-center lg:text-left">
                <h3 className="font-rajdhani font-bold text-3xl md:text-4xl uppercase tracking-wide text-white mb-4">
                  BEING
                </h3>
                <p className="text-lg text-gray-300 leading-relaxed">
                  Sharpen your mind and spirit so you can lead w/ clarity alongside of God & your purpose. Daily stacks, meditation, and scripture reflections inside the app lock in purpose before the workday starts
                </p>
              </div>
            </div>

            {/* Second Video - BODY */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
              <div className="relative aspect-video bg-dark-card rounded-lg overflow-hidden lg:order-2">
                <VideoPlayer 
                  videoId="qUWOzQF1Xrg"
                  title="Body - Weaponize Your Health"
                  className="w-full h-full rounded-lg"
                />
              </div>
              <div className="text-center lg:text-left lg:order-1">
                <h3 className="font-rajdhani font-bold text-3xl md:text-4xl uppercase tracking-wide text-white mb-4">
                  BODY
                </h3>
                <p className="text-lg text-gray-300 leading-relaxed">
                  Body fuels everything else. Simple workout templates, macro goals, and a habit tracker record every rep and meal, making high energy your new baseline.
                </p>
              </div>
            </div>

            {/* Third Video - BALANCE */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
              <div className="relative aspect-video bg-dark-card rounded-lg overflow-hidden">
                <VideoPlayer 
                  videoId="RMsIHtsv2ak"
                  title="Balance - Your Relationships Matter"
                  className="w-full h-full rounded-lg"
                />
              </div>
              <div className="text-center lg:text-left">
                <h3 className="font-rajdhani font-bold text-3xl md:text-4xl uppercase tracking-wide text-white mb-4">
                  BALANCE
                </h3>
                <p className="text-lg text-gray-300 leading-relaxed">
                  Balance keeps marriage and kids at the center of the mission. We schedule date nights, one-on-one time with each child, and fast family check-ins so your home life shows measurable progress too.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 relative">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="font-rajdhani font-bold text-4xl md:text-5xl uppercase tracking-wide text-white mb-6">
              Directive FAQ
            </h2>
          </div>

          <div className="max-w-4xl mx-auto">
            <Accordion type="single" collapsible className="space-y-4">
              <AccordionItem value="item-1" className="bg-dark-card border border-primary-accent/20 rounded-lg px-6">
                <AccordionTrigger className="text-white font-rajdhani text-lg uppercase tracking-wide">
                  Who is The Directive best suited for?
                </AccordionTrigger>
                <AccordionContent className="text-gray-300">
                  The Directive is perfect for entrepreneurs generating $250K+ annually who need intensive support to break through growth barriers. You should be committed to implementation and ready to invest significant time in your development.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-2" className="bg-dark-card border border-primary-accent/20 rounded-lg px-6">
                <AccordionTrigger className="text-white font-rajdhani text-lg uppercase tracking-wide">
                  How is this different from The Boardroom?
                </AccordionTrigger>
                <AccordionContent className="text-gray-300">
                  While Boardroom focuses on community and group learning, The Directive provides intensive 1:1 coaching, custom strategy development, and hands-on implementation support. You get everything from Boardroom plus personalized attention.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-3" className="bg-dark-card border border-primary-accent/20 rounded-lg px-6">
                <AccordionTrigger className="text-white font-rajdhani text-lg uppercase tracking-wide">
                  What kind of time commitment is required?
                </AccordionTrigger>
                <AccordionContent className="text-gray-300">
                  Expect to invest 3-5 hours per week including coaching sessions, implementation work, and progress reviews. The more you invest, the better your results will be.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-4" className="bg-dark-card border border-primary-accent/20 rounded-lg px-6">
                <AccordionTrigger className="text-white font-rajdhani text-lg uppercase tracking-wide">
                  Is there a minimum commitment period?
                </AccordionTrigger>
                <AccordionContent className="text-gray-300">
                  We recommend a minimum 6-month commitment to see significant results. However, you can cancel with 30 days notice. Most members stay longer because they see the value and results.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </div>
      </section>

      {/* Sticky CTA for Mobile */}
      <div className="fixed bottom-0 left-0 right-0 bg-dark-card border-t border-primary-accent/20 p-4 md:hidden z-40">
        <Button 
          className="btn-primary w-full bg-primary-accent hover:bg-primary-light"
          onClick={() => window.open('https://link.fastpaydirect.com/payment-link/670ff5735146ea77a16c5106', '_blank')}
        >
          Join The Directive
        </Button>
      </div>

      <Footer />
    </div>
  );
};

export default Directive;
