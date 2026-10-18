# Closing product gaps: mobile/PWA, inventory, CP portal, visit outcomes, custom fields, backups, onboarding, SQLite scaling, AI

*How these notes were made (read this first). Date accessed for every source: 2026-10-18. FX rate: ₹94.92 per US$1, the provisional RBI-session close on Fri 16 Oct 2026 ([Telangana Today/PTI](https://telanganatoday.com/rupee-rises-for-sixth-straight-session-closes-at-94-92-against-dollar), [Deccan Herald](https://www.deccanherald.com/amp/story/business/markets/rupee-rises-7-paise-to-close-at-9492-against-us-dollar-on-rbi-intervention-4185135)); [HDFCSky](https://hdfcsky.com/news/rupee-surges-1-9percent-to-94-96-as-rbis-dollar-window-and-hot-us-cpi-reshape-currency-markets) gives 94.96. All ₹ exclude GST.*

*Tool limits in this session: WebFetch failed on almost every vendor domain (DNS errors on sell.do, anarock, backblaze, cloudflare, wasabi, sqlite.org, caddyserver.com, deepseek, ai.google.dev, sarvam), and the shared web-search budget ran out partway through. So:*
- *Primary docs were read straight from their **GitHub source repos**: Caddy docs, n8n docs, Litestream, restic, MDN browser-compat-data, and the LiteLLM model-price map (updated 2026-10-18).*
- *Vendor pricing pages were seen **only through search-engine summaries**. Each such item is labelled "(search summary)". Treat it as needing a re-check on the live page.*
- *Competitor docs (Farvision, In4Suite, Propacity, TeleCRM, Privyr, Kylas) could not be reached. Those items are in the Gaps sections.*

*Tags used: VERIFIED = official docs or pricing; VENDOR CLAIM = a company's own marketing; USER REPORT = reviews and forums; AGGREGATOR = a third-party price list that cites the vendor; PRIOR KNOWLEDGE = not opened this session, so verify before use.*

---

## 1. Mobile: PWA + web push vs native/TWA; offline needs; competitor mobile and call logging

### Takeaway
A white-label **PWA with web push** is the cheapest credible answer. Effort is **S–M (1–2 weeks)**: per-client manifest, service worker, VAPID push, and an offline "today's calls" list. Push works on Android Chrome and on iOS 16.4+ **only after the user adds the app to the Home Screen**.

- Wrap the same PWA as a **Trusted Web Activity (TWA)** for a Play Store listing (S).
- Skip Flutter/React Native for now (L).
- Automatic call-log sync through a Play Store app is effectively blocked by Google's Call Log permission policy. Use tap-to-call plus a "log outcome" prompt, or cloud telephony, instead.

### Cited Findings
- **iOS push needs a Home Screen web app.** iOS Safari supports `PushManager` from **16.4**, with the note "Notifications are supported in web apps saved to the home screen." The `Notification` interface "is undefined, unless the page is a web app saved to the home screen. The app's manifest must have a non-default `display` value." Notifications "can only be sent from a service worker." — [MDN browser-compat-data, api/PushManager.json & api/Notification.json](https://github.com/mdn/browser-compat-data) (VERIFIED, community-maintained compatibility data)
- **App-icon badges also work on iOS 16.4+.** `navigator.setAppBadge` is supported from iOS 16.4 for Home Screen web apps. — [MDN BCD api/Navigator.json](https://github.com/mdn/browser-compat-data) (VERIFIED)
- **The EU removal was reversed.** Apple first planned to drop Home Screen web apps in the EU in iOS 17.4 (DMA), then reversed: "it will continue to offer the existing Home Screen web apps capability in the EU" — [TechCrunch via search summary](https://techcrunch.com/?p=2673309), [MobiLoud](https://www.mobiloud.com/blog/progressive-web-apps-ios) (VENDOR/press; **2024, older than 18 months**). A 2026 guide claiming push does not work in EU PWAs contradicts Apple's reversal and cites no Apple source — [MagicBell](https://www.magicbell.com/blog/pwa-ios-limitations-safari-support-complete-guide) (I trust the reversal more). The EU is irrelevant for Indian users anyway.
- **Play Store restricts call-log access.** Google Play limits the Call Log and SMS permission groups. Apps "may access these permissions only when they fall within permitted uses and only to enable critical core functionality". Permitted uses centre on the default Phone/SMS/Assistant handler. Apps must file a Permissions Declaration Form or "may be removed from Google Play". — [Google Play Console Help 9047303 (search summary)](https://support.google.com/googleplay/android-developer/answer/9047303) (VERIFIED via summary). The 2018 enforcement history is in [XDA](https://www.xda-developers.com/google-remove-unapproved-apps-use-call-log-sms-permissions/) (older than 18 months).
- **Apple's own push doc could not be read.** The Apple developer page ([Sending web push notifications](https://developer.apple.com/documentation/usernotifications/sending-web-push-notifications-in-web-apps-and-browsers)) loaded only its title, because it renders with JavaScript.

### Inferences
**Recommended build (cheapest):**
1. A FastAPI route serves `/manifest.webmanifest` per subdomain, carrying the client's name, theme colour and icon. This keeps the white-label promise.
2. A service worker caches the app shell plus a read-only JSON copy of "today's and overdue follow-ups". Notes and outcomes typed offline go into an IndexedDB queue and are flushed on the `online` event. Do not rely on Background Sync on iOS (ESTIMATE: not supported in Safari).
3. Web push uses VAPID keys and the open-source `pywebpush` library. Cost is ₹0 per message. Triggers: 9 am digest, new lead assigned, follow-up due in 15 minutes, visit tomorrow.
4. iOS users need a one-time "Add to Home Screen" coach screen. Then permission is requested on a button tap.

**Effort:**
- Install, manifest and push: S (about 1 week).
- Offline queue: S–M.
- TWA via Google's Bubblewrap CLI with Digital Asset Links: S. Cost is a one-time Play developer fee of US$25 ≈ **₹2,373** (PRIOR KNOWLEDGE fee).
- Per-client white-label store apps would multiply listings and reviews. Prefer one "Golden Ratio CRM" TWA, or none.

**What field staff need offline (ESTIMATE, not from a sourced survey):**
- Today's call list, with phone numbers for tap-to-call and WhatsApp.
- The lead card with the last 3 notes.
- Quick outcome buttons: called / no answer / visit fixed / not interested.
- The site-visit checklist.
- Project price sheet and brochure PDF cached.

Full offline editing of the CRM is not needed. Site offices usually have patchy 4G, not none.

**Native app (Flutter/React Native):** effort L (over 3 weeks) plus iOS Developer Program US$99/yr ≈ **₹9,397** (PRIOR KNOWLEDGE). It is only justified for call-log sync and call recording. Those either fail Play policy or require a sideloaded APK, which brings Play Protect warnings and is hard to support for a 1–2 person team.

**Call logging, cheapest path:** after a tap-to-call, the app shows a "How did the call go?" sheet when the user returns (`visibilitychange` event). That is S effort. Real call logs and recordings come from cloud telephony (Exotel, MyOperator and similar), which is out of this scope.

**Table stakes vs differentiator:** a usable mobile experience is table stakes. Native apps are common among competitors (to be verified). Push reminders on a white-label PWA are adequate if positioned as "install from browser, no app store".

### Gaps
- **Competitor mobile apps and call logging:** Sell.Do, TeleCRM, Privyr and Kylas could not be opened or searched (search budget exhausted). Still unknown: whether they ship Play Store apps that read call logs (via exception or a default-dialer role) or distribute APKs outside Play. Next step: check each Play Store listing's permissions and data-safety section, and read 1-star reviews mentioning "call log".
- **iOS 26 behaviour:** whether iOS 26 now opens every Home Screen site as a web app by default (which would ease push setup) is not verified.
- **Current Play TWA rules:** Bubblewrap/TWA requirements and the 2026 Play developer fee were not verified.

---

## 2. Unit inventory and booking: fields, states, cost sheet, double-booking, RERA

### Takeaway
Competitors model **Project → Tower/Wing → Floor → Unit**, with a small status machine: **available → held (owner + expiry) → blocked (token/approval) → booked → sold/registered**. One status is shared by direct sales and channel partners, which prevents double booking.

On SQLite, double-booking protection is a one-line conditional update (`UPDATE … WHERE status='available'` and check the row count). Inventory grid plus holds: **M (2–3 weeks)**. Configurable cost sheet: **M (1–2 weeks)**. Inventory is a strong differentiator at the ₹4–13k price point. Builders expect it in a demo; brokers mostly do not.

### Cited Findings
- **Sell.Do status model.** Unit status "is live and authoritative: available, held, blocked, booked". The same status is shared across direct sales, channel partners and the launch platform. "A hold has an owner and an expiry, so units are not quietly reserved forever." Setup includes "Block & hold workflows" and "Real-time availability" — [Sell.Do inventory page (search summary)](https://www.sell.do/real-estate-crm/inventory-and-negotiations/projects-towers-units) (VENDOR CLAIM; default hold duration not published)
- **Anarock blocking rules.** In Anarock's Sales Agent App, blocking a unit is available only once the lead reaches the **Visit Done** stage, and agents need **All Access** rights to block or book — [Anarock support](https://support.anarock.com/support/solutions/articles/35000222034-booking-blocking-the-inventory) (VERIFIED via search summary; page fetch failed)
- **Hold-expiry pattern elsewhere.** Google Ads' booking enum has an explicit `HOLD_EXPIRED` state — [Google Ads API BookingStatus](https://developers.google.com/google-ads/api/reference/rpc/v25/BookingStatusEnum.BookingStatus) (VERIFIED). It is a useful design analogue: model expiry as its own state or event.
- **PLC (Preferential Location Charge)** is a per-sq-ft premium for desirable units (park-facing, corner, road- or pool-facing). Several can stack on one unit. "There are no guidelines on PLC" and it varies by developer — [Provident Housing](https://www.providenthousing.com/blog/understanding-real-estate-terms-the-meaning-of-plc-frc-and-its-calculation/) (VENDOR CLAIM), [RealtyHunting](https://realtyhunting.com/floor-rise-plc-charges-explained/) (VENDOR CLAIM)
- **Floor rise** is illustrated at ₹50–100 per sq ft per floor above a base floor, varying by developer — [RealtyHunting](https://realtyhunting.com/floor-rise-plc-charges-explained/) (VENDOR CLAIM). Developers change it over time: a Chennai developer reinstated floor-rise charges in Feb 2026 — [The Week/PTI](https://www.theweek.in/wire-updates/business/2026/02/06/spr-city-to-reinstate-floor-rise-charges.amp.html) (press). Rates must therefore be per-project configuration, not code.

### Inferences
**Minimum schema (ESTIMATE, from the Sell.Do and Anarock patterns):**
- `towers`: project_id, name, floors, units_per_floor.
- `units`: tower_id, floor, unit_no, bhk_type, carpet_area_sqft, carpet_area_sqm, balcony_area, facing, plc_tags (JSON), base_rate_override, status, hold_by_user_id, hold_lead_id, hold_until, blocked_token_amount, booked_lead_id, booking_id, version, updated_at.
- `unit_status_log`: an audit trail of every status change.

**States:**
- available → held (salesperson; expiry, e.g. 24–72 h, configurable) → blocked (token received or manager approval) → booked (booking form) → sold/registered.
- Side states: not-for-sale/reserved (landowner or investor share), cancelled (back to available, logged).

**Double-booking guard on SQLite:**
- Run `BEGIN IMMEDIATE; UPDATE units SET status='held', hold_by=?, hold_until=? WHERE id=? AND status='available'; COMMIT;`, then check `rowcount == 1`. SQLite allows only one writer at a time, so this is atomic. An optimistic `version` column covers edits.
- Expired holds are released by a periodic job, either an n8n cron calling an endpoint or an APScheduler job in the app. Lazy release on read is an alternative.

**Cost-sheet engine (per project config):**
- Agreement value = carpet area × base rate + floor rise (max(0, floor − base_floor) × rate × area) + Σ PLC + parking (fixed per slot) + other charges (development, legal, club, infrastructure) + optional maintenance deposit.
- GST is applied on agreement value for under-construction units:
  - **5% without ITC** for non-affordable housing.
  - **1%** for affordable housing (≤ ₹45 lakh, and carpet area ≤ 60 m² in metros or ≤ 90 m² elsewhere).
  - Not applicable to ready units with an occupancy certificate.
  - (PRIOR KNOWLEDGE: GST Council regime effective 1 Apr 2019. Verify with the compliance researcher.)
- Stamp duty and registration are shown as buyer-paid estimates:
  - Maharashtra urban (Pune/Mumbai) ≈ **6%** including metro cess.
  - Women buyers get a 1% concession.
  - Registration is 1%, capped at ₹30,000.
  - (PRIOR KNOWLEDGE, so make every rate an editable field.)
- Output is a print-CSS page, printed to PDF from the browser. That costs ₹0 and avoids a PDF library.

**RERA display (PRIOR KNOWLEDGE; confirm with the compliance researcher):**
- RERA requires pricing on **carpet area** (RERA Act s.2(k) definition). Show carpet area as the primary figure, with balcony/terrace areas listed separately, and never price on super built-up area alone.
- Print the project's MahaRERA registration number (and QR code where required) on cost sheets and booking forms.

**Effort (ESTIMATE):**
- Tower/floor/unit grid with colour-coded status, filters and hold/release: M.
- Cost sheet with print: M.
- Booking form linked to the existing bookings table: S.
- Payment schedule and demand letters (post-sales): L, out of scope.

**Risks:**
- Builders' pricing exceptions (negotiated discounts, offers) need a discount field with an approval threshold. Otherwise staff will keep using Excel.
- Bulk unit import is needed from day one. Reuse the existing CSV import with preview.

### Gaps
- **Farvision, In4Suite, Propacity docs:** not reachable (searches returned nothing relevant; fetch failed). Their field lists, default hold durations and approval flows are **not found**.
- **Sell.Do specifics:** default hold time and negotiation/approval flow are not published on the marketing page.
- **Exact current rates:** GST, Maharashtra stamp duty, metro cess and registration caps were not verified this session.

---

## 3. Channel-partner (CP) portal: minimum feature set and tagging window

### Takeaway
Minimum useful CP portal, **M effort (2–3 weeks)** on the existing auth, per-person scoping, duplicate check and commission report:
1. CP self-registration with RERA agent number, plus admin approval.
2. Lead registration with duplicate check by phone.
3. A **time-limited tag (validity window)** that is extended by a site visit.
4. Status visibility on a few fields only.
5. Commission statement.

There is **no industry-standard window**. It is set per developer in the CP agreement. Examples found: 15 days after site visit (Casagrand), and a "visit extends validity 30 days" pattern in Sell.Do's UI. Make it configurable: default 30 days from registration, extended 30–60 days after a visit.

### Cited Findings
- **Sell.Do tagging.** Leads are protected through "link-based tagging" that gives partners visible ownership. There are "approval flows" for onboarding, "lead registration with duplicate detection and source tagging at capture", and an "attribution window and first verified tag applied by rule". A product mock-up shows "3 tagged leads expire in <48h — book a site visit to extend validity 30 days" — [Sell.Do Channel Partner Management (search summary)](https://www.sell.do/real-estate-crm/channel-partners) (VENDOR CLAIM; the mock-up is not a published rule)
- **Casagrand validity.** A lead's validity is **15 days after a site visit** with the channel partner, with possible extensions — [Casagrand CP registration (search summary)](https://www.casagrand.co.in/channel-partners-registration-offline/) (VENDOR CLAIM; developer policy)
- **Credit only within the window.** A booking is credited to the CP only if it happens within the validity period — [Veloxis](https://www.veloxisglobal.com/blog/channel-partner-in-real-estate) (VENDOR CLAIM)
- **Policy design advice.** Guides recommend a defined attribution window, a first-touch or registered-CP rule, a transparent dispute process, and timestamps to settle double claims — [Leadrat 2026 guide](https://leadrat.com/channel-partners-in-real-estate-a-complete-2026-guide/), [Opzynic](https://www.opzynic.com/blog/real-estate-channel-partner-program-india) (VENDOR CLAIM)
- **RERA number on paperwork.** Developer CP terms require the partner's valid RERA registration number on all booking forms and customer documents. RERA requires agents to register with the state authority — [search summary of developer CP terms](https://www.veloxisglobal.com/blog/channel-partner-in-real-estate) (VENDOR CLAIM)
- **Generic B2B benchmark (not real estate).** A 24–48 h approval SLA and a 90–180-day protection period are "common industry defaults" for deal registration — [CRM Experts Online](https://crmexpertsonline.com/the-deal-registration-problem-how-to-run-a-channel-partner-program-inside-your-crm-without-buying-a-prm/) (VENDOR CLAIM). One security vendor protects deals 60 days past forecast close — [SECNAP](https://www.secnap.com/partner-lead-registration/) (VENDOR CLAIM). Indian real-estate windows look much shorter.

### Inferences
**Minimum feature set (ESTIMATE):**
- **CP sign-up and approval.** CP registers with name, firm, phone, email, RERA agent number and PAN; admin approves. This reuses team accounts with a `role='cp'`.
- **Lead registration.** Fields: buyer name, phone, project, expected visit date. Normalise the phone and check against all leads:
  - If the phone matches an active tag owned by someone else, show "Already registered — contact sourcing manager". Do not reveal who owns it (privacy/DPDP).
  - If it matches an expired tag or an old direct lead with no activity, apply a configurable rule (e.g. allow re-tag after X days of inactivity).
- **Tag window fields** stored on the lead: `cp_id`, `tagged_at`, `tag_expires_at`, `tag_status`. A site visit marked "Done" automatically extends expiry by N days. A daily job expires tags and emails the CP 48 h before expiry, as in Sell.Do's mock-up.
- **CP link.** A unique link/QR per CP (`/r/<cp_code>`) opens a lead form that tags automatically. This is the "link-based tagging" pattern: S effort, and n8n is not needed.
- **CP view.** The CP sees only their own leads and a reduced status (Registered → Visit scheduled → Visited → Negotiation → Booked / Lost), with no internal notes.
- **Commission statement.** Booking value × commission % → eligible / invoice raised / paid. This reuses the existing broker commission report.

**Status:** table stakes for builders who rely on CPs (often 30–50%+ of sales; the customer researcher should verify the share). It is a differentiator at budget price points.

**Risks:**
- Disputes over who registered first. Mitigate with immutable timestamps and an audit log.
- CPs registering random numbers to farm leads. Mitigate with OTP or WhatsApp confirmation to the buyer (adds cost), or a per-day cap on registrations per CP.

### Gaps
- **Typical windows across major developers:** values from Pune/Mumbai developers (Kolte-Patil, Godrej, Lodha etc.) are **not found**. Next step: collect 5 CP agreements from local brokers.
- **Other competitors' CP portals:** Propacity, Kylas, Farvision and In4Suite CP portal features were not reachable.

---

## 4. Off-server backups: storage providers, tools, ₹ cost, residency

### Takeaway
Cheapest reliable option: **restic (encrypted, deduplicated) → Backblaze B2**, nightly, from a consistent SQLite snapshot (`sqlite3 db ".backup"` or `VACUUM INTO`). Cost is **₹0 for 10 GB and about ₹59/month for 100 GB**. Cloudflare R2 is about ₹128/month at 100 GB with zero egress. Effort **S (1–3 days including a restore drill)**.

- **Litestream** adds continuous, seconds-level recovery later, but is still labelled beta.
- **Wasabi** carries a 1 TB minimum charge (about ₹664/month), so it is wrong at this size.
- **AWS S3 Mumbai** is the only listed option that keeps data in India: about ₹24 (10 GB) / ₹237 (100 GB), as an ESTIMATE.
- **Hostinger object storage** was **not found**.

### Cited Findings
**Storage prices (all from search summaries of the vendor pages; flagged):**

| Provider | Storage price | Free tier / minimums | Egress | ₹/mo at 10 GB | ₹/mo at 100 GB |
|---|---|---|---|---|---|
| Backblaze B2 | US$6.95 per TB-month | First 10 GB free | Free up to 3× average stored, then US$0.01/GB | 0 | ≈ 59 |
| Cloudflare R2 (Standard) | US$0.015 per GB-month | 10 GB-month free; Class A US$4.50/million (1 M free), Class B 10 M free | Free | 0 | ≈ 128 |
| Wasabi | ≈ US$6.99 per TB-month | 1 TB minimum charge; 90-day minimum storage | Free if under stored amount | ≈ 664 | ≈ 664 |
| AWS S3 ap-south-1 (Mumbai) | ≈ ₹2.1/GB-month | — | First 100 GB/month free, then ≈ ₹8–9/GB | ≈ 24 | ≈ 237 |
| Hostinger object storage | not found | — | — | — | — |

Notes and sources for the table:
- **B2:** US$6.95/TB/30-day, first 10 GB free. Egress free up to 3× average monthly storage, then US$0.01/GB, and free unlimited through partner CDNs. API calls free on pay-as-you-go — [Upstash B2 explainer, Oct 2026](https://upstash.com/blog/backblaze-b2-pricing-explained-2026), [B2 pricing page](https://www.backblaze.com/b2/cloud-storage-providers.html) (VERIFIED via summary; Upstash is a competitor)
- **R2:** also offers Infrequent Access at US$0.01/GB-month with retrieval fees. A GB-month is the average of each day's peak storage — [Cloudflare R2 pricing docs (search summary)](https://developers.cloudflare.com/r2/platform/pricing/) (VERIFIED via summary)
- **Wasabi:** one guide says 30-day; sources conflict and the official page was not reached — [leanopstech, Apr 2026](https://leanopstech.com/blog/wasabi-pricing-2026/), [toolradar](https://toolradar.com/tools/wasabi/pricing), [bestcloudstorageguide](https://bestcloudstorageguide.com/blog/wasabi-pricing-pricing-guide-2026) (AGGREGATOR)
- **S3 Mumbai:** indicative reseller figures, which put Standard at about ₹2,100/TB-month — [Precision Tech AWS partner guide](https://precisiontech.in/cloud/amazon-aws-cloud/aws-pricing/aws-pricing-in-pune/) (VENDOR CLAIM). My PRIOR KNOWLEDGE is US$0.025/GB, which is consistent. Official page not reached.
- **Hostinger:** no own pricing page found. Comparison tables leave Hostinger's object-storage cell blank — [getdeploying](https://getdeploying.com/backblaze-vs-hostinger) (AGGREGATOR). Treat as not offered until shown otherwise.

**Tools:**
- **Litestream** "safely replicates changes incrementally to another file or S3", communicates only via the SQLite API, and creates an internal `_litestream_lock` table to take SQLite's write lock around WAL checkpoints. The README badge reads **status: beta**. Latest tag **v0.5.17**; last commit 14 Oct 2026 — [Litestream GitHub](https://github.com/benbjohnson/litestream) (VERIFIED)
- **Litestream with each provider:**
  - Backblaze B2 is "Supported with configuration": `sign-payload=true&force-path-style=true`.
  - Cloudflare R2 is "Supported" with a known "Strict concurrent upload limit (2-3 concurrent uploads max)" (concurrency 2 auto-applied).
  - Wasabi is "Supported".
  - Source: [Litestream docs/PROVIDER_COMPATIBILITY.md](https://github.com/benbjohnson/litestream/blob/main/docs/PROVIDER_COMPATIBILITY.md) (VERIFIED)
- **Litestream sync interval** defaults to `1s` (`LITESTREAM_SYNC_INTERVAL`, VFS docs) — [docs/VFS.md](https://github.com/benbjohnson/litestream/blob/main/docs/VFS.md) (VERIFIED)
- **Litestream 0.5 history.** v0.5.0 (Oct 2025) moved to the LTX format with point-in-time recovery and pure-Go SQLite, and removed "generations". One report says each database is limited to a **single replica destination**, and early users reported upgrade problems — [Fly.io blog](https://fly.io/blog/litestream-v050-is-here/), [Simon Willison](https://simonwillison.net/2025/Oct/3/litestream), [ecosistemastartup](https://ecosistemastartup.com/?p=47637) (VENDOR CLAIM / USER REPORT)
- **restic** documents native backends for Local, SFTP, Amazon S3, S3-compatible, Wasabi and Backblaze B2, plus anything rclone supports. `backup --stdin-from-command -- <dump command>` streams a dump straight into the repository — [restic docs (030_preparing_a_new_repo, 040_backup)](https://restic.readthedocs.io/en/stable/030_preparing_a_new_repo.html) (VERIFIED, read from the GitHub source). restic encrypts all repository data by default (070_encryption.rst; PRIOR KNOWLEDGE that it is AES-256).

### Inferences
**Recommended setup (ESTIMATE):**
- A nightly cron on the VPS loops over clients. For each one it runs `sqlite3 /data/<client>.db ".backup /tmp/<client>.db"` (a consistent snapshot even under WAL), then `restic backup` of `/tmp/*.db` plus uploads/logos to B2.
- Retention: `restic forget --keep-daily 14 --keep-weekly 8 --keep-monthly 12 --prune`. Run a monthly `restic check` and a restore test.
- Repository keys stay off the VPS, in a password manager.
- Deduplication keeps 30+ daily versions of small DBs (likely under 50 MB each) well inside the free 10 GB for the first 20–50 clients.

**Litestream later:**
- For RPO of seconds, add Litestream per client.
- Set `sync-interval` to 10–60 s. At the 1 s default, a busy DB could generate up to about 2.6 M PUTs/month.
- On R2 that worst case costs about US$7 (≈ ₹680) per DB per month in Class A operations, after 1 M free per account. On B2 (free API calls) it costs nothing.

**Free tiers are per account, not per client.** Budget about ₹60–130/month in total at 100 GB.

**Data residency (PRIOR KNOWLEDGE; the compliance researcher must confirm):**
- The DPDP Act 2023 allows cross-border transfer except to countries the government restricts by notification. There is no general localisation rule for this kind of SaaS.
- B2 regions are US/EU. R2 picks the location automatically, and its jurisdiction options are EU/FedRAMP, not India.
- Mitigations: client-side encryption (restic), plus a contract clause naming the backup location.
- For clients who insist on India, offer S3 ap-south-1 as a paid option, or check Indian providers such as E2E Networks (not researched).

**Status:** table stakes in the sense that buyers assume backups exist. Unseen, but a single data-loss incident would be fatal.

### Gaps
- **Official live prices:** the official pricing pages for B2, R2, Wasabi and S3 Mumbai were not opened (fetch blocked). The S3 Mumbai per-GB and PUT prices are ESTIMATES.
- **Hostinger:** whether Hostinger sells object storage (or Hostinger VPS backup add-ons) and at what price is **not found**.
- **Wasabi minimum duration:** 90 days vs 30 days is unresolved (sources conflict).

---

## 5. Onboarding automation: wildcard DNS, Caddy TLS, n8n templating

### Takeaway
Per-client onboarding can drop from about 1 hour to a one-command script. Effort **S–M (3–7 days)**:
1. One **wildcard DNS record**, `*.crm.goldenratiosolution.com → VPS`, created once.
2. Caddy **on-demand TLS**, gated by an `ask` endpoint on the CRM's tenant registry. Alternatively, a wildcard certificate via the DNS-01 challenge, which needs a DNS-provider plugin build.
3. One Caddy site block that routes by subdomain label to the client's container.
4. n8n workflows created via the public REST API (`X-N8N-API-KEY`), or, better, **one multi-tenant n8n workflow** keyed by client slug.

### Cited Findings
- **On-demand TLS.** Caddy gets a certificate "during the first TLS handshake that requires it… this does **not** require hard-coding the domain names". "On-demand TLS must be both enabled and restricted to prevent abuse". The primary restriction is an "ask" endpoint that can "query the accounts table of your database" — [Caddy docs: Automatic HTTPS (source on GitHub)](https://caddyserver.com/docs/automatic-https) (VERIFIED)
- **The ask endpoint contract.** Caddy calls the URL with `?domain=`. A 2xx answer authorises issuance; anything else errors the handshake. It "should return as fast as possible, in a few milliseconds". Example: `on_demand_tls { ask http://localhost:9123/ask }` plus `https:// { tls { on_demand } }` — [Caddy docs: Caddyfile global options](https://caddyserver.com/docs/caddyfile/options#on-demand-tls) (VERIFIED)
- **Wildcard certificates.** "Let's Encrypt requires the DNS challenge to obtain wildcard certificates". "As of Caddy 2.10… Caddy will use the wildcard certificate for individual subdomains in the configuration" — [Caddy docs](https://caddyserver.com/docs/automatic-https#wildcard-certificates) (VERIFIED). The DNS challenge needs a DNS-provider module compiled in (custom xcaddy build) — [flaviocopes course](https://flaviocopes.com/courses/caddy/choose-advanced-certificate-automation/) (AGGREGATOR). One forum thread reports problems combining a wildcard with `on_demand_tls ask` ("no solvers available") — [Caddy community](https://caddy.community/t/mixing-wildcard-certificate-with-on-demand-feature/12280) (USER REPORT, older thread).
- **Rate limits.** Caddy's internal limit is "10 attempts per ACME account per 10 seconds". Use staging while testing, or "you are likely to hit rate limits which can block your access to HTTPS for up to a week" — [Caddy docs](https://caddyserver.com/docs/automatic-https) (VERIFIED)
- **Subdomain routing.** The placeholder `{labels.*}` = `{http.request.host.labels.*}` is available in the Caddyfile. `reverse_proxy` upstreams may use placeholders, but "a port **must** be included"; dynamic-upstream modules are preferred — [Caddy docs: concepts & reverse_proxy](https://caddyserver.com/docs/caddyfile/directives/reverse_proxy) (VERIFIED)
- **n8n public API.** It is available on "Self-hosted: All editions" (not the Cloud free trial). Auth is the header `X-N8N-API-KEY`. Keys have a label and expiry; scopes exist on Enterprise. The resources include Workflow, Execution, Credential, Tags, Variables, Projects and more. The **n8n CLI** wraps the API and supports `package import` with conflict policies — [n8n docs (source on GitHub)](https://docs.n8n.io/api/) (VERIFIED)
- **n8n workflow endpoints.** Third-party guides say workflows are created with `POST /api/v1/workflows` (name, nodes, connections, settings), start inactive, and are activated via `POST /api/v1/workflows/{id}/activate` — [Leland guide](https://www.joinleland.com/library/a/n8n-api), [n8n-mcp docs](https://www.mintlify.com/czlonkowski/n8n-mcp/api/workflow/create) (AGGREGATOR)

### Inferences
**Cheapest design (ESTIMATE):**
- **DNS:** add `*.crm` as an A record once at the current DNS host. HTTP-01 then works for each subdomain, so on-demand TLS needs **no DNS plugin**.
- **TLS gate:** the `ask` endpoint is a small FastAPI route, or a static allow-list file. It returns 200 only for slugs in the tenant registry.
- **Routing:**
  ```
  *.crm.goldenratiosolution.com {
      tls { on_demand }
      reverse_proxy crm-{labels.3}:8000
  }
  ```
  The label index must be checked for the domain depth. Docker containers named `crm-<slug>` share one Docker network. No Caddyfile edit per client.
- **Provisioning script** (Python or bash), steps in order:
  1. `docker run crm-<slug>` with env vars.
  2. Create the SQLite DB and the admin user.
  3. Insert the tenant into the registry.
  4. Call the n8n API to clone a template workflow, replacing the slug and webhook path, then activate it.
  5. Send the welcome email.
- **n8n alternative:** a single shared workflow (`/webhook/lead/{slug}`) that looks up the client's internal endpoint. This removes per-client workflow copies entirely and is easier to update. Credentials such as Facebook page tokens still differ per client.

**Risks:**
- Let's Encrypt per-domain weekly certificate limits apply as clients grow (PRIOR KNOWLEDGE: about 50 new certificates per registered domain per week). Moving to a wildcard certificate (DNS-01, with DNS hosted at a provider that has a caddy-dns module, e.g. Cloudflare free DNS) removes this limit.
- Misrouting between tenants if slug sanitisation is weak. Validate slugs as `[a-z0-9-]` only.

**Status:** an internal efficiency gain, not a buyer feature. It enables same-day go-live, which is a sales point.

### Gaps
- **Hostinger DNS plugin:** whether the Hostinger DNS API has a caddy-dns provider module is not checked.
- **Current certificate limits:** Let's Encrypt's 2026 rate-limit numbers were not verified this session.
- **Exact n8n endpoint shapes:** the `POST /workflows` body and `activate` endpoint should be checked against the instance's own API playground (self-hosted).

---

## 6. SQLite ceiling for 40 users; when to move to Postgres

### Takeaway
For one company with **40 users, the workload is far below SQLite's limits**, provided the app is configured correctly:
- WAL mode.
- `busy_timeout`.
- Short write transactions.
- Bulk imports chunked.
- One writer process (or retry-on-busy).

Move to Postgres only on hard triggers: multiple app servers or containers writing the same DB, sustained heavy concurrent writes, cross-tenant analytics, or needing managed point-in-time recovery or high availability. None of these is expected for Pro tier (40 users). Effort to harden now: **S**. A migration would be **L**.

### Cited Findings
- **WAL architecture.** Writes are appended to the WAL first and later checkpointed into the main DB; readers see a consistent snapshot through the WAL — [Litestream docs/SQLITE_INTERNALS.md](https://github.com/benbjohnson/litestream/blob/main/docs/SQLITE_INTERNALS.md) (VERIFIED, third-party docs of SQLite internals)
- **Litestream takes the write lock briefly.** It "uses the table to acquire SQLite's write lock while coordinating synchronization around WAL checkpoints" — [Litestream README](https://github.com/benbjohnson/litestream) (VERIFIED). Adding Litestream therefore adds brief write-lock contention, so a busy timeout is essential.
- **The official SQLite pages could not be opened.** These are [sqlite.org/wal.html](https://www.sqlite.org/wal.html) and [sqlite.org/whentouse.html](https://www.sqlite.org/whentouse.html). PRIOR KNOWLEDGE of their content, to verify:
  - WAL lets readers and the single writer run concurrently, but "there can only be one writer at a time".
  - WAL does not work over network filesystems.
  - SQLite "works great as the database engine for most low to medium traffic websites". Sites with fewer than 100K hits/day "should work fine", described as a conservative figure.

### Inferences
**Load estimate (ESTIMATE):** 40 sales users each make perhaps 100–300 writes a day (notes, stage changes, follow-ups). That is about 4,000–12,000 writes over 8 hours, or roughly 0.2–0.5 writes per second on average, with bursts of a few per second. Each small write transaction takes about a millisecond in WAL mode. Contention is therefore negligible.

**Main real risks:**
- Long write transactions, such as a 5,000-row Excel import inside one transaction. Chunk them into batches of about 500.
- Several Uvicorn/Gunicorn workers writing without `busy_timeout`, which causes "database is locked" errors.
- Running the DB on a network or overlay volume.

**Hardening checklist (S):**
- `PRAGMA journal_mode=WAL; synchronous=NORMAL; busy_timeout=5000; foreign_keys=ON`.
- `BEGIN IMMEDIATE` for read-modify-write flows such as inventory holds.
- Periodic `PRAGMA wal_checkpoint(TRUNCATE)` if the WAL grows.
- Indexes on (assigned_to, next_followup_at), (phone) and (status).
- A load test with Locust: 40 virtual users, 5 minutes, measuring p95 latency and lock errors. This gives the buyer-facing evidence.

**Triggers to move to Postgres (ESTIMATE):**
- Over about 100 concurrent active users per tenant.
- Needing more than one app container per tenant.
- A cross-client BI/analytics product.
- Wanting managed PITR/HA.
- Sustained write rates above about 50–100 per second.

Keep the SQL portable (SQLAlchemy, no SQLite-only features) to keep that door open.

### Gaps
- **SQLite primary docs:** the SQLite pages and independent 2025–2026 benchmarks (e.g. write throughput under WAL with Python) were not retrieved (blocked). The README/benchmark claims above remain PRIOR KNOWLEDGE.
- **Real write-rate data:** per-user write rates are ESTIMATES. Measure with the app's own logs from existing clients.

---

## 7. AI features buyers pay for: who ships them, and running cost per client

### Takeaway
At cheap-model prices, **all LLM text features together cost about ₹250–1,200 per client per month** for a 15-user Growth client (assumptions below). Transcription is the bigger cost: **₹290–3,000/month for 100 hours of calls**, depending on vendor.

Priority by build effort:
1. **Follow-up message drafting (S)** and **rules-based lead scoring (S, ₹0)** first.
2. **Deterministic duplicate detection (S, ₹0)**.
3. **Brochure-grounded WhatsApp auto-reply (M)**: needs the WhatsApp Business API first.
4. **Call summaries (M)**: needs call recordings from telephony first.
5. **No-show prediction**: kill as ML for now. Replace with visit-confirmation reminders.

Which competitors ship each feature, and what users say, could not be researched (search budget exhausted).

### Cited Findings
**LLM prices per 1M tokens (input / output):**

| Model | Input (US$/1M) | Output (US$/1M) | Notes | Source and tag |
|---|---|---|---|---|
| DeepSeek V4-Flash | 0.30 | 1.20 | Cache hit US$0.006 | [LiteLLM price map, updated 2026-10-18](https://github.com/BerriAI/litellm/blob/main/model_prices_and_context_window.json), citing [api-docs.deepseek.com/quick_start/pricing](https://api-docs.deepseek.com/quick_start/pricing) (AGGREGATOR) |
| DeepSeek V4-Pro | 1.32 | 3.96 | — | Same (AGGREGATOR) |
| Gemini 2.5 Flash-Lite | 0.10 | 0.40 | — | LiteLLM (AGGREGATOR) |
| Gemini 3.1 Flash-Lite | 0.25 | 1.50 | — | LiteLLM (AGGREGATOR) |
| Gemini 3.5 Flash-Lite | 0.30 | 2.50 | — | LiteLLM (AGGREGATOR) |
| Gemini 2.5 Flash | 0.30 | 2.50 | — | LiteLLM (AGGREGATOR) |
| Gemini 3 Flash | 0.50 | 3.00 | — | LiteLLM (AGGREGATOR) |
| Gemini 3.5 Flash | 1.50 | 9.00 | — | LiteLLM (AGGREGATOR) |
| GPT-5.4-nano | 0.20 | 1.25 | — | LiteLLM (AGGREGATOR) |
| GPT-5.4-mini | 0.75 | 4.50 | — | LiteLLM (AGGREGATOR) |
| GPT-5-nano | 0.05 | 0.40 | Older generation, still listed | LiteLLM (AGGREGATOR) |
| GPT-5-mini | 0.25 | 2.00 | Older generation, still listed | LiteLLM (AGGREGATOR) |
| GPT-4o-mini | 0.15 | 0.60 | Older generation, still listed | LiteLLM (AGGREGATOR) |
| Claude Haiku 5.5 (`claude-haiku-5-5`) | 0.10 | 0.50 | For prompts up to 100K tokens | Anthropic model table cached 2026-10-06 in the Claude API skill; LiteLLM cites [platform.claude.com Haiku 5.5 overview](https://platform.claude.com/docs/en/models/haiku-5-5/overview) (VERIFIED) |
| Claude Haiku 4.5 | 1.00 | 5.00 | — | Same (VERIFIED) |

Conflicts and notes on the price table:
- **DeepSeek peak vs off-peak.** Search summaries describe peak/off-peak pricing, with V4.1-Flash off-peak at US$0.15 / US$0.60 and peak at double, which matches LiteLLM's 0.30 / 1.20 — [devtk.ai](https://devtk.ai/en/blog/deepseek-api-pricing-guide-2026/), [costgoat Oct 2026](https://costgoat.com/pricing/deepseek-api) (AGGREGATOR). An older 2026 guide gives different V4 prices, so DeepSeek's prices have moved during 2026.
- **Gemini Flash-Lite figures conflict across trackers** — [morphllm](https://www.morphllm.com/gemini-api-pricing), [benchlm](https://benchlm.ai/google/api-pricing) (AGGREGATOR)
- **GPT-5.4 prices.** GPT-5.4-mini at 0.75 / 4.50 was "checked October 6, 2026" by [mem0](https://mem0.ai/library/llms-and-models/openai-api-pricing); GPT-5.4-nano at 0.20 / 1.25 per [pricepertoken](https://pricepertoken.com/pricing-page/model/openai-gpt-5.4-nano) (AGGREGATOR)

**Speech-to-text (all per LiteLLM unless noted):**

| Service | Price | Source and tag |
|---|---|---|
| Sarvam AI STT | ₹30/hour, billed per second; with diarization ₹45/hour; STT + translate ₹30/hour | [Sarvam API pricing docs (search summary)](https://docs.sarvam.ai/api/getting-started/pricing.md) (VERIFIED via summary) |
| Deepgram Nova-3 | US$0.0043/min | Cites [deepgram.com/pricing](https://deepgram.com/pricing) (AGGREGATOR) |
| OpenAI gpt-4o-mini-transcribe | US$0.003/min | AGGREGATOR |
| OpenAI whisper-1 | US$0.006/min | AGGREGATOR |
| Groq whisper-large-v3 | US$0.0018/min | AGGREGATOR |
| Groq whisper-large-v3-turbo | US$0.00067/min | AGGREGATOR |
| Cloudflare Workers AI whisper-large-v3-turbo | US$0.00051/min | AGGREGATOR |
| ElevenLabs Scribe | US$0.0037/min | AGGREGATOR |

Sarvam notes: free signup credits conflict (₹100 vs ₹1,000), and the Saarika model name and per-language rates were not confirmed — [smallest.ai (competitor blog)](https://smallest.ai/blog/sarvam-ai-speech-to-text-pricing) (VENDOR CLAIM).

**Embeddings for brochure RAG:** OpenAI text-embedding-3-small US$0.02/1M tokens; Gemini embedding-001 US$0.15/1M — [LiteLLM](https://github.com/BerriAI/litellm/blob/main/model_prices_and_context_window.json) (AGGREGATOR). Embedding a 30-page brochure (about 20K tokens) costs well under ₹1.

### Inferences
**Usage assumption (ESTIMATE) for a Growth client with 15 users and about 1,500 new leads/month:**

| Feature | Volume per month | Tokens per item (in / out) |
|---|---|---|
| (a) Lead scoring with an LLM assist | 1,500 leads | 1,000 / 150 |
| (b) Follow-up drafts (15 users × 20/day × 25 days) | 7,500 drafts | 1,500 / 200 |
| (c) WhatsApp RAG auto-replies | 3,000 inbound messages | 3,000 / 250 (brochure chunks + history) |
| (d) Call summaries | 4,000 calls | 1,500 / 200 |
| **Total** | — | **27.75 M input / 3.28 M output** |

Transcription assumption: 100 hours (6,000 min) of recorded calls per month.

**Monthly LLM cost per client (₹, at ₹94.92/$):**

| Model | ₹ per client per month |
|---|---|
| GPT-5-nano | ≈ 256 |
| Gemini 2.5 Flash-Lite | ≈ 388 |
| Claude Haiku 5.5 | ≈ 419 |
| GPT-4o-mini | ≈ 582 |
| DeepSeek V4-Flash | ≈ 776 (with ~50% prompt-cache hits) to ≈ 1,163 (no cache, peak rates) |
| GPT-5.4-nano | ≈ 915 |
| Gemini 3.1 Flash-Lite | ≈ 1,125 |
| GPT-5-mini | ≈ 1,280 |
| Gemini 2.5 Flash | ≈ 1,567 |
| GPT-5.4-mini | ≈ 3,374 |
| Claude Haiku 4.5 | ≈ 4,188 |
| Gemini 3.5 Flash | ≈ 6,749 |

Per-feature split, using DeepSeek V4-Flash at peak rates: scoring ₹68, drafting ₹491, RAG replies ₹342, call summaries ₹262.

**Monthly transcription cost for 100 hours (₹):**

| Service | ₹ per month |
|---|---|
| Cloudflare whisper-turbo | ≈ 290 |
| Groq whisper-turbo | ≈ 380 |
| Groq whisper-large-v3 | ≈ 1,053 |
| gpt-4o-mini-transcribe | ≈ 1,709 |
| ElevenLabs Scribe | ≈ 2,088 |
| Deepgram Nova-3 | ≈ 2,449 |
| Sarvam | ≈ 3,000 (₹4,500 with diarization) |
| whisper-1 | ≈ 3,417 |

Implication: AI can be bundled into Growth/Pro at under 10–15% of the ₹7,999–12,999 price. Transcription should be a metered add-on, or included only with the telephony add-on.

**Feature-by-feature build notes (ESTIMATE):**
- **Lead scoring (S, ₹0):** rules with points for source quality, budget-to-project price fit, response to first call, visit booked, revisit, days since last touch. Show "why" chips. An LLM is optional, only to read free-text notes into signals ("wants 2BHK under 80L, ready possession"). Buyers want explainable scores, not black boxes.
- **Follow-up drafting (S):** a button on the lead card. The prompt carries lead fields, the last notes, project facts and language (English/Hindi/Marathi). Output is WhatsApp-length text opened via click-to-chat, so no WhatsApp API is needed. The existing DeepSeek assistant can be reused.
- **WhatsApp brochure auto-reply (M):** PDF → text chunks → embeddings in SQLite (sqlite-vec, or brute-force cosine for under 1,000 chunks) → top-k chunks plus a guarded prompt ("answer only from brochure; say 'our team will call you' otherwise; never quote a price unless it is in the price sheet"). It needs the WhatsApp Business API (another researcher's scope) and a human-handoff rule. Risk: hallucinated prices or possession dates, so log every answer.
- **Call summary (M):** requires recordings from telephony (Exotel/MyOperator webhooks). Then STT, then an LLM summary into fields: interest, budget, objections, next step, follow-up date. Language: Sarvam is India-focused. Whisper-family quality on Marathi or Hinglish code-mixed calls is unverified, so test 20 real calls per vendor before choosing.
- **Duplicate detection (S, ₹0):** normalise phones to E.164 (the `phonenumbers` Python library), and fuzzy-match names and emails (`rapidfuzz`). Show a merge UI. No LLM is needed.
- **Site-visit no-show prediction:** small clients have too few visits (perhaps 50–200/month) to train a model credibly. Replace with:
  - an automatic confirmation the day before (push, email or WhatsApp template), with a reply-to-confirm;
  - a simple "risk" flag: unconfirmed, long travel distance, first-time lead from a portal.
- **Model choice and data risk (PRIOR KNOWLEDGE):**
  - DeepSeek's first-party API is served from China, which buyers may question under DPDP and confidentiality. Gemini's free tier may use data for product improvement.
  - Recommendation: keep an OpenAI-compatible client so the model is switchable per client (DeepSeek ↔ Gemini Flash-Lite ↔ Claude Haiku 5.5 ↔ GPT-5.4-nano), and state the processor in the DPA.

### Gaps
- **Competitor AI features:** which competitors ship each AI feature (Sell.Do, LeadSquared, Kylas, TeleCRM, Privyr, Propacity, Superleap etc.) and user reviews of those features are **not found**. Search budget was exhausted before this sub-question; the competitor researcher's notes, or a follow-up search, should fill it.
- **Hindi/Marathi transcription accuracy:** no WER benchmarks for Sarvam vs Deepgram vs Whisper on Marathi/Hinglish phone audio were retrieved. Run an own test.
- **Official LLM price pages:** DeepSeek, Google and OpenAI pricing pages could not be opened. Prices come from the LiteLLM map and search summaries. DeepSeek peak vs off-peak and V4 vs V4.1 naming are unresolved.
- **Willingness to pay:** no evidence was found on whether small builders pay extra for AI.

---

## 8. Visit outcomes and custom fields/tags (other gaps in scope)

### Takeaway
Both are **S (under 1 week each)** on the current stack and are table stakes in demos.
- **Visit outcomes:** add a status (Scheduled / Done / No-show / Cancelled / Rescheduled), outcome notes, next step, and auto-advance of the pipeline stage.
- **Custom fields:** a per-company JSON column with a field-definition table (text, number, date, dropdown, multi-select).
- **Tags:** a many-to-many table with filter chips.

### Cited Findings
- **Visit status gates later steps.** Anarock gates unit blocking on the "Visit Done" stage — [Anarock support (search summary)](https://support.anarock.com/support/solutions/articles/35000222034-booking-blocking-the-inventory) (VERIFIED via summary). Sell.Do's CP mock-up ties tag-validity extension to "book a site visit" — [Sell.Do CP page (search summary)](https://www.sell.do/real-estate-crm/channel-partners) (VENDOR CLAIM). Both show visit status as a trigger for other workflows.

### Inferences
**Visit outcomes (ESTIMATE design):**
- Fields: `visits.status` (scheduled / done / no_show / cancelled / rescheduled), `outcome` (interested / thinking / not interested / revisit planned / negotiation), `next_followup_at`, `attended_by`, `revisit_of_visit_id`.
- Marking a visit "Done" moves the lead to the "Visit done" stage, sets the follow-up date, and (if CP-tagged) extends the tag window.
- A no-show creates a same-day call task.
- Reports: visit-to-booking already exists; add a no-show rate per source and per salesperson.

**Custom fields (ESTIMATE design):**
- `custom_field_defs` (company-scoped: key, label, type, options, required, show_in_list).
- Values live in `leads.custom JSON`, queried via SQLite `json_extract`, with an index on generated columns for 1–2 hot fields.
- Fields must be included in CSV import/export and in filters.
- Limit to about 20 fields per company to keep the UI simple.

**Tags:** `tags` plus `lead_tags`, with bulk tag and untag from list selection. Tags feed n8n automations later, e.g. tag "NRI" triggers a time-zone-aware follow-up.

**Logo upload** is a further S item (not researched).

### Gaps
- **Competitor field definitions:** competitor field-type lists and limits (Sell.Do, Kylas custom fields) were not reached.
