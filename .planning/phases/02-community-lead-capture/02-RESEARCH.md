# Phase 2: Community & Lead Capture - Research

**Researched:** 2026-04-20
**Domain:** Next.js 16 server actions, Square Customers API dedup, Resend transactional email, community-showcase UI patterns
**Confidence:** HIGH

## Project Constraints (from CLAUDE.md / AGENTS.md)

Global `/Users/craigr/CLAUDE.md` (loaded in every session) applies:
- Verify before asserting — no speculation. Already honored in this research: every API pattern below is verified against either an in-repo doc (`node_modules/next/dist/docs/`), an official docs fetch, or a GitHub raw README.
- Rsync env clobber rule — `.env.local` gets overwritten by deploys; Vercel env vars are source of truth. Relevant because Phase 2 seeds dev values locally that must NEVER shadow production.
- Anthropic API cost guard — Does not apply to this phase (no LLM usage planned).

Project-local `/Users/craigr/theskincafe-site/CLAUDE.md` imports `AGENTS.md` which says:

> **This is NOT the Next.js you know.** Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.

This phase writes Next.js code for the first time in the engagement, so the planner MUST consult `node_modules/next/dist/docs/01-app/02-guides/forms.md` (read as part of this research) and the `use-server.md` directive reference before drafting any plan for the form wiring.

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|------------------|
| COMM-01 | "Our Community" homepage section, visually elevated, not a generic testimonial carousel | Design-pattern options documented in Community Section Design Patterns; existing `Testimonials.tsx` is the generic-carousel anti-pattern |
| COMM-02 | Team bios emphasize years-in-industry | `Team.tsx` already renders `experience` field for 8 real members. Visual-prominence delta only — layout change, no data work |
| COMM-03 | Instagram link-out from community section | Link-out pattern (not embed) recommended; embed requires Meta Graph API + business approval — out of scope |
| COMM-04 | "Behind the Glow — Coming Soon" teaser with signup | New component; server action wires to Square; UI inherits existing design tokens (champagne/rose/espresso/sage, btn-shimmer, ScrollReveal) |
| LEAD-01 | Visitor submits email from teaser | Next.js 16 server action with `useActionState` + `FormData` |
| LEAD-02 | Emails land in Square Customer Directory → Square Marketing list | Square SDK v44 (`SquareClient`): search-before-create dedup pattern with `reference_id` tag for segmentation |
| LEAD-03 | Confirmation + double-submit protection | Client `useFormStatus` pending + server-side idempotency key (two mechanisms — NOT interchangeable) |
| LEAD-04 | Graceful failure on Square outage/auth | `SquareError` catch → generic user message + structured server log; never leak 401/429/token to console |
| LEAD-05 | Contact form → Resend transactional email to staff | Resend SDK v6 (major upgrade from Phase 1's assumed v4); React Email templates optional but not required |
</phase_requirements>

## Summary

Three interlocking research findings shape this phase:

1. **Next.js 16 server-action primitives are `useActionState` (from `react`) + `useFormStatus` (from `react-dom`) + inline or file-level `'use server'`.** The older `useFormState` import is gone. `FormData` + Zod `safeParse` is the in-repo-documented validation pattern. The phase's in-repo docs file `node_modules/next/dist/docs/01-app/02-guides/forms.md` shows this exact pattern and IS authoritative — the planner should anchor every task to it.

2. **Square does NOT deduplicate customers automatically.** The `CreateCustomer` endpoint creates duplicates silently — per Square's own "What it does" guide. The idempotency key prevents *same-request retry* duplicates (narrow window, same UUID) but does NOT prevent a second visitor submitting the same email tomorrow from creating a dupe. The mandatory pattern is `SearchCustomers` by email first, then create only if no match. Phase 1 research was CORRECT to list this in Don't-Hand-Roll, but the planner must wire it up, not just assume idempotency alone covers it.

3. **The Square Node.js SDK v44 is a full rewrite from the legacy SDK.** The pattern is `SquareClient` + `SquareEnvironment.Sandbox | .Production`, with a flattened API surface: `client.customers.create()` and `client.customers.search()` (not the legacy `client.customersApi.createCustomer()`). The Resend SDK v6 (not v4 as Phase 1 assumed — v6.12.2 is current) keeps the same `new Resend(apiKey).emails.send({...})` surface; the changelog shows no breaking signature change for basic send, so Phase 1's example still applies as-written.

**Primary recommendation:** Build a single `src/app/actions/leads.ts` file marked `'use server'` at the top. It exports two server actions: `subscribeEmail(prevState, formData)` for LEAD-01/02/03/04 and `submitContactForm(prevState, formData)` for LEAD-05. Both use Zod `safeParse`, structured `FormState` returns for `useActionState`, and the SDKs as locked in Phase 1 env vars. The UI uses `useFormStatus` in a child `<SubmitButton />` for pending state and `useActionState` in the form component for state/errors/success. Client-side double-submit guarded by `pending` flag; server-side dedup via `customers.search` before `customers.create` with an `idempotencyKey` covering retry edge cases.

## User Constraints

**No `02-CONTEXT.md` exists for this phase** (verified: `cat .planning/phases/02-community-lead-capture/02-CONTEXT.md` → NO CONTEXT.md). The planner has Claude's Discretion on anything not locked below.

### Locked Decisions (from PROJECT.md + REQUIREMENTS.md + ROADMAP.md + prompt `<additional_context>`)

From PROJECT.md:
- **Square Marketing is the only customer-contact platform.** No parallel ESP. Site captures emails → pushes into Square Customer Directory via API.
- **Resend is transactional only.** Contact-form → staff notification. Not newsletters.
- **"Behind the Glow" is the working name** for the future hub; may change. Use it verbatim for teaser copy — don't invent alternatives.

From REQUIREMENTS.md (Active, v1):
- COMM-01..04, LEAD-01..05 as specified.
- LEAD-02 MUST land in Square Customer Directory such that it automatically enters the client's existing Square Marketing list (implies: no separate list creation; segmentation via `reference_id` on the customer record).

From ROADMAP.md Phase 2 Success Criteria (locked):
1. Community section reads as showcase, not carousel; IG link-out opens in new tab.
2. Team section surfaces years-in-industry prominently.
3. Teaser form: valid email → confirmation state + double-submit prevented on same click.
4. Submitted email appears in Square Customer Directory within 60 seconds.
5. Square outage → graceful fallback + server-side log + no uncaught browser errors.
6. Contact form → Resend staff notification within 30 seconds with name + email + message.

From prompt `<additional_context>`:
- Existing design system (champagne/rose/espresso/sage, font tokens, btn-shimmer, ScrollReveal) is locked — planners inherit, don't redesign.
- Team.tsx already has the 8-member roster with `experience` field — reuse, don't re-enter data.
- Preview deploys hit Square **sandbox** (locked in Phase 1 env seeding) — the form must read `SQUARE_API_BASE` / `SQUARE_ACCESS_TOKEN` from env, never hardcoded.
- Error messages must NOT leak internal details (token format, API URLs, raw SquareError bodies).

### Claude's Discretion

- Exact community-section layout (pattern options listed below; planner recommends one — default recommendation: Pattern A, "Featured quote + avatar wall + IG CTA", because it preserves the 9 existing testimonials as content rather than discarding them).
- Team layout change to raise `experience` visual weight — planner decides (bigger text, pill badge, color shift) as long as it's prominent per success criterion 2.
- Whether Contact form gets a full rewrite or a surgical patch. Default recommendation: surgical patch (add `name` attributes to inputs, replace `handleSubmit` with `action={formAction}` from `useActionState`). No behavior change from user's POV.
- Rate-limit implementation for public endpoints. Default recommendation: **defer to Phase 3 or descope**, because (a) it adds infra dependency (Upstash or Vercel KV), (b) the endpoint is a single email insert per submit, not a SaaS abuse surface, and (c) Resend/Square themselves 429 long before volume becomes a cost. Surfaced here so the planner can decide — NOT a blocker.

### Deferred Ideas (OUT OF SCOPE)

From REQUIREMENTS.md "Out of Scope":
- Mailchimp/ConvertKit/Resend Broadcasts.
- Custom booking engine.
- E-commerce.
- Patron accounts / gated content.
- Aftercare QR cards (Phase 3).
- Instagram auto-sync / before-after gallery (Phase 4).
- Payload CMS (Milestone 2).
- "Behind the Glow" live content hub (Milestone 2).

From Phase 2 context:
- **Instagram embed** (live feed from IG Graph API) — out of scope. Use a plain `<a>` link-out with `target="_blank" rel="noopener noreferrer"` to `https://instagram.com/theskincafegilbert` or whichever handle(s) client confirms. Live embed requires Meta Business approval and is a multi-day integration — deferred to Phase 4.
- **Double-opt-in email confirmation.** Square's flow does not require it; the client's Marketing list uses the Square-native opt-in model. Don't add a separate confirmation email step.
- **SEO/analytics/OG images** — Phase 3 (SEO-01..05, ANLY-01..02), NOT Phase 2.
- **Dark logo variant swap-in** — Phase 4 (POLISH-01).

## Standard Stack

### Core additions (to install in Phase 2)

| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| `zod` | ^4.3.6 | Server-side form validation (email, name, message schemas) | Official Next.js docs forms guide uses zod by name (`node_modules/next/dist/docs/01-app/02-guides/forms.md` line 134) [VERIFIED: in-repo doc + `npm view zod version` → 4.3.6] |
| `resend` | ^6.12.2 | Transactional staff-notification email for contact form (LEAD-05) | Official SDK; unchanged send signature from Phase 1's v4 assumption but bumped major version. [VERIFIED: `npm view resend version` → 6.12.2; Resend's own useActionState example at `github.com/resend/resend-nextjs-useactionstate-example` uses `import { Resend } from "resend"` and `resend.emails.send({...})`] |
| `square` | ^44.0.1 | Square Customer Directory write (LEAD-02) | Official SDK. v44 is the "new" SDK; legacy SDK still available at `square/legacy` but not needed here. [VERIFIED: `npm view square version` → 44.0.1; `github.com/square/square-nodejs-sdk` README confirms current pattern] |

