# Golden Ratio builder pitch film: build prompt

You are the senior motion designer and engineer for Golden Ratio (goldenratiosolution.com), an Indian studio that builds a complete sales system for real-estate builders: website, WhatsApp AI, CRM, AI calling and analytics. Build the pitch film described below from the files in this folder. Work only inside `gr-builder-pitch/`.

<inputs>
Everything is in this folder. Do not ask me for anything.

- **`audio/timing.json`:** the final voice-over (14 lines, word-level times in seconds, `em` = the emphasised word). The voice is final: never re-time it, cut the picture to it.
- **`audio/vo/p01.wav` … `p14.wav`:** the trimmed voice clips (48 kHz mono). Clip `pNN` starts at that line's `start` in timing.json. The voice ends at 62.32 s; the film is 66.3 s.
- **`SCRIPT.md`:** the script, with what each line should show.
- **`assets/`** (`ASSETS.txt` lists every file with its size):
  - `brand/`: Golden Ratio logo kit; gold is #A9803F.
  - `whatsapp/`: two real Hinglish chats. "Northstar Homes" AI answers Karan and books a Sunday 11 AM site visit.
  - `crm/`: our real white-label CRM ("Northstar Homes" demo data):
    - 00 new-lead card (transparent);
    - 01 company overview;
    - 02 admin leads list with "Move to";
    - 02b Karan picked for Rohan;
    - 05 Rohan's home screen;
    - 06 Rohan's leads;
    - 07 site visits;
    - 09 board, booked;
    - 11 analytics;
    - 12 overview after booking.
  - `ai-calling/`: the ringing screen and the live call transcript (phone screens).
  - `sheet-tips/`: a Google Sheet row and the AI tips card (transparent).
  - `photos/`: AI photos with blank or back-facing phones (`b` = tall 2:3 version):
    - Karan on the sofa at night (02);
    - thumb tap (03);
    - phone face up on the breakfast table (07);
    - site visit (08);
    - keys handover (09);
    - owner at the wall screen (10).
