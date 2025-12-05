import { Card, CardContent } from '@/components/ui/card';
import { CalendarCheck, Rocket, Bell } from 'lucide-react';

const ProducerLogistics = () => {
  const steps = [
    {
      icon: CalendarCheck,
      title: "ROLLING ENROLLMENT",
      description: "This course does not have a fixed start date. The challenge is always active. Sign up any producer by Friday and they will automatically begin the following Monday."
    },
    {
      icon: Rocket,
      title: "AUTOMATED KICKOFF",
      description: "The Sunday before they start, your producer receives an automated welcome email and text message with their app login, password setup, and the optional 'Sunday Service' form to plan their week."
    },
    {
      icon: Bell,
      title: "DAILY REMINDERS",
      description: "To ensure engagement, producers receive a daily text reminder at 9:00 a.m. local time to complete their module."
    }
  ];

  return (
    <section className="py-20 relative">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="font-oswald font-bold text-4xl md:text-5xl uppercase tracking-tight text-white text-center mb-4">
            Simple & Seamless Logistics
          </h2>
          <p className="text-xl text-gray-300 text-center mb-16 max-w-3xl mx-auto">
            Getting your producer started is a simple, three-step process.
          </p>
          
          <div className="grid md:grid-cols-3 gap-8">
            {steps.map((item, index) => (
              <Card key={index} className="bg-dark-card border-primary/20 hover:border-primary/40 transition-all duration-300 hover:-translate-y-1">
                <CardContent className="p-8 text-center">
                  <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-6">
                    <item.icon className="w-8 h-8 text-primary" />
                  </div>
                  <h3 className="font-oswald font-bold text-xl text-white uppercase mb-4">
                    {item.title}
                  </h3>
                  <p className="text-gray-300 leading-relaxed text-sm">
                    {item.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProducerLogistics;
