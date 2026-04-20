# Phase 1: Client Infrastructure Provisioning - Research

**Researched:** 2026-04-20
**Domain:** SaaS account provisioning, DNS cutover, API credential management
**Confidence:** HIGH

## Project Constraints (from CLAUDE.md / AGENTS.md)

From `/Users/craigr/theskincafe-site/CLAUDE.md` (imports `AGENTS.md`):

- **Next.js 16 is NOT the Next.js in training data.** Read `node_modules/next/dist/docs/` before writing any route handler, metadata, or config. Applies to Phase 2 implementation but is out of scope for Phase 1 (infra-only) — no Next.js code is written in this phase.

From global `/Users/craigr/CLAUDE.md` — non-negotiable rules the planner/executor must follow:
- Verify before asserting; one correction = immediate course change.
- Act, don't ask, when findable in code/config/docs.
- **Rsync env clobber memory:** `.env` files get overwritten on deploys if source is stale — relevant because this phase seeds new env vars into Vercel and local `.env.local`. Keep source of truth in Vercel; `.env.local` is dev-only scratch.

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|------------------|
| INFRA-01 | Site deployed on client-owned Vercel team (not agency's) | Vercel project-transfer docs — zero-downtime, preserves deployments/env vars/domains/git link |
| INFRA-02 | Client-owned Resend account with verified sending domain, API key in Vercel env | Resend DNS records (MX/SPF/DKIM on `send` subdomain, DMARC on `_dmarc` apex) |
| INFRA-03 | Client-owned Cloudflare zone manages DNS for production domain | Cloudflare full-setup flow; Vercel apex A record `76.76.21.21` + CNAME for `www` |
| INFRA-05 | Square API credentials for Customer Directory stored in Vercel env vars | Square sandbox vs production base URLs + `CUSTOMERS_WRITE` scope + personal access token |
</phase_requirements>

## Summary

This is pure infra/config work — no application code is written. Four SaaS accounts (Vercel, Resend, Cloudflare, Square) must be client-owned before Phase 2 integration work can land in production. The critical sequencing constraint is that the production domain (`theskincafe.net` or similar) already hosts a live site — DNS cutover must be staged so bookings never break.

Three things have real risk:

1. **Square API auth model** — the client's existing Square account is the production merchant account with a live customer list. Using a sandbox token for dev and a production personal access token for prod (both `CUSTOMERS_WRITE` scope) keeps the production list clean during Phase 2 development.
2. **Cloudflare onboarding of a live domain** — Cloudflare scans existing DNS on import, but apps-specific records (email forwarding, Google Workspace MX, booking subdomain CNAMEs) need to be audited record-by-record before nameserver flip, or mail/existing subdomains go dark.
3. **Vercel project transfer** — officially zero-downtime and preserves env vars, git link, and domains, but integrations and log history do NOT carry over. Transfer happens AFTER the client's team has a valid payment method.

**Primary recommendation:** Execute in this order — (1) client creates Vercel team + invites Craig → (2) Vercel project transfer → (3) Resend account + domain verification (can run in parallel with 2) → (4) Square credentials issued → (5) Cloudflare zone creation with full DNS audit → (6) production domain attached to Vercel project at end, but DNS cutover deferred to Phase 4 (INFRA-04 is explicitly in Phase 4).

## User Constraints

No `CONTEXT.md` exists for this phase — planner has full discretion within the constraints below.

**From ROADMAP.md success criteria (locked):**
1. `git push` deploys to client's Vercel team, not Neural Rebel's.
2. Resend API key in client Vercel env vars with SPF/DKIM/DMARC green in dashboard.
3. Cloudflare zone under client account is authoritative for the production domain; Craig has Admin for duration of build.
4. Square API creds in Vercel env for Preview + Production; separate dev-mode key for local.
5. Explicit handoff-cutover checklist listing blocking client actions.

**Out of scope (ROADMAP assignment):**
- INFRA-04 (SSL cutover on production domain) → Phase 4.
- INFRA-06 (handoff documentation) → Phase 4.

**Client actions required (cannot proceed without) — from ROADMAP Phase 1:**
- Client creates Vercel team; invites craig@neuralrebel.ai as Admin.
- Client creates Resend account; invites Craig; approves DNS records.
- Client confirms/creates Cloudflare account owning zone; invites Craig as Admin.
- Client generates Square production API creds (or approves Craig generating them from client-logged-in session) with `CUSTOMERS_WRITE` permission.

## Standard Stack

### Platform Accounts

| Service | Purpose | Plan Required | Who Owns |
|---------|---------|---------------|----------|
| Vercel Team | Hosting, deploys, env vars, analytics | Hobby acceptable for single-site; Pro needed only if client wants team seats or password protection | Client |
| Resend | Transactional email (contact form → staff) | Free tier (3k emails/mo) is sufficient for contact-form volume | Client |
| Cloudflare | Authoritative DNS + eventual CDN/WAF | Free plan covers DNS + proxy + shared SSL | Client |
| Square Developer | Customer Directory API access | Free — tied to existing merchant account | Client |

### Node SDKs (installed in Phase 2, listed here for env-var planning)

| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| `resend` | ^4.x (current as of 2026-04) | Transactional email send | Official SDK, first-party support [VERIFIED: resend.com/docs/send-with-nextjs] |
| `square` | ^43.x (current as of 2026-04) | Customer Directory write | Official SDK; alternative is raw `fetch` to `/v2/customers` [VERIFIED: developer.squareup.com docs] |

**Version verification step for planner:** Before Phase 2, run `npm view resend version` and `npm view square version` to confirm current majors. Training snapshot may be stale.

### Alternatives Considered

| Instead of | Could Use | Tradeoff / When Appropriate |
|------------|-----------|------------------------------|
| Cloudflare full nameserver delegation | Cloudflare partial/CNAME setup | Partial setup only available on Enterprise; free/pro require full. Locked to full. |
| Transferring domain registrar to Cloudflare Registrar | Keep domain at current registrar, just delegate NS | Keeping at current registrar is lower-risk — registrar transfer triggers ICANN 60-day lock and requires auth code from losing registrar. Recommend NS delegation only. [CITED: developers.cloudflare.com] |
| Square personal access token | Square OAuth | OAuth is for multi-merchant apps. This is a single-merchant integration — personal access token is simpler and sufficient. [VERIFIED: developer.squareup.com/docs/build-basics/access-tokens] |
| Transfer GitHub repo to client org | Keep under `defrostedcanuck`, add client as collaborator | See GitHub Repo Ownership section below — recommendation: keep under Neural Rebel during build, defer transfer to Phase 4 handoff. |

## Architecture Patterns

### Account Provisioning Pattern

```
Client creates account → Client invites craig@neuralrebel.ai as Admin
                      → Craig verifies access in provider dashboard
                      → Craig performs technical setup
                      → Output: credential stored in Vercel env (production source of truth)
```

**Principle:** Client is always the account owner. Craig is always a guest Admin. No agency-owned accounts ever touch the site.

### Credential Storage Pattern

**Source of truth:** Vercel project env vars, scoped to `Production` + `Preview`.
**Local dev:** `.env.local` (gitignored) with **sandbox/dev credentials only**.
**Never:** Commit production credentials to repo. Never store in code.

**Env var scoping in Vercel:**
- `Production` — real production secrets (Resend prod API key, Square production access token).
- `Preview` — same values as Production for this project (preview deploys should be able to test lead capture end-to-end in staging, but to a **test list or test customer group** — see Square gotchas).
- `Development` — only if using `vercel env pull` locally; otherwise omit.

### DNS Cutover Pattern (Phase 1 prep only — actual cutover is Phase 4)

Phase 1 does NOT flip the production domain. Phase 1 ends with:
- Cloudflare zone created, all existing live-site records mirrored into Cloudflare.
- Registrar NS **not yet changed** to Cloudflare — verify records match live state first.
- Vercel project has `www.theskincafe.net` (or subdomain) added as a pending domain awaiting DNS proof.

Phase 4 performs the NS flip and SSL cutover. This split is deliberate and matches the ROADMAP (INFRA-04 → Phase 4).

### Anti-Patterns to Avoid

- **Flipping nameservers before auditing existing DNS.** Any missing MX/TXT record post-flip = broken business email. [VERIFIED: Cloudflare docs — "Review DNS records" is step 2 of 4 for a reason.]
- **Creating a Vercel project fresh on the client's team instead of transferring.** Would lose deploy history, preview URLs, and git integration state. Transfer is the supported zero-downtime path. [VERIFIED: vercel.com/docs/projects/transferring-projects]
- **Using a single Square access token for dev + prod.** Dev activity would write to the live customer list. Use sandbox token for dev; production personal access token for prod + preview. [VERIFIED: developer.squareup.com — separate Sandbox and Production credentials per app]
- **Storing API keys in `.env.local` as source of truth.** Rsync clobber memory confirms — `.env*` gets overwritten on deploys. Vercel env is source of truth; local is scratch.

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| DNS record management UI | Custom Cloudflare dashboard | Cloudflare dashboard (free) | Full-featured, includes propagation checks, DNSSEC, audit log. |
| Email deliverability monitoring | Log-parsing + alerting | Resend dashboard status | Resend surfaces verification status + bounce/complaint rates natively. |
| Square customer deduplication | Email-based dedupe in our code | `SearchCustomers` API before `CreateCustomer` + `idempotency_key` | Square's idempotency window handles double-submits; SearchCustomers handles server-side dedupe. Rolling our own loses their dedup logic. [CITED: developer.squareup.com] |
| SPF/DKIM record generation | Hand-crafted TXT values | Copy-paste from Resend dashboard | Resend generates project-specific values; hand-crafting = typos = 72h failure window. |

## Common Pitfalls

### Pitfall 1: Cloudflare scan misses subdomain records

**What goes wrong:** Cloudflare's DNS import scans common record types but can miss obscure CNAMEs — a booking widget subdomain, an email forwarding record, or Google/Microsoft verification TXTs set long ago.

**Why it happens:** Cloudflare probes known record names. Custom subdomains or DMARC records can slip through.

**How to avoid:**
- Before initiating Cloudflare setup, run `dig ANY theskincafe.net @8.8.8.8 +noall +answer` and `dig TXT theskincafe.net`, `dig MX theskincafe.net`, `dig CNAME www.theskincafe.net`, etc.
- Document every record type currently resolving.
- After Cloudflare import, diff against that baseline. Add any missing records manually BEFORE NS flip.

**Warning signs:** "Business email stopped working" 1 hour after NS flip = missing MX. "Booking page 404s" = missing subdomain CNAME.

### Pitfall 2: Square sandbox vs production confusion

**What goes wrong:** Developer uses production token locally while "just testing," pollutes real customer list with `test@test.com` entries that now show up in the client's Square Marketing campaigns.

**Why it happens:** Both tokens look identical format-wise; only the base URL differs (`connect.squareupsandbox.com` vs `connect.squareup.com`). Easy to swap by accident.

**How to avoid:**
- Dev code reads base URL from env: `SQUARE_API_BASE=https://connect.squareupsandbox.com`.
- Never hardcode `connect.squareup.com` — always env-driven.
- Local `.env.local` ONLY has sandbox token + sandbox base URL.
- Vercel Production + Preview env has production token + production base URL.
- If a customer record test is needed on production data, do it via a documented test customer email (e.g. `qa+dated-tag@theskincafe.net`) that staff can later bulk-delete.

**Warning signs:** Customer list entries with obvious dev emails, creation timestamps during local dev hours.

### Pitfall 3: Resend domain verification stalls > 72h = re-start

**What goes wrong:** DNS records entered incorrectly (trailing dot, wrong host like `send.theskincafe.net` instead of just `send`), verification never completes, status flips to "failed" after 72 hours. Must delete and re-add domain.

**Why it happens:** Cloudflare auto-appends the zone to the Name field — if you paste `send.theskincafe.net`, Cloudflare stores it as `send.theskincafe.net.theskincafe.net`. Resend-for-Cloudflare guide explicitly warns to paste only `send`. [VERIFIED: resend.com/docs/dashboard/domains/cloudflare]

**How to avoid:**
- When adding records in Cloudflare, Name field = `send` (not `send.theskincafe.net`), `resend._domainkey` (not `resend._domainkey.theskincafe.net`).
- Verify immediately after saving: `dig TXT send.theskincafe.net` should return the SPF record.
- DKIM record proxy status must be "DNS Only" (grey cloud, not orange). Orange cloud proxying breaks verification.

**Warning signs:** Resend dashboard stuck on "pending" after 30 minutes.

### Pitfall 4: Vercel integrations don't transfer

**What goes wrong:** GitHub integration, Vercel Analytics connections, third-party marketplace integrations vanish after project transfer. Deploys stop firing from git pushes until re-linked.

**Why it happens:** Official Vercel docs state integrations are NOT transferred. [VERIFIED: vercel.com/docs/projects/transferring-projects — "What is not transferred" list]

**How to avoid:**
- After transfer, immediately verify: (a) git repository is linked in client team project settings, (b) a manual redeploy triggers successfully, (c) any push to `main` triggers an auto-deploy.
- If GitHub integration broke, re-install the Vercel GitHub App on the client's team and re-connect the repo.

**Warning signs:** `git push` succeeds but no deploy appears in client team dashboard.

### Pitfall 5: CAA record blocks Let's Encrypt after Cloudflare import

**What goes wrong:** Existing CAA records from a prior provider whitelist a different CA (e.g. DigiCert only). Vercel's SSL provisioning via Let's Encrypt then fails silently.

**Why it happens:** If ANY CAA record exists, Let's Encrypt is excluded unless explicitly allowed. [VERIFIED: vercel.com/docs/domains/troubleshooting — "Missing CAA records"]

**How to avoid:**
- Run `dig CAA theskincafe.net` as part of DNS baseline audit.
- If CAA records exist, ensure `0 issue "letsencrypt.org"` is present (add if not).
- If no CAA records exist, do nothing — Vercel auto-adds one on SSL provisioning.

**Warning signs:** Domain added to Vercel but never moves out of "pending SSL" state in Phase 4.

### Pitfall 6: DNS TTL too long at cutover

**What goes wrong:** Existing DNS records have TTL = 86400 (24h). Nameserver change propagates fast, but individual record changes during the window get cached for a full day, making rollback impossible.

**Why it happens:** Default TTL on many registrars is 1 day.

**How to avoid (Phase 4 task, surfaced here for Phase 1 prep):**
- 48 hours BEFORE the planned NS flip, lower TTLs on all current records to 60s at the CURRENT DNS provider.
- Wait full 24h for the 86400-second cache to age out.
- Then flip NS to Cloudflare. Rollback window = 60s.

**Warning signs:** Phase 4 cutover that was supposed to take 5 minutes drags into 24h of mixed resolution.

## Runtime State Inventory

**Trigger:** This phase rebinds infrastructure ownership. Runtime state matters for what follows Craig from the Neural Rebel accounts into the client accounts.

| Category | Items Found | Action Required |
|----------|-------------|------------------|
| **Stored data** | `.vercel/project.json` on local machine pins `projectId` + `orgId` (team_SgLdPAO4LBFQUJZ4x4VoMGLo = Neural Rebel). After transfer this file must be regenerated (`vercel link` against the client team's project). | Delete `.vercel/project.json` after transfer; re-run `vercel link`. |
| **Stored data** | GitHub repo `defrostedcanuck/theskincafe-site` — commits history, issues, actions (if any). Not in client's org. | Decision: see GitHub Repo Ownership section. Default: defer ownership transfer to Phase 4. |
| **Live service config** | No existing Resend config (new account). No existing Square dev app (new). No existing Cloudflare zone under client (new). | None — greenfield for these services. |
| **Live service config** | Existing live site at `theskincafe.net` — currently hosted wherever (unknown; must be discovered via DNS audit). Has current DNS records that must be preserved during Cloudflare import. | DNS baseline audit before Cloudflare onboarding. |
| **Live service config** | Client's Square merchant account — already live, already has a real customer list feeding Square Marketing. A dev application in Square Developer Dashboard is what needs to be created (tied to their merchant account). | Create Square developer application under client's merchant login; issue sandbox + production access tokens. |
| **OS-registered state** | None — this is cloud-service state only. No Craig-local systemd/launchd/task-scheduler entries tied to theskincafe. | None — verified by inspection. |
| **Secrets/env vars** | No existing secrets in repo or `.env.local` on disk (verified: `ls -la .env*` returned no matches). Vercel project currently has no env vars set (new project). | Fresh seed — list below in "Environment Variables to Provision." |
| **Build artifacts** | `.vercel/` directory exists with stale project link pointing at Neural Rebel team. `node_modules/` is local and irrelevant to transfer. | Regenerate `.vercel/` after transfer. |

## Environment Availability

| Dependency | Required By | Available | Version | Fallback |
|------------|-------------|-----------|---------|----------|
| `vercel` CLI | Project re-link, env var set from CLI | Check required | — | Web dashboard |
| `dig` | DNS baseline audit | ✓ (standard on macOS) | — | — |
| Web browser access to Vercel/Resend/Cloudflare/Square dashboards | All provisioning flows | ✓ | — | — |
| GitHub CLI (`gh`) | Repo settings / collaborator management if chosen | Likely ✓ | — | Web UI |
| Node 20+ | Baseline for SDK compat (Phase 2) | Deferred | — | — |

**Missing dependencies with no fallback:** None.

**Missing dependencies with fallback:** `vercel` CLI — if not installed, install via `npm i -g vercel@latest` or use dashboard. Planner should include "verify `vercel` CLI installed" as a check in the first task.

## Code Examples

### Square CreateCustomer — minimal request (referenced in Phase 2, used here only to justify env var set)

```typescript
// Phase 2 will implement this. Phase 1 only seeds the env vars.
// Source: https://developer.squareup.com/reference/square/customers-api/create-customer

const res = await fetch(`${process.env.SQUARE_API_BASE}/v2/customers`, {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${process.env.SQUARE_ACCESS_TOKEN}`,
    'Content-Type': 'application/json',
    'Square-Version': '2024-10-17', // Planner: verify latest at time of implementation
  },
  body: JSON.stringify({
    idempotency_key: crypto.randomUUID(), // UUID recommended; any unique string works
    email_address: email,
    reference_id: 'web-lead-behind-the-glow', // so staff can segment in Square Marketing
  }),
});
```

Env vars referenced: `SQUARE_API_BASE`, `SQUARE_ACCESS_TOKEN`. (Location ID is NOT required for CreateCustomer — it's a merchant-scoped operation, not location-scoped. Including `SQUARE_LOCATION_ID` is still reasonable for future booking-related calls but is optional for LEAD-02.)

### Resend transactional send (Phase 2 reference)

```typescript
// Source: https://resend.com/docs/send-with-nextjs
import { Resend } from 'resend';
const resend = new Resend(process.env.RESEND_API_KEY);

