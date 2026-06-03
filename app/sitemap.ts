import type { MetadataRoute } from 'next';
import { siteConfig } from '@/data/site';
import { vehicles } from '@/data/vehicles';
import { blogPosts } from '@/data/content';

export default function sitemap(): MetadataRoute.Sitemap {
  const base = siteConfig.url.replace(/\/$/, '');
  const now = new Date();

  const routes = [
    '',
    '/showroom',
    '/finance',
    '/finance/business',
    '/sell-your-car',
    '/about',
    '/contact',
    '/fomo-zone',
    '/blog',
    '/newsletter',
    '/staff',
    '/careers',
    '/referrals',
    '/feedback',
    '/privacy',
    '/terms',
  ];

  const staticEntries: MetadataRoute.Sitemap = routes.map((r) => ({
    url: `${base}${r || '/'}`,
    lastModified: now,
    changeFrequency: 'weekly' as const,
    priority: r === '' ? 1 : 0.7,
  }));

  const vehicleEntries: MetadataRoute.Sitemap = vehicles.map((v) => ({
    url: `${base}/vehicles/${v.slug}`,
    lastModified: now,
    changeFrequency: 'daily' as const,
    priority: 0.8,
  }));

  const blogEntries: MetadataRoute.Sitemap = blogPosts.map((p) => ({
    url: `${base}/blog/${p.slug}`,
    lastModified: new Date(p.date),
    changeFrequency: 'monthly' as const,
    priority: 0.5,
  }));

  return [...staticEntries, ...vehicleEntries, ...blogEntries];
}
