# kiranjadhav.com redesign: TODO before going live

`index.html` is a single self-contained file (about 129 KB). Open it by double-clicking. These placeholders must be replaced first:

1. **WhatsApp number**: `WA_NUMBER = "919595113344"` at the top of the script. Confirm this number is WhatsApp-enabled (ideally WhatsApp Business).
2. **Webhook URL**: paste the n8n webhook into `WEBHOOK_URL` (empty means no POST is sent). The webhook must allow CORS from the site origin (`Access-Control-Allow-Origin`, `Content-Type` header, `POST, OPTIONS`).
3. **SEBI registration number**: `[INH000XXXXXX]` appears twice (credentials badge and footer compliance block).
4. **Logo file**: the wing mark is an inline SVG stand-in (`#i-wing` symbol and the favicon). Swap in the official logo.
5. **Dr. Kiran Jadhav photo**: portrait placeholder labelled `REPLACE: photo`.
6. **Testimonials**: four `[REPLACE: real testimonial]` cards. Use real, consented quotes only.
7. **Nagpur branch address**: `[REPLACE: Nagpur branch address]`. Also add it to the JSON-LD `department` list.
8. **Map embed**: grey block `[REPLACE: Google Maps embed for the Pune head office]`.
9. **Social links**: Facebook, LinkedIn, Telegram and YouTube use `href="#"` (`data-todo` attributes). X/Twitter is set to @kiran_jadhav_.
10. **Live PCR feed**: sample values 0.912 / 0.922 / 0.934 / 1.028. Call `KJ.renderPCR([["03:30 PM", 0.912], ...])` (newest first) from the live feed; colouring is computed automatically.
11. **Old page URLs**: every "Know more" link and both "Disclaimer" links currently point to the homepage. Set the real workshop and disclaimer page URLs (HTML comments and `data-todo` mark them).
12. **Referral terms URL**: "Terms and conditions" points to `/customers/knowledgebase.php`. Set the exact knowledgebase article.
13. **Bull-run record link**: footnote `[REPLACE: link to the published record]` for the "As documented by the firm" claim.
14. **"Seen in" logos**: three media logo placeholders.
15. **Payments line**: `[REPLACE: accepted payment methods as listed on the current site]` in the footer.
16. **Canonical / og:url**: set to the final production URL; add an `og:image` once a share image exists.
17. **Research table columns**: only the Breakout Stocks column set was supplied, so all five products reuse it. Confirm the columns for Swing Trading, Options, MTLT and Fundamental Calls.

## Design note
White text on WhatsApp green (#25D366) follows the brief but is about 2:1 contrast, below WCAG AA. To pass AA, set `--wa-ink: #0B1220` in `:root` (one line).
