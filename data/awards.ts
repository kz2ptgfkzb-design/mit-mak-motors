import type { Award, StatItem } from '@/types';

export const awards: Award[] = [
  { id: 'at-2025', title: 'AutoTrader Dealer of the Year', subtitle: 'Multi-Franchise Used', year: '2025' },
  { id: 'at-2024', title: 'AutoTrader Dealer of the Year', subtitle: 'Multi-Franchise Used', year: '2024' },
  { id: 'hp', title: '#1 on HelloPeter', subtitle: '7 Years Running', year: '2018–2025' },
  { id: 'service', title: '9.7 / 10 Service Index', subtitle: 'Verified Customer Rating' },
  { id: 'delivery', title: 'Free Nationwide Delivery', subtitle: 'Door-to-Door, Every Province' },
  { id: 'inspected', title: '212-Point Inspection', subtitle: 'Inspected & Reconditioned' },
  { id: 'cpa', title: 'CPA & NCA Compliant', subtitle: 'Buy With Confidence' },
  { id: 'warranty', title: 'Warranty on Every Car', subtitle: 'Extendable up to 60 Months' },
];

export const stats: StatItem[] = [
  { id: 'sold', value: 12480, suffix: '+', label: 'Cars delivered & loved' },
  { id: 'rating', value: 9.7, decimals: 1, suffix: '/10', label: 'HelloPeter service rating' },
  { id: 'years', value: 7, label: 'Years #1 on HelloPeter' },
  { id: 'provinces', value: 9, suffix: '/9', label: 'Provinces we deliver to' },
];

export const trustPoints = [
  'Every car inspected & reconditioned',
  'Delivered FREE anywhere in South Africa',
  'AutoTrader Dealer of the Year 2024 & 2025',
  '#1 on HelloPeter, 7 years running',
];
