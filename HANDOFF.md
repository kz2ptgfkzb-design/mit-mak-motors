# Mit-Mak Motors — Session Handoff

Everything a fresh session needs to continue. Updated end of the "social + menu redesign + polish + vehicle-image correctness" session.

---

## 0. READ FIRST — state in one breath

- **Our build (public, share this):** https://mit-mak-motors.vercel.app — fully deployed & current. `main` == `origin/main`; everything below is committed, pushed, and LIVE.
- **The REAL company site is https://www.mitmakmotors.co.za** — a WordPress/Elementor site behind Cloudflare. NOT our build; it's the reference we mirror. Chrome can open co.za but BLOCKS vercel.app (§6).
- **Inventory: 400 cars** (`data/vehicles.json`) — down from 401 after dropping one photo-less listing (see below).
- **This session's changes (all LIVE), newest first:**
  - **Vehicle images corrected (`d2c63c7`).** A scraper bug had injected 4 dealer *banner* images into EVERY car's gallery, so cars showed photos belonging to no car (and 5 had a banner as their hero/card image). Stripped the banners from all cars (`scripts/fix-vehicle-images.mjs`), dropped 1 photo-less listing (`2026 FAW FAW TIGER`, 401→400), and added a recurrence guard to `scripts/scrape-inventory.mjs`. Verified: 0 cars now share a photo with a different make/model.
  - **Image "enhancement" via Cloudinary was tried and REVERTED (`e8d9368` → `4150925`).** AutoTrader serves one master per photo (~1024×768–1440×1080) and IGNORES the size token in the URL, so a CDN transform can't add resolution; routing through Cloudinary fetch also added a per-image cold-load penalty. Reverted to direct AutoTrader images. **Do NOT retry a CDN transform for "quality"** — see §6. (Genuine quality would need better source photos or self-hosted AI-upscaled images.)
  - **Heading word-spacing fixed + deep-link (`455de70`).** `RevealText` was trimming inter-word spaces (headings rendered "TheMit-MakStandard"); now renders correctly. "Why we're trusted" (home testimonials) deep-links to `/about#the-standard`.
  - **Reveal bulletproofed (`646baac`).** `components/ui/reveal.tsx` rewritten: reveal is driven by a direct IntersectionObserver + a scroll-position failsafe (+ rAF mount check), so content can NEVER stay stuck invisible ("black space") under Lenis smooth-scroll / fast scroll. Replaces the earlier `whileInView` threshold approach.
  - **Menu redesign + full polish (`ff12ba1`).** Mega-menu: hover/focus "showroom" preview rail (reduced-motion-safe) + a **Customer Care care-pill surfacing Compliment/Complaint (`/feedback`)** (also in the Company column + footer); dialog semantics + focus trap + focus-return; richer link hover + active-page cue; WhatsApp Button in bottom bar; md-breakpoint fix; one-tap call button on phones. Perf: cursor rAF parks when idle/hidden, marquees pause off-screen (`useInView`), BrandPillars re-render guard + no permanent will-change, intro unlocks scroll ~1s sooner. Removed 2 orphaned `/fomo-zone/{merch,masterclass}` routes. SEO: vehicle BreadcrumbList + UsedCondition JSON-LD, blog publisher/dateModified, sitemap +/compare,/merch,/masterclass.
  - **Social links (`804371f`).** `data/site.ts` socials repointed to the real Mit-Mak profiles — FB `/MitMakMotors`, IG `/mitmakmotors`, YouTube `@MitMakMasterclass`, TikTok `@mitmakmotors`, X `mit_mak_motors`.
- **Build must stay green.** `npm run build` compiles all routes; `./node_modules/.bin/tsc --noEmit` clean.
- ⛔ **Don't share the long `mit-mak-motors-…-jordan-marcus-projects.vercel.app` URLs** — those require a Vercel login. The short alias above is public.

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

`main` == `origin/main`. All work is committed + pushed + deployed. Latest CODE commit: `4150925` (this HANDOFF update commits on top, docs-only — the live site already reflects `4150925`). Recent (newest first):
- `4150925` revert Cloudinary enhancement · `e8d9368` add it (reverted) · `d2c63c7` vehicle-image correctness · `455de70` heading spacing + deep-link · `646baac` bulletproof Reveal · `ff12ba1` menu redesign + polish · `804371f` social links · `a1fca3d` original home black-space fix.

Standard ship loop (deploy uploads the working tree, so commit first):
```bash
cd /Users/jordanmarcus/mit-mak-motors
git add -A && git commit -m "..."
git push origin main
npx -y vercel@latest deploy --prod --yes --scope jordan-marcus-projects
```

## 4. "Black space on scroll" — root cause + current fix (RESOLVED)

