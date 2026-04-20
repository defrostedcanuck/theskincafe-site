# Roadmap — The Skin Cafe Website

**Milestone:** Milestone 1 — Launch & Foundation ($2,000, ~1 week)
**Granularity:** coarse
**Coverage:** 26/26 Active requirements mapped

> **Architecture note for planners:** This project runs Next.js 16 + React 19 + Tailwind v4. It is **not** the Next.js you know from training data. Per `AGENTS.md`, planners MUST consult `node_modules/next/dist/docs/` before writing code for any phase below. Metadata APIs, route handlers, and config conventions have changed.

---

## Phases

- [ ] **Phase 1: Client Infrastructure Provisioning** — Stand up client-owned Vercel, Resend, Cloudflare, and Square API credentials so deploy + integrations work against client accounts, not the agency's.
- [ ] **Phase 2: Community & Lead Capture** — Ship the "Our Community" reframe, "Behind the Glow — Coming Soon" teaser, Square Customer Directory email capture, and Resend contact-form notifications.
- [ ] **Phase 3: SEO & Analytics Baseline** — Sitemap, robots, per-page metadata, OG images, LocalBusiness JSON-LD, Vercel Analytics + custom events.
- [ ] **Phase 4: Launch Polish & Handoff** — Dark logo variant, responsive + Lighthouse pass, one round of revisions, SSL cutover on client domain, handoff documentation.

---

## Phase Details

### Phase 1: Client Infrastructure Provisioning
**Goal**: Client owns every account the site runs on, and all agency work is deploying to client-owned infrastructure.
**Depends on**: Nothing (starts first; runs in parallel with Phase 2 dev work)
**Requirements**: INFRA-01, INFRA-02, INFRA-03, INFRA-05
**Success Criteria** (what must be TRUE):
  1. `git push` to main deploys to a Vercel project owned by the client's Vercel team, not Neural Rebel's.
  2. A Resend account under the client's ownership exists with the production sending domain verified (SPF, DKIM, DMARC green in the Resend dashboard), and its API key is set in the client Vercel project's env vars.
  3. The production domain's authoritative DNS is a Cloudflare zone under a client-owned Cloudflare account (nameservers at the registrar point to Cloudflare), and Craig has Admin-role access for the duration of the build.
  4. Square API credentials (access token + location ID(s)) for the Customer Directory write scope are stored in client Vercel env vars for Preview and Production; a dev-mode key is available for local testing without polluting the client's real list.
  5. An explicit handoff-cutover checklist exists listing which client actions are blocking (account creation, invitations accepted, DNS delegation) vs which are already unblocked.
**Client actions required** (cannot proceed without):
  - Create Vercel team; invite craig@neuralrebel.ai as Admin.
  - Create Resend account; invite Craig; approve domain-verification DNS records when requested.
  - Create/confirm Cloudflare account owning the `theskincafe.com` zone; invite Craig as Admin.
  - Generate Square production API credentials (or approve Craig generating them from a client-logged-in session) with Customer Directory write permission.
**Plans**: 5 plans
Plans:
- [ ] 01-01-PLAN.md — DNS baseline audit + handoff-cutover checklist (Craig-unblocked; Wave 1)
- [ ] 01-02-PLAN.md — Vercel project transfer to client team + env-var catalog scaffold (Wave 2; blocks on client Vercel team + billing)
- [ ] 01-03-PLAN.md — Cloudflare zone creation + DNS mirror + TTL reduction (NS flip deferred to Phase 4) (Wave 2; blocks on client Cloudflare invite)
- [ ] 01-04-PLAN.md — Resend account + sending-domain verification + Vercel env seed (Wave 3; blocks on client Resend invite + Plans 02 + 03)
- [ ] 01-05-PLAN.md — Square Developer app + sandbox/prod token issuance + Vercel env seed (Wave 3; blocks on client Square access + Plan 02)

### Phase 2: Community & Lead Capture
**Goal**: A visitor can feel the Skin Cafe's decades-of-care brand in the "Our Community" section, opt into the future education hub, and have their email land in the client's existing Square Marketing list — while staff get notified of contact-form submissions in near-real-time.
**Depends on**: Phase 1 (Square + Resend credentials) for end-to-end verification; UI/markup work can begin in parallel against dev-mode credentials.
**Requirements**: COMM-01, COMM-02, COMM-03, COMM-04, LEAD-01, LEAD-02, LEAD-03, LEAD-04, LEAD-05
**Success Criteria** (what must be TRUE):
  1. Visitor loads the homepage and sees an "Our Community" section that reads as a community showcase (not a generic testimonial carousel), with an Instagram link-out that opens the Skin Cafe IG in a new tab.
  2. Visitor sees staff bios on the Team section that surface "years in the industry" prominently for each team member.
  3. Visitor sees a "Behind the Glow — Coming Soon" teaser block with a functional email-capture form, and submitting a valid email displays a confirmation state and prevents double-submission on the same click.
  4. An email submitted through the teaser appears in the client's Square Customer Directory within 60 seconds, tagged/listed such that it lands in their existing Square Marketing list.
  5. When the Square API is unreachable or rejects a request, the form displays a graceful fallback message to the visitor, the failure is logged server-side, and no uncaught errors reach the browser console.
  6. A contact-form submission triggers a Resend transactional email to the staff notification address within 30 seconds, containing the submitter's name, email, and message.
