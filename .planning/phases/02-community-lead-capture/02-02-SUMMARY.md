---
phase: 02-community-lead-capture
plan: 02
subsystem: contact-form-resend
tags: [wave-2, lead-05, server-action, resend, useActionState, xss-mitigation, pii-hygiene]
dependency-graph:
  requires:
    - submitContactForm-skeleton   # from Plan 02-01
    - resend-singleton             # from Plan 02-01
    - FormState-type               # from Plan 02-01
    - test-runner                  # from Plan 02-01
  provides:
    - contact-form-wired           # Plan 03 / Phase 4 QA can verify LEAD-05 E2E
    - intersection-observer-stub   # unblocks all future RTL component tests
  affects:
    - plan-02-03                   # shares the IntersectionObserver stub; BehindTheGlow tests benefit
tech-stack:
  added: []
  patterns:
    - "server-action content-safety: zod safeParse gate → escapeHtml on every interpolated field → generic user-facing error + phone fallback → opaque error object in console.error (no PII)"
    - "client-side useActionState(serverAction, initialState) with child SubmitButton using useFormStatus() for pending state"
    - "jsdom test-env IntersectionObserver stub via global setup (no-op observer for ScrollReveal-wrapped components)"
key-files:
  created:
    - src/app/actions/__tests__/contact.test.ts
    - src/app/components/__tests__/Contact.test.tsx
  modified:
    - src/app/actions/contact.ts
    - src/app/components/Contact.tsx
    - src/test/setup.ts
decisions:
  - "Resend v6 replyTo camelCase worked as documented — no runtime adjustment needed. Assumption A9 from RESEARCH.md confirmed."
  - "Added global IntersectionObserver stub to src/test/setup.ts (not a per-file mock) because every component test in this codebase transitively renders ScrollReveal. Per-file mocking would duplicate 10+ lines across every future component test."
  - "Left state.message fallback copy in Contact.tsx so Plan 02-01 default success message flows through, preserving existing UX when the server returns a custom message (forward-compatible)."
requirements: [LEAD-05]
metrics:
  duration: "206s"
  tasks_completed: 2
  files_created: 2
  files_modified: 3
  tests_added: 12
  tests_passing: "16/16"
  commits: 4
completed-date: 2026-04-20
---

# Phase 02 Plan 02: Contact Form → Resend Wire-up Summary

**One-liner:** Implemented submitContactForm with zod-gated Resend v6 send + HTML-escape + PII-hygienic logging, and converted Contact.tsx from stub `useState`/`onSubmit` to React 19 `useActionState` + `useFormStatus` with name attributes on every field.

## What Was Built

Plan 02-01 left two file-boundary skeletons (`src/app/actions/contact.ts`, `src/lib/resend.ts`) and a stub Contact form that only toggled a local `submitted` boolean on click. Staff never got notified; the UI lied about delivery. This plan closes LEAD-05: valid submissions now round-trip through a `'use server'` action that dispatches a transactional Resend email to `STAFF_NOTIFICATION_EMAIL`, with `replyTo` set to the submitter so staff's "Reply" button routes correctly.

### Resend v6 send call shape (exact, as shipped)

```ts
resend.emails.send({
  from: 'Contact Form <contact@send.theskincafe.net>', // verified subdomain (Pitfall 5)
  to: [process.env.STAFF_NOTIFICATION_EMAIL ?? ''],
  replyTo: email,                                       // camelCase; works on v6.12.2
  subject: `New contact: ${name}`,
  html: /* HTML-escaped body, newlines → <br> */,
});
```

- `replyTo` (camelCase) is accepted by Resend v6.12.2 with no runtime adjustment. Research-time Assumption A9 (LOW-confidence concern) is confirmed.
- `from` uses the `send.theskincafe.net` subdomain — apex would be rejected per Phase 1 DNS verification.
- `to` array contains exactly one recipient; wrapped in `?? ''` to stay module-load safe in test envs without real env vars.

### Contact.tsx wiring

```tsx
const [state, formAction] = useActionState(submitContactForm, initialState);
// ...
<form action={formAction} noValidate>
  <input id="name" name="name" autoComplete="name" required ... />
  <input id="email" name="email" autoComplete="email" required ... />
  <select id="location" name="location" ... />
  <select id="service" name="service" ... />
  <textarea id="message" name="message" required ... />
  <SubmitButton />
  {state.error && <p role="alert">{state.error}</p>}
</form>
```

- `useActionState` imported from `'react'` (React 19), `useFormStatus` from `'react-dom'`.
- No `useState`, `handleSubmit`, `onSubmit`, or `preventDefault` remain anywhere in the file.
- All five fields have `name=` attributes matching `id=` — without these, `FormData` would be empty and zod would reject every submission (Pitfall 6).
- Left-column contact-info panel, `ScrollReveal` wrappers, and all Tailwind classes are untouched — surgical patch, not rewrite.

## Commits

