# Mit-Mak Motors — Awwwards-grade dealership site

An immersive, cinematic, conversion-focused website for **Mit-Mak Motors**, a premium pre-owned car dealership in Pretoria, South Africa.

> **Trusted. Awarded. Unmatched.** — Every car inspected & reconditioned, delivered FREE anywhere in South Africa.

Built with Next.js 14 (App Router), TypeScript, Tailwind CSS, Framer Motion, Lenis, GSAP + ScrollTrigger and React Three Fiber. Fully content-driven from a typed data layer, so real inventory drops straight in.

---

## ✨ Highlights

- **The "Driver's Seat" hero** — cinematic full-viewport reveal with an ignition intro, a React Three Fiber ambient 3D scene, mouse-parallax car, staggered char-reveal headline and an engine-rev micro-interaction.
- **Scroll-driven storytelling** — a pinned, scroll-scrubbed brand-pillars scene with count-up metrics and chevron "speed-line" progress that fills as you scroll.
- **Functional showroom** — sticky advanced filters (make, model, body type, drive, fuel, transmission, price, year, mileage, keyword), grid/list toggle, sort, animated skeletons, and a compare-up-to-4 side-by-side drawer.
- **Rich vehicle detail** — gallery + lightbox with thumbnail rail and a 360° spin teaser, full spec grid, sticky action panel, an interactive finance calculator (deposit / term / interest / balloon), accordion and related vehicles.
- **Multi-step forms** — finance (individual + business) and sell-your-car flows with a progress indicator, validation, save-and-continue and image upload.
- **Every page** — Home, Showroom, Vehicle Detail, Finance, Business Finance, Sell Your Car, About, Contact (6 locations + map), FOMO Zone, Blog (+ posts), Newsletter, Staff, Careers, Referrals, Compliment/Complaint, Privacy, Terms.
- **Production-ready** — SEO metadata + OpenGraph + JSON-LD, dynamic OG image, sitemap & robots, custom 404, `prefers-reduced-motion` support, semantic HTML and WCAG-minded contrast/focus states.

## 🧱 Tech stack

| Concern | Choice |
| --- | --- |
| Framework | Next.js 14 (App Router) + TypeScript |
| Styling | Tailwind CSS (custom brand theme) |
| Animation | Framer Motion (orchestration), GSAP + ScrollTrigger (scroll scenes) |
| Smooth scroll | Lenis |
| 3D | React Three Fiber + three.js (hero scene) |
| Icons | lucide-react |
| Images | `next/image` (Unsplash placeholders) |

## 🚀 Getting started

```bash
# 1. Install dependencies
npm install

# 2. (optional) configure env
cp .env.example .env.local   # everything has sensible fallbacks

# 3. Run the dev server
npm run dev                  # http://localhost:3000

# 4. Production build
npm run build && npm start
```

Requires **Node 18.17+** (developed on Node 24).

## 🔑 Environment variables

All optional — the site runs with none set. See [`.env.example`](.env.example).

| Variable | Purpose |
| --- | --- |
| `NEXT_PUBLIC_SITE_URL` | Canonical URL for metadata, OpenGraph, sitemap & robots |
| `NEXT_PUBLIC_PHONE` | Phone number (header, footer, quick-actions) |
| `NEXT_PUBLIC_WHATSAPP` | WhatsApp number in international format, e.g. `27600000000` |
| `FORM_WEBHOOK_URL` | Where form submissions POST. Leave blank to use the built-in mock handlers |
| `NEXT_PUBLIC_GOOGLE_MAPS_KEY` | Optional Maps Embed key (a keyless embed is used by default) |

## 📁 Project structure

```
app/                 # App Router pages, route handlers, sitemap/robots/OG
  api/               # Form endpoint placeholders (finance, sell, contact, newsletter)
  vehicles/[slug]/   # Dynamic vehicle detail (SSG)
  blog/[slug]/       # Dynamic blog post (SSG)
components/
  layout/            # Header, mega-menu, footer, cookie banner, quick-actions, cta-band
  home/              # Hero, 3D scene, brand pillars, featured carousel, awards, etc.
  showroom/          # Filter bar, grid/list, compare drawer, skeletons
  vehicle/           # Card, gallery, spec grid, finance calculator, action panel
  forms/             # Reusable multi-step form engine + controls
  ui/                # Buttons, chevrons, reveals, counters, marquee, prose…
data/                # ← Typed content layer (vehicles, locations, nav, awards, content)
lib/                 # utils, finance math, filters, hooks, api helper
types/               # The content model (single source of truth)
```

