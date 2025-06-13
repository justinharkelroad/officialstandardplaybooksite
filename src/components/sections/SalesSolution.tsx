
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Target, CheckCircle, Calendar } from 'lucide-react';

const SalesSolution = () => {
  return (
    <section className="py-20 relative">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center mb-16">
          <h2 className="font-rajdhani font-bold text-4xl md:text-5xl uppercase tracking-wide text-white mb-8">
            The 8-Week Management Transformation
          </h2>
          <p className="text-xl text-gray-300 leading-relaxed">
            Work directly with Justin over 8 intensive weeks to build comprehensive sales management systems. 
            Create management processes, establish performance accountability, and implement leadership structures that drive consistent results.
          </p>
        </div>

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
  );
};

export default SalesSolution;
