
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, CreditCard, DollarSign } from 'lucide-react';

const SalesPayment = () => {
  return (
    <section id="payment" className="py-20 relative">
      <div className="container mx-auto px-4">

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          <Card className="bg-dark-card border-primary/20 card-hover">
            <CardHeader className="text-center">
              <div className="w-16 h-16 bg-primary rounded-square flex items-center justify-center mx-auto mb-4">
                <CreditCard className="w-8 h-8 text-white" />
              </div>
              <CardTitle className="text-white font-rajdhani text-2xl uppercase tracking-wide mb-4">
                Weekly Pay Option
              </CardTitle>
              <div className="mb-4">
                <span className="text-4xl font-bold text-white">$625</span>
                <span className="text-gray-400">/week</span>
              </div>
              <CardDescription className="text-gray-400">
                Pay weekly for 8 weeks
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <ul className="space-y-3 mb-8 text-left">
                <li className="flex items-center text-gray-300">
                  <CheckCircle className="w-5 h-5 text-primary mr-3" />
                  Flexible weekly payments
                </li>
                <li className="flex items-center text-gray-300">
                  <CheckCircle className="w-5 h-5 text-primary mr-3" />
                  Full 8-week training program
                </li>
                <li className="flex items-center text-gray-300">
                  <CheckCircle className="w-5 h-5 text-primary mr-3" />
                  Complete management transformation
                </li>
                <li className="flex items-center text-gray-300">
                  <CheckCircle className="w-5 h-5 text-primary mr-3" />
                  Total Investment: $5,000
                </li>
              </ul>
              <a href="https://link.fastpaydirect.com/payment-link/67b9e53c156a771b286e2ca6" target="_blank" rel="noopener noreferrer">
                <Button className="btn-primary w-full">
                  Start Weekly Payments
                </Button>
              </a>
            </CardContent>
          </Card>

          <Card className="bg-dark-card border-primary relative card-hover animate-pulse-neon">
            <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
              <span className="bg-primary text-white px-4 py-1 rounded-pill text-sm font-semibold uppercase tracking-wide">
                Save $500
              </span>
            </div>
            <CardHeader className="text-center">
              <div className="w-16 h-16 bg-primary-accent rounded-square flex items-center justify-center mx-auto mb-4">
                <DollarSign className="w-8 h-8 text-white" />
              </div>
              <CardTitle className="text-white font-rajdhani text-2xl uppercase tracking-wide mb-4">
                Pay In Full Option
              </CardTitle>
              <div className="mb-4">
                <div className="text-lg text-gray-400 line-through">$5,000</div>
                <span className="text-4xl font-bold text-white">$4,500</span>
                <span className="text-gray-400"> one-time</span>
              </div>
              <CardDescription className="text-gray-400">
                Save $500 with upfront payment
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <ul className="space-y-3 mb-8 text-left">
                <li className="flex items-center text-gray-300">
                  <CheckCircle className="w-5 h-5 text-primary mr-3" />
                  $500 discount savings
                </li>
                <li className="flex items-center text-gray-300">
                  <CheckCircle className="w-5 h-5 text-primary mr-3" />
                  Full 8-week training program
                </li>
                <li className="flex items-center text-gray-300">
                  <CheckCircle className="w-5 h-5 text-primary mr-3" />
                  Complete management transformation
                </li>
                <li className="flex items-center text-gray-300">
                  <CheckCircle className="w-5 h-5 text-primary mr-3" />
                  No recurring payments
                </li>
              </ul>
              <a href="https://link.fastpaydirect.com/payment-link/67b9e4c1020837472ed0b709" target="_blank" rel="noopener noreferrer">
                <Button className="btn-primary w-full bg-primary-accent hover:bg-primary-light">
                  Pay In Full & Save
                </Button>
              </a>
            </CardContent>
          </Card>
        </div>
        
        <div className="text-center mt-12">
          <a href="https://AGENCYCOACHING.as.me/standardfit" target="_blank" rel="noopener noreferrer">
            <Button className="btn-primary text-lg px-8 py-4">
              STOP MANAGING. START MANUFACTURING →
            </Button>
          </a>
        </div>
      </div>
    </section>
  );
};

export default SalesPayment;
