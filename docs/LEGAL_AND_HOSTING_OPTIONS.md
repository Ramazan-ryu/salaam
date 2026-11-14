# Legal Questions and Hosting Options

Status: Draft 0.1 · 2026-11-14 · Related: [SECURITY_AND_PRIVACY.md](./SECURITY_AND_PRIVACY.md), [PRODUCT_DECISIONS.md](./PRODUCT_DECISIONS.md) (D-02, D-03, D-20), [ADR-0017](./adr/ADR-0017-hosting-portable-deferred.md)

> **This is not legal advice.** It summarises publicly reported information so that the founder can brief an Azerbaijani legal professional. Nothing here is a final legal conclusion. [CONFIRMED] Hosting provider and location are **not** finalized.

## 1. Publicly reported legal context (to be confirmed by counsel)

| Topic | Reported content | Source (checked 2026-11-14) |
|---|---|---|
| Consent | Collection, processing and cross-border transmission of personal data reported as permitted only with the person's written consent (with listed exceptions) | https://www.dataguidance.com/notes/azerbaijan-data-protection-overview (secondary) |
| Cross-border transfer | Reported as allowed if it does not threaten national security and the receiving country provides equivalent protection; otherwise possible with consent or to protect life/health | https://gpg-pdf.chambers.com/investing-in-2026/47/ (secondary) |
| Information systems | Compliance summaries mention registration of personal-data information systems with the competent authority before processing, and a licence to create such systems | https://compliance.theartofservice.com/frameworks/Azerbaijan%20Law%20on%20Personal%20Data%20(2010) (secondary, low authority) |
| Social network age rules (2026) | Amendments adopted 5 Aug 2026 to the law on information and related laws introduce rules for age-restricted social network platforms, including age verification and minors' data | https://gratanet.com/publications/new-regulatory-requirements-for-social-network-platforms-and-their-providers-in-azerbaijan (law firm) |
| Under-16 / 16–18 | Reported: under-16s may not create personal accounts on such platforms; 16–18 need parental/guardian consent; default privacy and restricted geolocation disclosure; age-verification data must not be stored and must be deleted after verification | https://www.trend.az/azerbaijan/politics/4212799.html ; https://en.apa.az/official-news/azerbaijan-introduces-new-rules-for-childrens-registration-on-social-media-platforms-519066 (news) |
| Platform registration | Reporting indicates the package requires global social media platforms to register or have a local representative | https://www.az-netwatch.org/?p=1761 (news/NGO) |

## 2. Hosting options compared

| Criterion | **A. Hosting in Azerbaijan** | **B. International cloud region** | **C. Hybrid** |
|---|---|---|---|
| Example providers | AzInTelecom (AZINCLOUD public cloud; Tier III certified data centre in Baku) — https://tech.az/en/posts/move-your-business-to-the-cloud-environment-with-azincloud-7055 , https://www.datacentermap.com/azerbaijan/baku/azintelecom1/ ; Gcore × AzInTelecom sovereign cloud — https://datacenternews.asia/story/gcore-azintelecom-launch-sovereign-cloud-in-azerbaijan | European VPS/cloud (e.g. Hetzner: CX23 listed at €5.49/month after June 2026 increase, but cost-optimized plans reported unavailable to new customers in autumn 2026 — https://www.bitdoze.com/hetzner-cloud-review/ , https://betterstack.com/community/guides/web-servers/hetzner-cloud-review/), or major clouds | Personal data in AZ; public city content, CDN, tiles, LLM processing abroad |
| Data residency | Personal data stays in-country | Cross-border transfer of users' data | Personal data in-country; public data abroad |
| Legal complexity | Likely lowest for personal data [ASSUMPTION] | Depends on QL-04/QL-05 | Medium; requires clean data separation |
| Cost transparency | Public pricing **not found** — quote needed | Public, low | Two bills |
| Managed services (Postgres + PostGIS, object storage) | [UNVERIFIED] — ask provider | Widely available | Mixed |
| Tooling/automation (Terraform, APIs) | [UNVERIFIED] | Mature | Mixed |
| Latency to Baku users | Best | Acceptable (EU) [ASSUMPTION] | Best for app API |
| Solo ops burden | Medium (new vendor, possibly manual processes) | Lowest | **Highest** (two environments) |
| LLM/push/email providers | Still foreign → transfers of whatever data they receive | Same | Same |