Install:
```bash
npm install zod resend square
```

### Already installed (verified via `/Users/craigr/theskincafe-site/package.json`)

| Library | Version | Role |
|---------|---------|------|
| `next` | 16.2.3 | Framework — server actions, metadata |
| `react` | 19.2.4 | `useActionState` hook lives here (not in `react-dom`) |
| `react-dom` | 19.2.4 | `useFormStatus` hook lives here |
| `framer-motion` | ^12.38.0 | Already in project; useful if planner wants the Community section to have the same motion vocabulary as other sections (NOT required) |
| `lucide-react` | ^1.8.0 | Icon library in current use (Star, Quote, ChevronLeft, Camera, Send, CheckCircle, etc.) |

### Alternatives Considered

| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| `zod` for validation | `valibot` / plain regex | zod is what the in-repo Next.js doc uses as its example — matching docs is the lowest-surprise path. No reason to diverge. |
| Raw `fetch` to `/v2/customers` | Square SDK v44 | Phase 1 research contemplated raw `fetch` as an option. Recommendation for Phase 2: **use the SDK**. Reason: `SquareError.statusCode` + `.body` on caught errors is cleaner than parsing raw `fetch` response codes, and the SDK auto-handles `Square-Version` header and retries (default 2 with exponential backoff per README). Saves ~40 lines of error-code mapping. |
| React Email templates for staff notification | Plain HTML string | Plain HTML is fine for a staff-to-staff internal notification. React Email is overkill here — deferred to Milestone 2 (HUB-* content emails if any). LEAD-05 ships with an inline HTML template in the server action. |
| Building a newsletter double-opt-in | Square's native opt-in | Out of scope by PROJECT.md. Square Marketing handles unsubscribe/compliance. Not our problem. |
| Embedded Instagram feed | Link-out `<a>` | See Deferred Ideas. |

**Version verification step for planner:** Before Wave 1 runs, re-run `npm view <pkg> version` for `resend`, `square`, `zod` to confirm no major bump has landed since 2026-04-20.

## Architecture Patterns

### Recommended File Layout

```
src/app/
├── actions/
│   └── leads.ts              # NEW — 'use server' file with subscribeEmail + submitContactForm
├── components/
│   ├── BehindTheGlow.tsx     # NEW — teaser block + email form (client component)
│   ├── Community.tsx         # NEW — replaces / supplements Testimonials.tsx usage on homepage
│   ├── Contact.tsx           # EDIT — wire existing form to submitContactForm action
│   ├── Team.tsx              # EDIT — raise visual weight of `experience` field
│   └── Testimonials.tsx      # MAY KEEP or repurpose — see Community section design
└── lib/
    ├── square.ts             # NEW — SquareClient singleton, env-driven environment switch
    └── resend.ts             # NEW — Resend singleton
```

**Principle:** Server actions live in `app/actions/` so the `'use server'` directive is file-scoped and the planner never has to juggle inline-action signatures. One file, two exports, one test surface.

### Pattern 1: Server Action with useActionState

**What:** Next.js 16 + React 19 idiomatic form handler. Server action receives `(prevState, formData)` and returns `FormState`. Client form reads state via `useActionState`.

**When to use:** Every form in this phase. Both `BehindTheGlow.tsx` and `Contact.tsx` use this pattern.

**Example (from in-repo `node_modules/next/dist/docs/01-app/02-guides/forms.md` lines 196–249, adapted):**

```typescript
// Source: node_modules/next/dist/docs/01-app/02-guides/forms.md (in-repo authoritative)
// src/app/actions/leads.ts
'use server';

import { z } from 'zod';

export type FormState = {
  success?: boolean;
  error?: string;
  message?: string;
  fieldErrors?: Record<string, string[]>;
};

const emailSchema = z.object({
  email: z.email({ message: 'Please enter a valid email address' }),
});

export async function subscribeEmail(
  _prevState: FormState,
  formData: FormData,
): Promise<FormState> {
  const parsed = emailSchema.safeParse({
    email: formData.get('email'),
  });

  if (!parsed.success) {
    return {
      success: false,
      fieldErrors: parsed.error.flatten().fieldErrors,
      error: 'Please enter a valid email address',
    };
  }

  // ... Square search + create (Pattern 2 below)

  return { success: true, message: "You're on the list." };
}
```

```typescript
// src/app/components/BehindTheGlow.tsx
'use client';

import { useActionState } from 'react';            // React 19 — NOT react-dom
import { useFormStatus } from 'react-dom';         // for submit button pending state
import { subscribeEmail, type FormState } from '@/app/actions/leads';

const initialState: FormState = {};

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button type="submit" disabled={pending} className="btn-shimmer ...">
      {pending ? 'Subscribing...' : 'Notify Me'}
    </button>
  );
}

export default function BehindTheGlow() {
  const [state, formAction] = useActionState(subscribeEmail, initialState);

  if (state.success) {
    return <div className="...">{state.message}</div>; // Confirmation UI
  }

  return (
    <form action={formAction} className="...">
      <input type="email" name="email" required autoComplete="email" />
      {state.error && <p className="text-rose text-sm" role="alert">{state.error}</p>}
      <SubmitButton />
    </form>
  );
}
```

