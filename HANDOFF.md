# Mit-Mak Motors — Session Handoff

Everything a fresh session needs to continue this build. Updated end of the "finder + FOMO pages + QA/polish" session.

---

## 0. READ FIRST — current state in one breath

- **Live (public, share this):** https://mit-mak-motors.vercel.app — fully deployed, smooth, QA'd.
- **⚠️ All of this session's work is UNCOMMITTED.** It lives in the working tree only. The live site is **ahead of git**. See §3. First thing a new session should consider: commit + push.
- **✅ Vercel CLI is still logged in** (`kz2ptgfkzb-design`, scope `jordan-marcus-projects`). You can deploy with **no token** (see §2). The old note about "revoke tokens / need fresh ones to deploy" no longer blocks deploys — the CLI login session is valid.
- **Build:** `npm run build` must stay green — now **437 static pages** (was 433; +4 FOMO detail pages).

## 1. TL;DR

- **What:** Awwwards-level site for **Mit-Mak Motors** (premium pre-owned dealership, Pretoria, SA).
- **Path:** `/Users/jordanmarcus/mit-mak-motors`
- **Live:** https://mit-mak-motors.vercel.app (production alias — **public**). Per-deploy hashed URLs are Vercel-auth protected (401 for anyone not on the team) — never share those.
- **GitHub:** https://github.com/kz2ptgfkzb-design/mit-mak-motors (branch `main`) — **behind**: 3 unpushed commits + this whole session uncommitted.
- **Stack:** Next.js 14.2.35 (App Router) · TS · Tailwind · Framer Motion · Lenis · GSAP/ScrollTrigger · lucide-react. **Removed this session:** `@react-three/fiber` + `three` (were unused).
- **Node** v24 · **npm** v11.

## 2. Run / build / deploy

```bash
cd /Users/jordanmarcus/mit-mak-motors      # ALWAYS cd first — cwd resets to home between shell calls
npm install                                # if node_modules missing / after dep changes
npm run dev                                # http://localhost:3000 (preview uses 3040)
npm run build                              # must stay green (437 pages)
```

> **Gotcha (important):** `npx tsc` from the home dir installs a BOGUS `tsc` package. Type-check with the local binary: `./node_modules/.bin/tsc --noEmit`.

**Deploy (Vercel CLI — already authenticated, no token needed):**
```bash
npx -y vercel@latest deploy --prod --yes --scope jordan-marcus-projects
```
- Auto-aliases to **mit-mak-motors.vercel.app**. `--scope` required. GitHub↔Vercel auto-deploy still NOT connected (CLI upload deploys the working tree, including uncommitted changes).
- Verify a deploy: `curl -s -o /dev/null -w "%{http_code}" https://mit-mak-motors.vercel.app`.

**GitHub push** (token via credential helper so it never lands in `.git/config`):
```bash
export GH=<github_pat>
git -c credential.helper='!f(){ echo username=x-access-token; echo "password=$GH"; }; f' push origin main
```

**Preview tool:** `preview_start({name:"mitmak"})` runs `npm run dev` on :3040. The preview browser is **sandboxed to localhost** — `location.href = 'https://...'` reverts; you can't point it at the live site.

## 3. Git state — ⚠️ UNCOMMITTED WORK

`HEAD` = `5466aa7` (Add HANDOFF.md). Branch `main` is **3 commits ahead of origin** AND the entire current session is **uncommitted in the working tree**.

**This session's uncommitted changes:**
- *Modified:* `app/{page,showroom/page,fomo-zone/page}.tsx`, `components/home/{hero,brand-pillars}.tsx`, `components/layout/{header,page-hero,quick-actions,cta-band}.tsx`, `components/showroom/{showroom-client,filter-bar}.tsx`, `components/vehicle/vehicle-card.tsx`, `data/{vehicles,navigation}.ts`, `next.config.mjs`, `package.json`, `package-lock.json`. *Deleted:* `components/home/hero-scene.tsx`.
- *New (untracked):* `app/fomo-zone/[slug]/page.tsx`, `components/home/quick-search.tsx`, `components/showroom/car-finder.tsx`, `components/ui/body-type-icons.tsx`, `data/fomo.ts`, `public/body-types/*.svg` (8), `public/masterclass-badge.png`.

> Nothing is lost by starting fresh — it's all on disk. But it's **not in git**. Recommended new-session step #1: `git add -A && git commit` then push (needs a PAT). Then connect Vercel↔GitHub auto-deploy.

## 4. What's built / changed THIS session (all live, all uncommitted)

