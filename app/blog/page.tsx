import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { blogPosts } from '@/data/content';
import { PageHero } from '@/components/layout/page-hero';
import { Reveal } from '@/components/ui/reveal';

export const metadata: Metadata = {
  title: 'Blog, Guides, News & Tips',
  description: 'Buying guides, finance explainers and behind-the-scenes from Mit-Mak Motors, Pretoria’s most-awarded pre-owned dealership.',
  alternates: { canonical: '/blog' },
};

export default function BlogPage() {
  const [featured, ...rest] = blogPosts;

  return (
    <>
      <PageHero
        eyebrow="The Journal"
        title="Guides, News & Tips"
        description="Straight talk on buying, selling and financing cars in South Africa, plus the occasional look behind the Mit-Mak curtain."
        crumbs={[{ label: 'Home', href: '/' }, { label: 'Blog', href: '/blog' }]}
        image="https://img.autotrader.co.za/47437140/Crop1024x576.jpg"
      />

      <section className="py-16 lg:py-24">
        <div className="container">
          {/* Featured */}
          <Link href={`/blog/${featured.slug}`} data-cursor="view" data-cursor-text="Read" className="group grid gap-8 lg:grid-cols-2">
            <div className="relative aspect-[16/10] overflow-hidden rounded-2xl border border-white/10">
              <Image src={featured.image} alt={featured.title} fill sizes="(max-width:1024px) 100vw, 50vw" priority className="object-cover transition-transform duration-700 ease-out-expo group-hover:scale-105" />
            </div>
            <div className="flex flex-col justify-center">
              <span className="font-display text-xs uppercase tracking-[0.2em] text-red">{featured.category}</span>
              <h2 className="mt-3 font-anton text-3xl uppercase leading-[0.95] tracking-tight text-white sm:text-4xl lg:text-5xl">{featured.title}</h2>
              <p className="mt-4 max-w-lg text-graphite-300">{featured.excerpt}</p>
              <div className="mt-5 flex items-center gap-3 text-xs text-graphite-500">
                <span>{featured.author}</span><span>·</span>
                <span>{new Date(featured.date).toLocaleDateString('en-ZA', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                <span>·</span><span>{featured.readingTime} read</span>
              </div>
            </div>
          </Link>

          {/* Grid */}
          <div className="mt-16 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {rest.map((post, i) => (
              <Reveal key={post.slug} delay={i * 0.06}>
                <Link href={`/blog/${post.slug}`} data-cursor="view" data-cursor-text="Read" className="group flex h-full flex-col overflow-hidden rounded-2xl border border-white/10 bg-ink-850 transition-colors hover:border-white/25">
                  <div className="relative aspect-[16/10] overflow-hidden">
                    <Image src={post.image} alt={post.title} fill sizes="(max-width:768px) 100vw, 33vw" className="object-cover transition-transform duration-700 ease-out-expo group-hover:scale-105" />
                  </div>
                  <div className="flex flex-1 flex-col p-5">
                    <span className="font-display text-[11px] uppercase tracking-[0.18em] text-red">{post.category}</span>
                    <h3 className="mt-2 font-display text-lg uppercase leading-tight tracking-tight text-white">{post.title}</h3>
                    <p className="mt-2 line-clamp-2 text-sm text-graphite-400">{post.excerpt}</p>
                    <div className="mt-auto flex items-center justify-between pt-4 text-xs text-graphite-500">
                      <span>{post.readingTime} read</span>
                      <ArrowUpRight className="h-4 w-4 text-graphite-400 transition-all group-hover:-translate-y-0.5 group-hover:text-red" />
                    </div>
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
