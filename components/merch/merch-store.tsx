'use client';

import { useEffect, useMemo, useState } from 'react';
import Image from 'next/image';
import { BLUR } from '@/lib/blur';
import { AnimatePresence, motion } from 'framer-motion';
import { useLenis } from 'lenis/react';
import { X, ShoppingBag, Plus, Minus, SearchX, Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { MerchProduct } from '@/data/merch';

type BagItem = { key: string; name: string; price: number; priceLabel: string; image: string; size: string; colour: string; qty: number };

const priceNum = (s: string) => Number(String(s).replace(/[^0-9.]/g, '')) || 0;
const randFmt = (n: number) => 'R' + (n % 1 === 0 ? n.toFixed(0) : n.toFixed(2));

export function MerchStore({ products }: { products: MerchProduct[] }) {
  const { list, counts } = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const p of products) counts[p.category] = (counts[p.category] ?? 0) + 1;
    return { list: Object.keys(counts).sort((a, b) => counts[b] - counts[a]), counts };
  }, [products]);

  const [active, setActive] = useState('All');
  const [selected, setSelected] = useState<MerchProduct | null>(null);
  const [size, setSize] = useState('');
  const [colour, setColour] = useState('');
  const [qty, setQty] = useState(1);
  const [bag, setBag] = useState<BagItem[]>([]);
  const [bagOpen, setBagOpen] = useState(false);
  const lenis = useLenis();

  const shown = active === 'All' ? products : products.filter((p) => p.category === active);
  const overlayOpen = !!selected || bagOpen;

  useEffect(() => {
    if (!overlayOpen) return;
    const html = document.documentElement;
    const prev = html.style.overflow;
    html.style.overflow = 'hidden';
    lenis?.stop();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') { setSelected(null); setBagOpen(false); }
    };
    window.addEventListener('keydown', onKey);
    return () => { html.style.overflow = prev; lenis?.start(); window.removeEventListener('keydown', onKey); };
  }, [overlayOpen, lenis]);

  function open(p: MerchProduct) {
    setSelected(p);
    setSize(p.sizes.length === 1 ? p.sizes[0] : '');
    setColour(p.colours.length === 1 ? p.colours[0] : '');
    setQty(1);
  }

  function addToBag() {
    if (!selected) return;
    if (selected.sizes.length > 0 && !size) return;
    const key = `${selected.name}|${size}|${colour}`;
    setBag((cur) => {
      const i = cur.findIndex((b) => b.key === key);
      if (i >= 0) {
        const next = [...cur];
        next[i] = { ...next[i], qty: next[i].qty + qty };
        return next;
      }
      return [...cur, { key, name: selected.name, price: priceNum(selected.price), priceLabel: selected.price, image: selected.image, size, colour, qty }];
    });
    setSelected(null);
    setBagOpen(true);
  }

  const bagCount = bag.reduce((n, b) => n + b.qty, 0);
  const subtotal = bag.reduce((n, b) => n + b.price * b.qty, 0);
  const needsSize = !!selected && selected.sizes.length > 0 && !size;

  return (
    <section className="container py-12 lg:py-16">
      {/* Category filter */}
      <div className="sticky top-20 z-20 -mx-4 mb-9 flex flex-wrap gap-2.5 bg-ink-950/85 px-4 py-3 backdrop-blur-md lg:top-24">
        {['All', ...list].map((c) => (
          <button
            key={c}
            onClick={() => setActive(c)}
            data-cursor="hover"
            className={cn(
              'inline-flex items-center gap-2 rounded-full border px-4 py-2 font-display text-[11px] uppercase tracking-wide transition-colors',
              active === c ? 'border-red bg-red text-white' : 'border-white/15 text-graphite-300 hover:border-white/40 hover:text-white',
            )}
          >
            {c}
            <span className={cn('text-[10px]', active === c ? 'text-white/70' : 'text-graphite-500')}>{c === 'All' ? products.length : counts[c]}</span>
          </button>
        ))}
      </div>

      {/* Product grid */}
      <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-4">
        {shown.map((p) => (
          <button key={p.name} onClick={() => open(p)} data-cursor="hover" className="group flex flex-col text-left">
            <div className="relative aspect-square overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-b from-graphite-800/40 to-ink-900 transition-colors group-hover:border-white/25">
              {p.image && (
                <Image src={p.image} alt={p.name} fill placeholder="blur" blurDataURL={BLUR} sizes="(max-width:640px) 45vw, (max-width:1024px) 30vw, 22vw" className="object-cover transition-transform duration-500 group-hover:scale-105" />
              )}
              <span className="absolute left-3 top-3 rounded-full bg-ink-950/70 px-2.5 py-1 font-display text-[9px] uppercase tracking-widest text-graphite-200 backdrop-blur">{p.category}</span>
              <div className="absolute inset-x-0 bottom-0 flex justify-end bg-gradient-to-t from-ink-950/85 to-transparent p-3 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                <span className="inline-flex items-center gap-1 rounded-full bg-red px-3 py-1.5 font-display text-[10px] uppercase tracking-wide text-white">View</span>
              </div>
            </div>
            <h3 className="mt-3 font-display text-[13px] uppercase leading-tight tracking-tight text-white">{p.name}</h3>
            <span className="mt-1 font-display text-sm text-red">{p.price}</span>
          </button>
        ))}
      </div>
      {shown.length === 0 && (
        <div className="flex flex-col items-center py-20 text-center text-graphite-400">
          <SearchX className="h-8 w-8" />
          <p className="mt-3 text-sm">Nothing in this category right now.</p>
        </div>
      )}

      {/* Floating bag button */}
      <AnimatePresence>
        {bagCount > 0 && !overlayOpen && (
          <motion.button
            initial={{ y: 80, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 80, opacity: 0 }}
            onClick={() => setBagOpen(true)}
            data-cursor="hover"
            className="fixed bottom-6 left-6 z-[80] inline-flex items-center gap-2 rounded-full bg-red px-5 py-3.5 font-display text-xs uppercase tracking-wide text-white shadow-glow"
          >
            <ShoppingBag className="h-4 w-4" /> Bag
            <span className="inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-white px-1.5 text-[11px] text-red">{bagCount}</span>
          </motion.button>
        )}
      </AnimatePresence>

      {/* Product detail modal */}
      <AnimatePresence>
        {selected && (
          <motion.div
            className="fixed inset-0 z-[110] flex items-end justify-center bg-ink-950/85 p-0 backdrop-blur-md sm:items-center sm:p-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelected(null)}
          >
            <motion.div
              onClick={(e) => e.stopPropagation()}
              initial={{ y: 40, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 40, opacity: 0 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              data-lenis-prevent
              className="relative max-h-[92vh] w-full max-w-3xl overflow-auto rounded-t-3xl border border-white/10 bg-ink-900 sm:rounded-3xl"
            >
              <button onClick={() => setSelected(null)} aria-label="Close" className="absolute right-4 top-4 z-10 inline-flex h-9 w-9 items-center justify-center rounded-full bg-ink-950/70 text-white transition-colors hover:bg-red">
                <X className="h-4 w-4" />
              </button>
              <div className="grid sm:grid-cols-2">
                <div className="relative aspect-square bg-gradient-to-b from-graphite-800/40 to-ink-950">
                  {selected.image && <Image src={selected.image} alt={selected.name} fill placeholder="blur" blurDataURL={BLUR} sizes="(max-width:640px) 100vw, 384px" className="object-cover" />}
                </div>
                <div className="p-6 lg:p-8">
                  <p className="font-display text-[11px] uppercase tracking-[0.16em] text-red">{selected.category}</p>
                  <h3 className="mt-2 font-display text-2xl uppercase leading-tight tracking-tight text-white">{selected.name}</h3>
                  <p className="mt-2 font-anton text-3xl text-white">{selected.price}</p>
                  {selected.description && <p className="mt-4 text-sm leading-relaxed text-graphite-300">{selected.description}</p>}

                  {selected.colours.length > 0 && (
                    <div className="mt-5">
                      <p className="font-display text-[11px] uppercase tracking-wide text-graphite-400">Colour</p>
                      <div className="mt-2 flex flex-wrap gap-2">
                        {selected.colours.map((c) => (
                          <button key={c} onClick={() => setColour(c)} className={cn('rounded-full border px-3 py-1.5 text-xs transition-colors', colour === c ? 'border-red bg-red/10 text-white' : 'border-white/15 text-graphite-300 hover:border-white/40')}>
                            {c}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {selected.sizes.length > 0 && (
                    <div className="mt-5">
                      <p className="font-display text-[11px] uppercase tracking-wide text-graphite-400">Size</p>
                      <div className="mt-2 flex flex-wrap gap-2">
                        {selected.sizes.map((s) => (
                          <button key={s} onClick={() => setSize(s)} className={cn('min-w-11 rounded-lg border px-3 py-2 font-display text-xs uppercase transition-colors', size === s ? 'border-red bg-red text-white' : 'border-white/15 text-graphite-300 hover:border-white/40')}>
                            {s}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="mt-6 inline-flex items-center rounded-full border border-white/15">
                    <button onClick={() => setQty((q) => Math.max(1, q - 1))} aria-label="Decrease quantity" className="inline-flex h-10 w-10 items-center justify-center text-graphite-300 hover:text-white">
                      <Minus className="h-4 w-4" />
                    </button>
                    <span className="w-8 text-center font-display text-sm text-white">{qty}</span>
                    <button onClick={() => setQty((q) => q + 1)} aria-label="Increase quantity" className="inline-flex h-10 w-10 items-center justify-center text-graphite-300 hover:text-white">
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>

                  <button
                    onClick={addToBag}
                    disabled={needsSize}
                    data-cursor="hover"
                    className="mt-6 inline-flex h-12 w-full items-center justify-center gap-2 rounded-full bg-red font-display text-xs uppercase tracking-wide text-white transition-transform hover:-translate-y-0.5 hover:shadow-glow disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    <ShoppingBag className="h-4 w-4" /> {needsSize ? 'Select a size' : 'Add to Bag'}
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Bag drawer */}
      <AnimatePresence>
        {bagOpen && (
          <motion.div className="fixed inset-0 z-[120] flex justify-end bg-ink-950/80 backdrop-blur-md" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setBagOpen(false)}>
            <motion.aside
              onClick={(e) => e.stopPropagation()}
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              data-lenis-prevent
              className="flex h-full w-full max-w-md flex-col border-l border-white/10 bg-ink-900"
            >
              <div className="flex items-center justify-between border-b border-white/10 px-6 py-5">
                <h3 className="font-display text-lg uppercase tracking-tight text-white">
                  Your Bag <span className="text-graphite-500">({bagCount})</span>
                </h3>
                <button onClick={() => setBagOpen(false)} aria-label="Close bag" className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/15 text-graphite-300 transition-colors hover:border-red hover:text-white">
                  <X className="h-4 w-4" />
                </button>
              </div>
              <div className="flex-1 overflow-auto px-6 py-5">
                {bag.length === 0 ? (
                  <p className="mt-12 text-center text-sm text-graphite-400">Your bag is empty.</p>
                ) : (
                  <ul className="space-y-4">
                    {bag.map((b) => (
                      <li key={b.key} className="flex gap-3">
                        <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl border border-white/10 bg-ink-950">
                          {b.image && <Image src={b.image} alt={b.name} fill placeholder="blur" blurDataURL={BLUR} sizes="80px" className="object-cover" />}
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="font-display text-[13px] uppercase leading-tight tracking-tight text-white">{b.name}</p>
                          {(b.colour || b.size) && <p className="mt-0.5 text-xs text-graphite-400">{[b.colour, b.size].filter(Boolean).join(' / ')}</p>}
                          <div className="mt-1.5 flex items-center justify-between">
                            <span className="text-sm text-red">{b.priceLabel}</span>
                            <span className="text-xs text-graphite-400">Qty {b.qty}</span>
                          </div>
                        </div>
                        <button onClick={() => setBag((cur) => cur.filter((x) => x.key !== b.key))} aria-label="Remove item" className="self-start text-graphite-500 transition-colors hover:text-red">
                          <X className="h-4 w-4" />
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
              <div className="border-t border-white/10 px-6 py-5">
                <div className="flex items-center justify-between">
                  <span className="font-display text-sm uppercase tracking-wide text-graphite-300">Subtotal</span>
                  <span className="font-anton text-2xl text-white">{randFmt(subtotal)}</span>
                </div>
                <button disabled className="mt-4 inline-flex h-12 w-full cursor-not-allowed items-center justify-center gap-2 rounded-full bg-white/[0.08] font-display text-xs uppercase tracking-wide text-graphite-300">
                  <Check className="h-4 w-4" /> Secure Checkout, Coming Soon
                </button>
                <p className="mt-3 text-center text-xs text-graphite-500">Online payments launch soon. Pop into any branch to grab your drip in the meantime.</p>
              </div>
            </motion.aside>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
