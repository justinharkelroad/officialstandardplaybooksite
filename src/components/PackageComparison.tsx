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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { packages, packageFeatures } from '@/data/packagesData';
import { Check, X, Crown } from 'lucide-react';
import { Link } from 'react-router-dom';

interface PackageComparisonProps {
  trigger?: React.ReactNode;
}

const PackageComparison = ({ trigger }: PackageComparisonProps) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [open, setOpen] = useState(false);

  const membershipPackages = packages.filter(pkg => pkg.type === 'membership');
  const challengePackages = packages.filter(pkg => pkg.type === 'challenge');

  const filteredFeatures = selectedCategory === 'all' 
    ? packageFeatures 
    : packageFeatures.filter(feature => feature.category === selectedCategory);

  const renderFeatureValue = (value: boolean | string | undefined) => {
    if (value === undefined || value === false) {
      return <X className="w-5 h-5 text-gray-400 mx-auto" />;
    }
    if (typeof value === 'string') {
      return <span className="text-primary font-medium">{value}</span>;
    }
    return <Check className="w-5 h-5 text-green-500 mx-auto" />;
  };

  const ComparisonTable = ({ packagesToShow }: { packagesToShow: typeof packages }) => (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse">
        <thead>
          <tr className="border-b border-primary/20">
            <th className="text-left p-4 text-white font-medium sticky left-0 bg-dark-card z-10">
              Features
            </th>
            {packagesToShow.map((pkg) => (
              <th key={pkg.id} className="p-4 text-center min-w-[200px]">
                <div className="space-y-2">
                  <div className="flex items-center justify-center gap-2">
                    {pkg.highlighted && <Crown className="w-4 h-4 text-yellow-500" />}
                    <span className="text-white font-rajdhani text-lg uppercase tracking-wide">
                      {pkg.name}
                    </span>
                  </div>
                  <div className="text-primary font-bold text-xl">{pkg.price}</div>
                  <div className="text-gray-400 text-sm">{pkg.duration}</div>
                  {!pkg.available && (
                    <Badge variant="destructive" className="text-xs">SOLD OUT</Badge>
                  )}
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {filteredFeatures.map((feature) => (
            <tr key={feature.name} className="border-b border-primary/10 hover:bg-primary/5">
              <td className="p-4 sticky left-0 bg-dark-card z-10">
                <div>
                  <div className="text-white font-medium">{feature.name}</div>
                  {feature.description && (
                    <div className="text-gray-400 text-sm mt-1">{feature.description}</div>
                  )}
                </div>
              </td>
              {packagesToShow.map((pkg) => (
                <td key={`${pkg.id}-${feature.name}`} className="p-4 text-center">
                  {renderFeatureValue(pkg.features[feature.name])}
                </td>
              ))}
            </tr>
          ))}
          <tr className="border-t border-primary/20">
            <td className="p-4 sticky left-0 bg-dark-card z-10">
              <span className="text-white font-medium">Action</span>
            </td>
            {packagesToShow.map((pkg) => (
              <td key={`${pkg.id}-action`} className="p-4 text-center">
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
              </td>
            ))}
          </tr>
        </tbody>
      </table>
    </div>
  );

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button className="bg-white text-primary font-bold text-lg px-8 py-4 hover:bg-gray-100">
            COMPARE PACKAGES
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-7xl max-h-[90vh] overflow-hidden bg-dark-card border-primary/20">
        <DialogHeader>
          <DialogTitle className="text-white font-rajdhani text-2xl uppercase text-center">
            Compare Packages
          </DialogTitle>
        </DialogHeader>
        
        <Tabs defaultValue="memberships" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6 bg-primary/10">
            <TabsTrigger value="memberships" className="data-[state=active]:bg-primary">
              Membership Levels
            </TabsTrigger>
            <TabsTrigger value="challenges" className="data-[state=active]:bg-primary">
              Training Programs
            </TabsTrigger>
          </TabsList>
          
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
            {['access', 'coaching', 'training', 'support', 'tools'].map((category) => (
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

          <TabsContent value="memberships" className="overflow-auto max-h-[60vh]">
            <ComparisonTable packagesToShow={membershipPackages} />
          </TabsContent>
          
          <TabsContent value="challenges" className="overflow-auto max-h-[60vh]">
            <ComparisonTable packagesToShow={challengePackages} />
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default PackageComparison;