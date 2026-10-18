# Rules we must follow: Indian legal and regulatory compliance for a white-label real-estate CRM (Part D)

Researcher notes. Access date for every link below: **2026-10-18** (today). Not legal advice; items marked "LAWYER/CA CONFIRM" need professional sign-off.

**Method caveat (important for the report writer):** in this session the egress proxy blocked direct page fetches (pib.gov.in, trai.gov.in, chambers.com, medianama.com, bitscore.in all returned 403/DNS failure). Every finding below therefore comes from search-engine extracts of the linked pages, not from my reading the full page. Treat exact wording, numbers and dates as "extract-level" and re-check against the primary text before publishing.

**Source tags:**
- **VERIFIED** = government / regulator / platform-owner (Meta) page. Content seen through search extract only.
- **SECONDARY** = law-firm or professional explainer (Mondaq, Lexology, Cyril Amarchand, King Stubb & Kasiva, Taxmann, Legal500, India Briefing). Secondary, not primary.
- **VENDOR CLAIM** = SaaS / compliance-tool / BSP blog with a commercial interest.
- **USER REPORT** = forum posts (CAclubindia etc.).
- **MODEL KNOWLEDGE (unverified)** = my training knowledge, not confirmed by a source this session. This label appears only in Inferences or Gaps, never as a cited finding.

---

## 1. DPDP Act 2023 and DPDP Rules 2025: role, contract, breach, consent, retention, Consent Managers, SDF, penalties, phased dates

### Takeaway
The DPDP Rules were notified on 13 Nov 2025 (G.S.R. 846(E)) and phase in over 18 months. Only the Data Protection Board provisions are live now. Consent Manager registration starts **13 Nov 2026**, 26 days from today. All substantive fiduciary and processor duties (notice, consent, security, the 72-hour breach report, retention and erasure, cross-border) start **13 May 2027**. MeitY has *proposed* compressing the timeline to 12 months, but as of Sept 2026 no amendment had been notified. The builder or broker is the Data Fiduciary and carries the liability. Golden Ratio is a Data Processor and needs a written processing contract with every client, plus security, breach-assist and deletion features built into the product before May 2027.

