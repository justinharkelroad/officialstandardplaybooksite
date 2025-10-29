import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Check, Download, Shield, Crown } from 'lucide-react';
import { OFFER_CATALOG } from '@/data/decisionEngine';

const DecisionOfferHierarchy = () => {
  const [selectedCallTier, setSelectedCallTier] = useState<'30' | '50' | '100'>('50');

  const memberships = OFFER_CATALOG.offers.filter(o => o.type === 'membership').sort((a, b) => a.display_order - b.display_order);
  const programs = OFFER_CATALOG.offers.filter(o => o.type === 'program').sort((a, b) => a.display_order - b.display_order);
  const saasTiers = OFFER_CATALOG.offers.filter(o => o.type === 'saas').sort((a, b) => a.display_order - b.display_order);

  const callScoringData = {
    '30': { 
      calls: '30 Calls Per Month', 
      price: '$299', 
      link: 'https://buy.stripe.com/6oU5kDelodL0d4k5dG4Vy09' 
    },
    '50': { 
      calls: '50 Calls Per Month', 
      price: '$399', 
      link: 'https://buy.stripe.com/6oU7sLb9c7mC9S8cG84Vy0a' 
    },
    '100': { 
      calls: '100 Calls Per Month', 
      price: '$499', 
      link: 'https://buy.stripe.com/aFacN59147mC7K035y4Vy0b' 
    }
  };

  const universalSCSBenefits = [
    "Fully Customize The Scoring",
    "Add Team Members & Managers",
    "No Contract",
    "No Commitment"
  ];

  // Value breakdowns for memberships
  const getMembershipValueBreakdown = (slug: string) => {
    switch(slug) {
      case 'boardroom':
        return {
          items: [
            { label: '20 calls of call scoring', value: '$200/m' },
            { label: 'Standard Stack Level Access', value: '$70/m' },
            { label: 'Group Zoom call (2h monthly)', value: 'Included' },
            { label: 'Swag Box (Book, T-Shirt, Wristband + More)', value: 'Included' }
          ],
          totalValue: '$270/m'
        };
      case 'directive':
        return {
          items: [
            { label: 'All Boardroom', value: '$299/m' },
            { label: '100 Calls scored', value: '$499/m' },
            { label: 'Full Standard App Access', value: '$125/m' },
            { label: "80% off Producer Challenges for team", value: '$249' },
            { label: '1:1 coaching call (2h monthly)', value: '$1500/m' },
            { label: '24/7 video messaging', value: 'Included' }
          ],
          totalValue: '$1,172/m'
        };
      case 'partnership':
        return {
          items: [
            { label: 'All Boardroom', value: '$299/m' },
            { label: '100 Calls scored', value: '$499/m' },
            { label: '1 Team Call 45min monthly', value: '$749/m' },
            { label: 'Full Standard App Access', value: '$125/m' },
            { label: "80% off Producer Challenges for team", value: '$249' },
            { label: '1:1 coaching call (2h monthly)', value: '$1500/m' },
            { label: '24/7 video messaging', value: 'Included' }
          ],
          totalValue: '$1,921/m'
        };
      default:
        return null;
    }
  };

  const salesExperience = programs.find(p => p.slug === 'sales-experience');
  const producerChallenge = programs.find(p => p.slug === 'producer-challenge');

  return (
    <div className="space-y-24">
      {/* SECTION 1: MEMBERSHIPS */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="font-rajdhani font-bold text-4xl md:text-6xl uppercase tracking-wide text-white mb-6">
              MEMBERSHIPS
            </h2>
            <p className="text-xl text-gray-300">Choose the coaching model that fits your agency</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
            {memberships.map((membership) => {
              const valueBreakdown = getMembershipValueBreakdown(membership.slug);
              const isSoldOut = membership.status === 'sold_out';
              const isDirective = membership.slug === 'directive';

              return (
                <Card 
                  key={membership.slug}
                  className={`bg-dark-card ${isSoldOut ? 'border-red-500/30' : 'border-primary/20'} hover:border-primary/40 transition-all relative`}
                >
                  {isDirective && (
                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                      <Badge className="bg-primary text-white px-4 py-1">MOST POPULAR</Badge>
                    </div>
                  )}
                  {isSoldOut && (
                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                      <Badge className="bg-red-500/20 text-red-400 border-red-500/30 px-4 py-1">SOLD OUT</Badge>
                    </div>
                  )}

                  <CardHeader className="text-center pb-4">
                    <CardTitle className="font-rajdhani text-3xl uppercase text-white mb-6">
                      {membership.name}
                    </CardTitle>
                    <div className="mb-4">
                      <span className="text-6xl font-bold text-primary">${membership.price}</span>
                      <span className="text-gray-400 text-xl">/month</span>
                    </div>
                  </CardHeader>

                  <CardContent className="space-y-6">
                    {/* Value Breakdown */}
                    {valueBreakdown && (
                      <div className="border-t border-primary/20 pt-4">
                        <div className="flex justify-between items-center mb-3">
                          <h4 className="text-white font-semibold text-sm uppercase tracking-wide">What's Included:</h4>
                          <span className="text-gray-400 text-sm uppercase tracking-wide">Value</span>
                        </div>
                        <ul className="space-y-2">
                          {valueBreakdown.items.map((item, idx) => (
                            <li key={idx} className="flex justify-between items-start text-sm">
                              <span className="text-gray-300 flex-1">{item.label}</span>
                              <span className="text-primary font-semibold ml-2">{item.value}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Notes */}
                    {membership.notes && membership.notes.length > 0 && (
                      <div className="text-center">
                        <p className="text-gray-400 text-sm italic">{membership.notes[0]}</p>
                      </div>
                    )}

                    {/* CTA Button */}
                    {isSoldOut ? (
                      <Button 
                        disabled
                        className="w-full bg-red-500/20 text-red-400 border border-red-500/30 pointer-events-none cursor-not-allowed"
                      >
                        SOLD OUT
                      </Button>
                    ) : (
                      <Button 
                        className="w-full btn-primary"
                        onClick={() => window.open(membership.links.details, '_blank')}
                      >
                        SECURE NOW
                      </Button>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* SECTION 2: PROGRAMS */}
      <section className="py-12 bg-dark-card/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="font-rajdhani font-bold text-4xl md:text-6xl uppercase tracking-wide text-white mb-6">
              PROGRAMS
            </h2>
            <p className="text-xl text-gray-300">Intensive training to transform your team</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
            {/* Sales Experience */}
            {salesExperience && (
              <Card className="bg-dark-card border-primary/20 hover:border-primary/40 transition-all">
                <CardHeader className="text-center">
                  <div className="flex justify-center mb-4">
                    <Shield className="w-12 h-12 text-primary" />
                  </div>
                  <CardTitle className="font-rajdhani text-2xl uppercase text-white mb-4">
                    8 WEEK SALES MGMT TRAINING
                  </CardTitle>
                  <div className="space-y-2">
                    {salesExperience.price_options?.map((option, idx) => (
                      <div key={idx} className="text-gray-300">
                        <span className="text-sm">{option.label}: </span>
                        <span className="text-3xl font-bold text-primary">${option.amount.toLocaleString()}</span>
                        {option.label === 'Weekly' && <span className="text-sm">/week</span>}
                      </div>
                    ))}
                  </div>
                </CardHeader>

                <CardContent className="space-y-6">
                  {/* Deliverables */}
                  <div>
                    <h4 className="text-white font-semibold mb-3 text-sm uppercase tracking-wide">Program Includes:</h4>
                    <ul className="space-y-2">
                      <li className="flex items-start text-gray-300 text-sm">
                        <Check className="w-4 h-4 text-primary mr-2 mt-0.5 flex-shrink-0" />
                        <span>How to Build A Sales Experience E-Book</span>
                      </li>
                      <li className="flex items-start text-gray-300 text-sm">
                        <Check className="w-4 h-4 text-primary mr-2 mt-0.5 flex-shrink-0" />
                        <span>8 Monday video trainings</span>
                      </li>
                      <li className="flex items-start text-gray-300 text-sm">
                        <Check className="w-4 h-4 text-primary mr-2 mt-0.5 flex-shrink-0" />
                        <span>8 Wednesday training documents</span>
                      </li>
                      <li className="flex items-start text-gray-300 text-sm">
                        <Check className="w-4 h-4 text-primary mr-2 mt-0.5 flex-shrink-0" />
                        <span>Sales team call scoring (4 calls/rep/week, unlimited reps)</span>
                      </li>
                      <li className="flex items-start text-gray-300 text-sm">
                        <Check className="w-4 h-4 text-primary mr-2 mt-0.5 flex-shrink-0" />
                        <span>Fully deployed Sales Process</span>
                      </li>
                      <li className="flex items-start text-gray-300 text-sm">
                        <Check className="w-4 h-4 text-primary mr-2 mt-0.5 flex-shrink-0" />
                        <span>Accountability Process document</span>
                      </li>
                      <li className="flex items-start text-gray-300 text-sm">
                        <Check className="w-4 h-4 text-primary mr-2 mt-0.5 flex-shrink-0" />
                        <span>Consequence Process document</span>
                      </li>
                      <li className="flex items-start text-gray-300 text-sm">
                        <Check className="w-4 h-4 text-primary mr-2 mt-0.5 flex-shrink-0" />
                        <span>8 1:1 Zoom Calls w/ Agency Owner or Manager</span>
                      </li>
                      <li className="flex items-start text-gray-300 text-sm">
                        <Check className="w-4 h-4 text-primary mr-2 mt-0.5 flex-shrink-0" />
                        <span>Stack Access</span>
                      </li>
                    </ul>
                  </div>

                  {/* Guarantee */}
                  {salesExperience.guarantee && (
                    <div className="border-t border-primary/20 pt-4">
                      <div className="bg-primary/10 border border-primary/30 rounded-lg p-4">
                        <h4 className="text-primary font-bold text-sm uppercase tracking-wide mb-2">
                          {salesExperience.guarantee.label}
                        </h4>
                        <p className="text-gray-300 text-sm whitespace-pre-wrap">
                          {salesExperience.guarantee.copy}
                        </p>
                      </div>
                    </div>
                  )}

                  <Button 
                    className="w-full btn-primary"
                    onClick={() => window.open(salesExperience.links.checkout || '#', '_blank')}
                  >
                    SECURE NOW
                  </Button>
                </CardContent>
              </Card>
            )}

            {/* Producer Challenge */}
            {producerChallenge && (
              <Card className="bg-dark-card border-primary/20 hover:border-primary/40 transition-all">
                <CardHeader className="text-center">
                  <CardTitle className="font-rajdhani text-2xl uppercase text-white mb-4">
                    {producerChallenge.name}
                  </CardTitle>
                  <div className="mb-4">
                    <span className="text-5xl font-bold text-primary">${producerChallenge.price}</span>
                    <span className="text-gray-400 text-lg"> one-time</span>
                  </div>
                </CardHeader>

                <CardContent className="space-y-6">
                  {/* PROBLEM Box */}
                  <div className="border border-red-500/30 rounded-lg p-4 bg-red-500/5">
                    <h4 className="text-red-400 font-bold text-sm uppercase tracking-wide mb-2">
                      PROBLEM
                    </h4>
                    <p className="text-white text-sm leading-relaxed">
                      YOUR TEAM IS YEARNING FOR A TRAINING COURSE THAT CREATES ACTUAL TAKEAWAYS AND ACTION ITEMS INSTEAD OF BORING QUIZZES AT THE END
                    </p>
                  </div>

                  {/* POSSIBILITY Box */}
                  <div className="border border-primary/30 rounded-lg p-4 bg-primary/5">
                    <h4 className="text-primary font-bold text-sm uppercase tracking-wide mb-2">
                      POSSIBILITY
                    </h4>
                    <p className="text-white text-sm leading-relaxed">
                      AFTER 6 WEEKS YOUR TEAM MEMBER IS SHOWING UP FOR THEMSELVES, THEIR FAMILIES AND THE AGENCY IN A WAY THEY NEVER HAVE BEFORE.
                    </p>
                  </div>

                  {/* Program Includes */}
                  <div>
                    <h4 className="text-white font-semibold mb-3 text-sm uppercase tracking-wide">Program Includes:</h4>
                    <ul className="space-y-2">
                      {producerChallenge.inclusions.duration_weeks && (
                        <li className="flex items-start text-gray-300">
                          <Check className="w-5 h-5 text-primary mr-2 flex-shrink-0" />
                          <span>{producerChallenge.inclusions.duration_weeks}-week program</span>
                        </li>
                      )}
                      {producerChallenge.inclusions.app_access && (
                        <li className="flex items-start text-gray-300">
                          <Check className="w-5 h-5 text-primary mr-2 flex-shrink-0" />
                          <span>{producerChallenge.inclusions.app_access} included</span>
                        </li>
                      )}
                      <li className="flex items-start text-gray-300">
                        <Check className="w-5 h-5 text-primary mr-2 flex-shrink-0" />
                        <span>Producer-focused skill development</span>
                      </li>
                    </ul>
                  </div>

                  <Button 
                    className="w-full btn-primary"
                    onClick={() => window.open(producerChallenge.links.checkout || '#', '_blank')}
                  >
                    SECURE NOW
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </section>

      {/* SECTION 3: AI SOFTWARE (STANDARD CALL SCORING) */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="font-rajdhani font-bold text-4xl md:text-6xl uppercase tracking-wide text-white mb-6">
              AI SOFTWARE
            </h2>
            <p className="text-xl text-gray-300 mb-12">Replace long call reviews with fast, AI-powered scoring</p>

            <Button 
              className="bg-primary text-white font-bold text-lg px-8 py-6 hover:bg-primary/90 mb-12"
              onClick={() => {
                const link = document.createElement('a');
                link.href = '/Example_Sales_Call_Result.pdf';
                link.download = 'Example_Sales_Call_Result.pdf';
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
              }}
            >
              <Download className="w-5 h-5 mr-2" />
              See Example Call Score Result
            </Button>
          </div>

          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h3 className="font-rajdhani font-bold text-3xl md:text-4xl uppercase text-white mb-4">
                STANDARD CALL SCORING
              </h3>
              <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-12">
                Every plan includes these powerful features:
              </p>

              {/* Universal Benefits */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto mb-16">
                {universalSCSBenefits.map((benefit, index) => (
                  <div key={index} className="flex items-center space-x-3 bg-dark-card/50 border border-primary/20 rounded-lg p-4">
                    <Check className="w-6 h-6 text-primary flex-shrink-0" />
                    <span className="text-white font-medium text-lg">{benefit}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Pricing Module */}
            <div className="max-w-2xl mx-auto">
              <Card className="bg-dark-card border-primary/20 shadow-2xl shadow-primary/10">
                <CardHeader className="text-center pb-6">
                  <h3 className="font-rajdhani font-bold text-3xl text-white uppercase mb-4">
                    See Pricing
                  </h3>
                  <p className="text-gray-300 mb-6">Choose which level you'd like</p>
                  
                  {/* Dropdown Selector */}
                  <Select value={selectedCallTier} onValueChange={(value) => setSelectedCallTier(value as '30' | '50' | '100')}>
                    <SelectTrigger className="w-full bg-dark-card/50 border-primary/30 text-white text-lg h-14">
                      <SelectValue placeholder="Select call volume" />
                    </SelectTrigger>
                    <SelectContent className="bg-dark-card border-primary/30">
                      <SelectItem value="30" className="text-white text-lg cursor-pointer hover:bg-primary/20">
                        30 Calls Per Month
                      </SelectItem>
                      <SelectItem value="50" className="text-white text-lg cursor-pointer hover:bg-primary/20">
                        50 Calls Per Month
                      </SelectItem>
                      <SelectItem value="100" className="text-white text-lg cursor-pointer hover:bg-primary/20">
                        100 Calls Per Month
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </CardHeader>
                
                <CardContent className="text-center space-y-6">
                  {/* Dynamic Price Display */}
                  <div className="py-8 border-y border-primary/20">
                    <div className="text-gray-400 text-sm uppercase tracking-wide mb-2">
                      {callScoringData[selectedCallTier].calls}
                    </div>
                    <div className="flex items-end justify-center mb-4">
                      <span className="font-rajdhani font-bold text-6xl text-primary">
                        {callScoringData[selectedCallTier].price}
                      </span>
                      <span className="text-gray-400 text-2xl mb-2">/month</span>
                    </div>
                  </div>

                  {/* Promo Code Banner */}
                  <div className="bg-primary/10 border border-primary/30 rounded-lg p-4">
                    <Badge className="bg-primary text-white px-4 py-2 text-sm font-bold">
                      USE CODE FORMULA50 FOR 50% OFF FIRST MONTH
                    </Badge>
                  </div>

                  {/* Purchase Button */}
                  <Button 
                    className="w-full bg-primary text-white hover:bg-primary/90 font-bold text-xl py-8"
                    onClick={() => window.open(callScoringData[selectedCallTier].link, '_blank')}
                  >
                    SECURE NOW
                  </Button>

                  <p className="text-gray-400 text-sm">Month-to-month. No contract.</p>
                </CardContent>
              </Card>
            </div>

            <div className="mt-12 text-center">
              <p className="text-gray-400 mb-4">
                Need a custom solution? Have questions about which plan is right for you?
              </p>
              <Button 
                variant="outline"
                className="border-primary/50 text-white hover:bg-primary/10 bg-transparent"
                onClick={() => window.open('https://AGENCYCOACHING.as.me/standardfit', '_blank')}
              >
                SECURE NOW
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 4: APP ONLY */}
      <section className="py-12 bg-dark-card/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="font-rajdhani font-bold text-4xl md:text-6xl uppercase tracking-wide text-white mb-6">
              APP ACCESS ONLY
            </h2>
            <p className="text-xl text-gray-300">Get the app without coaching membership</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Stack Level Access */}
            <div>
              <p className="text-red-500 text-sm font-bold uppercase text-center mb-4">
                INCLUDED IN BOARDROOM MEMBERSHIP
              </p>
              <Card className="bg-dark-card border-primary/20 hover:border-primary/40 transition-all">
                <CardHeader className="text-center">
                  <CardTitle className="text-white font-rajdhani text-2xl uppercase tracking-wide mb-2">
                    Stack Level Access: The First Two Pillars
                  </CardTitle>
                  <div className="mb-4">
                    <span className="text-5xl font-bold text-white">$70</span>
                    <span className="text-gray-400">/month</span>
                  </div>
                  <CardDescription className="text-gray-300 mb-4">
                    ACCESS: Core frameworks and daily habit architecture
                    <br />
                    ASSOCIATION: Connect with others stacking their way up
                  </CardDescription>
                  <p className="text-primary italic font-medium">"Start here. But don't stay here."</p>
                </CardHeader>
                <CardContent>
                  <div className="mb-6">
                    <h4 className="text-white font-semibold mb-3">What Stack Level Includes:</h4>
                    <ul className="space-y-2 text-gray-300 text-sm">
                      <li>• Core4 daily tracking that exposes your real priorities</li>
                      <li>• Notes that become blueprints, not just thoughts</li>
                      <li>• Assessments that reveal what you've been avoiding</li>
                      <li>• Tribe connection with people who get the grind</li>
                      <li>• Chat with others fighting the same fight</li>
                      <li>• Stack methodology that builds momentum</li>
                      <li>• Armory vault of proven systems and strategies</li>
                    </ul>
                  </div>
                  <p className="text-gray-400 text-sm mb-6 italic">
                    Perfect for those ready to face the mirror but not ready for the whole truth.
                  </p>
                  <Button 
                    className="bg-white text-primary font-bold text-sm sm:text-base px-4 sm:px-6 py-3 hover:bg-gray-100 w-full truncate"
                    onClick={() => window.open('https://AGENCYCOACHING.as.me/standardfit', '_blank')}
                  >
                    SECURE NOW
                    <Shield className="w-4 h-4 sm:w-5 sm:h-5 ml-1 sm:ml-2 flex-shrink-0" />
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Arsenal Level Access */}
            <div>
              <p className="text-red-500 text-sm font-bold uppercase text-center mb-4">
                INCLUDED IN DIRECTIVE MEMBERSHIP
              </p>
              <Card className="bg-dark-card border-primary hover:border-primary/40 transition-all relative">
                <CardHeader className="text-center">
                  <CardTitle className="text-white font-rajdhani text-2xl uppercase tracking-wide mb-2">
                    Arsenal Level Access: Four Pillars Activated
                  </CardTitle>
                  <div className="mb-4">
                    <span className="text-5xl font-bold text-white">$125</span>
                    <span className="text-gray-400">/month</span>
                  </div>
                  <CardDescription className="text-gray-300 mb-4">
                    Everything in Stack PLUS:
                    <br />
                    ACCOUNTABILITY: Advanced tracking and consequence systems
                    <br />
                    ACCELERATION: The Armory vault of advanced frameworks + Monthly Mission Tracking
                  </CardDescription>
                  <p className="text-primary italic font-medium">"This is where transformation gets teeth."</p>
                </CardHeader>
                <CardContent>
                  <div className="mb-6">
                    <h4 className="text-white font-semibold mb-3">Additional Arsenal Features:</h4>
                    <ul className="space-y-2 text-gray-300 text-sm">
                      <li>• Door: Access to frameworks that built empires</li>
                      <li>• Game: Competitive elements that make growth addictive</li>
                    </ul>
                  </div>
                  <p className="text-gray-400 text-sm mb-4 italic">
                    This is for operators ready to become owners.
                  </p>
                  <p className="text-primary text-sm mb-6 font-medium">
                    Note: Full ASCENSION requires human collision. That happens in The Boardroom.
                  </p>
                  <Button 
                    className="bg-white text-primary font-bold text-sm sm:text-base px-4 sm:px-6 py-3 hover:bg-gray-100 w-full truncate"
                    onClick={() => window.open('https://AGENCYCOACHING.as.me/standardfit', '_blank')}
                  >
                    SECURE NOW
                    <Shield className="w-4 h-4 sm:w-5 sm:h-5 ml-1 sm:ml-2 flex-shrink-0" />
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default DecisionOfferHierarchy;