**Plans**: TBD
**UI hint**: yes

### Phase 3: SEO & Analytics Baseline
**Goal**: Search engines can discover, understand, and correctly render every public page of the site; the client can see real visitor and conversion data in a dashboard they own.
**Depends on**: Phase 1 (needs client Vercel team for Vercel Analytics to belong to the client), Phase 2 (email-signup event requires the signup form to exist).
**Requirements**: SEO-01, SEO-02, SEO-03, SEO-04, SEO-05, ANLY-01, ANLY-02
**Success Criteria** (what must be TRUE):
  1. `https://<prod-domain>/sitemap.xml` returns a valid sitemap enumerating all public routes; `https://<prod-domain>/robots.txt` returns a valid file allowing general crawlers and pointing to the sitemap.
  2. Every public route returns a unique `<title>`, `<meta description>`, and a complete Open Graph tag set (title, description, image, url, type) verified by viewing source on at least one route per page type.
  3. The homepage and each location page serve a branded OG image (1200x630) that renders cleanly when a link to the page is pasted into iMessage, Slack, or LinkedIn.
  4. The Gilbert and Scottsdale location pages emit valid `LocalBusiness` JSON-LD that passes Google's Rich Results test with zero errors.
  5. Vercel Analytics is enabled on the client's Vercel team and shows pageview + Web Vitals data in the dashboard within 24 hours of production deploy.
  6. Custom events fire and appear in Vercel Analytics for: per-location booking CTA click (distinguishable Gilbert vs Scottsdale) and "Behind the Glow" email signup.
**Plans**: TBD

### Phase 4: Launch Polish & Handoff
**Goal**: The site is visibly and measurably production-ready on the client's own domain, the client has accepted one round of revisions, and the client has documentation to operate and take over every service without Craig.
**Depends on**: Phase 1 (domain + SSL cutover), Phase 2 (features to polish), Phase 3 (analytics to verify post-launch).
**Requirements**: POLISH-01, POLISH-02, POLISH-03, POLISH-04, INFRA-04, INFRA-06
**Success Criteria** (what must be TRUE):
  1. The production domain (not a `vercel.app` preview) serves the site over HTTPS with a valid, Vercel-managed certificate, and HTTP requests 301 to HTTPS.
  2. The scrolled-navbar state renders the client-supplied dark-on-light logo variant as a native asset (no CSS `invert` filter remaining anywhere in the Navbar code path).
  3. Manual walkthrough at 375px, 768px, and 1280px viewport widths shows no horizontal scroll, no broken layouts, and no clipped CTAs on the homepage, services, team, gallery, locations, and contact pages.
  4. Lighthouse mobile run on the production homepage returns Performance ≥ 90, with the report committed to the repo or linked from the handoff doc.
  5. One round of client-requested revisions has been captured in writing, implemented, and signed off by the client.
  6. A handoff document exists in the repo listing every service (Vercel, Resend, Cloudflare, Square, Vercel Analytics), the account owner, login URL, where credentials live, how to rotate them, and how to reach Craig for support.
**Plans**: TBD
**UI hint**: yes

---

## Progress

| Phase | Plans Complete | Status | Completed |
|-------|----------------|--------|-----------|
| 1. Client Infrastructure Provisioning | 0/5 | Plans created | - |
| 2. Community & Lead Capture | 0/0 | Not started | - |
| 3. SEO & Analytics Baseline | 0/0 | Not started | - |
| 4. Launch Polish & Handoff | 0/0 | Not started | - |

---

## Coverage Map

| Requirement | Phase |
|-------------|-------|
| COMM-01 | Phase 2 |
| COMM-02 | Phase 2 |
| COMM-03 | Phase 2 |
| COMM-04 | Phase 2 |
| LEAD-01 | Phase 2 |
| LEAD-02 | Phase 2 |
| LEAD-03 | Phase 2 |
| LEAD-04 | Phase 2 |
| LEAD-05 | Phase 2 |
| SEO-01 | Phase 3 |
| SEO-02 | Phase 3 |
| SEO-03 | Phase 3 |
| SEO-04 | Phase 3 |
| SEO-05 | Phase 3 |
| ANLY-01 | Phase 3 |
| ANLY-02 | Phase 3 |
| INFRA-01 | Phase 1 |
| INFRA-02 | Phase 1 |
| INFRA-03 | Phase 1 |
| INFRA-04 | Phase 4 |
| INFRA-05 | Phase 1 |
| INFRA-06 | Phase 4 |
| POLISH-01 | Phase 4 |
| POLISH-02 | Phase 4 |
| POLISH-03 | Phase 4 |
| POLISH-04 | Phase 4 |

**Validation:** 26/26 Active requirements mapped, zero orphans, zero duplicates.

---
*Last updated: 2026-04-20 after roadmap creation*
