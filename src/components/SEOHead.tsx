
import { useSEO } from '@/hooks/useSEO';
import { SEOConfig } from '@/data/seoConfig';

interface SEOHeadProps {
  config?: Partial<SEOConfig>;
}

const SEOHead = ({ config }: SEOHeadProps) => {
  useSEO(config);
  return null;
};

export default SEOHead;
