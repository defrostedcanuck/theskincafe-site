# Phase 4: Launch Polish & Handoff - Research

**Researched:** 2026-04-20
**Domain:** DNS/SSL cutover, Next.js performance, responsive QA, client handoff documentation
**Confidence:** HIGH

## Project Constraints (from CLAUDE.md / AGENTS.md)

From `/Users/craigr/theskincafe-site/CLAUDE.md` (imports `AGENTS.md`):
- **Next.js 16 is NOT the Next.js you know.** Consult `node_modules/next/dist/docs/` before touching Next-specific code. Image, metadata, and middleware APIs have changed between versions — do not rely on training data.

From global `/Users/craigr/CLAUDE.md`:
- Verify before asserting. One correction = immediate course change.
- Act, don't ask, when findable in code/config/docs.
- **Rsync env clobber memory** — `.env*` files can be overwritten during deploys. Vercel env is source of truth for all secrets used in this phase (no new env vars provisioned by Phase 4, but existing ones inspected for handoff doc).

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|------------------|
| POLISH-01 | Client-supplied dark-on-light logo replaces CSS `invert` stopgap in scrolled navbar state | Navbar.tsx line 52: `scrolled ? "invert" : ""` is the exact line to remove; next/image handles both SVG + PNG but SVG needs `unoptimized` or remote-pattern tweak |
| POLISH-02 | Responsive behavior verified across 375/768/1280 | Playwright device emulation with built-in viewport presets (fast, scriptable) + manual Chrome DevTools sweep; BrowserStack overkill for brochure site |
| POLISH-03 | Lighthouse mobile Performance ≥ 90 on homepage | next/font already wired, next/image in use; primary risks: hero video weight, third-party scripts (Square booking, analytics), unoptimized image sizes |
| POLISH-04 | One round of client-requested revisions captured and signed off | Scope-control pattern: write-capture → implement → client acceptance, distinct from open-ended change requests |
| INFRA-04 | Production domain serves HTTPS via Vercel-managed cert, HTTP 301→HTTPS | Phase 1 prepared Cloudflare zone + lowered TTLs. Phase 4 executes NS flip, attaches domain, waits on Let's Encrypt HTTP-01 challenge, configures domain redirect |
| INFRA-06 | Handoff doc: every service, owner, login URL, credential location, rotation, support contact | Industry standard for agency→client handoffs — reusable template: services matrix, access map, rotation runbooks, emergency DNS procedure, cost breakdown |
</phase_requirements>

## Summary

Phase 4 is the launch phase. It contains two largely independent workstreams that can run in parallel waves: (1) **revisions + polish** (logo swap, responsive QA, Lighthouse ≥ 90, client revision round) and (2) **cutover + handoff** (DNS NS flip, Vercel SSL provisioning, HTTP→HTTPS enforcement, handoff doc). Cutover should be the LAST operational step in the phase so revisions land on a still-private `*.vercel.app` preview first, then the flip publishes them to the real domain in one moment.

The single highest-risk step is the **Cloudflare proxy vs DNS-only decision** for records pointing to Vercel. Vercel's explicit documented guidance: **do not use Cloudflare proxy (orange cloud) in front of Vercel.** Proxying breaks Vercel's firewall visibility, creates double-CDN cache pathologies, and can stall Let's Encrypt HTTP-01 challenge validation on the apex A record. DNS-only (grey cloud) is required for `theskincafe.net` and `www.theskincafe.net` records. This overrides the default instinct to "turn on Cloudflare's CDN for free."

Lighthouse Performance ≥ 90 on mobile is very achievable for this codebase — it already uses `next/font/google` (Playfair_Display + DM_Sans) and `next/image`. The realistic risks are (a) hero video weight on mobile, (b) the Square booking dropdown loading third-party JS on initial render, and (c) the logo at `360×130` served at `h-20` (80px) without explicit `sizes` hint, which can cause LCP penalty on mobile.

**Primary recommendation:** Execute waves in this order — Wave 1 (parallel): dark-logo swap + responsive QA + Lighthouse baseline measurement. Wave 2: performance fixes (if baseline < 90) + client revision round. Wave 3 (serial, last): DNS NS flip → Vercel domain attach → SSL provisioning verify → HTTP redirect config → handoff doc commit.

## User Constraints

No `CONTEXT.md` exists for this phase — planner has full discretion within the constraints below.

**From ROADMAP.md success criteria (locked):**
1. Production domain (not `vercel.app`) serves HTTPS via Vercel-managed cert.
2. HTTP requests 301 to HTTPS.
3. Scrolled navbar renders native dark-on-light logo — zero `invert` filter in code.
4. 375/768/1280 walkthrough shows no horizontal scroll, no broken layouts, no clipped CTAs on homepage, services, team, gallery, locations, contact.
5. Lighthouse mobile Performance ≥ 90, report committed to repo or linked from handoff doc.
6. One round of client-requested revisions captured in writing, implemented, signed off.
7. Handoff doc in repo listing every service, account owner, login URL, credential location, rotation procedure, support contact.

**Out of scope (explicit):**
- Phase 2/3 features (assumed complete before this phase starts).
- Ongoing maintenance retainer (post-handoff, separate engagement).
- GitHub repo ownership transfer — default Option A from Phase 1 research was "defer to Phase 4 handoff." Treat as an in-scope option but gated on client GitHub-org status.

**Phase 1 research to REUSE (do not duplicate):**
- DNS baseline + Cloudflare zone setup (already done in Phase 1).
- Cloudflare TTL reduction to 60s (done as last Phase 1 step).
- Vercel domain `76.76.21.21` apex A record + `cname.vercel-dns.com` for www (documented in Phase 1 research §"DNS Records to Land in Cloudflare").
- CAA record gotcha — audited during Phase 1 baseline.
- Cutover steps 7–10 from Phase 1 research — **those are THIS phase's work.**

## Standard Stack

### Tooling (installed or available)

