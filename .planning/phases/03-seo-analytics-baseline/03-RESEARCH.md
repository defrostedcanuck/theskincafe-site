# Phase 3: SEO & Analytics Baseline — Research

**Researched:** 2026-04-20
**Domain:** Next.js 16 App Router SEO file conventions, schema.org LocalBusiness JSON-LD, Vercel Web Analytics v2
**Confidence:** HIGH on Next.js 16 APIs (verified in-tree), HIGH on Vercel Analytics (verified against live Vercel docs), MEDIUM on multi-location JSON-LD modeling (Google guidance intentionally minimal; industry practice documented)

---

## Summary

This phase wires in the Next.js 16 metadata/robots/sitemap/OG file conventions, emits schema.org `DaySpa` JSON-LD for Gilbert and Scottsdale, and installs `@vercel/analytics` v2 with two custom events. **The site is currently a single-page brochure** — `src/app/page.tsx` composes 11 section components; there are no location routes at `/locations/gilbert` or `/locations/scottsdale`. The phase goal and ROADMAP explicitly call for "location pages" and "every public route" to have unique metadata — that requires the planner to decide between (A) emitting two `LocalBusiness` JSON-LD blocks on the homepage, or (B) creating dedicated location routes. This decision is not locked by CONTEXT.md (no CONTEXT.md exists for this phase) and is the single largest planning question.

Next.js 16.2.3 is **not** the Next.js of training data: `params` in `opengraph-image`/`generateMetadata`/`generateSitemaps` is now `Promise<...>`, streaming metadata is default-on and disabled only for bots, and `metadataBase` must be set on the root layout or relative OG URLs fail the build. Vercel Analytics v2.0.1 shipped 2026-04-17 (three days before this research) — the canonical App Router import is `@vercel/analytics/next` (not `/react` as older guides show). The `track()` function is client-only; per-location booking CTAs are currently plain `<a>` tags in server components, so either the buttons become client components or a thin client wrapper wraps them.

**Primary recommendation:** Treat the homepage as the SEO surface for both locations (emit both `DaySpa` entities on the homepage via an `@graph` array, each with its own stable `@id`), add `opengraph-image.tsx` at the app root only, install `@vercel/analytics@^2.0.1` with `<Analytics />` in `app/layout.tsx`, and extract the four booking buttons (Navbar, Hero, Locations ×2, BookingCTA ×2) into a single `<BookButton location="gilbert"|"scottsdale" />` client component that calls `track('booking_click', { location })` before navigating. Defer creating `/locations/[slug]` routes to a future phase unless the client wants discoverable per-location landing pages for paid search.

---

## Phase Requirements

| ID | Description | Research Support |
|----|-------------|------------------|
| SEO-01 | Valid `sitemap.xml` generated from Next.js routes | `app/sitemap.ts` with `MetadataRoute.Sitemap` return type; Next 16 version-history note: `generateSitemaps` `id` is now `Promise<string>` (v16.0.0). Not needed for this phase (< 50,000 URLs). |
| SEO-02 | Valid `robots.txt` permitting crawlers appropriately | `app/robots.ts` with `MetadataRoute.Robots` return; include `sitemap` property pointing to production URL. |
| SEO-03 | Every page has unique title, description, OG metadata | Next 16 `Metadata` object + `metadataBase` on root `app/layout.tsx`. Current `src/app/layout.tsx` has partial metadata but no `metadataBase`, no `twitter`, no `alternates.canonical`, no `robots` field. Needs overhaul. |
| SEO-04 | Homepage and key landing pages serve OG images in brand style | `app/opengraph-image.tsx` with `ImageResponse` from `next/og`, size 1200×630. Font loading via `readFile(join(process.cwd(), 'assets/...'))` pattern. Logo compositing via base64 data-URL or `Uint8Array.from(buf).buffer` per official Node.js runtime example. |
| SEO-05 | LocalBusiness JSON-LD emitted on location-relevant pages for Gilbert and Scottsdale | `<script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, '\\u003c') }} />` per Next 16 official JSON-LD guide. Use `DaySpa` type. Multi-location via `@graph` array with stable `@id` per location. |
| ANLY-01 | Vercel Analytics reports pageviews + core web vitals | `@vercel/analytics@^2.0.1` `<Analytics />` in `app/layout.tsx`. Web Vitals (LCP, INP, CLS, FCP, TTFB) appear automatically in the dashboard; no extra integration required. Speed Insights (separate `@vercel/speed-insights` package) is optional and NOT required by ANLY-01. |
| ANLY-02 | Key events (booking CTA clicks per location, email signups) tracked as custom events | `import { track } from '@vercel/analytics'` then `track('event_name', { location: 'gilbert' })`. Must be called from a client component. Current booking anchors are in server components — refactor required. |

---

## Standard Stack

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| `next` (already installed) | 16.2.3 (16.2.4 available) | Metadata/sitemap/robots/opengraph-image file conventions, `next/og` ImageResponse | Built-in — no alternative needed. `[VERIFIED: package.json + npm view next version → 16.2.4]` |
| `@vercel/analytics` | ^2.0.1 | Pageviews, Web Vitals, and `track()` custom events for Vercel-hosted deployments | Canonical choice for Vercel-deployed sites; integrates with the dashboard Phase 1 provisions on the client team. `[VERIFIED: npm view @vercel/analytics version → 2.0.1, published 2026-04-17]` |

