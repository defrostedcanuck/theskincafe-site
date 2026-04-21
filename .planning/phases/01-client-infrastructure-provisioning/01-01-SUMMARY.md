---
phase: 01-client-infrastructure-provisioning
plan: 01
subsystem: infra
tags: [dns, dig, whois, godaddy, cloudflare, vercel, resend, square, handoff-checklist]

# Dependency graph
requires:
  - phase: 00-roadmap
    provides: ROADMAP.md Phase 1 scope, REQUIREMENTS.md INFRA-03
provides:
  - Timestamped DNS baseline snapshot of theskincafe.net (13 dig queries + whois + supplemental subdomain probes)
  - Phase 1 handoff-cutover checklist partitioning Client-Blocking / Craig-Unblocked / Post-Client-Action work
  - Identified registrar (GoDaddy), current DNS provider (GoDaddy), mail subdomain (mojohost)
  - Confirmed no CAA records (Pitfall 5 clear) and no prior Resend records (clean send subdomain)
  - Surfaced 7 client-blocking questions for kickoff
affects: [01-02-vercel-transfer, 01-03-cloudflare-zone, 01-04-resend-domain, 01-05-square-creds, 04-phase-cutover]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "DNS baseline before cutover — run 13 dig queries against 8.8.8.8 (bypass local cache) + whois, freeze output as a point-in-time artifact, then diff-validate any subsequent zone import against it"
    - "Phase-level handoff-cutover checklist — Client-Blocking / Craig-Unblocked / Post-Client-Action partitioning as Phase 1 standard"

key-files:
  created:
    - .planning/phases/01-client-infrastructure-provisioning/artifacts/DNS-BASELINE.md
    - .planning/phases/01-client-infrastructure-provisioning/artifacts/HANDOFF-CUTOVER-CHECKLIST.md
  modified: []

key-decisions:
  - "Use Google Public DNS (@8.8.8.8) for baseline queries to bypass any local resolver cache and get authoritative answers"
  - "Baseline file is a point-in-time snapshot — any future re-capture must be a new file (DNS-BASELINE-2.md etc.), never an edit to this one, to preserve audit trail"
  - "Handoff checklist surfaces theskincafe.com as a client-confirmation blocker even though RESEARCH assumed .net — .com also resolves on separate nameservers to AWS Global Accelerator"

patterns-established:
  - "Pattern 1: Baseline-first DNS cutover — capture ground truth before any zone changes"
  - "Pattern 2: Three-lane work partitioning (Client-Blocking / Craig-Unblocked / Post-Client-Action) with per-row verification criteria"

requirements-completed: [INFRA-03]

# Metrics
duration: 5min
completed: 2026-04-20
---

# Phase 1 Plan 01: Baseline & Handoff Scaffold Summary

**DNS baseline snapshot for theskincafe.net (13 dig queries + whois, GoDaddy-hosted, Cloudflare-fronted apex, no CAA) plus a 7-row client-blocking checklist partitioning all Phase 1 downstream work into Client-Blocking / Craig-Unblocked / Post-Client-Action lanes.**

## Performance

- **Duration:** ~5 min
- **Started:** 2026-04-20T23:59:40Z
- **Completed:** 2026-04-21T00:04:46Z
- **Tasks:** 2
- **Files modified:** 2 (both created)

## Accomplishments

- **DNS ground truth frozen.** Every public record type on `theskincafe.net` was probed (NS, SOA, A, AAAA, MX, TXT, CAA, CNAME, ANY) + `_dmarc` + `send` + `resend._domainkey` + 13 common subdomains + cross-TLD check on `.com` + reverse lookup on the apex IP. All output timestamped and interpreted per record so Plan 03 can diff against it.
- **Registrar identified: GoDaddy.** Domain-level `whois` revealed IANA ID 146, expires 2027-06-23, with `clientUpdateProhibited` flag set. Client will need GoDaddy login for Phase 4 NS flip.
- **Current host identified: Cloudflare-fronted.** Apex A record `162.159.135.42` is in Cloudflare's 162.159.128.0/17 range — the current provider already proxies through Cloudflare (likely Squarespace or similar), but the zone is hosted at GoDaddy DNS. Phase 4 replaces this with *client-owned* Cloudflare.
- **Mail host identified: mojohost.** `mail.theskincafe.net` A record → `99.192.153.170` → `cs2190.mojohost.com` PTR. Must be preserved during Cloudflare import.
- **Pitfall-5 (CAA) risk cleared.** No existing CAA records → Vercel's Let's Encrypt provisioning in Phase 4 will auto-succeed.
- **Cross-TLD exposure found.** `theskincafe.com` also resolves (separate NS, AWS Global Accelerator IPs) — surfaced as a blocking client-confirmation question in the handoff checklist so Plan 03 doesn't provision the wrong TLD.
- **Handoff checklist complete.** 7 client-blocking rows (Vercel team, Vercel billing, Resend invite, Cloudflare invite, Square creds, staff email, canonical-domain confirmation) each with invited-email, blocked-plan, and verification-method columns.
- **ROADMAP Phase 1 Success Criterion #5 satisfied** by the committed handoff checklist.