**Important consequence:** even with in-country hosting, using foreign services (LLM APIs, Expo push relay, email delivery, error tracking, Google/Apple sign-in) may count as cross-border transfer for the data they receive. Architecture therefore minimises personal data sent to them (§ [SECURITY_AND_PRIVACY.md](./SECURITY_AND_PRIVACY.md#6-privacy-by-design)).

**Recommendation [RECOMMENDED]:**
1. Build portable (containers, plain PostgreSQL, S3 API) — [ADR-0017](./adr/ADR-0017-hosting-portable-deferred.md).
2. Run MVP-0 with **synthetic users only**, so no decision is needed for the prototype.
3. Logically separate "public city data" from "user personal data" (schemas/modules) so option C remains possible without redesign.
4. Request quotes from AzInTelecom/AZINCLOUD (and one other local provider if available) during P-1; get counsel's answers to §3 before MVP-1.

## 3. Questions for Azerbaijani legal counsel

| ID | Question | Why it matters | Affects |
|---|---|---|---|
| QL-01 | Is Salaam (city discovery with profiles, friends, attendance visibility, no posts) a "social network platform subject to age restrictions" under the August 2026 amendments? If yes, what age verification, parental consent, registration/representation duties apply? | Age policy, onboarding, scope of social features | D-03, F-040–F-046 |
| QL-02 | What form satisfies "written consent" for electronic consent (checkbox + timestamped record, e-signature, other)? Separate consents per purpose acceptable? | Consent UX and storage | FR-004 |
| QL-03 | Must Salaam register its personal-data information system with an authority and/or obtain a licence? Timing (before processing)? Process for a startup/individual? | Launch timeline | MVP-1 |
| QL-04 | Does hosting outside Azerbaijan, and use of foreign processors (LLM APIs, push relay, email, error tracking, OIDC providers), constitute cross-border transfer? Which countries count as adequate? Is user consent sufficient? | Hosting decision, vendor choice | D-02 |
| QL-05 | Are there data-localisation requirements specific to this kind of service? | Hosting decision | D-02 |
| QL-06 | Required retention or maximum retention periods (consent evidence, audit logs, deleted-account data, backups)? Response deadlines for data-subject requests? | Retention design | DB retention |
| QL-07 | Rights to display content from organizers' Instagram posts (text, images, posters) with their consent; use of facts from public websites (cinema showtimes); attribution; takedown duties | Data sources | DS-002, DS-010, DS-040 |
| QL-08 | Is precise or coarse location considered special-category/sensitive data? Any specific rules? | Location design | §5 security |
| QL-09 | Using OpenStreetMap (ODbL) together with proprietary data — obligations in practice? | Places data | DS-060 |
| QL-10 | Are terms of service and privacy policy required in Azerbaijani? Consumer-protection rules for a free app? | Legal docs | MVP-1 |
| QL-11 | Data breach notification obligations and deadlines? | Incident response | Security §9 |
| QL-12 | Sponsored content / advertising law labelling requirements (for later monetization) | D-12 | Later |
| QL-13 | Is a local legal entity needed to operate the service, sign partner agreements, or publish store apps under a company name? | D-20 | Before public beta |

## 4. Age policy

| Option | Description | Pros | Cons |
|---|---|---|---|
| **18+ (default)** | Self-declared age gate at sign-up; accounts for under-18 not allowed | Simplest; avoids minors' rules; matches target segment | Excludes younger students |
| 16+ with parental consent for 16–18 | Implement guardian consent flow if QL-01 says it applies | Broader audience | Verification complexity; reported rule that verification data must not be stored |
| 13+ | Platform minimum common internationally | Broad | Likely conflicts with 2026 rules if in scope |

Store requirements also apply (Apple age rating questionnaire; Google Play target audience and content declarations) — complete during P-6.