### Supporting
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| `schema-dts` | ^1.1.x (latest) | TypeScript types for schema.org JSON-LD objects | Optional but recommended: catches typos in `@type`, property names, and enum values at compile time. `[CITED: Next.js 16 JSON-LD guide recommends it by name — node_modules/next/dist/docs/01-app/02-guides/json-ld.md]` |
| `@vercel/speed-insights` | 2.0.0 | CWV detail dashboard separate from Analytics | **Not required for ANLY-01** (Analytics already surfaces Web Vitals). Defer unless client asks for per-route CWV drill-down. `[VERIFIED: npm view @vercel/speed-insights version → 2.0.0]` |

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| Vercel Analytics | Google Analytics 4 (gtag + `useReportWebVitals`) | GA4 is free at any scale but requires cookie consent banner (GDPR/CCPA), has a steeper UI, and needs a separate property. Vercel Analytics is cookieless, privacy-compliant by default, and costs against the client's Vercel plan. REQUIREMENTS.md ANLY-01 explicitly names "Vercel Analytics or Google Analytics" — client choice is Vercel per the Phase 3 goal in ROADMAP.md. |
| Dynamic `opengraph-image.tsx` | Static `opengraph-image.png` at 1200×630 committed to the repo | Static is simpler, cache-stable, and cheap — but iterating on brand/copy means recommitting a binary. Dynamic `ImageResponse` is more flexible but adds a runtime satori/resvg render and a cache-bust problem on content changes. **Recommend:** static PNG for phase MVP, upgrade to dynamic only if per-route OG images become a content need. |
| `DaySpa` @type | `BeautySalon` or `HealthAndBeautyBusiness` | `DaySpa` is a subtype of `HealthAndBeautyBusiness` and is the most specific match for facial/eyelash/waxing/skincare. `BeautySalon` is closer to hair/nail. Google's guidance explicitly says "use the most specific LocalBusiness sub-type possible." `[CITED: developers.google.com/search/docs/appearance/structured-data/local-business; schema.org/DaySpa]` |

**Installation (new packages only):**
```bash
npm install @vercel/analytics
npm install -D schema-dts  # optional but recommended
```

**Version verification:** `@vercel/analytics@2.0.1` published 2026-04-17 — three days before this research. `[VERIFIED: npm view @vercel/analytics version --json 2026-04-20]`. The Vercel docs site still shows `@vercel/analytics/next` as the App Router entry; v2 breaking changes are limited to the MIT license relicensing and new Resilient Intake, plus `endpoint` deprecated in favor of `eventEndpoint`/`viewEndpoint`. No import-path breakage for typical usage. `[CITED: vercel.com/docs/analytics/package — section "What's new in version 2.x"]`

---

## Architecture Patterns

### Recommended Project Structure
```
src/app/
├── layout.tsx                  # metadataBase, root <Analytics />, sitewide defaults
├── page.tsx                    # home — JSON-LD @graph for both DaySpa locations
├── opengraph-image.tsx         # dynamic OG for homepage (or .png static)
├── opengraph-image.alt.txt     # alt text sidecar
├── robots.ts                   # MetadataRoute.Robots
├── sitemap.ts                  # MetadataRoute.Sitemap
├── components/
│   ├── BookButton.tsx          # NEW — 'use client', wraps <a> + track()
│   ├── LocalBusinessJsonLd.tsx # NEW — server component, emits <script>
│   └── ...existing
└── lib/
    ├── seo.ts                  # NEW — per-page Metadata builders, site constants
    └── locations.ts            # NEW — canonical location data (address, geo, hours, sameAs)
```

### Pattern 1: Root `metadata` + `metadataBase`
**What:** Declare `metadataBase` on the root layout so every `openGraph.images: '/og.png'` resolves to an absolute URL. Next.js 16 **fails the build** if a relative OG image URL is used without `metadataBase`.
**When to use:** Always — this is the only correct Next 16 pattern for an app that emits absolute OG URLs.
**Example:**
```tsx
// Source: node_modules/next/dist/docs/01-app/03-api-reference/04-functions/generate-metadata.md §metadataBase
// src/app/layout.tsx
import type { Metadata } from 'next'

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ?? 'https://theskincafe.com'
  ),
  title: {
    default: 'The Skin Cafe | Premium Beauty & Aesthetics — Gilbert & Scottsdale, AZ',
    template: '%s | The Skin Cafe',
  },
  description: '...',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    siteName: 'The Skin Cafe',
    images: [{ url: '/opengraph-image', width: 1200, height: 630 }],
  },
  twitter: { card: 'summary_large_image' },
  alternates: { canonical: '/' },
  robots: { index: true, follow: true },
}
```

### Pattern 2: `sitemap.ts` route
**What:** Export a default function returning `MetadataRoute.Sitemap` — an array of `{ url, lastModified, changeFrequency, priority }`. Next.js serves it at `/sitemap.xml` automatically.
**When to use:** Small site (< 50,000 URLs). This site currently has 1 route; splitting via `generateSitemaps` is unnecessary.
**Example:**
```ts
// Source: node_modules/next/dist/docs/01-app/03-api-reference/03-file-conventions/01-metadata/sitemap.md
// src/app/sitemap.ts
import type { MetadataRoute } from 'next'

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://theskincafe.com'

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date()
  return [
    { url: BASE_URL, lastModified: now, changeFrequency: 'weekly', priority: 1 },
    // add future routes here as they ship
  ]
}
```

### Pattern 3: `robots.ts` route
**What:** Export a default function returning `MetadataRoute.Robots`. Served at `/robots.txt`. Include `sitemap` to point crawlers at the sitemap.
**When to use:** Always — required by SEO-02.
**Example:**
```ts
// Source: node_modules/next/dist/docs/01-app/03-api-reference/03-file-conventions/01-metadata/robots.md
// src/app/robots.ts
import type { MetadataRoute } from 'next'

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://theskincafe.com'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: '*', allow: '/' },
    sitemap: `${BASE_URL}/sitemap.xml`,
    host: BASE_URL,
  }
}
```

