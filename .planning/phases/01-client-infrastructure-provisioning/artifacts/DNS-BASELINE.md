# DNS Baseline — theskincafe.net

**Captured:** 2026-04-20T23:59:40Z (2026-04-20 16:59:40 MST)
**Captured by:** Craig Richardson (craig@neuralrebel.ai)
**Resolver used:** Google Public DNS `@8.8.8.8` (bypasses local cache)
**Tool:** `dig` 9.10.6 + `whois`
**Phase:** 1 — Client Infrastructure Provisioning
**Plan:** 01-01 — Baseline & Handoff Scaffold
**Purpose:** Freeze ground-truth DNS state for `theskincafe.net` BEFORE any Cloudflare import so Plan 03 can diff-validate the import and catch missing records (Pitfall 1 in RESEARCH.md).

> **Safe to commit.** dig and whois output is public data. No secrets, tokens, or credentials are present in this file.

---

## Working Assumption (flagged for client confirmation)

Per RESEARCH.md Assumption A1, this baseline assumes the production domain is **`theskincafe.net`** (apex). This is **not yet client-confirmed.** See Unknowns section below — a `.com` variant also exists and resolves.

---

## Summary of Key Facts

| Fact | Value | Source query | Downstream impact |
|------|-------|--------------|-------------------|
| Current authoritative NS | `ns41.domaincontrol.com`, `ns42.domaincontrol.com` (GoDaddy) | `dig NS` | Plan 03: lower TTLs at GoDaddy DNS console. Plan 04 (Phase 4): client needs GoDaddy login to flip NS to Cloudflare. |
| Registrar | **GoDaddy.com, LLC** (IANA ID 146) | `whois` | Phase 4 NS-flip requires client's GoDaddy login. |
| Domain created | 2010-06-23 | `whois` | Long-standing domain; assume SEO value. Do not let it lapse. |
| Domain expires | **2027-06-23** | `whois` | ~14 months headroom. Client should enable auto-renew at GoDaddy if not already. |
| Domain status | `clientTransferProhibited` + `clientUpdateProhibited` set | `whois` | Transfer lock is ON at registrar — **NS flip in Phase 4 will require the client to temporarily remove `clientUpdateProhibited` OR perform the NS change themselves in GoDaddy DNS UI.** This is fine (DNS edits at current registrar are the planned path), but worth noting. |
| DNSSEC | Unsigned (no DS record) | `whois` + `dig DS` | No DNSSEC-rollover risk during Cloudflare migration. |
| Apex A record | `162.159.135.42` (**Cloudflare IP range 162.159.x.x**) | `dig A` | Site is already being served through Cloudflare somewhere upstream — likely the current site host uses Cloudflare as a proxy/CDN but does NOT own the DNS zone. Phase 4 NS flip brings DNS into a *client-owned* Cloudflare account. |
| Apex AAAA | None | `dig AAAA` | Expected. Vercel does not support IPv6 inbound anyway. |
| Apex MX | **None** | `dig MX` | No apex MX records. Mail is either delivered to `mail.theskincafe.net` directly or the client has no inbound email on `@theskincafe.net`. Confirm with client. |
| Apex SPF | `v=spf1 a mx ip4:99.192.153.170 ~all` | `dig TXT` | SPF authorizes `99.192.153.170` (mojohost) — the mail subdomain's host — for outbound. |
| `_dmarc` | `v=DMARC1; p=quarantine; adkim=r; aspf=r; rua=mailto:dmarc_rua@onsecureserver.net;` | `dig TXT _dmarc` | DMARC is on (**p=quarantine** — stricter than baseline `p=none`). Reports go to `dmarc_rua@onsecureserver.net` (GoDaddy/SecureServer). Phase 4 Resend records must include DKIM **aligned with this DMARC policy** or Resend mail gets quarantined. |
| CAA | **None** | `dig CAA` | Good. Vercel/Let's Encrypt can auto-add `0 issue "letsencrypt.org"` when the domain is attached in Phase 4 (no Pitfall 5 risk). |
| `www` CNAME | `www.theskincafe.net` → `theskincafe.net.` | `dig CNAME www` | Standard apex-alias pattern. Canonical is currently apex. |
| `mail.theskincafe.net` A | `99.192.153.170` → `cs2190.mojohost.com` (mojohost) | `dig A mail` + `dig -x` | Mail subdomain points to mojohost — **client's current mail host is mojohost**, not GoDaddy Workspace or Google Workspace. Preserve this record during Cloudflare import. |
| `send.theskincafe.net` | None | `dig TXT send` | Clean — Resend subdomain is free to use in Plan 04. |
| `resend._domainkey` | None | `dig TXT resend._domainkey` | Clean — no prior DKIM collision. |