const { data, error } = await resend.emails.send({
  from: 'Contact Form <contact@send.theskincafe.net>', // send subdomain = Resend's recommended pattern
  to: [process.env.STAFF_NOTIFICATION_EMAIL!],
  subject: `New contact: ${form.name}`,
  html: `...`,
});
```

Env vars: `RESEND_API_KEY`, `STAFF_NOTIFICATION_EMAIL`.

## Environment Variables to Provision (Vercel)

Seeded during Phase 1. Values produced by the provisioning tasks themselves.

| Env Var | Scope | Dev Value Source | Prod/Preview Value Source |
|---------|-------|------------------|---------------------------|
| `RESEND_API_KEY` | Production, Preview | `re_test_...` dev key from Resend dashboard (for local) | `re_...` prod API key, restricted to verified `theskincafe.net` sending domain |
| `STAFF_NOTIFICATION_EMAIL` | Production, Preview, Development | placeholder during build; real value from client | e.g. `hello@theskincafe.net` (client confirms) |
| `SQUARE_ACCESS_TOKEN` | Production, Preview | Square **sandbox** access token | Square **production** personal access token (`CUSTOMERS_WRITE` scope) |
| `SQUARE_API_BASE` | Production, Preview, Development | `https://connect.squareupsandbox.com` | `https://connect.squareup.com` |
| `SQUARE_APPLICATION_ID` | Production, Preview | sandbox app id | production app id |
| `SQUARE_LOCATION_ID` | Production, Preview | optional — default location from sandbox seller | optional — primary location from client merchant (Gilbert OR Scottsdale) |
| `NEXT_PUBLIC_SITE_URL` | Production, Preview, Development | `http://localhost:3000` | `https://www.theskincafe.net` (or whichever final host) |