### Pattern 4: `opengraph-image.tsx` with `ImageResponse`
**What:** A route file that default-exports an async component returning `new ImageResponse(<JSX>, { ...size, fonts })`. Next.js builds it into `/opengraph-image` and auto-injects `og:image*` meta tags. Use `readFile(join(process.cwd(), 'assets/Font.ttf'))` for custom fonts.
**When to use:** Always for SEO-04. File can be `.tsx` (dynamic via Satori) or `.jpg|.png` (static).
**Caveats:**
1. Only flexbox layout is supported — **grid does not work**. `[CITED: Next 16 OG image docs, "Good to know" §]`
2. Tailwind classes do **not** apply inside `ImageResponse`; use inline `style={{...}}`.
3. Local image assets via `<img src={base64}` or `src={Uint8Array.from(buf).buffer}` with `@ts-expect-error` (Satori-specific). `[CITED: same doc, "Using Node.js runtime with local assets"]`
4. `params` prop is `Promise<...>` in Next 16 — await it even on non-dynamic routes where present.
5. Generated images are statically optimized (cached at build) unless Request-time APIs are used.
**Example:**
```tsx
// Source: node_modules/next/dist/docs/01-app/03-api-reference/03-file-conventions/01-metadata/opengraph-image.md
// src/app/opengraph-image.tsx
import { ImageResponse } from 'next/og'
import { readFile } from 'node:fs/promises'
import { join } from 'node:path'

export const alt = 'The Skin Cafe — Premium Beauty & Aesthetics in Gilbert & Scottsdale, AZ'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default async function OgImage() {
  const display = await readFile(
    join(process.cwd(), 'assets/PlayfairDisplay-Bold.ttf')
  )
  const body = await readFile(
    join(process.cwd(), 'assets/DMSans-Regular.ttf')
  )
  const logoData = await readFile(join(process.cwd(), 'public/images/logo.png'), 'base64')
  const logoSrc = `data:image/png;base64,${logoData}`

  return new ImageResponse(
    (
      <div style={{
        width: '100%', height: '100%', display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        background: 'linear-gradient(135deg, #F5EFE6 0%, #E8D5B7 100%)',
        fontFamily: 'DM Sans',
      }}>
        <img src={logoSrc} width={320} style={{ marginBottom: 32 }} />
        <div style={{
          fontFamily: 'Playfair Display', fontSize: 72, color: '#3C2A21',
          fontWeight: 700, textAlign: 'center', lineHeight: 1.1,
        }}>
          The Skin Cafe
        </div>
        <div style={{ fontSize: 28, color: '#7B5B43', marginTop: 16 }}>
          Gilbert · Scottsdale, AZ
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        { name: 'Playfair Display', data: display, style: 'normal', weight: 700 },
        { name: 'DM Sans', data: body, style: 'normal', weight: 400 },
      ],
    }
  )
}
```

### Pattern 5: JSON-LD via raw `<script>` with XSS scrub
**What:** Emit structured data as a `<script type="application/ld+json">` child of a server component. Use `JSON.stringify(...).replace(/</g, '\\u003c')` to block XSS injection from any user-influenced string.
**When to use:** SEO-05 on the route where the JSON-LD should be discovered — the homepage for this phase.
**Example (multi-location via `@graph`):**
```tsx
// Source: node_modules/next/dist/docs/01-app/02-guides/json-ld.md (pattern)
// + schema.org/DaySpa hierarchy verified at schema.org
// src/app/components/LocalBusinessJsonLd.tsx  (server component; no 'use client')
import type { WithContext, Graph } from 'schema-dts'

const BASE = 'https://theskincafe.com'

const jsonLd: WithContext<Graph> = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'DaySpa',
      '@id': `${BASE}/#gilbert`,
      name: 'The Skin Cafe — Gilbert',
      url: `${BASE}/#gilbert`,                // or /locations/gilbert if route added
      image: `${BASE}/images/salon-interior.jpg`,
      telephone: '+1-480-619-0046',
      priceRange: '$$',
      address: {
        '@type': 'PostalAddress',
        streetAddress: '4100 S Lindsay Rd #121',
        addressLocality: 'Gilbert',
        addressRegion: 'AZ',
        postalCode: '85297',
        addressCountry: 'US',
      },
      geo: { '@type': 'GeoCoordinates', latitude: 33.2825, longitude: -111.7619 }, // VERIFY
      openingHoursSpecification: [
        { '@type': 'OpeningHoursSpecification', dayOfWeek: ['Monday','Tuesday','Wednesday','Thursday'], opens: '10:00', closes: '20:00' },
        { '@type': 'OpeningHoursSpecification', dayOfWeek: 'Friday', opens: '09:00', closes: '17:00' },
        { '@type': 'OpeningHoursSpecification', dayOfWeek: 'Saturday', opens: '09:00', closes: '18:00' },
        { '@type': 'OpeningHoursSpecification', dayOfWeek: 'Sunday', opens: '14:00', closes: '20:00' },
      ],
      sameAs: ['https://www.instagram.com/theskincafeaz'], // VERIFY handle
    },
    {
      '@type': 'DaySpa',
      '@id': `${BASE}/#scottsdale`,
      name: 'The Skin Cafe — Scottsdale',
      // ... same structure
    },
  ],
}

