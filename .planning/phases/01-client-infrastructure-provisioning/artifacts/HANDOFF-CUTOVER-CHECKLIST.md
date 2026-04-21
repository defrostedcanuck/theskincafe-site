# Phase 1 Handoff-Cutover Checklist

**Phase:** 1 — Client Infrastructure Provisioning
**Plan:** 01-01 — Baseline & Handoff Scaffold (authoring this document)
**Last updated:** 2026-04-20
**Ground-truth DNS reference:** [`./DNS-BASELINE.md`](./DNS-BASELINE.md) (captured 2026-04-20T23:59:40Z)
**Purpose:** Single source of truth for the rest of Phase 1. Partitions every remaining task into three lanes: **Client-Blocking** (cannot start without client action), **Craig-Unblocked** (can run in parallel, no client dependency), and **Post-Client-Action** (Craig-owned work that unblocks once a specific client gate clears).

> This artifact satisfies ROADMAP.md Phase 1 Success Criterion #5: *"An explicit handoff-cutover checklist exists listing blocking client actions."*

---

## Canonical Production Domain (pending client confirmation)

| Field | Working assumption | Source |
|-------|--------------------|--------|
| Domain | `theskincafe.net` | RESEARCH.md Assumption A1 + STATE.md context |
| Canonical form | **Apex** (`theskincafe.net`), with `www` as CNAME alias to apex | Current DNS state per `DNS-BASELINE.md` query #9 |
| TLD variant exists | `theskincafe.com` also resolves (different NS, AWS Global Accelerator IPs) — **not yet confirmed as in-or-out of scope** | `DNS-BASELINE.md` Supplemental Queries |

**Status:** Not client-confirmed. **See Open Question #1 below** — this MUST be resolved before Plan 03 adds a zone to Cloudflare, or we'll provision the wrong TLD.

---

## Per-Plan Status

| Plan | Wave | Name | Status | Waiting On |
|------|------|------|--------|------------|
| 01-01 | 1 | Baseline & Handoff Scaffold | **In progress** (this doc) | Nothing — completes when this file is committed |
| 01-02 | 2 | Vercel Project Transfer | **Blocked on client** | Client-Blocking #1 + #2 (Vercel team + billing) |
| 01-03 | 2 | Cloudflare Zone Provisioning | **Blocked on client** | Client-Blocking #4 (Cloudflare invite) + #1 (domain confirmation) |
| 01-04 | 2 | Resend Account + Domain Verification | **Blocked on client** | Client-Blocking #3 (Resend invite) + #6 (staff email) |
| 01-05 | 3 | Square API Credential Provisioning + Env Seed | **Blocked on client** | Client-Blocking #5 (Square creds) + all prior (env writes need Vercel team from 01-02) |

Waves 2 and 3 can run in parallel once their respective client gates clear, with the exception of Plan 01-05's env-write steps which require the Vercel team handoff from Plan 01-02 to be live first.

---

## Client-Blocking Actions (cannot proceed without)

Each row is a discrete email/chat-message request to the client. Craig cannot start the "Blocks plan(s)" work until the Status column shows complete + verified.

| # | Action | Owner (client contact) | Invited email | Status | Blocks plan(s) | How to verify completion |
|---|--------|------------------------|---------------|--------|----------------|--------------------------|
| 1 | **Create Vercel team** (Hobby plan is sufficient for single site; Pro only if client wants password protection or team seats). Invite `craig@neuralrebel.ai` as **Admin**. | Tammy / Skin Cafe primary contact | `craig@neuralrebel.ai` | ⬜ Not started | 01-02 | Run `vercel teams ls` from Craig's laptop — client team name appears in output. Alternative: Vercel dashboard → top-left team switcher shows new team. |
| 2 | **Attach valid payment method to Vercel team.** Required BEFORE project transfer per RESEARCH.md "Vercel Project Transfer Reference > Prerequisites" (most common transfer-failure cause). | Tammy / Skin Cafe billing contact | — | ⬜ Not started | 01-02 | Client team → Settings → Billing — card or invoice method shows "Active". If the team stays on Hobby, a card-on-file is still required to receive a transferred project. |
| 3 | **Create Resend account** (`resend.com`, free tier is sufficient — 3k emails/mo, the site sends contact-form traffic only). Invite Craig as team member. | Tammy / Skin Cafe primary contact | `craig@neuralrebel.ai` | ⬜ Not started | 01-04 | Craig logs into `resend.com` → workspace switcher shows the client workspace → Craig can see API Keys and Domains tabs. |
| 4 | **Create / confirm Cloudflare account.** If the client already uses Cloudflare for anything else, confirm which account. Invite `craig@neuralrebel.ai` with **Super Administrator** role (required to add zones and issue API tokens). | Tammy / Skin Cafe primary contact | `craig@neuralrebel.ai` | ⬜ Not started | 01-03 | Craig accepts invite → `dash.cloudflare.com` → top-right account switcher shows client account → Craig has "Add site" button active. |
| 5 | **Issue Square API credentials for Customer Directory.** Two acceptable paths: (a) Client logs into Square Dashboard → Developer portal → creates an application, issues a production personal access token with `CUSTOMERS_WRITE` + `CUSTOMERS_READ` scope, and securely shares it with Craig (1Password, Signal, or encrypted email). OR (b) Screen-share session with Craig so Craig performs the steps under the client's logged-in session. Sandbox credentials (for Preview) are auto-available once the Developer account is created. | Tammy / Skin Cafe primary contact with Square Dashboard access | — | ⬜ Not started | 01-05 | After Plan 01-05 completes, `vercel env ls` on the client's Vercel project shows `SQUARE_ACCESS_TOKEN` present for both `Production` and `Preview`; a one-off `curl` against `connect.squareup.com/v2/customers/search` with the production token returns HTTP 200. |
| 6 | **Confirm staff notification email** — the destination for contact-form submissions emailed via Resend. (STATE.md lists this as an "Open Todo".) | Tammy / Skin Cafe primary contact | — | ⬜ Not started | 01-04 completion | Value set in Vercel project env as `STAFF_NOTIFICATION_EMAIL` (scopes: Production + Preview + Development). Verify via `vercel env ls`. |
| 7 | **Confirm canonical production domain** — apex vs `www`, and `.net` vs `.com` vs other. See RESEARCH.md Open Question #1 and `DNS-BASELINE.md` Unknowns #1–#2. Without this, Plan 03 risks adding the wrong zone to Cloudflare or entering records under the wrong Name values. | Tammy / Skin Cafe primary contact | — | ⬜ Not started | 01-03 (all Cloudflare record entry precision) | Written confirmation (email or text) recorded in this doc's "Resolved Questions" section at the bottom; updates the "Canonical Production Domain" table at the top. |