**Note on `NEXT_PUBLIC_*`:** Next.js exposes these to the browser. OK here because site URL is public info. Do NOT prefix Square or Resend keys with `NEXT_PUBLIC_` — they are server-only.

## DNS Records to Land in Cloudflare

### For Resend sending domain verification

Assumes final production domain is `theskincafe.net` (confirm with client). Paste values exactly as shown by Resend dashboard — values below are structural references, not to be hand-coded.

| Type | Name (in Cloudflare) | Value (pattern) | TTL | Proxy |
|------|---------------------|-----------------|-----|-------|
| MX | `send` | `feedback-smtp.us-east-1.amazonses.com` priority 10 | Auto | DNS only |
| TXT | `send` | `v=spf1 include:amazonses.com ~all` | Auto | — |
| TXT | `resend._domainkey` | Resend-generated DKIM public key | Auto | **DNS only (grey cloud — mandatory)** |
| TXT | `_dmarc` | `v=DMARC1; p=none; rua=mailto:dmarc@theskincafe.net;` (or equivalent mailbox) | Auto | — |

[VERIFIED: resend.com/docs/dashboard/domains/cloudflare + resend.com/docs/dashboard/domains/dmarc]

### For Vercel production domain attachment (Phase 4 flip, Phase 1 preps)

