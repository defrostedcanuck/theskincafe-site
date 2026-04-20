# The Skin Cafe — Website

## What This Is

A production website for The Skin Cafe, a Gilbert + Scottsdale, Arizona beauty & aesthetics studio with two locations. The site is a brochure + booking funnel today; the engagement evolves it into a brochure + education hub + community engine.

Stack: Next.js 16 + React 19 + Tailwind v4 + Resend + Zod, deployed on Vercel. Square online booking integrated for both locations. Repo: `/Users/craigr/theskincafe-site`.

## Core Value

**Extended customer service, digitized.** The Skin Cafe's reputation — decades in the industry — is built on proactive check-ins, aftercare follow-ups, and reminders to make time for self-care. The site must reinforce that experience: patrons should feel valued, educated, and beautiful after every visit.

The single most important thing the site must do well: **make visitors feel taken care of**, from the first landing-page scroll to the post-treatment aftercare page.

## Context

**Client:** Tammy + team (The Skin Cafe). Decades of industry experience, strong reputation, strong brand.

**Engagement structure:** Two paid milestones.
- **Milestone 1 (this milestone) — $2,000** *(regularly $3,500)* — polish existing site, add "Our Community" placeholder, add "Behind the Glow — Coming Soon" teaser with email capture (feeds Square Marketing list), SEO baseline, provision client-owned infrastructure (Vercel/Resend/Cloudflare).
- **Milestone 2 (future) — $2,000** — Payload CMS with dedicated Neon DB, "Behind the Glow" content hub, homepage content strip, Square Marketing list integration for site-captured leads, admin training.

**Marketing platform:** Client already uses **Square Marketing** (their booking is also Square). All customer contact — newsletters, campaigns, promotions — runs through Square. The website's role is to capture emails and push them into Square's customer directory via the Square API, not to stand up a parallel email platform. Resend stays in the stack for transactional mail only (contact form notifications).

**Future phases (parking lot, not scoped yet):**
- Phase 3: Aftercare system + QR cards
- Phase 4: Community deepening (Instagram sync, before/after gallery, loyalty)
- Phase 5: Polish & growth (search, RSS, segmentation, analytics)

**Proposal doc:** `/Users/craigr/theskincafe-site/PROPOSAL.md` (gitignored).

## Requirements

### Validated

- ✓ Hero with video background — existing
- ✓ Services catalog with filtering — existing
- ✓ Team showcase — existing
- ✓ Gallery — existing
- ✓ Locations (Gilbert + Scottsdale) — existing
- ✓ Contact form — existing
- ✓ Square online booking per location — existing
- ✓ Testimonials section — existing
- ✓ Responsive mobile design — existing
- ✓ Logo wordmark in Navbar + Footer — existing

### Active (Milestone 1)

- [ ] "Our Community" section — reframe existing testimonials, add Instagram link-out, staff bios w/ years-in-industry
- [ ] "Behind the Glow — Coming Soon" teaser block with email capture; form POSTs to Square Customer Directory API so leads land in client's existing Square Marketing list
- [ ] Resend wired for transactional mail (contact form notifications to staff)
- [ ] SEO baseline — sitemap, robots.txt, OG images, page-level metadata
- [ ] Analytics — Vercel Analytics or Google Analytics installed
- [ ] Client-owned infrastructure — Vercel team, Resend account, Cloudflare zone (DNS + domain), SSL
- [ ] Dark-on-light logo variant wired for scrolled navbar (replaces current CSS invert hack when client supplies it)
- [ ] One round of revisions applied

### Out of Scope (this milestone)

- Payload CMS — deferred to Milestone 2
- "Behind the Glow" content hub (live articles) — deferred to Milestone 2
- Standing up a separate newsletter platform — not needed; client uses Square Marketing
- Aftercare pages + QR cards — deferred to Phase 3
- Instagram auto-sync + before/after gallery — deferred to Phase 4
- Before/after gallery with consent workflow — deferred to Phase 4

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Name the content hub "Behind the Glow" (working name) | Positions articles as insider expertise, matches the client's decades-of-experience brand moat. Working name — may change after client review. | Pending client approval |
| Use Payload CMS (self-hosted in Next app) | Matches existing Neon + Vercel stack, no separate service, gives staff a proper editor, fully client-ownable | Confirmed for Milestone 2 |
| New Neon project (not branch) for content DB | End-of-engagement handoff — client owns their own Neon project cleanly | Confirmed for Milestone 2 |
| Client-owned infra from day one | No platform lock-in; clean handoff; no ongoing hosting fees paid to agency | Confirmed for Milestone 1 |
| Use Square Marketing for all customer contact (not Resend Broadcasts / Mailchimp / etc.) | Client already uses Square for booking and marketing; avoids duplicate platform, training, and billing. Website captures emails and syncs to Square customer directory via API. | Confirmed |
| CSS `invert` on scrolled navbar as stopgap | Logo supplied is white-only; invert flips to dark on light backgrounds. Client will supply dark variant later. | In place; remove when client delivers dark variant |

## Evolution

This document evolves at phase transitions and milestone boundaries.

**After each phase transition** (via `/gsd-transition`):
1. Requirements invalidated? → Move to Out of Scope with reason
2. Requirements validated? → Move to Validated with phase reference
3. New requirements emerged? → Add to Active
4. Decisions to log? → Add to Key Decisions
5. "What This Is" still accurate? → Update if drifted

**After each milestone** (via `/gsd-complete-milestone`):
1. Full review of all sections
2. Core Value check — still the right priority?
3. Audit Out of Scope — reasons still valid?
4. Update Context with current state

---
*Last updated: 2026-04-20 after initialization*