---

## Craig-Unblocked Actions (no client dependency — can run in parallel)

These can proceed without waiting on any client gate. Run in parallel with the client-blocking outreach.

- [x] **Plan 01-01 Task 1: DNS baseline audit** — Completed 2026-04-20, artifact at [`./DNS-BASELINE.md`](./DNS-BASELINE.md).
- [ ] **Plan 01-01 Task 2: This checklist** — IN PROGRESS (this task).
- [ ] **Plan 01-05 preparatory work (env var schema documentation, value-free):** Scaffold `docs/env/` directory with a `docs/env/README.md` index documenting every env var the Phase 1 provisioning will eventually seed (`RESEND_API_KEY`, `STAFF_NOTIFICATION_EMAIL`, `SQUARE_ACCESS_TOKEN`, `SQUARE_API_BASE`, `SQUARE_APPLICATION_ID`, `SQUARE_LOCATION_ID`, `NEXT_PUBLIC_SITE_URL`) with **names and descriptions only, no values.** Safe because no secrets are involved.
- [ ] **Verify local tooling:** `vercel --version`, `gh --version`, `dig --version`, `npm view resend version`, `npm view square version`. Document any stale installs. No client dependency.
- [ ] **Verify local `.env.local` is absent** (RESEARCH.md Runtime State Inventory: currently no `.env*` on disk) — confirm before any Plan 01-05 work to avoid rsync-clobber regression.
- [ ] **Pre-draft the Cloudflare record spec** for Plan 03 using `DNS-BASELINE.md` as source. A record-by-record plan can be written now; entering it into Cloudflare is blocked on #4.

---

## Post-Client-Action Actions (Craig-owned follow-ups once each gate clears)

Maps each Client-Blocking row → the downstream Craig work it unblocks. When a gate closes, the row below unblocks and work can start immediately.

| Client-Blocking gate that clears | Craig-owned follow-up | Plan | Key tasks |
|----------------------------------|-----------------------|------|-----------|
| **#1 + #2 (Vercel team + billing)** | Vercel project transfer into client team | **01-02** | Transfer project from Neural Rebel team → client team. Delete local `.vercel/project.json`. Re-run `vercel link` against client team's project. Re-install Vercel GitHub App on client team if auto-deploys stop firing. Trigger manual redeploy to verify. Seed initial env vars (`NEXT_PUBLIC_SITE_URL` placeholder). |
| **#3 (Resend invite)** | Resend account technical setup | **01-04** | Add `send.theskincafe.net` as sending domain. Issue DKIM + SPF DNS records for entry into Cloudflare (requires gate #4 also open). Issue production API key (scoped to verified domain). Issue dev API key (`re_test_...`) for local `.env.local`. Seed `RESEND_API_KEY` in Vercel Production + Preview env. |
| **#4 (Cloudflare invite)** | Cloudflare zone provisioning | **01-03** | Add `theskincafe.net` (or confirmed canonical per gate #7) to client's Cloudflare. Let Cloudflare scan existing DNS. **Diff imported records against `DNS-BASELINE.md`; manually add any missing records** (especially `mail.theskincafe.net` A record for mojohost; existing `_dmarc`; apex SPF). Enter Resend records from gate #3's follow-up. Lower TTL to 60s at GoDaddy DNS on all records 24+h before planned Phase 4 NS flip. Add Vercel production domain as pending (no NS flip yet — that's Phase 4). |
| **#5 (Square creds)** | Square env seed | **01-05** | Create Square developer application under client's merchant account (sandbox auto-created too). Issue production personal access token with `CUSTOMERS_WRITE` + `CUSTOMERS_READ`. Seed Vercel env: `SQUARE_ACCESS_TOKEN` + `SQUARE_APPLICATION_ID` + `SQUARE_API_BASE` + (optional) `SQUARE_LOCATION_ID` for Production, and the **sandbox** equivalents for Preview (so preview PRs never write to live customer list — RESEARCH.md Pitfall 2). Update `.env.local` template with sandbox-only credentials. |
| **#6 (staff email confirmed)** | Update Vercel env `STAFF_NOTIFICATION_EMAIL` | 01-04 completion | `vercel env add STAFF_NOTIFICATION_EMAIL` across Production + Preview + Development. Redeploy to pick up value. |
| **#7 (domain confirmed)** | Finalize Cloudflare zone name and all Resend/Vercel record Names | 01-03 | If `.com` is canonical instead of `.net`, add `.com` to Cloudflare (not `.net`). Ensure Resend records from gate #3 follow-up point at the correct zone. Attach correct domain as pending-domain in Vercel project. |

