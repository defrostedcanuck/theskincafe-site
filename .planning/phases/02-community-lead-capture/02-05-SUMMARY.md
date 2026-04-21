---
phase: 02-community-lead-capture
plan: 05
subsystem: homepage-composition
tags: [community, testimonials, instagram, homepage, behind-the-glow]
requires:
  - src/app/components/BehindTheGlow.tsx (from 02-03)
  - src/app/components/ScrollReveal.tsx
  - src/app/globals.css (champagne/rose/espresso/cream tokens, gradient-text, section-divider)
provides:
  - Community section mounted on homepage (COMM-01, COMM-03)
  - BehindTheGlow teaser mounted on homepage (COMM-04 integration)
  - Legacy Testimonials carousel retired
affects:
  - src/app/page.tsx (final Phase 2 composition)
tech-stack:
  added: []
  patterns:
    - User-driven featured-quote swap (useState activeIndex) — NOT auto-rotating
    - Safe outbound link-out (target=_blank + rel=noopener noreferrer)
    - Avatar-wall interaction pattern (button, aria-pressed, accessible aria-label)
key-files:
  created:
    - src/app/components/Community.tsx
    - src/app/components/__tests__/Community.test.tsx
  modified:
    - src/app/page.tsx
  deleted:
    - src/app/components/Testimonials.tsx
decisions:
  - "Retire (not supplement) Testimonials.tsx — Pattern A Community replaces it in the same slot"
  - "Single Instagram handle (@theskincafe) as Footer.tsx already uses — flag as pre-launch client-confirmation"
  - "Use Camera icon from lucide-react (Instagram icon not exported in v1.8) — matches Footer convention"
metrics:
  duration_minutes: ~7
  tasks: 2
  files_created: 2
  files_modified: 1
  files_deleted: 1
  tests_added: 8
  total_tests_passing: 45
  completed: 2026-04-20
---

# Phase 02 Plan 05: Homepage Composition — Community + BehindTheGlow Summary

One-liner: Replaced the auto-rotating Testimonials carousel with a user-driven Community showcase (featured quote + 9-avatar wall + Instagram CTA, Pattern A from RESEARCH.md) and mounted the BehindTheGlow teaser between BookingCTA and Contact, finalizing Phase 2 homepage composition.

## Objective Recap

- Replace generic auto-rotating testimonial carousel (COMM-01 anti-pattern) with "Our Community" section distinct from carousel
- Mount the standalone BehindTheGlow teaser from Plan 02-03 (integration of COMM-04 end-to-end)
- Preserve all 9 testimonial entries as content (no data loss) — moved inline into Community.tsx
- Retire Testimonials.tsx file from the repo (git rm)

## Final Homepage Section Order

```
Hero → About → Services → Team → Community → Gallery → Locations → BookingCTA → BehindTheGlow → Contact
```

BehindTheGlow sits between BookingCTA and Contact so the email teaser rides the conversion wave AFTER the primary booking CTA (not competing) and BEFORE the contact form (secondary capture for visitors not ready to book).

## Tasks Completed

| Task | Name | Commit | Files |
|------|------|--------|-------|
| 1a (RED) | Add failing Community tests | `81ac2f6` | `src/app/components/__tests__/Community.test.tsx` |
| 1b (GREEN) | Implement Community (Pattern A) | `b08e0af` | `src/app/components/Community.tsx` |
| 2 | Mount Community + BehindTheGlow; delete Testimonials | `895d98d` | `src/app/page.tsx`, `src/app/components/Community.tsx`, `src/app/components/Testimonials.tsx` (deleted) |

## Community Component Shape (Pattern A)