1. **"Find Your Perfect Car" finder** (`components/showroom/car-finder.tsx`) — reusable: Type / Make / Model / Variant / Max-Price dropdowns (dependent: make→model→variant) + a body-style shortcut icon row + red Search.
   - **Home:** `components/home/quick-search.tsx` wraps it (heading "FIND YOUR **PERFECT** CAR", a darkened showroom-cars backdrop image) → builds `/showroom?type=&make=&model=&q=&maxPrice=` and routes there.
   - **Showroom:** `showroom-client.tsx` renders it above the sticky `FilterBar`, driving the live filters via `finderSearch` (a chosen Variant rides in as the `q` keyword so it shows/clears in the search box).
   - **Deep-link seeding** in `app/showroom/page.tsx` (`type`/`make`/`model`/`q`/`maxPrice`).
   - **Body-type icons** (`components/ui/body-type-icons.tsx`): the REAL white filled-silhouette SVGs lifted from mitmakmotors.co.za, saved in `public/body-types/{sedan,coupe,suv,hatchback,cabriolet,single-cab,extended-cab,double-cab}.svg`, rendered as `<img>`. (Source site mislabels Hatchback as "Hatcback"; cab SVGs had no fill so root `fill="#ffffff"` was injected.)
   - Data: `variantsByMakeModel` added to `data/vehicles.ts` + `filterMeta` (and the `FilterMeta` interface in `filter-bar.tsx`).