---

## Raw dig Output — 13 commands (in plan-specified order)

### 1. `dig NS theskincafe.net @8.8.8.8 +noall +answer`
```
theskincafe.net.	3600	IN	NS	ns41.domaincontrol.com.
theskincafe.net.	3600	IN	NS	ns42.domaincontrol.com.
```
**Interpretation:** Current authoritative DNS provider is **GoDaddy** (`domaincontrol.com` is GoDaddy's nameserver hostname). TTL on NS records is 3600s (1h). Plan 03 must lower per-record TTLs at GoDaddy's DNS console 24+ hours before the Phase 4 NS flip.

### 2. `dig SOA theskincafe.net @8.8.8.8 +noall +answer`
```
theskincafe.net.	3600	IN	SOA	ns41.domaincontrol.com. dns.jomax.net. 2026022508 28800 7200 604800 600
```
**Interpretation:** SOA MNAME = `ns41.domaincontrol.com`. RNAME = `dns.jomax.net` (jomax.net is GoDaddy's internal domain — further confirms GoDaddy DNS). Serial `2026022508` → last zone edit ~2026-02-25. Negative-response cache TTL = 600s (the "minimum" field), which explains the 600s TTL on some records below.

### 3. `dig A theskincafe.net @8.8.8.8 +noall +answer`
```
theskincafe.net.	600	IN	A	162.159.135.42
```
**Interpretation:** Apex resolves to `162.159.135.42`, inside **Cloudflare's 162.159.128.0/17 range**. Reverse lookup returns no PTR (Cloudflare's load-balancer IPs typically lack PTRs). The current live site is therefore **already being fronted by Cloudflare** as a reverse proxy — but the zone itself is hosted at GoDaddy. This is an unusual configuration and strongly suggests the client's current web host uses Cloudflare internally (e.g., Squarespace's edge, or a white-labeled Cloudflare). Phase 4 replaces this with a *client-owned* Cloudflare zone pointing at Vercel (`76.76.21.21`) so the client controls their own CDN+DNS.

### 4. `dig AAAA theskincafe.net @8.8.8.8 +noall +answer`
```
(empty — no AAAA record)
```
**Interpretation:** No IPv6 record. Expected — Vercel does not support IPv6 for apex domains (RESEARCH.md "Deprecated" list), so we leave AAAA absent in Cloudflare too.