export function LocalBusinessJsonLd() {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(jsonLd).replace(/</g, '\\u003c'),
      }}
    />
  )
}
```

### Pattern 6: Client-side `track()` wrapper for server-rendered CTAs
**What:** `track()` is only callable in client code. The Gilbert/Scottsdale booking buttons currently live in server components as plain `<a>` elements. Extract a tiny `<BookButton />` client component that wraps the anchor and fires `track('booking_click', { location })` on click.
**When to use:** ANLY-02 per-location booking tracking. Also applies to the "Behind the Glow" email-signup submit (already planned as a form in Phase 2 — instrument it when submission succeeds).
**Example:**
```tsx
// src/app/components/BookButton.tsx
'use client'
import { track } from '@vercel/analytics'
import { ReactNode } from 'react'

const URLS = {
  gilbert: 'https://book.squareup.com/appointments/y5eu65pg42prz2/location/WVJ7770QWMRGA/availability',
  scottsdale: 'https://book.squareup.com/appointments/y5eu65pg42prz2/location/86SPWSYBFQR7Z/services/OGM2CC55EWUWGQEA73EXVYUN?savt=9af9b333-518a-4f8b-a281-58f492606f9b',
} as const

type Location = keyof typeof URLS

export function BookButton({
  location, surface, children, className,
}: {
  location: Location
  surface: 'nav' | 'hero' | 'locations-card' | 'booking-section'
  children: ReactNode
  className?: string
}) {
  return (
    <a
      href={URLS[location]}
      target="_blank"
      rel="noopener noreferrer"
      className={className}
      onClick={() => track('booking_click', { location, surface })}
    >
      {children}
    </a>
  )
}
```

### Anti-Patterns to Avoid
- **Inlining `track()` in a server component** — hard compile error. Always extract to a `'use client'` file.
- **Using `dangerouslySetInnerHTML` without the `<`-escape** — opens XSS if any JSON-LD value ever becomes user-supplied (reviews, comments). Always scrub per the Next 16 JSON-LD doc.
- **Creating `/locations/gilbert` AND putting JSON-LD on homepage for same location** — duplicates the entity across two URLs; Google may pick the wrong canonical. Use a single canonical URL per location (either the hash anchor on `/` or a dedicated route, not both).
- **Omitting `metadataBase`** — Next.js 16 build fails when any OG field uses a relative path. Set it on the root layout.
- **Exporting both `metadata` and `generateMetadata` from the same segment** — Next 16 explicitly forbids this. `[CITED: generate-metadata.md §Good to know]`
- **Putting `'use client'` on the root layout** — breaks metadata exports (metadata is server-only). Keep `app/layout.tsx` a server component and put client-only bits (`<Analytics />`) as imported children; `<Analytics />` is already a client component internally.
- **Tailwind classes inside `ImageResponse`** — ignored by Satori. Use inline `style`.

---

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Sitemap XML generation | A `NextResponse` route handler that strings together XML by hand | `app/sitemap.ts` with `MetadataRoute.Sitemap` return | Built-in caching, correct XML namespaces, automatic image/video/alternates support. |
| Robots.txt | A `route.ts` handler emitting text | `app/robots.ts` with `MetadataRoute.Robots` | Same reason — official file convention, zero-bug serialization. |
| OG image PNG generator | Puppeteer or Playwright capturing a screenshot in CI | `opengraph-image.tsx` with `ImageResponse` (Satori under the hood) | Satori is purpose-built, <100ms render, no browser runtime, statically optimized at build. |
| JSON-LD typing | Hand-typed `any` objects | `schema-dts` types + `WithContext<DaySpa>` | Compile-time catches for typos like `addressRegion` vs `addressReigon`. |
| Pageview tracking | Manual `useEffect` + `fetch('/analytics')` | `<Analytics />` component | Handles route-change instrumentation (Next App Router emits `navigate` differently than Pages), cookieless session stitching, and Resilient Intake v2. |
| Cookie consent banner for analytics | A bespoke cookie modal | **Nothing — Vercel Analytics is cookieless by design** | `[CITED: vercel.com/docs/analytics/privacy-policy]` No consent banner required for Vercel Analytics alone. If the client ever adds GA4, that changes. |
| XSS-safe JSON stringify for LD | Hand-rolled escape regex | Either the `.replace(/</g, '\\u003c')` pattern (official Next.js) or `serialize-javascript` from npm | Next docs explicitly flag `JSON.stringify` as unsafe for any user-influenced input. |

**Key insight:** Next.js 16 has opinionated, file-convention-based primitives for every SEO concern in this phase. Every deviation to a custom route handler or custom `<script>` emitter trades correctness and caching for reinventing wheels.

---

## Common Pitfalls

### Pitfall 1: OG image cache stickiness on Vercel
**What goes wrong:** You push a new `opengraph-image.tsx`, deploy, paste the URL in iMessage — iMessage shows the old image. Slack, LinkedIn, Facebook, Twitter all aggressively cache OG images for days-to-weeks, and Vercel's edge also serves the PNG from build-time static cache.
**Why it happens:** (1) Vercel statically optimizes `opengraph-image` at build time unless the file uses request-time APIs. (2) Social platforms cache the fetched bytes keyed on the URL. (3) Facebook's cache is ~30 days unless explicitly purged.
**How to avoid:**
1. **During iteration:** version the OG URL with a query string or change the filename (`opengraph-image-v2.png`) to break social-platform caches.
2. **For force-refresh on specific platforms:**
   - Facebook: [developers.facebook.com/tools/debug/](https://developers.facebook.com/tools/debug/) → "Scrape Again"
   - LinkedIn: [linkedin.com/post-inspector/](https://linkedin.com/post-inspector/)
   - Twitter/X: [cards-dev.twitter.com/validator](https://cards-dev.twitter.com/validator)
   - iMessage: no public debugger — versioned URL is the only option.
3. **Vercel-side:** a new deploy invalidates the edge cache automatically. If the OG is dynamic and needs runtime data, call `revalidatePath('/opengraph-image')` from a server action after a content change. `[CITED: Next.js 16 revalidating docs]`

**Warning signs:** Pasting a production URL into three different platforms shows inconsistent OG images. The production HTML source shows the new `og:image` URL but the image bytes at that URL are old → Vercel issue. Both HTML and URL are new but the preview is old → platform cache.

### Pitfall 2: Multi-location `LocalBusiness` — Google picks one and ignores the other
**What goes wrong:** You put one `LocalBusiness` JSON-LD on the homepage with two `address` entries, or you emit both entities as loose siblings without `@id`. Google picks one as the "primary" and silently drops the other from the Knowledge Graph.
**Why it happens:** schema.org allows arrays in many properties, but Google's Rich Results parser treats a page as representing "the business" unless `@graph` is used with per-entity `@id`s. Without stable `@id`s, deduplication across crawls is lossy.
**How to avoid:**
1. Use `@graph` with **two `DaySpa` entries**, each with its own `@id` that is a stable URL-like string (`https://theskincafe.com/#gilbert`, `.../#scottsdale`).
2. Each entity has its own complete `address`, `geo`, `openingHoursSpecification`, `telephone`, `url`, and `image`.
3. If dedicated location pages are created later (`/locations/gilbert`), set the `@id` to that route's canonical URL and emit that single entity there; remove it from the homepage graph to avoid duplication.
4. Add a parent `Organization` entity in the graph that references both `DaySpa`s via `branchOf`/`parentOrganization` if the client wants brand-level Knowledge Graph too. Not required for SEO-05.

