
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import VideoPlayer from '@/components/VideoPlayer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Target, Calendar, Users, CheckCircle, ArrowRight, Shield } from 'lucide-react';

const SalesExperience = () => {
  return (
    <div className="min-h-screen">
      <Navigation />
      
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary/10 rounded-full blur-3xl animate-float" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-primary-accent/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '3s' }} />
        </div>

        <div className="container mx-auto px-4 text-center relative z-10">
          <div className="w-16 h-16 bg-primary-accent rounded-square flex items-center justify-center mx-auto mb-8 animate-fade-up">
            <Target className="w-8 h-8 text-white" />
          </div>
          
          <h1 className="font-rajdhani font-bold text-6xl md:text-8xl uppercase tracking-wide text-white mb-6 animate-fade-up">
            8 Week Sales
            <br />
            <span className="text-gradient">Experience</span>
          </h1>
          
          <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto mb-12 animate-fade-up" style={{ animationDelay: '0.2s' }}>
            Build a Sales Process, Accountability Frame and Consequence Ladder with precision. Work one-on-one with Justin to transform your agency's sales approach.
          </p>

          {/* Video Frame with Background Glow */}
          <div className="relative max-w-4xl mx-auto mb-12 animate-fade-up" style={{ animationDelay: '0.4s' }}>
            <div className="video-glow absolute -inset-4"></div>
            <div className="relative aspect-video bg-dark-card rounded-lg overflow-hidden">
              <VideoPlayer 
                videoId="kJWh8cVHoFs"
                title="8-Week Sales Experience Overview"
                className="w-full h-full rounded-lg"
              />
            </div>
          </div>

          <div className="animate-fade-up" style={{ animationDelay: '0.6s' }}>
            <Button 
              onClick={() => window.open('https://createthestandard.com/8weekxppayment', '_blank')}
              className="btn-primary text-lg px-8 py-4"
            >
              Get Started Now
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </div>
        </div>
      </section>

      {/* Here's What You Get Section */}
      <section className="py-20 relative">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center mb-16">
            <h2 className="font-rajdhani font-bold text-4xl md:text-5xl uppercase tracking-wide text-white mb-8">
              Here's What You Get
            </h2>
            <p className="text-xl text-gray-300 leading-relaxed">
              Everything you need to build a world-class sales operation in just 8 weeks.
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <Card className="bg-dark-card border-primary/20">
              <CardContent className="p-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex items-start space-x-3">
                    <CheckCircle className="w-6 h-6 text-primary mt-1 flex-shrink-0" />
                    <span className="text-gray-300">HARD COPY BOOK MAILED FOR YOU/YOUR MANAGER</span>
                  </div>
                  <div className="flex items-start space-x-3">
                    <CheckCircle className="w-6 h-6 text-primary mt-1 flex-shrink-0" />
                    <span className="text-gray-300">4 GRADED CALLS PER SALES TEAM MEMBER PER WEEK</span>
                  </div>
                  <div className="flex items-start space-x-3">
                    <CheckCircle className="w-6 h-6 text-primary mt-1 flex-shrink-0" />
                    <span className="text-gray-300">WEEKLY MONDAY SALES QUICK HIT TRAINING VIDEO EMAILED TO TEAM</span>
                  </div>
                  <div className="flex items-start space-x-3">
                    <CheckCircle className="w-6 h-6 text-primary mt-1 flex-shrink-0" />
                    <span className="text-gray-300">WEEKLY WEDNESDAY TRAINING DOCUMENT EMAILED TO TEAM</span>
                  </div>
                  <div className="flex items-start space-x-3">
                    <CheckCircle className="w-6 h-6 text-primary mt-1 flex-shrink-0" />
                    <span className="text-gray-300">30 MINUTE ZOOMS WEEKLY (8X) w/ AGENT or MANAGER</span>
                  </div>
                  <div className="flex items-start space-x-3">
                    <CheckCircle className="w-6 h-6 text-primary mt-1 flex-shrink-0" />
                    <span className="text-gray-300">1 ON 1 VIDEO COACHING ANYTIME VIA MARCO POLO APP FOR YOU OR MANAGER</span>
                  </div>
                  <div className="flex items-start space-x-3">
                    <CheckCircle className="w-6 h-6 text-primary mt-1 flex-shrink-0" />
                    <span className="text-gray-300">FULLY BUILT OUT SALES PROCESS DOCUMENTED BY END OF EXPERIENCE</span>
                  </div>
                  <div className="flex items-start space-x-3">
                    <CheckCircle className="w-6 h-6 text-primary mt-1 flex-shrink-0" />
                    <span className="text-gray-300">FULLY BUILT OUT ACCOUNTABILITY PROCESS DEPLOYED BY END OF EXPERIENCE</span>
                  </div>
                  <div className="flex items-start space-x-3 md:col-span-2 md:justify-center">
                    <CheckCircle className="w-6 h-6 text-primary mt-1 flex-shrink-0" />
                    <span className="text-gray-300">FULLY BUILT OUT CONSEQUENCE LADDER DEPLOYED BY END OF EXPERIENCE</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Problem Section */}
      <section className="py-20 relative">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="font-rajdhani font-bold text-4xl md:text-5xl uppercase tracking-wide text-white mb-8">
              The Sales Process Problem
            </h2>
            <p className="text-xl text-gray-300 leading-relaxed mb-8">
              Most agencies struggle with inconsistent sales processes, lack of accountability, and unclear consequences for underperformance. 
              This leads to missed opportunities, frustrated teams, and unpredictable revenue.
            </p>
            <p className="text-lg text-gray-400">
              Without a systematic approach to sales, even talented teams can't reach their full potential. 
              You need structure, accountability, and proven frameworks to build a high-performing sales organization.
            </p>
          </div>
        </div>
      </section>

      {/* Solution Section */}
      <section className="py-20 relative">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center mb-16">
            <h2 className="font-rajdhani font-bold text-4xl md:text-5xl uppercase tracking-wide text-white mb-8">
              The 8-Week Transformation
            </h2>
            <p className="text-xl text-gray-300 leading-relaxed">
              Work directly with Justin over 8 intensive weeks to build a complete sales system. 
              Create processes, establish accountability measures, and implement consequence ladders that drive consistent results.
            </p>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <Card className="bg-dark-card border-primary/20 card-hover text-center">
              <CardHeader>
                <div className="w-16 h-16 bg-primary rounded-square flex items-center justify-center mx-auto mb-4">
                  <Target className="w-8 h-8 text-white" />
                </div>
                <CardTitle className="text-white font-rajdhani text-xl uppercase tracking-wide">
                  Sales Process Design
                </CardTitle>
                <CardDescription className="text-gray-400">
                  Custom-built sales process for your agency
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="text-gray-300 space-y-2 text-left">
                  <li>• Lead qualification frameworks</li>
                  <li>• Closing techniques and scripts</li>
                  <li>• Follow-up sequences</li>
                  <li>• Pipeline management systems</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="bg-dark-card border-primary/20 card-hover text-center">
              <CardHeader>
                <div className="w-16 h-16 bg-primary-accent rounded-square flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="w-8 h-8 text-white" />
                </div>
                <CardTitle className="text-white font-rajdhani text-xl uppercase tracking-wide">
                  Accountability Framework
                </CardTitle>
                <CardDescription className="text-gray-400">
                  Systems to ensure consistent performance
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="text-gray-300 space-y-2 text-left">
                  <li>• Daily activity tracking</li>
                  <li>• Performance metrics and KPIs</li>
                  <li>• Regular check-in protocols</li>
                  <li>• Team motivation strategies</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="bg-dark-card border-primary/20 card-hover text-center">
              <CardHeader>
                <div className="w-16 h-16 bg-primary rounded-square flex items-center justify-center mx-auto mb-4">
                  <Calendar className="w-8 h-8 text-white" />
                </div>
                <CardTitle className="text-white font-rajdhani text-xl uppercase tracking-wide">
                  Consequence Ladder
                </CardTitle>
                <CardDescription className="text-gray-400">
                  Clear consequences for performance standards
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="text-gray-300 space-y-2 text-left">
                  <li>• Performance improvement plans</li>
                  <li>• Progressive disciplinary actions</li>
                  <li>• Reward systems for top performers</li>
                  <li>• Clear termination protocols</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Money Back Guarantee Section */}
      <section className="py-20 relative">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="relative mb-12">
              {/* Guarantee Badge */}
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

      {/* FAQ Section */}
      <section className="py-20 relative">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="font-rajdhani font-bold text-4xl md:text-5xl uppercase tracking-wide text-white mb-6">
              Sales Experience FAQ
            </h2>
          </div>

          <div className="max-w-4xl mx-auto">
            <Accordion type="single" collapsible className="space-y-4">
              <AccordionItem value="item-1" className="bg-dark-card border border-primary/20 rounded-lg px-6">
                <AccordionTrigger className="text-white font-rajdhani text-lg uppercase tracking-wide">
                  What's included in the 8-week program?
                </AccordionTrigger>
                <AccordionContent className="text-gray-300">
                  You get 8 weeks of direct one-on-one coaching with Justin, custom sales process development, accountability framework creation, consequence ladder implementation, and ongoing support throughout the transformation.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-2" className="bg-dark-card border border-primary/20 rounded-lg px-6">
                <AccordionTrigger className="text-white font-rajdhani text-lg uppercase tracking-wide">
                  Who participates in the sessions?
                </AccordionTrigger>
                <AccordionContent className="text-gray-300">
                  Either you as the agency owner or your sales manager can participate in the one-on-one sessions with Justin. We recommend whoever will be directly implementing and overseeing the sales process on a daily basis.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-3" className="bg-dark-card border border-primary/20 rounded-lg px-6">
                <AccordionTrigger className="text-white font-rajdhani text-lg uppercase tracking-wide">
                  How quickly will we see results?
                </AccordionTrigger>
                <AccordionContent className="text-gray-300">
                  Most agencies start seeing improvements in sales activity and accountability within the first 2-3 weeks. Full transformation and consistent results typically manifest by week 6-8 and continue growing from there.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-4" className="bg-dark-card border border-primary/20 rounded-lg px-6">
                <AccordionTrigger className="text-white font-rajdhani text-lg uppercase tracking-wide">
                  What if our current sales process is already established?
                </AccordionTrigger>
                <AccordionContent className="text-gray-300">
                  We'll audit your existing process and identify gaps or inefficiencies. The program focuses on optimization and enhancement, building on what works while fixing what doesn't to create a more effective system.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </div>
      </section>

      {/* Sticky CTA for Mobile */}
      <div className="fixed bottom-0 left-0 right-0 bg-dark-card border-t border-primary/20 p-4 md:hidden z-40">
        <Button 
          onClick={() => window.open('https://createthestandard.com/8weekxppayment', '_blank')}
          className="btn-primary w-full"
        >
          Start 8-Week Sales Experience
        </Button>
      </div>

      <Footer />
    </div>
  );
};

export default SalesExperience;