| Hash      | Task | Stage  | Message |
|-----------|------|--------|---------|
| `2c3afdf` | 1    | RED    | `test(02-02): add failing tests for submitContactForm` |
| `261b754` | 1    | GREEN  | `feat(02-02): implement submitContactForm with Resend send + zod validation (LEAD-05)` |
| `12b0377` | 2    | RED    | `test(02-02): add failing RTL tests for Contact form useActionState wiring` |
| `e6fed7b` | 2    | GREEN  | `feat(02-02): wire Contact.tsx to useActionState + submitContactForm server action` |

No REFACTOR commits — initial GREEN implementations matched RESEARCH.md patterns verbatim; no cleanup needed.

## Verification

### Test suite (full, 16/16 green)

```
src/test/smoke.test.ts                              (1 test)
src/app/actions/__tests__/contact.test.ts           (7 tests)
src/app/components/__tests__/Contact.test.tsx       (5 tests)
src/lib/__tests__/square.test.ts                    (3 tests)

Test Files  4 passed (4)
Tests      16 passed (16)
Duration   1.33s
```

### Per-requirement coverage

| Behavior | Test File | Status |
|----------|-----------|--------|
| Valid submission → exactly one resend.emails.send call with correct from/to/replyTo/subject/html | `contact.test.ts` | ✓ |
| Missing email → no Resend call, generic error returned | `contact.test.ts` | ✓ |
| Invalid email (`not-an-email`) → no Resend call, generic error | `contact.test.ts` | ✓ |
| `<script>alert(1)</script>` in message → rendered as `&lt;script&gt;` in html (XSS mitigation, T-02-06) | `contact.test.ts` | ✓ |
| Newlines → `<br>` substitution in html | `contact.test.ts` | ✓ |
| Resend `{error}` response → phone-fallback error + console.error with tag | `contact.test.ts` | ✓ |
| PII hygiene — raw name/email/message never appear in console.error args (T-02-08) | `contact.test.ts` | ✓ |
| All five inputs expose correct name attributes | `Contact.test.tsx` | ✓ |
| Form uses action binding, not onSubmit; submit button renders enabled | `Contact.test.tsx` | ✓ |
| Submitting invokes mocked submitContactForm | `Contact.test.tsx` | ✓ |
| state.success → "Message Sent!" UI replaces form, displays state.message | `Contact.test.tsx` | ✓ |
| state.error → `role="alert"` element renders, form remains visible | `Contact.test.tsx` | ✓ |

### Build

```
npm run build
✓ Compiled successfully in 1323ms
  Finished TypeScript in 1811ms
✓ Generating static pages using 5 workers (4/4)
```

Zero type errors. `/` and `/_not-found` still prerendered as static — no accidental render-mode regression from the client-component edit.

### Automated grep checks (from plan's `<verify>` blocks)

- `grep -q "resend.emails.send" src/app/actions/contact.ts` → 0 ✓
- `grep -q "replyTo: email" src/app/actions/contact.ts` → 0 ✓
- `grep -q "contact@send.theskincafe.net" src/app/actions/contact.ts` → 0 ✓
- `grep -q "escapeHtml" src/app/actions/contact.ts` → 0 ✓
- `! grep -q "console.error.*formData" src/app/actions/contact.ts` → 0 ✓
- `grep -q "useActionState" src/app/components/Contact.tsx` → 0 ✓
- `grep -q "useFormStatus" src/app/components/Contact.tsx` → 0 ✓
- `grep -q 'action={formAction}' src/app/components/Contact.tsx` → 0 ✓
- `! grep -q "handleSubmit" src/app/components/Contact.tsx` → 0 ✓
- `! grep -q "preventDefault" src/app/components/Contact.tsx` → 0 ✓
- `grep -cE 'name="(name|email|location|service|message)"' src/app/components/Contact.tsx` → 5 ✓
- `! grep -qE "from ['\"]react-dom['\"].*useFormState" src/app/components/Contact.tsx` → 0 ✓
- `! grep -q "useState" src/app/components/Contact.tsx` → 0 ✓

## Deviations from Plan

### 1. [Rule 3 — Blocking] Added global `IntersectionObserver` stub in `src/test/setup.ts`

- **Found during:** Task 2, first run of `Contact.test.tsx`
- **Issue:** jsdom 29 does not implement `IntersectionObserver`. `ScrollReveal` (which wraps both the heading block and the form column in `Contact.tsx`) instantiates one in `useEffect`, throwing `ReferenceError: IntersectionObserver is not defined` on mount. Every render of `Contact` aborted before the DOM assertions could run — all 5 RTL tests failed with the same aggregate error.
- **Fix:** Added a 10-line no-op `IntersectionObserver` class to `src/test/setup.ts`, installed on `globalThis` only when undefined. Tests that want to observe scroll-visibility-driven behavior can override per-test; the global stub makes the common "render + interact" case work without boilerplate.
- **Why Rule 3 (blocking), not Rule 4 (architectural):** Trivial, scope-bounded, affects only the test environment. The stub is architecturally equivalent to the `@testing-library/jest-dom` setup already in the file — a cross-cutting test-env prerequisite.
- **Files:** `src/test/setup.ts`
- **Commit:** folded into `e6fed7b` (same commit as the Contact.tsx rewrite so Task 2 stays atomic)