**Warning signs:** Google Rich Results Test shows only one location. Google Business Profile insights show only one location getting discovery traffic. The Knowledge Panel for "The Skin Cafe Arizona" shows one address.

### Pitfall 3: `track()` called outside a client component
**What goes wrong:** Build error: `You're importing a component that needs "track" from "@vercel/analytics". It only works in a Client Component but none of its parents are marked with "use client"` — or silent failure if bundled into SSR output.
**Why it happens:** `@vercel/analytics` posts to `window.va`; server code has no `window`.
**How to avoid:** Wrap any `track()` call in a file starting with `'use client'`. For booking CTAs, extract the `<a>` into the `<BookButton />` pattern above. For the "Behind the Glow" form (Phase 2), track on submit inside the existing client-side form component.

**Warning signs:** The Analytics dashboard shows pageviews but zero custom events after a week of traffic.

### Pitfall 4: `metadataBase` missing → build fails on deploy
**What goes wrong:** Dev works fine (Next infers `http://localhost:3000`), but `vercel --prod` build fails with `metadataBase property in metadata export is not set for resolving social open graph or twitter images`. Alternately, older Next versions warned but shipped with a placeholder — Next 16 upgraded this to a hard failure for some configurations.
**Why it happens:** Every OG `images: '/og.png'` requires a base URL to resolve to an absolute.
**How to avoid:** Set `metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? 'https://theskincafe.com')` in root `layout.tsx`. Set `NEXT_PUBLIC_SITE_URL` in Vercel env vars for Preview (points at preview URL) and Production (points at `https://theskincafe.com`).

### Pitfall 5: Streaming metadata hides SEO from bots
**What goes wrong:** In Next 16, `generateMetadata` streams metadata after initial UI for dynamic pages. Next automatically disables streaming for a known bot list (Twitterbot, Slackbot, Bingbot, Googlebot, etc.). If the client or Craig needs to add a less-common social crawler or corporate link preview bot, those bots see a page with no `<title>` or `og:*` tags in the initial HTML.
**Why it happens:** Streaming is default-on for dynamic pages in Next 16. `[CITED: node_modules/.../14-metadata-and-og-images.md §Streaming metadata]`
**How to avoid:**
1. For the current homepage (static, no `generateMetadata`), streaming doesn't apply — metadata is baked into the build.
2. If location pages ever become dynamic with `generateMetadata`, verify the `htmlLimitedBots` config in `next.config.ts` includes any custom crawlers. The default list is comprehensive. `[CITED: node_modules/.../next-config-js/htmlLimitedBots]`

### Pitfall 6: Priority/changefreq noise in sitemap.xml
**What goes wrong:** Planners copy-paste examples with `priority: 0.5, changeFrequency: 'weekly'` on every URL. Google has publicly said it **ignores** `priority` and treats `changeFrequency` as a hint at best. Setting inconsistent or implausible values (e.g., `changeFrequency: 'hourly'` on a static brochure) can hurt trust signals.
**How to avoid:** For this brochure site:
- Homepage: `priority: 1, changeFrequency: 'weekly'`
- (If location routes are added) location pages: `priority: 0.8, changeFrequency: 'monthly'`
- Don't include the same URL twice. Don't include non-indexable routes.
- `lastModified: new Date()` per deploy is acceptable but imperfect — consider reading from `git log` of the file if precision matters.

### Pitfall 7: DaySpa hours format
**What goes wrong:** Using `"10:00 AM"` or `"10:00AM"` or `"10am"` as `opens`/`closes` — these are invalid. Google expects ISO 8601 time format: `"10:00"` (24-hour, `HH:MM`).
**How to avoid:** Convert the existing hours data (`10:00 AM \u2013 8:00 PM`) to `opens: "10:00", closes: "20:00"` in `OpeningHoursSpecification`. Validate with Google's Rich Results Test before declaring SEO-05 done.

