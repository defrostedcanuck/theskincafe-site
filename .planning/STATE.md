# STATE — The Skin Cafe Website

## Project Reference

**Core value:** Extended customer service, digitized. The site must make visitors feel taken care of from first scroll to post-treatment aftercare.

**Current focus:** Milestone 1 — Launch & Foundation ($2,000, ~1 week). Polish the existing brochure site, wire up Square Customer Directory email capture, Resend transactional mail, SEO baseline, and stand up client-owned infrastructure (Vercel / Resend / Cloudflare / Square API).

**Stack:** Next.js 16, React 19, Tailwind v4, Resend (transactional only), Square API (Customer Directory + Booking), Vercel.

**Out of scope this milestone:** Payload CMS, live "Behind the Glow" articles, aftercare pages, Instagram sync, separate ESP. These live in Milestone 2 / Phases 3–5.

## Current Position

**Milestone:** Milestone 1 — Launch & Foundation
**Phase:** 1 — Client Infrastructure Provisioning (not started)
**Plan:** None yet
**Status:** Roadmap approved; ready for `/gsd-plan-phase 1`
**Progress:** Phase 0/4 complete `[░░░░░░░░░░] 0%`

## Performance Metrics

| Metric | Current | Target |
|--------|---------|--------|
| Active requirements mapped | 26/26 | 26/26 |
| Phases complete | 0/4 | 4/4 |
| Lighthouse (mobile, homepage) | Not yet measured | ≥ 90 |
| Production domain on client infra | No | Yes |

## Accumulated Context

### Decisions Logged
- Square Marketing is the single customer-contact platform. Site captures emails and pushes to Square Customer Directory via Square API. Resend is transactional-only.
- Client owns all infrastructure from day one (Vercel team, Resend account, Cloudflare zone, Square API keys). No agency-hosted anything.
- Education hub is working-named "Behind the Glow" — teaser only in Milestone 1, full hub in Milestone 2.
- CSS `invert` on scrolled navbar logo is a stopgap; replaced in Phase 4 when client delivers dark-on-light variant.

### Open Todos
- Await client: Vercel team created, Resend account created, Cloudflare account provisioned, Square API credentials issued.
- Confirm staff notification email address for Resend contact-form deliveries.
- Confirm OG image direction (photograph-driven vs typographic) before Phase 3.

### Active Blockers
- None at roadmap stage. Phase 1 will surface client-action blockers as they appear.

### Architectural Notes for Planners
- **Next.js 16 is not the Next.js in your training data.** Read `node_modules/next/dist/docs/` before writing metadata, route handlers, or config. Heed deprecation notices.
- Tailwind v4 uses the new CSS-first config; do not generate `tailwind.config.js` without checking current project conventions.
- React 19 is the runtime; server actions + new form APIs are available.
- The repo is brownfield — the Validated requirements in PROJECT.md already exist. Do not rebuild them.

## Session Continuity

**Last session:** Roadmap created 2026-04-20. 4 phases derived from 26 Active requirements, coarse granularity, 100% coverage validated.

**Next session action:** `/gsd-plan-phase 1` to decompose Client Infrastructure Provisioning into executable plans.

---
*Last updated: 2026-04-20 after roadmap creation*