Apex `theskincafe.net`:
| Type | Name | Value | Proxy |
|------|------|-------|-------|
| A | `@` | `76.76.21.21` | DNS only (Vercel handles SSL via HTTP-01; proxying breaks it) |

Subdomain `www.theskincafe.net`:
| Type | Name | Value | Proxy |
|------|------|-------|-------|
| CNAME | `www` | `cname.vercel-dns.com` (Vercel provides exact project-specific value in domain-config UI) | DNS only |

[VERIFIED: vercel.com/docs/domains/working-with-dns and /troubleshooting — apex A record `76.76.21.21`, subdomain CNAMEs are project-specific from the Vercel dashboard]

### CAA record check (ensures Let's Encrypt can issue)

| Type | Name | Value | Notes |
|------|------|-------|-------|
| CAA | `@` | `0 issue "letsencrypt.org"` | Only add if other CAA records already exist on the domain; otherwise Vercel auto-adds |

### Records to preserve from existing DNS provider

Must be audited on-site. Placeholder for planner to enumerate after `dig` baseline:
- Existing MX records for business email (Google Workspace, Microsoft 365, email forwarder).
- Existing TXT records (Google site verification, Microsoft verification, existing SPF if email already set up).
- Existing CNAMEs for `www`, `calendar`, `blog`, etc.
- Existing A records for apex pointing at current host.