- **Eyebrow:** "Our Community" in champagne tracking-[0.2em]
- **Heading:** "Decades of relationships, *measured in faces we know by name.*" (gradient-text on the bolded phrase)
- **Featured quote block:** cream-gradient card with decorative `Quote` icon, 5 champagne `Star` icons, italic pull-quote, attribution (name + service)
- **Avatar wall:** 9 circular 48px `<button type="button">` elements with initials (JJ, SG, AK, CM, JM, MB, HA, DT, CJ). Active avatar gets `ring-2 ring-champagne` + `bg-champagne text-white` + `scale-110`. Click swaps the featured quote.
- **Instagram CTA:** pill-shaped anchor, `rose→champagne` gradient, `Camera` icon + "Follow on Instagram" copy, `target=_blank` + `rel="noopener noreferrer"`, href `https://www.instagram.com/theskincafe`
- Wrapped in `ScrollReveal` blocks (fade-in for quote, fade-up for avatars + CTA) matching adjacent-section motion vocabulary
- `aria-live="polite"` on the featured quote so screen readers announce swap
- No `setInterval` / `useEffect` — user-driven only (rejects the carousel anti-pattern from COMM-01)

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 3 — Blocking] Lucide-react v1.8 does not export `Instagram` icon**
- **Found during:** Task 1 GREEN (first test run after component draft)
- **Issue:** `import { Instagram } from 'lucide-react'` resolved to `undefined`, causing React to throw "Element type is invalid" on render. Plan 02-05 task description specified `Instagram` as the icon import.
- **Fix:** Replaced `Instagram` with `Camera` — the exact icon `Footer.tsx` already uses for its Instagram link (`src/app/components/Footer.tsx:55`). Consistent with the existing convention.
- **Files modified:** `src/app/components/Community.tsx` (2 lines: import + JSX usage)
- **Commit:** folded into `b08e0af`
- **Impact:** None — the link semantics (`aria-label="Follow The Skin Cafe on Instagram"`, correct href, rel/target) are unchanged; only the icon glyph differs.

**2. [Rule 3 — Blocking] Plan-verification grep caught a stray "Testimonials" string**
- **Found during:** Task 2 verification (plan requires `! grep -r "Testimonials" src/app/`)
- **Issue:** A doc-comment in `Community.tsx` said "preserved verbatim from the retired Testimonials.tsx" — the only `src/app/` reference remaining after the file delete.
- **Fix:** Rephrased comment to "9 client quotes preserved verbatim from the retired carousel component" — content unchanged, grep-clean.
- **Files modified:** `src/app/components/Community.tsx` (3-line comment rewrite)
- **Commit:** folded into `895d98d`

### Worktree base reset
The executor's worktree HEAD was at `9dffc8a` (phase-2 planning commits, but pre-Phase-2 implementation). Plan 02-05 explicitly declares `depends_on: [02-01, 02-03]` and expects `BehindTheGlow.tsx` + the `@/app/actions/subscribe` graph to exist. Per the executor prompt's `<worktree_branch_check>` directive, ran `git reset --hard 301cb38a3d12b509db996460e3b33f0d7df52642` to align the working tree with the declared branch base (includes both 02-03 and 02-02 merges). Not a plan deviation — executed per explicit instruction.

## Verification Results

All plan-specified checks passed:

| Check | Result |
|-------|--------|
| `grep -q 'id="community"' src/app/components/Community.tsx` | ✓ |
| `grep -q 'href="https://www.instagram.com/' src/app/components/Community.tsx` | ✓ |
| `grep -q 'rel="noopener noreferrer"' src/app/components/Community.tsx` | ✓ |
| `grep -q 'target="_blank"' src/app/components/Community.tsx` | ✓ |
| `! grep -q "setInterval\|useEffect" src/app/components/Community.tsx` | ✓ (neither present) |
| `! test -f src/app/components/Testimonials.tsx` | ✓ (deleted via `git rm`) |
| `! grep -r "Testimonials" src/app/` | ✓ (scrubbed after Task 2) |
| `grep -q "import Community" src/app/page.tsx` | ✓ |
| `grep -q "import BehindTheGlow" src/app/page.tsx` | ✓ |
| `grep -q "<Community />" src/app/page.tsx` | ✓ |
| `grep -q "<BehindTheGlow />" src/app/page.tsx` | ✓ |
| `npm run build` | ✓ (`Compiled successfully in 3.3s`, static / route generated) |
| `npm test` | ✓ **45 tests across 8 files pass** (8 new Community tests + existing 37) |

