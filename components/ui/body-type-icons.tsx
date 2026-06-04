import type { BodyType } from '@/types';

// Exact body-style icons lifted from mitmakmotors.co.za: white filled car
// silhouettes with red accents, saved under /public/body-types. Rendered as
// plain <img> (next/image does not optimise SVGs).
const SLUGS: Partial<Record<BodyType, string>> = {
  Sedan: 'sedan',
  Coupe: 'coupe',
  SUV: 'suv',
  Hatchback: 'hatchback',
  Cabriolet: 'cabriolet',
  'Single Cab': 'single-cab',
  'Extended Cab': 'extended-cab',
  'Double Cab': 'double-cab',
};

export function BodyTypeIcon({ type, className }: { type: BodyType; className?: string }) {
  const slug = SLUGS[type] ?? 'sedan';
  // eslint-disable-next-line @next/next/no-img-element
  return <img src={`/body-types/${slug}.svg`} alt="" aria-hidden className={className} />;
}

/** The body styles shown as quick-pick shortcuts, in display order. */
export const SHORTCUT_BODY_TYPES: BodyType[] = [
  'Sedan',
  'Coupe',
  'SUV',
  'Hatchback',
  'Cabriolet',
  'Single Cab',
  'Extended Cab',
  'Double Cab',
];
