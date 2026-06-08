# Mit-Mak Motors — Session Handoff

Everything a fresh session needs to continue. Updated end of the "full-site build + image/mobile/black-space fixes" session.

---

## 0. READ FIRST — state in one breath

- **Our build (public, share this):** https://mit-mak-motors.vercel.app — fully deployed & current.
- **The REAL company site is https://www.mitmakmotors.co.za** — a WordPress/Elementor site behind Cloudflare. It is NOT our build; it is the reference we mirror. (Our build is the Next.js app on vercel.app.) Chrome can open co.za but BLOCKS vercel.app (see §6).
- **Everything is committed + pushed + LIVE.** `main` == `origin/main`. The home **black-space fix (`a1fca3d`) is committed, pushed, and DEPLOYED** — verified by the blur data-URI (37×) + `bg-ink-700` markers in the live home HTML. Remaining on it: a human eyeball scroll-through, since tooling can't screenshot the live deploy (§6).
- **Social reroutes FIXED (`data/site.ts`):** the footer/mega-menu/contact social links now point to the real Mit-Mak profiles — FB `/MitMakMotors`, IG `/mitmakmotors`, YouTube `@MitMakMasterclass`, TikTok `@mitmakmotors`, X `mit_mak_motors` — matched 1:1 against the real co.za footer. (Previously they were placeholder bare domains, e.g. `https://facebook.com`.)
- **Menu redesign + full polish shipped (latest session):** the mega-menu now has a hover/focus "showroom" preview rail (cross-fade, reduced-motion-safe) + a **Customer Care care-pill surfacing Compliment/Complaint (`/feedback`) in the menu** (also added to the megaMenu Company column); proper dialog semantics + focus trap + focus-return; richer link hover + active-page cue; WhatsApp Button in the menu bottom bar; md-breakpoint fix; one-tap call button on phones. Perf: cursor rAF parks when idle/hidden, marquees pause off-screen, BrandPillars re-render guard + no permanent will-change, intro unlocks scroll ~1s sooner. Images: dark blur placeholders across secondary pages (AutoTrader stays `unoptimized`). Removed 2 orphaned `/fomo-zone/{merch,masterclass}` detail routes (content lives at `/merch` + `/masterclass`). SEO: vehicle BreadcrumbList + UsedCondition JSON-LD, blog publisher/dateModified, sitemap +/compare,/merch,/masterclass. Built via audit + design + adversarial-review workflows.
- **Build must stay green.** `npm run build` compiles all routes.
- ⛔ **Don't share the long `mit-mak-motors-…-jordan-marcus-projects.vercel.app` URLs** — those require a Vercel login (per-deploy protection). The short alias above is public.

## 1. TL;DR

- **What:** Awwwards-level site for **Mit-Mak Motors** (premium pre-owned dealership, Pretoria, SA) + the UB Drip merch store + the Mit-Mak Masterclass, all self-contained.
- **Path:** `/Users/jordanmarcus/mit-mak-motors`
- **GitHub:** https://github.com/kz2ptgfkzb-design/mit-mak-motors (branch `main`). Push works via the **macOS keychain credential** for `kz2ptgfkzb-design` — **no PAT needed** (`git push origin main` just works).
- **Stack:** Next.js 14.2.x (App Router) · TS · Tailwind · Framer Motion · Lenis · lucide-react. Node v24 · npm v11.
- **Brand:** racing red `#E10600`, ink blacks (`bg-ink-950/900/850/800`), white, graphite. Fonts: Anton (hero), Oswald (`font-display`), Inter. **Copy rule: NO em-dashes (—) / en-dashes (–) anywhere; hyphens + middot (·) fine.**

## 2. Run / build / deploy

```bash
cd /Users/jordanmarcus/mit-mak-motors      # ALWAYS cd first — cwd resets to home between shell calls
npm install                                # if node_modules missing
npm run dev                                # localhost:3000 (preview tool uses :3040)
./node_modules/.bin/tsc --noEmit           # type-check (a bare `npx tsc` from home pulls a BOGUS package)
npm run build                              # must stay green
```

