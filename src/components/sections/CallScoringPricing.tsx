import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Check, Download } from 'lucide-react';

const CallScoringPricing = () => {
  const pricingTiers = [
    {
      title: "Starter",
      price: "$299",
      period: "/month",
      description: "Perfect for solo agents or small teams",
      features: [
        "Up to 50 scored calls per month",
        "3 custom scoring templates",
        "Basic analytics dashboard",
        "Email support",
        "1 team member access"
      ],
      cta: "PURCHASE",
      link: "https://buy.stripe.com/starter"
    },
    {
      title: "Professional",
      price: "$399",
      period: "/month",
      description: "Most popular for growing agencies",
      badge: "MOST POPULAR",
      highlighted: true,
      features: [
        "Up to 200 scored calls per month",
        "Unlimited custom scoring templates",
        "Advanced analytics & reporting",
        "Priority support + coaching calls",
        "Up to 5 team members",
        "API access for integrations",
        "Custom criteria setup included"
      ],
      cta: "PURCHASE",
      link: "https://buy.stripe.com/professional"
    },
    {
      title: "Enterprise",
      price: "$499",
      period: "/month",
      description: "For established agencies scaling fast",
      features: [
        "Unlimited scored calls",
        "Unlimited custom scoring templates",
        "Enterprise analytics suite",
        "Dedicated success manager",
        "Unlimited team members",
        "Full API access + webhooks",
        "White-label options available",
        "Custom integrations"
      ],
      cta: "PURCHASE",
      link: "https://buy.stripe.com/enterprise"
    }
  ];

  return (
    <section id="pricing" className="py-20 relative bg-dark-card/30">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <Button 
              className="bg-primary text-white font-bold text-lg px-8 py-6 hover:bg-primary/90 mb-16"
              onClick={() => window.open('/Example_Sales_Call_Result.pdf', '_blank')}
            >
              <Download className="w-5 h-5 mr-2" />
              See Example Call Score Result
            </Button>
          </div>

          <div className="text-center mb-16">
            <h2 className="font-rajdhani font-bold text-4xl md:text-5xl uppercase tracking-wide text-white mb-6">
              Choose Your
              <br />
              <span className="text-gradient">Investment Level</span>
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Every plan includes full support, training, and implementation assistance.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {pricingTiers.map((tier, index) => (
              <Card 
                key={index}
                className={`relative bg-dark-card border-primary/20 transition-all duration-300 ${
                  tier.highlighted 
                    ? 'lg:scale-105 border-primary shadow-2xl shadow-primary/20' 
                    : 'hover:border-primary/40 hover:shadow-xl hover:shadow-primary/10'
                }`}
              >
                {tier.badge && (
                  <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-primary text-white px-4 py-1">
                    {tier.badge}
                  </Badge>
                )}
                
                <CardHeader className="text-center pb-4 pt-8">
                  <h3 className="font-rajdhani font-bold text-2xl text-white uppercase mb-2">
                    {tier.title}
                  </h3>
                  <p className="text-gray-400 text-sm mb-4">{tier.description}</p>
                  <div className="flex items-end justify-center">
                    <span className="font-rajdhani font-bold text-5xl text-primary">
                      {tier.price}
                    </span>
                    <span className="text-gray-400 text-lg mb-2">{tier.period}</span>
                  </div>
                </CardHeader>
                
                <CardContent className="pt-4">
                  <ul className="space-y-3 mb-8">
                    {tier.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-start space-x-3">
                        <Check className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                        <span className="text-gray-300 text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  
                  <Button 
                    className={`w-full font-bold text-lg py-6 ${
                      tier.highlighted 
                        ? 'bg-primary text-white hover:bg-primary/90' 
                        : 'bg-primary/80 text-white hover:bg-primary'
                    }`}
                    onClick={() => window.open(tier.link, '_blank')}
                  >
                    {tier.cta}
                  </Button>
                </CardContent>
              </Card>
            ))}
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