### Cited Findings
**Notification and phasing**
- DPDP Rules notified 13 Nov 2025 with phased commencement; some sources say 14 Nov, but 13 Nov and Gazette G.S.R. 846(E) are the most cited — [Glocert / search extract](https://www.glocertinternational.com/resources/guides/dpdp-rules-2025-compliance-timeline/) (VENDOR CLAIM); [PIB "DPDP Rules, 2025 Notified" PDF](https://static.pib.gov.in/WriteReadData/specificdocs/documents/2025/nov/doc20251117695301.pdf) (VERIFIED: official, but fetch blocked; listed in search results only).
- Rules 1, 2 and 17–21 (Data Protection Board set-up) took effect on notification — [Veritect](https://veritect.ai/digital-data-ai-law/dpdp-rules-2025-phased-rollout) (VENDOR CLAIM).
- Rule 7 breach obligations start on 13 May 2027, and many 2026 web pages wrongly describe them as already in force — [Bitscore](https://www.bitscore.in/tools/dpdp-commencement/breach-notification-72-hours) (VENDOR CLAIM).
- Full Data Fiduciary obligations apply from 13 May 2027 — [Lexology](https://www.lexology.com/library/detail.aspx?g=7e3af947-10aa-4712-bc1e-54179a613409) (SECONDARY); [Legismith timeline](https://legismith.com/dpdp-rules-2025-timeline/) (VENDOR CLAIM).
- Consent Manager obligations have their own date of 13 Nov 2026 under the existing Rules — [consentos.in status page](https://consentos.in/learn/dpdp-rules-notification-status/) (VENDOR CLAIM); [startuptalky "three deadlines"](https://startuptalky.com/dpdp-act-timeline-phases-2026-2027-explained/) (VENDOR CLAIM).
- Glocert's alternative timeline ("notified Jan 2025, four phases") conflicts with every other source. Treat it as unreliable — [Glocert](https://www.glocertinternational.com/resources/guides/dpdp-rules-2025-compliance-timeline/).

**Proposed compression (not law)**
- MeitY held stakeholder consultations on 23 Jan 2026 and proposed cutting the 18-month window to 12 months, which would move the final date to 13 Nov 2026 — [Business Standard, 22 Jan 2026](https://www.business-standard.com/technology/tech-news/meity-may-cut-compliance-timeline-for-key-dpdp-rules-to-12-months-126012201293_1.html) (news, reporting a proposal); [Legal500](https://www.legal500.com/intelligence/india/privacy/compression-of-dpdp-enforcement-timeline-proposed-by-meity) (SECONDARY).
- Business Standard also reported that the one-year log/data retention requirement might be operationalised within 90 days of amended rules being gazetted. This is a source's account, not a provision — [Business Standard](https://www.business-standard.com/technology/tech-news/meity-may-cut-compliance-timeline-for-key-dpdp-rules-to-12-months-126012201293_1.html).
- A review dated 1 Sept 2026 found no notified amendment compressing the timeline, so 13 May 2027 still stands — [dpdprules.org](https://dpdprules.org/blog/dpdp-18-months-to-12-months-proposal) (VENDOR CLAIM); [consentos.in](https://consentos.in/learn/dpdp-rules-notification-status/) (VENDOR CLAIM).
- Chambers also reports that MeitY planned to notify cross-border restrictions for SDFs — [Chambers article title](https://chambers.com/articles/meity-plans-to-cut-short-dpdp-compliance-timeline-and-notify-cross-border-restrictions-for-sdfs) (SECONDARY; page blocked, title only).

**Role and processing contract**
- Section 8(1): the Data Fiduciary is responsible for processing done on its behalf by a processor, "irrespective of any agreement to the contrary" — [King Stubb & Kasiva](https://ksandk.com/data-protection-and-data-privacy/data-processor-duties-under-indias-dpdp-act-2023/) (SECONDARY); [EY India](https://www.ey.com/en_in/insights/technology/how-data-fiduciaries-should-engage-processors-for-effective-compliance) (SECONDARY).
- Section 8(2): a fiduciary may engage a processor only under a valid contract. Explainers say the contract should cover processing activities, security safeguards, breach notification, help with Data Principal requests, sub-processors, retention and erasure — [King Stubb & Kasiva](https://ksandk.com/data-protection-and-data-privacy/data-processor-duties-under-indias-dpdp-act-2023/) (SECONDARY); [AMLegals on data processing contracts](https://amlegals.com/data-processing-contracts/) (SECONDARY).
- The DPDPA does not explicitly mention sub-processors or joint fiduciaries, though the definitions can be read to cover them — [Cyril Amarchand Mangaldas FAQs (Dec 2025)](https://www.cyrilshroff.com/wp-content/uploads/2025/12/FAQs-DPDPA.pdf) (SECONDARY).
- Processors must not appoint sub-processors without the fiduciary's authorisation. This is presented as best-practice contract drafting, not as statutory text — [King Stubb & Kasiva](https://ksandk.com/data-protection-and-data-privacy/data-processor-duties-under-indias-dpdp-act-2023/) (SECONDARY).
- Section 6(6): when consent is withdrawn, the fiduciary must make sure that both it and its processors stop processing within a reasonable time — [King Stubb & Kasiva](https://ksandk.com/data-protection-and-data-privacy/data-processor-duties-under-indias-dpdp-act-2023/) (SECONDARY).
- Under Rule 6, processor contracts must include security clauses, and processors must apply technical and organisational security measures — [Seclore](https://www.seclore.com/fundamentals/dpdp-rules-2025-compliance-guide/) (VENDOR CLAIM); [Veritect architecture](https://veritect.ai/digital-data-ai-law/dpdp-rules-2025-full-regulatory-architecture) (VENDOR CLAIM).

**Breach notification**
- There are two stages. The fiduciary first gives an intimation "without delay", then a detailed report to the Board within 72 hours, which the Board may extend on written request — [Mondaq](https://www.mondaq.com/india/data-protection/1844066/dpdp-data-breach-notification-in-india-timelines-requirements-and-key-compliance-considerations) (SECONDARY); [Bitscore](https://www.bitscore.in/tools/dpdp-commencement/breach-notification-72-hours) (VENDOR CLAIM).
- **Conflict:** Seclore says affected Data Principals must also be told within 72 hours. Mondaq and Bitscore apply the 72-hour clock only to the Board report, with principals told "without delay". I trust Mondaq/Bitscore (they match the structure of the Rule) — [Seclore](https://www.seclore.com/fundamentals/dpdp-rules-2025-compliance-guide/) vs [Mondaq](https://www.mondaq.com/india/data-protection/1844066/dpdp-data-breach-notification-in-india-timelines-requirements-and-key-compliance-considerations).
- The separate CERT-In rule to report cyber incidents within 6 hours still applies in parallel (see Q6) — [Mondaq on CERT-In](https://www.mondaq.com/india/it-and-internet/1202576/everything-you-need-to-know-about-indias-new-guidelines-related-to-cyber-incident-reporting-by-cert-in) (SECONDARY).
- No source found states a processor-to-fiduciary breach deadline in the Rules (see Gaps).

**Retention, logs and erasure**
- Personal data, associated traffic data and processing logs must be kept for at least one year after processing unless another law requires longer — [Seclore](https://www.seclore.com/fundamentals/dpdp-rules-2025-compliance-guide/) (VENDOR CLAIM); [India Briefing](https://www.india-briefing.com/news/dpdp-rules-2025-india-data-protection-law-compliance-40769.html/) (SECONDARY).
- At least 48 hours before erasing data, the fiduciary must tell the Data Principal, who can then log in or make contact to keep the purpose alive — [Lexology](https://www.lexology.com/library/detail.aspx?g=7e3af947-10aa-4712-bc1e-54179a613409) (SECONDARY).
- One source says erasure or grievance requests must be met within 90 days and cites "Rule 14". Another maps Rule 14 differently. The rule number is doubtful; check the gazette — [Seclore](https://www.seclore.com/fundamentals/dpdp-rules-2025-compliance-guide/) vs [Veritect](https://veritect.ai/digital-data-ai-law/dpdp-rules-2025-full-regulatory-architecture).
- The Rules text is mirrored as a PDF at [dpdpa.com](https://www.dpdpa.com/DPDP_Rules_2025_English_only.pdf) (unofficial mirror) and summarised by [DSCI](https://www.dsci.in/files/content/documents/2025/Digital-Personal-Data-Protection-Rules-2025.pdf) (industry body, SECONDARY).

**Consent Managers**
- Part A of the First Schedule sets a minimum net worth of ₹2 crore for a company registering as a Consent Manager — [startuptalky](https://startuptalky.com/dpdp-act-timeline-phases-2026-2027-explained/) (VENDOR CLAIM); [IIT-BHU summary PDF](https://iitbhu.ac.in/contents/institute/cf/cis/doc/dpdp_act_rules_summary.pdf) (academic summary, SECONDARY).
- Consent Manager registration (Rule 4) applies from 13 Nov 2026 — [consentos.in](https://consentos.in/learn/dpdp-rules-notification-status/) (VENDOR CLAIM).

**Applicability and penalties**
- The Act applies according to activity (digital processing of personal data), not turnover or company size, so small builders and brokers are covered — [startuptalky](https://startuptalky.com/dpdp-act-timeline-phases-2026-2027-explained/) (VENDOR CLAIM).
- Penalty ceilings in the Schedule are listed below. They are maximums the Board sets case by case, and not enforceable until the May 2027 phase — [AMLegals](https://amlegals.com/penalties-under-the-digital-personal-data-protection-act2023/) (SECONDARY); [dpdpa.com Schedule](https://dpdpa.com/theschedule.html) (unofficial mirror).
  - Up to ₹250 crore for failing to take reasonable security safeguards.
  - Up to ₹200 crore for failing to notify a breach.
  - Up to ₹200 crore for breaching children's-data duties.
  - Up to ₹150 crore for failing Significant Data Fiduciary (SDF) duties.
  - Up to ₹50 crore for anything else.
- One summary claims a cumulative cap of ₹500 crore for continuing violations. No other source confirms it — [IIT-BHU PDF](https://iitbhu.ac.in/contents/institute/cf/cis/doc/dpdp_act_rules_summary.pdf) (unverified).

**Significant Data Fiduciaries and localisation**
- The Rules add a targeted localisation obligation for SDFs (see Q6) — [Legal500 cross-border](https://www.legal500.com/intelligence/india/privacy/cross-border-data-transfers-under-indias-dpdp-act-rules-restrictions-and-compliance-roadmap-for-2027) (SECONDARY).

### Inferences
- **Role.** Golden Ratio decides nothing about why lead data is processed; it runs the CRM on the client's instructions. That makes it a **Data Processor**, and each builder or broker is the **Data Fiduciary**. However, if Golden Ratio uses client lead data for its own purposes, it risks becoming a fiduciary itself. Examples: training or improving "Golden Ratio AI" on buyer chats, cross-client analytics, or marketing to leads. LAWYER CONFIRM.
- **Consent for ad and portal leads.** Obtaining consent is the client's duty. Leads arrive through three routes, each with its own controller of the form:
  - Facebook/Google Lead Ads: the advertiser (the client) controls the form, so the client must put an itemised notice in it ("we, <builder>, will call/WhatsApp/SMS you about project X") with a privacy link.
  - Property portals (99acres, MagicBricks, Housing.com): the portal is a separate fiduciary that collected the data. The client needs contractual assurance from the portal that the buyer agreed to be contacted by that advertiser.
  - The client's own website forms: the client writes the notice.
  - MODEL KNOWLEDGE (unverified): Section 7(a) "legitimate use" may cover data a person voluntarily gives for a specified purpose ("contact me about this flat"). That could reduce reliance on formal consent for the first follow-up, but probably not for unrelated marketing. LAWYER CONFIRM.
- **What the CRM should do (vendor build items).** These turn "client must" into "product makes it easy" and are a selling point:
  - Store consent or source evidence per lead: source, form or ad ID, timestamp, notice text or version, and channel permissions (call / SMS / WhatsApp / email).
  - Provide a "withdraw consent / do not contact" flag that blocks calling, WhatsApp and SMS buttons, plus propagation to n8n flows.
  - Offer a per-lead erase action and a retention policy setting (for example, auto-purge "Lost" leads after N months), with the 48-hour pre-erasure notice email.
  - Keep a one-year access and processing log retained separately from lead deletion.
  - Provide a data export so the client can answer Data Principal access requests.
- **Processing contract (DPA) clauses, vendor to draft** (from Section 8(2) explainers):
  - Process only on the client's documented instructions.
  - Confidentiality of staff.
  - Security measures listed: per-client isolation, encryption in transit and at rest, access control, backups, logging.
  - **Breach notice to the client** within a short fixed window. I suggest 24 hours or less, so the client can meet "without delay" and the 72-hour Board report; MODEL KNOWLEDGE: also CERT-In's 6 hours.
  - A list of sub-processors with prior notice of changes: VPS host, Hostinger SMTP, n8n host, WhatsApp BSP, telephony provider, any AI API (DeepSeek/OpenAI), off-site backup provider.
  - Help with Data Principal rights and erasure.
  - Return or deletion of all data and backups at the end of the contract, with a set backup purge window.
  - Audit or information rights.
  - The one-year log retention.
  - Location of processing and backups.
  - Liability cap and indemnity. Note that Section 8(1) keeps statutory liability on the client, so the client will push contractual liability back onto the vendor. LAWYER CONFIRM the cap.
- **Significant Data Fiduciary.** No small builder or broker is likely to be notified as an SDF. The SDF regime (DPO in India, annual audit, DPIA, possible localisation) is a government notification based on volume and risk, not a fixed threshold. Low relevance.
- **Consent Managers.** Optional for clients. The CRM does not need to integrate one for launch; watch for 13 Nov 2026 registrations.
- **Checklist and dates:**
  - Now to Q1 2027 (vendor): adopt a standard DPA and privacy policy; publish a sub-processor list; build the consent, withdraw, erase and log features.
  - By **13 May 2027** (vendor): breach-response runbook live; one-year logs on; erasure workflow live.
  - By 13 May 2027 (client): notice text on all forms and ads; portal contracts covering the onward-contact permission; grievance contact published; breach response owner named; signed DPA with Golden Ratio.
  - Hedge: if MeitY's 12-month compression is notified, these dates could move to **13 Nov 2026**. Monitor the MeitY gazette monthly.

### Gaps
- The full Rules text could not be opened. Still to confirm from the gazette:
  - Rule-by-rule commencement list. MODEL KNOWLEDGE: Rules 1, 2, 17–21 immediate; Rule 4 at +12 months; Rules 3, 5–16, 22, 23 at +18 months.
  - Exact wording of Rule 7 on notifying principals.
  - Whether the Rules impose any direct processor-to-fiduciary breach deadline. I found none.
  - The Third Schedule retention periods. MODEL KNOWLEDGE: 3-year inactivity erasure only for large e-commerce, gaming and social media platforms, so it does not apply to builders.
- No law-firm source (Khaitan, Trilegal, AZB) specifically on purchased or portal leads was found. The consent analysis for portal leads is my inference; LAWYER CONFIRM.
- The status of the 12-month compression after Sept 2026 is unknown. No source dated October 2026 was found.
- No numerical SDF threshold has been published as far as the sources show.

---

## 2. TRAI / DLT: TCCCPR 2018 and 2025 amendments: what applies to real-estate sales calls and SMS

### Takeaway
Since the TCCCPR (Second Amendment) of 12 Feb 2025, commercial calls and messages may not be made from ordinary 10-digit mobile numbers. Promotional voice calls must come from the **140** series and transactional or service calls from **1600**. Senders who break this face suspension and then a one-year disconnection and blacklisting across all telecom operators. Real-estate sales calls by builders' and brokers' telecallers to leads are promotional unless the lead has given registered consent. The CRM's click-to-call from a salesperson's personal mobile is therefore a compliance risk for cold or old leads. Any telephony or SMS feature must route through a DLT-registered principal entity with 140/1600 numbers and registered headers and templates.

### Cited Findings
- TRAI amended the TCCCPR in Feb 2025: [PIB press release PRID 2102413](https://www.pib.gov.in/PressReleasePage.aspx?PRID=2102413&reg=48&lang=2) (VERIFIED, fetch blocked); [TRAI Press Release No. 11/2025 PDF](https://trai.gov.in/sites/default/files/2025-02/PR_No.11of2025.pdf) (VERIFIED, search listing); [TRAI gazette text, Regulation dated 12-02-2025](https://trai.gov.in/sites/default/files/2025-02/Regulation_12022025.pdf) (VERIFIED).
- The Second Amendment, published 12 Feb 2025, gave commercial communication a dedicated numbering series: 140 for promotional or telemarketing calls, 1600 for transactional and service calls — [rootle.ai](https://rootle.ai/blog/the-february-2025-trai-amendment-voice-ai-compliance/) (VENDOR CLAIM); [Saikrishna & Associates](https://www.saikrishnaassociates.com/strengthening-consumer-protection-by-trai-amendment-to-the-tcccpr/) (SECONDARY).
- **Conflict:** Sigma Chambers says DoT introduced a "160 series" in May 2024 for service and transactional calls. Most sources say 1600. I trust 1600, which TRAI's later clarification also uses; verify on trai.gov.in — [Sigma Chambers](https://www.sigmachambers.in/post/2025-tcccpr-amendments-a-renewed-push-by-trai-for-order-in-commercial-communications-1) (SECONDARY).
- TRAI issued a July 2026 clarification on designated promotional and transactional series. Calls from 1600 numbers may not be tagged, blocked or filtered. Calls from 140 numbers may not be tagged or filtered, but may be blocked if the customer has opted out of that sector's promotional calls through DND — [MediaNama, Jul 2026](https://www.medianama.com/2026/07/223-trai-releases-clarification-designated-promotional-transactional-number-series/) (news; page blocked, extract only).
- Commercial calls and messages may not be made from regular 10-digit numbers under the Feb 2025 amendment — [Trak.in](https://trak.in/stories/10-digit-phone-numbers-banned-for-telemarketing-calls-by-trai/) (news); [TRAI regulation](https://trai.gov.in/sites/default/files/2025-02/Regulation_12022025.pdf) (VERIFIED).
- Sender penalties: a first violation brings a 15-day suspension of outgoing services. Repeat offenders face blacklisting and disconnection of all telecom resources across all operators for one year — [Trak.in](https://trak.in/stories/10-digit-phone-numbers-banned-for-telemarketing-calls-by-trai/) (news); [frejun](https://frejun.com/trai-compliance-call-centers/) (VENDOR CLAIM).
- Fines of ₹2 lakh, ₹5 lakh and ₹10 lakh appear in sources, but one 2026 guide gives ₹1 lakh and is internally inconsistent — [frejun](https://frejun.com/trai-compliance-call-centers/) (VENDOR CLAIM, low trust). See Inference: MODEL KNOWLEDGE says these are on access providers.
- The complaint trigger was tightened from 10 complaints in 7 days to 5 complaints in 10 days. Consumers can complain about unregistered senders without first registering a DND preference — [Saikrishna & Associates](https://www.saikrishnaassociates.com/strengthening-consumer-protection-by-trai-amendment-to-the-tcccpr/) (SECONDARY); [frejun](https://frejun.com/trai-compliance-call-centers/).
- The TRAI regulation notes that onboarding senders onto the Digital Consent Acquisition (DCA) system had faced significant delays — [TRAI Regulation 12-02-2025](https://trai.gov.in/sites/default/files/2025-02/Regulation_12022025.pdf) (VERIFIED).
- A claim that explicit consent for commercial transactions lasts only 7 days is unconfirmed — [frejun](https://frejun.com/trai-compliance-call-centers/) (VENDOR CLAIM, AI-generated summary, do not rely).
- A draft Third Amendment, still under consultation, would stop call-management apps from blanket-tagging 140/1600 calls as spam. Some operators oppose it — [AA Plus Consultants](https://www.aaplusconsultants.com/article-tcccpr-third-amendment.html) (SECONDARY); [ORF](https://www.orfonline.org/expert-speak/more-than-spam-what-trai-s-latest-proposal-means-for-digital-regulation) (think tank).
- The TCCCPR also applies to AI or automated voice calls — [qcall.ai](https://qcall.ai/trai-updates-for-ai-calling) (VENDOR CLAIM); [caller.digital](https://caller.digital/blog/ai-cold-calling-india-trai-compliant-2026) (VENDOR CLAIM).

### Inferences
- **Which calls are which.** A real-estate telecaller ringing a lead about a project is promotional (140) unless it falls under a service or transactional category. MODEL KNOWLEDGE (unverified): calls to an existing customer about their own booking or payment, or calls made with DCA-registered consent, can be service calls. A follow-up to a fresh lead who asked for a callback sits in a grey zone. The defensible route is registered consent, or a 140 number with a DND scrub. LAWYER CONFIRM.
- **Personal mobiles.** Salespeople calling one-to-one from personal mobiles is widespread. Enforcement keys on complaints and calling patterns: high volume and short calls trigger operator UCC detection. MODEL KNOWLEDGE: operators run analytics that flag "unregistered telemarketers" (UTMs) using 10-digit SIMs. A builder whose staff dial hundreds of leads a day risks SIM disconnection. The CRM should warn admins about this and not market itself as a bulk-dialer on personal SIMs.
- **DND category.** MODEL KNOWLEDGE (unverified): real estate is one of the TCCCPR preference categories (category 2 in the 2018 schedule). Leads on full DND, or who blocked "real estate", must not get promotional calls or SMS without consent.
- **Who pays the ₹2 lakh / 5 lakh / 10 lakh.** MODEL KNOWLEDGE (unverified): these amounts are "financial disincentives" on access providers (telcos) for misreporting UCC, not fines on senders. Senders face resource suspension and blacklisting. Sources conflict, so verify.
- **SMS rules.** MODEL KNOWLEDGE (unverified):
  - Every commercial SMS needs a DLT-registered entity ID (PEID), header and content template, with a header suffix (-P promotional, -S service, -T transactional, -G government) introduced by the 2025 amendment.
  - URLs, APKs and call-back numbers in SMS must be whitelisted on DLT (TRAI direction, Oct 2024).
- **Vendor checklist, before launching the telephony and SMS features:**
  - Use only DLT-compliant CPaaS or telephony providers (Exotel, Knowlarity, MyOperator, Plivo-India, etc.).
  - Have **each client register as principal entity** on DLT, in its own name and GSTIN, and get 140/1600 numbers through the provider.
  - Store per-lead channel consent and DND status.
  - Block "promotional" call or SMS actions for leads without consent who are on DND.
  - Log call purpose (promo vs service).
  - Never send commercial SMS through a generic SMS gateway under Golden Ratio's own header for multiple clients.
- **Client checklist, now (rules in force since Feb–Mar 2025):** register on DLT; route bulk calling through 140 numbers; collect consent at lead capture; honour DND; train telecallers not to cold-call from personal SIMs at volume.

### Gaps
- Could not open the TRAI regulation or the July 2026 clarification. Not confirmed: exact commencement dates of each clause (MODEL KNOWLEDGE: most 30 days, some 60/90 days after 12 Feb 2025), exact sender penalties, and header suffix rules.
- No real-estate-specific TRAI rule found.
- Status of the Third Amendment (final or draft) as of Oct 2026 is unknown.
- Whether a callback within X days of an enquiry counts as "service" is unclear in the sources. LAWYER CONFIRM.

---

## 3. WhatsApp Business policy for real estate: opt-in, template categories, quality, tiers, restrictions, 2025–26 changes

### Takeaway
Real estate is allowed on WhatsApp Business Platform. The binding constraints are four:
- **Opt-in:** explicit, WhatsApp-specific, naming the business.
- **Template categories:** Meta classifies templates as marketing, utility or authentication, can re-categorise them, and charges marketing the most.
- **Adaptive per-user marketing caps:** WhatsApp limits how many marketing templates a user gets from all businesses.
- **Quality-based tiers:** 250 → 2,000 → 10,000 → 100,000 → unlimited, now set per business portfolio, not per number.

Recent changes: portfolio-level limits (Oct 2025); a ban on general-purpose AI assistants, while purpose-built bots stay allowed; and, from **1 Oct 2026**, billable non-template service messages beyond 1,000 free per number per month. MahaRERA's ad rules (Q4) explicitly cover WhatsApp messages, so marketing templates for Maharashtra projects need the RERA number, website and QR code.

### Cited Findings
- WhatsApp may limit how many marketing template messages a user receives from any business in a given period. The limit is adaptive, based on the user's recent read rate and how full their inbox is — [Meta developer docs: per-user marketing template limits](https://developers.facebook.com/documentation/business-messaging/whatsapp/templates/marketing-templates/per-user-limits/) (VERIFIED).
- About 2 marketing templates per user per day across all businesses is a third-party estimate, not an official number. Marketing sent inside an open 24-hour service window does not count — [payperwa](https://payperwa.com/blog/whatsapp-marketing-message-limits-frequency-cap-2026) (VENDOR CLAIM); [chatarmin](https://chatarmin.com/en/blog/whats-app-messaging-limits) (VENDOR CLAIM).
- Utility and authentication messages are exempt from the per-user marketing cap — [payperwa](https://payperwa.com/blog/whatsapp-marketing-message-limits-frequency-cap-2026) (VENDOR CLAIM).
- Messaging tiers are 250 / 2,000 / 10,000 / 100,000 / unlimited unique users per 24 hours. To move from 250 to 2,000, a business can verify, have its onboarding partner verify it, or deliver 2,000 template messages to unique users outside service windows within 30 days using high-quality templates — [AiSensy](https://m.aisensy.com/blog/whatsapp-message-limits-guide/) (VENDOR CLAIM); [uptail](https://www.uptail.ai/blog/whatsapp-business-message-limits-2026-broadcast-caps-tier-progression-what-happens-when-you-hit-the-ceiling) (VENDOR CLAIM).
- Blueticks lists 1,000 for Tier 1, which matches older material; newer sources use 2,000 — [Blueticks](https://blueticks.co/blog/whatsapp-business-api-pricing-2026) (VENDOR CLAIM, likely outdated).
- Since Oct 2025, messaging limits are set at the business-portfolio level, and all numbers in a portfolio share the highest achieved limit — [AiSensy](https://m.aisensy.com/blog/whatsapp-message-limits-guide/) (VENDOR CLAIM); [Blueticks](https://blueticks.co/blog/whatsapp-business-api-pricing-2026) (VENDOR CLAIM).
- Quality rating and status, from Meta's help page:
  - "Restricted" means the number reached its messaging limit and cannot send outgoing messages for 24 hours, though it can still reply to customer-initiated chats.
  - "Flagged" is triggered by a Low quality rating. Tier upgrades are blocked while flagged, and if quality does not recover within 7 days the limit drops one tier.
  - Source: [Meta Business Help: quality rating](https://www.facebook.com/business/help/896873687365001) (VERIFIED).
- A block rate of roughly 2–3% or more lowers the quality rating — [getkanal](https://getkanal.com/blog/whatsapp-business-quality-rating-explained) / [leapstream](https://leapstream.in/blog/whatsapp-quality-rating-and-messaging-limits) (VENDOR CLAIM, single-source figure).
- **Conflict:** one guide says Green or Yellow quality is enough for automatic scaling. Another says Yellow freezes progression — [AiSensy](https://m.aisensy.com/blog/whatsapp-message-limits-guide/) vs [uptail](https://www.uptail.ai/blog/whatsapp-business-message-limits-2026-broadcast-caps-tier-progression-what-happens-when-you-hit-the-ceiling). Unresolved; Meta docs needed.
- Opt-in: a business may not message anyone who has not explicitly opted in to receive messages from it on WhatsApp specifically — [customer.io](https://customer.io/learn/mobile-marketing/whatsapp-best-practices) (VENDOR CLAIM, paraphrasing Meta policy).
- Pricing and policy changes from 1 Oct 2026:
  - Non-template replies inside the 24-hour service window become billable, with 1,000 free service messages per number per month that do not roll over.
  - Utility templates sent inside an open window, previously free, are charged per message.
  - Meta may reclassify utility templates as marketing, which costs more.
  - Sources: [Zendesk announcement](https://support.zendesk.com/hc/en-us/articles/11113277351322-Announcing-upcoming-changes-to-WhatsApp-Business-messaging-pricing) (VENDOR CLAIM, BSP passing on Meta notice); [eesel](https://www.eesel.ai/blog/whatsapp-business-api-latest-pricing-and-policy-changes) (VENDOR CLAIM); [wawcd](https://wawcd.com/blog/whatsapp-pricing-change-october-2026) (VENDOR CLAIM).
- India marketing rates conflict: about ₹0.8631 per message (Blueticks, citing a roughly 10% rise from ₹0.7846) vs ₹1.09 per message (AiSensy, which may include BSP markup) — [Blueticks](https://blueticks.co/blog/whatsapp-business-pricing-marketing-messages-2026) vs [AiSensy pricing](https://aisensy.com/pricing) (both VENDOR CLAIM; check Meta's rate card).
- Eligible businesses must move all WhatsApp Business Accounts in a portfolio to INR billing by 31 Dec 2026 — [AiSensy / search extract](https://aisensy.com/pricing) (VENDOR CLAIM).
- WhatsApp changed its terms (reported Oct 2025) to bar general-purpose chatbots. Purpose-built bots for support, booking and similar remain allowed. Automation inside the 24-hour window must offer a clear escalation to a human — [TechCrunch, 18 Oct 2025](https://techcrunch.com/2025/10/18/whatssapp-changes-its-terms-to-bar-general-purpose-chatbots-from-its-platform) (news); [upperfloor](https://upperfloor.ai/en/blog/meta-policy-ai-agents) (VENDOR CLAIM).
- In June 2026 the European Commission ordered Meta, as an interim measure, to restore access for rival general-purpose AI assistants in the EEA only. No effect in India — [eesel](https://www.eesel.ai/blog/whatsapp-business-api-latest-pricing-and-policy-changes) (VENDOR CLAIM).

### Inferences
- **Product design.** A "project AI assistant answering from the builder's brochure" is purpose-built and fits the policy. It must stay on-topic, give an option to reach a human, and not act as a general chatbot.
- **Opt-in capture (vendor).** Add a WhatsApp opt-in checkbox or text to lead forms, and record WhatsApp opt-in per lead (source, time, wording). Click-to-WhatsApp ads are user-initiated, which opens a service window.
- **Bulk marketing to old leads.** Bulk marketing templates to old or bought lead lists is the most common way real-estate numbers get flagged: high blocks, low reads, then quality Low, then a tier downgrade. Mitigations for the CRM: per-lead frequency caps; send only to leads with engagement in the last N days; an opt-out keyword that sets "do not contact"; and a separate WhatsApp number or portfolio per client. The white-label model already implies **each client owns its own WABA** under its own Meta Business verification. Do not run multiple builders through one Golden Ratio number.
- **Cost model after 1 Oct 2026.** Utility templates for visit reminders and booking or payment updates are cheaper than marketing, but Meta reclassifies "promotional-sounding" utility templates. Keep reminder templates strictly transactional.
- **RERA overlap.** For MahaRERA projects, marketing templates that promote a project should carry the RERA registration number, the MahaRERA website and a QR code image, because Order 46C/2025 explicitly covers WhatsApp (see Q4). Otherwise the client risks a ₹10k–50k penalty per violation.
- **Checklist:**
  - Before shipping WhatsApp API (vendor): pick a BSP or the Cloud API; each client completes Meta Business verification and owns its WABA; template library pre-categorised; opt-in fields; opt-out handling; RERA fields auto-inserted in marketing templates.
  - Ongoing (client): only message opted-in leads; monitor quality rating.

### Gaps
- Could not open Meta's WhatsApp Business Messaging Policy or Commerce Policy to confirm the exact opt-in wording, or whether real estate has any restricted-industry conditions. MODEL KNOWLEDGE: real estate is not in the prohibited list.
- No official confirmation of an India-specific per-user marketing cap. The cap appears to be global and adaptive.
- Official Meta India rate card for Oct 2026 not retrieved.
- The exact current quality and tier-upgrade rules conflict across sources.

---

## 4. RERA: ads and communications, record-keeping, MahaRERA vs other states, agents

### Takeaway
Under RERA Section 11(2), every advertisement of a registered project must show its RERA registration number and the authority's website. Registered agents must also quote their own agent registration number. MahaRERA goes furthest. Order 46C/2025 (8 April 2025) requires:
- the project registration number and MahaRERA website in a font at least as large as the largest contact-details font;
- a project QR code in the top-right corner;
- coverage of all media, **explicitly including social media, WhatsApp and other messaging platforms**;
- penalties of ₹10,000–₹50,000 per violation.

UP RERA has required QR codes on ads and brochures for new projects since 18 July 2024. For Karnataka, Telangana and Haryana I found no QR-code mandate. The CRM's project record (it already stores the RERA number) should hold the project number, QR image and agent number, and auto-insert them in outgoing marketing.

### Cited Findings
- Section 11(2) of RERA requires advertisements to show the project's RERA registration number and the authority's website. Agents must show their own registration number, and sub-brokers and franchisees each need their own registration — [insomniacs](https://insomniacs.in/blog/rera-advertising-rules-real-estate-india/) (VENDOR CLAIM, marketing agency); [calcguru](https://calcguru.in/how-to-start-a-real-estate-agency-in-india/) (VENDOR CLAIM).
- MahaRERA Order 46C/2025 (8 April 2025) applies to promoters and registered agents:
  - registration number and website address in a font equal to or larger than the largest font used for contact details or address;
  - QR code and details in the top-right corner;
  - covers newspapers, leaflets, booklets, electronic media, banners, hoardings, social media, WhatsApp and other messaging platforms;
  - penalty ₹10,000–₹50,000 per violation.
  - Sources: [Complinity legal update](https://complinity.com/legal-update/maharashtra-real-estate-regulatory-authority-maharera-issues-order-regarding-the-mandatory-display-of-qr-code-font-size-specifications-for-maharera-registration-number-and-website-address-in-advertisements-18613/) (SECONDARY); [The Realty Today](https://www.therealtytoday.com/news/maharera-makes-qr-code-registration-number-mandatory-in-ads-50000-penalty-for-violations/) (news); [Pune Pulse](https://www.mypunepulse.com/maharera-enforces-strict-rules-for-real-estate-ads-%E2%82%B950000-fine-for-not-displaying-qr-code-registration-number-prominently/) (news).
- Earlier MahaRERA Orders 46/2023 and 46B/2023 introduced the QR code, which must be legible, readable and scannable. One source gives 1 Aug 2023 as the effective date for project ads. These orders are **older than 18 months** but were superseded or extended by 46C/2025 — [REMI blog](https://www.remi.edu.in/blog/mahareras-qr-code-mandate/) (SECONDARY); [Square Feat India](https://squarefeatindia.com/maharera-mandates-prominent-display-of-project-details-in-advertisements-warns-of-penalties/) (news).
- MahaRERA suo motu Case No. 119 of 2024 concerned an agent's Instagram ad. The authority held the agent must state the agent registration number along with the project registration number and QR code. It cited the duty for agents to quote their registration number in all documents relating to advertisement, marketing, selling or purchase — [MahaRERA final order AdvFO119of2024.pdf](https://maharera.maharashtra.gov.in/sites/default/files/final_order_document/AdvFO119of2024.pdf) (VERIFIED). The order is from 2024, roughly 18+ months old, but still the cited precedent.
- MahaRERA agent registration has mandatory training and certification, plus QR rules — [Thane Real Estate News, 2025](https://thanerealestatenews.com/maharera-real-estate-agent-registration-training-qr-code-rules-2025/) (news; title-level only); [Ofin Legal](https://ofinlegal.com/maharera-agent-registration/) (SECONDARY).
- UP RERA: from 18 July 2024 every newly registered project gets a unique QR code, to be displayed on brochures, ads, booking forms, allotment letters and builder-buyer agreements. Agents can be verified in the "Registered Agents" section of the UP RERA site — [expressbuildersltd UP RERA guide](https://expressbuildersltd.com/blog/rera-up-website-guide/) (VENDOR CLAIM, developer blog). Older than 18 months; verify with UP RERA.
- The Telangana RERA portal lists agent registration and guidelines and carries an advertisement alert, but no QR rule was found — [rera.telangana.gov.in](https://rera.telangana.gov.in/) (VERIFIED, portal).
- Buyers can verify a project from any MahaRERA ad by scanning its QR — [propnewz, 19 Sept 2026](https://www.propnewz.com/blog/mumbai-maharera-qr-code-verify-project-buyer-2026-09-19) (news).

### Inferences
- **Ad rules reach messages.** MahaRERA treats WhatsApp messages and social posts as "advertisements". So the CRM's planned bulk WhatsApp, email campaigns and any brochure the AI assistant shares are ads for a Maharashtra project. The client is liable, as promoter or agent. Order 46C/2025 is about advertisements, not one-to-one service messages; whether a one-to-one follow-up counts as an ad is unclear. LAWYER CONFIRM.
- **Vendor build items:**
  - Project record fields: RERA registration number (exists), state authority, authority website, QR code image upload, and validity or expiry date.
  - Agent RERA number field for broker clients (company and each salesperson if the state requires individual registration).
  - Auto-footer on every marketing email or WhatsApp template.
  - A block or warning if a project has no RERA number or its registration has lapsed. RERA Section 3 forbids advertising unregistered projects; MODEL KNOWLEDGE, small projects under 500 sq m or 8 units are exempt.
- **Record-keeping.** MODEL KNOWLEDGE (unverified): RERA Section 10 requires agents to maintain books of accounts, records and documents as prescribed by state rules (MahaRERA rules specify these). A broker CRM that holds booking, commission and visit records helps here. Retention periods under state rules should be checked, since they may override DPDP "erase when purpose served" for booked customers (DPDP allows retention required by law).
- **Checklist:**
  - Vendor, before the bulk-messaging launch: RERA fields, footer and QR insertion in all templates; per-state configuration.
  - Client, now (in force): ensure every ad and message about a Maharashtra project meets 46C/2025; brokers register as agents and quote the agent number.

### Gaps
- Karnataka (K-RERA), Telangana, Haryana (H-RERA Gurugram and Panchkula) advertisement specifics: no QR mandate found, and sources were too thin to say what each requires beyond Section 11(2).
- Primary text of Order 46C/2025 not opened. Not confirmed: whether it applies to all ongoing projects or only new ads, and whether it applies to one-to-one messages.
- Sections 9 and 10 (agent registration and duties) not covered by any fetched source. Statements above about them are MODEL KNOWLEDGE.
- No RERA rule found that imposes CRM-specific data or record retention periods.

---

## 5. GST, e-invoicing and TDS on SaaS sold to Indian businesses; equalisation levy

### Takeaway
- **GST:** domestic B2B SaaS attracts **18% GST**, usually under SAC 9983 (998314 IT design and development, 998315 hosting and IT infrastructure, 998313 IT consulting). Pick the code that matches the service.
- **Registration:** MODEL KNOWLEDGE (unverified): for a Pune (Maharashtra) service provider the threshold is ₹20 lakh aggregate turnover. Registering voluntarily is commercially useful because B2B builders want input tax credit.
- **E-invoicing:** mandatory only above **₹5 crore** aggregate turnover. The 30-day IRN reporting limit applies at ₹10 crore and above.
- **TDS:** the Income-tax Act, 2025 replaced the 1961 Act from **1 April 2026**; TDS now sits in **Section 393**. The old Section 194J logic (2% for technical services, 10% for professional services or royalty; threshold raised to ₹50,000 from FY 2025-26) maps into Section 393 tables. Whether a SaaS subscription is "technical services", "royalty" or not covered at all is still debated; get a CA opinion. Section 194Q (purchase of goods) does not apply.
- **Equalisation levy:** fully gone. The 2% e-commerce levy ended from 1 Aug 2024 and the 6% online-advertising levy from 1 Apr 2025.

### Cited Findings
- SAC 998314 covers IT design and development, including building a SaaS platform, at 18% GST for domestic supply. 998313 is IT consulting and support. Subscriptions or hosting may fall under SAC 9983 generally, so match the code to the actual service — [PayGlocal](https://payglocal.in/blog/web-development-sac-code-gst) (VENDOR CLAIM); [Xflow](https://www.xflowpay.com/blog/gst-on-software-services) (VENDOR CLAIM).
- E-invoicing threshold is ₹5 crore aggregate annual turnover, in force since 1 Aug 2023. Turnover is counted across all GSTINs under one PAN. Once crossed, the obligation applies from the next financial year and continues even if turnover falls — [startuptalky](https://startuptalky.com/e-invoice-limit-gst-india-guide/) (VENDOR CLAIM); [SMFG India Credit](https://www.smfgindiacredit.com/knowledge-center/what-is-e-invoice-in-gst.aspx) (SECONDARY). The 2023 date is older than 18 months, but sources say it is still current in 2026.
- The 30-day IRN upload limit applies to taxpayers with aggregate turnover of ₹10 crore or more from 1 Apr 2025, per a GSTN advisory of 5 Nov 2024 — [Sansa Legal, Apr 2026](https://www.sansalegal.com/post/gst-e-invoicing-april-2026-rs-5-crore-threshold-and-new-compliance-rules) (SECONDARY); [taxbuddy](https://www.taxbuddy.com/blog/what-is-the-e-invoice-limit) (VENDOR CLAIM).
- Section 194J threshold rose to ₹50,000 from FY 2025-26 (one older source still says ₹30,000). TDS is generally 2% for fees for technical services and 10% for professional services or royalty — [Keka](https://www.keka.com/section-194j-tds) (VENDOR CLAIM); [eDarpan](https://www.edarpan.com/blog/tds-software-saas-payments-india) (VENDOR CLAIM).
- **Conflict:** a CA forum thread says TDS on SAC 998314 is 10% under Section 194J — [CAclubindia](https://www.caclubindia.com/experts/tds-on-sac-code-998314-it-design-devlopment-service-2860169.asp) (USER REPORT). Practitioners also debate classifying SaaS as FTS (194J) or rent (194I) — [MS Associates](https://www.msassociates.pro/articles/tds-on-software-subscription-and-cloud-hosting-services/) (SECONDARY).
- Section 393 of the Income-tax Act, 2025 is the consolidated TDS provision for non-salary payments, effective 1 April 2026. Its tables cover contractor, professional and technical payments, so the old 194J/194C categories now sit there. Old Section 195 (payments to non-residents) is Section 393(2), Table S. No. 17, with no threshold, which covers paying for foreign SaaS such as OpenAI or Meta — [India Briefing](https://india-briefing.com/news/section-393-income-tax-act-2025-tds-rules-rates-compliance-guide-44450.html/) (SECONDARY); [ClearTax](https://cleartax.in/s/section-393-of-income-tax-act) (VENDOR CLAIM); [TaxGuru](https://taxguru.in/?p=1044146) (SECONDARY); [taxgarden](https://taxgarden.in/blog/tds-on-non-residents-section-195-393-guide-india-fy-2026-27) (VENDOR CLAIM).
- The 6% equalisation levy on online advertising was abolished by the Finance Act 2025 (assent 29 Mar 2025), effective 1 April 2025. The 2% e-commerce levy was withdrawn from 1 Aug 2024 — [Digital Policy Alert](https://digitalpolicyalert.org/event/28853-finance-bill-2025-no-7-including-abolition-of-equalisation-levy-on-digital-advertisement-services-entered-into-force) (SECONDARY tracker); [TaxGuru](https://taxguru.in/income-tax/equalisation-levy-complete-journey-inception-abolition-new-tax-regime.html) (SECONDARY); [IndiaFilings](https://www.indiafilings.com/income-tax/equalisation-levy-abolished) (VENDOR CLAIM).
- **Conflict:** one source attributes the 6% repeal to "Finance (No. 2) Act 2024". Most say Finance Act 2025, which I trust — [Xflow](https://www.xflowpay.com/blog/equalisation-levy). After abolition, payments to foreign ad platforms may be examined as royalty under the DTAA through the old Section 195 route — [The Executive Centre](https://www.executivecentre.com/blog-article/what-is-equalisation-levy-india/) (VENDOR CLAIM).

### Inferences
- **Invoicing set-up (vendor, now):**
  - Register for GST if turnover is near or above ₹20 lakh, or voluntarily. B2B builders and brokers prefer a GST invoice for ITC, so voluntary registration helps sales.
  - Charge 18% CGST+SGST for Maharashtra clients and IGST for other states.
  - Show SAC on invoices. 998315 (hosting and IT infrastructure provisioning) arguably fits per-client hosted SaaS, and 998314 fits the one-time setup fee. CA CONFIRM.
  - No e-invoicing until turnover passes ₹5 crore.
- **TDS (client and vendor).** Clients paying more than ₹50,000 a year (Starter at ₹3,999×12 = ₹47,988 is just under; Growth or Pro plus setup is over) may deduct TDS, likely at 2% (FTS) or 10% (if treated as royalty or professional). From FY 2026-27, deductions are under Section 393, Form 26AS/AIS credits.
  - The vendor should state the expected TDS treatment on invoices and quotes, and file for TDS credit.
  - Plan cash flow for 2–10% withholding.
  - Section 194Q is irrelevant: it covers purchases of goods by buyers with over ₹10 crore turnover.
  - Section 194C (1%/2%) may be applied by some clients for "contract work" such as ad management services the agency also sells.
  - CA CONFIRM.
- **Equalisation levy.** Not applicable to anything Golden Ratio buys or sells. However, TDS under Section 393(2) / DTAA may apply when Golden Ratio pays foreign SaaS or AI APIs (OpenAI, DeepSeek, a foreign VPS). Many small firms ignore this. CA CONFIRM.

### Gaps
- No CBIC or CBDT primary page was opened. Rates and SACs come from vendor and forum sources.
- The GST registration threshold (₹20 lakh services, Maharashtra) was not confirmed in this session; MODEL KNOWLEDGE.
- Whether GST 2.0 rate rationalisation (Sept 2025) changed anything for IT services: MODEL KNOWLEDGE says no, IT services remain 18%. Not verified.
- The exact Section 393 table serial numbers and rates for domestic FTS, royalty and contract payments in FY 2026-27 were not found.
- Brief mentioned SAC 997331 (licensing of software): not covered by any source found this session.

---

## 6. Data localisation: DPDP cross-border, sector rules, foreign backups and foreign AI APIs (DeepSeek, OpenAI)

### Takeaway
No law requires a real-estate CRM's lead data to be stored in India. DPDP Section 16 is a **negative-list** model: transfers abroad are allowed unless the government notifies a restricted country, and no country had been notified as of mid-2026. Sector rules such as RBI payment-data localisation do not apply to real-estate sales data. The DPDP Rules add a possible localisation duty only for Significant Data Fiduciaries. The practical India-specific constraints are two:
- **CERT-In Directions (28 Apr 2022):** report incidents within 6 hours; keep ICT logs for a rolling 180 days within Indian jurisdiction. VPS and cloud providers must keep subscriber KYC for 5 years.
- **Fiduciary accountability:** the client stays responsible wherever data goes, so it will want disclosure of every foreign sub-processor. That includes foreign backup storage and AI APIs, and DeepSeek in particular, because a future Section 16 notification restricting a country would immediately bite.

### Cited Findings
- Section 16: personal data may be transferred outside India by default unless the Central Government restricts a specified country or territory by notification — [dpdpactindia.in, Section 16](https://dpdpactindia.in/dpdp-act/section-16/) (unofficial Act mirror); [Taxmann](https://www.taxmann.com/post/blog/cross-border-data-transfers-under-the-dpdp-act/) (SECONDARY).
- As of mid-2026 no restricted-country list had been notified. Rule 15's transfer conditions apply from 13 May 2027 — [Legal500](https://www.legal500.com/intelligence/india/privacy/cross-border-data-transfers-under-indias-dpdp-act-rules-restrictions-and-compliance-roadmap-for-2027) (SECONDARY); [complydp](https://www.complydp.com/articles/dpdp-cross-border-data-transfer-rules) (VENDOR CLAIM).
- Section 16(2) keeps stricter sector laws in force, for example RBI payment-data storage. A transfer the Act allows can still be blocked by a sector regulator — [King Stubb & Kasiva](https://ksandk.com/data-protection-and-data-privacy/indias-new-cross-border-data-transfer-framework/) (SECONDARY); [TCSA](https://www.tcsa.in/frameworks/dpdp/cross-border-transfer) (VENDOR CLAIM).
- The Rules add conditions where data could be made available to a foreign State, plus targeted localisation for SDFs — [Legal500](https://www.legal500.com/intelligence/india/privacy/cross-border-data-transfers-under-indias-dpdp-act-rules-restrictions-and-compliance-roadmap-for-2027) (SECONDARY).
- MeitY reportedly planned to notify cross-border restrictions for SDFs — [Chambers](https://chambers.com/articles/meity-plans-to-cut-short-dpdp-compliance-timeline-and-notify-cross-border-restrictions-for-sdfs) (SECONDARY, title only).
- The fiduciary remains accountable for every DPDP obligation wherever the data is processed — [complydp](https://www.complydp.com/articles/dpdp-cross-border-data-transfer-rules) (VENDOR CLAIM).
- CERT-In Directions of 28 Apr 2022 apply to service providers, intermediaries, data centres and body corporates:
  - report cyber incidents within 6 hours of noticing them;
  - enable logs of all ICT systems and keep them securely for a rolling 180 days within Indian jurisdiction, providing them to CERT-In on request;
  - data centre, VPS, cloud and VPN providers must record validated subscriber names, hire period and allotted IPs for 5 years;
  - coverage includes systems hosted by third parties and cloud providers.
  - Sources: [Mondaq](https://www.mondaq.com/india/it-and-internet/1202576/everything-you-need-to-know-about-indias-new-guidelines-related-to-cyber-incident-reporting-by-cert-in) (SECONDARY); [TaxGuru](https://taxguru.in/corporate-law/cert-in-issues-directions-relating-information-security-practices.html) (SECONDARY); [Nishith Desai](https://www.nishithdesai.com/default.aspx?id=5507) (SECONDARY); [KPMG](https://assets.kpmg.com/content/dam/kpmg/in/pdf/2022/07/cyber-security-incident-response.pdf) (SECONDARY). All **older than 18 months** (2022), but the Directions remain in force per the 2025–26 DPDP commentary ([Mondaq DPDP breach](https://www.mondaq.com/india/data-protection/1844066/dpdp-data-breach-notification-in-india-timelines-requirements-and-key-compliance-considerations)).
- **Conflict:** effective date was 27 June 2022, or extended to 25 Sept 2022 for MSMEs and some VPS providers. Either way, long in force — [Mondaq UK](https://mondaq.co.uk/india/it-and-internet/1270332/6-hours-to-report-cyber-incidents-to-cert-in) vs [lawrbit](https://lawrbit.com/?p=3939).

### Inferences
- **India-hosted VPS.** If the VPS is outside India, the "180 days within Indian jurisdiction" log rule is the main tension. MODEL KNOWLEDGE (unverified): CERT-In's May 2022 FAQs said logs may be stored outside India provided they can be produced to CERT-In within a reasonable time. Simplest compliant path: host the VPS in an Indian region (Mumbai, Pune, Bangalore DC), which is also a strong sales message ("your data stays in India"). Keep off-site backups encrypted, preferably also in India. A foreign backup bucket (for example, an EU or US region) is legally allowed under DPDP today but must be disclosed as a sub-processor.
- **Foreign AI APIs.** Sending buyer names, phones or chats to OpenAI or DeepSeek is a cross-border transfer and a sub-processing. It is legal today, but:
  - list it in the DPA;
  - minimise or strip PII before sending (answer brochure questions without the buyer's phone or name);
  - choose providers with no-training and zero-retention terms;
  - for DeepSeek (data processed in China), flag the specific risk that China is the most likely candidate for a future Section 16 restriction. MODEL KNOWLEDGE: Indian government bodies have issued internal advisories against using DeepSeek and ChatGPT on official devices.
  - Offer clients an "AI off" or India-hosted model option. LAWYER CONFIRM.
- **Checklist:**
  - Vendor, now: confirm the VPS region; enable and retain 180-day system and app logs; write a CERT-In 6-hour incident procedure (report to incident@cert-in.org.in, MODEL KNOWLEDGE); publish the sub-processor list with countries; PII minimisation for AI calls.
  - Vendor, by 13 May 2027: re-check any Rule 15 / Section 16 notifications.
  - Client: approve the sub-processor list in the DPA.

### Gaps
- No Section 16 negative-list notification found; status as of Oct 2026 not confirmed beyond "mid-2026".
- CERT-In FAQ position on storing logs outside India not confirmed this session.
- Not found: DeepSeek or OpenAI data residency and retention terms for Indian API customers (outside this session's sources), and any Indian advisory specifically about DeepSeek for private businesses.
- No sector rule specific to real estate data localisation found. I infer none exists, but did not confirm with a primary source.
