// On-the-fly image enhancement for AutoTrader-hosted car photos.
//
// AutoTrader serves one fixed master per photo (~1024x768-1440x1080) and ignores
// any size hint in the URL, so we can't pull a sharper original. Instead we route
// each photo through Cloudinary's `fetch` delivery, which fetches the remote image
// and enhances it on the fly: modern format (AVIF/WebP), best quality (removes JPEG
// artifacts), auto color/contrast improvement, sharpening, and sizing to the display
// width. Optionally Cloudinary's generative AI upscaler (paid add-on) for real
// resolution gain.
//
// Gated behind NEXT_PUBLIC_CLOUDINARY_CLOUD: when it is unset (or the URL is not an
// AutoTrader photo) this is a no-op and the original URL is returned unchanged, so
// the live site is identical until Cloudinary is configured.
//
// Setup (one-time):
//   1. Create a free Cloudinary account -> note the "cloud name" (public, not a secret).
//   2. In Cloudinary: Settings -> Security -> enable "Fetched URL" (allow fetch), and
//      optionally restrict allowed fetch domains to img.autotrader.co.za.
//   3. In Vercel: set env var  NEXT_PUBLIC_CLOUDINARY_CLOUD = <your cloud name>
//      (optionally NEXT_PUBLIC_CLOUDINARY_UPSCALE = 1 if you enabled the AI upscale add-on),
//      then redeploy. Every car photo now routes through the enhancer.

const CLOUD = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD;
const UPSCALE = process.env.NEXT_PUBLIC_CLOUDINARY_UPSCALE === '1';
const AUTOTRADER = 'img.autotrader.co.za';

/**
 * Enhance an AutoTrader car photo for display at roughly `width` CSS px (request
 * ~2x for retina sharpness). Returns the original URL unchanged for non-AutoTrader
 * images or when Cloudinary is not configured.
 */
export function carImage(url: string | undefined | null, width = 1280): string {
  if (!url || !CLOUD || !url.includes(AUTOTRADER)) return url ?? '';
  const w = Math.max(64, Math.round(width));
  const transforms = UPSCALE
    ? `e_upscale,e_sharpen:40,w_${w},f_auto,q_auto:best`
    : `e_improve,e_sharpen:60,w_${w},c_limit,f_auto,q_auto:best`;
  return `https://res.cloudinary.com/${CLOUD}/image/fetch/${transforms}/${encodeURIComponent(url)}`;
}
