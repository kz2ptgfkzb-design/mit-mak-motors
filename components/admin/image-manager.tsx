'use client';

import { useRef, useState } from 'react';
import { Upload, Link2, Trash2, ArrowLeft, ArrowRight, Star } from 'lucide-react';
import type { VehicleImage } from '@/lib/inventory/types';
import { Button, Input, Spinner } from './ui';
import { useToast } from './providers';

export function ImageManager({
  images,
  onChange,
}: {
  images: VehicleImage[];
  onChange: (images: VehicleImage[]) => void;
}) {
  const toast = useToast();
  const [url, setUrl] = useState('');
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  function addUrl() {
    const u = url.trim();
    if (!u) return;
    if (!/^https?:\/\//i.test(u)) {
      toast('Enter a full image URL (starting with http).', 'error');
      return;
    }
    onChange([...images, { url: u }]);
    setUrl('');
  }
  function removeAt(i: number) {
    onChange(images.filter((_, idx) => idx !== i));
  }
  function move(i: number, dir: -1 | 1) {
    const j = i + dir;
    if (j < 0 || j >= images.length) return;
    const next = [...images];
    [next[i], next[j]] = [next[j], next[i]];
    onChange(next);
  }
  function setMain(i: number) {
    if (i === 0) return;
    const next = [...images];
    const [m] = next.splice(i, 1);
    next.unshift(m);
    onChange(next);
  }
  function setAlt(i: number, alt: string) {
    onChange(images.map((im, idx) => (idx === i ? { ...im, alt } : im)));
  }

  async function upload(files: FileList | null) {
    if (!files || files.length === 0) return;
    setUploading(true);
    const added: VehicleImage[] = [];
    try {
      for (const file of Array.from(files)) {
        const fd = new FormData();
        fd.append('file', file);
        const res = await fetch('/api/admin/images/upload', { method: 'POST', body: fd });
        const data = await res.json().catch(() => ({}));
        if (!res.ok) throw new Error(data.error || 'Upload failed');
        added.push({ url: data.url });
      }
      onChange([...images, ...added]);
      toast(`${added.length} image${added.length > 1 ? 's' : ''} uploaded`);
    } catch (err) {
      if (added.length) onChange([...images, ...added]);
      toast((err as Error).message, 'error');
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = '';
    }
  }

  return (
    <div>
      <div className="flex flex-wrap items-end gap-2">
        <div className="min-w-[220px] flex-1">
          <Input
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                addUrl();
              }
            }}
            placeholder="Paste an image URL..."
          />
        </div>
        <Button type="button" variant="outline" onClick={addUrl}>
          <Link2 className="h-4 w-4" /> Add URL
        </Button>
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={(e) => upload(e.target.files)}
        />
        <Button type="button" variant="outline" disabled={uploading} onClick={() => fileRef.current?.click()}>
          {uploading ? <Spinner /> : <Upload className="h-4 w-4" />} Upload
        </Button>
      </div>
      <p className="mt-1.5 text-xs text-slate-400">
        The first image is the main photo shown on cards and as the hero. Reorder with the arrows, or set any image as
        main. Add alt text for SEO.
      </p>

      {images.length === 0 ? (
        <div className="mt-3 rounded-lg border border-dashed border-slate-300 bg-slate-50 px-4 py-8 text-center text-sm text-slate-400">
          No images yet. Paste a URL or upload photos.
        </div>
      ) : (
        <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {images.map((img, i) => (
            <div key={`${img.url}-${i}`} className="overflow-hidden rounded-lg border border-slate-200 bg-white">
              <div className="relative aspect-[4/3] bg-slate-100">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={img.url} alt={img.alt || ''} className="h-full w-full object-cover" loading="lazy" />
                {i === 0 && (
                  <span className="absolute left-1.5 top-1.5 inline-flex items-center gap-1 rounded bg-red-600 px-1.5 py-0.5 text-[10px] font-semibold text-white">
                    <Star className="h-2.5 w-2.5 fill-white" /> Main
                  </span>
                )}
              </div>
              <div className="p-2">
                <input
                  value={img.alt || ''}
                  onChange={(e) => setAlt(i, e.target.value)}
                  placeholder="Alt text"
                  className="w-full rounded border border-slate-200 px-2 py-1 text-xs text-slate-700 focus:border-red-400 focus:outline-none"
                />
                <div className="mt-1.5 flex items-center justify-between">
                  <div className="flex gap-0.5">
                    <button
                      type="button"
                      onClick={() => move(i, -1)}
                      disabled={i === 0}
                      className="rounded p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-700 disabled:opacity-30"
                      aria-label="Move earlier"
                    >
                      <ArrowLeft className="h-3.5 w-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => move(i, 1)}
                      disabled={i === images.length - 1}
                      className="rounded p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-700 disabled:opacity-30"
                      aria-label="Move later"
                    >
                      <ArrowRight className="h-3.5 w-3.5" />
                    </button>
                    {i !== 0 && (
                      <button
                        type="button"
                        onClick={() => setMain(i)}
                        className="rounded p-1 text-slate-400 hover:bg-slate-100 hover:text-red-600"
                        aria-label="Set as main"
                      >
                        <Star className="h-3.5 w-3.5" />
                      </button>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={() => removeAt(i)}
                    className="rounded p-1 text-slate-400 hover:bg-red-50 hover:text-red-600"
                    aria-label="Remove image"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
