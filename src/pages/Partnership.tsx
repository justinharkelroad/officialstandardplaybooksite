
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import VideoModal from '@/components/VideoModal';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Crown, Phone, HandHeart, TrendingUp, ArrowRight, Play } from 'lucide-react';

const Partnership = () => {
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
          <div className="w-16 h-16 bg-gradient-to-br from-primary to-primary-accent rounded-square flex items-center justify-center mx-auto mb-8 animate-fade-up">
            <Crown className="w-8 h-8 text-white" />
          </div>
          
          <h1 className="font-rajdhani font-bold text-6xl md:text-8xl uppercase tracking-wide text-white mb-6 animate-fade-up">
            The
            <br />
            <span className="text-gradient">Partnership</span>
          </h1>
          
          <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto mb-12 animate-fade-up" style={{ animationDelay: '0.2s' }}>
            The ultimate white-glove service for elite entrepreneurs. Experience true partnership 
            with direct access, business collaboration, and revenue-sharing opportunities.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-up" style={{ animationDelay: '0.4s' }}>
            <Button className="btn-primary text-lg px-8 py-4">
              Apply for Partnership
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
            <VideoModal
              trigger={
                <Button className="btn-ghost text-lg px-8 py-4">
                  <Play className="w-5 h-5 mr-2" />
                  Partnership Overview
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
              Beyond Traditional Coaching
            </h2>
            <p className="text-xl text-gray-300 leading-relaxed mb-8">
              You've reached a level where traditional coaching isn't enough. You need a true business partner 
              who shares in your success, provides direct access when critical decisions arise, and has skin 
              in the game alongside you.
            </p>
            <p className="text-lg text-gray-400">
              At this stage, your challenges are unique and complex. You need someone who truly understands 
              your business inside and out, and is invested in your success beyond just collecting monthly fees.
            </p>
          </div>
        </div>
      </section>

      {/* Solution Section */}
      <section className="py-20 relative">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center mb-16">
            <h2 className="font-rajdhani font-bold text-4xl md:text-5xl uppercase tracking-wide text-white mb-8">
              True Business Partnership
            </h2>
            <p className="text-xl text-gray-300 leading-relaxed">
              The Partnership goes beyond coaching to create a true business alliance. We become invested 
              partners in your success with aligned incentives, direct access, and collaborative growth strategies.
            </p>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <Card className="bg-dark-card border-primary/20 card-hover text-center">
              <CardHeader>
                <div className="w-16 h-16 bg-gradient-to-br from-primary to-primary-accent rounded-square flex items-center justify-center mx-auto mb-4">
                  <Phone className="w-8 h-8 text-white" />
                </div>
                <CardTitle className="text-white font-rajdhani text-xl uppercase tracking-wide">
                  Direct Phone Access
                </CardTitle>
                <CardDescription className="text-gray-400">
                  Immediate access for critical decisions and urgent situations
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="text-gray-300 space-y-2 text-left">
                  <li>• 24/7 phone and text access</li>
                  <li>• Emergency consultation availability</li>
                  <li>• Real-time decision support</li>
                  <li>• Critical situation management</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="bg-dark-card border-primary/20 card-hover text-center">
              <CardHeader>
                <div className="w-16 h-16 bg-gradient-to-br from-primary to-primary-accent rounded-square flex items-center justify-center mx-auto mb-4">
                  <HandHeart className="w-8 h-8 text-white" />
                </div>
                <CardTitle className="text-white font-rajdhani text-xl uppercase tracking-wide">
                  Business Partnership
                </CardTitle>
                <CardDescription className="text-gray-400">
                  True partnership with shared investment in your success
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="text-gray-300 space-y-2 text-left">
                  <li>• Joint venture opportunities</li>
                  <li>• Shared resource allocation</li>
                  <li>• Co-investment in growth initiatives</li>
                  <li>• Strategic alliance development</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="bg-dark-card border-primary/20 card-hover text-center">
              <CardHeader>
                <div className="w-16 h-16 bg-gradient-to-br from-primary to-primary-accent rounded-square flex items-center justify-center mx-auto mb-4">
                  <TrendingUp className="w-8 h-8 text-white" />
                </div>
                <CardTitle className="text-white font-rajdhani text-xl uppercase tracking-wide">
                  Revenue Sharing
                </CardTitle>
                <CardDescription className="text-gray-400">
                  Aligned incentives through performance-based partnerships
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="text-gray-300 space-y-2 text-left">
                  <li>• Performance-based compensation</li>
                  <li>• Growth milestone rewards</li>
                  <li>• Equity participation options</li>
                  <li>• Long-term value creation</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Exclusive Benefits */}
      <section className="py-20 relative">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center mb-16">
            <h2 className="font-rajdhani font-bold text-4xl md:text-5xl uppercase tracking-wide text-white mb-8">
              Partnership Exclusives
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
            <Card className="bg-dark-card border-primary/20 card-hover">
              <CardHeader>
                <CardTitle className="text-white font-rajdhani text-2xl uppercase tracking-wide flex items-center">
                  <Crown className="w-6 h-6 text-primary mr-3" />
                  White-Glove Service
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="text-gray-300 space-y-3">
                  <li>• Dedicated account management</li>
                  <li>• Priority resource allocation</li>
                  <li>• Custom solution development</li>
                  <li>• Exclusive event invitations</li>
                  <li>• VIP networking opportunities</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="bg-dark-card border-primary/20 card-hover">
              <CardHeader>
                <CardTitle className="text-white font-rajdhani text-2xl uppercase tracking-wide flex items-center">
                  <TrendingUp className="w-6 h-6 text-primary mr-3" />
                  Strategic Collaboration
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="text-gray-300 space-y-3">
                  <li>• Joint business development</li>
                  <li>• Shared network access</li>
                  <li>• Collaborative investments</li>
                  <li>• Cross-promotion opportunities</li>
                  <li>• Strategic alliance building</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Application Process */}
      <section className="py-20 relative">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center mb-16">
            <h2 className="font-rajdhani font-bold text-4xl md:text-5xl uppercase tracking-wide text-white mb-8">
              Partnership Application
            </h2>
            <p className="text-xl text-gray-300">
              The Partnership is limited to a select few. Our application process ensures mutual fit and commitment.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 max-w-6xl mx-auto">
            <div className="text-center">
              <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center mx-auto mb-4 text-white font-bold text-lg">1</div>
              <h3 className="text-white font-rajdhani text-lg uppercase tracking-wide mb-2">Application</h3>
              <p className="text-gray-400">Submit detailed business and goal information</p>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center mx-auto mb-4 text-white font-bold text-lg">2</div>
              <h3 className="text-white font-rajdhani text-lg uppercase tracking-wide mb-2">Interview</h3>
              <p className="text-gray-400">Deep-dive discussion about your business and needs</p>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center mx-auto mb-4 text-white font-bold text-lg">3</div>
              <h3 className="text-white font-rajdhani text-lg uppercase tracking-wide mb-2">Proposal</h3>
              <p className="text-gray-400">Custom partnership structure and terms</p>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center mx-auto mb-4 text-white font-bold text-lg">4</div>
              <h3 className="text-white font-rajdhani text-lg uppercase tracking-wide mb-2">Partnership</h3>
              <p className="text-gray-400">Launch collaborative growth strategy</p>
            </div>
          </div>

          <div className="text-center mt-12">
            <Button className="btn-primary text-lg px-8 py-4">
              Start Application Process
            </Button>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 relative">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="font-rajdhani font-bold text-4xl md:text-5xl uppercase tracking-wide text-white mb-6">
              Partnership FAQ
            </h2>
          </div>

          <div className="max-w-4xl mx-auto">
            <Accordion type="single" collapsible className="space-y-4">
              <AccordionItem value="item-1" className="bg-dark-card border border-primary/20 rounded-lg px-6">
                <AccordionTrigger className="text-white font-rajdhani text-lg uppercase tracking-wide">
                  What are the requirements for Partnership consideration?
                </AccordionTrigger>
                <AccordionContent className="text-gray-300">
                  Partnership candidates typically generate $1M+ annually, have a proven track record of success, and are committed to significant growth. We look for entrepreneurs who value true partnership over traditional service relationships.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-2" className="bg-dark-card border border-primary/20 rounded-lg px-6">
                <AccordionTrigger className="text-white font-rajdhani text-lg uppercase tracking-wide">
                  How is Partnership pricing structured?
                </AccordionTrigger>
                <AccordionContent className="text-gray-300">
                  Partnership agreements are custom-designed based on your business, goals, and growth potential. Pricing typically includes a base fee plus performance-based components aligned with your success metrics.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-3" className="bg-dark-card border border-primary/20 rounded-lg px-6">
                <AccordionTrigger className="text-white font-rajdhani text-lg uppercase tracking-wide">
                  How many Partnership spots are available?
                </AccordionTrigger>
                <AccordionContent className="text-gray-300">
                  We limit Partnerships to ensure quality and attention. Currently, we accept no more than 12 Partnership clients at any time to maintain the highest level of service and collaboration.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-4" className="bg-dark-card border border-primary/20 rounded-lg px-6">
                <AccordionTrigger className="text-white font-rajdhani text-lg uppercase tracking-wide">
                  What makes this different from high-end consulting?
                </AccordionTrigger>
                <AccordionContent className="text-gray-300">
                  Unlike consulting, Partnership means we have aligned incentives through revenue sharing and joint investments. We're not just advisors—we're invested partners with skin in the game alongside you.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </div>
      </section>

      {/* Sticky CTA for Mobile */}
      <div className="fixed bottom-0 left-0 right-0 bg-dark-card border-t border-primary/20 p-4 md:hidden z-40">
        <Button className="btn-primary w-full">
          Apply for Partnership
        </Button>
      </div>

      <Footer />
    </div>
  );
};

export default Partnership;