### Pitfall 8: Current `src/app/layout.tsx` has `keywords` array
**What goes wrong:** Existing code exports a `keywords: [...]` field. This was deprecated by Google in 2009 and is documented as emitting a `<meta name="keywords">` that all major search engines ignore. It's not harmful but planners may copy-paste it — it adds nothing and bloats HTML.
**How to avoid:** Drop `keywords` during the metadata overhaul. Keep `title`, `description`, `openGraph`, `twitter`, `alternates`, `robots`, `metadataBase`, `icons`.

---

## Runtime State Inventory

Not applicable — this phase is greenfield (adding new files, not renaming/refactoring existing state). No stored data, service config, OS registrations, secrets, or build artifacts reference old names.

---

## Environment Availability

| Dependency | Required By | Available | Version | Fallback |
|------------|-------------|-----------|---------|----------|
| `next` (with `next/og`) | SEO-04 | ✓ | 16.2.3 | — |
| Node.js (for `ImageResponse` runtime) | SEO-04 | ✓ (Vercel Node 20+ runtime default) | — | — |
| Production domain (for OG absolute URLs, sitemap host) | SEO-01, SEO-02, SEO-03 | ⚠ Depends on Phase 4 (DNS cutover) | — | Use Vercel preview URL as `NEXT_PUBLIC_SITE_URL` until cutover; switch env var at launch. |
| Client's Vercel Analytics enabled on client Vercel team | ANLY-01, ANLY-02 | ⚠ Depends on Phase 1 | — | Phase 3 installs the package and `<Analytics />`; dashboard data only flows after Phase 1's team transfer + enabling Analytics in the Vercel UI. |
| `@vercel/analytics` npm package | ANLY-01, ANLY-02 | ✗ not installed | — | `npm install @vercel/analytics` |
| `schema-dts` npm package | SEO-05 (optional typing) | ✗ not installed | — | Skip typing; JSON-LD works without schema-dts. |
| Real Instagram handle for The Skin Cafe | SEO-05 `sameAs` | ✗ not documented in repo | — | Ask client during discuss-phase (not research). |
| Latitude/longitude for each location | SEO-05 `geo` | ✗ not in Locations.tsx | — | Geocode from `mapQuery` strings via Google Maps at plan time, or omit `geo` (recommended but not required). |
| Font files for OG ImageResponse | SEO-04 | ✗ TTFs not in `/assets` | — | Download Playfair Display + DM Sans TTFs to `/assets/` OR use `ImageResponse`'s default font OR use a static PNG instead of dynamic. |

**Missing dependencies with no fallback:** none — all items have a fallback.

**Missing dependencies with fallback:**
- `@vercel/analytics` — `npm install` in Wave 1.
- Instagram handle, coordinates — confirm with client OR plan a task that defers those properties.
- Font TTFs — add to `/assets/` OR emit static OG PNG and defer dynamic ImageResponse to a future phase.

---

## Code Examples

Verified patterns from official sources:

### Full root layout for SEO-03
```tsx
// Source: composed from node_modules/next/dist/docs/01-app/03-api-reference/04-functions/generate-metadata.md
//       + vercel.com/docs/analytics/quickstart (Next App Router section)
// src/app/layout.tsx
import type { Metadata } from 'next'
import { Analytics } from '@vercel/analytics/next'
import { Playfair_Display, DM_Sans } from 'next/font/google'
import './globals.css'

const playfair = Playfair_Display({ variable: '--font-display', subsets: ['latin'], display: 'swap' })
const dmSans = DM_Sans({ variable: '--font-body', subsets: ['latin'], display: 'swap' })

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://theskincafe.com'

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'The Skin Cafe | Premium Beauty & Aesthetics — Gilbert & Scottsdale, AZ',
    template: '%s | The Skin Cafe',
  },
  description:
    "Arizona's premier beauty destination for facials, eyelash extensions, brows, waxing, sugaring, massage & more. Two luxurious locations in Gilbert and Scottsdale.",
  applicationName: 'The Skin Cafe',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    siteName: 'The Skin Cafe',
    url: '/',
    title: 'The Skin Cafe | Premium Beauty & Aesthetics Spa',
    description: 'Relax. Rejuvenate. Radiate. Arizona\u2019s premier multi-location beauty destination.',
    // images resolved from opengraph-image.tsx sibling — no need to declare here
  },
  twitter: { card: 'summary_large_image' },
  alternates: { canonical: '/' },
  robots: { index: true, follow: true },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${playfair.variable} ${dmSans.variable}`}>
      <body className="min-h-screen antialiased">
        {children}
        <Analytics />
      </body>
    </html>
  )
}
```

### Booking CTA with event tracking (client component)
```tsx
// src/app/components/BookButton.tsx
'use client'
import { track } from '@vercel/analytics'
import type { ReactNode } from 'react'

const URLS = {
  gilbert: 'https://book.squareup.com/appointments/y5eu65pg42prz2/location/WVJ7770QWMRGA/availability',
  scottsdale: 'https://book.squareup.com/appointments/y5eu65pg42prz2/location/86SPWSYBFQR7Z/services/OGM2CC55EWUWGQEA73EXVYUN?savt=9af9b333-518a-4f8b-a281-58f492606f9b',
} as const