- **`composite_reference.py`:** how we put our screens into the blank phones in those photos. It finds the white blob → four corners → perspective warp under a mask, keeping fingers on top, and uses PCA corners for a phone lying flat. It reads local paths, so treat it as reference and re-implement what you need.
- **`audio/mixlib_reference.py`:** our synthesized SFX (thump, chime, whoosh, impact, ring). Use the synth functions; the `foley()` sample files are NOT included.
- **No music file is included** (its licence doesn't allow re-publishing). Build the soundtrack as voice + SFX only. I add the music at home.
</inputs>

<direction>
A 66-second pitch film for real-estate builders and their sales heads, sent on WhatsApp. It should feel like a calm, expensive product film, not an agency reel. The desired reaction: "I'm losing buyers between the enquiry and the site visit, and this closes that."

**Concept, "one lead, never lost":**
- Karan's enquiry is a single object, the lead card, that is never cut away from.
- It is born as a missed call, then becomes a WhatsApp bubble, then the CRM lead card. Then it is handed to Rohan, rings as the AI call, turns green as "Booked", and finally folds into one dot on the analytics chart.
- Every scene is made out of that card or the screen it lives on. "Of course the next scene came from that."

**Style:**
- Warm off-white canvas #FBF8F3, ink #1A1712, one accent: GR gold #A9803F (green only for WhatsApp UI and the "Booked" state).
- Fonts: Inter for UI and captions, Instrument Serif italic for the one emphasised word per line (self-host the fonts; don't depend on Google at render time).
- Real screens are the hero. Cut them into layers (card, column, button) so parts move on their own. Never slide a whole flat screenshot around.
- The photos appear as full-bleed emotional moments only (sofa at night, morning call, keys handover), each no more than 2.5 s. Our real screen is composited into any phone the person is looking at.

**Camera and motion:**
- One camera language: slow push-ins (1.0 → 1.04 per scene); a new scene starts at the zoom where the last one ended.
- Critically damped springs, overshoot under 2%, staggered arrivals, no linear moves.
- Blur only follows fast motion.

**Captions:** in the captioned version only, typed word by word at the exact word times, bottom-centre, in a frosted pill. No full stops on screen. The `em` word is set in serif italic gold.

**Banned:** crossfades, particle bursts, glows on UI, lens flares, camera shake, 3D card spins, bouncy easing, stock "tech" HUDs, gradient blobs, a flat screenshot held more than 1 s with nothing moving on it, any number that looks like real customer data, and the names KEYS.BEYOND or Keys Beyond anywhere.
</direction>

<structure>
Times are in seconds from timing.json; each scene lands on its line's first word.

1. **0.0–5.2, hook (p01):**
   - The question types in big, centred, in two lines; "within an hour?" is in gold serif.
   - Behind it, a phone's missed-call list fills up one row per half-second ("+91 98… · 10:41 PM" style, fictional).
   - The last row is Karan's. It lifts off the list and becomes the lead object: a small gold-edged card.
2. **5.2–11.8, problem (p02, p03):**
   - The card flies into the phone in Karan's hand (photo 02, night). "10:40 PM" sets top-left as a clock.
   - On "three other builders", three grey competitor cards slide in behind his card and push it toward the frame edge.
3. **11.8–17.2, promise (p04):**
   - A cut to cream. The gold logo draws in.
   - A gold thread pulls tight from a chip "Enquiry" (left) to a chip "Site visit" (right), and Karan's card snaps onto the middle of the thread.
4. **17.2–27.6, WhatsApp AI (p05, p06):**
   - The card becomes the thumb tap on "Instant reply on WhatsApp" (photo 03).
   - Push into the phone. The real chat builds bubble by bubble, timed to the words: "prices" (options card), "brochure" (PDF bubble), "Hinglish" (his Hinglish message), "books" (the green "Site visit booked" bubble lands).
5. **27.6–38.8, CRM (p07, p08, p09):**
   - The booked bubble shrinks into the new-lead card (crm 00) and drops into the admin leads list (crm 02).
   - On "one click", a cursor clicks "Move to: Rohan" (crm 02b), and the card flies into Rohan's leads (crm 06).
   - On "today's follow-ups", it settles into his follow-ups (crm 05 / 07).
6. **38.8–44.6, AI calling (p10):**
   - The card turns into the ringing call screen, composited onto the phone lying face up on the breakfast table (photo 07). The live transcript then scrolls in a glass panel beside it.
   - On "confirm", a gold tick lands on the card.
7. **44.6–53.4, analytics + AI tips (p11, p12):**
   - Pull back to the owner at the wall screen (photo 10).
   - The company overview (crm 12) takes the frame. Karan's card folds into one dot on the bookings chart, and the leads, visits and bookings counters roll.
   - On "losing buyers", the AI tips card slides up with one tip highlighted.
8. **53.4–57.2, white label (p13):**
   - One CRM sign-in card stays fixed while its logo, name and colour flip on the three words:
     - Northstar Homes, gold;
     - "Skyline Developers", navy;
     - "Greenfield Realty", green.
   - These two extra brands are fictional and must look generic.
9. **57.2–66.3, close (p14):**
   - The sign-in card folds back into Karan's lead card, which becomes the keys-handover photo (09) in a rounded frame.
   - The gold Golden Ratio lockup resolves above it, "Book a free demo" sits under it, and a goldenratiosolution.com pill lands on "demo".
   - Hold still for the last 3 s.
</structure>

<build>
1. **Pages:** one HTML page for 1920x1080, plus a recomposed 1080x1920 version (re-laid out, not cropped: same story, closer framing, the tall `b` photos). Every style is computed from time inside `window.seek(t)`: no CSS animations or transitions, no timers, no Math.random (seeded only), no state between frames, so any frame renders on its own.
2. **Layered screens:** cut each screen into layers with Python/PIL first (transparent PNGs with known coordinates), so a part can move while the rest holds.
3. **Phones in photos:** composite our screens into the phones as described in `composite_reference.py`.
4. **Sound:**
   - Voice clips at their `start` times.
   - One soft synthesized SFX per event, placed by its peak: tick per missed-call row, pop per chat bubble, chime on "books", click on "Move to", two soft rings for the AI call, a soft impact on the logo.
   - Loudnorm to −14 LUFS, true peak −1 dBTP.
   - Also export `voice.wav` and `sfx.wav` stems, so I can add the music under them at home.
5. **Render:**
   - Playwright + Chromium headless, 60 fps; install with pip/npx as needed, plus static ffmpeg (imageio-ffmpeg is fine).
   - 4 motion-blur subframes per frame (t − 1/240 … t + 1/240), averaged.
   - Make the renderer resumable and frame-range based, so it can run in chunks.
   - Encode H.264 CRF 18 yuv420p. Deliver:
     - `out/builder-pitch-16x9.mp4` and `out/builder-pitch-9x16.mp4`;
     - captioned versions `-captions.mp4`;
     - 720p `-whatsapp.mp4` copies;
     - a poster JPG for each shape.
6. **QA before the full render:**
   - Render one still per scene (9 stills) for each shape into `out/stills/`.
   - Look at them yourself and fix anything cluttered, overlapping, off-time, unreadable, or showing a phone screen facing the wrong way.
   - After encoding, scan frame differences for single-frame pops.
7. **Commit and push:** commit the source, the stills and the `out/` MP4s to this branch, and push.
</build>

<gotchas>
- **Phones:** a phone screen must face the person looking at it; never show a lit screen facing the camera while someone looks at it. Photo 07's phone lies flat on the table, so warp the screen onto the phone's own axes.
- **Captions:** a caption that starts on a photo and continues over a UI screen must split at the cut (white text over photos, ink over cream), and must end at the next cut.
- **Text in the 9:16 version:** UI text needs a minimum of 22 px. Push in closer rather than shrinking.
- **Timing:** measure text only after fonts load, and await image decodes inside `seek(t)` before the screenshot.
- **preserve-3d:** never put opacity or filter on a preserve-3d element (it flattens); fade a wrapper instead.
- **Disk:** keep frames as JPEG q95 and delete them after encoding.
</gotchas>

<start>
First write the storyboard as a table: scene, time, voice line, what the lead card is doing, and the transition logic. Then build and render the 9 stills of the 16:9 version, commit them to `out/stills/`, push, and stop so I can review. After my OK, build everything else without asking anything more, push the MP4s, and tell me the file paths.
</start>
