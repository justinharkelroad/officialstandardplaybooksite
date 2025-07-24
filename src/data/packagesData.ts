export interface PackageFeature {
  name: string;
  category: 'access' | 'coaching' | 'training' | 'support' | 'tools';
  description?: string;
}

export interface Package {
  id: string;
  name: string;
  type: 'membership' | 'challenge';
  price: string;
  duration: string;
  description: string;
  features: { [key: string]: boolean | string };
  highlighted?: boolean;
  available: boolean;
  link: string;
}

export const packageFeatures: PackageFeature[] = [
  // Access Features
  { name: 'Monthly Group Coaching', category: 'access', description: 'Live group coaching sessions' },
  { name: '1-on-1 Coaching', category: 'coaching', description: 'Private coaching sessions with Justin' },
  { name: 'Team Transformation', category: 'coaching', description: 'Direct coaching for your team' },
  { name: 'Sales Management Training', category: 'training', description: '8-week intensive program' },
  { name: 'Producer Training', category: 'training', description: '6-week producer development' },
  { name: 'Owner Development', category: 'training', description: '6-week owner challenge' },
  
  // Support Features
  { name: 'Private Community Access', category: 'support', description: 'Exclusive member community' },
  { name: 'Direct Message Access', category: 'support', description: 'Direct communication with Justin' },
  { name: 'Priority Support', category: 'support', description: 'Fast-track support and responses' },
  
  // Tools Features
  { name: 'Accountability Technology', category: 'tools', description: 'Software to track team performance' },
  { name: 'Custom Playbooks', category: 'tools', description: 'Tailored strategy documents' },
  { name: 'Resource Library', category: 'tools', description: 'Complete training materials' },
];

export const packages: Package[] = [
  {
    id: 'boardroom',
    name: 'The Boardroom',
    type: 'membership',
    price: '$497/month',
    duration: 'Ongoing',
    description: 'Monthly group coaching with peer accountability',
    available: true,
    link: '/boardroom',
    features: {
      'Monthly Group Coaching': true,
      'Private Community Access': true,
      'Accountability Technology': true,
      'Resource Library': true,
      '1-on-1 Coaching': false,
      'Team Transformation': false,
      'Sales Management Training': false,
      'Producer Training': false,
      'Owner Development': false,
      'Direct Message Access': false,
      'Priority Support': false,
      'Custom Playbooks': false,
    }
  },
  {
    id: 'directive',
    name: 'The Directive',
    type: 'membership',
    price: '$2,997',
    duration: '2 Hours',
    description: '1-on-1 intensive coaching session',
    available: true,
    link: '/directive',
    features: {
      'Monthly Group Coaching': false,
      'Private Community Access': false,
      'Accountability Technology': false,
      'Resource Library': true,
      '1-on-1 Coaching': '2 Hours',
      'Team Transformation': false,
      'Sales Management Training': false,
      'Producer Training': false,
      'Owner Development': false,
      'Direct Message Access': true,
      'Priority Support': true,
      'Custom Playbooks': true,
    }
  },
  {
    id: 'partnership',
    name: 'The Partnership',
    type: 'membership',
    price: 'Contact for Pricing',
    duration: 'Custom',
    description: 'Complete agency transformation program',
    available: false,
    link: '/partnership',
    highlighted: true,
    features: {
      'Monthly Group Coaching': true,
      'Private Community Access': true,
      'Accountability Technology': true,
      'Resource Library': true,
      '1-on-1 Coaching': 'Unlimited',
      'Team Transformation': true,
      'Sales Management Training': true,
      'Producer Training': true,
      'Owner Development': true,
      'Direct Message Access': true,
      'Priority Support': true,
      'Custom Playbooks': true,
    }
  },
  {
    id: 'sales-experience',
    name: '8 Week Sales Management Training',
    type: 'challenge',
    price: '$1,997',
    duration: '8 Weeks',
    description: 'Intensive sales management development',
    available: true,
    link: '/sales-experience',
    features: {
      'Monthly Group Coaching': false,
      'Private Community Access': true,
      'Accountability Technology': false,
      'Resource Library': true,
      '1-on-1 Coaching': false,
      'Team Transformation': false,
      'Sales Management Training': true,
      'Producer Training': false,
      'Owner Development': false,
      'Direct Message Access': false,
      'Priority Support': false,
      'Custom Playbooks': true,
    }
  },
  {
    id: 'producer-power-up',
    name: 'Producer Power-Up',
    type: 'challenge',
    price: '$997',
    duration: '6 Weeks',
    description: 'Producer development challenge',
    available: true,
    link: '/producer-power-up',
    features: {
      'Monthly Group Coaching': false,
      'Private Community Access': true,
      'Accountability Technology': false,
      'Resource Library': true,
      '1-on-1 Coaching': false,
      'Team Transformation': false,
      'Sales Management Training': false,
      'Producer Training': true,
      'Owner Development': false,
      'Direct Message Access': false,
      'Priority Support': false,
      'Custom Playbooks': true,
    }
  },
  {
    id: 'owner-challenge',
    name: 'Owner Challenge',
    type: 'challenge',
    price: '$1,497',
    duration: '6 Weeks',
    description: 'Owner development intensive',
    available: true,
    link: '/owner-challenge',
    features: {
      'Monthly Group Coaching': false,
      'Private Community Access': true,
      'Accountability Technology': false,
      'Resource Library': true,
      '1-on-1 Coaching': false,
      'Team Transformation': false,
      'Sales Management Training': false,
      'Producer Training': false,
      'Owner Development': true,
      'Direct Message Access': false,
      'Priority Support': false,
      'Custom Playbooks': true,
    }
  }
];