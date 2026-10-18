# Competitor groups 2, 3 and 4: India SMB sales CRMs, WhatsApp-first tools, global and open-source real-estate CRMs

**Read this first (method and limits, 2026-10-18)**
- **Access date for every source below: 2026-10-18.**
- **FX rate: USD 1 = ₹94.92.** This was the rupee's close on Fri 16 Oct 2026 (18 Oct is a Sunday), per [Telangana Today](https://telanganatoday.com/rupee-rises-for-sixth-straight-session-closes-at-94-92-against-dollar) and [Daily Pioneer](https://dailypioneer.com/amp/story/business/rupee-rises-7-paise-to-close-at-9492-against-us-dollar). The day before, the rupee closed at 94.99.
- **All ₹ figures exclude 18% GST** unless stated.
- **Tool limits in this session:**
  - WebFetch failed with DNS errors on every vendor site.
  - curl through the proxy got "403 CONNECT rejected" (e.g. telecrm.in).
  - The Wayback Machine was blocked ("unable to fetch from web.archive.org").
  - Every number below therefore comes from **web-search summaries of the cited pages**. I could not open any pricing page directly. The brief says "a search snippet is not a source", so treat every price as needing a 5-minute check on the live page before it goes into the final matrix.
  - The shared search budget (200 calls across all agents) ran out partway through Group 4. As a result, **reviews (G2/Capterra/Play counts), funding, and most feature columns (mobile, AI, reports, export) were NOT researched.** They are listed under Gaps.
- **Tags used:**
  - **VERIFIED\***: the figure comes from the vendor's own pricing or docs page as indexed by search (the asterisk means "not opened directly").
  - **VENDOR CLAIM**: vendor marketing, blogs or case studies.
  - **THIRD-PARTY**: aggregators, reseller sites, or blogs by rival vendors (flagged as biased where relevant).
  - **USER REPORT**: reviews.
  - **ESTIMATE**: my own arithmetic or assumption.
- **Bias warning:** several INR price "audits" come from rival vendors' blogs: CodingClave (itself a Group 1 real-estate CRM), RichAutomate, ChatMitra, Mark360, MSG91, Heltar, and Zoko (writing about others). Use them for dates and price-change signals, not as neutral truth.

---

## Q1. Exact India (₹) prices for 5 and 15 users; annual vs monthly; are WhatsApp and telephony extra?

### Takeaway
- **Per-company flat pricing in India.** It already exists at three anchors:
  - Kylas Elevate: ₹12,999/month, unlimited users.
  - Bitrix24 India: ₹1,910/month for 5 users (Basic) or ₹4,790/month for 50 users (Standard), annual.
  - NeoDove: about ₹1,500–2,083/month for 10–20 users, annual, if its pricing page means per team.
- **Per-user tools.** They land at about ₹2,000–4,000/month for 5 users (Zoho Bigin, TeleCRM, HubSpot India Starter, Odoo Standard, Freshsales Growth) and ₹6,000–12,000/month for 15 users.
- **WhatsApp and telephony.**
  - WhatsApp API messaging is extra almost everywhere: Meta's per-message fees are always passed through.
  - Calling is "included" mainly in the SIM-based Indian tools (TeleCRM, NeoDove, Callyzer).
  - Virtual numbers, IVR and VoIP are extra (e.g. NeoDove).
- **WhatsApp-first tools (Group 3).** They charge ₹1,000–10,000/month per account, plus extra seats and per-message fees.
- **Global real-estate CRMs (Group 4).** They cost ₹27,000–95,000/month for 5–15 users, so they are 5–20× the seller's price band. They are feature references, not price competitors.

### Cited Findings

**Group 2: India SMB sales CRMs**

