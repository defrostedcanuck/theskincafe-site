# Requirements — The Skin Cafe Website

**Milestone scope:** Milestone 1 (Launch & Foundation) — $2,000
**Future milestones:** Milestone 2 (Education Hub & CMS), Phase 3+ (Aftercare, Community, Polish)

---

## v1 Requirements (Milestone 1)

### Community (placeholder for future hub)

- [ ] **COMM-01**: Visitor can view an "Our Community" section on the homepage that showcases existing testimonials in a visually elevated layout distinct from a generic testimonial list
- [ ] **COMM-02**: Visitor can see staff bios emphasizing years-in-industry on the Team section, reinforcing decades of expertise
- [ ] **COMM-03**: Visitor can click an Instagram link-out from the community section to follow the Skin Cafe social presence
- [ ] **COMM-04**: Visitor can see a "Behind the Glow — Coming Soon" teaser block that signals an upcoming education hub

### Lead Capture

- [ ] **LEAD-01**: Visitor can submit their email address from the "Behind the Glow" teaser block to be notified when content launches
- [ ] **LEAD-02**: Submitted emails are written to the client's existing Square Customer Directory via the Square API, landing in their Square Marketing list automatically (no separate ESP)
- [ ] **LEAD-03**: Submitter sees a confirmation message and protection against double-submit
- [ ] **LEAD-04**: API failures (Square down, invalid token) are logged and surfaced to the user with a graceful fallback message
- [ ] **LEAD-05**: Contact form submissions trigger a transactional email notification to staff via Resend

### SEO Baseline

- [ ] **SEO-01**: Site serves a valid `sitemap.xml` generated from Next.js routes
- [ ] **SEO-02**: Site serves a valid `robots.txt` permitting crawlers appropriately
- [ ] **SEO-03**: Every page has unique title, description, and Open Graph metadata
- [ ] **SEO-04**: Homepage and key landing pages serve OG images rendered in the brand style
- [ ] **SEO-05**: Structured data (LocalBusiness schema.org JSON-LD) is emitted on location-relevant pages for Gilbert and Scottsdale

### Analytics

- [ ] **ANLY-01**: Vercel Analytics is installed and reporting pageviews and core web vitals
- [ ] **ANLY-02**: Key events (booking CTA clicks per location, email signups) are tracked as custom events

### Infrastructure Handoff

- [ ] **INFRA-01**: Site is deployed on a client-owned Vercel team (not agency's)
- [ ] **INFRA-02**: A client-owned Resend account is provisioned with verified sending domain and API key configured in Vercel env vars
- [ ] **INFRA-03**: Client-owned Cloudflare zone manages DNS for the production domain; domain transferred or nameservers pointed appropriately
- [ ] **INFRA-04**: Production domain serves SSL via Vercel's managed certs
- [ ] **INFRA-05**: Square API credentials for the customer directory integration are stored in Vercel env vars on the client's team
- [ ] **INFRA-06**: Handoff documentation lists every service, account owner, login URL, and credential-reset procedure

### Polish

- [ ] **POLISH-01**: Client supplies a dark-on-light logo variant; it replaces the current CSS `invert` stopgap in the scrolled navbar state
- [ ] **POLISH-02**: Responsive behavior verified across mobile (375px), tablet (768px), desktop (1280px+)
- [ ] **POLISH-03**: Lighthouse performance score ≥ 90 on homepage (mobile) after polish
- [ ] **POLISH-04**: One round of client-requested revisions applied

---

## v2 Requirements (Milestone 2 — not scoped for commitment yet)

### Content Hub

- [ ] **CMS-01**: Payload CMS installed inside the Next.js app, admin UI served at `/admin`
- [ ] **CMS-02**: Dedicated Neon Postgres project provisioned under client ownership
- [ ] **CMS-03**: Content models defined: Article, Author, Category, Brand
- [ ] **CMS-04**: Media uploads work via Vercel Blob from the Payload editor
- [ ] **CMS-05**: Role-based access: `admin` and `editor` with seed accounts for staff
- [ ] **HUB-01**: "Behind the Glow" landing page at `/behind-the-glow` lists published articles with category filtering
- [ ] **HUB-02**: Article detail pages render with title, hero image, author attribution, body, related services, and a soft booking CTA
- [ ] **HUB-03**: Homepage displays a "Fresh from Behind the Glow" strip featuring the 3 most recent articles
- [ ] **HUB-04**: RSS feed served for the Behind the Glow section

### Training & Content

- [ ] **TRAIN-01**: 1-hour Zoom walkthrough delivered to staff on publishing workflow
- [ ] **TRAIN-02**: Written cheat sheet delivered covering common publishing tasks
- [ ] **SEED-01**: 3 seed articles written and published at launch with staff collaboration

---

## Out of Scope

- **Separate email platform (Mailchimp, ConvertKit, Resend Broadcasts)** — client uses Square Marketing; site feeds that list, does not replace it
- **Custom booking engine** — Square online booking already integrated and working for both locations; no reason to replace
- **E-commerce** — no product sales planned on the site
- **Patron accounts / gated content** — not required; education hub is public
- **Aftercare QR cards and per-treatment aftercare pages** — deferred to Phase 3
- **Instagram auto-sync feed, before/after gallery with consent workflow** — deferred to Phase 4
- **Full-text search across articles, newsletter segmentation, A/B testing** — deferred to Phase 5
- **Mobile app** — web-first; no native app in scope

---

## Traceability

| REQ-ID   | Phase   | Status  |
|----------|---------|---------|
| COMM-01  | Phase 2 | Pending |
| COMM-02  | Phase 2 | Pending |
| COMM-03  | Phase 2 | Pending |
| COMM-04  | Phase 2 | Pending |
| LEAD-01  | Phase 2 | Pending |
| LEAD-02  | Phase 2 | Pending |
| LEAD-03  | Phase 2 | Pending |
| LEAD-04  | Phase 2 | Pending |
| LEAD-05  | Phase 2 | Pending |
| SEO-01   | Phase 3 | Pending |
| SEO-02   | Phase 3 | Pending |
| SEO-03   | Phase 3 | Pending |
| SEO-04   | Phase 3 | Pending |
| SEO-05   | Phase 3 | Pending |
| ANLY-01  | Phase 3 | Pending |
| ANLY-02  | Phase 3 | Pending |
| INFRA-01 | Phase 1 | Pending |
| INFRA-02 | Phase 1 | Pending |
| INFRA-03 | Phase 1 | Pending |
| INFRA-04 | Phase 4 | Pending |
| INFRA-05 | Phase 1 | Pending |
| INFRA-06 | Phase 4 | Pending |
| POLISH-01| Phase 4 | Pending |
| POLISH-02| Phase 4 | Pending |
| POLISH-03| Phase 4 | Pending |
| POLISH-04| Phase 4 | Pending |

**Coverage:** 26/26 Active requirements mapped. No orphans, no duplicates.

---
*Last updated: 2026-04-20 after roadmap creation*
