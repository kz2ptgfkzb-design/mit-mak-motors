// Mit-Mak Masterclass content, mirrored from courses.mitmakmasterclass.co.za
// (Tutor LMS). Presented in-site, no external reroute.

export interface MasterclassCourse {
  title: string;
  format: string;
  price: string;
  duration: string;
  blurb: string;
}

export const masterclassCourses: MasterclassCourse[] = [
  {
    title: 'Sales Training Seminar',
    format: 'Live Seminar',
    price: 'R7 999',
    duration: 'Full day',
    blurb: 'The exact sales process and scripts behind 200+ cars a month. Turn more walk-ins and leads into signed deals.',
  },
  {
    title: 'Marketing on Anarra Level',
    format: 'Live Seminar',
    price: 'R15 000',
    duration: 'Full day',
    blurb: 'Build a brand that fills the floor. Lead generation, content and the marketing playbook that actually scales.',
  },
  {
    title: 'Exclusive VIP Masterclass',
    format: 'In Person',
    price: 'On enquiry',
    duration: 'Capped at 20 seats',
    blurb: 'Learn how to run a successful dealership end to end, in an intimate room limited to twenty people.',
  },
  {
    title: 'Quality Inventory Masterclass',
    format: 'In Person',
    price: 'On enquiry',
    duration: '2-day intensive',
    blurb: 'Master the art of buying right and staying ahead of your competitors on stock and pricing.',
  },
  {
    title: 'Online Reputation',
    format: 'Online Course',
    price: 'R995',
    duration: '1 hour · lifetime access',
    blurb: 'Build and protect a 5-star reputation that sells for you. The system behind 5 years at #1 on HelloPeter.',
  },
  {
    title: 'Mentorship with Bobby',
    format: 'Online or In Person',
    price: 'On enquiry',
    duration: 'Tailored to you',
    blurb: 'One-on-one mentorship with Bobby Petkov, built around your business, your market and your goals.',
  },
];

export const masterclassCredentials = [
  'AutoTrader Dealer of the Year',
  '#1 on HelloPeter, 5 years',
  '200+ cars sold every month',
  'Largest auto YouTube channel in Africa',
  'Best F&I in SA, 2 years running',
  '18+ years in the trade',
];

export const masterclassSkills = [
  { title: 'Sales that close', text: 'The conversion process and scripts that turn leads into signed deals.' },
  { title: 'Marketing that fills the floor', text: 'Lead generation, content and brand building that brings buyers to you.' },
  { title: 'Spot the fraud', text: 'Detect vehicle and deal fraud before it ever costs you money.' },
  { title: 'Systems that scale', text: 'The operations and processes that grow a dealership without breaking it.' },
  { title: 'Build the team', text: 'Recruiting and structuring people who perform and stay.' },
  { title: 'Reputation that sells', text: 'Manage reviews and reputation so your name does the selling.' },
];

export const masterclassInstructor = {
  name: 'Bobby Petkov',
  role: 'Founder, Mit-Mak Motors',
  image: '/staff/image_6784def8768fa8.63129354.png',
  bio: 'Eighteen years in the trade, 200+ cars sold every month, and AutoTrader Dealer of the Year. Bobby built the largest automotive YouTube channel on the continent, and now teaches the exact playbook, sales, marketing, F&I and operations, with zero gatekeeping.',
};
