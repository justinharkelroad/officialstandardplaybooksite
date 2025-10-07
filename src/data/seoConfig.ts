
export interface SEOConfig {
  title: string;
  description: string;
  keywords: string[];
  ogImage?: string;
  canonical?: string;
  type?: 'website' | 'article';
  structuredData?: any;
}

export const seoConfig: Record<string, SEOConfig> = {
  '/': {
    title: 'The Standard Playbook - Raise Your Standard | High-Performance Coaching for Elite Entrepreneurs',
    description: 'Transform your business with The Standard Playbook. High-performance coaching, masterminds, and proven systems for elite entrepreneurs ready to break through mediocrity.',
    keywords: ['high-performance coaching', 'elite entrepreneurs', 'business coaching', 'entrepreneurship', 'standard playbook', 'business transformation'],
    ogImage: 'https://lovable.dev/opengraph-image-p98pqg.png',
    type: 'website',
    structuredData: {
      "@context": "https://schema.org",
      "@type": "Organization",
      "name": "The Standard Playbook",
      "description": "High-performance coaching for elite entrepreneurs",
      "url": "https://standardplaybook.com",
      "logo": "https://standardplaybook.com/lovable-uploads/9947cba1-df06-4c18-b17c-819bede8d4c0.png",
      "founder": {
        "@type": "Person",
        "name": "The Standard Playbook Team"
      },
      "sameAs": [
        "@standardplaybook"
      ]
    }
  },
  '/boardroom': {
    title: 'The Boardroom - Elite Agency Owner Mastermind | The Standard Playbook',
    description: 'Join The Boardroom: An exclusive mastermind for agency owners ready to scale. Monthly calls, accountability, and proven systems from $1M+ agencies.',
    keywords: ['agency mastermind', 'business coaching group', 'agency owners', 'scaling agencies', 'business mastermind'],
    ogImage: 'https://lovable.dev/opengraph-image-p98pqg.png',
    type: 'article'
  },
  '/app': {
    title: 'App Access - Business Coaching Tools & Resources | The Standard Playbook',
    description: 'Access exclusive business coaching tools, resources, and training materials. Transform your entrepreneurial journey with The Standard Playbook app.',
    keywords: ['business coaching app', 'entrepreneurship tools', 'business resources', 'coaching platform'],
    ogImage: 'https://lovable.dev/opengraph-image-p98pqg.png',
    type: 'article'
  },
  '/directive': {
    title: 'Directive Program - Strategic Business Guidance | The Standard Playbook',
    description: 'Get clear direction for your business with our Directive program. Strategic guidance and actionable plans for ambitious entrepreneurs.',
    keywords: ['business strategy', 'strategic guidance', 'business direction', 'entrepreneur coaching'],
    ogImage: 'https://lovable.dev/opengraph-image-p98pqg.png',
    type: 'article'
  },
  '/partnership': {
    title: 'Partnership Opportunities - Collaborate with The Standard Playbook',
    description: 'Explore partnership opportunities with The Standard Playbook. Join our network of high-performance coaches and business leaders.',
    keywords: ['business partnership', 'coaching partnership', 'collaboration', 'business network'],
    ogImage: 'https://lovable.dev/opengraph-image-p98pqg.png',
    type: 'article'
  },
  '/sales-experience': {
    title: '8-Week Sales Management Training - Master Revenue Generation | The Standard Playbook',
    description: 'Master sales management with our 8-week intensive training. Proven systems to optimize revenue, build sales teams, and scale your business.',
    keywords: ['sales training', 'revenue optimization', 'sales management', 'sales systems', 'revenue growth'],
    ogImage: 'https://lovable.dev/opengraph-image-p98pqg.png',
    type: 'article'
  },
  '/producer-power-up': {
    title: 'Producer Power Up - Sales Team Development | The Standard Playbook',
    description: 'Power up your sales producers with proven training systems. Develop high-performing sales teams that consistently hit targets.',
    keywords: ['sales team development', 'producer training', 'sales performance', 'team building'],
    ogImage: 'https://lovable.dev/opengraph-image-p98pqg.png',
    type: 'article'
  },
  '/owner-challenge': {
    title: 'Owner Challenge - 30-Day Business Transformation | The Standard Playbook',
    description: 'Take the 30-day Owner Challenge. Transform your business mindset and operations with daily challenges designed for ambitious entrepreneurs.',
    keywords: ['business owner challenge', 'growth program', '30-day challenge', 'business transformation'],
    ogImage: 'https://lovable.dev/opengraph-image-p98pqg.png',
    type: 'article'
  },
  '/about': {
    title: 'About The Standard Playbook - Our Mission & Team',
    description: 'Learn about The Standard Playbook mission to help entrepreneurs raise their standard. Meet our team of high-performance coaches and business experts.',
    keywords: ['about us', 'company mission', 'coaching team', 'business experts'],
    ogImage: 'https://lovable.dev/opengraph-image-p98pqg.png',
    type: 'article'
  },
  '/contact': {
    title: 'Contact The Standard Playbook - Get Started Today',
    description: 'Ready to raise your standard? Contact The Standard Playbook to discuss how our coaching programs can transform your business.',
    keywords: ['contact us', 'business coaching contact', 'get started', 'coaching consultation'],
    ogImage: 'https://lovable.dev/opengraph-image-p98pqg.png',
    type: 'article'
  },
  '/thechallenge': {
    title: 'The Challenge - Private Landing Page',
    description: 'Private challenge page',
    keywords: [],
    type: 'website' as const,
    canonical: 'https://standardplaybook.com/thechallenge',
  },
  '/callscoring': {
    title: 'Standard Call Scoring - AI-Powered Call Evaluation | The Standard Playbook',
    description: 'Transform your sales coaching in minutes. AI-powered call scoring that gives instant insights, consistent feedback, and accelerates team performance.',
    keywords: ['call scoring', 'sales coaching', 'AI call analysis', 'sales training', 'call evaluation', 'team coaching', 'call grading'],
    ogImage: 'https://lovable.dev/opengraph-image-p98pqg.png',
    type: 'article'
  },
  '/privacy': {
    title: 'Privacy Policy - The Standard Playbook',
    description: 'Read our privacy policy to understand how The Standard Playbook protects and uses your personal information.',
    keywords: ['privacy policy', 'data protection', 'user privacy'],
    ogImage: 'https://lovable.dev/opengraph-image-p98pqg.png',
    type: 'article'
  },
  '/terms': {
    title: 'Terms of Service - The Standard Playbook',
    description: 'Review our terms of service for using The Standard Playbook coaching services and platform.',
    keywords: ['terms of service', 'legal terms', 'service agreement'],
    ogImage: 'https://lovable.dev/opengraph-image-p98pqg.png',
    type: 'article'
  }
};
