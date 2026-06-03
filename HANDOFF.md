# Mit-Mak Motors — Session Handoff

Everything a fresh session needs to continue this build. Last updated end of the build/polish/deploy session.

---

## 1. TL;DR

- **What:** Awwwards-level redesign of **Mit-Mak Motors** (premium pre-owned dealership, Pretoria, South Africa).
- **Project path:** `/Users/jordanmarcus/mit-mak-motors`
- **Live (production):** https://mit-mak-motors.vercel.app
- **GitHub:** https://github.com/kz2ptgfkzb-design/mit-mak-motors (branch `main`)
- **Stack:** Next.js 14.2.35 (App Router) · TypeScript · Tailwind · Framer Motion · Lenis · GSAP/ScrollTrigger · React Three Fiber (now unused, see §8) · lucide-react.
- **State:** Fully built, real inventory loaded, deployed & verified. Working tree clean. 5 commits.
- **Node:** v24 · **npm:** v11.

## 2. Run / build / deploy

```bash
cd /Users/jordanmarcus/mit-mak-motors
npm install           # if node_modules missing
npm run dev           # http://localhost:3000 (or --port 3040 via preview)
npm run build         # production build — must stay green (433 static pages)
npm start             # serve the build
```

> **Gotcha:** the Bash shell's cwd sometimes resets to `/Users/jordanmarcus`. Always `cd` into the project first, or use `npm --prefix /Users/jordanmarcus/mit-mak-motors ...`.

**Preview tool:** `~/.claude/launch.json` has a config named **`mitmak`** (`npm --prefix … run dev --port 3040`, autoPort). Use `preview_start({name:"mitmak"})`.

