// ─────────────────────────────────────────────────────────────
// FOMO Zone detail content. Each entry powers a themed landing page
// at /fomo-zone/[slug] whose primary CTA opens the real external
// platform (raffle store, auction). Merch and Masterclass have their own
// self-contained top-level pages (/merch, /masterclass).
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
};

export const fomoSlugs = Object.keys(fomoDetails);

export function getFomoDetail(slug: string): FomoDetail | undefined {
  return fomoDetails[slug];
}