## 🔁 Swapping in real inventory

The whole site is driven by [`data/`](data). The showroom ships pre-loaded with the **real, live Mit-Mak inventory** — 401 vehicles, ~30 real photos each — imported from mitmakmotors.co.za and mapped to the correct car.

**Refresh live stock anytime:**

```bash
node scripts/scrape-inventory.mjs   # re-scrapes /viewcar/ listings → data/vehicles.json
```

It reads their sitemap, parses every listing's specs + AutoTrader-hosted gallery, and writes [`data/vehicles.json`](data/vehicles.json). To customise:

1. **Vehicles** — regenerate via the script, or hand-edit [`data/vehicles.json`](data/vehicles.json) (typed by `Vehicle` in [`types/index.ts`](types/index.ts)). Each `images` array holds the full gallery (the detail page supports 30+). Filters, sort, compare, related, sitemap and JSON-LD update automatically. The showroom paginates (24 at a time) so it scales to hundreds of cars; the 1.5 MB dataset stays server-side and only lightweight card data reaches the client.
2. **Locations** — edit [`data/locations.ts`](data/locations.ts) (addresses, phones, coordinates).
3. **Branding / contact** — edit [`data/site.ts`](data/site.ts) (name, phone, WhatsApp, hours, socials).
4. **Navigation & FOMO Zone** — edit [`data/navigation.ts`](data/navigation.ts).
5. **Blog & staff** — edit [`data/content.ts`](data/content.ts).

> **CMS-ready:** because everything is typed and isolated in `data/`, you can replace these arrays with a fetch from a CMS/DMS (Sanity, Contentful, a feed, etc.) without touching any component — just return the same shapes.

### Wiring up the forms

The finance, sell, contact and newsletter forms POST to `/api/*` route handlers. They currently log + echo success. Set `FORM_WEBHOOK_URL` to forward every submission (as JSON) to your CRM, email service or a Zapier/Make webhook. See [`lib/api.ts`](lib/api.ts).

## ☁️ Deployment (GitHub + Vercel)

### 1. Push to GitHub

```bash
git init                      # already initialised if you cloned this
git add -A
git commit -m "Initial commit: Mit-Mak Motors"

# create the repo and push (requires the GitHub CLI, authenticated)
gh repo create mit-mak-motors --public --source=. --remote=origin --push
# …or add a remote you created in the GitHub UI:
git remote add origin https://github.com/<you>/mit-mak-motors.git
git push -u origin main
```

### 2. Deploy on Vercel

**Dashboard (easiest):** go to [vercel.com/new](https://vercel.com/new), import the GitHub repo, accept the detected Next.js settings, add any env vars, and **Deploy**.

**CLI:**

```bash
npm i -g vercel
vercel            # preview deploy + link project
vercel --prod     # production deploy
```

Add the environment variables above in **Vercel → Project → Settings → Environment Variables**. No build configuration is needed — Vercel auto-detects Next.js.

## ♿ Accessibility & performance

- `prefers-reduced-motion` disables smooth scroll, the custom cursor, the intro and scroll animations.
- Semantic landmarks, skip-to-content link, keyboard-focusable controls and visible focus rings.
- `next/image` (AVIF/WebP), `next/font` self-hosting, lazy map iframe, and the 3D hero scene is a deferred client-only chunk so it never blocks first paint.
- High-contrast dark theme tuned for WCAG AA body text.

## 🎨 Brand system

- **Racing red** `#E10600` · **deep blacks** `#0A0A0A` · crisp white · metallic graphite accents · neon-red hover glow.
- **Display:** Oswald (condensed) + Anton (hero). **Body:** Inter.
- **Motif:** chevron "speed lines" as dividers, accents and the scroll-progress indicator; the mountain "MM" mark.

## 📝 Notes

- Sample inventory (12 vehicles), staff, branches and copy are realistic placeholders for demonstration. Vehicle imagery uses Unsplash stock — **replace with real photography before launch** and confirm licensing.
- Legal pages (Privacy/Terms) are sample content and should be reviewed by a professional.

---

Built as a production-ready foundation — fast, confident, premium, and impossible to ignore.
