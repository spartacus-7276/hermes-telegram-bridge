# Integrations for closing communication and lead-intake gaps: WhatsApp API, telephony, portal leads, ad lead forms, reminders

> **Read this first: how these notes were gathered (2026-10-18).**
> - **Pages were not opened directly.** The session's network policy blocked `WebFetch` and `curl` for every vendor domain I tried (developers.facebook.com, wati.io, interakt.shop, aisensy.com: DNS failure or proxy `connect_rejected`). So every finding below comes from **search-engine extracts** (WebSearch) of the cited pages. That means the brief's rule "a search snippet is not a source" could **not** be fully met.
> - **Search budget ran out.** The shared search limit was hit after 23 searches, so some sub-questions are not covered. They are listed under Gaps.
> - **Tags:**
>   - **VERIFIED\*** = official vendor/Meta/Google page, seen only as a search extract. Re-open it before quoting to a client.
>   - **VENDOR CLAIM** = a vendor's own marketing, or a third-party blog. Most "pricing comparison" blogs here belong to competing BSPs or CRMs.
>   - **USER REPORT** = forums.
> - **Access date:** 2026-10-18 for every link.
> - **Exchange rate:** **1 USD = ₹96.5**, from the live market page at [Pluang](https://pluang.com/en/tools/currency-converter/usd-inr) (page undated; 52-week range shown 86.25–96.96). Treat it as approximate; ±₹3 changes nothing below. I found no EUR/INR rate, so EUR figures are converted as **ESTIMATE** at about ₹105/EUR.
> - **GST:** all ₹ figures exclude 18% GST unless stated.

---

## Q1. WhatsApp Business API: BSPs in India, fees, markup, white-label, current Meta India rates

### Takeaway
Meta's India list rates in 2026 are about **₹0.8631 per marketing message** and **₹0.115 per utility, authentication or service message**.
- From **1 Oct 2026**, service replies count as chargeable after **1,000 free per business number per month**.
- The cheapest pass-through options are **Meta Cloud API direct** (₹0 platform fee), **Gupshup self-serve** (≈ $0.001 per message, about ₹0.10), and **360dialog** (€49 per number per month, no markup).
- The Indian SaaS BSPs (**AiSensy ₹1,500/mo, Interakt ₹2,799/mo, WATI ₹2,999–6,499/mo**) add a 15–40% markup per message plus a monthly fee per client.
- **Recommended path:** become a **Meta Tech Provider** using Embedded Signup on Cloud API, or sit on top of a no-markup BSP such as 360dialog or Gupshup. Avoid stacking another SaaS inbox under the CRM.

### Cited Findings

**Meta India rate card (per-message pricing since 1 Jul 2025)**

*Rates*
- India marketing is **₹0.8631/message**; utility and authentication are **₹0.115/message**, excluding GST. Marketing costs about 7.5× utility. VENDOR CLAIM (several BSP blogs agree) — [DEV Community](https://dev.to/preciousky_45d956626d31c3/whatsapp-business-platform-pricing-in-rupees-and-the-two-things-that-change-on-1-october-2026-4ko0); [ChatMaxima India](https://chatmaxima.com/whatsapp-api-pricing/india/); [digitaltoolbox.in](https://digitaltoolbox.in/blog/whatsapp-business-api-pricing-india/).
- Meta raised India marketing about 10%, from ≈₹0.7846 to ₹0.8631, **effective 1 Jan 2026**. Utility and authentication stayed flat. India rates did **not** change on 1 Oct 2026. VENDOR CLAIM — same sources as above.
- **USD rate card for India:** marketing **$0.0118**, utility and authentication **$0.0014**. VENDOR CLAIM — [whautomate](https://whautomate.com/whatsapp-business-api-pricing-india); [Zernio](https://zernio.com/blog/twilio-whatsapp-pricing-breakdown-what-it-really-costs).
  - Note: Meta's INR card is set separately and is **not** a straight conversion. $0.0118 × 96.5 = ₹1.14, which does not match ₹0.8631. Businesses billed in INR should use the INR card.
- **Volume tiers:** the India utility list rate of ₹0.115 applies up to 25 million messages a month; ₹0.1081 applies after that. Marketing has no tiers. VENDOR CLAIM — [ChatMaxima India](https://chatmaxima.com/whatsapp-api-pricing/india/).
- **Conflicting older figures:** a page about 400 days old shows ₹0.88 marketing and ₹0.13 utility. These look out of date. VENDOR CLAIM, **flag: older figures** — [2factor.in](https://2factor.in/v3/lp/whatsapp-business-api-pricing.php).
- **Currency migration:** a 2026 deadline for moving India businesses to INR billing is referenced in [Monty Mobile](https://montymobile.com/blogs/whatsapp-business-api-pricing-in-india-inr-rates-gst-and-the-2026-currency-migration-deadline/). VENDOR CLAIM; the details were not in the extract.

*1 Oct 2026 change: service messages*
- Service messages (free-form replies inside the 24-hour window) become chargeable at the **utility/authentication rate (₹0.115 in India)**.
- The **first 1,000 service messages per business phone number per month are free**. The allowance resets monthly, is counted per message (not per conversation), and does not roll over. VENDOR CLAIM — [360dialog blog](https://360dialog.com/blog/whatsapp-service-message-charging-october-2026/); [YCloud](https://www.ycloud.com/blog/whatsapp-api-message-pricing-update-effective-october-1-2026); [respond.io](https://respond.io/blog/whatsapp-pricing-change-2026); [ChatMaxima](https://chatmaxima.com/blog/whatsapp-service-message-pricing-october-2026/).
- **Sources disagree on utility templates sent inside the open window.** These were free from July 2025. Several blogs say they become chargeable on 1 Oct 2026, but one marks this "reported as charged, not yet confirmed by Meta." VENDOR CLAIM, **CONFLICT** — [ChatMaxima](https://chatmaxima.com/blog/whatsapp-service-message-pricing-october-2026/); [Whatsable](https://whatsable.app/blog/meta-october-2026-whatsapp-service-message-pricing); [Twilio pricing summary on Landbot](https://landbot.io/blog/twilio-whatsapp-pricing).
- **Gap:** I could not open Meta's own pricing page (developers.facebook.com was blocked), so the 1 Oct 2026 details are **not VERIFIED**.

**BSPs: platform fee and per-message price (India, excluding GST)**

| BSP | Platform fee/month | India per-message price (marketing / utility) | Markup vs Meta | Tag and source |
|---|---|---|---|---|
| **Meta Cloud API direct** | ₹0 | Meta list price (₹0.8631 / ₹0.115) | 0% | VENDOR CLAIM for rates (see above) |
| **AiSensy** | Basic **₹1,500**, Pro **₹3,200** (annual: ₹1,350 / ₹2,880). Chatbot add-on about ₹1,999–2,500/mo | **₹1.09 / ₹0.145** (utility, auth, service) | Marketing about +26%, utility about +26% | VENDOR CLAIM — [mark360.ai](https://mark360.ai/blog/aisensy-pricing-2026); [vivelead](https://vivelead.com/aisensy-pricing/); [codingclave](https://codingclave.com/blog/aisensy-pricing-india-2026); [AiSensy blog](https://m.aisensy.com/blog/aisensy-basic-vs-pro-plan-which-ones-best-for-you/) |
| **Interakt** (Jio Haptik) | Growth **₹2,799**, Advanced **₹3,799**. Yearly: ₹2,200 / ₹3,000 per month. Starter ₹11,999/yr is **Instagram only** | Marketing ≈ **₹0.970**; utility **₹0.140–0.160** by plan; service after the free 1,000 = **₹0.128** | Estimates range from 10–30% to 15–20%. An older 2025 analysis found +12.4% marketing and +39% utility. "No markup" applies to Enterprise only | VENDOR CLAIM — [waaru.app](https://www.waaru.app/interakt-pricing); [jeedesigns (Oct 2026)](https://jeedesigns.com/insights/wati-vs-aisensy-vs-interakt-pricing/); [getitsms](https://getitsms.com/blogs/interakt-whatsapp-business-api-pricing-vs-getitsms/); [heltar (2025)](https://www.heltar.com/blogs/interakt-pricing-explained-2024-a-comprehensive-breakdown-updated-cm1agqx7u00azb98sy3qu2ttt); [shoplinx](https://www.shoplinx.ai/blog/whatsapp-business-api-pricing-2026) |
| **WATI** | Monthly: Growth **₹2,999**, Pro **₹6,499**, Business **₹18,499**. Annual: Growth ₹2,199, Pro **₹4,899**. Pro includes 5 users; extra seat about ₹1,299/mo | Markup over Meta (amount not stated) | Not quantified | VENDOR CLAIM, **CONFLICT**: other sources give Pro at ₹4,499–5,999 — [codingclave](https://codingclave.com/blog/wati-pricing-india-2026); [ominiflow](https://ominiflow.com/blog/wati-pricing-india-2026); [chatmitra](https://chatmitra.com/chatmitra-vs-wati/); [jeedesigns](https://jeedesigns.com/insights/wati-vs-aisensy-vs-interakt-pricing/) |
| **Gallabox** | Basic **₹2,999**/mo (billed quarterly), **₹2,399**/mo (annual). Basic has a 3-user cap | **₹0.9926 / ₹0.1323** | About +15% (another source: 15–25%) | VENDOR CLAIM (one source is competitor Zoko) — [codingclave](https://codingclave.com/blog/gallabox-pricing-india-2026); [Zoko](https://www.zoko.io/post/gallabox-pricing-whatsapp-automation) |
| **Gupshup** (self-serve) | ₹0, no setup fee | Meta rate + **$0.001/message (≈₹0.10)**, charged inbound and outbound | Flat ≈₹0.10/msg. That is +87% on utility (₹0.115 → ₹0.21) and +11% on marketing | VENDOR CLAIM — [campaignhq](https://blog.campaignhq.co/gupshup-whatsapp-pricing); [getmacha](https://www.getmacha.com/blog/gupshup-ai-complete-guide). Conflicting "$0.03–0.07/msg" claim from competitor [chatmitra](https://chatmitra.com/chatmitra-vs-gupshup/), which I distrust |
| **360dialog** | **€49 / €99 / €500 per number per month** (Regular / Premium / Scale) ≈ ₹5,150 / ₹10,400 / ₹52,500 (ESTIMATE FX). Partner platform: **€500/mo + €25 per channel** | Meta rates passed through | **0%** (page says no markup) | VERIFIED\* — [360dialog pricing](https://360dialog.com/pricing) |
| **Twilio** | ₹0 | Meta rate + **$0.005/message (≈₹0.48)**, inbound or outbound, including free-form service replies | Utility goes from ₹0.115 to ≈₹0.60, about 5× | VERIFIED\* — [Twilio WhatsApp pricing](https://www.twilio.com/en-us/whatsapp/pricing) |
| **Pinbot, Exotel WhatsApp, Kaleyra, Tata Smartflo WhatsApp** | Not found | Not found | Not found | Gap. A Smartflo WhatsApp listing exists at [SoftwareSuggest](https://www.softwaresuggest.com/smartflo-whatsapp-business) but no price was extracted |

**Meta Tech Provider programme (for white-label resale)**
- **Path:** business verification in Meta Business Manager, plus 2FA, then App Review for **`whatsapp_business_management`** and **`whatsapp_business_messaging`**. Both need **Advanced Access** for production. You can test in Development Mode with test users while review is pending. VERIFIED\* — [Meta: Become a Tech Provider](https://developers.facebook.com/documentation/business-messaging/whatsapp/solution-providers/get-started-for-tech-providers); [Infobip guide](https://www.infobip.com/docs/whatsapp/tech-provider-program/setup-and-integration); [Twilio ISV programme](https://www.twilio.com/docs/whatsapp/isv/tech-provider-program).
- **Common App Review rejections:** weak permission justification, unclear use-case description, a missing screencast, or asking for unnecessary permissions. VERIFIED\* (partner docs) — [Telnyx tech-provider docs](https://developers.telnyx.com/docs/messaging/whatsapp/embedded-signup/tech-provider).
- **Embedded Signup version:** new projects should use **Embedded Signup v4**. Version 2 reportedly shuts down on **15 Oct 2026** (already passed today). This is a single secondary source, so check Meta's changelog. VENDOR CLAIM — [simplesdesk.com.br](https://simplesdesk.com.br/blog/como-ser-tech-provider-meta-whatsapp).
- **Partner route instead:** BSPs such as Twilio, Infobip, Telnyx and 360dialog run "ISV / Tech Provider" programmes where the CRM embeds their signup and the BSP holds the BSP role. 360dialog prices this "Partner" plan at €500/mo + €25 per channel. VERIFIED\* — [Twilio integration guide](https://www.twilio.com/docs/whatsapp/isv/tech-provider-program/integration-guide); [360dialog pricing](https://360dialog.com/pricing).

**API and webhooks for an external CRM**
- Gupshup and 360dialog are API-first. They have no inbox lock-in and are priced per message or per number. VENDOR CLAIM / VERIFIED\* — sources in the table above.
- Interakt, AiSensy and WATI do offer developer APIs and webhooks. **Gap:** my search on their reseller and API terms hit the budget limit, so plan-level API gating is unverified.

**Template approval time**
- **Gap:** not researched (search budget exhausted).

### Inferences
- **Monthly cost per client, a realistic small builder:**
  - Usage: 2,000 marketing broadcasts, 3,000 utility follow-ups, 1,500 service replies (1,000 free).
  - Platform fee assumed at the cheapest plan with API access. Excluding GST.
  - These are my calculations (ESTIMATE) from the rates above.

| Route | Platform | Marketing 2,000 | Utility 3,000 | Service 500 billable | **Total ₹/mo** |
|---|---|---|---|---|---|
| Meta Cloud API direct (Tech Provider) | 0 | 1,726 | 345 | 58 | **≈ 2,130** |
| Gupshup self-serve (+₹0.0965 on ≈8,000 messages in and out) | 0 | 1,726 | 345 | 58 | **≈ 2,900** |
| 360dialog Regular | ≈5,150 | 1,726 | 345 | 58 | **≈ 7,280** |
| AiSensy Basic | 1,500 | 2,180 | 435 | 73 | **≈ 4,190** |
| Interakt Growth | 2,799 | 1,940 | 450 | 64 | **≈ 5,250** |
| WATI Pro (annual) | 4,899 | n/a | n/a | n/a | **> 7,000** (markup not quantified) |
| Twilio (+₹0.48 on ≈8,000 messages) | 0 | 1,726 | 345 | 58 | **≈ 5,990** |

- **The planned CRM prices can't absorb these costs.** WhatsApp alone at a BSP costs ₹4,000–7,000 against the planned ₹3,999–7,999 tiers. WhatsApp must be a **pass-through add-on** (wallet or recharge), or the client brings their own BSP account.
- **Best fit for a 2-person white-label team:**
  - **Phase 1 (Effort S–M):** "bring your own WABA." The client signs up on Meta Cloud API directly, or on AiSensy/Interakt, and pastes the token and phone-number ID into CRM settings. The CRM sends templates through the Graph API and receives the webhook via n8n or FastAPI.
  - **Phase 2 (Effort M–L):** become a Meta Tech Provider with Embedded Signup v4. Clients then onboard in-app on their own WABA under the agency's app.
  - **Risk:** App Review rejection or delay, and the agency becomes responsible for policy compliance across every client number.
- **Lock-in:** inbox-style BSPs (WATI, Interakt, AiSensy) keep chat history in their own UI. A CRM that wants "chat history in the CRM" should use raw Cloud API, Gupshup or 360dialog webhooks.
- **Upfront spend above ₹50,000:** none of the per-client options needs it monthly. Two flags:
  - WATI Pro billed annually ≈ ₹58,800 per client upfront.
  - 360dialog Scale or Partner at €500/mo ≈ ₹52,500/mo.

### Gaps
- Meta's official India rate card and the 1 Oct 2026 announcement could not be opened (domain blocked). Re-check at developers.facebook.com/docs/whatsapp/pricing.
- Not found:
  - Pinbot, Exotel WhatsApp and Kaleyra pricing.
  - Template approval times.
  - Plan-level API access for Interakt, AiSensy and WATI.
  - Any Meta fee for joining the Tech Provider programme. No fee is known.
  - Multi-number limits per WABA.
- The WATI price conflict (₹4,499 vs ₹4,899 vs ₹5,999 vs ₹6,499 for Pro) is unresolved. Prices probably moved during 2025–26.

---

## Q2. Telephony: virtual numbers, click-to-call API, call logs and recording, KYC and DLT

### Takeaway
There are two workable tiers for a 2-person team.
1. **SIM-based call logging (Callyzer-style, about ₹161–175 per phone per month, plus ₹150 for API/webhook).** Cheapest, no KYC, uses the staff member's own number. Effort **S**.
2. **Cloud telephony with a click-to-call API.** Exotel exposes a documented "Connect Two Numbers" API with a StatusCallback webhook and recording URL. Entry bundles start around **₹9,999** (Exotel) or **₹950 per license per month plus ₹5,000 one-time** (Tata Smartflo Lite).

Twilio and Plivo are poor fits for India domestic calling: Twilio's official India outbound rate is ≈ ₹6.75/min.

### Cited Findings

**Exotel**
- **Plans:** Dabbler **₹9,999**, Believer **₹19,999**, Influencer **₹49,499**. Validity differs by source:
  - Capterra India lists Micro ₹5,555 for 3 months, Dabbler ₹9,999 for 6 months, Believer ₹19,999 for 12 months, Influencer ₹49,499 for 12 months.
  - A different listing shows ₹9,999 for 5 months with 3 agents and **₹199 per extra agent per month**.
  - VENDOR CLAIM / directory, **CONFLICT** — [Dialnexa](https://dialnexa.com/blogs/exotel-pricing/); [Capterra](https://www.capterra.com/p/233144/Exotel/); [SwadeshiApps](https://swadeshiapps.com/communication/exotel).
- **Usage:** per-minute voice, SMS, number rental and DLT pass-through are charged on top. A dated figure of **₹0.40/min** for local incoming was cited and could not be confirmed. Calls are billed in 30- or 60-second pulses. VENDOR CLAIM (competitors), **flag: possibly older figures** — [Dialnexa](https://dialnexa.com/blogs/exotel-pricing/); [Bonvoice](https://bonvoice.com/insights/exotel-pricing-vs-bonvoice/).
- **Influencer proposal breakdown:** **₹10,499** software rental for 12 months plus **₹39,000** usage balance. In other words, most of the price is prepaid usage credit. VENDOR CLAIM — [Dialnexa](https://dialnexa.com/blogs/exotel-pricing/).
- **Click-to-call API ("Connect Two Numbers"):**
  - `POST /v1/Accounts/<sid>/Calls/connect(.json)` with Basic auth.
  - Exotel rings the agent ("From") first, then the lead ("To"), and bridges the two legs.
  - The **StatusCallback** webhook takes form-data or JSON. `CustomField` metadata passes through, so a lead ID can be sent and returned.
  - `Record=true` delivers the **RecordingUrl** to the StatusCallback. Recording can be single or dual channel, in mp3 or mp3-hq.
  - India base URL is `api.in.exotel.com` (Mumbai); `api.exotel.com` is Singapore.
  - VERIFIED\* — [Exotel Connect Two Numbers v3](https://developer.exotel.com/docs/voice-v3/api-reference/connect-two-numbers); [Voice v1 quickstart](https://developer.exotel.com/docs/voice-v1/quickstart); [Outgoing calls](https://developer.exotel.com/docs/call-support/call-features/outgoing-calls).
  - The docs disagree on callback event names: `terminal/answered` versus `initiated/ringing/answered/completed`. Test before relying on either. VERIFIED\*, **CONFLICT** (same sources).

**MyOperator**
- Sedan plan **₹5,000/month for 10 users, billed yearly** (so about ₹60,000 upfront). Includes IVR, unlimited calling, **call recording** and WhatsApp. Other sources say ₹2,500/mo for 3 users, or ₹200 per user per month. VENDOR CLAIM / directory, **CONFLICT** — [appadvisor.in](https://appadvisor.in/software/myoperator); [Capterra](https://www.capterra.com/p/159433/MyOperator/); [FreJun](https://frejun.com/myoperator-alternative/).

**Knowlarity**
- Reported at ₹1,499–1,999 per agent per month, or a ₹5,000/mo missed-call plan. No public INR price list. VENDOR CLAIM (competitor blogs) — [FreJun](https://frejun.com/cloud-telephony-providers-for-small-businesses-india/); [beehiiv list](https://abhinavs.beehiiv.com/p/cloud-telephony-providers-in-india).

**Servetel**
- "From ₹1,500/mo" in one source; "contact sales" in another. VENDOR CLAIM, **CONFLICT** — same sources as Knowlarity.

**Tata Tele Business Smartflo**
- **Lite:** ₹950 per license per month plus **₹5,000 one-time**, 5-level IVR, minimum 3-month tenure (₹2,850 at sign-up). VERIFIED\* — [Tata Tele Smartflo virtual number](https://www.tatatelebusiness.com/features/smartflo-virtual-phone-number/).
- **Pro:** ₹1,250 per license per month plus ₹10,000 one-time; includes softphone and PSTN. VERIFIED\* — same source.
- A Tata reseller lists Lite ₹950, ITS ₹1,000 and Pro ₹1,250, with ₹5,000–10,000 setup. VENDOR CLAIM — [Infinian](https://infinian.net/tata-cloud-telephony-services/).
- Smartflo also offers a "mobile number series" product. VERIFIED\* — [Tata Tele](https://www.tatatelebusiness.com/features/smartflo-mobile-number-series/).
- Whether DIDs and minutes are extra is not stated.

**Ozonetel**
- **$25 / $45 / $55 per user per month** (annual) ≈ ₹2,400 / ₹4,340 / ₹5,310. VENDOR CLAIM (competitor CloudTalk) — [CloudTalk](https://www.cloudtalk.io/blog/ozonetel-pricing/).

**Twilio India**
- Official page lists India local outbound at **$0.0699/min ≈ ₹6.75/min**. Third-party pages claim far lower rates (≈$0.0075/min; ₹0.35/₹0.65 per minute), which I distrust. VERIFIED\* for the official figure, **CONFLICT** — [Twilio India voice pricing](https://www.twilio.com/en-us/voice/pricing/in); [edesy.in](https://edesy.in/blog/twilio-voice-pricing-guide-2026).

**Plivo**
- $0.50/mo for a local number (general rate, not India-specific). Rs 0.55–0.90/min claimed by a comparison site. VERIFIED\* / VENDOR CLAIM — [Plivo voice pricing](https://www.plivo.com/voice/pricing/); [CloudTalk](https://www.cloudtalk.io/plivo-vs-twilio/).

**Callyzer (SIM-based Android call logging)**
- **Price:** **₹161 per number per month** (FAQ; "₹1,610 for 10 people"). The cost calculator shows ₹175 per employee per month.
- **Add-ons:**
  - **API + Webhook + Zapier + Make: ₹150 per phone number per month**. Webhook syncs call logs in real time.
  - **Call recording storage: ₹500 per 5 GB per month**.
  - Zoho integration: ₹150 per number. Lead management: ₹100 per employee.
- VERIFIED\* — [Callyzer pricing](https://callyzer.co/pricing/); [cost calculator](https://callyzer.co/custom-cost-calculator/); [telecalling CRM page](https://callyzer.co/telecalling-crm/).

**TRAI / DLT rules**
- **Number series and DND:**
  - **1600-series** numbers (government and regulated-entity service calls) cannot be blocked or tagged by apps.
  - **140-series** promotional calls can be blocked through the DND registry, including **category-wise blocking (real estate is a category)**.
  - VENDOR CLAIM / news — [Outlook Business](https://www.outlookbusiness.com/news/phone-calls-from-1600-number-series-cannot-be-blocked-dnd-app-can-block-calls-from-140-series-trai); [DT Next](https://www.dtnext.in/news/business/phone-calls-from-1600-number-series-cannot-be-blocked-dnd-app-can-block-calls-from-140-series-trai).
- **TCCCPR amendment of 12 Feb 2025:** reported to raise penalties to **₹2,00,000 for a first violation, rising to ₹10,00,000** from the third. Five valid complaints in a rolling 10 days reportedly trigger service suspension. VENDOR CLAIM (compliance blogs), **unverified against the gazette** — [FreJun](https://frejun.com/140-series-number-india-guide-2026/); [Elision](https://www.elisiontec.com/140-and-160-series-regulations-from-trai-complete-guide-faqs/).
- **Enforcement:** over 731,000 notices were sent to unregistered telemarketers in 2025 (PIB-based claim). VENDOR CLAIM — [FreJun](https://frejun.com/trai-compliance-call-centers/).
- **DLT:** all platforms require DLT registration for commercial use. VENDOR CLAIM — [CloudTalk](https://www.cloudtalk.io/plivo-vs-twilio/).

### Inferences
- **Option ranking for a budget broker or builder CRM (my assessment, ESTIMATE):**
  1. **Callyzer-style SIM logging.**
     - Cost: ₹161 + ₹150 API ≈ **₹311 per phone per month**. For 5 phones: ₹1,555; for 15: ₹4,665.
     - Pros: no KYC or virtual number; calls come from the agent's own SIM, which buyers recognise; webhook goes to n8n and then to the lead timeline. Effort **S** (webhook mapping by phone number).
     - Cons: Android only; the agent's personal number is exposed; recordings depend on the phone; no IVR.
  2. **Exotel Connect-Two-Numbers.** Effort **M**: click-to-call button → FastAPI → Exotel; StatusCallback → call log and recording URL. Each client needs its own Exotel account and KYC (or the agency resells, taking on DLT/KYC liability). Entry bundles of ₹9,999–19,999 are prepaid; Influencer at ₹49,499 is just under the ₹50,000 flag.
  3. **Tata Smartflo Lite.** ₹950 per user per month plus ₹5,000 one-time. Cheapest licensed virtual-number option seen. API capability not verified.
- **Avoid for domestic calling:** Twilio and Plivo. At ≈₹6.75/min (Twilio official), 1,000 minutes ≈ ₹6,750.
- **Lock-in:** telephony providers own the virtual number. Porting a DID between Indian cloud-telephony providers is generally not possible (ESTIMATE; not verified), so a client changing providers loses the number their buyers know.
- **Compliance:** outbound calls to leads who have not consented, if they look promotional, carry TCCCPR risk. The CRM should record lead source and consent timestamps (consent capture is covered in the brief's DPDP section).

### Gaps
- Not found:
  - Official current per-minute rates for Exotel, Knowlarity, MyOperator, Servetel and Ozonetel in INR.
  - DID rental per number.
  - Recording retention and storage limits for the cloud providers.
  - KYC document lists.
- Not found: the DoT licensing position for an agency **reselling** telephony (OSP / virtual network operator rules). That search went unanswered.
- Not verified: whether Tata Smartflo and MyOperator expose public click-to-call APIs and webhooks.
- Not researched (budget exhausted): how TeleCRM, Privyr and Kylas implement calling, believed to be SIM-based through their mobile apps.

---

## Q3. Portal lead integrations: 99acres, MagicBricks, Housing.com, NoBroker, Square Yards, CommonFloor, PropTiger

### Takeaway
None of these portals publishes a self-serve public API.
- **99acres and MagicBricks** push leads to a **CRM webhook URL that the portal's account manager registers** (or that is pasted into a "Push API" setting in the dashboard).
- **Housing.com** offers a **pull API** (builder leads endpoint, HMAC-signed with a key and timestamp).
- **NoBroker, Square Yards, CommonFloor and PropTiger** are described by third parties as push-URL sources, with no official docs found.
- **Email-alert parsing** is the universal fallback, but it is brittle.
- **Build plan:** one generic `/inbound/portal/{source}` webhook per client (n8n or FastAPI), plus a Housing.com poller, plus an email-parser fallback. Effort **M** in total.

### Cited Findings

**99acres**
- **LeadSquared** connector supports **periodic sync using 99acres credentials** or **real-time sync**, where LeadSquared generates a webhook URL that is set up in the 99acres account. VERIFIED\* (competitor help centre), **flag: about 877 days old (≈ May 2024)** — [LeadSquared: Integrate 99acres](https://help.leadsquared.com/integrate-99acres-with-leadsquared/); [LeadSquared 99acres page](https://www.leadsquared.com/99acres-integration/).
- **TeleCalling CRM** docs describe a "Push API / Webhook" setting under Lead Management in the 99acres dashboard. VENDOR CLAIM — [TeleCalling CRM docs](https://telecallingcrm.com/docs/99acres-housing-magicbricks-leads).
- **Kylas** "Property Portals" app connects 99acres and MagicBricks; it asks for the Kylas API key during setup. VENDOR CLAIM — [Kylas MagicBricks integration](https://kylas.io/features/integrations/magicbricks).

**MagicBricks**
- **LeadSquared:** copy the generated webhook URL, then **"reach out to your account manager from MagicBricks"** to configure it. An older (≈2018) article describes a key-based polling connector. VERIFIED\* (competitor help centre), **flag: older than 18 months** — [LeadSquared: Integrate MagicBricks](https://help.leadsquared.com/integrate-magicbricks-with-leadsquared/); [MagicBricks connector walkthrough](https://support.leadsquared.com/support/solutions/articles/3000074355-magicbrick-connector-walkthrough).
- **Privyr:** you send your MagicBricks account manager a request to set it up. Not self-serve. VERIFIED\* (competitor help centre), **flag: about 1,020 days old (≈ Jan 2024)** — [Privyr: Connecting to MagicBricks](https://help.privyr.com/knowledge-base/magicbricks-integration/).
- **Lead format:** MagicBricks reportedly delivers leads as **URL parameters**. VENDOR CLAIM — [TeleCalling CRM docs](https://telecallingcrm.com/docs/99acres-housing-magicbricks-leads).
- **Other CRMs with MagicBricks connectors:** 3Sigma CRM and an Odoo module. VENDOR CLAIM — [3Sigma](https://help.3sigmacrm.com/features/integrations/magicbricks); [Odoo app](https://apps.odoo.com/apps/modules/13.0/magicbricks_integration).

**Housing.com**
- **Pull API:** a developer integration document lists `https://leads.housing.com/api/v0/getbuilderleads`, authenticated with an **HMAC-SHA256 hash of key + timestamp**. VENDOR CLAIM (third-party PDF, not Housing.com's own docs) — [fivecorner CRM API document](https://fivecorner.in/resource/lead_images/127/CRM%20API%20Documentation.pdf).
- Another CRM says Housing.com (and Real Estate India) need a "pull type integration" using username, password and user ID. VENDOR CLAIM — [Leadrat API docs](https://apidocs.leadrat.com/index.php/docs/technical-documentation-for-crm-api-integration-with-third-party-providers/).
- LeadSquared and HelloGrowthCRM list Housing integrations; no steps were extracted. VENDOR CLAIM — [LeadSquared Housing](https://www.leadsquared.com/integrations/housing/); [HelloGrowthCRM](https://hellogrowthcrm.com/integrations/housing-com).

**NoBroker, Square Yards, CommonFloor, PropTiger (and Makaan, JustDial)**
- Listed as **"push URL" sources** in an open-source CRM project. The same project says its Housing.com pull API "has not been run against live accounts." USER REPORT (unofficial GitHub PR) — [GitHub vaibhavpetkar/CRM PR #29](https://github.com/vaibhavpetkar/CRM/pull/29).
- Square Yards CRM integration is offered by a third-party integrator. VENDOR CLAIM — [RealtorsRobot](https://www.realtorsrobot.com/real-estate-online-portal-integration/square-yards-crm-integration).
- **No official NoBroker, Square Yards, PropTiger or CommonFloor developer docs were found.**

**General patterns and pitfalls**
- **Delivery methods:** portals send leads by API, email notification (parsed by the CRM) or webhook. VENDOR CLAIM — [Tranquil CRM](https://www.tranquilcrm.com/blog/real-estate-crm-integration-property-listing).
- **Sell.Do's own 2026 guide:** confirm whether your portal package includes API or webhook delivery and use it. Treat email parsing as a fallback, because portals change templates without notice; alert on parse failures. "Project" and "locality" are the fields most often empty. VENDOR CLAIM — [Sell.Do blog: Portal Leads 2026](https://www.sell.do/blog/real-estate-portal-leads-99acres-magicbricks-housing-2026).
- **Fallback route:** use the portal's lead export or email alerts with an email-to-sheet parser when no direct integration exists. VENDOR CLAIM — [RMDialer](https://rmdialer.com/blog/connect-portal-leads-99acres-magicbricks-indiamart/).
- **Source tags:** portal feeds often reach CRMs through third-party integrators or CSV routines that lose source tags. VENDOR CLAIM — [Sell.Do vs LeadSquared vs Zoho](https://www.sell.do/blog/sell-do-vs-leadsquared-vs-zoho-real-estate-crm-india-2026).

### Inferences
- **How the best 3 competitors solve it:**
  - **LeadSquared:** a native connector per portal; real-time via webhook, or polling with portal credentials.
  - **Kylas:** a "Property Portals" marketplace app (99acres and MagicBricks), configured with an API key.
  - **Privyr and TeleCRM-style tools:** the customer emails the portal account manager a webhook URL.
  - **Sell.Do:** advertises 99acres, MagicBricks and Housing capture with tagging and dedupe; exact mechanism not extracted.
- **Cheapest build on this stack (ESTIMATE):**
  1. A per-client FastAPI endpoint `POST /api/inbound/{source}?token=…`. It accepts JSON, form or query-string payloads (MagicBricks sends URL parameters), maps fields per source, and reuses the existing same-phone dedupe and auto-assignment. Effort **S**.
  2. A Housing.com poller (n8n cron, HMAC header). Effort **S–M**, but it needs credentials from the Housing account manager.
  3. An email-parsing fallback: n8n IMAP trigger on a `leads@<client>` mailbox, with regex per portal template and an alert on parse failure. Effort **S** per portal; ongoing maintenance risk.
  4. A one-page "Send this URL to your 99acres / MagicBricks account manager" instruction with a copy button. That is how competitors onboard.
- **Cost:** ₹0 in API fees. Portal-side webhook delivery may depend on the client's paid portal package (Sell.Do hints at this).
- **Risks:** portals can change payloads or email templates without notice; account-manager turnaround is outside our control; no official SLA or docs.

### Gaps
- Not found: official developer documentation from any of the seven portals. Not found: whether webhook delivery is free or tied to a package tier.
- Not found: NoBroker integration details from any source.
- The LeadSquared and Privyr help pages are 2.5–3 years old. Current steps may differ.
- Not extracted: Sell.Do's own help-centre steps.

---

## Q4. Meta Lead Ads and Google Ads lead form assets: webhook/API options, permissions, limits, n8n support

### Takeaway
- **Google Ads lead forms** are simple: a webhook URL plus a `google_key` set in the lead form asset, a "Send test data" button, and no API approval. Effort **S**.
- **Meta Lead Ads** need a Meta app subscribed to each client's Page for the `leadgen` field, plus **App Review** for `leads_retrieval`, `pages_manage_ads` and `pages_manage_metadata` (for webhooks). The webhook carries only `leadgen_id`, so a Graph API fetch follows.
- **n8n's Facebook Lead Ads Trigger** has known problems: stuck "pending" in Development mode, and one webhook URL per app.
- **For white-label:** run **one agency-owned, App-Reviewed Meta app** and route by `page_id` to each client's CRM. Don't build one app per client.

### Cited Findings

**Meta Lead Ads**
- **Permissions (Meta):** lead retrieval needs App Review including **`leads_retrieval`** and **`pages_manage_ads`**. **`pages_manage_metadata`** is needed when using webhooks. VERIFIED\* — [Meta Lead Ads guide](https://developers.facebook.com/documentation/ads-commerce/marketing-api/guides/lead-ads); [Retrieving Leads](https://developers.facebook.com/documentation/ads-commerce/marketing-api/guides/lead-ads/retrieving).
- **Setup:** choose the **Page** object and subscribe to the **`leadgen`** field. The field becomes selectable only after Meta verifies the endpoint. VERIFIED\* / USER REPORT — [Meta Webhooks for Leadgen](https://developers.facebook.com/docs/graph-api/webhooks/getting-started/webhooks-for-leadgen/); [n8n community](https://community.n8n.io/t/how-to-setup-facebook-trigger-fb-app-for-lead-forms/14317).
- **Payload:** contains only a `leadgen_id`; a separate Graph API call fetches the field data. VENDOR CLAIM — [architjn.com (2026)](https://www.architjn.com/blog/meta-leads-crm-automation-hubspot-n8n-webhooks-2026).
- **Third-party permission list:** `leads_retrieval` is the core permission and `pages_manage_metadata` subscribes Page webhooks; webhooks need App Review. This guide's five-permission list differs from Meta's. VENDOR CLAIM, **CONFLICT on exact list** — [LeadSync](https://leadsync.me/blog/meta-lead-gen-api-guide/).
- **n8n trigger stuck:** verified webhook, `leadgen` subscribed, workflow active, but the Facebook Lead Ads Trigger never fired. The poster was on n8n Cloud in Development mode. USER REPORT — [n8n community thread](https://community.n8n.io/t/facebook-lead-ads-trigger-webhook-verified-but-stuck-on-pending-no-executions/248985).
- **n8n single-URL limit:** Facebook allows **one webhook URL per app**, so several Lead Ads Trigger workflows overwrite each other. A workaround thread is about 964 days old. USER REPORT, **flag: older than 18 months** — [n8n community: multiple forms and pages](https://community.n8n.io/t/facebook-lead-ads-multiple-form-and-page/192118); [n8n community](https://community.n8n.io/t/how-to-setup-facebook-trigger-fb-app-for-lead-forms/14317).

**Google Ads lead form webhook**
- **Implementation:** validate the incoming **`google_key`** against the value configured in Google Ads; ignore unrecognised fields for forward compatibility; payload has an **`is_test`** flag. VERIFIED\* — [Google Lead Form Webhook implementation](https://developers.google.com/google-ads/webhook/docs/implementation); [Samples](https://developers.google.com/google-ads/webhook/docs/samples).
- **Testing:** "Send test data" in the lead form asset editor shows a green status when the CRM returns **HTTP 200**. You can also test with curl and a sample payload. VERIFIED\* — [Google testing docs](https://developers.google.com/google-ads/webhook/docs/testing); [Google Ads Help: webhook integration for a lead form](https://support.google.com/google-ads/answer/16729613?hl=en).
- **Test-key quirk:** one report says test sends arrived with an **empty `google_key`**, so strict key checks may reject test leads. USER REPORT (older GitHub issue) — [formtools issue #643](https://github.com/formtools/core/issues/643).
- **Other setup guides:** [Tealium](https://docs.tealium.com/server-side/data-sources/webhooks/google-ads-leads/); [CustomerLabs](https://www.customerlabs.com/blog/webhooks-google-ads-integration-setup/). VENDOR CLAIM.

### Inferences
- **Google Ads (Effort S):**
  - Add `POST /api/inbound/google-ads` per client with a per-client key stored in settings.
  - Accept `is_test`, tag it, and skip assignment.
  - Return 200 quickly.
  - Instruction for the client: "paste URL + key in lead form asset → Send test data".
  - No Google Ads API or developer token needed. ₹0.
- **Meta Lead Ads (feature already works via n8n):**
  - **White-label risk:** if each client's n8n copy uses its own Meta app, every client needs Development-mode test users or App Review. If they share one app, the single-webhook-URL limit means **one central receiver** must fan out by `page_id` to the right client container.
  - **Recommended (Effort M):** one agency Meta app with Business Verification and App Review for `leads_retrieval`, `pages_manage_ads`, `pages_manage_metadata` and `pages_show_list` (the last is my assumption). Then a central FastAPI or n8n receiver that maps `page_id` to the client, fetches the lead via Graph API using that client's stored Page token, and POSTs it to the client CRM.
  - **Fallback (no App Review):** the client connects Meta Lead Ads through Zapier, Make or LeadsBridge. That adds per-client cost (not priced).
- **Same app, two products:** the Meta app and Business Verification would also serve the WhatsApp Tech Provider path (Q1). One review effort covers both.
- **Competitors:** Sell.Do, LeadSquared and Kylas all list native Facebook and Google lead connectors. Not verified this session, beyond the LeadSquared portal docs.

### Gaps
- Not obtained: Meta Graph API rate limits for lead retrieval and the current permission list, because developers.facebook.com could not be opened.
- Not found: n8n official docs for the Facebook Lead Ads Trigger node and the Google Ads lead-form webhook. Search budget exhausted.
- Not found: Google lead-form limits (fields, retention of leads in Google Ads, retry behaviour on non-200 responses).

---

## Q5. Reminders: daily digest email vs WhatsApp utility template vs web push; cost per user and opt-in rules

### Takeaway
- **Start with the daily digest email** over the existing Hostinger SMTP. Marginal cost ≈ ₹0; Effort **S**.
- **Add a WhatsApp utility-template reminder** as a paid upsell: 30 messages per user per month × ₹0.115 ≈ **₹3.45 per user per month** at Meta rates, or ₹4.2–4.8 via Interakt or AiSensy, excluding GST.
- **Web push** costs ₹0 to send, but on iPhone it needs an installed PWA. Treat it as part of the PWA project (Effort M).
- **Staff opt-in for WhatsApp** can be collected in the CRM profile (checkbox plus number). **Buyer reminders** (site-visit reminders) need documented buyer opt-in and approved utility templates.

### Cited Findings
- **Utility and service rates:**
  - India utility rate **₹0.115 per message**.
  - From 1 Oct 2026, service (in-window free-form) messages are billed at the same rate after **1,000 free per number per month**.
  - VENDOR CLAIM — [DEV Community](https://dev.to/preciousky_45d956626d31c3/whatsapp-business-platform-pricing-in-rupees-and-the-two-things-that-change-on-1-october-2026-4ko0); [360dialog blog](https://360dialog.com/blog/whatsapp-service-message-charging-october-2026/).
- **BSP utility prices:** AiSensy **₹0.145** per utility message; Interakt **₹0.140–0.160**; Gallabox **₹0.1323**. VENDOR CLAIM — [mark360.ai](https://mark360.ai/blog/aisensy-pricing-2026); [getitsms](https://getitsms.com/blogs/interakt-whatsapp-business-api-pricing-vs-getitsms/); [codingclave](https://codingclave.com/blog/gallabox-pricing-india-2026).
- **Twilio:** adds **$0.005 (≈₹0.48)** to every WhatsApp message. VERIFIED\* — [Twilio WhatsApp pricing](https://www.twilio.com/en-us/whatsapp/pricing).
- **In-window utility templates:** whether they stay free after 1 Oct 2026 is disputed (see Q1). VENDOR CLAIM, **CONFLICT** — [ChatMaxima](https://chatmaxima.com/blog/whatsapp-service-message-pricing-october-2026/).
- **Not researched:** iOS web push rules (16.4+, home-screen install), Meta opt-in policy text, and competitors' reminder features. The search budget was exhausted before these queries ran.

### Inferences
- **Cost per sales user per month (ESTIMATE):** one reminder digest a day × 30 days = 30 messages. Excluding GST.

| Channel | Unit cost | Per user/month | 15-user team/month | Notes |
|---|---|---|---|---|
| Daily digest email (Hostinger SMTP) | ≈ ₹0 | ≈ ₹0 | ≈ ₹0 | Hostinger daily send limits not verified |
| WhatsApp utility template, Meta direct | ₹0.115 | ₹3.45 | ₹52 | Needs the client's WABA and an approved template |
| WhatsApp utility template, AiSensy | ₹0.145 | ₹4.35 | ₹65 | Plus ₹1,500/mo platform fee if not already paid |
| WhatsApp utility template, Interakt | ₹0.14–0.16 | ₹4.2–4.8 | ₹63–72 | Plus ₹2,799/mo platform fee |
| WhatsApp via Twilio | ≈₹0.115 + ₹0.48 | ≈ ₹18 | ≈ ₹270 | Poor value |
| Web push (VAPID / Web Push protocol) | ₹0 | ₹0 | ₹0 | Needs a service worker; iOS needs an installed PWA (training knowledge, not verified this session) |

- **Cheaper WhatsApp variant (fragile):** if a staff member messages the client's WhatsApp number each day (e.g. replies "OK"), the 24-hour window opens and the next digest could go as a **free-form service message**. For a 15-user team (≈450 per month) that stays under the free 1,000 per number. But it depends on staff replying daily. Use the utility template as the default and service messages opportunistically.
- **Opt-in (my assessment; Meta policy text not verified this session):**
  - **Staff:** the business is messaging its own employees, so a CRM-profile opt-in (number plus consent checkbox plus timestamp) should be enough.
  - **Buyers:** site-visit or booking reminders must be utility-category templates, with the opt-in captured at lead source (form consent text) and stored per lead. Marketing-style wording risks Meta re-classifying the template as marketing (7.5× cost) and harming quality rating.
- **How competitors solve reminders:** not verified this session. Believed (training knowledge, unverified) that TeleCRM, Privyr and Kylas rely on **mobile-app push notifications** and that Sell.Do also sends email/SMS/WhatsApp alerts. Treat as unverified.
- **Sequence (ESTIMATE):**
  1. Email digest (S, ₹0; ships the "no reminders" fix this month).
  2. WhatsApp staff reminder as part of the WhatsApp add-on (S once the WABA integration from Q1 exists).
  3. Web push with the PWA (M).
- **Risks:** email deliverability from a shared Hostinger mailbox (SPF/DKIM per client domain); WhatsApp template rejection or recategorisation; iOS users who never install the PWA get no push.

### Gaps
- Not verified: Meta's opt-in and Business Messaging policy text, and template approval SLAs.
- Not verified: iOS/Safari web push requirements and limits in 2026. Not verified: Android Chrome push reliability on Xiaomi/Oppo/Vivo battery-optimised phones, which are common among Indian field sales staff.
- Not verified: Hostinger SMTP daily sending limits per mailbox.
- Not found: competitor help-centre evidence on reminder implementations (Sell.Do, TeleCRM, Privyr, Kylas). Search budget exhausted.
- The cost table is an ESTIMATE built from VENDOR CLAIM rates, not from Meta's own rate card.