## Task Commits

1. **Task 1: Capture DNS baseline** — `3cb2cbb` (docs) — 243 lines of dig + whois + interpretations + Unknowns
2. **Task 2: Author handoff-cutover checklist** — `5b47623` (docs) — 123 lines, 3 partitioning sections + per-plan status + 7 client questions

## Files Created

- `.planning/phases/01-client-infrastructure-provisioning/artifacts/DNS-BASELINE.md` — timestamped DNS snapshot + supplemental probes + 8-item Unknowns list. Safe-to-commit (dig and whois output is public).
- `.planning/phases/01-client-infrastructure-provisioning/artifacts/HANDOFF-CUTOVER-CHECKLIST.md` — phase status table, Client-Blocking (7 rows), Craig-Unblocked (6 items), Post-Client-Action (6 follow-ups), Phase-4 scope exclusions, 7 open questions.

## Decisions Made

- **Query against `@8.8.8.8` not local resolver.** Guarantees cache-free answers and provides a reproducible reference point (anyone running the same query from any machine gets the same result).
- **Baseline artifact is immutable post-Task-1.** If DNS state changes mid-phase, a new file (`DNS-BASELINE-2.md`) is created rather than editing the original, preserving the audit trail. Documented in the artifact's footer.
- **Supplemental probes added beyond the 13 plan-specified queries** (Rule 2 — critical context): `.com` cross-TLD check, `mail.` subdomain, DNSSEC DS record, apex-IP reverse PTR, reverse PTR on SPF IP. Each surfaced material downstream implications (e.g., the `.com` check is a Plan-03 scope blocker; the mojohost PTR identifies the client's mail provider).
- **Handoff checklist uses ⬜/✅ status glyphs** for visual scannability and reserves a "verified by" audit-trail column per Threat T-01-03.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 2 - Missing Critical Context] Added supplemental DNS probes beyond plan's 13 queries**
- **Found during:** Task 1 (DNS baseline capture)
- **Issue:** Plan spec had 13 targeted queries but the objective was "every DNS record currently resolving on the production domain is enumerated so nothing is lost during Cloudflare import." The plan's query set missed `.com` (RESEARCH.md Open Question #1), common subdomain enumeration (Pitfall 1 mitigation), DNSSEC DS record (needed to rule out signature rollover), and reverse PTR lookups (which identified mojohost as mail host).
- **Fix:** Ran additional queries: `dig NS theskincafe.com`, `dig A theskincafe.com`, common-subdomain probe (13 names), `dig DS theskincafe.net`, `dig -x 162.159.135.42`, `dig -x 99.192.153.170`. All results added to artifact under a clearly-labeled "Supplemental Queries (beyond plan spec)" heading.
- **Files modified:** `.planning/phases/01-client-infrastructure-provisioning/artifacts/DNS-BASELINE.md` (within Task 1 scope)
- **Verification:** All supplemental queries returned useful data; the `.com` result alone (different NS, different IPs) is a material Plan-03 scoping blocker that the plan-spec queries would have missed.
- **Committed in:** `3cb2cbb` (Task 1 commit)

**2. [Rule 2 - Missing Critical Context] Flagged the `clientUpdateProhibited` registrar status as a Phase-4 risk**
- **Found during:** Task 1 (whois review)
- **Issue:** `whois` revealed `clientUpdateProhibited` set on the domain — this can block NS changes via registrar API/EPP even though it doesn't block manual UI changes. Plan did not call out registrar-lock review.
- **Fix:** Added a row to the DNS-BASELINE summary table explaining the flag's implication for Phase 4 NS-flip mechanics (client must use GoDaddy web UI, not EPP/API). No action required today, just a flag so Phase 4 doesn't hit a surprise.
- **Files modified:** DNS-BASELINE.md (within Task 1 scope)
- **Verification:** Flag documented; Phase 4 will have advance notice.
- **Committed in:** `3cb2cbb`

---

**Total deviations:** 2 auto-fixed (both Rule 2 — missing critical context for downstream plans)
**Impact on plan:** Both auto-fixes are additive to the baseline artifact (not contradictory to plan spec) and strengthen Plan 03's import-diff and Phase 4's NS-flip preparation. Zero scope creep — both stay inside the plan's stated objective of "timestamped DNS baseline so nothing is lost during Cloudflare import."

## Issues Encountered

None. Both tasks executed cleanly. `dig` and `whois` were pre-installed on macOS. All 13 queries returned within seconds. No NXDOMAIN or SERVFAIL responses on `theskincafe.net` — the domain and all probed subdomains resolved cleanly.

## Key Facts Surfaced (as required by plan `<output>` spec)