---

## Phase 1 → Phase 4 Handoff Items (explicitly NOT in Phase 1 scope)

To prevent scope creep, these are called out as deferred to Phase 4. If a client conversation in Phase 1 pushes toward doing any of these now, answer: *"That's a Phase 4 handoff item — we'll do it then so bookings/mail don't break mid-build."*

- **NS flip at GoDaddy registrar** → Phase 4 only, per RESEARCH.md "DNS Cutover Sequence" steps 7–10. Phase 1 ends with Cloudflare zone *provisioned and populated*, but the registrar still points at GoDaddy nameservers `ns41/42.domaincontrol.com`.
- **Vercel production domain attachment + Let's Encrypt SSL issuance** → Phase 4 (INFRA-04 requirement).
- **Final client handoff documentation / runbook** → Phase 4 (INFRA-06 requirement).
- **GitHub repo transfer from `defrostedcanuck/theskincafe-site` to client's GitHub org** → Phase 4 per RESEARCH.md "GitHub Repo Ownership" Option A default. Craig stays as repo admin through Phases 1–3; client is added as collaborator if requested now (non-blocking).

---

## Open Questions Awaiting Client Answer

Use this section as the worksheet for the kickoff client email/chat. Each row has space for the client answer.

1. **Production domain exact value?** — Is `theskincafe.net` apex the canonical? Or is `theskincafe.com` (which also resolves, separately) the one we should be putting on Cloudflare + Vercel? Answer: _________________________________________
2. **Current registrar login access?** — Domain is registered at **GoDaddy** (confirmed via `whois`). Do you have the GoDaddy login for `theskincafe.net`? We'll need it in Phase 4 to flip nameservers to your new Cloudflare account. Answer: _________________________________________
3. **Preview-deploy Square target** — Confirming for awareness (no decision needed): Preview deploys (our per-PR staging) will hit **Square sandbox**, not production. This keeps your live customer list clean during development. Any objection? Answer: _________________________________________
4. **Staff notification email** — When someone fills out the contact form on the site, who should get the email notification? One address, or multiple? Answer: _________________________________________
5. **GitHub repo timing** — The site's code repo lives at `github.com/defrostedcanuck/theskincafe-site` today. Our default is to transfer it to your GitHub org at Phase 4 handoff (Option A from the research doc). Do you have a GitHub org ready, or would you like us to help set one up at that time? Answer: _________________________________________
6. **Email service on `@theskincafe.net`** — The DNS baseline shows no MX records at the apex, but there's a `mail.theskincafe.net` subdomain pointing at mojohost. Do staff use `@theskincafe.net` email addresses? If yes, where is that mail hosted (mojohost webmail, Google Workspace, Microsoft 365)? Answer: _________________________________________
7. **Do any other platforms send from `@theskincafe.net`?** — Mailchimp, Constant Contact, Square Marketing, Canva? We need to know so our Resend setup doesn't accidentally break an existing sender. Answer: _________________________________________

---

## Threat-Model Touchpoints (from plan frontmatter)

- **T-01-02 (Tampering of this doc):** Every edit to this file after Plan 01-01 must be via a commit with a descriptive message noting which row changed status and why. No overwrites without audit trail.
- **T-01-03 (Repudiation on client-gate unblocks):** When a Client-Blocking row's Status flips from ⬜ to ✅, the downstream plan MUST populate a "verified by" field in this doc with the exact CLI output or dashboard screenshot reference that proved completion. Example: "Verified by `vercel teams ls` output on 2026-04-25 showing team `theskincafe` in list."

---

## Change Log

| Date | Change | Commit | Author |
|------|--------|--------|--------|
| 2026-04-20 | Initial authoring (Plan 01-01 Task 2) | (this commit) | Craig Richardson |

---

*This document is the single source of truth for Phase 1 status. Update row Status columns as gates clear; do not delete rows — keep the audit trail intact through end of Phase 1.*
