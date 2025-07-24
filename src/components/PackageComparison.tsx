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

  const filteredFeatures = selectedCategory === 'all' 
    ? packageFeatures 
    : selectedCategory === 'tools'
    ? packageFeatures.filter(feature => feature.category === 'tools' || feature.category === 'app')
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
    <div className="w-full">
      <div className="overflow-x-auto overflow-y-visible" style={{
        WebkitOverflowScrolling: 'touch',
        scrollbarWidth: 'thin',
        scrollbarColor: 'hsl(var(--primary)) transparent'
      }}>
        <table className="w-full border-collapse min-w-[800px]">
          <thead>
            <tr className="border-b border-primary/20">
              <th className="text-left p-2 md:p-4 text-white font-medium sticky left-0 bg-dark-card z-10 min-w-[150px]">
                Features
              </th>
              {packagesToShow.map((pkg) => (
                <th key={pkg.id} className="p-2 md:p-4 text-center min-w-[200px]">
                  <div className="space-y-2">
                    <div className="flex items-center justify-center gap-2">
                      {pkg.highlighted && <Crown className="w-4 h-4 text-yellow-500" />}
                      <span className="text-white font-rajdhani text-base md:text-lg uppercase tracking-wide">
                        {pkg.name}
                      </span>
                    </div>
                     <div className="text-primary font-bold text-lg md:text-xl">{pkg.price}</div>
                    {!pkg.available && (
                      <Badge variant="destructive" className="text-xs">SOLD OUT</Badge>
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filteredFeatures.map((feature, index) => {
              const isAppFeature = feature.category === 'app';
              const isFirstAppFeature = index === 0 && isAppFeature;
              const isLastAppFeature = feature.category === 'app' && 
                (index === filteredFeatures.length - 1 || filteredFeatures[index + 1]?.category !== 'app');
              
              return (
                <tr key={feature.name} className="border-b border-primary/10 hover:bg-primary/5">
                  <td className={`p-2 md:p-4 sticky left-0 bg-dark-card z-10 relative min-w-[150px] ${
                    isAppFeature ? 'border-l-2 border-primary/30' : ''
                  }`}>
                    {isAppFeature && (
                      <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-transparent pointer-events-none" />
                    )}
                    {isFirstAppFeature && (
                      <div className="absolute -top-4 left-2 text-xs text-primary/60 font-medium tracking-wider uppercase">
                        Standard App
                      </div>
                    )}
                    <div className="relative">
                      <div className="text-white font-medium text-sm md:text-base">{feature.name}</div>
                      {feature.description && (
                        <div className="text-gray-400 text-xs md:text-sm mt-1">{feature.description}</div>
                      )}
                    </div>
                  </td>
                  {packagesToShow.map((pkg) => (
                    <td key={`${pkg.id}-${feature.name}`} className={`p-2 md:p-4 text-center ${
                      isAppFeature ? 'bg-primary/5' : ''
                    }`}>
                      {renderFeatureValue(pkg.features[feature.name])}
                    </td>
                  ))}
                </tr>
              );
            })}
            <tr className="border-t-2 border-primary/20">
              <td className="p-2 md:p-4 sticky left-0 bg-dark-card z-10"></td>
              {packagesToShow.map((pkg) => (
                <td key={`${pkg.id}-action`} className="p-2 md:p-4 text-center">
                  {pkg.available ? (
                    <Link to={pkg.link} onClick={() => setOpen(false)}>
                      <Button className="bg-gradient-to-r from-primary to-primary-accent hover:from-primary-light hover:to-primary w-full text-sm md:text-base">
                        LEARN MORE
                      </Button>
                    </Link>
                  ) : (
                    <Button disabled className="bg-red-500 hover:bg-red-600 w-full cursor-not-allowed text-sm md:text-base">
                      SOLD OUT
                    </Button>
                  )}
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>
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
      <DialogContent className="max-w-[95vw] md:max-w-7xl max-h-[95vh] overflow-hidden bg-dark-card border-primary/20 [&>button]:text-white [&>button]:hover:text-primary p-2 md:p-6">
        <DialogHeader>
          <DialogTitle className="text-white font-rajdhani text-2xl uppercase text-center">
            Compare Packages
          </DialogTitle>
        </DialogHeader>
        
        <div className="w-full px-2 md:px-0">
          {/* Feature Category Filter */}
          <div className="flex flex-wrap gap-2 mb-4 md:mb-6">
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

          <div className="max-h-[65vh] md:max-h-[60vh] overflow-y-auto">
            <ComparisonTable packagesToShow={membershipPackages} />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PackageComparison;