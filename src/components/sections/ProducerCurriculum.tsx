import { Card, CardContent } from '@/components/ui/card';

const ProducerCurriculum = () => {
  const weeks = [
    {
      week: 1,
      focus: "Building the Engine",
      topics: ["Core 4 Framework", "Gratitude Stacking", "Micro Wins", "Discovery Stack #1"]
    },
    {
      week: 2,
      focus: "Installing the Process",
      topics: ["Daily Non-Negotiables", "Structured Follow-Up", "Appointments That Hold"]
    },
    {
      week: 3,
      focus: "Lead Management Mastery",
      topics: ["Speed to Contact (60-second rule)", "Three Bucket System", "CRM Clarity"]
    },
    {
      week: 4,
      focus: "Relationship & Retention",
      topics: ["The Art of Asking", "Referral Revolution", "Onboarding", "Connection Without Expectation"]
    },
    {
      week: 5,
      focus: "Closing & Conviction",
      topics: ["COIs", "Reframing Price", "One-Call Close", "Graceful Objection Handling"]
    },
    {
      week: 6,
      focus: "Sustaining Momentum",
      topics: ["Setting Standards", "90-Day Target Setting", "Reflection on Transformation"]
    }
  ];

  return (
    <section className="py-20 relative">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="font-oswald font-bold text-4xl md:text-5xl uppercase tracking-tight text-white text-center mb-16">
            The 6-Week Curriculum
          </h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {weeks.map((item) => (
              <Card key={item.week} className="bg-dark-card border-primary/20 hover:border-primary/40 transition-all duration-300 hover:-translate-y-1">
                <CardContent className="p-6">
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center mr-4">
                      <span className="text-white font-bold text-xl">{item.week}</span>
                    </div>
                    <div>
                      <p className="text-primary text-sm font-medium uppercase tracking-wider">Week {item.week}</p>
                      <h3 className="font-oswald font-bold text-lg text-white uppercase">
                        {item.focus}
                      </h3>
                    </div>
                  </div>
                  <ul className="space-y-2">
                    {item.topics.map((topic, topicIndex) => (
                      <li key={topicIndex} className="flex items-start text-sm">
                        <span className="text-primary mr-2">•</span>
                        <span className="text-gray-300">{topic}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProducerCurriculum;