### 5. `dig MX theskincafe.net @8.8.8.8 +noall +answer`
```
(empty — no MX records at apex)
```
**Interpretation:** **No apex MX.** Inbound mail to `anything@theskincafe.net` currently has nowhere to go via standard MX resolution. Combined with the SPF record and `mail.theskincafe.net` A record (see #10 below), this suggests mail is handled via direct A/POP/IMAP on `mail.theskincafe.net` rather than via MX-routed inbound SMTP to the apex. **Confirm with client** — do they receive email at `@theskincafe.net`? If yes, where? This is an Unknown (below). Resend sending does not require inbound MX, only SPF/DKIM/DMARC, so Plan 04 is unblocked by this.

### 6. `dig TXT theskincafe.net @8.8.8.8 +noall +answer`
```
theskincafe.net.	600	IN	TXT	"v=spf1 a mx ip4:99.192.153.170 ~all"
```
**Interpretation:** Apex SPF authorizes three paths: the apex A record (`a`), any MX records (`mx`), and literal IP `99.192.153.170` (mojohost). `~all` = softfail for anything else. **Plan 04 must extend this SPF to include Resend (`include:amazonses.com`) OR — preferred — put Resend on the `send.theskincafe.net` subdomain with its own SPF so this apex SPF is untouched.** Resend's recommended pattern (RESEARCH.md) uses the subdomain approach, which preserves this existing apex SPF exactly.

### 7. `dig TXT _dmarc.theskincafe.net @8.8.8.8 +noall +answer`
```
_dmarc.theskincafe.net.	3600	IN	TXT	"v=DMARC1; p=quarantine; adkim=r; aspf=r; rua=mailto:dmarc_rua@onsecureserver.net;"
```
**Interpretation:** DMARC is **live and in enforcement mode** (`p=quarantine`, not `p=none`). Alignment mode is `r` (relaxed) for both DKIM and SPF — subdomains like `send.theskincafe.net` CAN align to the organizational domain `theskincafe.net` under relaxed alignment. Reports go to `dmarc_rua@onsecureserver.net` (GoDaddy/SecureServer mailbox). **Implication for Plan 04:** Resend mail sent `From: contact@send.theskincafe.net` must have DKIM signed by `send.theskincafe.net` (Resend auto-handles this via the `resend._domainkey.send.theskincafe.net` record) so relaxed-alignment DMARC passes. Do NOT touch this existing `_dmarc` record in Phase 1 — it is working and under client mail-ops ownership.

### 8. `dig CAA theskincafe.net @8.8.8.8 +noall +answer`
```
(empty — no CAA records)
```
**Interpretation:** No CAA restrictions. **Pitfall 5 (RESEARCH.md) does not apply.** When Phase 4 attaches the domain to Vercel, Let's Encrypt issuance will succeed without CAA intervention. Vercel will auto-add `0 issue "letsencrypt.org"` as needed.

### 9. `dig CNAME www.theskincafe.net @8.8.8.8 +noall +answer`
```
www.theskincafe.net.	3600	IN	CNAME	theskincafe.net.
```
**Interpretation:** `www` is a CNAME flattening to the apex. Canonical form is currently apex. Phase 4 decision (client confirmation): keep apex as canonical with `www` CNAME, or flip to `www` canonical with apex 301 redirect. Vercel supports either; impact is minor for SEO given the existing CNAME is already flattening.

### 10. `dig A www.theskincafe.net @8.8.8.8 +noall +answer`
```
www.theskincafe.net.	3600	IN	CNAME	theskincafe.net.
theskincafe.net.	600	IN	A	162.159.135.42
```
**Interpretation:** `www` is A-aliased via CNAME to apex, which resolves to the Cloudflare-fronted IP. Same behavior as #9; no separate A record at `www`.

### 11. `dig TXT send.theskincafe.net @8.8.8.8 +noall +answer`
```
(empty — no TXT records)
```
**Interpretation:** The `send` subdomain is clean. Plan 04 can safely add Resend's SPF + MX + DKIM records under `send.` with no collisions.

### 12. `dig TXT resend._domainkey.theskincafe.net @8.8.8.8 +noall +answer`
```
(empty — no TXT records)
```
**Interpretation:** No prior DKIM selector collision. Plan 04 can publish Resend's DKIM public key under `resend._domainkey.send.theskincafe.net` (Resend's default selector on the `send` subdomain). Note: the plan's check was for `resend._domainkey.theskincafe.net` (apex selector); both apex and subdomain selectors are clean.

### 13. `dig ANY theskincafe.net @8.8.8.8 +noall +answer`
```
(empty — Google Public DNS returns ANY with no answer by RFC 8482 convention)
```
**Interpretation:** Per RFC 8482, most recursive resolvers (including 8.8.8.8) return minimal or empty responses to ANY queries. This is expected behavior — **not** evidence that no records exist. The targeted queries #1–#12 above are the authoritative enumeration. GoDaddy's authoritative nameservers also do not return full zone dumps on ANY queries.

---

## Supplemental Queries (beyond plan spec — Rule 2: critical context)

These were executed because the plan's purpose is "capture ground truth" and the results materially affect downstream plans.

### Cross-TLD check: does `theskincafe.com` exist?

