---
phase: 02-community-lead-capture
plan: 04
subsystem: community
tags: [comm-02, team, visual, tailwind-v4]
requires: [02-01]
provides:
  - team-experience-pill
affects:
  - src/app/components/Team.tsx
  - src/test/setup.ts
tech-stack:
  added: []
  patterns:
    - bordered champagne pill (inline-flex + bg-champagne/10 + border-champagne/30)
    - IntersectionObserver jsdom polyfill in vitest setup
key-files:
  created:
    - src/app/components/__tests__/Team.test.tsx
  modified:
    - src/app/components/Team.tsx
    - src/test/setup.ts
decisions:
  - Restructured card order — pill ABOVE specialty — so the eye lands on name → role eyebrow → years (trust) → specialty (detail).
  - Kept pill text at text-[11px] so it fits at 375px without wrapping for the longest string ("16 years as an aesthetician").
  - Did NOT append "years" or conditionally format; pill hugs the raw data verbatim so "Career aesthetician" and "Since 2003" both read cleanly.
  - Polyfilled IntersectionObserver in shared src/test/setup.ts rather than mocking ScrollReveal per-test; benefits any future component test that mounts a ScrollReveal descendant.
metrics:
  tasks: 1
  files_created: 1
  files_modified: 2
  commits: 2
  duration: "~8 min"
  completed: 2026-04-20
---

# Phase 02 Plan 04: Team Experience Prominence Summary

**One-liner:** Team-member years-in-industry now renders inside a bordered champagne pill above the specialty line, giving COMM-02's "decades of expertise" story the visual weight it needs without any data churn.

## What Shipped

The `<div className="p-4">` info block inside `team.map(...)` now renders:

```tsx
<h3 ...>{member.name}</h3>
<p className="text-champagne text-xs font-medium uppercase tracking-wider mb-1">
  {member.role}
</p>
<span className="inline-flex items-center gap-1.5 mt-2 mb-2 px-2.5 py-1 rounded-full bg-champagne/10 border border-champagne/30 text-espresso text-[11px] font-semibold tracking-wide">
  {member.experience}
</span>
<p className="text-mocha/50 text-xs">{member.specialty}</p>
```

**Reference this exact class string for Phase 4 POLISH-02 responsive audits.** Pill stays on one line at 375px for every current roster string; longest is "16 years as an aesthetician".

Everything else in Team.tsx is byte-identical:

- The 8-member `team` data array (lines 5–78): untouched.
- Photo container, aspect ratio, hover bio overlay, scale-on-hover transition, sizes prop: untouched.
- `acceptingClients` "Booked Full" badge: untouched.
- Camera social-corner button: untouched.
- Section header, eyebrow, intro copy, ScrollReveal wrappers: untouched.

## Tests

`src/app/components/__tests__/Team.test.tsx` — 5 passing tests:

1. Exactly 8 `<h3>` member headings render.
2. Every one of the 8 known experience strings renders at least once, verbatim.
3. Exactly 8 pill `<span>`s bearing the full class contract (`inline-flex`, `bg-champagne/10`, `border`, `text-espresso`, `font-semibold`) — and each pill's text is one of the known strings.
4. No phantom "years" suffix injected onto free-form strings (e.g., "Career aesthetician", "Since 2003", "Medical background", "Licensed aesthetician" each render without " years" concatenation).
5. "Booked Full" badge still renders (Tasha Scott).

Ties into STRIDE threat T-02-24 (Tampering — rendered text): a future refactor that adds `${exp} years` logic will fail Test 4.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 3 - Blocking] Polyfilled IntersectionObserver in vitest setup**

- **Found during:** Task 1 RED run
- **Issue:** jsdom does not implement `IntersectionObserver`; `ScrollReveal.tsx` calls `new IntersectionObserver(...)` inside `useEffect`, so `render(<Team />)` threw `ReferenceError: IntersectionObserver is not defined` for all 5 tests.
- **Fix:** Added a minimal `vi.fn()`-backed `MockIntersectionObserver` class to `src/test/setup.ts`, assigned onto `globalThis.IntersectionObserver`. Tests do not rely on intersection behavior, so a no-op stub is sufficient.
- **Scope justification:** Shared setup file, but the change is test-only infra that benefits every future component test touching ScrollReveal (Community, BehindTheGlow, etc. in later 02-xx plans). Not a new dependency.
- **Files modified:** `src/test/setup.ts`
- **Commit:** `a8f3a83`

**2. [Rule 3 - Blocking] Removed stale `@ts-expect-error` directive on the polyfill assignment**

- **Found during:** `npm run build` type-check after GREEN
- **Issue:** With `typeof IntersectionObserver` being structurally compatible, TS didn't emit an error on the global assignment, so `@ts-expect-error` became an "unused directive" build failure.
- **Fix:** Replaced with an explicit `as unknown as typeof IntersectionObserver` cast — makes the widening intentional, no directive needed.
- **Files modified:** `src/test/setup.ts`
- **Commit:** `d63a9c0`

## Tailwind v4 Notes

No gotchas. The arbitrary-opacity color utilities (`bg-champagne/10`, `border-champagne/30`, `text-[11px]`) all compiled cleanly through Turbopack. Tailwind v4 keeps the literal class string on the DOM node (it's only the generated CSS that escapes `/`), so the test's `className.includes('bg-champagne/10')` check works as-is.

## Commits

| Commit | Type | Message |
|--------|------|---------|
| `a8f3a83` | test | add failing Team experience-pill contract test (+ IO polyfill) |
| `d63a9c0` | feat | elevate Team experience line to champagne-accent pill (+ TS cast fix) |

## Verification Run

```
npm test                                                # 9/9 passing (Team.test.tsx +5, existing suites unchanged)
npm run build                                           # ✓ Compiled + TypeScript green + 4 static pages
grep -q "bg-champagne/10" src/app/components/Team.tsx   # ✓
grep -q "border-champagne/30" src/app/components/Team.tsx # ✓
grep -c "{member.experience}" src/app/components/Team.tsx # 1 (single render site)
grep -q "text-mocha/40 text-\[11px\] italic" Team.tsx   # ✓ absent
```

## Known Stubs

None. The feature is fully wired to real data.

## Success Criteria — Self-Check

- [x] All 8 members render with their experience string inside a champagne-accent pill.
- [x] `git diff src/app/components/Team.tsx` shows only the info-block JSX change (data untouched).
- [x] Free-form strings render verbatim — no "years" suffix injected.
- [x] Booked Full badge, hover overlay, image animations, social icon, section header all visually unchanged.
- [x] `npm test` passes.
- [x] `npm run build` passes.
- [x] Only `Team.tsx` + new test file modified (plus the test-setup polyfill; no other component/shared files touched).

## Self-Check: PASSED

- `src/app/components/Team.tsx` — FOUND, modified.
- `src/app/components/__tests__/Team.test.tsx` — FOUND, created.
- `src/test/setup.ts` — FOUND, modified (IO polyfill).
- Commit `a8f3a83` — FOUND in git log.
- Commit `d63a9c0` — FOUND in git log.
