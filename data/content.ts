import type { BlogPost, StaffMember } from '@/types';

const img = (id: string, w = 1400) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&q=80`;

export const testimonials = [
  {
    quote:
      'Bought my X5 from Pretoria and it was delivered to my door in Cape Town, spotless, in three days. Best car-buying experience of my life.',
    author: 'Thabang M.',
    location: 'Cape Town',
    rating: 10,
  },
  {
    quote:
      'The finance team got me a better rate than my own bank. No pressure, no nonsense, just straight talk. 7 years #1 on HelloPeter for a reason.',
    author: 'Lerato D.',
    location: 'Polokwane',
    rating: 10,
  },
  {
    quote:
      'Every scratch I asked about was already sorted on the reconditioning report. The car was exactly as advertised. Unmatched.',
    author: 'Werner v.d. Merwe',
    location: 'Bloemfontein',
    rating: 9,
  },
  {
    quote:
      'Sold my Ranger to them in an afternoon, better cash offer than three other dealers. Money in my account same day.',
    author: 'Sipho K.',
    location: 'Durban',
    rating: 10,
  },
];

export const faqs = [
  {
    q: 'Do you really deliver anywhere in South Africa for free?',
    a: 'Yes. Every car we sell is delivered FREE, door-to-door, to all nine provinces. We handle the logistics, the paperwork and the handover so you never have to set foot in Pretoria.',
  },
  {
    q: 'What does “inspected & reconditioned” actually mean?',
    a: 'Every vehicle passes a 212-point mechanical, electrical and cosmetic inspection. Anything that does not meet standard is repaired or replaced before the car is listed. You receive the full report.',
  },
  {
    q: 'Can I get finance if I am self-employed or own a business?',
    a: 'Absolutely. We have a dedicated Business Finance track for companies, CCs and sole proprietors, plus relationships with every major bank to find you the best rate.',
  },
  {
    q: 'Is there a warranty?',
    a: 'Yes, every car includes a warranty, extendable up to 60 months. Service and maintenance plans are available on most models.',
  },
  {
    q: 'How does a balloon payment work?',
    a: 'A balloon (residual) defers a portion of the price to the end of the term, lowering your monthly instalment. You settle, refinance or trade at the end. Our calculator shows the real numbers before you commit.',
  },
  {
    q: 'Can I trade in my current car?',
    a: 'Yes. Get an instant cash offer through Sell Your Car, or visit our Trade-In Centre on Rachel de Beer Street for a free valuation.',
  },
];

export const staff: StaffMember[] = [
  { name: 'Mike Makua', role: 'Founder & Managing Director', branch: 'Flagship, Gerrit Maritz', image: '', bio: 'Built Mit-Mak from a single bay into Pretoria’s most-awarded used dealership. Still test-drives every hero car.' },
  { name: 'Katlego Mahlangu', role: 'Head of Sales', branch: 'Flagship, Gerrit Maritz', image: '', bio: 'Leads the sales floor with one rule: tell the truth, move fast, deliver free.' },
  { name: 'René Botha', role: 'Finance & Insurance Manager', branch: 'Finance House', image: '', bio: 'Knows every bank’s scorecard by heart. Has saved customers millions in interest.' },
  { name: 'Sibusiso Nkosi', role: 'Bakkie & 4x4 Specialist', branch: 'Bakkie & 4x4 Centre', image: '', bio: 'If it has low-range and a tow bar, Sbu has driven it through a river.' },
  { name: 'Chantel Pretorius', role: 'Reconditioning Lead', branch: 'Delivery Hub', image: '', bio: 'Runs the 212-point process. Nothing leaves the floor until it meets her standard.' },
  { name: 'Ayanda Zwane', role: 'Customer Experience Lead', branch: 'Premium & Performance', image: '', bio: 'The reason we’re #1 on HelloPeter. Answers WhatsApps faster than you can type them.' },
];

export const blogPosts: BlogPost[] = [
  {
    slug: 'free-nationwide-car-delivery-explained',
    title: 'Delivered FREE: How Nationwide Car Delivery Actually Works',
    excerpt:
      'Buying a car 1,400 km away should be terrifying. Here is exactly how we make it boring, in the best way.',
    category: 'Buying Guide',
    author: 'Katlego Mahlangu',
    date: '2026-05-21',
    readingTime: '5 min',
    image: img('1502161254066-6c74afbf07aa'),
    body: [
      'Free nationwide delivery is the single most common reason customers choose Mit-Mak, and the single thing they trust least until it happens. So let us pull back the curtain.',
      'It starts the moment you reserve. Your car is moved from the showroom floor into our Delivery Hub on Rachel de Beer Street, where it gets a final detail, a documentation pack, and a covered-transport booking to your nearest major centre.',
      'You receive tracking, an arrival window, and a named contact. On handover, you inspect the car against the same 212-point report we published online. If anything is off, you do not sign, simple as that.',
      'Because we control reconditioning, transport and handover end-to-end, there is no third party to blame and no surprise invoice. Free means free: the price you see is the price you pay, delivered to your door in any of the nine provinces.',
    ],
  },
  {
    slug: 'balloon-payments-explained',
    title: 'Balloon Payments Explained: Lower Instalments Without the Trap',
    excerpt:
      'A balloon can free up hundreds a month, or quietly cost you. Here is how to use one on purpose.',
    category: 'Finance',
    author: 'René Botha',
    date: '2026-05-09',
    readingTime: '6 min',
    image: img('1606152421802-db97b9c7a11b'),
    body: [
      'A balloon payment (also called a residual) is a lump sum you defer to the end of your finance term. Because you are financing a smaller amount month-to-month, your instalment drops, sometimes dramatically.',
      'The trade-off: that deferred amount keeps accruing interest, and you still have to settle it at the end, whether by cash, refinance, or trade-in. Used blindly, it can leave you owing more than the car is worth.',
      'Used deliberately, it is a powerful tool. If you know you will trade up in three years, a balloon keeps your monthly low and lets the next car absorb the residual. Our calculator on every vehicle page shows the true cost of credit so you decide with eyes open.',
      'Rule of thumb: the shorter your ownership horizon, the more a modest balloon makes sense. The longer you plan to keep the car, the smaller it should be.',
    ],
  },
  {
    slug: 'inside-a-212-point-reconditioning',
    title: '212 Points: Inside a Mit-Mak Reconditioning',
    excerpt:
      'Every car gets the same obsessive once-over before it earns a spot on the floor. We followed one through.',
    category: 'Behind the Scenes',
    author: 'Chantel Pretorius',
    date: '2026-04-28',
    readingTime: '7 min',
    image: img('1493134799591-2c9eed26201a'),
    body: [
      'Reconditioning is where reputations are made. A car can photograph beautifully and still hide a tired clutch, a lazy turbo, or a panel that was sprayed in a hurry. Our job is to find it before you do.',
      'The 212-point process splits into three passes: mechanical, electrical, and cosmetic. Each is signed off by a different specialist, so no single person can wave a car through.',
      'Anything below standard is repaired or replaced, not negotiated. Tyres under 4 mm get changed. Brake pads under spec get changed. A scratch that breaks the clear coat gets corrected.',
      'The result is the report you read online: honest, itemised, and the same document you will hold at handover. That is what “Trusted. Awarded. Unmatched.” actually means in practice.',
    ],
  },
  {
    slug: 'bakkie-buyers-guide-2026',
    title: 'Bakkie Buyer’s Guide: Hilux vs Ranger in 2026',
    excerpt:
      'Two icons, two philosophies. We break down which double cab deserves your money this year.',
    category: 'Buying Guide',
    author: 'Sibusiso Nkosi',
    date: '2026-04-12',
    readingTime: '8 min',
    image: img('1532581140115-3e355d1ed1de'),
    body: [
      'No segment is more emotional in South Africa than the double cab. The Hilux is the unkillable workhorse; the Ranger is the tech-forward all-rounder. Both are brilliant. They are not the same.',
      'Choose the Hilux for outright reliability, resale strength, and a dealer network that reaches every dorp. The 2.8 GD-6 is torque-rich and endlessly serviceable.',
      'Choose the Ranger for ride quality, interior tech and the Bi-Turbo’s effortless overtaking. The Wildtrak feels a class above on tar and holds its own off it.',
      'Our advice: drive both on the same day. We keep both on the floor at our Bakkie & 4x4 Centre precisely so you can. Whichever wins, it leaves reconditioned and delivered free.',
    ],
  },
  {
    slug: 'trade-in-vs-private-sale',
    title: 'Trade-In vs Private Sale: What Actually Puts More Cash in Your Pocket',
    excerpt:
      'The private buyer offered more, but did they really? The honest maths behind selling your car.',
    category: 'Selling',
    author: 'René Botha',
    date: '2026-03-30',
    readingTime: '5 min',
    image: img('1605559424843-9e4c228bf1c2'),
    body: [
      'A private buyer will often quote you more than a dealer. On paper. The gap usually disappears once you account for the cost, and risk, of selling it yourself.',
      'Advertising, weeks of strangers at your gate, test-drive liability, payment fraud, and the VAT and finance-settlement admin all eat into that higher number.',
      'A trade-in or instant cash offer is clean: one valuation, one payment, no risk, and, if you are trading up, a potential tax-efficiency on the new purchase. Same day, money in your account.',
      'Get both numbers. Our Sell Your Car flow gives you an instant cash offer in minutes, so you can compare like-for-like instead of guessing.',
    ],
  },
];

export function getPost(slug: string): BlogPost | undefined {
  return blogPosts.find((p) => p.slug === slug);
}
