import { useState } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Check, Download } from 'lucide-react';

const CallScoringPricing = () => {
  const [selectedTier, setSelectedTier] = useState<'30' | '50' | '100'>('50');

  const pricingData = {
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

  const universalBenefits = [
    "Fully Customize The Scoring",
    "Add Team Members & Managers",
    "No Contract",
    "No Commitment"
  ];

  return (
    <section id="pricing" className="py-20 relative bg-dark-card/30">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <Button 
              className="bg-primary text-white font-bold text-lg px-8 py-6 hover:bg-primary/90 mb-16"
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

          <div className="text-center mb-12">
            <h2 className="font-oswald font-bold text-4xl md:text-5xl uppercase tracking-tight text-white mb-6">
              Choose Your
              <br />
              <span className="text-gradient">Investment Level</span>
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-12">
              Every plan includes these powerful features:
            </p>

            {/* Universal Benefits */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto mb-16">
              {universalBenefits.map((benefit, index) => (
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
                <h3 className="font-oswald font-bold text-3xl text-white uppercase mb-4">
                  See Pricing
                </h3>
                <p className="text-gray-300 mb-6">Choose which level you'd like</p>
                
                {/* Dropdown Selector */}
                <Select value={selectedTier} onValueChange={(value) => setSelectedTier(value as '30' | '50' | '100')}>
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
                    {pricingData[selectedTier].calls}
                  </div>
                  <div className="flex items-end justify-center mb-4">
                    <span className="font-rajdhani font-bold text-6xl text-primary">
                      {pricingData[selectedTier].price}
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
                  onClick={() => window.open(pricingData[selectedTier].link, '_blank')}
                >
                  PURCHASE NOW
                </Button>
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
              BOOK A STRATEGY CALL
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CallScoringPricing;
