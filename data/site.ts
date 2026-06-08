export const siteConfig = {
  name: 'Mit-Mak Motors',
  legalName: 'Mit-Mak Motors (Pty) Ltd',
  shortName: 'Mit-Mak',
  tagline: 'Trusted. Awarded. Unmatched.',
  description:
    "Pretoria's premium pre-owned dealership. Every car inspected & reconditioned, delivered FREE anywhere in South Africa. AutoTrader Dealer of the Year 2024 & 2025, #1 on HelloPeter for 7 years running.",
  url: process.env.NEXT_PUBLIC_SITE_URL || 'https://mitmakmotors.co.za',
  phoneDisplay: process.env.NEXT_PUBLIC_PHONE || '+27 12 546 5878',
  phoneHref: (process.env.NEXT_PUBLIC_PHONE || '+27 12 546 5878').replace(/[^+\d]/g, ''),
  whatsapp: process.env.NEXT_PUBLIC_WHATSAPP || '27125465878',
  email: 'sales@mitmakmotors.co.za',
  financeEmail: 'finance@mitmakmotors.co.za',
  hours: [
    { day: 'Monday - Friday', time: '08:00 - 17:30' },
    { day: 'Saturday', time: '08:00 - 13:00' },
    { day: 'Sunday', time: 'Closed' },
    { day: 'Public Holidays', time: '08:00 - 13:00' },
  ],
  socials: [
    { label: 'Facebook', href: 'https://www.facebook.com/MitMakMotors/', handle: '/MitMakMotors' },
    { label: 'Instagram', href: 'https://www.instagram.com/mitmakmotors/', handle: '@mitmakmotors' },
    { label: 'YouTube', href: 'https://www.youtube.com/@MitMakMasterclass', handle: '@MitMakMasterclass' },
    { label: 'TikTok', href: 'https://www.tiktok.com/@mitmakmotors', handle: '@mitmakmotors' },
    { label: 'X', href: 'https://x.com/mit_mak_motors', handle: '@mit_mak_motors' },
  ],
  helloPeter: { rating: 9.7, years: 7 },
  delivery: 'Delivered FREE anywhere in South Africa',
};

export type SiteConfig = typeof siteConfig;

export function whatsappLink(message?: string): string {
  const base = `https://wa.me/${siteConfig.whatsapp}`;
  return message ? `${base}?text=${encodeURIComponent(message)}` : base;
}