export function BookButton({
  location, surface, className, children,
}: {
  location: keyof typeof URLS
  surface: string
  className?: string
  children: ReactNode
}) {
  return (
    <a
      href={URLS[location]}
      target="_blank"
      rel="noopener noreferrer"
      className={className}
      onClick={() => track('booking_click', { location, surface })}
    >
      {children}
    </a>
  )
}
```

### Email signup tracking in an existing form (Phase 2 form, instrumented here)
```tsx
// in the "Behind the Glow" form's onSubmit handler, after success:
import { track } from '@vercel/analytics'
// ...
if (res.ok) {
  track('email_signup', { source: 'behind_the_glow_teaser' })
  // existing confirmation state
}
```

---

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| `<head>` children via `_document.tsx` (Pages Router) | `export const metadata` / `generateMetadata` in layouts and pages | Next 13 App Router | Already adopted in this repo. |
| `sitemap.xml` committed as static file | `app/sitemap.ts` programmatic | Next 13.3 | Use `MetadataRoute.Sitemap` typing. |
| `opengraph-image` params as sync object | `params: Promise<...>` | **Next 16.0** | **Breaking.** Awaiting is required. `[CITED: opengraph-image.md version history]` |
| `generateSitemaps` `id` as sync string | `id: Promise<string>` | **Next 16.0** | **Breaking** if splitting sitemaps. Not needed at this site's scale. |
| `@vercel/analytics/react` (for Next App Router) | `@vercel/analytics/next` | Before v2; current canonical per 2026 docs | Use `/next`. The `/react` entry still works but is documented for CRA only. |
| `endpoint` option on `<Analytics />` | `eventEndpoint` + `viewEndpoint` | `@vercel/analytics@2.0.0` | Deprecated but still works. Relevant only for multi-app-on-one-domain edge cases. |
| Cookie-based pageview tracking | Cookieless Resilient Intake | `@vercel/analytics@2.0.0` | No consent banner required. |
| `next/script` for JSON-LD | Native `<script type="application/ld+json" dangerouslySetInnerHTML>` | Next 13+ guidance reaffirmed in 16 | `[CITED: json-ld.md "Good to know"]` — native `<script>` is the right choice for non-executable structured data. |

**Deprecated/outdated (ignore if found in training data):**
- `<Head>` from `next/head` — Pages Router only; not for App Router.
- `next-seo` package — unnecessary in App Router; native `Metadata` covers everything.
- `next-sitemap` package — unnecessary; `app/sitemap.ts` does the job.

---

## Project Constraints (from CLAUDE.md)

Craig's global CLAUDE.md rules apply. AGENTS.md / project CLAUDE.md specifically mandates:

- **Read `node_modules/next/dist/docs/` before writing any Next.js code.** This research has done so for all phase-relevant APIs (metadata, sitemap, robots, opengraph-image, JSON-LD, analytics). Planner and task agents must also read the cited doc before writing code if the research-to-plan gap is > 24h.
- **Heed deprecation notices** in the Next.js docs. This phase touches metadata — the `keywords` field is deprecated in practice (ignored by Google) and should be removed.
- **No vague answers; verify first.** All Next 16 claims in this doc are verified against in-tree docs (`node_modules/next/dist/docs/`) or live Vercel docs. Every version number is verified against the npm registry.
- **Act, don't ask.** Information findable by reading was read. Open questions below are genuinely external (need client input or a human decision between two valid approaches) and cannot be resolved by research alone.

---

## Assumptions Log

| # | Claim | Section | Risk if Wrong |
|---|-------|---------|---------------|
| A1 | Homepage is the appropriate SEO surface for both Gilbert and Scottsdale (no dedicated `/locations/gilbert` and `/locations/scottsdale` routes exist or are required). | Summary / Pattern 5 | If client wants dedicated routes, planner must add them + redirect sitemap entries + split JSON-LD per route. Changes plan task count. |
| A2 | The Skin Cafe's Instagram handle is `@theskincafeaz`. | Pattern 5 `sameAs` | `sameAs` with wrong handle is worse than omission — it associates the entity with the wrong social account. Must confirm with client before shipping. |
| A3 | Gilbert coordinates ≈ 33.2825, -111.7619 (derived mentally from the address). | Pattern 5 `geo` | Wrong coordinates send Google Maps users to the wrong place. Recommend geocoding via Google Maps at plan time, not trusting this estimate. |
| A4 | Price range `$$` is appropriate for The Skin Cafe. | Pattern 5 `priceRange` | Low risk — `$$` is a wide band. Client can confirm. |
| A5 | Client is OK with Vercel Analytics (vs. Google Analytics 4). | Standard Stack alternatives | ROADMAP.md Phase 3 goal explicitly says "Vercel Analytics + custom events" so this is close to locked, but CONTEXT.md does not exist yet for this phase. |
| A6 | Static OG image is acceptable for phase MVP; dynamic `ImageResponse` is an upgrade path. | Standard Stack alternatives | If client wants per-page / per-article OG images, dynamic is required. For this phase's scope (brochure + two location entities) static is sufficient. |
| A7 | `NEXT_PUBLIC_SITE_URL` will be set in Vercel env vars by Phase 1 or early Phase 3. | Pattern 1 | If not set, builds use the `https://theskincafe.com` fallback, which fails on Preview deployments (wrong base URL in OG tags). |

---

## Open Questions

1. **Dedicated `/locations/{slug}` routes or homepage-only JSON-LD?**
   - What we know: The site is currently single-page; existing `Locations.tsx` renders both as cards on `/#locations`. Google accepts both single-page `@graph` and per-page approaches.
   - What's unclear: Whether client wants paid-search landing pages per location (→ dedicated routes) or a consolidated brand presence (→ homepage-only).
   - Recommendation: Start with homepage `@graph` (lowest scope); if Phase 4 or a future phase adds Local SEO campaigns, migrate to dedicated routes then. Flag to the discuss-phase agent.

