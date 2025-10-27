import { Target, Users, Zap, CheckSquare } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

const ChallengeCoreCards = () => {
  const cards = [
    {
      icon: Target,
      title: "What is it?",
      content: (
        <p>
          A <strong>6-Week Producer Power-Up Challenge</strong>: daily 10-minute micro-lessons with app-based Core 4 tracking (Body, Being, Balance, Business), stacking journals, and weekly discovery/planning tools. It turns insurance salespeople into disciplined, habit-driven producers by creating visible proof of progress always reported back in real time to the Agency Owner &/or Manager.
        </p>
      ),
      delay: "0s"
    },
    {
      icon: Users,
      title: "Who is it for?",
      content: (
        <p>
          <strong>Salespeople inside insurance agencies.</strong> Built for producers who need structure, accountability, and consistent habits to sell more policies while improving life balance. Sales training in a direct, authentic and honest approach that allow producers to remain themselves, but ingrained in the required agency process of your choice. Male or female, all is applicable to having it all.
        </p>
      ),
      delay: "0.1s"
    },
    {
      icon: Zap,
      title: "Why does it matter?",
      content: (
        <p>
          Most producers <strong>burn out chasing motivation.</strong> This challenge shifts the frame: every check-box is a micro-proof of identity. That evidence loop compounds into confidence, sales consistency, and higher agency results. Commitment to consistently showing up and doing the small things, lead to expansion inside the bigger targets and goals.
        </p>
      ),
      delay: "0.2s"
    },
    {
      icon: CheckSquare,
      title: "How is it accomplished?",
      content: (
        <ul className="space-y-3">
          <li className="flex items-start">
            <CheckSquare className="w-5 h-5 text-primary mr-3 mt-0.5 flex-shrink-0" />
            <span>30 weekday micro-videos (Mon–Fri) w/ daily commitment to action that will be taken submitted by team member and reported to Agency Owner/Mgr</span>
          </li>
          <li className="flex items-start">
            <CheckSquare className="w-5 h-5 text-primary mr-3 mt-0.5 flex-shrink-0" />
            <span>Daily Core 4 check-ins and optional Stack journaling</span>
          </li>
          <li className="flex items-start">
            <CheckSquare className="w-5 h-5 text-primary mr-3 mt-0.5 flex-shrink-0" />
            <span>Friday Discovery Stack for reflection sent to Agency Owner/Mgr</span>
          </li>
          <li className="flex items-start">
            <CheckSquare className="w-5 h-5 text-primary mr-3 mt-0.5 flex-shrink-0" />
            <span>Optional Sunday "Sunday Service" email + planning form</span>
          </li>
          <li className="flex items-start">
            <CheckSquare className="w-5 h-5 text-primary mr-3 mt-0.5 flex-shrink-0" />
            <span>Scoreboard tracks points (max 35 per week)</span>
          </li>
          <li className="flex items-start">
            <CheckSquare className="w-5 h-5 text-primary mr-3 mt-0.5 flex-shrink-0" />
            <span>Tribe + chat for optional sharing and accountability</span>
          </li>
        </ul>
      ),
      delay: "0.3s"
    }
  ];

  return (
    <section className="py-12 md:py-20 relative">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {cards.map((card, index) => {
            const Icon = card.icon;
            return (
              <Card 
                key={index}
                className="group bg-dark-card border-primary/20 hover:border-primary/40 transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:shadow-primary/20 card-hover animate-fade-up"
                style={{ animationDelay: card.delay }}
              >
                <CardContent className="p-6 md:p-8 flex flex-col h-full">
                  {/* Icon Circle */}
                  <div className="mb-6 flex justify-center">
                    <div className="w-20 h-20 md:w-24 md:h-24 rounded-full bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center shadow-lg shadow-primary/30 group-hover:shadow-primary/50 group-hover:scale-110 transition-all duration-300">
                      <Icon className="w-10 h-10 md:w-12 md:h-12 text-white" />
                    </div>
                  </div>

                  {/* Heading */}
                  <h3 className="font-rajdhani font-bold text-2xl md:text-3xl uppercase tracking-wide text-white mb-4 text-center">
                    {card.title}
                  </h3>

                  {/* Content */}
                  <div className="text-gray-300 text-base md:text-lg leading-relaxed flex-grow">
                    {card.content}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default ChallengeCoreCards;