| Product (pricing link) | Price model | 5 users ₹/mo | 15 users ₹/mo | Billing / contract | WhatsApp / telephony extra? | Tag |
|---|---|---|---|---|---|---|
| [TeleCRM](https://telecrm.in/leadsquared-alternative) | Per user | ₹3,995 (annual, ₹799/user); ₹5,495 (quarterly, ₹1,099/user) | ₹11,985 (annual); ₹16,485 (quarterly) | Annual or quarterly. Vendor says "no setup fee, no lock-in contract" | Vendor's comparison page says calling, WhatsApp and automation are included. Vendor blog says **WhatsApp chat sync is a paid add-on** (price not found). This conflict is unresolved. | VERIFIED\* / VENDOR CLAIM ([telecrm.in LSQ-alternative](https://telecrm.in/leadsquared-alternative), [TeleCRM blog](https://telecrm.in/blog/crm-software-examples/), [Capterra India](https://www.capterra.in/software/213134/telecrm)). The [Zoftwarehub](https://zoftwarehub.com/products/telecrm/pricing) data is Aug 2024, older than 18 months, so possibly out of date. |
| [Privyr](https://privyr.com/pricing) | Account tier (seats per tier not confirmed) | Pro **$25/mo billed annually ($300/yr) = ₹2,373/mo**. Seats included not found | Not found | Free-forever plan (limits on leads, templates, team members); 14-day trial | WhatsApp-centric follow-up tool. INR pricing not shown, USD only | VERIFIED\* ([privyr.com/pricing](https://privyr.com/pricing)). [TrustRadius](https://www.trustradius.com/products/privyr/pricing) says "4 plans starting at $25". The [Techjockey](https://www.techjockey.com/compare/vleads-vs-privyr) figure of $15 conflicts with this. |
| [NeoDove](https://neodove.com/pricing/) | Team tier per year (per the page summary) | NeoLite ₹17,999/yr for up to 10 users = **₹1,500/mo** | NeoPlus ₹24,999/yr for up to 20 users = **₹2,083/mo** | Yearly; currently "discounted" from ₹19,999 and ₹29,999. AI-calling tiers: ₹22,999/yr (2 AI agents, 250 min) and ₹29,999/yr (4 agents, 500 min) | **WhatsApp API, IVR and VoIP cost extra**; GST extra. SIM-based calling and call recording are in the product | VERIFIED\* ([neodove.com/pricing](https://neodove.com/pricing/)). Conflicts: [SoftwareSuggest](https://www.softwaresuggest.com/neodove/pricing) says $9/user/mo annual; [Capterra](https://www.capterra.com/p/204000/NeoDove/) says $31.10/user/mo; [SoftwareFinder](https://softwarefinder.com/crm/neodove) says NeoOne ₹19,999 for up to 20 users/yr and Enterprise from ₹500/user/mo. **ESTIMATE / caution:** "₹17,999/yr for 10 users" is unusually cheap (₹150/user/mo). Confirm it is per team, not per user. If it is per user, 5 users = ₹7,500/mo and 15 = ₹22,500/mo. |
| [Kylas](https://kylas.io/blog/crm-pricing-guide-for-best-tools) | **Flat per company, unlimited users** | **₹12,999** (Elevate) | **₹12,999** (Elevate) | Billed annually. Embark: free, unlimited users, 1,000 records. Exceed: custom (one source says ₹75,000/mo) | Add-ons (workflows, email templates, tracking) cost ₹500–800/mo each per [Softwr](https://www.softwr.com/compare/kylas-vs-zoho-crm). Kylas says add-ons are optional. WhatsApp and telephony cost: not found | VENDOR CLAIM ([Kylas pricing guide blog](https://kylas.io/blog/crm-pricing-guide-for-best-tools), [Kylas US](https://kylas.io/us/)). USD figures conflict ($129–250). The record limit also conflicts (1 lakh vs 3 lakh). |
| [Bitrix24 India](https://partners.bitrix24.in/private/partner_pricing.php) | **Flat per company, user cap per tier** | Basic (5 users): **₹1,910** (₹22,920/yr) or ₹2,390 (₹7,170 per 3 months) | Standard (50 users): **₹4,790** (₹57,480/yr) or ₹5,990 (₹17,970 per 3 months) | 3- or 12-month. INR prices only for accounts on bitrix24.in. Professional (100 users) is ₹9,590/mo annual | GST treatment not stated. Telephony and WhatsApp connectors cost: not found | VERIFIED\* (official [Bitrix24 India partner price page](https://partners.bitrix24.in/private/partner_pricing.php)). [Techjockey](https://www.techjockey.com/detail/bitrix24) agrees (₹2,390 monthly, ₹1,910 annual). [Capterra India](https://www.capterra.in/software/113540/bitrix24) shows "₹69", which is a USD figure mislabelled as rupees. The 2024 [Business Standard press release](https://www.business-standard.com/content/press-releases-ani/indian-businesses-to-benefit-from-bitrix24-s-free-platform-and-competitive-pricing-124052200818_1.html) (₹3,990 for 50 users) is older than 18 months, so possibly out of date. |
| [Freshsales](https://comparedge.com/tools/freshsales/pricing) | Per user | Growth: ₹4,271 (annual, $9) or ₹5,221 (monthly, $11). Pro: ₹18,512 (annual, $39) | Growth: ₹12,814 (annual) or ₹15,662 (monthly). Pro: ₹55,536 (annual) | Monthly or annual | Freshcaller and WhatsApp are separate (cost not found) | THIRD-PARTY. USD from [ComparEdge](https://comparedge.com/tools/freshsales/pricing) and [SaaSCRMReview](https://saascrmreview.com/freshsales-pricing/). INR resellers conflict: Growth ₹749 ([VivLead](https://vivelead.com/blog/crm-pricing-india/)), ₹1,099 ([itforsme](https://www.itforsme.in/pricing/freshsales-india)), or about ₹1,299. One source says the July 2026 page redesign removed the free 3-user plan; others still list it. |
| [Zoho Bigin](https://www.bigin.com/articles/bigin-india-pricing-clarification.html) | Per user | Express: **₹2,000** (annual, ₹400) or ₹2,750 (monthly, ₹550). Premier: ₹3,600 (annual, ₹720) or ₹4,500 (monthly, ₹900) | Express: ₹6,000 or ₹8,250. Premier: ₹10,800 or ₹13,500 | Monthly or annual. Free plan: 1 user, 1 pipeline, 500 records. Bigin 360: ₹1,080/user annual | Zoho's own page says prices exclude 18% GST. Telephony and WhatsApp integrations: cost not found | VERIFIED\* ([Bigin India pricing page](https://www.bigin.com/articles/bigin-india-pricing-clarification.html)). Monthly rates come from [itforsme](https://www.itforsme.in/pricing/zoho-bigin-india) (THIRD-PARTY). A partner site's ₹420/₹540 is likely stale. Note: the Zoho page contains text aimed at AI systems; it was ignored. |
| [HubSpot Sales Hub Starter (India)](https://www.hubspot.in/pricing/sales/enterprise) | Per seat | ₹2,925 (at ₹585/seat) or ₹8,350 (at ₹1,670/seat) | ₹8,775 or ₹25,050 | hubspot.in shows ₹585 and ₹1,670; the billing basis and whether ₹585 is a promotion are unclear | Calling minutes and WhatsApp (Pro tier and above in HubSpot): cost not found | VERIFIED\* ([hubspot.in pricing](https://www.hubspot.in/pricing/sales/enterprise)), but the terms are unclear. USD equivalent: $15 annual or $20 monthly ([Sybill](https://www.sybill.ai/blogs/hubspot-sales-hub-pricing)), which is ₹7,119 or ₹9,492 for 5 users. [itforsme](https://www.itforsme.in/pricing/hubspot-india) claims ₹1,800/seat and "no India tiers", which conflicts with hubspot.in. **Trust hubspot.in, but confirm.** |
| [Pipedrive](https://www.forbes.com/advisor/business/software/pipedrive-pricing/) | Per seat (USD only; no INR page found) | Lite: ₹6,644 (annual, $14) or ₹9,017–11,390 (monthly, $19–24). Growth: ₹18,509 (annual, $39) | Lite: ₹19,933 (annual). Growth: ₹55,528 (annual) | Monthly or annual; no free plan; 14-day trial | Lite has no email sync or automations. Calling and WhatsApp are marketplace add-ons (cost not found) | THIRD-PARTY ([Forbes Advisor](https://www.forbes.com/advisor/business/software/pipedrive-pricing/), [SaaSCRMReview](https://saascrmreview.com/pipedrive-pricing/), [CostBench](https://costbench.com/software/crm/pipedrive/)). Premium and Ultimate prices conflict ($49/59 and $69/79). |
| [LeadSquared](https://zoftwarehub.com/products/leadsquared/pricing) | Per user, usually annual | Lite at $25/user: **₹11,865** (ESTIMATE from USD). At the ₹2,500 "Sales Pro" rate: ₹12,500 | ₹35,595 (Lite, USD-based) or ₹37,500 | Annual (third-party); onboarding fee not found | Telephony and WhatsApp connectors are extra (cost not found) | THIRD-PARTY: Lite $25 and Pro $50 per [Stackingo](https://www.stackingo.com/post/leadsquared-service-pricing) and [RevPilots](https://revpilots.com/pricing/leadsquared-pricing/); ₹2,500 and ₹5,000 per [Zoftwarehub](https://zoftwarehub.com/products/leadsquared/pricing), dated 15 Dec 2024 (**older than 18 months**). TeleCRM's attack page title ["Why Pay ₹2,500/User"](https://telecrm.in/leadsquared-alternative) corroborates the ₹2,500 anchor (rival VENDOR CLAIM). |
| [Callyzer](https://callyzer.co/custom-cost-calculator/) (SIM call tracker) | Per number or per employee (the unit conflicts) | Base: ₹875 (₹175 × 5). With lead management (+₹100/employee): ₹1,375 | Base: ₹2,625. With lead management: ₹4,125 | Monthly | Add-ons: call-recording sync ₹100/GB/mo; API/webhook, Zoho and LeadSquared integrations ₹150/number/mo each; IndiaMART ₹500/account/mo | VERIFIED\* ([Callyzer cost calculator](https://callyzer.co/custom-cost-calculator/)); Callyzer FAQ says ₹161/number; [Techjockey](https://www.techjockey.com/detail/callyzer) says ₹175 ex-GST (about ₹207 with GST), and Basic+Lead ₹275. |

**Group 3: WhatsApp-first tools (all exclude Meta message fees)**

Meta's India rates as of 2026 (THIRD-PARTY, via [Gupshup/ChatMitra](https://chatmitra.com/chatmitra-vs-gupshup/) and [CodingClave comparison](https://codingclave.com/guides/whatsapp-api-pricing-india-2026-comparison)):
- Marketing: about **₹0.8631** per message (another source gives ₹0.88).
- Utility and authentication: about **₹0.115** per message.
- One source says that **from 1 Oct 2026**, service messages (previously free) get 1,000 free per number per month, then cost ₹0.115 each. This is single-source. [Periskope's blog](https://periskope.app/blog/whatsapp-business-api-pricing-changes-october-1) confirms a pricing change on 1 Oct but I could not read the detail. **Verify on Meta's rate card.**

| Product (pricing link) | Price model | 5 users ₹/mo | 15 users ₹/mo | Per-message markup | Tag |
|---|---|---|---|---|---|
| [Interakt](https://blog.campaignhq.co/interakt-pricing-india-2026) | Flat per account | Growth ₹2,499 or ₹2,799 (monthly); ₹2,200 (yearly: ₹26,399/yr) | Same plan. Agent caps not found | Starter rates: ₹0.970 marketing, ₹0.160 utility, ₹0.129 authentication. Rates vary by plan. One source claims a 10–25% markup ([Landinchat](https://landinchat.com/pricing-comparison/interakt), about 129 days old). AI agent add-on: ₹2,499–3,000/mo | THIRD-PARTY. [CampaignHQ](https://blog.campaignhq.co/interakt-pricing-india-2026) and [Mark360](https://mark360.ai/blog/interakt-pricing-2026) both say they checked interakt.shop on 15 Oct 2026: Starter ₹999, Growth ₹2,499, Advanced ₹3,499/mo. Others list Growth ₹2,799 and Advanced ₹3,799. Yearly: Starter ₹11,999, Growth ₹26,399, Advanced ₹35,999. One source says monthly Starter is Instagram-only. |
| [AiSensy](https://mark360.ai/blog/aisensy-pricing-2026) | Flat per account; 5 agents included | **₹3,200** (Pro, monthly) or ₹2,880 (Pro, yearly). Basic: ₹1,500 or ₹1,350 | Pro + 10 extra agents × ₹750 = **₹10,700** (ESTIMATE) | Marketing ₹1.09 and utility/authentication ₹0.145 (vs Meta's ₹0.8631 and ₹0.115, which implies about 26% markup; ESTIMATE). Service messages in the 24-hour window are free. Chatbot builder costs ₹2,000–2,500/mo extra | THIRD-PARTY ([Mark360](https://mark360.ai/blog/aisensy-pricing-2026), checked 15 Oct 2026; [CodingClave](https://codingclave.com/blog/aisensy-pricing-india-2026); [ViveLead](https://vivelead.com/aisensy-pricing/); [Zoko](https://www.zoko.io/post/whatsapp-business-api-aisensy) for agents; [TheTechPad](https://thetechpad.com/blog/aisensy-alternatives-2026/) for chatbot). Premium ₹9,100; Unlimited ₹45,000. |
| [WATI](https://codingclave.com/blog/wati-pricing-india-2026) | Tier + per extra seat | Pro (5 users): **₹9,999** (monthly) or ₹7,499 (yearly) | Pro + 10 × ₹1,799 = **₹27,989** (monthly) or ₹25,489 (yearly) (ESTIMATE) | Messages billed separately. Growth plan (3 users) has no extra seats | THIRD-PARTY and biased (CodingClave sells a real-estate CRM). Its 4 Oct 2026 snapshot: Growth ₹4,999 (₹3,749 yearly), Pro ₹9,999 (₹7,499 yearly), extra user ₹1,799. Older snapshots: Growth ₹2,999 / Pro ₹6,499 / Business ₹18,499 ([Heltar 2025](https://www.heltar.com/blogs/wati-pricing-in-india-explained-comprehensive-breakdown-2025)); extra seat ₹1,299 ([ChatMitra](https://chatmitra.com/chatmitra-vs-wati/)). |
| [Gupshup](https://chatmitra.com/chatmitra-vs-gupshup/) | Pay per message (self-serve); enterprise minimums | No seat fee found for self-serve | Same | **$0.001 per message = about ₹0.095**, plus Meta's fee. One count puts an all-in marketing message at about ₹0.95. Sources disagree on whether inbound messages are charged. Managed/enterprise minimum: ₹4,000–15,000+/mo | THIRD-PARTY ([ChatMitra](https://chatmitra.com/chatmitra-vs-gupshup/), [CodingClave](https://codingclave.com/blog/gupshup-whatsapp-pricing-india-2026), [GetMacha](https://www.getmacha.com/blog/gupshup-ai-complete-guide), citing gupshup.ai/pricing checked 24 Sep 2026). |
| [DoubleTick](https://m.aisensy.com/blog/whatsapp-api-providers/) | Tier by agents | Pro (10 agents): **₹4,200** (annual billing) | Over Pro's 10-agent cap. Enterprise custom: **not found** | Meta fees on top | THIRD-PARTY and biased (AiSensy blog): Starter ₹3,000 (3 agents), Pro ₹4,200 (10 agents), annual, GST extra. [Techjockey](https://www.techjockey.com/detail/doubletick): Starter ₹30,000/yr, Pro ₹42,000/yr (₹2,500 and ₹3,500/mo). [IndiaMART](https://www.indiamart.com/proddetail/doubletick-whatsapp-business-api-2851058635948.html): ₹2,500/mo single user. A ₹220.73/user/yr figure on [Software Advice](https://www.softwareadvice.com/sms-marketing/double-tick-profile/) looks wrong. |
| [Periskope](https://periskope.app/pricing) | Per user + per connected phone (first phone free) | 5 × $25 = **₹11,865** (1 phone) | 15 × $25 = **₹35,595** | **No per-message fee**: the bill only changes with users or phones | VERIFIED\* ([periskope.app/pricing](https://periskope.app/pricing): $25/user, $25/extra phone). Blogs say $20 Starter / $30 Pro as of June 2026 ([Spun](https://spun.co.in/alternatives/periskope/), [Clapvo](https://clapvo.com/blog/periskope-alternatives)). A "Prices are increasing soon" banner was seen on 2026-08-06. |
| [Zoko](https://www.zoko.io/pricing) | Tier by agents and conversations | Starter **$49.99 = ₹4,745** (unlimited free agents, per Zoko) or Plus $79.99 = ₹7,593 (5 agents) | Elite $114.99 = ₹10,915 (10 agents) does not fit 15; Max $499.99 = ₹47,459 (30 agents). On Starter with unlimited agents: ₹4,745 | Starter: +$0.015/conversation (about ₹1.42). Plus: 5,000 conversations with no markup | VERIFIED\* ([zoko.io/pricing](https://www.zoko.io/pricing); possibly a cached copy). Agent counts from Zoko's [Gallabox post](https://www.zoko.io/post/gallabox-pricing-whatsapp-automation). Lower figures (Starter $39.99, Plus $64.99, Max $404.99) from [QuickReply](https://www.quickreply.ai/others/zoko-pricing). Zoko is Shopify/D2C-focused, not real estate. |

**Group 4: global and open-source references**

| Product (pricing link) | Price model | 5 users ₹/mo | 15 users ₹/mo | Setup / contract | Tag |
|---|---|---|---|---|---|
| [Follow Up Boss](https://www.jamilacademy.com/blog/follow-up-boss-review) | Per user (Grow); team bundles (Pro, Platform) | Grow: ₹27,527 (annual, $58 × 5) or ₹32,747 (monthly). With calling (+$33/user annual): ₹43,190 | Pro (10 included + 5 × $41, annual) = $621 = **₹58,945**; monthly $744 = ₹70,620 | No free plan; 14-day trial. Pro includes unlimited calling and texting. Platform: $1,000/mo for 30 users | THIRD-PARTY ([Jamil Academy](https://www.jamilacademy.com/blog/follow-up-boss-review), [Placester](https://placester.com/real-estate-marketing-academy/follow-up-boss-review), [RobinFlow](https://www.robinflow.com/blog/inside-follow-up-boss-3-tiers-69-plan-33-catch)) |
| [BoldTrail (kvCORE)](https://www.agentflowtools.com/kvcore-pricing) | Quote only | ESTIMATE ~$499 = ₹47,365 | ESTIMATE ~$999 = ₹94,825 | Setup about $999 (₹94,825); annual contracts standard; ad spend extra | THIRD-PARTY. Pricing page (checked 2026-07-17 by [AgentFlowTools](https://www.agentflowtools.com/kvcore-pricing)) is a demo form only; [RealEstateSnapshot](https://realestatesnapshotforghl.com/blog/real-estate-crm-software-cost-2026/) gives ranges. |
| [Lofty](https://www.luxurypresence.com/blogs/lofty-pricing/) | Team bundle | ~$649 for up to 10 users = **₹61,603** | ~$899 for up to 20 users = **₹85,333** | Setup about $299 (₹28,381). Ad management fee 15–20% of ad spend. AI Sales Agent $60+/mo | THIRD-PARTY ([Luxury Presence](https://www.luxurypresence.com/blogs/lofty-pricing/), [BitsReview](https://bitsreview.com/lofty-crm-review/)). Tier names conflict. Entry tier about $449/mo for up to 3 users. |
| [Real Geeks](https://www.agentflowtools.com/wise-agent-pricing) | Platform fee + users | $399 + 3 × $25 = **₹44,992** | Not available: the cap is 10 users total (not found above 10) | $500 setup (₹47,460); 6- or 12-month commitment; lead packages $299/mo each | THIRD-PARTY ([AgentFlowTools](https://www.agentflowtools.com/wise-agent-pricing), [Jamil Academy](https://www.jamilacademy.com/blog/real-estate-crm-and-platform-pricing-what-12-systems-cost)). Title of [AIToolsBakery](https://aitoolsbakery.com/blog/real-geeks-alternatives/) "Post-Hike Picks" suggests a recent price rise (unverified). |
| [Wise Agent](https://www.agentflowtools.com/wise-agent-pricing) | **Flat per account** (up to 5 team members on a shared login) | $49 = **₹4,651** (shared login); about $140 = ₹13,289 with individual logins (reviewer estimate) | ESTIMATE $49 + 14 × $20 = $329 = ₹31,229 | Annual $499/yr (about $42/mo); separate logins $20/mo each | THIRD-PARTY ([AgentFlowTools](https://www.agentflowtools.com/wise-agent-pricing), [AIToolsBakery](https://aitoolsbakery.com/blog/wise-agent-review/)) |
| [Twenty CRM](https://fluidcrm.io/blog/twenty-crm/) | Per user (cloud); free self-host (AGPL-3.0) | Pro: ₹4,271 (yearly, $9) or ₹5,695 (monthly, $12) | Pro: ₹12,814 (yearly) or ₹17,086 (monthly) | Cloud: 30-day trial, no free tier. Self-host: VPS about $10–50/mo; SSO and row-level permissions may need the paid Organization licence ($19 yearly / $25 monthly per user) | THIRD-PARTY ([FluidCRM](https://fluidcrm.io/blog/twenty-crm/), checked 15 Sep 2026; [Opsily](https://opsily.com/hosting/twenty-crm/twenty-crm-cost)). About 44k GitHub stars per [Pillitteri](https://pasqualepillitteri.it/en/news/954/twenty-crm-open-source-salesforce-hubspot-alternative). |
| [Odoo CRM](https://oec.sh/odoo-pricing/india) | **One App Free (one app, unlimited users) = ₹0**; Standard and Custom per user | One App Free (CRM only): ₹0. Standard: ₹3,625 (list ₹725) or ₹2,900 (promo ₹580). Custom: ₹6,750 (list ₹1,350) | One App Free: ₹0. Standard: ₹10,875 or ₹8,700. Custom: ₹20,250 | Billed yearly. Custom adds Studio, the external API and multi-company. Community Edition is free to self-host | THIRD-PARTY ([oec.sh India](https://oec.sh/odoo-pricing/india); [Braincuber](https://www.braincuber.com/blog/odoo-community-vs-enterprise-cost-india-2026) lists Custom at about ₹1,150). The USD prices ($24.90 intro, $31.10 later) conflict. |
| [Odoo real-estate apps](https://apps.odoo.com/apps/modules/19.0/property_booking) | One-time module licence | SerpentCS Property Booking (v19): **$1,093.52 one-time = ₹103,797** | Same | Property Booking EE (v19) needs Enterprise and tracks unit status: available, booked, sold, under construction. [kx_realestate](https://apps.odoo.com/apps/modules/18.0/kx_realestate) (v16–19, Community + Enterprise): buildings, bookings, ownership and rental contracts. [property_management_rental_sales](https://apps.odoo.com/apps/modules/17.0/property_management_rental_sales) (v17): payment plans, down-payment %, booking amount, booking expiry, payment status | VERIFIED\* (apps.odoo.com listings) |
| [Krayin CRM](https://krayincrm.com/extensions/krayin-crm-whatsapp-extension/) | Open-source core (Laravel, free) + paid extensions | Core: ₹0 + hosting | Same | WhatsApp extension **$1,499 = ₹142,285** one-time (built for Krayin v2.2.3; 3 months support). VoIP extension $4,500 = ₹427,140. **Multi-tenant SaaS extension $1,799 = ₹170,761** | VERIFIED\* ([krayincrm.com](https://krayincrm.com/extensions/krayin-crm-whatsapp-extension/)); THIRD-PARTY ([SoftwareFinder](https://softwarefinder.com/crm/krayin)). The WhatsApp extension is aimed at eCommerce/storefront, not real estate. |
| SuiteCRM | Open source | Not researched (search budget exhausted) | Not researched | Not researched | See Gaps |

### Inferences
- **The seller's flat Starter at ₹3,999 for 5 users is in line with the market:**
  - Per-user rivals at 5 users: TeleCRM ₹3,995 (annual), Bigin Premier ₹3,600, Odoo Standard ₹3,625, Freshsales Growth about ₹4,271.
  - It is below LeadSquared (about ₹12,000) and Pipedrive Lite (about ₹6,600).
  - It is above Bitrix24 Basic (₹1,910), NeoDove (₹1,500 if per team) and Bigin Express (₹2,000).
- **The seller's Growth at ₹7,999 for 15 users is cheaper than every per-user rival at 15 seats:**
  - TeleCRM ₹11,985, Bigin Premier ₹10,800, Freshsales ₹12,814, Odoo ₹10,875 (list).
  - The exceptions are flat-price Bitrix24 Standard (₹4,790 for 50 users) and NeoDove (₹2,083 for 20 users, if per team).
- **The seller's Pro at ₹12,999 matches Kylas Elevate exactly.** Elevate is also ₹12,999 flat with unlimited users. Kylas is therefore the most direct flat-price benchmark, and the seller's "up to 40 users" cap at the same price is a weakness against "unlimited users" (ESTIMATE / positioning inference).
- **WhatsApp messaging is never truly included.** Every tool passes through Meta's per-message fees. The BSP platform fee alone (Interakt ₹2,200–2,800, AiSensy ₹3,200, WATI ₹7,499–9,999) can equal or exceed the seller's whole Starter price. That strengthens an "add-on, pass-through" WhatsApp model.
- **SIM-based calling is the Indian norm for budget teams.** TeleCRM, NeoDove and Callyzer all track calls made from staff phones; the reasoning is that it avoids virtual-number costs. Callyzer's ₹175/number/month is a useful floor for "call logging" value.

### Gaps
- None of the vendor pricing pages could be opened directly. All figures need a manual check (this session's network policy blocked WebFetch, curl and the Wayback Machine).
- **Not found:**
  - TeleCRM WhatsApp add-on price.
  - Privyr seat counts per tier and INR price.
  - Kylas WhatsApp and telephony costs.
  - Whether HubSpot's ₹585 is annual or a promotion.
  - Pipedrive INR pricing.
  - Current LeadSquared INR price list (the latest is Dec 2024).
  - DoubleTick price above 10 agents.
  - Interakt agent caps.
- **Setup or onboarding fees were found only for:** TeleCRM (none), Lofty (~$299), Real Geeks ($500) and BoldTrail (~$999). Others: not found. HubSpot Starter onboarding is believed to be ₹0, but this is unverified.

---

## Q2. Which ones market specifically to Indian real-estate brokers and builders?

### Takeaway
TeleCRM, NeoDove and Kylas all have real-estate pages or real-estate integrations, and TeleCRM is the most explicit:
- **TeleCRM:** a dedicated real-estate CRM page, a Bangalore brokerage case study, portal integrations and channel-partner access.
- **NeoDove:** a real-estate CRM landing page.
- **Kylas:** portal lead integrations, with inventory only via a partner integration.

Among WhatsApp-first tools, none was found marketing specifically to Indian real estate within this session's searches. Zoko is D2C/Shopify-focused. Global tools (FUB, BoldTrail, Lofty, Real Geeks, Wise Agent) are US-realtor-only.

### Cited Findings
- **TeleCRM** markets "India's Simplest Real Estate CRM Software" — [telecrm.in/real-estate-crm](https://telecrm.in/real-estate-crm) (VENDOR CLAIM).
  - It says it captures leads from **Housing.com, 99acres and MagicBricks**, de-duplicates them across sources, auto-assigns them, and gives **channel partners role-based access to only their own leads** — [TeleCRM real-estate page](https://devweb.telecrm.in/crm-for-industry/real-estate) (VENDOR CLAIM).
  - **Case study: House Choice, a Bangalore brokerage.** It moved off a self-built CRM. Claimed results: 30–40% operational-efficiency gain in 3 months, 60% more customer registrations, 50–60% revenue growth, and AI-based lead qualification — [TeleCRM case study](https://devweb.telecrm.in/case-studies/house-choice) (VENDOR CLAIM; no independent verification found).
- **NeoDove** has a "Real Estate CRM Software for Realtors" landing page listing call recording — [neodove.com/real-estate-crm-software](https://neodove.com/real-estate-crm-software/) (VENDOR CLAIM).
- **Kylas:**
  - Its integrations page lists lead capture from **Housing.com, MagicBricks and 99acres** ("map your property inquiries"), and **product cost and inventory via an Arka integration** — [kylas.io/integrations/leadgeneration](https://kylas.io/integrations/leadgeneration) (VENDOR CLAIM).
  - No dedicated builder edition or channel-partner module was found — same source plus [Fitgap](https://us.fitgap.com/products/000025/kylas-sales-crm) (THIRD-PARTY).
- **Callyzer** integrates with **IndiaMART** at ₹500/account/month. It is a lead source for some brokers, but not real-estate specific — [Callyzer calculator](https://callyzer.co/custom-cost-calculator/) (VERIFIED\*).
- **Bitrix24** targets Indian SMBs generally, via a 2024 press release on India pricing — [Business Standard/ANI](https://www.business-standard.com/content/press-releases-ani/indian-businesses-to-benefit-from-bitrix24-s-free-platform-and-competitive-pricing-124052200818_1.html) (VENDOR CLAIM; **older than 18 months**).
- **Odoo** has third-party real-estate modules with unit status (available, booked, sold, under construction), payment plans and booking expiry — [apps.odoo.com Property Booking EE](https://apps.odoo.com/apps/modules/19.0/property_booking_ee) and [property_management_rental_sales](https://apps.odoo.com/apps/modules/17.0/property_management_rental_sales) (VERIFIED\*). No Indian builder clients were identified.
- **Krayin's** WhatsApp extension is framed for storefront and eCommerce lead capture, not real estate — [krayincrm.com](https://krayincrm.com/extensions/krayin-crm-whatsapp-extension/) (VERIFIED\*).

### Inferences
- **Portal integrations are table stakes among India-focused SMB CRMs.** TeleCRM and Kylas both name 99acres, MagicBricks and Housing.com. The seller's lack of portal intake is a demo-losing gap against these two.
- **Channel-partner lead scoping is already part of TeleCRM's pitch.** A basic "CP sees only own leads" role is the minimum bar.
- **Opportunity for unit inventory.** No Group 2 or Group 3 tool was found with native tower, floor and unit inventory (Kylas outsources it to Arka). This is a gap the seller can fill cheaply relative to these rivals. It is not a gap against Group 1 tools.

### Gaps
- **Not checked for real-estate pages or Indian real-estate case studies** (search budget exhausted): Privyr, LeadSquared, Freshsales, Zoho Bigin, HubSpot, Pipedrive, Interakt, AiSensy, WATI, Gupshup, DoubleTick and Periskope.
  - From background knowledge (unverified this session): LeadSquared, Privyr, AiSensy and Interakt have published real-estate pages or use cases. Verify before citing.
- **Notable Indian real-estate clients:** only House Choice (TeleCRM) was found. Every other row is "not found".
- **Funding and size:** not researched.
  - The only figure seen was "LeadSquared $1B valuation" on [valueforstartups.in](https://valueforstartups.in/leadsquared), a low-quality source.
  - From background knowledge (verify via Tracxn, Inc42 or Entrackr): LeadSquared became a unicorn in 2022 after a WestBridge-led round; Gupshup became a unicorn in 2021; Interakt is a Jio Haptik product; WATI raised a Tiger Global-led round in 2022.

---

## Q3. Pricing changes in the last 12 months

### Takeaway
Several WhatsApp-tool prices moved up in 2026, with WATI and AiSensy the clearest cases. Meta's billing also changed, and the brief's Wayback Machine check could not be done in this session.
- **WATI:** Growth went from ₹2,999 to ₹4,999 between 30 Sep and 4 Oct 2026.
- **AiSensy:** Pro went from ₹2,699 to ₹3,200 in May 2026.
- **Periskope:** showed a "prices increasing" banner in Aug 2026.
- **Meta:** moved to per-message billing, and service messages are reportedly no longer free from 1 Oct 2026.

### Cited Findings
- **WATI:** Growth was ₹2,999/mo on 30 Sep 2026 and ₹4,999/mo on 4 Oct 2026. Pro is now ₹9,999 (₹7,499 yearly) and extra users ₹1,799 — [CodingClave WATI audit](https://codingclave.com/blog/wati-pricing-india-2026) (THIRD-PARTY, competitor). Earlier extra-seat price was ₹1,299 — [ChatMitra](https://chatmitra.com/chatmitra-vs-wati/).
- **AiSensy:** Pro rose from ₹2,699 to ₹3,200 in May 2026 — [RichAutomate](https://richautomate.in/blog/aisensy-price-hike-may-2026-alternatives-india) (THIRD-PARTY, competitor; not confirmed on aisensy.com). An older article listed Basic at ₹1,350 and marketing messages at ₹0.88 — [GoKwik](https://www.gokwik.co/blog/aisensy-pricing) (about 296 days old).
- **Interakt:** a 15 Oct 2026 check shows Growth at ₹2,499 and Advanced at ₹3,499, while several guides still show ₹2,799 and ₹3,799. This is either a price cut or stale guides — [CampaignHQ](https://blog.campaignhq.co/interakt-pricing-india-2026) (THIRD-PARTY).
- **Periskope:** a "Prices are increasing soon" banner was seen on 2026-08-06 — [Clapvo](https://clapvo.com/blog/periskope-alternatives) (THIRD-PARTY). The vendor page now shows $25/user versus $20 in June 2026 blogs — [periskope.app/pricing](https://periskope.app/pricing).
- **Freshsales:** a July 2026 pricing-page redesign reportedly removed the free 3-user plan; other sources still list it — [SaaSCRMReview](https://saascrmreview.com/freshsales-pricing/) (THIRD-PARTY; conflicting).
- **NeoDove:** shows a "discount" from ₹19,999 to ₹17,999 (NeoLite) and from ₹29,999 to ₹24,999 (NeoPlus) per year — [neodove.com/pricing](https://neodove.com/pricing/) (VERIFIED\*).
- **Meta WhatsApp billing:**
  - [Zoko](https://www.quickreply.ai/others/zoko-pricing) says Meta moved from per-conversation to per-message billing "from 1 Jan 2026". From background knowledge, Meta announced per-message pricing effective 1 Jul 2025, so this date conflicts; verify on Meta's developer pricing page.
  - Service messages are reportedly charged beyond 1,000 free per number per month from 1 Oct 2026 — [ChatMitra/Gupshup summary](https://chatmitra.com/chatmitra-vs-gupshup/); [Periskope blog](https://periskope.app/blog/whatsapp-business-api-pricing-changes-october-1).
- **Real Geeks:** a "Post-Hike Picks" headline implies a 2026 price increase; amount not found — [AIToolsBakery](https://aitoolsbakery.com/blog/real-geeks-alternatives/).
- **HubSpot:** a "$7 new-customer annual offer" on Starter is described as a limited-time promotion — [Sybill](https://www.sybill.ai/blogs/hubspot-sales-hub-pricing) (THIRD-PARTY).

### Inferences
- WhatsApp BSP platform fees are rising, and Meta is charging more message types. This makes "WhatsApp included" claims riskier for a flat-price seller, so pass-through billing is the safer model.

### Gaps
- **The Wayback Machine was blocked**, so there is no snapshot-based comparison for any vendor. This needs a manual check:
  - Use web.archive.org snapshots from about Oct 2025 vs Oct 2026.
  - Pricing pages: telecrm.in/pricing, kylas.io/pricing, privyr.com/pricing, interakt.shop/pricing, aisensy.com/pricing, wati.io/pricing, bitrix24.in/prices, bigin.com pricing, followupboss.com/pricing.

---

## Q4. A2 feature columns for groups 2–4 (what was found)

### Takeaway
Only partial feature data was gathered; the search budget ran out. What is sourced:

| Product | Lead sources | WhatsApp | Telephony | Inventory | Channel partners | Post-sales | White-label | Tag / source |
|---|---|---|---|---|---|---|---|---|
| TeleCRM | 99acres, MagicBricks, Housing.com; de-duplication; auto-assign | Included per its comparison page; chat sync is an add-on per its blog | Calling included (vendor) | Not found | Role-based CP access to own leads | Not found | Not found | VENDOR CLAIM ([real-estate page](https://devweb.telecrm.in/crm-for-industry/real-estate), [LSQ-alt page](https://telecrm.in/leadsquared-alternative)) |
| NeoDove | Not found | WhatsApp API extra | SIM and VoIP progressive dialer; call recording; IVR and VoIP extra; AI calling agents (250–500 min tiers) | Not found | Not found | Not found | Not found | VERIFIED\* ([pricing](https://neodove.com/pricing/)); THIRD-PARTY ([Crozdesk](https://crozdesk.com/software/neodove)). USER REPORT: one [Software Advice](https://www.softwareadvice.com/voip/neodove-profile/) review criticises call recordings. |
| Kylas | Housing.com, MagicBricks, 99acres | Not found | Not found | Via the Arka integration | Not found | Not found | Not found | VENDOR CLAIM ([integrations](https://kylas.io/integrations/leadgeneration)) |
| Callyzer | IndiaMART (₹500/mo) | Not found | SIM call logs, recording sync (₹100/GB), API/webhooks | No | No | No | Not found | VERIFIED\* ([calculator](https://callyzer.co/custom-cost-calculator/)) |
| AiSensy | – | API with templates, broadcasts, 5 agent shared inbox, chatbot add-on | – | – | – | – | Not found | THIRD-PARTY (above) |
| Periskope | – | Works with WhatsApp groups; per-user and per-phone licence; no per-message fee | – | – | – | – | Not found | VERIFIED\* ([pricing](https://periskope.app/pricing)); see the [groups API blog](https://periskope.app/blog/whatsapp-groups-api-requirements-eligibility-limits) |
| Follow Up Boss | – | – | Calling add-on $33–39/user; unlimited calling and texting on Pro | – | – | – | – | THIRD-PARTY (above) |
| Lofty | Ad lead-gen (15–20% of ad spend fee) | – | – | – | – | – | – | THIRD-PARTY ([Luxury Presence](https://www.luxurypresence.com/blogs/lofty-pricing/)) |
| Lofty AI | AI Sales Agent at $60+/mo with a 200-lead quota that does not reset monthly | | | | | | | THIRD-PARTY ([BitsReview](https://bitsreview.com/lofty-crm-review/)) |
| Odoo + apps | – | – | – | Unit status, bookings, payment plans, booking expiry (third-party modules) | – | Payment plans and contracts (modules) | Open-source Community Edition can be rebranded (inference) | VERIFIED\* (apps.odoo.com) |
| Krayin | WhatsApp lead capture (extension) | $1,499 extension | VoIP $4,500 extension | – | – | – | **Multi-tenant SaaS extension ($1,799)**: the closest open-source analogue to the seller's per-client model | VERIFIED\* ([krayincrm.com](https://krayincrm.com/extensions/krayin-crm-whatsapp-extension/)) |
| Twenty | – | – | – | – | – | – | Self-host AGPL (rebranding must respect the licence) | THIRD-PARTY ([FluidCRM](https://fluidcrm.io/blog/twenty-crm/)) |

### Cited Findings
- Kylas's flat ₹12,999 makes very small teams pay more than Zoho CRM Standard: at 5 users it costs ₹12,999 vs ₹4,000 — [Softwr](https://www.softwr.com/compare/kylas-vs-zoho-crm) (THIRD-PARTY). This is relevant to the seller's flat-tier design.
- Follow Up Boss: Grow with calling is cheapest at 3–7 seats; Pro becomes cheaper from 8 seats when calling is needed — [Jamil Academy](https://www.jamilacademy.com/blog/follow-up-boss-review) (THIRD-PARTY).

### Inferences
- **Group 4 feature ideas worth copying for India.** These come from background knowledge of Follow Up Boss and Lofty, **not verified this session**. Verify on followupboss.com/features and the help docs before citing.
  1. **Lead flow / routing rules by source** (e.g. 99acres → presales team A; Meta campaign X → team B), with **round-robin plus a "first to claim" fallback**.
  2. **Ponds**: leads untouched for N hours go back to a shared pool that anyone can claim.
  3. **Smart lists**: saved filters such as "Hot, no call in 3 days" or "Visit done, no revisit", shown as a daily to-do list.
  4. **Action plans**: auto-sequenced follow-up tasks or messages triggered by stage (e.g. after "Visit done": day 1 WhatsApp thank-you template, day 3 call task, day 7 offer).
  5. **Speed-to-lead alerts**: instant notification plus escalation if no call within X minutes.
  6. **Lofty-style AI assistant** that replies to new leads and books visits, priced as a metered add-on with a lead quota, as Lofty does (see BitsReview above).
- **Effort fit (ESTIMATE).** Items 1–4 map onto the seller's existing stack: auto-assignment, follow-up dates, n8n. They are S–M effort and are table stakes in US real-estate CRMs.
- **Open-source references.**
  - Krayin's multi-tenant SaaS extension and Odoo's real-estate modules show market prices for "white-label multi-tenant" (about ₹1.7 lakh one-time) and "unit booking" (about ₹1 lakh one-time) as licensed code. The seller can position these as included.

### Gaps
- **Not researched** (search budget exhausted), for every product:
  - Reviews: rating and count on G2, Capterra and Google Play, with dates.
  - Top 3 praises and top 3 complaints.
  - Mobile apps.
  - AI features, except Lofty and NeoDove.
  - Reports.
  - Data export.
  - White-label status, except Krayin and Odoo by inference.
  - Funding and size.
  - Notable clients, except House Choice.
- SuiteCRM: no data gathered (licence, version, hosting cost).
- Gupshup, DoubleTick and Interakt feature specifics (shared inbox, chatbot, CRM integrations): not gathered.
- Follow Up Boss features (smart lists, action plans, ponds, lead flow): unverified; see Inferences.
- **Next step for the coordinator:** run a follow-up pass with more search budget, or with fetch access to pricing pages and app stores, focused on reviews, funding and the feature columns for TeleCRM, Privyr, Kylas, NeoDove, Interakt, AiSensy and WATI. These are the likely "closest 5" candidates from groups 2–3.
