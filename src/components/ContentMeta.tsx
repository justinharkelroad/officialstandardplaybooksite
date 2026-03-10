
import { Link } from 'react-router-dom';

interface ContentMetaProps {
  lastUpdated?: string;
  showAuthor?: boolean;
}

const ContentMeta = ({ lastUpdated = 'March 2026', showAuthor = true }: ContentMetaProps) => {
  return (
    <div className="border-t border-primary/10 pt-6 pb-2 mt-12">
      <div className="container mx-auto px-4">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-sm text-gray-400 max-w-4xl mx-auto">
          {showAuthor && (
            <p>
              By{' '}
              <Link to="/about" className="text-primary hover:text-primary/80 transition-colors">
                {/* TODO: Update with full name when provided */}
                Justin, Founder &amp; Head Coach
              </Link>{' '}
              at The Standard Playbook
            </p>
          )}
          {lastUpdated && (
            <p>Last updated: {lastUpdated}</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ContentMeta;