**Push** (keychain credential, no token): `git push origin main`

**Deploy (Vercel CLI, already authenticated — no token):**
```bash
npx -y vercel@latest deploy --prod --yes --scope jordan-marcus-projects
```
- Auto-aliases to **mit-mak-motors.vercel.app**. Uploads the working tree (so the live site = whatever's on disk at deploy time, committed or not). Verify: `curl -s -o /dev/null -w "%{http_code}" https://mit-mak-motors.vercel.app`.
- GitHub↔Vercel auto-deploy is NOT connected (still a manual CLI deploy).

## 3. Git state — clean (all shipped)

`main` == `origin/main`. All work is committed + pushed + deployed. Recent:
- `a1fca3d` — home black-space fix (blur placeholders + reveal threshold). **LIVE.**
- this session — social-link reroute fix in `data/site.ts` + this HANDOFF update.

Standard ship loop (deploy uploads the working tree, so commit first):
```bash
cd /Users/jordanmarcus/mit-mak-motors
git add -A && git commit -m "..."
git push origin main
npx -y vercel@latest deploy --prod --yes --scope jordan-marcus-projects
```

## 4. The home "black spaces on scroll" fix (what it does — VERIFY LIVE)

Diagnosed (parallel workflow) → two root causes of dark gaps while scrolling the dark-theme home page:
1. **Unoptimized vehicle-card images flashed their near-black container** before loading (the recent AutoTrader `unoptimized` change removed blur placeholders).
2. **The shared `Reveal` threshold** (`amount: 0.3`; `RevealText` `0.5`) left tall blocks stuck at `opacity:0` over the dark bg on fast scroll / over-tall sections.

The staged fix:
- **`lib/blur.ts`** — a tiny dark (#16161a) blur-placeholder data URI. Added `placeholder="blur" blurDataURL={BLUR}` to every lazy/unoptimized image: vehicle cards, brand-pillars (desktop crossfade + mobile), quick-search backdrop, fomo teasers, cta band, hero (main + inset). Images now fade in from a dark tile, never pure black.
- `vehicle-card` container `bg-ink-800` → `bg-ink-700`; `brand-pillars` sticky stage given a `bg-ink-950` base + `priority` on the first crossfade image.
- `reveal.tsx`: `amount 0.3 → 0.01`, `RevealText 0.5 → 0.2` so content always reveals (no permanently-invisible blocks).
- **Still to verify (couldn't headless-test — see §6):** a real **scroll-through of the live home on desktop + mobile** to confirm zero black flashes. This is the single manual check before managers view.

## 5. What's built / changed THIS session (all committed + live unless noted)

1. **/compare** — dedicated page: search/select up to 4 cars, side-by-side spec table, shareable `?ids=`. Nav/footer "Compare" → `/compare`.
2. **King Price Insurance form** on `/finance` (left column, `#insurance` anchor) — real fields + Terms/Consent legal copy. `/api/insurance`.
3. **Nav prune** — removed SUVs & Bakkies from mega-menu + footer.
4. **/about rebuilt** — premium alternating "The Mit-Mak Standard" series (6 sections) using real inventory cars; "We are looking forward to seeing you" branches block; finance CTAs.
5. **Branch vs location wording** — site says **3 branches** (showrooms) on About but **6 locations** (footer/contact). `data/locations.ts` has the real 6 (590/591 Gerrit Maritz; 446/450/565/566 Rachel de Beer). (An earlier over-trim to 3 was reverted.)
6. **/staff** — full premium directory: **130 real people across 21 departments**, leadership featured, headcount strip. Real headshots in `public/staff` (`scripts/fetch-staff.mjs`). Hero image added.
7. **/referrals, /careers, /feedback** — rebuilt from the real site: referral form, the one real job (Sales Executive / CRM / Mechanic) + CV-upload apply form, compliment/complaint form. New `/api/{referral,careers,feedback}`.
8. **/merch** — self-contained premium store: 80 real UB Drip products (`scripts/fetch-merch.mjs`, `data/merch.ts`, images in `public/merch`), category filter pills, click → **product modal (sizes/colours/qty) → local bag drawer** with "checkout coming soon". **No external reroute.**
9. **/masterclass** — self-contained premium page from courses.mitmakmasterclass.co.za: hero, credentials, Bobby Petkov instructor (reuses his staff headshot), curriculum, 6 programmes + register-interest form (`/api/masterclass`). **No external reroute.** Header badge + nav + footer + FOMO all repoint here.
10. **Hero image on every PageHero page** (16 pages) — real inventory cars (apparel shot for merch). `PageHero` conditionally `unoptimized` for AutoTrader src.
11. **Mobile fix** — `BrandPillars` was a 400vh scroll-pinned crossfade (desktop); now `lg:hidden` mobile gets a stacked card layout (killed the long dark dead-scroll on phones).
12. **Vehicle images** — AutoTrader's CDN intermittently **502'd Vercel's image optimizer** (~2.5% = "missing images"). All AutoTrader `<Image>` set to **`unoptimized`** → load direct (all 9769 URLs are 200). Local staff/merch + Unsplash keep optimization (verified ~48KB WebP).
13. **Home black-space fix** (committed `a1fca3d`, deployed + live) — see §4.
14. **Social-link reroute fix** — `data/site.ts` socials repointed from placeholder bare domains (`https://facebook.com`, etc.) to the real Mit-Mak profiles: FB `/MitMakMotors`, IG `/mitmakmotors`, YouTube `@MitMakMasterclass`, TikTok `@mitmakmotors`, X `mit_mak_motors`. Added **X** (was missing) and matched order to the real co.za footer. Rendered in footer, mega-menu, and contact page.

## 6. Gotchas for the next agent (READ — these cost hours)

- **cwd resets to home between Bash calls** → prefix shell calls with `cd /Users/jordanmarcus/mit-mak-motors &&`. Type-check with **`./node_modules/.bin/tsc --noEmit`** (bare `npx tsc` from home installs a bogus package).
- **The preview tool (`preview_start`, :3040) is SANDBOXED:** it reverts sub-route navigation back to `/` (can only reliably show the home page) AND `next/image` composites **BLACK** in its headless screenshots. So **screenshots are NOT reliable for images** — verify via `curl` of the SSR HTML, the `/_next/image` endpoint, and DOM/accessibility snapshots (text) instead. The home console can be checked there.
- **"Claude in Chrome" blocks navigation** to `vercel.app`, `*.mitmakmotors.online` (the staff portal), and `merch.mitmakmotors.co.za` — but the MAIN `www.mitmakmotors.co.za` works. So you **cannot drive the live site or screenshot it in-tool** → ask the user to eyeball live, or verify via `curl`.
- **Scraping the real site:** `WebFetch` gets **403** from `www.mitmakmotors.co.za` and `merch.…` (WAF). Use Chrome (`browser_batch` navigate + `get_page_text`/`read_page`) for `co.za` pages, `WebFetch` for the courses/portal subdomains, and `curl` (browser UA) for the WooCommerce Store API (`/wp-json/wc/store/v1/products`).
- **Vehicle images = `unoptimized` on purpose** (§5.12). Don't "re-enable optimization" without first mirroring the images to our own storage, or AutoTrader's CDN will 502 the optimizer again. The clean long-term fix: download inventory images into `public/` like staff/merch.
- **Deploy = working-tree upload.** Uncommitted changes go live. So commit before/with deploys to keep git == live.
- **Branches (3) ≠ locations (6).** Don't "fix" one to match the other; both are intentional (3 customer showrooms, 6 physical sites).
- **Repo is ~76MB of real photos** (`public/staff` 47MB, `public/merch` 29MB). Fine; Next serves optimized WebP for those (they're local, never 502).
- Framer dev-only warnings (React DevTools info, useScroll "non-static position") are **stripped from production** — the live console is clean.

## 7. Open items / next steps (priority order)

1. **Black-space fix is shipped + live.** Remaining: a **human desktop + mobile scroll-through** of the live home (https://mit-mak-motors.vercel.app) to confirm zero black flashes — tooling can't screenshot the live deploy (Chrome blocks vercel.app, preview renders next/image black; §6), so this needs a person's eyes.
2. **Forms don't deliver yet** — all `/api/*` routes log + echo success unless `FORM_WEBHOOK_URL` is set (`lib/api.ts`). The **King Price insurance form collects ID numbers + consent (PII)** — wire it to a real CRM/Zapier before real traffic.
3. Optional pitch polish: connect **GitHub↔Vercel auto-deploy**; a **custom domain** (`demo.mitmakmotors.co.za`); mirror vehicle images to own storage to re-enable optimization.
4. The About **"Our Story"** narrative + founder name ("Mike Makua") and some staff bios are **placeholder fiction** from an early session — swap for real info if the client provides it. (The /staff directory IS real.)
5. `/fomo-zone/merch` + `/fomo-zone/masterclass` detail pages are now orphaned (nav points to `/merch` + `/masterclass`); harmless, can be removed.

## 8. File map (key)

```
app/
  page.tsx            home: IgnitionIntro + Hero + QuickSearch + AwardsMarquee + FeaturedInventory
                      + BrandPillars + ScrollMarquee + Testimonials + FomoTeasers + CtaBand
  showroom, compare, finance(+/business), sell-your-car, about, staff, careers, referrals,
  feedback, contact, merch, masterclass, blog(+/[slug]), newsletter, privacy, terms,
  fomo-zone(+/[slug]), vehicles/[slug]
  api/{finance,insurance,referral,careers,feedback,masterclass,contact,newsletter,sell}/route.ts → lib/api.ts
components/
  home/   hero (BMW M4 + rev gauge), quick-search, awards-marquee, featured-inventory,
          brand-pillars (responsive: lg pinned crossfade / mobile stacked), scroll-marquee,
          testimonials, fomo-teasers, ignition-intro
  layout/ header (Masterclass badge → /masterclass), page-hero (image prop), footer, mega-menu,
          cta-band, quick-actions, scroll-progress, logo, newsletter-form
  vehicle/ vehicle-card, vehicle-gallery, spec-grid, detail-accordion, sticky-action-panel,
           trust-block, related-vehicles, finance-calculator
  showroom/ showroom-client, car-finder, filter-bar, vehicle-list-item, vehicle-skeleton, compare-drawer
  compare/ compare-client      merch/ merch-store      masterclass/ masterclass-enquiry
  referrals/ careers/ feedback/ forms (referral-form, careers-form, feedback-form, form-success)
  ui/      reveal, section-heading, counter, button, magnetic, marquee, badge, chevron, prose, body-type-icons
  providers/ smooth-scroll (Lenis), custom-cursor
data/   vehicles.json (401 cars, server-only) + vehicles.ts, staff.ts, merch.ts, masterclass.ts,
        locations.ts (6), navigation.ts, content.ts, awards.ts, site.ts, fomo.ts
lib/    utils, finance, filters, compare, api, blur (NEW)
scripts/ scrape-inventory.mjs, fetch-staff.mjs, fetch-merch.mjs, audit-images.mjs
public/  staff/*.png (130), merch/*.png (80), body-types/*.svg, mit-mak-logo.png, masterclass-badge.png
```

## 9. Suggested first message for the new session

> "Continue the Mit-Mak Motors build at `/Users/jordanmarcus/mit-mak-motors`. Read `HANDOFF.md` first. Step 1 (§7.1): there's an uncommitted, build-green **home black-space fix** on disk — commit + push + deploy it (`git push origin main` works via keychain; deploy with `npx -y vercel@latest deploy --prod --yes --scope jordan-marcus-projects`), then we'll do a live scroll-through. The site is live + public at https://mit-mak-motors.vercel.app. Then: [next task]."
