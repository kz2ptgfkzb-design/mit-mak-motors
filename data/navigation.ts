import type { NavGroup, NavLink } from '@/types';

export const primaryNav: NavLink[] = [
  { label: 'Showroom', href: '/showroom' },
  { label: 'Finance', href: '/finance' },
  { label: 'Sell Your Car', href: '/sell-your-car' },
  { label: 'FOMO Zone', href: '/fomo-zone', badge: 'LIVE' },
  { label: 'About', href: '/about' },
  { label: 'Contact', href: '/contact' },
];

export const megaMenu: NavGroup[] = [
  {
    title: 'Buy a Car',
    links: [
      { label: 'Full Showroom', href: '/showroom', description: 'Every car, fully filterable' },
      { label: 'New Arrivals', href: '/showroom?sort=newest', description: 'Freshly reconditioned' },
      { label: 'Compare Vehicles', href: '/compare', description: 'Up to 4 side-by-side' },
    ],
  },
  {
    title: 'Finance & Insure',
    accent: true,
    links: [
      { label: 'Apply for Finance', href: '/finance', description: 'Single applicant, 60-sec start' },
      { label: 'Business Finance', href: '/finance/business', description: 'For companies & sole props' },
      { label: 'Payment Calculator', href: '/finance#calculator', description: 'Deposit, term, balloon' },
      { label: 'Free Credit Score', href: '/finance#credit-score', description: 'Check before you apply' },
      { label: 'King Price Insurance', href: '/finance#insurance', description: 'Cover from day one' },
    ],
  },
  {
    title: 'Sell or Trade',
    links: [
      { label: 'Sell Your Car', href: '/sell-your-car', description: 'Best cash price, fast' },
      { label: 'Get a Cash Offer', href: '/sell-your-car#offer', description: 'Instant callback' },
      { label: 'Book a Valuation', href: '/sell-your-car#valuation', description: 'Free, no obligation' },
      { label: 'Trade-In Centre', href: '/contact', description: 'Rachel de Beer Street' },
    ],
  },
  {
    title: 'FOMO Zone',
    accent: true,
    links: [
      { label: 'Win-a-Car Raffle', href: '/fomo-zone/raffle', description: 'Tickets selling fast', badge: 'LIVE' },
      { label: 'BobElz Auction', href: '/fomo-zone/auction', description: 'No reserve, big steals' },
      { label: 'UB Drip Merch', href: '/merch', description: 'Wear the brand' },
      { label: 'Mit-Mak Masterclass', href: '/masterclass', description: 'Learn the game' },
    ],
  },
  {
    title: 'Company',
    links: [
      { label: 'Why Mit-Mak', href: '/about', description: 'Trusted. Awarded. Unmatched.' },
      { label: 'Meet the Team', href: '/staff', description: 'The people behind the standard' },
      { label: 'Careers', href: '/careers', description: 'Join the fastest in PTA' },
      { label: 'Blog', href: '/blog', description: 'Guides, news & tips' },
      { label: 'Referrals', href: '/referrals', description: 'Refer & earn cash' },
      { label: 'Contact', href: '/contact', description: '6 locations + map' },
    ],
  },
];

export interface FomoItem {
  id: string;
  eyebrow: string;
  title: string;
  blurb: string;
  cta: string;
  href: string;
  badge?: string;
  image: string;
}

export const fomoZone: FomoItem[] = [
  {
    id: 'raffle',
    eyebrow: 'Win-a-Car',
    title: 'The Raffle',
    blurb: 'Buy a ticket, stand a chance to drive away in a fully-loaded hero car. Drawn live, delivered free.',
    cta: 'Enter the Raffle',
    href: '/fomo-zone/raffle',
    badge: 'LIVE NOW',
    image: 'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&w=1200&q=80',
  },
  {
    id: 'auction',
    eyebrow: 'BobElz',
    title: 'The Auction',
    blurb: 'No reserve. No nonsense. Bid live on hand-picked stock and steal a deal before anyone else.',
    cta: 'View Auction',
    href: '/fomo-zone/auction',
    badge: 'BIDS OPEN',
    image: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1200&q=80',
  },
  {
    id: 'merch',
    eyebrow: 'UB Drip',
    title: 'The Merch',
    blurb: 'Limited-run apparel built for the culture. Wear the speed. Rep the brand on every street.',
    cta: 'Shop the Drop',
    href: '/merch',
    image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=1200&q=80',
  },
  {
    id: 'masterclass',
    eyebrow: 'Mit-Mak',
    title: 'The Masterclass',
    blurb: 'Everything we know about buying, selling & financing, taught straight, no gatekeeping.',
    cta: 'Reserve a Seat',
    href: '/masterclass',
    image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=1200&q=80',
  },
];

export const footerGroups: NavGroup[] = [
  {
    title: 'Buy',
    links: [
      { label: 'Showroom', href: '/showroom' },
      { label: 'New Arrivals', href: '/showroom?sort=newest' },
      { label: 'Compare', href: '/compare' },
    ],
  },
  {
    title: 'Sell & Finance',
    links: [
      { label: 'Sell Your Car', href: '/sell-your-car' },
      { label: 'Apply for Finance', href: '/finance' },
      { label: 'Business Finance', href: '/finance/business' },
      { label: 'King Price Insurance', href: '/finance#insurance' },
      { label: 'Payment Calculator', href: '/finance#calculator' },
    ],
  },
  {
    title: 'Company',
    links: [
      { label: 'About', href: '/about' },
      { label: 'Our Staff', href: '/staff' },
      { label: 'Careers', href: '/careers' },
      { label: 'Blog', href: '/blog' },
      { label: 'Referrals', href: '/referrals' },
      { label: 'Contact', href: '/contact' },
    ],
  },
  {
    title: 'FOMO Zone',
    links: [
      { label: 'Win-a-Car Raffle', href: '/fomo-zone/raffle' },
      { label: 'BobElz Auction', href: '/fomo-zone/auction' },
      { label: 'UB Drip Merch', href: '/merch' },
      { label: 'Masterclass', href: '/masterclass' },
      { label: 'Newsletter', href: '/newsletter' },
    ],
  },
];

export const legalNav: NavLink[] = [
  { label: 'Compliment / Complaint', href: '/feedback' },
  { label: 'Privacy Policy', href: '/privacy' },
  { label: 'Terms & Conditions', href: '/terms' },
];