2. **Hero rev gauge** (`components/home/hero.tsx` → `HeroRev`) — a **digital G82-style cluster**: curved arc rev bar, **BMW M tricolour** shift-lights (blue→violet→red) + arc gradient, rpm tick scale, an M tricolour stripe, digital `X1000` readout. Throttle-blip on hover/click. **NO SOUND** (the synth + `lib/rev-sound.ts` + `public/sounds/` were removed on request). **Impl notes:** driven by a manual `requestAnimationFrame` tween (framer's imperative `animate()` on a motion value did NOT drive anything in this setup); the marker rotates via the SVG `transform` attribute (framer `style={{ rotate }}` produced no transform on the `<line>`).
3. **FOMO Zone landing pages** — `app/fomo-zone/[slug]/page.tsx` (SSG over `data/fomo.ts`: `raffle`, `auction`, `merch`, `masterclass`). Each = `PageHero` + feature (image + primary CTA → external, new tab) + blocks grid + `CtaBand`. Content mirrors the real external sites. **External targets:** raffle → `raffles.mitmakmotors.co.za/product/pologti-lv-his-hers/`, auction → `www.mitmakmotors.co.za/auction/`, merch → `merch.mitmakmotors.co.za/`, masterclass → `courses.mitmakmasterclass.co.za/`. All internal FOMO links (home teasers, `mega-menu`, `footer`, `/fomo-zone` overview) now route to `/fomo-zone/{slug}`. `CtaBand` gained an optional `external` flag on its links (opens new tab).
4. **Header** (`components/layout/header.tsx`) — **transparent at the top** (blends into the hero; previously a darkening gradient band caused a visible "line"). On scroll it still gets its solid bg. Added the **Masterclass badge** (`public/masterclass-badge.png`, pulled from their site) beside the logo → links to `courses.mitmakmasterclass.co.za` (new tab).
5. **PageHero** (`components/layout/page-hero.tsx`) — optional `image` prop (darkened backdrop + legibility gradients). Enabled only on the **showroom** hero.
6. **Quick-actions** (`components/layout/quick-actions.tsx`) — removed the floating WhatsApp + phone (they're in the header); only **back-to-top** remains (routes via Lenis).
7. **Hero backdrop / gradient** — home hero top gradient deepened (`/25 → /45`) for nav legibility after the header went transparent. The home finder section has a showroom-cars backdrop image.
8. **QA / polish pass** — showroom finder scroll + back-to-top now use **Lenis** (`useLenis()` from `lenis/react`) instead of native smooth-scroll (no fight/stutter); `will-change` added to the `vehicle-card` tilt + `brand-pillars` crossfade; removed dead `hero-scene.tsx` + `three`/`@react-three/fiber` deps + `transpilePackages`; trimmed oversized Unsplash `w` params. Verified: tsc clean, build green (437), zero console errors across home/showroom/FOMO/vehicle-detail.

## 5. Carried over from earlier (still true)

- **401 real vehicles** in `data/vehicles.json` (1.4 MB, server-only). Refresh: `node scripts/scrape-inventory.mjs`. Real phone `+27 12 546 5878`, 6 branches (`data/locations.ts`), real logo `public/mit-mak-logo.png`.
- **Data-layer rule (don't break):** the full `vehicles`/`vehicles.json` is server-only. Client components get trimmed `toCard()`/`vehicleCards`/`featuredCards`/`filterMeta` as props (images sliced to 2). Never `import { vehicles }` into a `'use client'` file.
- **Brand:** racing red `#E10600`, ink blacks, white, graphite. Fonts: Anton (hero), Oswald (`--font-display`), Inter (body). **Copy rule:** NO em-dashes (—) / en-dashes (–) anywhere (hyphens fine).
- Premium loader (`ignition-intro.tsx`), BMW M4 hero, racing-trail cursor, smooth scroll (Lenis), SEO (metadata/OG/JSON-LD/sitemap/robots).

## 6. Gotchas for the next agent (READ)

- **cwd resets to home** between Bash calls → prefix every shell call with `cd /Users/jordanmarcus/mit-mak-motors &&`. Type-check with **`./node_modules/.bin/tsc --noEmit`** (a bare `npx tsc` from home pulls a bogus package).
- **Changing deps?** Run `npm install` to sync `package-lock.json`, or Vercel's `npm ci` fails on lockfile mismatch.
- **Preview screenshots are unreliable** (the §8 trap): `next/image`, the cursor canvas, and SVGs with filters/transforms composite **black** in headless screenshots. Verify instead by: removing canvases + **pixel-sampling** (draw to a canvas, `getImageData`) or DOM/HTML/`curl` checks. The preview browser is **sandboxed to localhost** (can't navigate to the live site).
- **`requestAnimationFrame` is throttled in the headless preview** (page not foregrounded) → rAF-driven motion (the rev gauge, Lenis `scrollTo`) and any audio **cannot be observed/measured** there. They work for real users — verify the *logic + endpoints*, not the motion. Confirm visuals live in a real browser.
- **framer-motion `useScroll`** emits a dev-only "container has a non-static position" warning — **stripped from production**, harmless.
- **Deploy = working-tree upload.** `vercel deploy` ships whatever's on disk (incl. uncommitted changes), so the live site can diverge from git.
- Tailwind: `h-13`/`w-13` invalid. Next 14 pinned `^14.2.35` (patched) — don't downgrade.

## 7. Open items / next steps

1. **⚠️ Commit + push** this session's work (see §3) — needs a GitHub PAT. Live is ahead of git.
2. **The "major add-ins"** the owner has planned (this is why they wanted a fresh session).
3. **Connect GitHub↔Vercel auto-deploy** (Vercel → Project → Settings → Git) so pushes redeploy.
4. **Custom domain** `mitmakmotors.co.za` (or `demo.` subdomain) — Vercel → Settings → Domains.
5. **Forms:** set `FORM_WEBHOOK_URL` to forward `/api/{finance,sell,contact,newsletter}` to a real CRM/Zapier (`lib/api.ts` currently logs + echoes success).
6. Optional polish: lazy-load GSAP (~50 KB off the homepage initial JS, slight hydration-timing change); real raffle/merch imagery + the **raffle ticket price** on `/fomo-zone/raffle`; real staff photos; Lighthouse pass.

## 8. File map (key + new)

```
app/
  layout.tsx, page.tsx (home: Hero + QuickSearch + ...), template.tsx
  showroom/page.tsx                     server: cards + filterMeta + URL seeding → ShowroomClient (+ PageHero image)
  vehicles/[slug]/page.tsx              SSG detail (401)
  fomo-zone/page.tsx                    overview hub (cards → detail pages)
  fomo-zone/[slug]/page.tsx             NEW: 4 themed landing pages (raffle/auction/merch/masterclass)
  finance, sell-your-car, about, contact, blog/[slug], staff, careers, referrals, feedback, newsletter, privacy, terms, not-found
  api/{finance,sell,contact,newsletter}/route.ts → lib/api.ts
  opengraph-image.tsx, sitemap.ts, robots.ts, icon.png
components/
  layout/   header (transparent-top + masterclass badge), page-hero (optional image prop), footer,
            mega-menu, quick-actions (back-to-top only), scroll-progress, cta-band (external links), logo, newsletter-form
  home/     hero (+ HeroRev digital gauge), quick-search (NEW), brand-pillars, featured-inventory,
            scroll-marquee, awards-marquee, testimonials, fomo-teasers  [hero-scene.tsx DELETED]
  showroom/ showroom-client (CarFinder + Lenis scroll), car-finder (NEW), filter-bar, vehicle-list-item, vehicle-skeleton, compare-drawer
  vehicle/  vehicle-card (will-change tilt), vehicle-gallery, spec-grid, detail-accordion, sticky-action-panel, trust-block, related-vehicles, finance-calculator
  ui/       body-type-icons (NEW: <img> → public/body-types/*.svg), button, magnetic, reveal, counter, marquee, section-heading, badge, chevron, prose
  providers/ smooth-scroll (Lenis), custom-cursor (racing trail)
data/   vehicles.ts (+variantsByMakeModel), vehicles.json (401), fomo.ts (NEW), navigation.ts (FOMO hrefs → /fomo-zone/{slug}), locations.ts, site.ts, awards.ts, content.ts
public/ body-types/*.svg (8, NEW), masterclass-badge.png (NEW), mit-mak-logo.png
lib/    utils, finance, filters, hooks, api      [rev-sound.ts DELETED]
```

## 9. Suggested first message for the new session

> "Continue the Mit-Mak Motors build at `/Users/jordanmarcus/mit-mak-motors`. Read `HANDOFF.md` first (note §0 + §3: all the last session's work is uncommitted and the Vercel CLI is already logged in, so deploys need no token). It's a Next.js 14 dealership site, live at https://mit-mak-motors.vercel.app. First, commit + push the working tree so git matches what's live [give me a GitHub PAT, or do it yourself if you have one]. Then: [the major add-ins]."