### Test Inventory (full Phase 2 suite, single `npm test` invocation)

| File | Tests |
|------|-------|
| `src/app/actions/__tests__/contact.test.ts` | 7 |
| `src/app/actions/__tests__/subscribe.test.ts` | 11 |
| `src/app/components/__tests__/Community.test.tsx` | **8** (new) |
| `src/app/components/__tests__/Team.test.tsx` | 5 |
| `src/app/components/__tests__/BehindTheGlow.test.tsx` | 5 |
| `src/app/components/__tests__/Contact.test.tsx` | 5 |
| `src/test/smoke.test.ts` | 1 |
| `src/lib/__tests__/square.test.ts` | 3 |
| **Total** | **45 passing** |

## Testimonials.tsx Deletion Method

**`git rm src/app/components/Testimonials.tsx`** — properly staged the deletion through git (not a plain `rm`). The 9 testimonial entries are preserved verbatim inside `Community.tsx` as a module-level `testimonials` array (no content loss).

## Pattern A Layout Notes

No material deviations from RESEARCH.md Pattern A. The implementation adds two minor choices the research left to planner discretion:
- **IG CTA placement:** rendered as a centered full-width anchor ~40px below the avatar row (not alongside the last avatar). Reads naturally as "here are faces → follow us to see more."
- **Active-avatar visual:** `ring-2 ring-champagne ring-offset-2` + `scale-110` + `bg-champagne text-white`. Research suggested `ring-2 ring-champagne + bg-champagne`; the scale + ring-offset add visual weight so the state shift is obvious without requiring copy change.

## Pre-Launch Open Items for Craig

1. **Confirm Instagram handle.** Code uses `https://www.instagram.com/theskincafe` (matches Footer.tsx). Research Open Question 1 flagged this may actually be `theskincafegilbert` or similar. If wrong, one-line string swap in `src/app/components/Community.tsx`. Footer.tsx uses the same handle, so both sites of truth are consistent — swap both together.
2. **Single IG handle vs per-location.** Pattern A ships with one CTA tile. If client runs separate Gilbert + Scottsdale IGs, the section has room for a second pill next to the first — Wave 3 revision if requested.
3. **Client sign-off on copy:** heading "Decades of relationships, measured in faces we know by name." is from RESEARCH.md Pattern A default. Client may prefer a softer phrasing.

## Follow-ups for Phase 3

- **ANLY-02 analytics custom-event hooks:** wire click events on the Community IG CTA and the 9 avatar buttons so the client can measure engagement with the community section (e.g., "avatar_click" with `name` and `service` props, "ig_click" with `section=community`). Not scoped for Phase 2.
- **Avatar photography (Phase 4+):** currently using initials; if real customer photos become available (with consent), swap the `{initials(t.name)}` span for `<Image>` per avatar. The button shell is already 48px circular — drop-in.
- **Behind-the-Glow placement A/B:** current slot (between BookingCTA and Contact) is the researched recommendation; could later test moving it between Community and Gallery if Phase 3 analytics show low form engagement.

## Self-Check: PASSED

- Files created:
  - `src/app/components/Community.tsx` — FOUND
  - `src/app/components/__tests__/Community.test.tsx` — FOUND
- Files deleted:
  - `src/app/components/Testimonials.tsx` — CONFIRMED absent
- Files modified:
  - `src/app/page.tsx` — FOUND (final composition order verified)
- Commits:
  - `81ac2f6` (test RED) — FOUND in git log
  - `b08e0af` (feat GREEN) — FOUND in git log
  - `895d98d` (feat composition) — FOUND in git log
- `npm test` green (45/45)
- `npm run build` green
