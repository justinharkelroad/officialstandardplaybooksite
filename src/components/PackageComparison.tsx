import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { packages, packageFeatures } from '@/data/packagesData';
import { Check, X, Crown, ChevronDown, ChevronUp } from 'lucide-react';
import { Link } from 'react-router-dom';

interface PackageComparisonProps {
  trigger?: React.ReactNode;
}

const PackageComparison = ({ trigger }: PackageComparisonProps) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [open, setOpen] = useState(false);
  const [expandedPackages, setExpandedPackages] = useState<Set<string>>(new Set());

  const membershipPackages = packages.filter(pkg => pkg.type === 'membership');

  const filteredFeatures = selectedCategory === 'all' 
    ? packageFeatures 
    : selectedCategory === 'tools'
    ? packageFeatures.filter(feature => feature.category === 'tools' || feature.category === 'app')
    : packageFeatures.filter(feature => feature.category === selectedCategory);

  const togglePackage = (packageId: string) => {
    const newExpanded = new Set(expandedPackages);
    if (newExpanded.has(packageId)) {
      newExpanded.delete(packageId);
    } else {
      newExpanded.add(packageId);
    }
    setExpandedPackages(newExpanded);
  };

  const renderFeatureValue = (value: boolean | string | undefined) => {
    if (value === undefined || value === false) {
      return <X className="w-5 h-5 text-gray-400" />;
    }
    if (typeof value === 'string') {
      return <span className="text-primary font-medium">{value}</span>;
    }
    return <Check className="w-5 h-5 text-green-500" />;
  };

  const PackageCard = ({ pkg }: { pkg: typeof packages[0] }) => {
    const isExpanded = expandedPackages.has(pkg.id);
    
    return (
      <Card className="bg-dark-card border-primary/20 hover:border-primary/40 transition-colors">
        <Collapsible open={isExpanded} onOpenChange={() => togglePackage(pkg.id)}>
          <CollapsibleTrigger asChild>
            <CardHeader className="cursor-pointer hover:bg-primary/5 transition-colors">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {pkg.highlighted && <Crown className="w-5 h-5 text-yellow-500" />}
                  <div>
                    <CardTitle className="text-white font-rajdhani text-lg uppercase tracking-wide">
                      {pkg.name}
                    </CardTitle>
                    <div className="text-primary font-bold text-xl">{pkg.price}</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {!pkg.available && (
                    <Badge variant="destructive" className="text-xs">SOLD OUT</Badge>
                  )}
                  {isExpanded ? (
                    <ChevronUp className="w-5 h-5 text-white" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-white" />
                  )}
                </div>
              </div>
            </CardHeader>
          </CollapsibleTrigger>
          
          <CollapsibleContent>
            <CardContent className="pt-0">
              <div className="space-y-4">
                {/* Package Description */}
                <p className="text-gray-300 text-sm">{pkg.description}</p>
                
                {/* Features List */}
                <div className="space-y-3">
                  <h4 className="text-white font-medium text-sm uppercase tracking-wide border-b border-primary/20 pb-2">
                    Features Included
                  </h4>
                  {filteredFeatures.map((feature) => {
                    const isAppFeature = feature.category === 'app';
                    const featureValue = pkg.features[feature.name];
                    
                    return (
                      <div 
                        key={feature.name} 
                        className={`flex items-start justify-between p-3 rounded-lg ${
                          isAppFeature ? 'bg-primary/5 border-l-2 border-primary/30' : 'bg-gray-900/30'
                        }`}
                      >
                        <div className="flex-1">
                          <div className="text-white font-medium text-sm">{feature.name}</div>
                          {feature.description && (
                            <div className="text-gray-400 text-xs mt-1">{feature.description}</div>
                          )}
                          {isAppFeature && (
                            <div className="text-primary/60 text-xs mt-1 font-medium tracking-wider uppercase">
                              Standard App Feature
                            </div>
                          )}
                        </div>
                        <div className="ml-4 flex-shrink-0">
                          {renderFeatureValue(featureValue)}
                        </div>
                      </div>
                    );
                  })}
                </div>
                
                {/* Action Button */}
                <div className="pt-4 border-t border-primary/20">
                  {pkg.available ? (
                    <Link to={pkg.link} onClick={() => setOpen(false)}>
                      <Button className="bg-gradient-to-r from-primary to-primary-accent hover:from-primary-light hover:to-primary w-full">
                        LEARN MORE
                      </Button>
                    </Link>
                  ) : (
                    <Button disabled className="bg-red-500 hover:bg-red-600 w-full cursor-not-allowed">
                      SOLD OUT
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </CollapsibleContent>
        </Collapsible>
      </Card>
    );
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button className="bg-white text-primary font-bold text-lg px-8 py-4 hover:bg-gray-100">
            COMPARE PACKAGES
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-[95vw] md:max-w-4xl max-h-[95vh] overflow-hidden bg-dark-card border-primary/20 [&>button]:text-white [&>button]:hover:text-primary p-4 md:p-6">
        <DialogHeader>
          <DialogTitle className="text-white font-rajdhani text-2xl uppercase text-center">
            Compare Packages
          </DialogTitle>
          <p className="text-gray-400 text-center text-sm mt-2">
            Expand multiple packages to compare features side by side
          </p>
        </DialogHeader>
        
        <div className="w-full">
          {/* Feature Category Filter */}
          <div className="flex flex-wrap gap-2 mb-6">
            <Button
              size="sm"
              variant={selectedCategory === 'all' ? 'default' : 'outline'}
              onClick={() => setSelectedCategory('all')}
              className="text-xs"
            >
              All Features
            </Button>
            {['coaching', 'swag', 'tools'].map((category) => (
              <Button
                key={category}
                size="sm"
                variant={selectedCategory === category ? 'default' : 'outline'}
                onClick={() => setSelectedCategory(category)}
                className="text-xs capitalize"
              >
                {category}
              </Button>
            ))}
          </div>

          {/* Package Cards */}
          <div 
            className="max-h-[65vh] overflow-y-auto space-y-4"
            style={{ 
              scrollbarWidth: 'thin',
              scrollbarColor: 'hsl(var(--primary)) transparent'
            }}
          >
            {membershipPackages.map((pkg) => (
              <PackageCard key={pkg.id} pkg={pkg} />
            ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PackageComparison;