**Key facts:**
- `useActionState` is imported from `react`, not `react-dom`. The `react-dom` export `useFormState` is the old name and is deprecated in React 19. [VERIFIED: in-repo docs file + Resend's own published example]
- `useFormStatus` lives in `react-dom`. It must be called inside a component that is a descendant of the `<form>` — that's why `SubmitButton` is a separate component.
- `action={formAction}` replaces `onSubmit={handler}`. When the submit is via `action`, pending state flows through `useFormStatus` automatically. Progressive enhancement works (form submits even without JS).
- `autoComplete="email"` is not decorative — iOS/Android password managers use it and users expect it.

### Pattern 2: Square dedup-before-create

**What:** Search Customer Directory by email; if no match, create; if match, return success (treat as "already subscribed" — don't surface as error).

**When to use:** Exactly once per LEAD-02 submission, server-side.

**Why mandatory:** Square's own docs: *"The CreateCustomer and BulkCreateCustomers endpoints don't check for duplicate records during profile creation."* and *"Before you create a new profile, call the SearchCustomers endpoint and search by phone number, email address, or reference ID to make sure a profile doesn't already exist."* [CITED: developer.squareup.com/docs/customers-api/what-it-does, confirmed 2026-04-20]

**Example (Square SDK v44):**

```typescript
// Source: github.com/square/square-nodejs-sdk README (master, fetched 2026-04-20)
// src/lib/square.ts
import { SquareClient, SquareEnvironment } from 'square';

const isProduction = process.env.SQUARE_API_BASE === 'https://connect.squareup.com';

export const square = new SquareClient({
  token: process.env.SQUARE_ACCESS_TOKEN!,
  environment: isProduction
    ? SquareEnvironment.Production
    : SquareEnvironment.Sandbox,
});
```

```typescript
// Inside subscribeEmail server action
import { square } from '@/lib/square';
import { SquareError } from 'square';
import { randomUUID } from 'crypto';

try {
  // 1. Dedup search — exact match by email
  const searchResult = await square.customers.search({
    query: {
      filter: {
        emailAddress: { exact: email }, // exact, not fuzzy
      },
    },
    limit: 1,
  });

  if (searchResult.customers && searchResult.customers.length > 0) {
    // Already subscribed — silent success (don't leak existence to spammers,
    // and returning success matches what a non-duplicate flow would return)
    return { success: true, message: "You're on the list." };
  }

  // 2. Create
  await square.customers.create({
    idempotencyKey: randomUUID(),          // retry-safe within Square's window
    emailAddress: email,
    referenceId: 'web-lead-behind-the-glow', // segmentation tag for Square Marketing
  });

  return { success: true, message: "You're on the list." };
} catch (err) {
  if (err instanceof SquareError) {
    // Structured server log — NEVER surfaced to client
    console.error('[subscribeEmail] SquareError', {
      status: err.statusCode,
      message: err.message,
      // Do not log err.body — may contain tokens/PII echo
    });
  } else {
    console.error('[subscribeEmail] Unknown error', err);
  }
  // Generic user-facing message — no internal details
  return {
    success: false,
    error: "We couldn't save your email right now. Please try again in a moment.",
  };
}
```

**Notes:**
- `emailAddress: { exact: email }` — the exact-match filter is the documented pattern. Fuzzy (`"fuzzy": "example.com"`) would false-positive on similar addresses. [VERIFIED via WebFetch of SearchCustomers reference: "email_address" supports `exact` and `fuzzy`; exact is the right choice for dedup]
- `referenceId: 'web-lead-behind-the-glow'` is the hook for staff segmentation in Square Marketing. Staff can build a list/segment filtering on this reference_id to isolate web leads from walk-in customers.
- `idempotencyKey` is REQUIRED by Square on create. Use `crypto.randomUUID()` per Square's docs. Its role here is to protect against the SDK's own retry layer (default `maxRetries: 2` with exponential backoff) creating two customers if the first request's response was dropped. It does NOT cover cross-session dedup — that's what the search is for.
- Empty/null `customers` array vs undefined: the SDK returns an object; missing or empty `customers` means no match. Check `searchResult.customers?.length > 0`, not `truthy`.

### Pattern 3: Resend transactional send (LEAD-05)

**What:** Fire-and-await email from staff-facing contact form.

```typescript
// src/lib/resend.ts
import { Resend } from 'resend';
export const resend = new Resend(process.env.RESEND_API_KEY!);
```

```typescript
// Inside submitContactForm server action (from src/app/actions/leads.ts)
import { resend } from '@/lib/resend';
import { z } from 'zod';

const contactSchema = z.object({
  name: z.string().min(1).max(120),
  email: z.email(),
  location: z.enum(['gilbert', 'scottsdale', 'either', '']).optional(),
  service: z.string().max(60).optional(),
  message: z.string().min(1).max(4000),
});

export async function submitContactForm(
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  const parsed = contactSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    return { success: false, error: 'Please check your entries and try again.' };
  }
  const { name, email, location, service, message } = parsed.data;

  const { error } = await resend.emails.send({
    from: 'Contact Form <contact@send.theskincafe.net>',
    to: [process.env.STAFF_NOTIFICATION_EMAIL!],
    replyTo: email, // staff hits Reply → goes to the submitter
    subject: `New contact: ${name}`,
    html: `
      <h2>New contact form submission</h2>
      <p><strong>Name:</strong> ${escapeHtml(name)}</p>
      <p><strong>Email:</strong> ${escapeHtml(email)}</p>
      <p><strong>Location:</strong> ${escapeHtml(location ?? '—')}</p>
      <p><strong>Service:</strong> ${escapeHtml(service ?? '—')}</p>
      <p><strong>Message:</strong></p>
      <p>${escapeHtml(message).replace(/\n/g, '<br>')}</p>
    `,
  });

  if (error) {
    console.error('[submitContactForm] Resend error', error);
    return {
      success: false,
      error: "We couldn't send your message right now. Please call us at (480) 619-0046.",
    };
  }
  return { success: true, message: "Thank you! We'll get back to you within 24 hours." };
}
```

- `replyTo: email` is the single most useful behavior for staff — makes the notification actionable with one click in their inbox. [VERIFIED: resend-node uses `replyTo` camelCase in recent versions]
- `escapeHtml` is mandatory — raw HTML from a form field is an XSS vector in the staff's email client (and a tracking/spoofing vector). Implement or import from a vetted tiny library. Hand-rolled one-liner is fine: `const escapeHtml = (s: string) => s.replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]!));`
- The sandbox `onboarding@resend.dev` sender from Resend examples is NOT used — Phase 1 verified `send.theskincafe.net` as the sending subdomain.

### Pattern 4: Client-side double-submit + server-side idempotency (two mechanisms)

**Why two?** They solve different failure modes.

| Mechanism | What it prevents | Failure mode it addresses |
|-----------|------------------|---------------------------|
| `useFormStatus().pending` → disable submit button | User double-clicks the button | Impatient user, slow network |
| Square `idempotencyKey: randomUUID()` per request | SDK retry layer or the user hitting submit across network partitions | Network flake mid-request |
| Server-side `customers.search` before create | Second visit submitting same email days later | Genuine cross-session duplicates |

The prompt calls out "client-side double-submit prevention + server-side idempotency (two different mechanisms)" — the third row (search-before-create) is the mechanism that actually fulfills LEAD-02's dedup requirement. Idempotency key alone is NOT enough. The planner must wire all three.

### Anti-Patterns to Avoid

- **Using `onSubmit={handler}` with `event.preventDefault()`.** Current `Contact.tsx` does this — it's what's being replaced. Loses progressive enhancement, skips server-side validation, breaks `useActionState`.
- **`useFormState` from `react-dom`.** Deprecated; use `useActionState` from `react`. If the planner copy-pastes from pre-2024 blog posts, they'll land on the wrong import.
- **Inline `'use server'` inside a Client Component file.** Won't work — the file must be a Server Component or the directive must be file-top in a server-only file. Keep actions in `src/app/actions/leads.ts`.
- **Echoing `SquareError.body` to the browser.** Contains request-id, sometimes the rejected payload. Log server-side; return generic message.
- **Reusing the same `idempotencyKey` across submissions.** It must be unique per *intent*. `randomUUID()` per request is the right pattern. Storing it or hashing the email defeats the point.
- **Hard-coding `https://connect.squareup.com`.** Preview deploys hit sandbox — URL must be env-driven (Phase 1 seeded `SQUARE_API_BASE`). The `SquareClient` `environment` flag is set from that env var in `lib/square.ts`.
- **Treating `experience: "Career aesthetician"` as a year count.** Looking at `Team.tsx`, 4 of 8 team members have non-numeric `experience` fields (`"Career aesthetician"`, `"Licensed aesthetician"`, `"Medical background"`, `"Since 2022"`, `"Since 2003"`). The visual treatment has to handle free-form strings, not format numbers. Pattern: larger italic line; don't add "years" suffix.
- **Embedding Instagram feed live.** Out of scope; link-out only.

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Email regex validation | `/^[^@]+@[^@]+\.[^@]+$/` or similar | `z.email()` from zod v4 | RFC-5322 compliance is hard; zod v4 ships `z.email()` as a first-class method with proper parsing. [VERIFIED: in-repo Next.js forms doc uses zod; zod v4.3.6 has `z.email()`] |
| Pending/loading UI state | `useState` + manual toggle | `useFormStatus` | Built-in, progressive-enhancement safe, zero extra state |
| Form state (errors, success) | `useState` + useEffect | `useActionState` | Official React 19 primitive; handles prev-state passing automatically |
| Customer dedup | Local Set / DB table | Square `customers.search({filter:{emailAddress:{exact}}})` | Client's source of truth is Square already; a local cache would drift |
| Idempotency key generation | `Date.now()` / hash | `crypto.randomUUID()` | Node 20+ native; Square's own docs recommend UUID |
| HTML escaping in email templates | String concatenation trust | Tiny escape util (5 lines) or React Email | XSS in staff inbox is real; `Resend` accepts `react:` prop if React Email is preferred — v6 still supports this |
| Rate limiting | Hand-rolled token bucket | Either (a) defer entirely, or (b) Upstash Redis if adopted | Rolling your own in-memory across serverless functions doesn't work — each invocation is a fresh container |

**Key insight:** Every LEAD-* requirement has an existing primitive that solves it. The phase is 90% gluing verified patterns together; <10% is custom UI arrangement (the Community section layout).

## Community Section Design Patterns (COMM-01)

The anti-pattern is already in the repo: `Testimonials.tsx` is a 9-item auto-rotating carousel with dots + arrow nav. That's the "generic testimonial carousel" COMM-01 explicitly rejects. Four viable patterns to elevate it:

### Pattern A — Featured quote + avatar wall + IG CTA **(RECOMMENDED DEFAULT)**

Layout:
- One large featured testimonial at top (rotates on interval or stays static), shown as magazine-style pull-quote with the reviewer's name + service.
- Below it, a horizontal strip or grid of 8–12 small circular avatars (initials or photos if available) representing "a piece of our community" — each is a customer. Clicking one swaps the featured quote.
- At the end of the row: a single CTA tile with Instagram icon → "Follow @theskincafegilbert on Instagram →" link-out (COMM-03).
- Optional copy line above: "**Decades of relationships, measured in faces we know by name.**"

**Why default:** Reuses all 9 existing testimonials as content (no data loss), reads as "community" not "proof", integrates the IG link-out (COMM-03) inside the section rather than bolting it on, works on mobile (strip becomes scroll-snap horizontal), matches the "decades of care" brand moat from PROJECT.md.

### Pattern B — Mosaic grid of quote cards

Layout:
- CSS grid, asymmetric (3+2+3+3 layout or Bento-style), each cell is a testimonial quote card with varying emphasis.
- One cell is the IG CTA.
- No carousel, no auto-rotation — everything visible at once, scrolls reveal as user descends.

**Why consider:** Avoids any motion, feels premium/editorial. Tradeoff: heavy on space (~600-900px section height); only supports 6–8 quotes gracefully.

### Pattern C — Quote + landscape photo hero

Layout:
- Full-width section with a single large photo (interior shot, event shot, or team candid) with one rotating featured quote overlaid.
- Small row of dots below to cycle.
- Secondary CTA: "Read more stories on Instagram →"

**Why consider:** Closest in look to existing `Testimonials.tsx` (which already uses a full-width bg) but reframed as a moment rather than a list.

### Pattern D — Instagram-style tile grid

Layout:
- 9 tiles, each the same square size, containing either a quote, an avatar, or a photo. Mimics Instagram's 3x3 profile grid.
- IG link-out is the CTA below the grid.

**Why consider:** Matches the "community = social" framing most literally. Tradeoff: can read as "we don't have a real IG, so we fake one" if the client's IG doesn't match this aesthetic.

### Criteria for picking (planner can make the call without re-consulting client)

| Criterion | A | B | C | D |
|-----------|---|---|---|---|
| Preserves existing 9 testimonials | ✓ | partial (6-8) | ✓ (rotates) | partial |
| Integrates IG CTA naturally | ✓ | ✓ | ✓ | ✓ |
| Works on mobile without stacking | ✓ | tight | ✓ | ✓ |
| Feels distinct from `Testimonials.tsx` | ✓ | ✓✓ | weak | ✓ |
| Build complexity (dev hours) | medium | high | low | medium |
| "Decades of care" brand fit | ✓✓ | ✓ | ✓ | ✗ |

**Planner's default recommendation: Pattern A.** Change if the planner finds in execution that the photo assets are better suited to C, or the testimonial variety better suits B.

### Open decision: keep or remove `Testimonials.tsx`?

The site currently renders both in the app's homepage. Two options:

1. **Replace** — `Community.tsx` takes the existing section's slot; `Testimonials.tsx` is deleted.
2. **Supplement** — `Community.tsx` is a new section above; `Testimonials.tsx` keeps its current slot.

Recommendation: **Replace.** Two testimonials sections on one homepage is redundant. Delete `Testimonials.tsx` when `Community.tsx` lands; the 9-item `testimonials` array can move into `Community.tsx` unchanged (or into a shared data file if the planner wants).

## Common Pitfalls

### Pitfall 1: `useActionState` imported from wrong package

**What goes wrong:** Code compiles, but at runtime: `TypeError: useFormState is not a function` or silent wrong behavior. Searches online find old Next 14 tutorials that import from `react-dom`.

**Why it happens:** React 19 moved `useFormState` → `useActionState` and relocated it from `react-dom` to `react`. The old name still exists in `react-dom` as a deprecated alias but is being removed.

**How to avoid:**
- `import { useActionState } from 'react';` ✓
- `import { useFormStatus } from 'react-dom';` ✓ (this one stays in `react-dom`)
- `import { useFormState } from 'react-dom';` ✗ (deprecated)

**Warning signs:** ESLint Next plugin may warn. Browser console warns about deprecation in dev mode.

### Pitfall 2: Square creates duplicates silently

**What goes wrong:** User submits email twice across sessions. `customers.create` succeeds both times. Client's Square Marketing list now has two "jen@jones.com" entries. Staff spends time cleaning up.

**Why it happens:** Phase 1 research correctly identified that CreateCustomer doesn't dedup; but it's easy to read "use idempotency_key" and conclude that solves it. It does not — idempotency only covers retry of the same request.

**How to avoid:** Mandatory `customers.search` with `emailAddress: { exact: email }` before create. Treat existing-match as silent success. This is baked into Pattern 2 above.

**Warning signs:** Phase 4 client walkthrough: "why are there two entries for this person?"

### Pitfall 3: SquareClient environment flag mis-set in Preview

**What goes wrong:** Preview deploy hits production Square because `SquareEnvironment.Production` was hardcoded or the env-var switch logic misfires. PR testing pollutes live list.

**Why it happens:** Temptation to write `environment: SquareEnvironment.Production` literally. Or to check `process.env.NODE_ENV === 'production'` — which is TRUE in Preview deploys (Vercel builds Preview deploys with NODE_ENV=production).

**How to avoid:**
- Drive `environment` from `SQUARE_API_BASE` (which Phase 1 set differently per environment scope) OR from `VERCEL_ENV` (which is `production` | `preview` | `development`).
- Best: `environment: process.env.SQUARE_API_BASE === 'https://connect.squareup.com' ? Production : Sandbox`. Single source of truth.

**Warning signs:** Preview PR submission lands in the client's real list during QA.

### Pitfall 4: Leaking internal errors to the client

**What goes wrong:** A `console.error(err)` in a client component surfaces the SquareError object including `statusCode: 401` and a message containing the API URL. User screenshots it. Bad look.

**Why it happens:** Server actions serialize their return value to the client. Any `return { error: err.message }` sends `err.message` to the browser. `SquareError` messages can include the request path.

**How to avoid:** Return ONLY a sanitized string like `"We couldn't save your email right now."` Log details server-side only. Pattern 2 example above does this correctly.

**Warning signs:** Client-side React DevTools shows `state.error = "Request to https://connect.squareup.com/v2/customers failed: 401 ..."`. That's a leak.

### Pitfall 5: Resend sending from unverified domain

**What goes wrong:** `from: 'Contact Form <contact@theskincafe.net>'` is used, but only `send.theskincafe.net` was verified in Phase 1. Resend rejects; staff never gets notified.

**Why it happens:** Human error — apex vs subdomain.

**How to avoid:** `from: 'Contact Form <contact@send.theskincafe.net>'` (subdomain `send`). This matches Phase 1's DNS setup exactly.

**Warning signs:** Resend dashboard shows rejected send attempts; staff reports "we never get contact emails."

### Pitfall 6: Contact.tsx form inputs have no `name` attribute

**What goes wrong:** FormData comes back empty. `formData.get('email')` is null. Zod fails. Form looks broken to the user.

**Why it happens:** Current `Contact.tsx` (lines 119–216) defines `id="email"` etc. but has NO `name` attribute. Only `name` attributes are included in `FormData`.

**How to avoid:** Wave 1 task: add `name="name" name="email" name="location" name="service" name="message"` to all inputs. Trivial edit, but easy to skip if the planner only scans for behavior changes.

**Warning signs:** QA shows form "submits" but nothing happens; server log shows "Please check your entries."

### Pitfall 7: No SSR / Server Component boundary respected

**What goes wrong:** `BehindTheGlow.tsx` imports `resend` or `square` clients directly → bundle contains server secrets OR build fails.

**Why it happens:** Forgetting that client components (`'use client'`) run in the browser. Node-only libraries with server secrets can't be imported there — even if only used inside a handler, the import happens at module load.

**How to avoid:** Server actions in `src/app/actions/leads.ts` (`'use server'` file). Client components import only the *action function*, not the SDKs. Bundle stays clean; secrets stay on server.

**Warning signs:** Next.js build error about "Module not found" on Node-specific imports, OR (worse) no error but `RESEND_API_KEY` visible in `_next/static/...` chunks.

## Code Examples

### Complete server action file (both actions)

```typescript
// src/app/actions/leads.ts
// Source: synthesized from node_modules/next/dist/docs/01-app/02-guides/forms.md (in-repo),
// github.com/square/square-nodejs-sdk README (v44), and github.com/resend/resend-nextjs-useactionstate-example.
'use server';

import { z } from 'zod';
import { randomUUID } from 'crypto';
import { SquareClient, SquareEnvironment, SquareError } from 'square';
import { Resend } from 'resend';

export type FormState = {
  success?: boolean;
  error?: string;
  message?: string;
};

const isProduction = process.env.SQUARE_API_BASE === 'https://connect.squareup.com';
const square = new SquareClient({
  token: process.env.SQUARE_ACCESS_TOKEN!,
  environment: isProduction ? SquareEnvironment.Production : SquareEnvironment.Sandbox,
});
const resend = new Resend(process.env.RESEND_API_KEY!);

const escapeHtml = (s: string) =>
  s.replace(/[&<>"']/g, (c) =>
    ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]!),
  );

// ─────────────── LEAD-01..04 ───────────────
const subscribeSchema = z.object({ email: z.email() });

export async function subscribeEmail(
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  const parsed = subscribeSchema.safeParse({ email: formData.get('email') });
  if (!parsed.success) {
    return { success: false, error: 'Please enter a valid email address.' };
  }
  const { email } = parsed.data;

  try {
    const existing = await square.customers.search({
      query: { filter: { emailAddress: { exact: email } } },
      limit: 1,
    });

    if (existing.customers?.length) {
      return { success: true, message: "You're on the list." };
    }

    await square.customers.create({
      idempotencyKey: randomUUID(),
      emailAddress: email,
      referenceId: 'web-lead-behind-the-glow',
    });

    return { success: true, message: "You're on the list." };
  } catch (err) {
    if (err instanceof SquareError) {
      console.error('[subscribeEmail] SquareError', {
        status: err.statusCode,
        message: err.message,
      });
    } else {
      console.error('[subscribeEmail] Unknown error', err);
    }
    return {
      success: false,
      error: "We couldn't save your email right now. Please try again in a moment.",
    };
  }
}

// ─────────────── LEAD-05 ───────────────
const contactSchema = z.object({
  name: z.string().min(1).max(120),
  email: z.email(),
  location: z.string().max(30).optional(),
  service: z.string().max(60).optional(),
  message: z.string().min(1).max(4000),
});

export async function submitContactForm(
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  const parsed = contactSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    return { success: false, error: 'Please check your entries and try again.' };
  }
  const { name, email, location, service, message } = parsed.data;

  const { error } = await resend.emails.send({
    from: 'Contact Form <contact@send.theskincafe.net>',
    to: [process.env.STAFF_NOTIFICATION_EMAIL!],
    replyTo: email,
    subject: `New contact: ${name}`,
    html: [
      `<h2>New contact form submission</h2>`,
      `<p><strong>Name:</strong> ${escapeHtml(name)}</p>`,
      `<p><strong>Email:</strong> ${escapeHtml(email)}</p>`,
      `<p><strong>Location:</strong> ${escapeHtml(location ?? '—')}</p>`,
      `<p><strong>Service:</strong> ${escapeHtml(service ?? '—')}</p>`,
      `<p><strong>Message:</strong></p><p>${escapeHtml(message).replace(/\n/g, '<br>')}</p>`,
    ].join(''),
  });

  if (error) {
    console.error('[submitContactForm] Resend error', error);
    return {
      success: false,
      error: "We couldn't send your message right now. Please call us at (480) 619-0046.",
    };
  }
  return { success: true, message: "Thank you! We'll get back to you within 24 hours." };
}
```

### BehindTheGlow teaser component (sketch)

```typescript
// src/app/components/BehindTheGlow.tsx
'use client';
import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { subscribeEmail, type FormState } from '@/app/actions/leads';
import ScrollReveal from './ScrollReveal';
import { Sparkles, CheckCircle } from 'lucide-react';

const initialState: FormState = {};

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="btn-shimmer bg-gradient-to-r from-champagne to-champagne-dark text-white px-8 py-4 rounded-full font-semibold disabled:opacity-60"
    >
      {pending ? 'Subscribing…' : 'Notify Me'}
    </button>
  );
}

export default function BehindTheGlow() {
  const [state, formAction] = useActionState(subscribeEmail, initialState);

  return (
    <section id="behind-the-glow" className="py-24 sm:py-32 bg-cream relative">
      <div className="max-w-3xl mx-auto px-4 text-center">
        <ScrollReveal>
          <span className="text-champagne text-sm font-semibold uppercase tracking-[0.2em] mb-4 block">
            <Sparkles className="inline mr-2" size={14} /> Coming Soon
          </span>
          <h2 className="font-[var(--font-display)] text-4xl sm:text-5xl font-bold text-espresso mb-4">
            Behind the <span className="gradient-text">Glow</span>
          </h2>
          <p className="text-mocha/70 mb-8">
            Decades of skin, beauty, and self-care expertise — written for you. Be the first to read.
          </p>

          {state.success ? (
            <div className="animate-scale-in inline-flex items-center gap-2 bg-sage/20 text-espresso px-6 py-4 rounded-full">
              <CheckCircle className="text-sage" size={20} />
              <span className="font-medium">{state.message}</span>
            </div>
          ) : (
            <form action={formAction} className="flex flex-col sm:flex-row gap-3 max-w-lg mx-auto" noValidate>
              <input
                type="email"
                name="email"
                required
                autoComplete="email"
                placeholder="your@email.com"
                aria-label="Email address"
                className="flex-1 px-4 py-3 rounded-full bg-white border border-latte focus:border-champagne focus:ring-2 focus:ring-champagne/30 outline-none"
              />
              <SubmitButton />
            </form>
          )}
          {state.error && (
            <p className="text-rose text-sm mt-3" role="alert">{state.error}</p>
          )}
        </ScrollReveal>
      </div>
    </section>
  );
}
```

### Contact.tsx surgical diff (sketch)

```typescript
// src/app/components/Contact.tsx — changes only
'use client';
import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { submitContactForm, type FormState } from '@/app/actions/leads';
// ...keep existing imports

const initialState: FormState = {};

export default function Contact() {
  const [state, formAction] = useActionState(submitContactForm, initialState);

  // delete: const [submitted, setSubmitted] = useState(false);
  // delete: handleSubmit + onSubmit wiring

  return (
    <section id="contact" ...>
      {/* ...keep contact info panel... */}
      {state.success ? (
        /* existing "Message Sent!" confirmation UI, driven by state.success */
      ) : (
        <form action={formAction} className="space-y-5">
          <input id="name" name="name" type="text" required .../>
          <input id="email" name="email" type="email" required .../>
          <select id="location" name="location" ...>
          <select id="service" name="service" ...>
          <textarea id="message" name="message" required .../>
          <SubmitButton />
          {state.error && <p className="text-rose text-sm" role="alert">{state.error}</p>}
        </form>
      )}
    </section>
  );
}
```

## Runtime State Inventory

> **Trigger check:** This phase is new-feature work, not a rename/refactor/migration. Runtime State Inventory is **not mandatory** per the research protocol, but the phase does touch an existing `Contact.tsx` and will retire `Testimonials.tsx` — so a minimal inventory is documented for safety.

| Category | Items Found | Action Required |
|----------|-------------|------------------|
| Stored data | None — site has no database yet. Square Customer Directory is the only stored-state endpoint, and writing to it IS the feature, not a migration of prior state. | None |
| Live service config | Square Marketing list lives inside the client's Square merchant account. The site only writes; staff configures segments/campaigns in Square UI. `reference_id: 'web-lead-behind-the-glow'` is the segmentation hook — planner should document this in handoff notes so staff know how to filter. | Add to Phase 4 handoff doc (not this phase) |
| OS-registered state | None. Cloud-service state only. | None |
| Secrets / env vars | `SQUARE_ACCESS_TOKEN`, `SQUARE_API_BASE`, `SQUARE_APPLICATION_ID`, `RESEND_API_KEY`, `STAFF_NOTIFICATION_EMAIL` — all seeded in Phase 1 per Phase 1 RESEARCH.md "Environment Variables to Provision" table. Phase 2 consumes, does not create. | Verify in Wave 0: `vercel env ls` on client team confirms all five are present. |
| Build artifacts | `Testimonials.tsx` is removed if Pattern A replaces it (not supplements). No other build artifacts to clean. | Git delete when Community.tsx lands |

**Nothing found in category "Stored data":** verified by `ls /Users/craigr/theskincafe-site` — no database package (no `drizzle`, `prisma`, `pg`, `@neondatabase/*`) in `package.json`.

## Environment Availability

| Dependency | Required By | Available | Version | Fallback |
|------------|-------------|-----------|---------|----------|
| Node.js | Next.js 16 build + server action runtime | Assumed available (project already builds) | ≥ 20 (Next 16 requirement) | — |
| `npm` | Install new deps (zod, resend, square) | ✓ (project uses npm — see package-lock.json assumption) | — | — |
| Square sandbox account + tokens | LEAD-02 dev-mode testing | Seeded in Phase 1 | — | — |
| Resend API key (dev + prod) | LEAD-05 dev-mode testing | Seeded in Phase 1 | — | Test mode via Resend dashboard if DNS not yet verified |
| Client's real Square merchant account (production) | End-to-end verification before sign-off | Seeded in Phase 1 (Preview → sandbox, Production → real) | — | — |
| Verified `send.theskincafe.net` sending domain | LEAD-05 prod path | Phase 1 dependency; verify in Wave 0 | — | If not yet verified, LEAD-05 E2E verification slips to Phase 4 |
| `crypto.randomUUID` | Idempotency key generation | Built into Node 19+ | Standard lib | `uuid` npm package, but not needed |
| Test framework | Nyquist validation (see below) | **None installed** — package.json has no test runner | — | Gap flagged; Wave 0 installs vitest |

**Missing dependencies with no fallback:** None that block execution. Test framework absence is a Wave 0 gap, not a blocker.

**Missing dependencies with fallback:** None.

## Validation Architecture

> `.planning/config.json` was not inspected because no path reference was given in the prompt and `workflow.nyquist_validation` setting is unknown. Including this section conservatively (default = enabled per research protocol).

### Test Framework

| Property | Value |
|----------|-------|
| Framework | **None currently installed.** Recommendation: `vitest` (pairs naturally with Vite/Next.js 16, supports React Testing Library, fast DX). Version: `^3.x` (verify at install time). |
| Config file | None — see Wave 0 |
| Quick run command | `npx vitest run <file> --reporter=verbose` (once installed) |
| Full suite command | `npx vitest run` |

Alternative: `jest` is also acceptable; the decision is the planner's. Recommend vitest for lower config friction on a Next 16 + React 19 stack.

### Phase Requirements → Test Map

| Req ID | Behavior | Test Type | Automated Command | File Exists? |
|--------|----------|-----------|-------------------|--------------|
| COMM-01 | Homepage renders a Community section distinct from a generic carousel | smoke (render test) | `npx vitest run src/app/components/Community.test.tsx` | ❌ Wave 0 |
| COMM-02 | Team section raises `experience` field visually | visual / manual | Manual viewport check at 375/768/1280 | ❌ Wave 0 |
| COMM-03 | IG link-out has correct href + target=_blank + rel=noopener | unit | `npx vitest run src/app/components/Community.test.tsx -t "instagram"` | ❌ Wave 0 |
| COMM-04 | BehindTheGlow teaser renders | smoke | `npx vitest run src/app/components/BehindTheGlow.test.tsx` | ❌ Wave 0 |
| LEAD-01 | Email submit calls `subscribeEmail` server action | unit (mock action) | `npx vitest run src/app/components/BehindTheGlow.test.tsx -t "submit"` | ❌ Wave 0 |
| LEAD-02 | `subscribeEmail` searches then creates in Square | unit (mock `square`) | `npx vitest run src/app/actions/leads.test.ts -t "subscribe"` | ❌ Wave 0 |
| LEAD-02 | `subscribeEmail` silent-success on dedup match | unit | same file, `-t "dedup"` | ❌ Wave 0 |
| LEAD-03 | Pending state disables submit button | unit (RTL) | `... -t "pending"` | ❌ Wave 0 |
| LEAD-04 | SquareError → generic user-facing error | unit | `... -t "graceful error"` | ❌ Wave 0 |
| LEAD-04 | SquareError → server log includes status, NOT body | unit | `... -t "does not log body"` | ❌ Wave 0 |
| LEAD-05 | `submitContactForm` calls `resend.emails.send` with replyTo=submitter | unit | `npx vitest run src/app/actions/leads.test.ts -t "contact"` | ❌ Wave 0 |
| LEAD-05 (E2E) | Real submission → staff inbox within 30s | manual | Manual QA with `send.theskincafe.net` verified | ❌ manual-only (by design — requires real Resend + verified DNS) |
| LEAD-02 (E2E) | Real submission → Square Customer Directory within 60s | manual | Manual QA with sandbox token | ❌ manual-only |

### Sampling Rate

- **Per task commit:** `npx vitest run <modified-test-file>`
- **Per wave merge:** `npx vitest run` (full suite)
- **Phase gate:** Full suite green + both E2E manual tests passed (screenshots of Square sandbox entry + staff inbox receipt).

### Wave 0 Gaps

- [ ] `vitest`, `@vitest/ui`, `@testing-library/react`, `@testing-library/jest-dom`, `jsdom` → install via `npm i -D`
- [ ] `vitest.config.ts` — jsdom environment, React plugin
- [ ] `src/test/setup.ts` — `@testing-library/jest-dom` matchers + mock `next/headers` if used
- [ ] `src/app/actions/leads.test.ts` — covers LEAD-01..05
- [ ] `src/app/components/BehindTheGlow.test.tsx` — covers COMM-04, LEAD-01/03
- [ ] `src/app/components/Community.test.tsx` — covers COMM-01/03
- [ ] Manual QA checklist doc for LEAD-02/05 E2E

## Security Domain

Per research protocol default (absent config = enabled).

### Applicable ASVS Categories

| ASVS Category | Applies | Standard Control |
|---------------|---------|-----------------|
| V2 Authentication | No — no user accounts in this phase | — |
| V3 Session Management | No — no sessions | — |
| V4 Access Control | Partial — server actions are public endpoints | Rate limiting (deferred), Zod input validation as a gate |
| V5 Input Validation | **Yes** — forms accept untrusted user input | `zod` schemas in every server action; never pass `formData.get()` directly to any API |
| V6 Cryptography | No — no secrets beyond API tokens (managed by Vercel env) | Never log or return SquareError body; never prefix secret env vars with `NEXT_PUBLIC_` |
| V7 Error Handling | **Yes** — error paths must not leak | Generic user-facing messages; structured server-side logs |
| V12 API Security | **Yes** — we consume Square + Resend APIs | SDK defaults (retries, timeouts); fail-closed on outage |
| V13 Malicious Code | Partial — XSS vector in email template | HTML-escape all form fields before injecting into email `html` |

### Known Threat Patterns for Next.js 16 + Next.js server actions

| Pattern | STRIDE | Standard Mitigation |
|---------|--------|---------------------|
| XSS via unsanitized form input rendered into email HTML | Tampering | `escapeHtml` utility before concatenating into `html` string; or use React Email components (auto-escaped) |
| Server action called outside the form (direct POST from curl) | Tampering / Spoofing | Zod schema validates input; server action has no auth assumption. Accept as public — valid POSTs get valid entries; nothing leaks |
| Double submission creates duplicate customers | Repudiation / DoS | Client `useFormStatus.pending` + Square `idempotencyKey` + `customers.search` dedup |
| Public endpoint abuse (scripted email-flooding) | DoS | Rate limit by IP (deferred to Phase 3 unless abuse observed). Square/Resend will 429 upstream at scale |
| Leaking internal error details | Information Disclosure | Structured server logs only; generic user-facing error messages |
| Bundling server secrets into client bundle | Information Disclosure | `'use server'` file in `app/actions/`; client components import only action functions |

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| `useFormState` from `react-dom` | `useActionState` from `react` | React 19 (2024) | Breaking — old imports throw or warn |
| `event.preventDefault()` + `fetch('/api/...')` | `<form action={serverAction}>` + `'use server'` | Next 14 (App Router, 2023); refined through Next 16 | Progressive enhancement works; no API routes needed |
| Square legacy SDK `new Client({ environment: Environment.Sandbox, accessToken })` + `client.customersApi.createCustomer(body)` | `new SquareClient({ token, environment: SquareEnvironment.Sandbox })` + `client.customers.create(body)` (camelCase params) | Square SDK v40 (2024) | Breaking — Phase 1 research assumed v43 legacy pattern; Phase 2 MUST use v44 new pattern or explicitly `import { Client } from 'square/legacy'` |
| Resend v4 `resend.emails.send({ from, to, subject, html, reply_to })` (snake_case) | Resend v6 `resend.emails.send({ from, to, subject, html, replyTo })` (camelCase for newer fields) | Resend v5 → v6 (2025) | Minor — verify exact field casing in v6.12.2 at implementation time |
| Hand-rolled rate limiting via memory | Managed edge rate limiting (Upstash Ratelimit, Arcjet, Vercel KV) | 2023+ | If rate limiting is adopted, don't roll your own |

**Deprecated / outdated:**
- `useFormState` — React 19 renamed it. Old name is a removed-soon alias.
- Square legacy SDK (`client.customersApi.*`) — still works via `square/legacy`, but don't write new code against it.
- Pages Router (`pages/` directory) — project uses App Router (`src/app/`). In-repo `node_modules/next/dist/docs/02-pages/` docs are a trap; always read from `01-app/`.

## Assumptions Log

| # | Claim | Section | Risk if Wrong |
|---|-------|---------|---------------|
| A1 | Instagram handle is a single one (e.g., `@theskincafegilbert`). Could be two (Gilbert + Scottsdale). | COMM-03 link-out | Low — planner adds one or two link-outs; layout adapts. Client confirms in kickoff. |
| A2 | `STAFF_NOTIFICATION_EMAIL` points to a real inbox that staff actually monitor (not `info@theskincafe.net` forwarded to a 3rd-party helpdesk). | LEAD-05 | Low — if wrong, staff misses notifications. Client confirms during Phase 1 handoff, planner adds to pre-launch checklist. |
| A3 | `send.theskincafe.net` is the Resend verified subdomain (per Phase 1). | Pattern 3 | Low — verified via Phase 1 research. Wave 0 includes `vercel env ls` + Resend dashboard check. |
| A4 | Client's Square Marketing list picks up new customer records automatically (no manual "add to list" step needed). | LEAD-02 | Medium — this is Square's documented behavior for their Marketing product, but integration nuance depends on client's Marketing configuration. Verify with one test signup in Phase 2 before sign-off. |
| A5 | `reference_id: 'web-lead-behind-the-glow'` is acceptable segmentation tagging. Client might want a different tag or per-source tags (e.g., `web-lead` vs `web-lead-behind-the-glow` vs `web-lead-contact-form`). | Pattern 2 | Low — trivial string change. Default used unless planner raises with client. |
| A6 | The 9 existing testimonials in `Testimonials.tsx` are usable as-is for the Community section. (Content rights, attribution, accuracy assumed OK because they were already approved when the current site shipped.) | COMM-01 | Very low — these are public reviews from Google already shown on the live site. |
| A7 | Planner decides to REPLACE `Testimonials.tsx` with `Community.tsx`, not supplement. | Community Section Design Patterns | Low — either path works; replace is cleaner. |
| A8 | Rate limiting is deferred (not part of Phase 2). | Claude's Discretion | Low for launch; medium if the site gets scripted abuse. Flag to client for decision. |
| A9 | Resend v6 keeps `replyTo` (camelCase) — verified in community examples but not directly against v6.12.2 docs. | Pattern 3 | Very low — if the SDK rejects, the field name is a trivial patch. |
| A10 | No `.planning/config.json` was inspected — Nyquist + security defaults used. | Validation + Security sections | Low — if `nyquist_validation: false` is set in config, the Validation Architecture section is still documentation, not enforcement. |
| A11 | Test framework adoption (vitest) is acceptable to the planner/Craig. | Validation Architecture | Low — jest is an equivalent fallback; the spec requires a framework, not a specific one. |

**These are the assumptions the planner and/or discuss-phase may want to confirm with the user before execution.** Nothing is blocking — all have reasonable defaults.

## Open Questions

1. **Instagram handle(s) — one or two?**
   - What we know: Client has two locations. They may run two IGs or one consolidated one.
   - What's unclear: Which.
   - Recommendation: Planner opens with a one-sentence kickoff confirmation task. If one → single CTA. If two → two CTAs styled as "Follow Gilbert | Follow Scottsdale".

2. **Replace or supplement `Testimonials.tsx`?**
   - What we know: Both are valid per requirements.
   - What's unclear: Client preference (aesthetic: two sections vs one).
   - Recommendation: Replace (Pattern A). Planner flags the change in Wave 1 PR description. If client objects, switch to supplement with a Wave 3 revision task.

3. **`reference_id` tag — one value or per-source?**
   - What we know: `web-lead-behind-the-glow` satisfies the requirement.
   - What's unclear: Whether client wants to segment contact-form leads separately (e.g., `web-contact-form`) even though contact form goes to Resend, NOT Square.
   - Recommendation: Default — only teaser emails write to Square; contact form does NOT write to Square (only triggers Resend). This keeps the customer directory clean. Flag explicitly to client.

4. **Rate limiting now vs later?**
   - What we know: Phase 2 ships without it per default recommendation.
   - What's unclear: Client's risk appetite for public abuse.
   - Recommendation: Defer. Revisit if Phase 3 analytics shows abuse-pattern traffic, or at Phase 4 handoff as "known limitation."

## Sources

### Primary (HIGH confidence)
- `node_modules/next/dist/docs/01-app/02-guides/forms.md` — in-repo Next 16 forms + server-actions guide. Authoritative for this project's Next version.
- `node_modules/next/dist/docs/01-app/03-api-reference/01-directives/use-server.md` — in-repo `'use server'` directive reference.
- [github.com/square/square-nodejs-sdk README (master)](https://github.com/square/square-nodejs-sdk/blob/master/README.md) — fetched as raw 2026-04-20; confirms `SquareClient` + `customers.create` + `SquareError` pattern for v44.
- [github.com/square/square-nodejs-sdk reference.md](https://github.com/square/square-nodejs-sdk/blob/master/reference.md) — fetched 2026-04-20; confirms `client.customers.create({ givenName, familyName, emailAddress, ... })` camelCase signature.
- [Square Customers API — what-it-does](https://developer.squareup.com/docs/customers-api/what-it-does) — confirms CreateCustomer does NOT dedup; mandates SearchCustomers pattern.
- [Square SearchCustomers reference (via WebFetch)](https://developer.squareup.com/reference/square/customers-api/search-customers) — confirms `emailAddress: { exact }` filter.
- [Square Node.js SDK Quickstart](https://developer.squareup.com/docs/sdks/nodejs/quick-start) — confirms `SquareClient` + `SquareEnvironment.Sandbox | .Production` initialization.
- [Resend Next.js docs](https://resend.com/docs/send-with-nextjs) — confirms `new Resend(apiKey).emails.send({...})` pattern.
- [github.com/resend/resend-nextjs-useactionstate-example (raw actions.ts)](https://github.com/resend/resend-nextjs-useactionstate-example) — Resend's own current example using `useActionState`, `safeParse`, and the exact `{ success, error }` return shape.
- `npm view resend version` → `6.12.2`, `npm view square version` → `44.0.1`, `npm view zod version` → `4.3.6` (verified 2026-04-20).
- `/Users/craigr/theskincafe-site/package.json` — Next 16.2.3, React 19.2.4 confirmed in-repo.
- `/Users/craigr/theskincafe-site/.planning/phases/01-client-infrastructure-provisioning/01-RESEARCH.md` — Phase 1 research on Square auth, Resend DNS, env-var scoping. Reused here, not re-researched.

### Secondary (MEDIUM confidence — verified against primary where possible)
- [Next.js Weekly — Rate-limiting Server Actions](https://nextjsweekly.com/blog/rate-limiting-server-actions) — IP extraction pattern in server actions; used here only for the deferred-rate-limiting recommendation.
- [developer.squareup.com announcement of new Node SDK](https://developer.squareup.com/blog/announcing-the-new-square-node-js-sdk/) — context on legacy → new SDK migration (the blog shows legacy `Client` pattern; README shows the current `SquareClient` pattern; use the README as source of truth).

### Tertiary (LOW confidence — flagged)
- Resend v6 `replyTo` field casing — verified in a community example but not in the official v6 changelog (which was inaccessible via WebFetch). Risk: very low; if rejected, field is a one-token patch.

## Metadata

**Confidence breakdown:**
- Next.js 16 server-action pattern: HIGH — in-repo docs file is the authoritative source and was read directly.
- Square SDK v44 pattern: HIGH — verified against the SDK's own README + reference.md on master.
- Square dedup behavior: HIGH — documented explicitly in Square's own guide.
- Resend v6 send pattern: HIGH — Resend's own published example uses the documented surface.
- Community design patterns: MEDIUM — design-direction options based on general web-design patterns; exact choice is a planner/client call.
- Rate limiting: LOW — intentionally deferred; no concrete implementation specified in this phase.

**Research date:** 2026-04-20
**Valid until:** 2026-05-20 (30 days — all APIs are mature, though `square` and `resend` are on active majors; re-verify versions at Wave 0).