Dark gaps while scrolling the dark-theme pages had two causes, both now fixed and live:
1. **Images flashing their near-black container before load** → `lib/blur.ts` provides a dark (#16161a) blur-placeholder data URI, applied as `placeholder="blur" blurDataURL={BLUR}` on lazy/unoptimized images (vehicle cards, hero, brand-pillars, quick-search, fomo teasers, cta band, secondary-page heroes). Images fade in from a dark tile, never pure black.
2. **Reveal blocks stuck at `opacity:0`** → `components/ui/reveal.tsx` (`Reveal`/`RevealText`) now drives the reveal off a direct IntersectionObserver **plus a scroll-position failsafe** (+ an initial rAF check). If an element is ever actually in the viewport it reveals, regardless of scroll speed or Lenis smooth-scroll. This replaced the fragile `whileInView`+`once` approach that could leave content permanently invisible on fast scroll (`646baac`).

If "black space" is reported again, it's almost certainly a NEW component whose content isn't wrapped in `Reveal`, or an image missing a blur placeholder — not the reveal mechanism itself.

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
15. **Menu redesign + full polish** (`ff12ba1`) — mega-menu hover/focus preview rail + **Customer Care care-pill surfacing Compliment/Complaint** (also Company column + footer); dialog semantics + focus trap + focus-return; active-page cue; WhatsApp Button in bottom bar; md-breakpoint fix; one-tap call button on phones. Perf: `custom-cursor` rAF parks when idle/hidden; `marquee` pauses off-screen (`useInView`); `brand-pillars` re-render guard + dropped permanent `will-change`; `ignition-intro` unlocks scroll ~1s sooner. Removed orphaned `/fomo-zone/{merch,masterclass}` detail routes. SEO: vehicle `BreadcrumbList` + `UsedCondition` JSON-LD, blog `publisher`/`dateModified`, sitemap +/compare,/merch,/masterclass.
16. **Reveal bulletproofed** (`646baac`) — `components/ui/reveal.tsx` rewritten (IntersectionObserver + scroll failsafe). See §4.
17. **Heading word-spacing + deep-link** (`455de70`) — `RevealText` inter-word spaces fixed (headings were "TheMit-MakStandard"); "Why we're trusted" now links to `/about#the-standard` (that section has `id="the-standard" scroll-mt-28`).
18. **Vehicle image correctness** (`d2c63c7`) — stripped 4 dealer banner images that had contaminated every gallery; dropped the photo-less FAW Tiger (401→400); added a scrape guard. See §0.
19. **Cloudinary image enhancement — TRIED & REVERTED** (`e8d9368`→`4150925`). See §0 and §6.

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
- **AutoTrader images cap at ~1024×768–1440×1080 and the CDN IGNORES the size token** (`Crop1024x576`, `Crop2560x1440`, `Original` all return the same master). So you canNOT get a sharper photo by changing the URL — we already serve the max. **Don't route car images through a CDN transform (Cloudinary/imgix/etc.) for "quality"** — it was tried (Cloudinary fetch) and reverted: no resolution gain + a per-image cold-transform penalty that made browsing feel slower. Real quality gain needs better source photos or self-hosted AI-upscaled images.
- **Some identical new units legitimately share one stock-photo set** (e.g. 6 identical `2026 Mahindra Pik Up Single Cab` units). That's expected, not the banner bug. The real bug (fixed) was 4 dealer *banner* images on every car; `scripts/scrape-inventory.mjs` now strips any image appearing across a large share of listings, and `scripts/fix-vehicle-images.mjs` is the one-off repair. A re-scrape self-cleans.
- **`server-only` import + Cloudinary lesson:** the abandoned AI-advisor experiment briefly added `@anthropic-ai/sdk`; it was removed (`a9fc593`). If you build the advisor (see §7), the SDK + an `ANTHROPIC_API_KEY` (Vercel env) are needed.

## 7. Open items / next steps (priority order)

1. **Forms don't deliver yet** — all `/api/*` routes log + echo success unless `FORM_WEBHOOK_URL` is set (`lib/api.ts`). The **King Price insurance form collects ID numbers + consent (PII)** — wire it to a real CRM/Zapier before real traffic.
2. **AI car advisor — REQUESTED, not built.** The user wanted a conversational bot (dedicated `/advisor` page, Opus 4.8) that helps people who don't know cars pick one from inventory. Design was scoped (streaming `/api/advisor` route + prompt-cached compact catalog in the system prompt + chat UI + `[[car:slug]]` recommendation cards) but the build was dropped mid-start — **NO code exists**. To build: `npm i @anthropic-ai/sdk`, set `ANTHROPIC_API_KEY` in Vercel, use the `claude-api` skill; model `claude-opus-4-8`; degrade gracefully if the key is unset.
3. **Image quality ceiling** — photos are already at AutoTrader's max (~1440px); the CDN ignores size hints (§6). Real improvement needs better source photos or a self-hosted AI-upscale + rehost pipeline. **Do not retry a CDN transform** (Cloudinary was tried & reverted).
4. The About **"Our Story"** narrative + founder name ("Mike Makua") and some staff bios are **placeholder fiction** from an early session — swap for real info if the client provides it. (The /staff directory IS real.)
5. Optional pitch polish: connect **GitHub↔Vercel auto-deploy**; a **custom domain** (`demo.mitmakmotors.co.za`). The reveal fix is now bulletproof, but a human desktop+mobile scroll-through is still worth a glance before the managers view (tooling can't screenshot the live deploy — §6).

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
data/   vehicles.json (400 cars, server-only) + vehicles.ts, staff.ts, merch.ts, masterclass.ts,
        locations.ts (6), navigation.ts, content.ts, awards.ts, site.ts, fomo.ts
lib/    utils, finance, filters, compare, api, blur, hooks
scripts/ scrape-inventory.mjs (has banner-strip guard), fetch-staff.mjs, fetch-merch.mjs,
        audit-images.mjs, fix-vehicle-images.mjs (one-off banner-contamination repair)
public/  staff/*.png (130), merch/*.png (80), body-types/*.svg, mit-mak-logo.png, masterclass-badge.png
```

## 9. Suggested first message for the new session

> "Continue the Mit-Mak Motors build at `/Users/jordanmarcus/mit-mak-motors`. Read `HANDOFF.md` first — everything is committed + pushed + LIVE at https://mit-mak-motors.vercel.app (`main` == `origin/main`, latest code commit `4150925`), nothing pending. Ship loop: `git push origin main` (keychain, no token) then `npx -y vercel@latest deploy --prod --yes --scope jordan-marcus-projects`. Hard constraints: NO em/en-dashes in copy; AutoTrader car images stay `unoptimized` and must NOT be routed through a CDN transform for 'quality' (tried Cloudinary, reverted — §6). Then: [my task]."
