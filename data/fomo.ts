// ─────────────────────────────────────────────────────────────
// FOMO Zone detail content. Each entry powers a themed landing page
// at /fomo-zone/[slug] whose primary CTA opens the real external
// platform (raffle store, auction, merch store, course site).
// Content mirrors the live external pages.
// ─────────────────────────────────────────────────────────────

export interface FomoBlock {
  /** Optional lead figure (step number, price, tag). */
  meta?: string;
  title: string;
  body: string;
}

export interface FomoDetail {
  slug: string;
  eyebrow: string;
  title: string;
  tagline: string;
  lead: string;
  image: string;
  badge?: string;
  external: { label: string; url: string };
  blocksLabel: string;
  blocks: FomoBlock[];
  note?: string;
}

export const fomoDetails: Record<string, FomoDetail> = {
  raffle: {
    slug: 'raffle',
    eyebrow: 'Win a Car',
    title: 'The Raffle',
    tagline: 'Buy a ticket, stand a chance to drive away in a fully loaded hero car. Drawn live, delivered free.',
    lead: 'Right now you can win a Volkswagen Polo GTI paired with a Louis Vuitton His & Hers bundle. Tickets are limited, so every entry is a real shot at the keys.',
    image: 'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&w=1200&q=80',
    badge: 'Live Now',
    external: { label: 'Enter the Raffle', url: 'https://raffles.mitmakmotors.co.za/product/pologti-lv-his-hers/' },
    blocksLabel: 'How it works',
    blocks: [
      { meta: '01', title: 'This draw', body: 'A Volkswagen Polo GTI plus a Louis Vuitton His & Hers bundle, the full hero package.' },
      { meta: '02', title: 'Real odds', body: 'Tickets are limited, so every entry carries genuine weight. No bottomless ticket pool.' },
      { meta: '03', title: 'Drawn live', body: 'Winners are picked on a live stream and announced on the spot. Fully transparent.' },
      { meta: '04', title: 'Delivered free', body: 'Your car is reconditioned, licensed and delivered free to your door, anywhere in South Africa.' },
    ],
    note: 'Ticket price and full terms are on the raffle page.',
  },
  auction: {
    slug: 'auction',
    eyebrow: 'BobElz Auction',
    title: 'The Auction',
    tagline: 'No reserve. No nonsense. Bid live on hand-picked stock and steal a deal before anyone else.',
    lead: 'The BobElz Auction puts hand-picked, inspected cars under the hammer, often well below retail. Register, get verified, and bid live from anywhere in South Africa.',
    image: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1200&q=80',
    badge: 'Bids Open',
    external: { label: 'View Live Auctions', url: 'https://www.mitmakmotors.co.za/auction/' },
    blocksLabel: 'How it works',
    blocks: [
      { meta: '01', title: 'Register', body: 'Create your account and get verified to unlock live bidding.' },
      { meta: '02', title: 'Browse the lots', body: 'Hand-picked, inspected stock goes up for grabs with no reserve games.' },
      { meta: '03', title: 'Bid live', body: 'Place your bids in real time from your phone, anywhere in the country.' },
      { meta: '04', title: 'Win and drive', body: 'Win the lot and we recondition and deliver it free to your door.' },
    ],
    note: 'Live lots and registration are on the auction page.',
  },
  merch: {
    slug: 'merch',
    eyebrow: 'UB Drip',
    title: 'The Merch',
    tagline: 'Limited-run apparel built for the culture. Wear the speed, rep the brand on every street.',
    lead: 'Uncle Bobby Merch is streetwear with attitude. Small drops, big energy, and they sell fast. Cop it before it is gone.',
    image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=1200&q=80',
    external: { label: 'Shop the Drop', url: 'https://merch.mitmakmotors.co.za/' },
    blocksLabel: 'The collections',
    blocks: [
      { title: 'No Excuses Gear', body: 'For those who refuse to be average.' },
      { title: 'Uncle Bobby Caps', body: 'For your solar panel. Lids that finish the fit.' },
      { title: 'Uncle Bobby Humor', body: 'For those who refuse to live a boring life.' },
    ],
    note: 'New drops land small and sell out fast.',
  },
  masterclass: {
    slug: 'masterclass',
    eyebrow: 'Mit-Mak Masterclass',
    title: 'The Masterclass',
    tagline: 'Everything we know about buying, selling and financing, taught straight, no gatekeeping.',
    lead: 'Learn from Bobby Petkov and a team that moves around 200 cars a month. 18+ years in the trade, distilled into live seminars and online modules, backed by a 100% money-back guarantee.',
    image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=1200&q=80',
    external: { label: 'Browse Courses', url: 'https://courses.mitmakmasterclass.co.za/' },
    blocksLabel: 'Courses & seminars',
    blocks: [
      { meta: 'R7,999', title: 'Sales Training Seminar', body: 'A live session on the sales skills and techniques that actually close deals.' },
      { meta: 'R15,000', title: 'Marketing Masterclass', body: 'A live deep dive on marketing strategy and putting it into action.' },
      { meta: 'Hybrid', title: 'Mentorship with Bobby', body: 'One on one business mentorship, online or in person.' },
      { meta: 'R995', title: 'Online Reputation', body: 'A one hour online course on managing your digital reputation.' },
    ],
    note: '100% money-back guarantee if you do not see the value.',
  },
};

export const fomoSlugs = Object.keys(fomoDetails);

export function getFomoDetail(slug: string): FomoDetail | undefined {
  return fomoDetails[slug];
}
