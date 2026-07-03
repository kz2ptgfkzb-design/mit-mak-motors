import type { Metadata, Viewport } from 'next';
import { Oswald, Inter, Anton } from 'next/font/google';
import './globals.css';
import { cn } from '@/lib/utils';
import { siteConfig } from '@/data/site';
import { locations } from '@/data/locations';
import { Footer } from '@/components/layout/footer';
import { SiteFrame } from '@/components/layout/site-frame';

const display = Oswald({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-display',
  display: 'swap',
});
const sans = Inter({ subsets: ['latin'], variable: '--font-sans', display: 'swap' });
const anton = Anton({ subsets: ['latin'], weight: '400', variable: '--font-anton', display: 'swap' });

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: `${siteConfig.name}, Premium Pre-Owned Cars, Pretoria`,
    template: `%s · ${siteConfig.name}`,
  },
  description: siteConfig.description,
  applicationName: siteConfig.name,
  keywords: [
    'used cars Pretoria',
    'pre-owned cars South Africa',
    'Mit-Mak Motors',
    'car finance South Africa',
    'sell my car Pretoria',
    'AutoTrader Dealer of the Year',
    'bakkies for sale',
    'SUVs for sale Pretoria',
  ],
  authors: [{ name: siteConfig.name }],
  creator: siteConfig.name,
  openGraph: {
    type: 'website',
    locale: 'en_ZA',
    url: siteConfig.url,
    siteName: siteConfig.name,
    title: `${siteConfig.name}, ${siteConfig.tagline}`,
    description: siteConfig.description,
  },
  twitter: {
    card: 'summary_large_image',
    title: `${siteConfig.name}, ${siteConfig.tagline}`,
    description: siteConfig.description,
  },
  robots: { index: true, follow: true },
  alternates: { canonical: '/' },
};

export const viewport: Viewport = {
  themeColor: '#0A0A0A',
  colorScheme: 'dark',
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'AutoDealer',
  name: siteConfig.name,
  description: siteConfig.description,
  url: siteConfig.url,
  telephone: siteConfig.phoneDisplay,
  email: siteConfig.email,
  priceRange: 'R119 900 - R1 999 900',
  areaServed: 'ZA',
  aggregateRating: {
    '@type': 'AggregateRating',
    ratingValue: siteConfig.helloPeter.rating,
    bestRating: 10,
    ratingCount: 4820,
  },
  address: locations.map((l) => ({
    '@type': 'PostalAddress',
    streetAddress: l.street,
    addressLocality: l.suburb,
    addressRegion: l.province,
    postalCode: l.postalCode,
    addressCountry: 'ZA',
  })),
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={cn(display.variable, sans.variable, anton.variable)}>
      <body className="bg-ink-900 font-sans antialiased">
        <SiteFrame footer={<Footer />}>{children}</SiteFrame>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </body>
    </html>
  );
}
