import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { blogPosts, getPost } from '@/data/content';
import { siteConfig } from '@/data/site';
import { Prose } from '@/components/ui/prose';
import { NewsletterForm } from '@/components/layout/newsletter-form';

export function generateStaticParams() {
  return blogPosts.map((p) => ({ slug: p.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const post = getPost(params.slug);
  if (!post) return { title: 'Article not found' };
  return {
    title: post.title,
    description: post.excerpt,
    alternates: { canonical: `/blog/${post.slug}` },
    openGraph: { title: post.title, description: post.excerpt, images: [{ url: post.image }], type: 'article' },
  };
}

export default function BlogPostPage({ params }: { params: { slug: string } }) {
  const post = getPost(params.slug);
  if (!post) notFound();

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    image: post.image,
    datePublished: post.date,
    dateModified: post.date,
    author: { '@type': 'Person', name: post.author },
    publisher: {
      '@type': 'Organization',
      name: siteConfig.name,
      logo: { '@type': 'ImageObject', url: `${siteConfig.url}/mit-mak-logo.png` },
    },
    description: post.excerpt,
    mainEntityOfPage: `${siteConfig.url}/blog/${post.slug}`,
  };

  return (
    <article className="pt-28 lg:pt-32">
      <div className="container max-w-3xl">
        <Link href="/blog" className="inline-flex items-center gap-2 text-xs uppercase tracking-wide text-graphite-400 hover:text-red">
          <ArrowLeft className="h-3.5 w-3.5" /> All articles
        </Link>
        <span className="mt-6 block font-display text-xs uppercase tracking-[0.2em] text-red">{post.category}</span>
        <h1 className="mt-3 font-anton text-4xl uppercase leading-[0.95] tracking-tight text-white sm:text-5xl">{post.title}</h1>
        <div className="mt-5 flex flex-wrap items-center gap-3 text-xs text-graphite-500">
          <span>{post.author}</span><span>·</span>
          <span>{new Date(post.date).toLocaleDateString('en-ZA', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
          <span>·</span><span>{post.readingTime} read</span>
        </div>
      </div>

      <div className="container mt-10 max-w-4xl">
        <div className="relative aspect-[16/9] overflow-hidden rounded-2xl border border-white/10">
          <Image src={post.image} alt={post.title} fill sizes="(max-width:1024px) 100vw, 900px" priority className="object-cover" />
        </div>
      </div>

      <div className="container mt-10 max-w-3xl pb-12">
        <Prose className="text-lg">
          {post.body.map((para, i) => (
            <p key={i}>{para}</p>
          ))}
        </Prose>

        <div className="mt-12 rounded-2xl border border-white/10 bg-ink-850 p-7">
          <p className="font-display text-lg uppercase tracking-tight text-white">Get the next one in your inbox</p>
          <p className="mt-1.5 text-sm text-graphite-400">Fresh stock, guides and offers, no spam, unsubscribe anytime.</p>
          <NewsletterForm className="mt-5 max-w-md" />
        </div>
      </div>

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
    </article>
  );
}