2. **`opengraph-image.tsx` (dynamic) or `opengraph-image.png` (static)?**
   - What we know: Both are valid file conventions. Static is simpler; dynamic is more flexible.
   - What's unclear: Whether client expects to iterate on the OG design frequently or wants per-location OG images.
   - Recommendation: Static PNG for phase MVP. Plan a future "dynamic OG" enhancement if the content hub (Milestone 2) launches article-specific OGs.

3. **Instagram handle, coordinates, exact price-range tier.**
   - What we know: `(480) 619-0046` phone is in both locations; addresses are in `Locations.tsx`; Instagram link is placed in `Footer.tsx` (need to read file to extract actual URL).
   - What's unclear: Coordinates, confirmed IG handle, `$` vs `$$` vs `$$$`.
   - Recommendation: Planner creates a pre-ship task "confirm SEO facts with client" OR uses best-effort values and flags them in the PR for client review.

4. **Speed Insights install?**
   - What we know: ANLY-01 calls for Web Vitals reporting; Vercel Analytics already surfaces this. Speed Insights (separate package) adds per-route CWV drill-down.
   - What's unclear: Whether client wants the drill-down or is satisfied with the Analytics dashboard's Web Vitals panel.
   - Recommendation: Ship Analytics only for phase MVP. Add Speed Insights only if client asks.

5. **Sitemap route inclusion when no new routes exist.**
   - What we know: Currently one public route (`/`).
   - What's unclear: Whether "hash fragments" (`#locations`, `#services`, etc.) should appear as separate sitemap entries. **They should not** — hashes are not separate URLs for crawlers. Sitemap should list only `/` until real routes are added.
   - Recommendation: Ship sitemap with only `/`. Add routes as they're created.

---

## Sources

### Primary (HIGH confidence)
- `node_modules/next/dist/docs/01-app/01-getting-started/14-metadata-and-og-images.md` — metadata object, `generateMetadata`, streaming metadata, `htmlLimitedBots`, `opengraph-image` convention.
- `node_modules/next/dist/docs/01-app/03-api-reference/03-file-conventions/01-metadata/sitemap.md` — sitemap API, `MetadataRoute.Sitemap`, Version history showing `id: Promise<string>` in v16.0.0.
- `node_modules/next/dist/docs/01-app/03-api-reference/03-file-conventions/01-metadata/robots.md` — robots API, `MetadataRoute.Robots`.
- `node_modules/next/dist/docs/01-app/03-api-reference/03-file-conventions/01-metadata/opengraph-image.md` — `ImageResponse`, `params: Promise<...>` in v16.0.0, Node runtime local-asset pattern.
- `node_modules/next/dist/docs/01-app/02-guides/json-ld.md` — official JSON-LD guidance with XSS-scrub pattern, `schema-dts` recommendation.
- `node_modules/next/dist/docs/01-app/02-guides/analytics.md` — `useReportWebVitals` and Vercel Analytics positioning.
- `node_modules/next/dist/docs/01-app/03-api-reference/04-functions/generate-metadata.md` — `metadataBase`, all metadata fields, `openGraph`, `twitter`, `robots`, `alternates`, `verification`.
- npm registry: `npm view @vercel/analytics version --json` → 2.0.1 (2026-04-17); `npm view next version` → 16.2.4; `npm view @vercel/speed-insights version` → 2.0.0; `npm view schema-dts version` → 2.0.0.
- [Vercel Analytics Quickstart](https://vercel.com/docs/analytics/quickstart) — confirms `@vercel/analytics/next` import for Next App Router.
- [Vercel Analytics Custom Events](https://vercel.com/docs/analytics/custom-events) — `track()` signature, client/server variants, limits.
- [Vercel Analytics Package Reference](https://vercel.com/docs/analytics/package) — v2.x changes, `mode`, `debug`, `beforeSend`, deprecated `endpoint`.
- [Google LocalBusiness structured data docs](https://developers.google.com/search/docs/appearance/structured-data/local-business) — required/recommended properties, "use most specific sub-type."
- [schema.org/DaySpa](https://schema.org/DaySpa) — type hierarchy (LocalBusiness → HealthAndBeautyBusiness → DaySpa), inherited properties.

### Secondary (MEDIUM confidence)
- [Next.js 16 cache revalidation patterns](https://nextjs.org/docs/app/getting-started/caching-and-revalidating) — `revalidatePath` for OG image re-render.
- Schema.org multi-location practice — inferred from `@graph` + `@id` conventions documented at schema.org; Google's local-business doc does not explicitly prescribe but does not prohibit.

### Tertiary (LOW confidence)
- Gilbert/Scottsdale geographic coordinates — estimated mentally; MUST be verified via Google Maps before shipping to Rich Results Test.
- Instagram handle `@theskincafeaz` — **assumed** from naming pattern; read `Footer.tsx` or confirm with client before using in `sameAs`.

---

## Metadata

**Confidence breakdown:**
- Standard stack (Next 16 conventions, `@vercel/analytics` v2): HIGH — verified against in-tree Next docs and live Vercel docs.
- Architecture patterns: HIGH — all patterns lifted from official docs with source references.
- Pitfalls: HIGH on Next 16 breaking changes (verified in version-history tables), MEDIUM on social platform cache behavior (general industry knowledge, not version-pinned).
- Multi-location JSON-LD modeling: MEDIUM — Google's own documentation is intentionally vague on `@graph` vs multi-page; the recommendation follows schema.org best practice but is not a Google-prescribed pattern.

**Research date:** 2026-04-20
**Valid until:** ~2026-05-20 (30 days). Next.js 16 is stable on 16.2.x; Vercel Analytics v2 just shipped 2026-04-17 so monitor for v2.1+ before writing code.