```
$ dig NS theskincafe.com @8.8.8.8 +noall +answer
theskincafe.com.	3600	IN	NS	ns21.domaincontrol.com.
theskincafe.com.	3600	IN	NS	ns22.domaincontrol.com.

$ dig A theskincafe.com @8.8.8.8 +noall +answer
theskincafe.com.	600	IN	A	3.33.130.190
theskincafe.com.	600	IN	A	15.197.148.33
```
**Interpretation:** `theskincafe.com` **also exists and resolves**, on different GoDaddy nameservers, pointing at AWS Global Accelerator IPs (`3.33.130.0/24` and `15.197.148.0/24` — AWS GA range). This means there is either (a) a separate site at `.com`, (b) a redirect service, or (c) a defensively registered variant. **Critical client-confirmation question — which TLD is the canonical production target?** This is called out in RESEARCH.md Open Question #1 and must be resolved before Plan 03 adds `theskincafe.net` to Cloudflare (if `.com` is canonical, the whole Cloudflare target changes).

### Subdomain probe (common subdomains)

```
$ dig A mail.theskincafe.net @8.8.8.8 +short
99.192.153.170

$ dig -x 99.192.153.170 @8.8.8.8 +noall +answer
170.153.192.99.in-addr.arpa. 3600 IN	PTR	cs2190.mojohost.com.
```
**Interpretation:** `mail.theskincafe.net` → `99.192.153.170` → `cs2190.mojohost.com` (**mojohost**, a managed-hosting provider). This is the host the apex SPF authorizes. **The client uses mojohost for email.** Plan 03 must import this `mail` A record into Cloudflare's zone manually — Cloudflare's automatic scan typically does catch A records on named subdomains, but Pitfall 1 warrants manual verification.

Common subdomains probed (no records found, enumerated for completeness): `email`, `book`, `booking`, `calendar`, `app`, `store`, `portal`, `shop`, `admin`, `blog`, `squarespace`, `wix`, `webflow`.

### DNSSEC / DS record

```
$ dig DS theskincafe.net @8.8.8.8 +noall +answer
(empty)
```
**Interpretation:** No DS record at parent. DNSSEC is not signed. Consistent with `whois` "DNSSEC: unsigned". Phase 4 NS flip to Cloudflare can proceed without a DNSSEC rollover step.

### Reverse PTR on apex IP

```
$ dig -x 162.159.135.42 @8.8.8.8 +noall +answer
(empty — no PTR)
```
**Interpretation:** Cloudflare's edge IPs typically lack public PTRs. Confirms the apex IP is shared Cloudflare infrastructure rather than a dedicated host.

---

## whois — Registrar & Domain Lifecycle

Output of `whois theskincafe.net | head -80` (abbreviated to registrar-relevant lines):

```
Domain Name: THESKINCAFE.NET
Registry Domain ID: 1603448531_DOMAIN_NET-VRSN
Registrar WHOIS Server: whois.godaddy.com
Registrar URL: http://www.godaddy.com
Updated Date: 2026-02-25T10:34:26Z
Creation Date: 2010-06-23T22:15:10Z
Registry Expiry Date: 2027-06-23T22:15:10Z
Registrar: GoDaddy.com, LLC
Registrar IANA ID: 146
Registrar Abuse Contact Email: abuse@godaddy.com
Registrar Abuse Contact Phone: 480-624-2505
Domain Status: clientDeleteProhibited https://icann.org/epp#clientDeleteProhibited
Domain Status: clientRenewProhibited https://icann.org/epp#clientRenewProhibited
Domain Status: clientTransferProhibited https://icann.org/epp#clientTransferProhibited
Domain Status: clientUpdateProhibited https://icann.org/epp#clientUpdateProhibited
Name Server: NS41.DOMAINCONTROL.COM
Name Server: NS42.DOMAINCONTROL.COM
DNSSEC: unsigned
```

**Registrar: GoDaddy.com, LLC.** Client must have (or recover) a GoDaddy account login to perform the Phase 4 NS flip. The `clientUpdateProhibited` status flag means nameserver edits via API/EPP are blocked; the client must sign into GoDaddy's web UI to make NS changes. This is fine — the plan path has the client (with Craig on a screen-share if needed) make the NS change themselves.

---

## Unknowns — Pending Client Confirmation

These are surfaced here so Plan 03 and Plan 04 have a single list to pull from. Each must be resolved before the Phase 4 NS flip.