## DNS Cutover Sequence

Phase 1 stops at step 6. Steps 7–10 are Phase 4.

| Step | Action | Owner | Blocks On |
|------|--------|-------|-----------|
| 1 | Baseline audit: `dig` all record types on `theskincafe.net` + `www.theskincafe.net`. Document output in the phase's artifacts. | Craig | Nothing |
| 2 | Client creates Cloudflare account (if not already), invites craig@neuralrebel.ai as Admin. | Client | Nothing |
| 3 | Craig adds `theskincafe.net` to Cloudflare. Cloudflare scans and imports records. | Craig | Step 2 |
| 4 | Diff Cloudflare-imported records vs. step 1 baseline. Add any missing records manually in Cloudflare. | Craig | Step 3 |
| 5 | Add Resend verification records (from Resend dashboard once account is live) to Cloudflare. DKIM = grey cloud. | Craig | Step 4 + Resend account active |
| 6 | At current DNS provider (registrar or prior host's DNS), lower TTL on all live records to 60s. | Craig | Step 4 (so we know what we're lowering) |
| 7 | **(Phase 4)** Wait 24h for old TTLs to age out of caches. | — | Step 6 + 24h |
| 8 | **(Phase 4)** At domain registrar, change nameservers to Cloudflare's assigned pair. | Client (registrar login) / Craig if delegated | Step 7 |
| 9 | **(Phase 4)** Monitor propagation (`dig NS theskincafe.net @8.8.8.8`, `whatsmydns.net`). | Craig | Step 8 |
| 10 | **(Phase 4)** Attach production domain to Vercel project → Vercel provisions Let's Encrypt cert → HTTPS live. | Craig | Step 9 |