**Deploy (Vercel CLI, no git integration yet):**
```bash
npx -y vercel@latest deploy --prod --yes --scope jordan-marcus-projects --token=<VERCEL_TOKEN>
```
- Vercel team/scope: **`jordan-marcus-projects`**; project **`mit-mak-motors`**; production alias **mit-mak-motors.vercel.app**.
- `--scope` is REQUIRED (non-interactive CLI won't pick a default team).
- Deploy is via CLI upload — **GitHub↔Vercel auto-deploy is NOT connected yet** (see §7).

**GitHub push** (token via credential helper so it never lands in `.git/config`):
```bash
git -c credential.helper='!f(){ echo username=x-access-token; echo "password=$GH"; }; f' push origin main
```
(`export GH=<github_pat>` first.)

> **Tokens:** A GitHub PAT and a Vercel token were provided inline last session and should be **revoked**. A new session needs fresh tokens to push/deploy.

## 3. Commit history

```
66487d8  Add premium site loader + neater quick-actions
33e23dd  Polish: BMW M4 hero, FOMO Zone in nav, racing-trail cursor, no particles
d4e4679  Design refinements: real logo, Porsche hero, no red bar, human copy
7e01c7c  Import live Mit-Mak inventory (401 real vehicles) with per-car mapped images
f094bc3  Initial commit: Mit-Mak Motors — Awwwards-grade dealership site
```

## 4. What's built (all live)

**Pages:** Home, Showroom (`/showroom`), Vehicle detail (`/vehicles/[slug]`, 401 SSG), Finance + Business Finance, Sell Your Car, About, Contact (6 branches + map), FOMO Zone, Blog + posts, Newsletter, Staff, Careers, Referrals, Feedback (compliment/complaint), Privacy, Terms, custom 404.

**Signature features:**
- **Premium loader** (`components/home/ignition-intro.tsx`, rendered in `app/layout.tsx`): official logo + breathing red glow + framer progress sweep + tagline + curtain-lift. Once per session (`sessionStorage 'mm-loaded'`), reduced-motion-safe. Logo is a plain `<img>` (not next/image) so it always paints.
- **Home hero** (`components/home/hero.tsx`): high-quality **BMW M4** image (Unsplash `photo-1580273916550-e323be2ae537`), headline "TRUSTED. AWARDED. UNMATCHED." with text-shadow, rev gauge, "Now in showroom" tag → real BMW M4 (`heroVehicle`). No floating particles. No top red bar.
- **Scroll-story** (`brand-pillars.tsx`): pinned, count-up metrics, chevron progress fill. **GSAP scroll-marquee** (`scroll-marquee.tsx`). **Draggable featured carousel**. **Awards marquee**. **Testimonials**. **FOMO teasers**.
- **Showroom:** sticky advanced filter bar (make/model/body/drive/fuel/transmission/price/year/mileage/keyword), grid+list, sort, animated skeletons, **compare up to 4** (side-by-side drawer), **pagination (24/page)**.
- **Vehicle detail:** gallery + lightbox + 360° spin, full spec grid, sticky action panel (reserve/call/whatsapp/finance), interactive finance calculator, accordion, trust block, related.
- **Forms:** finance (individual+business) & sell — multi-step engine (`components/forms/multi-step-form.tsx`) with progress, validation, save-and-continue, image upload; contact form. POST to `/api/{finance,sell,contact,newsletter}` (mock handlers, see §7).
- **Global:** header (shrink-on-scroll) + mega-menu, footer, cookie banner, **racing-trail cursor** (`custom-cursor.tsx` — standard pointer + red canvas trail), Lenis smooth scroll, scroll progress, **neat bottom-right quick-actions** (uniform circular WhatsApp/Call + tooltips + back-to-top).
- **SEO:** metadata + OpenGraph + JSON-LD (AutoDealer + per-vehicle Car), dynamic `opengraph-image.tsx`, `sitemap.ts`, `robots.ts`. Favicon = `app/icon.png` (real logo).

## 5. Real data (IMPORTANT)

- **401 real vehicles** in `data/vehicles.json` (1.4 MB), scraped from mitmakmotors.co.za `/viewcar/` pages. Images are AutoTrader CDN (`img.autotrader.co.za/<id>/Crop1024x576.jpg`), **mapped per car by construction**.
- **Refresh inventory:** `node scripts/scrape-inventory.mjs` (re-scrapes sitemap → parses specs + galleries → rewrites `data/vehicles.json`). It's resilient (regex-based, entity-decoded, dedup by slug, filters junk/price<10k).
- **Real brand data:** phone `+27 12 546 5878`, 6 real branches (590/591 Gerrit Maritz, 446/450/565/566 Rachel de Beer) in `data/locations.ts`; real logo `public/mit-mak-logo.png` (downloaded from their site).

### Data-layer architecture (don't break this)
- `data/vehicles.ts`: loads `vehicles.json` (full, **server-only**), exposes `getVehicle`, `relatedVehicles`, taxonomy (`allMakes`/`filterMeta`/bounds), `heroVehicle`, and **trimmed projections** `toCard()` / `vehicleCards` / `featuredCards` (images sliced to 2, heavy fields stripped).
- **The 1.4 MB JSON must stay server-side.** Client components (showroom, featured carousel, hero) receive trimmed card data **as props** from server pages — never import `vehicles` into a client component. `id` is set to `slug` (unique React keys).

## 6. Brand system

- Colors: racing **red `#E10600`**, **ink `#0A0A0A`** blacks, white, graphite/chrome accents, neon-red glow. Tailwind theme in `tailwind.config.ts`.
- Fonts (next/font): **Anton** (hero display), **Oswald** (`--font-display`), **Inter** (body).
- Motif: chevron "speed lines" (`components/ui/chevron.tsx`); mountain "MM" → replaced by the real logo image.
- **Copy rule:** NO em-dashes (—) or en-dashes (–) anywhere (AI-tell removal). Use commas/periods/hyphens. Keep any new copy dash-free.

## 7. Open items / next steps

1. **Revoke the GitHub + Vercel tokens** shared last session.
2. **Auto-deploy:** connect the GitHub repo in Vercel → Project → Settings → Git (so every push redeploys). Currently CLI-only.
3. **Custom domain:** add `mitmakmotors.co.za` in Vercel → Settings → Domains.
4. **Forms:** set `FORM_WEBHOOK_URL` (env) to forward submissions to a real CRM/email/Zapier; otherwise `/api/*` just log + echo success (`lib/api.ts`).
5. **Env vars** (all have safe fallbacks — see `.env.example`): `NEXT_PUBLIC_SITE_URL`, `NEXT_PUBLIC_PHONE`, `NEXT_PUBLIC_WHATSAPP`, `FORM_WEBHOOK_URL`, `NEXT_PUBLIC_GOOGLE_MAPS_KEY`.
6. Nice-to-haves: real staff photos (currently monogram avatars), real per-branch phones/coords, Lighthouse pass, swap any remaining Unsplash lifestyle images (blog/fomo/about) for real assets.

## 8. Gotchas for the next agent (read this!)

- **Preview screenshots are unreliable for this site.** The full-screen animating **cursor canvas** + `next/image` in fixed/transformed layers (hero, header logo) often **fail to composite** in `preview_screenshot` (appear black) even though they render fine for real users. To verify: `preview_eval` → `document.querySelectorAll('canvas').forEach(c=>c.remove())` before screenshotting, and **pixel-sample** the image (`drawImage` to a temp canvas) or check `naturalWidth`/DOM rather than trusting the screenshot. Confirmed the site renders via pixel sampling + SSR HTML.
- **Lenis + programmatic scroll:** `window.scrollTo()` can leave reveal-on-scroll wrappers at `opacity:0` (looks black). Real users scrolling naturally are fine. Scroll to top (`y=0`) for hero screenshots.
- **Loader is a ~2.4s once-per-session transient.** To screenshot it: temporarily set its two `setTimeout` delays huge, **restart the dev server fresh** (HMR is stale for this — a fresh server compiles the held-open code), capture, then revert delays to `2350`/`3300`. Clear `sessionStorage 'mm-loaded'` to replay.
- **Tailwind:** `h-13`/`w-13` are NOT valid (no 13 in default scale). Use `h-14`/`w-14`.
- **`reactStrictMode: true`** → effects double-invoke in dev only.
- **Orphaned:** `components/home/hero-scene.tsx` (old R3F particle scene) is no longer imported (particles removed). Safe to delete; `@react-three/fiber` + `three` are now unused deps (kept to avoid churn — remove if you want a lighter install).
- **Next 14 security:** pinned to `^14.2.35` (patched). Don't downgrade.

## 9. File map (key files)

```
app/
  layout.tsx                  root: fonts, metadata, JSON-LD, shell, <IgnitionIntro/> (loader)
  page.tsx                    home (composes hero + sections, passes card props)
  showroom/page.tsx           server: builds card list + filterMeta → <ShowroomClient/>
  vehicles/[slug]/page.tsx    SSG detail (generateStaticParams over 401)
  finance/(page|business)     multi-step finance
  sell-your-car, about, contact, fomo-zone, blog/[slug], newsletter,
  staff, careers, referrals, feedback, privacy, terms, not-found
  api/{finance,sell,contact,newsletter}/route.ts   → lib/api.ts
  opengraph-image.tsx, sitemap.ts, robots.ts, icon.png
components/
  layout/   header, mega-menu, footer, cookie-banner, quick-actions, scroll-progress,
            cta-band, page-hero, logo, newsletter-form
  home/     hero, ignition-intro (loader), brand-pillars, featured-inventory,
            scroll-marquee, awards-marquee, testimonials, fomo-teasers, hero-scene (UNUSED)
  showroom/ showroom-client, filter-bar, vehicle-list-item, vehicle-skeleton, compare-drawer
  vehicle/  vehicle-card, vehicle-gallery, spec-grid, detail-accordion, sticky-action-panel,
            trust-block, related-vehicles, finance-calculator
  finance/  finance-application, finance-extras
  forms/    multi-step-form, form-controls
  contact/  contact-form
  providers/ smooth-scroll (Lenis), custom-cursor (racing trail)
  ui/       button, magnetic, reveal, counter, marquee, section-heading, badge, chevron, prose
data/   vehicles.ts, vehicles.json (401), locations.ts, site.ts, navigation.ts, awards.ts, content.ts
lib/    utils, finance, filters, hooks, api
types/  index.ts (Vehicle model, etc.)
scripts/ scrape-inventory.mjs (live inventory importer)
```

## 10. Suggested first message for a new session

> "Continue the Mit-Mak Motors build at `/Users/jordanmarcus/mit-mak-motors`. Read `HANDOFF.md` first. It's a Next.js 14 dealership site, deployed at mit-mak-motors.vercel.app / github.com/kz2ptgfkzb-design/mit-mak-motors. [Then your task, e.g. 'connect Vercel auto-deploy' / 'add a custom domain' / 'build X page' / 'refresh inventory'.]"
