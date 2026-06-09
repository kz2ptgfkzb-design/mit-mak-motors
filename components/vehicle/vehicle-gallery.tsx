'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { AnimatePresence, motion } from 'framer-motion';
import { useLenis } from 'lenis/react';
import { ChevronLeft, ChevronRight, Expand, X, RotateCw } from 'lucide-react';
import { cn } from '@/lib/utils';
import { carImage } from '@/lib/img';

export function VehicleGallery({ images, alt }: { images: string[]; alt: string }) {
  const [index, setIndex] = useState(0);
  const [lightbox, setLightbox] = useState(false);
  const [spinning, setSpinning] = useState(false);
  const lenis = useLenis();
  const n = images.length;

  const go = (dir: number) => setIndex((i) => (i + dir + n) % n);

  // Simulated 360° spin, cycles one full loop of frames.
  function spin() {
    if (spinning) return;
    setSpinning(true);
    let steps = 0;
    const id = setInterval(() => {
      setIndex((i) => (i + 1) % n);
      steps += 1;
      if (steps >= n) {
        clearInterval(id);
        setSpinning(false);
      }
    }, 90);
  }

  // Lightbox scroll-lock + keyboard nav.
  useEffect(() => {
    if (!lightbox) return;
    const html = document.documentElement;
    const prev = html.style.overflow;
    html.style.overflow = 'hidden';
    lenis?.stop();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setLightbox(false);
      if (e.key === 'ArrowRight') go(1);
      if (e.key === 'ArrowLeft') go(-1);
    };
    window.addEventListener('keydown', onKey);
    return () => {
      html.style.overflow = prev;
      lenis?.start();
      window.removeEventListener('keydown', onKey);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lightbox, n]);

  return (
    <div>
      {/* Main image */}
      <div className="group relative aspect-[16/10] overflow-hidden rounded-2xl border border-white/10 bg-ink-800">
        <AnimatePresence mode="popLayout" initial={false}>
          <motion.div
            key={index}
            initial={{ opacity: 0, scale: 1.02 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="absolute inset-0"
          >
            <Image src={carImage(images[index], 1800)} alt={`${alt}, image ${index + 1}`} fill priority unoptimized sizes="(max-width:1024px) 100vw, 60vw" className="object-cover" />
          </motion.div>
        </AnimatePresence>

        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink-950/30 to-transparent" />

        {/* 360 + expand */}
        <div className="absolute left-4 top-4 flex gap-2">
          <button
            onClick={spin}
            data-cursor="hover"
            className={cn(
              'inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 font-display text-[10px] uppercase tracking-widest backdrop-blur transition-colors',
              spinning ? 'border-red bg-red text-white' : 'border-white/20 bg-ink-900/60 text-white hover:border-red',
            )}
          >
            <RotateCw className={cn('h-3.5 w-3.5', spinning && 'animate-spin')} /> 360°
          </button>
        </div>
        <button
          onClick={() => setLightbox(true)}
          aria-label="View full screen"
          data-cursor="hover"
          className="absolute right-4 top-4 inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/20 bg-ink-900/60 text-white backdrop-blur transition-colors hover:border-red"
        >
          <Expand className="h-4 w-4" />
        </button>

        {/* Arrows */}
        <button
          onClick={() => go(-1)}
          aria-label="Previous image"
          data-cursor="hover"
          className="absolute left-4 top-1/2 inline-flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/15 bg-ink-900/60 text-white opacity-0 backdrop-blur transition-all hover:border-red group-hover:opacity-100"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
        <button
          onClick={() => go(1)}
          aria-label="Next image"
          data-cursor="hover"
          className="absolute right-4 top-1/2 inline-flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/15 bg-ink-900/60 text-white opacity-0 backdrop-blur transition-all hover:border-red group-hover:opacity-100"
        >
          <ChevronRight className="h-5 w-5" />
        </button>

        <div className="absolute bottom-4 right-4 rounded-full bg-ink-950/70 px-3 py-1 font-display text-xs text-white backdrop-blur">
          {index + 1} / {n}
        </div>
      </div>

      {/* Thumbnail rail */}
      <div className="hide-scrollbar mt-3 flex gap-2.5 overflow-x-auto pb-1">
        {images.map((src, i) => (
          <button
            key={i}
            onClick={() => setIndex(i)}
            data-cursor="hover"
            aria-label={`View image ${i + 1}`}
            className={cn(
              'relative h-16 w-24 shrink-0 overflow-hidden rounded-lg border-2 transition-all',
              i === index ? 'border-red opacity-100' : 'border-transparent opacity-50 hover:opacity-100',
            )}
          >
            <Image src={carImage(src, 220)} alt="" fill unoptimized sizes="96px" className="object-cover" />
          </button>
        ))}
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {lightbox && (
          <motion.div
            className="fixed inset-0 z-[110] flex flex-col bg-ink-950/97 backdrop-blur-xl"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="flex items-center justify-between px-5 py-5">
              <span className="font-display text-sm uppercase tracking-wide text-white">
                {index + 1} / {n}
              </span>
              <button onClick={() => setLightbox(false)} aria-label="Close" data-cursor="hover" className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/15 text-white hover:border-red">
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="relative flex flex-1 items-center justify-center px-4 pb-4">
              <button onClick={() => go(-1)} aria-label="Previous" data-cursor="hover" className="absolute left-4 z-10 inline-flex h-12 w-12 items-center justify-center rounded-full border border-white/15 bg-ink-900/60 text-white hover:border-red">
                <ChevronLeft className="h-6 w-6" />
              </button>
              <div className="relative h-full w-full max-w-5xl">
                <Image src={carImage(images[index], 2200)} alt={`${alt}, image ${index + 1}`} fill unoptimized sizes="90vw" className="object-contain" />
              </div>
              <button onClick={() => go(1)} aria-label="Next" data-cursor="hover" className="absolute right-4 z-10 inline-flex h-12 w-12 items-center justify-center rounded-full border border-white/15 bg-ink-900/60 text-white hover:border-red">
                <ChevronRight className="h-6 w-6" />
              </button>
            </div>
            <div className="hide-scrollbar flex justify-center gap-2 overflow-x-auto px-5 py-4">
              {images.map((src, i) => (
                <button
                  key={i}
                  onClick={() => setIndex(i)}
                  className={cn('relative h-12 w-16 shrink-0 overflow-hidden rounded-md border-2', i === index ? 'border-red' : 'border-transparent opacity-50')}
                >
                  <Image src={carImage(src, 140)} alt="" fill unoptimized sizes="64px" className="object-cover" />
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