**Rollback window:** Because TTL was lowered to 60s in step 6 and the NS change is at the registrar, rollback at step 8 is "change NS back at registrar, wait 60s." Acceptable blast radius.

## GitHub Repo Ownership

Current: `defrostedcanuck/theskincafe-site` (Neural Rebel / Craig's GitHub).

**Three options:**

| Option | Pros | Cons |
|--------|------|------|
| **A. Keep under `defrostedcanuck`, add client as collaborator** | Zero Vercel re-link work. Simpler during active build. | Client doesn't technically own the repo during build. |
| **B. Transfer repo to client's GitHub org now** | Clean ownership from day one. | Client must have/create a GitHub org. Vercel GitHub App must be re-authorized on new org (breaks auto-deploy briefly — minutes, not hours). Repo URL changes → local remote needs `git remote set-url`. |
| **C. Keep repo at Neural Rebel permanently; client gets a zip at handoff** | Simplest for Craig. | Breaks the "client owns everything" promise. Not recommended. |

**Recommendation:** Option A during Phase 1–3, transfer (Option B) during Phase 4 as part of handoff (INFRA-06). This minimizes mid-build disruption to Vercel auto-deploy and keeps the ownership-transfer blast radius contained to the handoff window. Flag this in the phase plan for client confirmation.

## Square API Reference Card

### Endpoints used in Phase 2
| Operation | Method | Path | Purpose |
|-----------|--------|------|---------|
| Create customer | POST | `/v2/customers` | Write email from "Behind the Glow" teaser |
| Search customer (dedup) | POST | `/v2/customers/search` | Prevent dupes before create |

### Auth
```
Authorization: Bearer {SQUARE_ACCESS_TOKEN}
Content-Type: application/json
Square-Version: 2024-10-17
```
[VERIFIED: developer.squareup.com/docs/customers-api + /reference/square/customers-api/create-customer]

### Base URLs
- Sandbox: `https://connect.squareupsandbox.com`
- Production: `https://connect.squareup.com`

### Required OAuth scope (if ever switching from personal token)
`CUSTOMERS_WRITE` (plural). Also need `CUSTOMERS_READ` for the dedup search. [VERIFIED: developer.squareup.com/docs/oauth-api/square-permissions via web search]

### Rate limits
Square does not publish per-endpoint numeric rate limits. On `429 RATE_LIMITED`, use exponential backoff. For a contact-form-driven flow (low volume, human-paced), rate limits will never trigger; documenting here only so Phase 2 error handling has graceful 429 retry. [CITED: developer.squareup.com community forum + error-handling docs]

### Idempotency
`idempotency_key` field in request body. Format: any unique string; `crypto.randomUUID()` recommended. Dedup window not publicly documented; assume long enough to cover double-submit on same session.

## Resend Reference Card

### Env var name (standard)
`RESEND_API_KEY` [VERIFIED: resend.com/docs/send-with-nextjs]

### Sending domain pattern
Send from `contact@send.theskincafe.net` (subdomain `send`), not from apex. Matches Resend-recommended pattern; keeps apex DNS clean for inbound mail. [VERIFIED: resend.com/docs/dashboard/domains/cloudflare]

### Verification timeline
Typically < 1 hour after DNS records propagate. Hard deadline: 72 hours before Resend marks domain "failed" and requires re-add. [VERIFIED: resend.com/docs/dashboard/domains/introduction]

## Vercel Project Transfer Reference

### Preserved on transfer [VERIFIED: vercel.com/docs/projects/transferring-projects]
- Deployments + build history
- Environment variables (EXCEPT ones defined in `vercel.json` `env` / `build.env` — not applicable; this project has no `vercel.json`)
- Domains + aliases (delegated to target team)
- Git repository link
- Project config (function region, directory listing, etc.)
- Cron jobs, Web Analytics, Speed Insights
- Preview Comments, Administrators

### NOT preserved [VERIFIED: same source]
- Integrations (Vercel Marketplace integrations — must reinstall)
- Edge Configs (separate transfer mechanism; not used here)
- Monitoring data, runtime logs, build logs
- Custom Log Drains
- Vercel Blob (separate mechanism; not used here)
- Secure Compute + Static IPs (not applicable — not on Enterprise)
- Active Branches section (starts empty)
- Usage counters (reset)

### Prerequisites
- Craig must be Owner on source team (`team_SgLdPAO4LBFQUJZ4x4VoMGLo` = Neural Rebel — he is).
- Craig must be a member (any role) on target client team.
- Target team MUST have a valid payment method attached BEFORE transfer. This is the most common failure mode.
- Transfer takes 10s–10min. During transfer, no deploys/edits possible.

### Post-transfer tasks
1. Delete local `.vercel/project.json`; run `vercel link` to re-link to client team's project.
2. Re-install Vercel GitHub App on client team if auto-deploys stop firing.
3. Verify all env vars present under client team → Project → Settings → Environment Variables.
4. Trigger one manual deploy to confirm pipeline.

## State of the Art

| Old Approach | Current Approach | Why |
|--------------|------------------|-----|
| DKIM with CNAME delegation records | Resend uses direct TXT records for DKIM | Simpler; no dependency on Resend's infra for DNS resolution at send-time |
| Raw Square OAuth for single-merchant integrations | Square personal access tokens for first-party apps | OAuth is overkill for a merchant-owned app writing to their own account |
| DNS cutover with no TTL lowering | Pre-lower TTL to 60s 24h before flip | Standard industry practice; preserves rollback window |
| Cloudflare partial setup (CNAME-only) | Full nameserver delegation | Partial setup is Enterprise-only on Cloudflare now [VERIFIED: developers.cloudflare.com] |

**Deprecated:**
- Cloudflare IPv6-only AAAA records for Vercel — Vercel does not support IPv6 inbound. [VERIFIED: vercel.com/docs/domains/troubleshooting]

## Assumptions Log

| # | Claim | Section | Risk if Wrong |
|---|-------|---------|---------------|
| A1 | Production domain is `theskincafe.net` | Throughout | Minor — all DNS record names parameterize on the actual final domain; planner must confirm with client. Unclear whether `.net`, `.com`, or other TLD is the production target. |
| A2 | Client already owns the production domain at some registrar (not yet registered freshly) | Cutover Sequence | Medium — if domain does not exist yet, the "preserve existing live site" constraint evaporates and Phase 1 gets simpler, not harder. Good news if wrong. |
| A3 | Client's Square merchant account can generate personal access tokens (no OAuth restriction from Square Partnerships program) | Square Auth | Low — worst case we pivot to OAuth flow in Phase 2. |
| A4 | Staff notification email address has not yet been chosen (from STATE.md "Open Todos") | Env Vars | Low — placeholder value acceptable until client confirms. |
| A5 | The Resend Free tier (3k emails/mo) will cover contact-form volume | Standard Stack | Very low — contact forms send 10s/month, not thousands. |
| A6 | Client's Vercel team will be Hobby plan (sufficient for single-site). If client opts for Pro (team seats, password protection), cost/feature tradeoff is their decision, not a technical blocker. | Standard Stack | Low — technical path identical. |
| A7 | Client's GitHub org exists or they're willing to create one, IF Option B repo transfer is chosen in Phase 4. | GitHub Repo Ownership | Low — Option A default hedges this. |

## Open Questions (RESOLVED)

All four open questions have been resolved during planning and tracked in phase plans. Resolutions documented inline below.

1. **What is the exact production domain?**
   - What we know: `theskincafe-site.vercel.app` is the current preview. Additional context names `theskincafe.net` as the existing live site location.
   - What's unclear: Is `.net` the locked production domain, or is there a `.com` / other variant? Does the client intend to use a subdomain like `www.theskincafe.net` as canonical, or apex?
   - Recommendation: Planner opens with a client-confirmation task. Blocks nothing upstream but must be resolved before any DNS records land.
   - **RESOLVED:** Assumed `theskincafe.net` apex (per Assumption A1); deferred to client confirmation during kickoff. Tracked in Plan 01-01 Task 2 (baseline artifact flags this as a pending client confirmation).

2. **Where is the existing live `theskincafe.net` site hosted today?**
   - What we know: A live site exists.
   - What's unclear: Is it on GoDaddy shared hosting, Squarespace, Wix, Webflow, another WordPress host? This determines what registrar/DNS-provider access the client needs to grant for the Phase 4 cutover.
   - Recommendation: Part of the Phase 1 DNS baseline task — `dig NS theskincafe.net` reveals current provider. Capture in phase artifacts.
   - **RESOLVED:** Discovered via `dig NS theskincafe.net` and related queries in Plan 01-01 Task 1 (DNS baseline captures current authoritative nameservers and full record inventory).

3. **GitHub repo ownership timing — confirm Option A (defer to Phase 4) vs. Option B (transfer now)?**
   - What we know: Repo is at `defrostedcanuck/theskincafe-site`. Client ownership is the end state.
   - What's unclear: Client's GitHub org status, and their preference on when transfer happens.
   - Recommendation: Default to Option A (collaborator now, transfer at Phase 4 handoff). Include explicit question in phase plan for client sign-off.
   - **RESOLVED:** Defer transfer to Phase 4 handoff (Option A). Repo stays at `defrostedcanuck/theskincafe-site` during Milestone 1 build. Client GitHub org status revisited at Phase 4 handoff kickoff.

4. **Should Preview deploys hit production Square or sandbox?**
   - What we know: Preview is Vercel's per-PR deploy environment. Hitting production Square means PR testing writes real customer records. Hitting sandbox means PRs can't end-to-end-verify against real creds.
   - What's unclear: Which the client prefers.
   - Recommendation: Hit **sandbox** on Preview by default (set `SQUARE_API_BASE` and `SQUARE_ACCESS_TOKEN` to sandbox values in Preview scope). Keeps the live customer list untouched. Document explicitly.
   - **RESOLVED:** Sandbox. Locked in Plan 01-05 env seeding (Preview scope receives Square sandbox `SQUARE_ACCESS_TOKEN` and `SQUARE_API_BASE=https://connect.squareupsandbox.com`). Prevents Preview PRs from writing to the client's live customer list.

## Sources

### Primary (HIGH confidence)
- [Vercel — Transferring a project](https://vercel.com/docs/projects/transferring-projects) — preserved/not-preserved lists, prerequisites, timing
- [Vercel — Add a domain](https://vercel.com/docs/domains/working-with-domains/add-a-domain) — A record vs CNAME vs nameservers
- [Vercel — Troubleshooting domains](https://vercel.com/docs/domains/troubleshooting) — apex IP `76.76.21.21`, CAA records, IPv6 non-support
- [Vercel — Working with DNS](https://vercel.com/docs/domains/working-with-dns) — TTL best practices, propagation timing
- [Resend — Cloudflare DNS setup](https://resend.com/docs/dashboard/domains/cloudflare) — exact record types, Name patterns, proxy-off requirement for DKIM
- [Resend — DMARC](https://resend.com/docs/dashboard/domains/dmarc) — apex `_dmarc` placement, `p=none` starting policy
- [Resend — Domains introduction](https://resend.com/docs/dashboard/domains/introduction) — SPF/DKIM required, DMARC optional, 72h failure deadline
- [Resend — Send with Next.js](https://resend.com/docs/send-with-nextjs) — `RESEND_API_KEY` env var, send flow
- [Square — Customers API overview](https://developer.squareup.com/docs/customers-api/what-it-does) — endpoint, method, base URLs
- [Square — CreateCustomer reference](https://developer.squareup.com/reference/square/customers-api/create-customer) — request/response schema, idempotency_key field
- [Square — Access tokens](https://developer.squareup.com/docs/build-basics/access-tokens) — personal vs OAuth, sandbox vs production separation
- [Square — Idempotency pattern](https://developer.squareup.com/docs/build-basics/common-api-patterns/idempotency) — UUID recommended, uniqueness requirement
- [Cloudflare — Full zone setup](https://developers.cloudflare.com/dns/zone-setups/full-setup/setup/) — four-step process, 24h propagation, record audit requirement

### Secondary (MEDIUM confidence — verified via search, cross-referenced with primary)
- [Square OAuth permissions reference (via WebSearch)](https://developer.squareup.com/docs/oauth-api/square-permissions) — `CUSTOMERS_WRITE` scope name confirmed (plural)
- [Square API rate limits discussion (forums + docs)](https://developer.squareup.com/docs/build-basics/general-considerations/handling-errors) — no published numeric per-endpoint limit; backoff on 429

### Tertiary (LOW confidence — flagged for validation)
- None used in final recommendations.

## Metadata

**Confidence breakdown:**
- Standard Stack: HIGH — all four services have authoritative docs verified this research session.
- DNS records: HIGH — Resend + Vercel specs cross-verified; only the final domain name is parameterized pending client confirmation.
- Cutover sequence: HIGH — matches Cloudflare, Vercel, and DNS-industry best practice.
- Pitfalls: HIGH — each pitfall tied to a specific source or direct doc statement.
- GitHub repo decision: MEDIUM — decision tree is sound, but pending client preference on Option A vs B.

**Research date:** 2026-04-20
**Valid until:** 2026-05-20 (30 days — all services involved are mature; API surfaces are stable quarter-over-quarter)
