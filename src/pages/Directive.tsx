
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import VideoModal from '@/components/VideoModal';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Zap, User, Target, BarChart, ArrowRight, Play } from 'lucide-react';

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

          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-up" style={{ animationDelay: '0.4s' }}>
            <Button className="btn-primary text-lg px-8 py-4 bg-primary-accent hover:bg-primary-light">
              Apply for The Directive - $750/mo
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
            <VideoModal
              trigger={
                <Button className="btn-ghost text-lg px-8 py-4 border-primary-accent text-primary-accent hover:bg-primary-accent">
                  <Play className="w-5 h-5 mr-2" />
                  See Results
                </Button>
              }
            />
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
              The Directive provides personalized coaching and implementation support. Work directly with our 
              experts to develop custom strategies, execute systematically, and achieve breakthrough results.
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
                  Bi-Weekly 1:1 Coaching
                </CardTitle>
                <CardDescription className="text-gray-400">
                  Direct access to expert coaches for personalized guidance
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="text-gray-300 space-y-2 text-left">
                  <li>• 90-minute intensive sessions</li>
                  <li>• Custom strategy development</li>
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
                  Implementation Tracking
                </CardTitle>
                <CardDescription className="text-gray-400">
                  Systematic execution with accountability and progress monitoring
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="text-gray-300 space-y-2 text-left">
                  <li>• Weekly check-in protocols</li>
                  <li>• Progress tracking dashboards</li>
                  <li>• Milestone celebrations</li>
                  <li>• Course correction strategies</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="bg-dark-card border-primary-accent/20 card-hover text-center">
              <CardHeader>
                <div className="w-16 h-16 bg-primary-accent rounded-square flex items-center justify-center mx-auto mb-4">
                  <BarChart className="w-8 h-8 text-white" />
                </div>
                <CardTitle className="text-white font-rajdhani text-xl uppercase tracking-wide">
                  Custom Strategy Development
                </CardTitle>
                <CardDescription className="text-gray-400">
                  Tailored plans designed specifically for your business and goals
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="text-gray-300 space-y-2 text-left">
                  <li>• Comprehensive business analysis</li>
                  <li>• Growth opportunity identification</li>
                  <li>• Resource optimization plans</li>
                  <li>• Risk mitigation strategies</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Results Section */}
      <section className="py-20 relative">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center mb-12">
            <h2 className="font-rajdhani font-bold text-4xl md:text-5xl uppercase tracking-wide text-white mb-8">
              Real Results
            </h2>
            <p className="text-xl text-gray-300">
              See how Directive members have transformed their businesses with intensive coaching.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto mb-16">
            <Card className="bg-dark-card border-primary-accent/20 text-center">
              <CardContent className="pt-8">
                <div className="text-4xl font-bold text-primary-accent mb-2">300%</div>
                <p className="text-white font-rajdhani text-lg uppercase tracking-wide">Revenue Growth</p>
                <p className="text-gray-400 mt-2">Average increase in 6 months</p>
              </CardContent>
            </Card>

            <Card className="bg-dark-card border-primary-accent/20 text-center">
              <CardContent className="pt-8">
                <div className="text-4xl font-bold text-primary-accent mb-2">90%</div>
                <p className="text-white font-rajdhani text-lg uppercase tracking-wide">Goal Achievement</p>
                <p className="text-gray-400 mt-2">Members hit their targets</p>
              </CardContent>
            </Card>

            <Card className="bg-dark-card border-primary-accent/20 text-center">
              <CardContent className="pt-8">
                <div className="text-4xl font-bold text-primary-accent mb-2">45</div>
                <p className="text-white font-rajdhani text-lg uppercase tracking-wide">Days Average</p>
                <p className="text-gray-400 mt-2">To see significant results</p>
              </CardContent>
            </Card>
          </div>

          <div className="relative max-w-4xl mx-auto">
            <div className="relative aspect-video bg-dark-card rounded-lg overflow-hidden border border-primary-accent/20">
              <div className="absolute inset-0 bg-gradient-to-br from-primary-accent/20 to-primary/20 flex items-center justify-center">
                <VideoModal
                  trigger={
                    <Button className="btn-primary text-lg px-8 py-4 bg-primary-accent hover:bg-primary-light">
                      <Play className="w-6 h-6 mr-2" />
                      Watch Success Stories
                    </Button>
                  }
                />
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
        <Button className="btn-primary w-full bg-primary-accent hover:bg-primary-light">
          Apply for The Directive - $750/mo
        </Button>
      </div>

      <Footer />
    </div>
  );
};

export default Directive;