| # | Question | Why it matters | Blocks |
|---|----------|----------------|--------|
| 1 | **Is `theskincafe.net` the canonical production target, or is `theskincafe.com` (which also resolves, to AWS Global Accelerator) the real target?** | `.com` exists on separate nameservers and points at AWS GA IPs — different infra entirely. Provisioning Cloudflare on the wrong TLD wastes the client-invite. | Plan 03 Task 1 (add zone to Cloudflare) |
| 2 | **Apex vs `www` canonical — which does the client prefer?** | Determines the final Vercel domain config and SEO redirect rules. Current state: apex canonical, `www` CNAMEs to apex. Default recommendation: keep apex canonical. | Plan 03 (record planning), Phase 4 (Vercel domain attach) |
| 3 | **Does the client have access to their GoDaddy account login?** | Required to lower TTLs in Plan 03 Task 6 and to flip NS in Phase 4. If lost, registrar account-recovery adds 3–7 business days. | Plan 03 Task 6 (TTL lowering) + Phase 4 NS flip |
| 4 | **Does the client receive email at `@theskincafe.net`? If yes, where (mojohost webmail at `mail.theskincafe.net`? Google Workspace? M365)?** | No apex MX exists. If mail is delivered via a route other than MX (direct POP/IMAP on `mail.theskincafe.net`), Cloudflare import MUST preserve the `mail.` A record and may need additional unusual records to be manually enumerated. | Plan 03 (record diff) |
| 5 | **Is the SPF IP `99.192.153.170` (mojohost) the ONLY sending IP, or do they also send via a marketing platform (Constant Contact, Mailchimp, Square Marketing)?** | Plan 04 preserves this SPF; Resend is added on `send.theskincafe.net` subdomain. If Square Marketing sends from `@theskincafe.net`, we need `include:` for Square's SPF too. | Plan 04 (Resend DNS + SPF review) |
| 6 | **Does the client want to keep apex A pointed at Cloudflare-fronted host during Phase 4, or flip directly to Vercel `76.76.21.21`?** | Current apex is already Cloudflare-proxied via the old provider. Phase 4 replaces with client-owned Cloudflare + Vercel. Downtime risk is low either way (TTL-60s rollback), but client should know the brief behavior change (host origin moves from mojohost/whoever → Vercel). | Phase 4 cutover planning |
| 7 | **DMARC reporting mailbox `dmarc_rua@onsecureserver.net` — who monitors it?** | Adding Resend in Plan 04 means Resend-originated mail is evaluated by receivers and DMARC reports go to that mailbox. If no one reads it, a Resend misconfiguration could cause silent delivery failures for days. | Plan 04 completion |
| 8 | **What is the staff notification email (`STAFF_NOTIFICATION_EMAIL` env)?** Listed in STATE.md "Open Todos". | Contact form destination. Placeholder until set. | Plan 04 completion |

---

## Safety-to-commit Verification

- No API keys, passwords, or tokens appear in this file.
- dig output is public resolver data — anyone can run the same queries.
- whois output is ICANN-published public registration data (registrar, expiry, NS, status flags). Registrant contact details are not shown (thin WHOIS for .NET).
- No runtime secrets from `.env.local` or Vercel env vars are referenced.

**OK to commit this file.**

---

## Usage Notes for Downstream Plans

- **Plan 03 (Cloudflare zone setup)** uses this baseline as the diff-target. After Cloudflare's auto-scan, diff the imported record list against every "Interpretation" cell in the 13-query section + Supplemental queries section. Any record listed here but missing from the Cloudflare zone must be manually added before the NS flip.
- **Plan 04 (Resend)** adds `send.theskincafe.net` records + `resend._domainkey.send.theskincafe.net` DKIM. Both are confirmed clean of prior records (#11, #12).
- **Phase 4 NS flip** uses the SOA minimum (`600s`) and NS TTL (`3600s`) as the baseline-TTL-reduction target: lower every record to 60s at GoDaddy ≥ 24h before the NS change so rollback window is 60 seconds.
- **Pitfall 5 (CAA)** does not apply — no CAA records exist.
- **Pitfall 1 (missing records)** has two live mitigations flagged above: the `mail.` subdomain (mojohost) and the DMARC record. Both must survive Cloudflare import.

---

*End of baseline. Updates to this file after Plan 01-01 are forbidden — it is a point-in-time snapshot. If DNS changes before Phase 4 cutover, re-capture as `DNS-BASELINE-2.md` alongside this file rather than editing in place.*