| Library / Tool | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| Lighthouse CLI | 13.1.0 | Scriptable mobile Performance audit, reproducible scores | [VERIFIED: npm view lighthouse version → 13.1.0, 2026-04-20]. Official Google tool; same engine as Chrome DevTools audit. |
| @playwright/test | 1.59.1 | Responsive QA across 375/768/1280 with device emulation | [VERIFIED: npm view @playwright/test version → 1.59.1]. Built-in mobile device descriptors; scriptable; zero cloud cost. |
| Chrome DevTools device toolbar | browser-native | Manual visual confirmation pass | Already installed; fastest feedback loop for human eyes-on. |
| Vercel Dashboard | n/a | Domain attach, SSL status, redirect config | Only way to do domain operations on Vercel; no CLI equivalent for "add domain to project." |
| Cloudflare Dashboard | n/a | Record edits, proxy status toggle | Only surface for record audit; API available but not needed for this phase's operations. |

**Version verification:** Versions above confirmed via `npm view` at research time. Planner should re-verify at plan execution time if phase runs > 30 days after this date. No installs required if Lighthouse/Playwright not already in devDependencies.

### Already in codebase (verified via package.json + src inspection)

| Library | Version | Notes |
|---------|---------|-------|
| `next` | 16.2.3 | App Router. Also note latest is 16.2.4 as of 2026-04-20 — patch bump safe before launch. |
| `react` / `react-dom` | 19.2.4 | Server components default. |
| `framer-motion` | 12.38.0 | Client-only animations — audit for above-the-fold usage (hurts LCP/TBT). |
| `lucide-react` | 1.8.0 | Tree-shakeable icons; current usage (Phone, MapPin, Menu, X, ChevronDown) looks fine. |
| `next/font/google` (Playfair_Display, DM_Sans) | built-in | Already wired in `src/app/layout.tsx` — good. Verify `display: "swap"` is set. |
| `next/image` | built-in | Already used in Navbar (`logo.png`). Audit other usages for `priority` / `sizes`. |

### Alternatives Considered

| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| Playwright device emulation | BrowserStack real devices | BrowserStack is overkill for a brochure site. Playwright emulation misses real-touch and iOS Safari quirks but catches 95% of layout issues. For a $2,000 milestone, Playwright + manual iOS Safari on Craig's phone is right-sized. [CITED: browserstack.com/guide/playwright-mobile-automation, testdino.com] |
| Vercel dashboard www↔apex redirect | Next.js middleware or `next.config.ts` `redirects()` | Dashboard redirect is simpler, runs at the edge before any app code, no redeploy needed to change. Use dashboard. [VERIFIED: vercel.com/docs/redirects — "Domain Redirects: redirect www to apex through the Domains section of the dashboard"] |
| HTTP→HTTPS via Next.js middleware | Vercel automatic HTTPS (no config) | Vercel automatically redirects HTTP→HTTPS on any domain with a valid SSL cert; no middleware needed. Writing custom middleware is worse (adds latency, can loop). [VERIFIED: vercel.com behavior — HTTPS is default, HTTP 308-redirects] |
| Cloudflare proxy (orange cloud) in front of Vercel | DNS-only (grey cloud) | **DNS-only is the Vercel-recommended configuration.** Proxy breaks Vercel firewall, causes double-cache, can stall Let's Encrypt HTTP-01. See Pitfalls. [VERIFIED: vercel.com/guides/cloudflare-with-vercel] |
| Cloudflare Origin CA + Full (strict) SSL | Vercel-managed Let's Encrypt cert, DNS-only | Origin CA is for the proxied-Cloudflare pattern. Since we're going DNS-only, Vercel's Let's Encrypt is the simpler, correct choice. Origin CA only matters on Enterprise Vercel. [VERIFIED: github.com/vercel/vercel discussion #5227] |

**No installations required for Lighthouse/Playwright** — both can be run ad-hoc via `npx`:
```bash
npx lighthouse https://<preview-or-prod-url> --preset=mobile --output=html --output-path=.planning/phases/04-launch-polish-handoff/lighthouse-homepage.html
npx playwright@1.59.1 test --project=mobile-375 --project=tablet-768 --project=desktop-1280
```

## Architecture Patterns

### Wave Ordering Pattern (phase-level)

```
Wave 1 (parallel):
  ├─ Dark logo asset received from client → swap into Navbar, remove `invert`
  ├─ Responsive audit on preview URL (375/768/1280)
  └─ Lighthouse baseline measurement on preview URL

Wave 2 (serial, conditional):
  ├─ Performance fixes IF Lighthouse < 90 mobile
  └─ Client revision round (captured in writing, implemented)

Wave 3 (strictly serial, last):
  1. Verify Cloudflare records match expected state (apex A 76.76.21.21 DNS-only, www CNAME DNS-only)
  2. Add production domain to Vercel project
  3. At registrar: flip nameservers to Cloudflare-assigned pair
  4. Monitor propagation (`dig NS` from multiple resolvers)
  5. Wait for Vercel SSL provisioning (Let's Encrypt HTTP-01)
  6. Verify HTTPS works, HTTP 308-redirects to HTTPS (Vercel default behavior)
  7. Configure www↔apex redirect in Vercel dashboard (Domains section)
  8. Run final Lighthouse audit on production domain
  9. Write handoff doc, commit, deliver to client
```

**Why this order:** Revisions land on preview URL first (no downtime risk). Cutover is atomic — either it works or we rollback NS at registrar (60s TTL rollback window from Phase 1 prep). Handoff doc is last because it documents the final end state, not the build state.

### Navbar Logo Swap Pattern

Current state (`src/app/components/Navbar.tsx` line 45-55):
```tsx
<Image
  src="/images/logo.png"
  alt="The Skin Cafe"
  width={360}
  height={130}
  priority
  className={`h-20 w-auto transition-all group-hover:scale-110 ${
    scrolled ? "invert" : ""   // ← THIS IS THE HACK TO REMOVE
  }`}
/>
```

Target state (two variants, swap by `scrolled` state):
```tsx
<Image
  src={scrolled ? "/images/logo-dark.png" : "/images/logo.png"}
  alt="The Skin Cafe"
  width={360}
  height={130}
  priority
  sizes="(max-width: 768px) 160px, 240px"   // NEW: gives next/image correct responsive hint
  className="h-20 w-auto transition-all group-hover:scale-110"
/>
```

**Notes:**
- `priority` is correct for above-the-fold logo — keeps it eagerly loaded for LCP.
- `sizes` is currently missing; add it while swapping. Mobile renders the logo at ~160px CSS, not 360px intrinsic — without `sizes`, next/image serves a larger-than-needed image.
- If client supplies an **SVG** instead of PNG, next/image will still work but SVG optimization is a no-op; alternatively render `<img src="/images/logo.svg">` directly (SVGs are already vector and tiny). For SVG handling, `next.config.ts` `images.dangerouslyAllowSVG: true` is required IF SVG is served through the optimizer — better to use a plain `<img>` tag or `<Image unoptimized>` for SVGs.
- Two assets required: `logo.png` (white, for transparent hero state) already exists; `logo-dark.png` (dark-on-light, for scrolled state) is the deliverable from the client.
- Verify both at same intrinsic dimensions so `width={360} height={130}` stays correct for both.

### Vercel Domain Attach Pattern

1. Vercel Dashboard → Project → Settings → Domains → Add Domain → enter `theskincafe.net`.
2. Vercel auto-detects apex and suggests A record `76.76.21.21` (or similar project-specific value). **Verify the record already exists in Cloudflare from Phase 1 setup.**
3. Repeat for `www.theskincafe.net` → Vercel suggests CNAME `cname.vercel-dns.com`.
4. Set one as Primary; configure "Redirect to" on the other. Best practice in 2026: primary = apex (`theskincafe.net`), redirect `www` → apex (Vercel uses Anycast for apex; A record works fine). [CITED: vercel.com/docs/domains/working-with-domains/deploying-and-redirecting]
5. Vercel begins Let's Encrypt HTTP-01 challenge automatically.

### Vercel SSL Provisioning Pattern

Vercel uses Let's Encrypt. For non-wildcard domains (our case), HTTP-01 challenge:
1. Vercel requests cert from Let's Encrypt.
2. Let's Encrypt issues a challenge (a file at `http://theskincafe.net/.well-known/acme-challenge/<token>`).
3. Vercel serves that file from its edge.
4. Let's Encrypt fetches the file.
5. Cert issued; Vercel installs; HTTPS live.

**Timing:** Typically < 60 seconds once DNS points at Vercel. Can take up to a few minutes during Let's Encrypt rate-limit windows. If "pending SSL" persists > 15 minutes, something is wrong (CAA record, Cloudflare proxying, wrong A record).

**Renewal:** Automatic. No agency intervention needed. Cert rotates ~60 days before expiry.

[VERIFIED: vercel.com/docs/domains/working-with-ssl]

### HTTP → HTTPS Redirect Pattern

**No code required.** Vercel automatically redirects HTTP to HTTPS once the domain has a valid SSL cert. The status code is 308 (permanent, preserves method/body) — this satisfies ROADMAP success criterion "HTTP 301s to HTTPS" (308 is the modern equivalent; both are "permanent redirect").

**Verification after cutover:**
```bash
curl -sI http://theskincafe.net | head -5
# Expect: HTTP/2 308  + location: https://theskincafe.net/
curl -sI http://www.theskincafe.net | head -5
# Expect: HTTP/2 308  + location: https://theskincafe.net/ (if redirect is set)
```

### Handoff Documentation Pattern

Best-in-class structure (synthesized from industry resources + Phase 1 research):

```
HANDOFF.md
├── 1. Executive summary (what the site is, what it runs on)
├── 2. Services matrix
│   ├─ Vercel  (owner, login URL, role map, what it does, monthly cost)
│   ├─ Cloudflare  (same schema)
│   ├─ Resend  (same schema)
│   ├─ Square Developer  (same schema — separate from merchant Square)
│   ├─ Vercel Analytics  (if applicable)
│   └─ GitHub  (owner depends on Option A/B decision)
├── 3. Credential location map
│   ├─ API keys: Vercel project env vars (link)
│   ├─ Service passwords: client's password manager (instruction, no credentials in repo)
│   └─ Where to find each secret
├── 4. Deploy process
│   ├─ Git flow (push to main → Vercel auto-deploys)
│   ├─ Rollback via Vercel dashboard (Deployments → Promote a prior deploy)
│   └─ Preview URL lifecycle
├── 5. Domain management
│   ├─ Where nameservers live (registrar)
│   ├─ Where DNS records are edited (Cloudflare)
│   ├─ Emergency DNS procedure (how to point the domain at a temporary host if Vercel is down)
│   └─ SSL auto-renewal (nothing to do)
├── 6. Credential rotation runbooks
│   ├─ Rotate Resend API key  (step-by-step)
│   ├─ Rotate Square access token  (step-by-step)
│   ├─ Rotate Vercel team member access  (add/remove)
│   └─ Rotate Cloudflare account access  (add/remove)
├── 7. Cost breakdown
│   ├─ Expected monthly cost per service (Vercel Hobby $0, Resend Free $0, Cloudflare Free $0, Square API $0)
│   ├─ Scaling triggers ("if you exceed X pageviews, Vercel prompts upgrade")
│   └─ How to cancel each service
├── 8. Monitoring + what to watch
│   ├─ Vercel Analytics dashboard
│   ├─ Resend bounce/complaint rates
│   └─ Cloudflare DNS query volume
├── 9. Support
│   ├─ Craig's contact (craig@worry-free.it, phone if desired)
│   ├─ Response expectations
│   └─ Each vendor's support URL
└── 10. Appendices
    ├─ Final Lighthouse report (linked or inline)
    ├─ Responsive QA walkthrough notes
    └─ Revision round sign-off (client email or screenshot)
```

**File location:** `/Users/craigr/theskincafe-site/HANDOFF.md` (at repo root, visible in GitHub and accessible to client).

**Security note:** Per "How to Hand Off" guides + SOC-2 norms, actual passwords/secrets must NEVER be in `HANDOFF.md`. The doc tells you WHERE to find them (Vercel env vars, password manager), not WHAT they are. [CITED: elementor.com/blog/how-to-handover-website-client, whatfix.com/blog/handover-documentation]

### Anti-Patterns to Avoid

- **Turning on Cloudflare proxy (orange cloud) for Vercel records.** Breaks Vercel firewall visibility, causes double-CDN cache issues, can stall Let's Encrypt HTTP-01. [VERIFIED: vercel.com/guides/cloudflare-with-vercel — "we do not recommend using a reverse proxy in front of Vercel"]
- **Writing custom Next.js middleware for HTTP→HTTPS redirect.** Vercel does this automatically; middleware adds latency and can create redirect loops.
- **Committing actual credentials to HANDOFF.md.** Repo may be public later; credentials don't rotate with git history.
- **Running Lighthouse on `localhost` and reporting that score.** Production deploy conditions (CDN, gzip, real network) are materially different. Lighthouse must run against the production domain (or at minimum a Vercel preview URL) to be valid for POLISH-03.
- **Running the final Lighthouse before the DNS flip.** Score should be captured on the production domain post-cutover. Pre-cutover Lighthouse on preview URL is fine as a baseline but not as the deliverable.
- **Flipping NS at registrar on a Friday afternoon.** If something breaks at 5pm Friday, nobody's around. Do cutovers Monday–Thursday morning local time.
- **Stacking the revision round at the END of the phase.** The client may request changes that require server-side work or image asset swaps. Revisions must land BEFORE the final Lighthouse run, else the score may shift.
- **Using `invert` filter + a dark logo variant.** Picking one or the other is correct; using both double-inverts and produces broken rendering.

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| HTTP→HTTPS redirect | Next.js middleware with host/proto detection | Vercel's automatic HTTPS enforcement | Vercel does this at the edge, no latency, no loops. Verified 308 on every domain with valid SSL. |
| www ↔ apex redirect | Custom `redirects()` in `next.config.ts` | Vercel dashboard "Redirect to" domain setting | Runs at edge before any app code; no redeploy to change. [VERIFIED: vercel.com/docs/redirects] |
| SSL cert provisioning | ACME client scripts | Vercel-managed Let's Encrypt | Fully automatic, auto-renews, zero ops. |
| Responsive viewport testing | Hand-built multi-browser harness | Playwright device emulation with built-in viewport presets | Zero infrastructure; fast feedback; same tool for future regression tests. |
| Lighthouse scoring infrastructure | Custom performance dashboard | Lighthouse CLI HTML report committed to repo | One file, versioned, viewable in browser. Matches POLISH-03 spec ("report committed to the repo"). |
| Credential rotation schedules | Custom reminder system | Document rotation steps in HANDOFF.md; client owns calendar | Scope for $2,000 milestone = documentation, not ongoing ops. |

**Key insight:** Phase 4 is overwhelmingly configuration + documentation, not code. The one code change is removing the `invert` filter and swapping logo sources. Every other "don't hand-roll" is about using platform features instead of writing app code.

## Common Pitfalls

### Pitfall 1: Cloudflare proxy enabled on Vercel records

**What goes wrong:** Someone (client or curious Claude) toggles the DNS record for `theskincafe.net` from DNS-only (grey cloud) to Proxied (orange cloud) thinking "free CDN is good." Result: Let's Encrypt HTTP-01 challenge response goes through Cloudflare's proxy, Cloudflare serves its own 502/521 or caches a stale response, Let's Encrypt fails validation, SSL never provisions.

**Why it happens:** Cloudflare's UI defaults to Proxied for A records on newly added zones. The Phase 1 research explicitly called out `DNS only` but a user editing in Cloudflare later might re-enable proxy.

**How to avoid:**
- Before step "Add domain to Vercel," verify: `dig theskincafe.net @1.1.1.1` returns `76.76.21.21` (not a Cloudflare IP like `104.x.x.x`).
- Same for `www.theskincafe.net`: should resolve to `cname.vercel-dns.com` ultimately, not a Cloudflare IP.
- In Cloudflare dashboard, both records must show grey cloud icon.
- Document this in HANDOFF.md so the client doesn't "optimize" it later.

**Warning signs:** Domain shows "pending SSL" in Vercel for > 15 minutes. `curl -vI https://theskincafe.net` shows Cloudflare headers (`cf-ray`, `server: cloudflare`) instead of `server: Vercel`.

[VERIFIED: vercel.com/guides/cloudflare-with-vercel; community.vercel.com thread "Custom Domain Stuck on Failed to Generate Cert - Cloudflare Proxy"]

### Pitfall 2: CAA record blocks Let's Encrypt

**What goes wrong:** Existing CAA record (possibly carried over from prior provider) whitelists a specific CA other than Let's Encrypt. Vercel's cert provisioning stalls indefinitely with no clear error in the dashboard.

**Why it happens:** If ANY CAA record exists, only listed CAs may issue. Missing `letsencrypt.org` = Let's Encrypt blocked.

**How to avoid:**
- Phase 1 baseline audit included `dig CAA theskincafe.net`. Re-verify BEFORE adding domain to Vercel.
- If any CAA record exists, add `0 issue "letsencrypt.org"` in Cloudflare.
- If no CAA records exist at all, do nothing — Vercel auto-adds one on SSL provisioning.

**Warning signs:** Same as Pitfall 1 — "pending SSL" > 15 minutes. Check CAA before suspecting proxy.

[VERIFIED: vercel.com/docs/domains/troubleshooting]

### Pitfall 3: Framer-motion above-the-fold tanks LCP/TBT

**What goes wrong:** `framer-motion` ships ~30KB JS to the client. If it's used on above-the-fold components (hero section entrance animations), it blocks main thread during initial paint and hurts Total Blocking Time + First Contentful Paint, dropping Lighthouse Performance below 90.

**Why it happens:** Framer is a client-component library — any file using it forces `"use client"` on the component tree. Common anti-pattern: wrapping the hero in `<motion.div>` for a fade-in.

**How to avoid:**
- Audit: `grep -rn "motion\." src/` and `grep -rn "framer-motion" src/`. Identify above-the-fold usages.
- For above-the-fold: use CSS `@keyframes` / `animation-delay` (zero JS) or skip animation. Below-the-fold usages are fine.
- If framer is truly needed above-the-fold, dynamic import with `ssr: false` so it doesn't block LCP: `const Motion = dynamic(() => import('framer-motion').then(m => m.motion.div), { ssr: false })`.

**Warning signs:** Lighthouse report shows `framer-motion` in "Reduce unused JavaScript" section with > 50KB. LCP > 2.5s on mobile.

[CITED: dev.to/bean_bean/nextjs-performance-optimization-2026 — "stop defaulting to 'use client'"; wisp.blog mobile-performance guide]

### Pitfall 4: Hero video weight on mobile

**What goes wrong:** PROJECT.md notes the hero has a video background. On mobile 4G, a 10MB video file blocks LCP for 3–5 seconds. Lighthouse Performance drops to 60s.

**Why it happens:** Video autoplays on mobile and counts toward initial resource weight. Mobile Lighthouse throttles to Slow 4G + 4x CPU slowdown.

**How to avoid:**
- Use a poster image (static JPG/WebP) as initial paint; only load video after LCP fires.
- Or: show a static image on mobile (`<= 768px`), video only on desktop (`matchMedia` + conditional render in client component).
- Compress hero video aggressively: target < 1MB for mobile variant, H.264 MP4 or AV1.
- Add `preload="metadata"` (not `auto`) and `poster="/images/hero-poster.jpg"`.

**Warning signs:** Lighthouse LCP element = video element or element that appears after video. "Serve images in next-gen formats" or "Efficiently encode images" audit failing.

[CITED: wisp.blog mastering-mobile-performance]

### Pitfall 5: `next/image` without `sizes` prop

**What goes wrong:** Images rendered via `next/image` without a `sizes` prop serve the full intrinsic width to every device, including mobile. Lighthouse flags "Properly size images" and "Serve images in next-gen formats" as opportunities.

**Why it happens:** Default behavior of next/image without `sizes` is to serve the largest variant. Easy oversight.

**How to avoid:**
- Audit every `<Image>` usage: add `sizes="(max-width: 768px) 100vw, 50vw"` or similar appropriate hint.
- For the Navbar logo: `sizes="(max-width: 768px) 160px, 240px"` (logo is always the same width on screen, not responsive).
- Hero: `sizes="100vw"` (always full width).
- Gallery cards: `sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"`.

**Warning signs:** Lighthouse "Properly size images" audit showing potential savings > 100KB.

[VERIFIED: nextjs.org/docs/app/getting-started/images — `width`/`height` vs `fill` + `sizes`]

### Pitfall 6: Preview URL Lighthouse ≠ Production Lighthouse

**What goes wrong:** Baseline Lighthouse captured on `*.vercel.app` preview. Passes 90. Post-cutover, production URL scores 82 because Vercel preview URLs have different CDN characteristics than the production apex.

**Why it happens:** Minor but real differences in TLS negotiation, edge region, and no custom-domain cert warmup.

**How to avoid:**
- Run Lighthouse on preview URL for baseline + optimization iteration.
- **Run the "POLISH-03 deliverable" Lighthouse on the production domain** (`https://theskincafe.net` after cutover).
- Budget: if preview scores 95, production very likely scores ≥ 90. If preview scores 90, risk is real.
- Target preview ≥ 93 as a safety margin.

**Warning signs:** POLISH-03 deliverable Lighthouse report shows preview URL in the audit header, not production.

### Pitfall 7: Revision scope creep

**What goes wrong:** "One round of revisions" is verbal/informal. Client sends 40 requests over 3 weeks. Milestone stalls.

**Why it happens:** No written capture of what "the round" includes. No "closed" moment.

**How to avoid:**
- After feature complete, explicitly send client a "Revision Round" message: "Please reply by [date] with all changes you'd like in this round. Changes received after that reply will be logged for Milestone 2 scope."
- Capture the response verbatim in `.planning/phases/04-launch-polish-handoff/revision-round.md`.
- Treat that doc as the spec for the revision wave. Anything not in it = out of scope, flagged in writing.
- Client sign-off: a single "approved" email or checkbox, captured in handoff appendix.

**Warning signs:** Revisions dribble in week by week. No written "this is the list." Phase doesn't advance.

[CITED: elementor.com, webflow.com client-handoff guides]

### Pitfall 8: DNS flip on Friday afternoon

**What goes wrong:** NS change propagates during low-staffing window. Something breaks (mail stops working, a subdomain 404s). Nobody available until Monday. Client's weekend bookings affected.

**Why it happens:** Natural end-of-week push to "get it done."

**How to avoid:**
- Schedule cutover Monday morning or Tuesday–Thursday. Avoid Fridays and holidays.
- Communicate ETA to client explicitly.
- Have rollback plan (NS back to current provider at registrar) documented and time-boxed: "If HTTPS not live within 30 minutes, rollback."

**Warning signs:** Proposal to "just flip it tonight" without context.

## Runtime State Inventory

Phase 4 changes the domain's authoritative DNS and SSL-serving party. Runtime state check:

| Category | Items Found | Action Required |
|----------|-------------|------------------|
| **Stored data** | None new — Phase 2/3 already wired Square customer directory + Resend; those secrets are in Vercel env (managed by Phase 1). Phase 4 does not modify data flows. | None. |
| **Live service config** | Cloudflare zone records (set up in Phase 1) — verify records match expected state before flip. | Pre-flip diff. |
| **Live service config** | Registrar nameserver setting — currently points at existing live-site DNS provider (captured in Phase 1 baseline). Must be changed to Cloudflare nameservers. | NS flip at registrar. |
| **Live service config** | Vercel project — currently has no production domain attached (only `*.vercel.app`). Phase 4 attaches `theskincafe.net` + `www.theskincafe.net`. | Domain attach. |
| **Live service config** | Vercel www↔apex redirect setting (dashboard, Domains → "Redirect to"). Not yet configured. | Configure post-attach. |
| **OS-registered state** | None. Cutover is cloud-only. | None — verified by inspection. |
| **Secrets/env vars** | Existing env vars in Vercel project (`RESEND_API_KEY`, `SQUARE_ACCESS_TOKEN`, etc.) unaffected by DNS change. | None — but inventory them in HANDOFF.md. |
| **Build artifacts** | Repo may still be at `defrostedcanuck/theskincafe-site` (Option A from Phase 1). If Option B chosen now, git remote + Vercel git integration re-wire. | Decide Option A vs B at phase start. |

**Canonical check post-flip:**
- `dig NS theskincafe.net @8.8.8.8` returns Cloudflare nameservers.
- `dig theskincafe.net @1.1.1.1` returns `76.76.21.21` (Vercel apex).
- `curl -sI https://theskincafe.net | head -3` returns `HTTP/2 200` with `server: Vercel`.
- Mail still works (send test from staff account, receive external mail).
- Any non-Vercel subdomains preserved from Phase 1 audit still resolve.

## Environment Availability

| Dependency | Required By | Available | Version | Fallback |
|------------|------------|-----------|---------|----------|
| `dig` | DNS verification throughout cutover | ✓ (standard macOS) | — | `nslookup` or `curl -v` |
| `curl` | HTTP/HTTPS verification, redirect inspection | ✓ | — | Browser DevTools Network tab |
| Node 20+ | `npx lighthouse`, `npx playwright` | Assumed ✓ (project uses Next 16 which requires 20+) | — | — |
| Google Chrome or Chromium | Lighthouse needs headless Chrome | ✓ (macOS default; Playwright ships its own) | — | — |
| Access to Vercel dashboard (client team, as Admin) | Domain attach, redirect config, SSL status | ✓ (Craig has Admin per Phase 1) | — | None |
| Access to Cloudflare dashboard (client zone) | Record verification, last-minute edits | ✓ (Craig has Admin per Phase 1) | — | API via `CF_API_TOKEN` from jarvis-engine if needed |
| Access to domain registrar | NS flip step | **Depends on Phase 1 handoff** | — | Client-mediated if Craig lacks direct access |
| Client's dark-on-light logo asset | POLISH-01 | **Blocking** — client deliverable | — | Cannot ship POLISH-01 without it; surface in plan as a client-action gate |

**Missing dependencies with no fallback:**
- **Dark-on-light logo from client** (POLISH-01 client action). Plan must mark this as a gate and include a reminder/nudge task early in the phase.

**Missing dependencies with fallback:**
- **Registrar access** — if client never granted Craig direct registrar login, the NS flip step requires client to do it live (screenshare or instructions). Plan for both paths.

## Code Examples

### Navbar logo swap (POLISH-01)

```tsx
// src/app/components/Navbar.tsx — lines 44-55 replacement
// Source: existing file + Next.js 16 Image API verified against
//         nextjs.org/docs/app/getting-started/images (2026-04-15)
<a href="#" className="flex items-center group">
  <Image
    src={scrolled ? "/images/logo-dark.png" : "/images/logo.png"}
    alt="The Skin Cafe"
    width={360}
    height={130}
    priority
    sizes="(max-width: 768px) 160px, 240px"
    className="h-20 w-auto transition-all group-hover:scale-110"
  />
</a>
```

### Lighthouse CLI run (POLISH-03 deliverable)

```bash
# Source: lighthouse v13.1.0 --help; verified against developer.chrome.com/docs/lighthouse/overview
# Must run against production URL post-cutover for the deliverable
npx lighthouse https://theskincafe.net \
  --preset=mobile \
  --output=html \
  --output-path=.planning/phases/04-launch-polish-handoff/lighthouse-homepage-mobile.html \
  --chrome-flags="--headless"

# Verify Performance score >= 90 in the HTML report "Performance" circle
# Commit the HTML file to the repo (POLISH-03: "report committed to the repo")
```

### Playwright responsive smoke test (POLISH-02)

```typescript
// tests/responsive.spec.ts
// Source: playwright.dev/docs/emulation — device descriptors
import { test, expect, devices } from '@playwright/test';

const viewports = [
  { name: 'mobile-375', width: 375, height: 812 },
  { name: 'tablet-768', width: 768, height: 1024 },
  { name: 'desktop-1280', width: 1280, height: 800 },
];

const paths = ['/', '/#services', '/#team', '/#gallery', '/#locations', '/#contact'];

for (const vp of viewports) {
  for (const path of paths) {
    test(`${vp.name} ${path} no horizontal scroll`, async ({ page }) => {
      await page.setViewportSize({ width: vp.width, height: vp.height });
      await page.goto(`https://theskincafe.net${path}`);
      const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
      const clientWidth = await page.evaluate(() => document.documentElement.clientWidth);
      expect(scrollWidth).toBeLessThanOrEqual(clientWidth + 1); // 1px tolerance
    });
  }
}
```

### Post-cutover HTTP→HTTPS verification

```bash
# Verify HTTP redirects to HTTPS (Vercel handles this automatically)
curl -sI http://theskincafe.net | head -5
# Expected: HTTP/2 308  + location: https://theskincafe.net/