### Current infrastructure snapshot
| Item | Value |
|------|-------|
| Registrar | GoDaddy.com, LLC (IANA ID 146) |
| Authoritative NS | ns41.domaincontrol.com, ns42.domaincontrol.com (GoDaddy) |
| Apex A record | 162.159.135.42 (Cloudflare-fronted) |
| `www` | CNAME → apex |
| `mail.` subdomain | 99.192.153.170 → cs2190.mojohost.com (**mojohost email**) |
| Apex MX | **None** (suspicious — client-confirm whether they receive apex email) |
| SPF | `v=spf1 a mx ip4:99.192.153.170 ~all` (authorizes mojohost IP) |
| DMARC | `p=quarantine` (enforcement-mode), reports to dmarc_rua@onsecureserver.net |
| CAA | None (Let's Encrypt unblocked for Phase 4) |
| DNSSEC | Unsigned |
| Domain expiry | 2027-06-23 |

### Surprise records
- **`theskincafe.com` also resolves** on separate GoDaddy NS (ns21/22) to AWS Global Accelerator IPs. Not in RESEARCH scope. Now tracked as Client-Blocking Question #1.
- **No apex MX but an SPF + mail subdomain exists** — unusual combo, flagged for client.

### Resolved vs. outstanding client questions

| # | Question | Status |
|---|----------|--------|
| 1 | Domain exists and resolves? | **RESOLVED** — `theskincafe.net` is live, resolves cleanly |
| 2 | Current DNS provider? | **RESOLVED** — GoDaddy |
| 3 | CAA record risk? | **RESOLVED** — none present |
| 4 | Existing Resend/DKIM collision? | **RESOLVED** — none |
| 5 | Canonical TLD (.net vs .com)? | **OUTSTANDING** — blocks Plan 03 |
| 6 | Canonical form (apex vs www)? | **OUTSTANDING** — blocks Plan 03 |
| 7 | GoDaddy registrar login available? | **OUTSTANDING** — blocks Phase 4 |
| 8 | Mail destination at @theskincafe.net? | **OUTSTANDING** — blocks Plan 03 record diff |
| 9 | Other senders on the domain? | **OUTSTANDING** — blocks Plan 04 |
| 10 | DMARC mailbox ownership? | **OUTSTANDING** — informational |
| 11 | Staff notification email value? | **OUTSTANDING** — blocks Plan 04 completion |

### What each downstream plan is now blocked on

- **Plan 01-02 (Vercel transfer):** Client-Blocking #1 (Vercel team creation + Craig invite) **and** #2 (valid payment method attached).
- **Plan 01-03 (Cloudflare zone):** Client-Blocking #4 (Cloudflare invite) **and** #7 (canonical-domain confirmation — `.net` vs `.com`, apex vs www).
- **Plan 01-04 (Resend domain):** Client-Blocking #3 (Resend invite) **and** #6 (staff email confirmation) **and** #4 (Cloudflare invite so DNS records can land).
- **Plan 01-05 (Square creds):** Client-Blocking #5 (Square Developer app + access tokens) **and** dependency on Plan 01-02 completing first (env writes need the client-owned Vercel team to exist).

## Known Stubs

None. Both artifacts are complete reference documents, not application code; no placeholder data that flows to UI rendering, no mock sources, no hardcoded empties-that-should-be-wired. Any blanks (e.g., the "Answer: _________________________________________" lines in the checklist's Open Questions section) are intentionally interactive fields for the client kickoff conversation, not stubs that block plan completion.

## User Setup Required

None for Plan 01-01 itself — it's documentation-only. However, the HANDOFF-CUTOVER-CHECKLIST.md it produced IS the canonical list of all user/client setup required for Phase 1. See that file's Client-Blocking section (7 rows) — those must be communicated to the client before Plans 01-02 through 01-05 can start.

## Next Phase Readiness

- Plan 01-01 fully complete; both artifacts committed.
- Waves 2 and 3 (Plans 01-02 through 01-05) are ready to start the moment their respective Client-Blocking gates clear. The orchestrator should surface the 7 client-blocking rows to Craig for immediate kickoff outreach.
- Plan 03 has a concrete diff-target (DNS-BASELINE.md) for its Cloudflare import verification — no re-audit required at that plan's start.
- Phase 4 (INFRA-04 cutover) has advance notice of: the GoDaddy `clientUpdateProhibited` flag, the TTL-60s lowering schedule (24h before NS flip), and the absence of DNSSEC signing (no rollover needed).

## Self-Check: PASSED

- `.planning/phases/01-client-infrastructure-provisioning/artifacts/DNS-BASELINE.md` — FOUND
- `.planning/phases/01-client-infrastructure-provisioning/artifacts/HANDOFF-CUTOVER-CHECKLIST.md` — FOUND
- Commit `3cb2cbb` (Task 1) — FOUND in git log
- Commit `5b47623` (Task 2) — FOUND in git log
- All plan `<verify>` blocks — PASS
- All plan `<acceptance_criteria>` — PASS (7 client-blocking rows present, not 8; the 8th regex match was the change-log table row, which is not a client-blocking row)

---
*Phase: 01-client-infrastructure-provisioning*
*Completed: 2026-04-20*