### Non-deviations (matched RESEARCH.md + PLAN exactly)

- Action body matches RESEARCH.md Pattern 3 (Complete server action file) verbatim for the `submitContactForm` half.
- `from: 'Contact Form <contact@send.theskincafe.net>'` — exact subdomain per Pitfall 5.
- `replyTo: email` — camelCase; v6 accepted without adjustment.
- `escapeHtml` — inline implementation per Pattern 4 sketch (5 character entity substitutions).
- Contact.tsx surgical-patch approach (per RESEARCH.md "Contact.tsx surgical diff (sketch)") — left-column contact-info panel unchanged, only replaced form wiring + added name attributes.

## Auth Gates

None. Resend calls were fully mocked in tests; no live API credentials were required or provisioned in this plan.

## TDD Notes

- **Task 1 RED** → 6 of 7 tests failed against the Plan 02-01 stub (the "not yet implemented" return). 1 test coincidentally passed because the stub returned `success: false` which satisfied the "no Resend call" assertions for the missing-email case. That's an acceptable RED — the stub's behavior was already partially correct for 1 of 7 cases; the other 6 failures drove the GREEN implementation.
- **Task 1 GREEN** → 7/7 passing after first implementation pass. No iteration needed; RESEARCH.md Pattern 3 was complete.
- **Task 2 RED** → 5/5 failed (ReferenceError for IntersectionObserver, masking assertion failures).
- **Task 2 GREEN** → 5/5 passing after the IntersectionObserver stub + Contact.tsx rewrite. Two-step: stub first (no-op fix), rewrite second.
- **No REFACTOR pass** on either task — implementations matched RESEARCH patterns directly.

## Known Stubs

None. Both server action and UI are fully wired. The only remaining stub in the phase is `submitContactForm`'s sibling `subscribeEmail` in `src/app/actions/subscribe.ts`, which is Plan 02-03's responsibility (Behind the Glow teaser).

## Threat Flags

None. No new network endpoints, auth paths, or trust boundaries were introduced beyond what the plan's `<threat_model>` already enumerated (T-02-05..T-02-12). Every listed `mitigate` disposition has a matching test:

| Threat ID | Mitigation | Test |
|-----------|-----------|------|
| T-02-05 (Tampering — input) | `contactSchema.safeParse` gate | "rejects missing email"  / "rejects invalid email" |
| T-02-06 (XSS in email HTML) | `escapeHtml` on every interpolated field | "escapes HTML in message to prevent XSS" |
| T-02-07 (Info disclosure — error path) | Generic user-facing string, no Resend body leak | "returns generic error with phone fallback" |
| T-02-08 (Info disclosure — PII log leak) | Opaque `error` object only in console.error | "does not log raw user input on failure (PII hygiene)" |
| T-02-09 (Spoofing — from address) | Hardcoded `'Contact Form <contact@send.theskincafe.net>'` | Asserted in "sends on valid input" |
| T-02-10 (DoS) | Accepted per plan — rate limiting deferred | N/A |
| T-02-11 (Bundle leak — client boundary) | Contact.tsx imports only the action function, never `@/lib/resend` | N/A (grep-audited) |
| T-02-12 (CSRF) | Accepted — Next.js 16 default origin check | N/A |

## Handoff Notes for Downstream Plans

- **Plan 02-03 (BehindTheGlow subscribeEmail):** Reuse the same `useActionState` + `useFormStatus` + `SubmitButton` pattern landed in `Contact.tsx` lines 17–28. The global `IntersectionObserver` stub in `src/test/setup.ts` is already in place — your component tests will work out of the box.
- **Phase 4 launch polish / QA:** LEAD-05 E2E is a manual QA item (Phase 2 RESEARCH.md Validation Architecture). With `send.theskincafe.net` DNS verified and `STAFF_NOTIFICATION_EMAIL` set in Vercel, submit a real form on a Preview deploy and confirm staff inbox receipt within 30s.
- **Pre-production sanity check:** Before going live, confirm `STAFF_NOTIFICATION_EMAIL` in Vercel points at a monitored mailbox (Assumption A2). The current dev default falls through to empty string if unset, which will make Resend reject the send cleanly (good-faith failure path).

## Self-Check: PASSED

All claimed files verified to exist:
- `src/app/actions/__tests__/contact.test.ts` ✓
- `src/app/components/__tests__/Contact.test.tsx` ✓
- `src/app/actions/contact.ts` ✓ (modified — real body, no stub)
- `src/app/components/Contact.tsx` ✓ (modified — useActionState wired)
- `src/test/setup.ts` ✓ (modified — IntersectionObserver stub)

All claimed commits verified in `git log`:
- `2c3afdf` ✓
- `261b754` ✓
- `12b0377` ✓
- `e6fed7b` ✓

`npm run test` → 16/16 green. `npm run build` → exit 0.
