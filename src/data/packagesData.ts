export interface PackageFeature {
  name: string;
  category: 'app' | 'coaching' | 'swag' | 'tools';
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
  // App Features
  { name: 'Daily Habit (Core4)', category: 'app' },
  { name: 'Notes', category: 'app' },
  { name: 'Assessment', category: 'app' },
  { name: 'Team Chat', category: 'app' },
  { name: 'Stack', category: 'app' },
  { name: 'Video Training Armory', category: 'app' },
  { name: 'Weekly Goal Tracking', category: 'app' },
  { name: 'Annual and Monthly Goal Tracking', category: 'app' },
  
  // Coaching Features
  { name: 'Monthly 2 Hour Group Boardroom Call', category: 'coaching' },
  { name: '24/7 Video Messaging 1v1 Coaching', category: 'coaching' },
  { name: 'Monthly 2 Hour 1 on 1 Coaching Call', category: 'coaching' },
  { name: 'Monthly 45 Min Team Coaching Call', category: 'coaching' },
  
  // Tools Features
  { name: 'AI Call Scoring (# Per Month)', category: 'tools' },
  { name: 'Daily Accountability Tools', category: 'tools' },
  
  // Swag Features
  { name: 'Standard Playbook Hardcover', category: 'swag' },
  { name: 'I AM THE STANDARD T Shirt', category: 'swag' },
  { name: 'I AM THE STANDARD Pen', category: 'swag' },
  { name: 'I AM THE STANDARD Wristband', category: 'swag' },
];

export const packages: Package[] = [
  {
    id: 'boardroom',
    name: 'The Boardroom',
    type: 'membership',
    price: '$299',
    duration: 'Ongoing',
    description: 'Monthly group coaching with peer accountability',
    available: true,
    link: '/boardroom',
    features: {
      'Daily Habit (Core4)': true,
      'Notes': true,
      'Assessment': true,
      'Team Chat': true,
      'Stack': true,
      'Video Training Armory': true,
      'Weekly Goal Tracking': false,
      'Annual and Monthly Goal Tracking': false,
      'AI Call Scoring (# Per Month)': '20',
      'Daily Accountability Tools': false,
      'Standard Playbook Hardcover': true,
      'I AM THE STANDARD T Shirt': true,
      'I AM THE STANDARD Pen': true,
      'I AM THE STANDARD Wristband': true,
      'Monthly 2 Hour Group Boardroom Call': true,
      '24/7 Video Messaging 1v1 Coaching': true,
      'Monthly 2 Hour 1 on 1 Coaching Call': false,
      'Monthly 45 Min Team Coaching Call': false,
    }
  },
  {
    id: 'directive',
    name: 'The Directive',
    type: 'membership',
    price: '$1500',
    duration: '2 Hours',
    description: '1-on-1 intensive coaching session',
    available: true,
    link: '/directive',
    features: {
      'Daily Habit (Core4)': true,
      'Notes': true,
      'Assessment': true,
      'Team Chat': true,
      'Stack': true,
      'Video Training Armory': true,
      'Weekly Goal Tracking': true,
      'Annual and Monthly Goal Tracking': true,
      'AI Call Scoring (# Per Month)': '100',
      'Daily Accountability Tools': true,
      'Standard Playbook Hardcover': true,
      'I AM THE STANDARD T Shirt': true,
      'I AM THE STANDARD Pen': true,
      'I AM THE STANDARD Wristband': true,
      'Monthly 2 Hour Group Boardroom Call': true,
      '24/7 Video Messaging 1v1 Coaching': true,
      'Monthly 2 Hour 1 on 1 Coaching Call': true,
      'Monthly 45 Min Team Coaching Call': false,
    }
  },
  {
    id: 'partnership',
    name: 'The Partnership',
    type: 'membership',
    price: '$2000',
    duration: 'Custom',
    description: 'Complete agency transformation program',
    available: false,
    link: '/partnership',
    highlighted: true,
    features: {
      'Daily Habit (Core4)': true,
      'Notes': true,
      'Assessment': true,
      'Team Chat': true,
      'Stack': true,
      'Video Training Armory': true,
      'Weekly Goal Tracking': true,
      'Annual and Monthly Goal Tracking': true,
      'AI Call Scoring (# Per Month)': '100',
      'Daily Accountability Tools': true,
      'Standard Playbook Hardcover': true,
      'I AM THE STANDARD T Shirt': true,
      'I AM THE STANDARD Pen': true,
      'I AM THE STANDARD Wristband': true,
      'Monthly 2 Hour Group Boardroom Call': true,
      '24/7 Video Messaging 1v1 Coaching': true,
      'Monthly 2 Hour 1 on 1 Coaching Call': true,
      'Monthly 45 Min Team Coaching Call': true,
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