# Verify www redirects to apex (or vice versa, depending on primary choice)
curl -sI http://www.theskincafe.net | head -5
curl -sI https://www.theskincafe.net | head -5
# Expected: HTTP/2 308  + location: https://theskincafe.net/

# Verify SSL is Vercel-issued (not Cloudflare)
curl -sI https://theskincafe.net | grep -i server
# Expected: server: Vercel
# NOT: server: cloudflare (that would mean proxy is on — STOP)
```

### Cloudflare proxy status verification

```bash
# Confirm neither the apex nor www is being proxied by Cloudflare
# If proxied, A record returns a Cloudflare IP (104.x.x.x, 172.x.x.x) instead of Vercel's 76.76.21.21
dig theskincafe.net @1.1.1.1 +short
# Expected: 76.76.21.21

dig www.theskincafe.net @1.1.1.1 +short
# Expected: cname.vercel-dns.com.  + a Vercel IP (76.76.x.x)
```

## State of the Art

| Old Approach | Current Approach (2026) | Why |
|--------------|-------------------------|-----|
| 301 redirect for HTTP→HTTPS | 308 redirect (Vercel default) | 308 preserves method+body for non-GET; semantically cleaner for APIs. Both are SEO-equivalent. [VERIFIED: vercel.com/docs/redirects "Redirect status codes"] |
| Custom middleware for www↔apex | Dashboard-level Domain Redirect | Runs at edge before app code; zero app latency. [VERIFIED: vercel.com/docs/redirects "Domain Redirects"] |
| Cloudflare Universal SSL + Origin CA stacked with host | Vercel-managed Let's Encrypt, Cloudflare DNS-only | Vercel's own Edge Network is CDN + compute; stacking Cloudflare adds latency + breaks firewall visibility. [VERIFIED: vercel.com/guides/cloudflare-with-vercel] |
| Manual cross-browser testing on 10 devices | Playwright device emulation + 1 real-device smoke | Emulation catches 95%+ of layout bugs at zero cost. [CITED: browserstack.com/guide/playwright-mobile-automation] |
| Pages Router + `getStaticProps` | App Router + Server Components (default) | Default server-component rendering ships less JS; framework-level LCP improvements. [VERIFIED: nextjs.org docs] — this project is already App Router. |
| Verbal handoff + Zoom walkthrough | Committed HANDOFF.md + recorded Loom | Searchable, versioned, reusable. [CITED: elementor, webflow handoff guides] |

**Deprecated:**
- Using `<img>` tag directly for above-the-fold assets in Next.js apps → use `next/image` with `priority`.
- Cloudflare "Flexible SSL" mode (encrypt only user→Cloudflare, plaintext Cloudflare→origin) → this is unsafe and incompatible with Vercel; not applicable here because we're DNS-only.
- Lighthouse v10-era scores ≥ 90 being "easy." Lighthouse v13 (current) has stricter thresholds on CLS and INP (replaced FID). Target 93+ preview score for margin.

## Assumptions Log

| # | Claim | Section | Risk if Wrong |
|---|-------|---------|---------------|
| A1 | Production domain is `theskincafe.net` | Throughout | Minor — all DNS + record references parameterize on actual domain; planner confirms with client. Carried over from Phase 1 Assumption A1. |
| A2 | Phase 1 work is complete: Cloudflare zone exists, TTLs lowered to 60s, records audited, Craig has Admin on all client accounts | DNS Cutover Sequence | High if wrong — would need to fall back into Phase 1 work. Should be verified as a phase-start precondition. |
| A3 | Phase 2 + 3 features are deployed to Vercel and functioning on preview URL before Phase 4 starts | Wave Ordering | Medium — if not, revision round and Lighthouse pass happen against incomplete site. Plan should include a "feature-complete verification" Wave 0 task. |
| A4 | Vercel project is on the client's team (INFRA-01 from Phase 1 done) | Domain attach | High if wrong — domain would attach to Neural Rebel team, not client. Precondition check required. |
| A5 | Client will accept one round of revisions as a written, bounded scope | Pitfall 7 | Medium — if client wants open-ended revisions, milestone scope creeps. Mitigation: written capture up front. |
| A6 | Client has direct registrar access OR will work with Craig live during NS flip | Environment Availability | Medium — plan must accommodate either path. |
| A7 | Hero video can be deferred/poster'd without client objection | Pitfall 4 | Low — if client wants autoplay video on mobile, Lighthouse ≥ 90 mobile becomes materially harder. Surface tradeoff explicitly during revision round. |
| A8 | Dark-on-light logo is delivered as PNG at same dimensions as current `logo.png` (360×130) | POLISH-01 code example | Low — if dimensions differ, `width`/`height` props need updating. If SVG, use `<img>` or `<Image unoptimized>`. Easy to handle at implementation time. |
| A9 | Vercel project is Hobby plan; team member seats not a constraint | Architecture | Very low — technical path identical on Hobby vs Pro. |
| A10 | GitHub repo ownership transfer (Option A→B from Phase 1) happens in this phase or is explicitly deferred post-handoff | Runtime State / Handoff doc | Low — document whichever path is chosen; doesn't block launch. |
| A11 | ASSUMED: 308 redirect satisfies ROADMAP criterion "HTTP 301s to HTTPS" | Redirect pattern | Very low — 301 and 308 are both "permanent redirect" and SEO-equivalent; if client specifically asks for 301, Vercel project redirect config accepts either status. [ASSUMED — not explicitly confirmed with user] |

## Open Questions

1. **Does Craig have direct registrar access, or is client mediating?**
   - What we know: Phase 1 delegated the NS flip to Phase 4 but didn't record registrar-access arrangement.
   - What's unclear: Whether Craig logs into the registrar directly or walks client through it.
   - Recommendation: First plan task = confirm registrar access path with client. If client-mediated, schedule a 15-min live call for the flip.

2. **Does client want apex (`theskincafe.net`) or www (`www.theskincafe.net`) as primary?**
   - What we know: Vercel supports either via Anycast; no technical preference.
   - What's unclear: Client brand/SEO preference.
   - Recommendation: Default apex (simpler, shorter). Confirm with client during revision round.

3. **Is the hero video already compressed for mobile, or will this phase need to touch it?**
   - What we know: PROJECT.md mentions "Hero with video background — existing." Weight unknown.
   - What's unclear: Whether Lighthouse baseline shows video as LCP culprit.
   - Recommendation: Capture weight as part of Wave 1 Lighthouse baseline; plan a "video optimization" task as conditional (skip if not in critical path).

4. **GitHub repo transfer — execute during Phase 4 or defer beyond?**
   - What we know: Phase 1 recommended Option A (defer to Phase 4).
   - What's unclear: Client GitHub org status.
   - Recommendation: Include as an explicit client-decision gate in the plan. If client has org ready, do the transfer as part of handoff. If not, stay on Option A + note in HANDOFF.md as a "future task."

5. **Does the client want Craig retained for emergency SSL/DNS support post-handoff, or is this a clean break?**
   - What we know: Out-of-scope per additional context ("ongoing maintenance retainer … separate engagement").
   - What's unclear: Whether HANDOFF.md should list Craig's contact as "emergency support" vs "best-effort response."
   - Recommendation: Default to "best-effort, no SLA." Offer retainer as a separate conversation post-launch.

## Sources

### Primary (HIGH confidence)
- [Vercel — Working with SSL Certificates](https://vercel.com/docs/domains/working-with-ssl) — Let's Encrypt, HTTP-01 challenge, auto-renewal
- [Vercel — Redirects](https://vercel.com/docs/redirects) — 307/308 status codes, Domain Redirects via dashboard, URL normalization
- [Vercel — Cloudflare with Vercel guide](https://vercel.com/guides/cloudflare-with-vercel) — explicit "do not use reverse proxy in front of Vercel" recommendation, firewall visibility
- [Vercel — Deploying & Redirecting Domains](https://vercel.com/docs/domains/working-with-domains/deploying-and-redirecting) — apex-vs-www primary choice, Anycast
- [Vercel — Troubleshooting domains](https://vercel.com/docs/domains/troubleshooting) — SSL stall causes (CAA, IPv6, proxy)
- [Next.js — Image Optimization](https://nextjs.org/docs/app/getting-started/images) — `next/image` props, `sizes` hint, local vs remote
- [Playwright — Emulation](https://playwright.dev/docs/emulation) — device descriptors, viewport + user-agent presets
- [Phase 1 research](../01-client-infrastructure-provisioning/01-RESEARCH.md) — DNS baseline, Cloudflare zone state, TTL lowering, record definitions

### Secondary (MEDIUM confidence)
- [Vercel community — Cloudflare proxy cert failure thread](https://community.vercel.com/t/custom-domain-stuck-on-failed-to-generate-cert-cloudflare-proxy/22662) — confirms the SSL-stall-due-to-proxy pattern
- [dev.to — Next.js Performance Optimization: The 2026 Complete Guide](https://dev.to/bean_bean/nextjs-performance-optimization-the-2026-complete-guide-1a9k) — server components default, 2026 baseline practices
- [wisp.blog — Mastering Mobile Performance: Next.js Lighthouse Scores](https://www.wisp.blog/blog/mastering-mobile-performance-a-complete-guide-to-improving-nextjs-lighthouse-scores) — font removal, image sizing, realistic 90+ targets
- [dev.to — Next.js Lighthouse Optimization: 42 to 97 Case Study](https://dev.to/amansuryavanshi-ai/nextjs-lighthouse-optimization-42-to-97-case-study-4h6a) — realistic polish-phase impact
- [BrowserStack — Playwright Mobile Automation in 2026](https://www.browserstack.com/guide/playwright-mobile-automation) — emulation vs real-device tradeoffs
- [TestDino — Playwright Mobile Testing 2026 Guide](https://testdino.com/blog/playwright-mobile-testing/) — same
- [Elementor — How to Handover a Website To Your Clients](https://elementor.com/blog/how-to-handover-website-client/) — handoff doc template and credential-sharing practices
- [Webflow — How to hand off websites to clients](https://webflow.com/blog/hand-off-a-website) — 6-step structure, scope-of-revisions pattern
- [Whatfix — How to Create Helpful Handover Documentation](https://whatfix.com/blog/handover-documentation/) — runbook + rotation-procedure structure
- [Upstat — Runbooks and Operational Procedures Guide](https://upstat.io/blog/runbook-procedures-guide) — credential-rotation runbook format
- [GitHub — Vercel Discussion #5227 Cloudflare Origin CA integration](https://github.com/vercel/vercel/discussions/5227) — Origin CA + Vercel requires Enterprise; confirms DNS-only is the Hobby/Pro path

### Tertiary (LOW confidence — flagged)
- None used in final recommendations; all critical claims cross-verified against primary or official sources.

## Metadata

**Confidence breakdown:**
- DNS/SSL cutover mechanics: HIGH — Vercel + Cloudflare + Let's Encrypt docs all verified.
- Cloudflare proxy decision (DNS-only): HIGH — explicit Vercel guidance, community-confirmed failure modes.
- Next.js 16 Image/Font patterns: HIGH — verified against next.js docs 2026-04-15 snapshot.
- Lighthouse ≥ 90 achievability: HIGH — project already uses next/font + next/image; no architectural blockers identified.
- Handoff doc structure: MEDIUM — synthesized from multiple industry sources, not a single authoritative spec.
- Playwright vs BrowserStack choice for brochure-site scale: MEDIUM — based on cost/scope judgment more than verified tool capability.
- Revision-round scope control: MEDIUM — pattern is widely recommended across handoff literature, but execution depends on client cooperation.

**Research date:** 2026-04-20
**Valid until:** 2026-05-20 (30 days — Vercel, Cloudflare, Let's Encrypt, and Next.js 16 all stable quarter-over-quarter; no known breaking changes upcoming)
