# Video prompt v2 — Golden Ratio real-estate journey film

You are building this in a cloud session on the `gr-video` branch of this repository.
Read `gr-video/README.md` first for the environment setup and how to return the finished film.
Work inside `gr-video/`. Ignore any Windows path below — those come from the owner's own machine.

---

<inputs>
Ask me for: the project name to show on screen, the price to show, the WhatsApp number, the sales person's
name for the dashboard scene, and whether to include the Google Sheet scene. If I skip any, use these
defaults: project **"Skyline Residency, Wakad"**, price **₹[__]L** left as a visible placeholder,
WhatsApp **+91 98xxx 41208**, sales person **"Sneha"**, Google Sheet scene **on**.
Logo: `gr-video/assets/golden-ratio-logo.png` (stacked, gold). A horizontal lockup sits beside it if a
wide mark composes better on the end card. **These two PNGs are the only image files in the film** —
everything else is drawn in code.
</inputs>

<direction>
A **90-second explainer film**, 1920×1080, 30 fps, frames f0–f2699, for **Golden Ratio Solution**, shown to
**real estate developers in Pune**.

**This is a product film, not a motion-design showreel.** The quality bar is a Stripe or Linear product
film: calm, confident, precisely choreographed, every move purposeful. A developer who is not technical must
finish it understanding exactly what happens to a buyer from the first search to the booking. If a flourish
ever competes with that understanding, cut the flourish.

**The camera never cuts on a still frame.** Every shot enters already moving and leaves on an accelerating
move or a blur ramp. Blur follows speed and direction on every move: fast move, more blur, along the axis of
travel.

**Palette.** Page `#FFFFFF`, panels `#F6F7F9`, one dark scene `#16181D`. Ink `#16181D`, grey text `#6B7280`,
hairlines `#E6E8EC`. Accents carry meaning and never swap roles: green `#12A471` = the system working,
coral `#F4573B` = the problem, blue `#3E7BFA` = ads and data, gold `#C98A2B` = Golden Ratio only (logo and
end card). **No purple, no violet, no orange, no gradient backgrounds.**

**Type.** DM Sans 400/500/700, loaded from Google Fonts, `document.fonts.ready` awaited before frame 0.
Captions are the only large text: one line at a time, lower third, 56 px, 700 weight, entering with a 12 px
rise and a short blur, leaving upward. Never two captions on screen at once.

**People** are flat figures: circle head, cap hair, rounded-rect body, no faces beyond two eye marks and a
mouth line. **One buyer character, the same in every scene** — he is the thread.

**Language.** Plain. "It answers in nine seconds." Never "automation pipeline", "omnichannel", "CRM sync".
</direction>

<beatgrid>
120 BPM. One beat = 15 frames. **Every hard cut lands 2 frames before a beat** — keep these frames exactly:

| Cut | Frame | Into scene |
|---|---|---|
| 1 | f178 | Google ad |
| 2 | f418 | He leaves, Meta brings him back |
| 3 | f658 | The landing page |
| 4 | f958 | WhatsApp |
| 5 | f1498 | Saved to the sheet |
| 6 | f1678 | Dashboard |
| 7 | f2218 | AI calling |
| 8 | f2578 | Close |

Shot lengths must vary. The WhatsApp scene (18 s) and the dashboard (18 s) breathe; the ad beats are fast.
Do not make every shot the same length — contrast is what makes it feel directed.
</beatgrid>

<story>
**S1 · f0–177 · The hook.** Black-to-white. A phone lies on a dark surface, screen lighting the frame,
lock screen reading **10:42 PM**. The camera pushes in slowly the whole shot (scale 1.0 → 1.12, ease-out).
Caption: **"Someone is looking for a 2 BHK in Wakad. Right now."**

**S2 · f178–417 · Google.** The phone screen becomes the whole frame (the phone's screen rect expands to
fill — a scale transition, not a cut). A search field types `2 bhk in wakad ready possession` at about one
character every 2 frames, caret blinking. Three results slide up staggered 4 frames apart; the top one is the
client's project with a small **Ad** chip. The buyer's thumb comes in from the bottom and presses it; the
result card compresses 4% on the press.
Caption: **"We put you in front of people already searching."**

**S3 · f418–657 · He leaves, Meta brings him back.** The project page opens, he scrolls twice, then a back
arrow — the page slides away to the right and greys out. **Two full beats of nothing but the grey page**:
this pause is the problem, let it sit.
Then an Instagram feed scrolls vertically past, and **the same project** appears in it as an ad. He stops
scrolling, taps. A thin dotted line traces his path across the top of the frame: Google → away → Meta → back.
Captions: **"He left without enquiring."** → **"Meta brings him back."**

**S4 · f658–957 · The landing page.** Split screen for 45 frames: a dull grey template page on the left
crumples and falls away; on the right the real project page **builds itself** top to bottom — hero, price
band, floor plan thumbnail, RERA number, possession date, each element rising 20 px into place, staggered
6 frames. The left half closes like a door and the right page fills the frame.
A sticky bar locks to the bottom of the phone: **[ WhatsApp ]** green, **[ Call ]** outlined.
His thumb presses **WhatsApp**; the button flashes and the page tilts away.
Caption: **"One page per project. Built to make him ask."**

**S5 · f958–1497 · The WhatsApp AI.** The longest scene — it is the heart of the film.
A WhatsApp thread plays in real time. Bubbles arrive with a 3-frame pop (overshoot 6%), ticks turn blue
8 frames later. A small timer sits in the top right, starting the moment he sends.
- *(him)* "Is the 2 BHK still available?" — 10:44 PM
- *(us, 9 seconds later)* "Yes. 745 sq ft, ₹[__]L all inclusive, possession Dec 2027."
- *(us)* a document chip — "Floor plan and price list"
- *(us)* a map chip — "Location and amenities"
- *(us)* "To move in, or investing?"
- *(him)* "राहायला. शनिवारी बघू शकतो का?" — with a small English subtitle under the bubble
- *(us)* "Site visit booked — Saturday, 11 AM. Location sent."

**Hold on the timer reading 0:09** when the first reply lands — 20 frames, it is the number that sells.

Then he types **"call me"**. The reply: *"Sure — connecting you to our sales team now."* A green chip slides
in from the right: **Handed to a human**.
Captions, in order: **"It answers in seconds. At any hour."** → **"In his language."** →
**"And it hands over the moment he asks."**

**S6 · f1498–1677 · Saved automatically.** ⚠️ **Build this as a separate shot behind a flag
`SHOW_SHEET = true`** so I can cut it or change the destination later without touching the rest of the film.
A spreadsheet slides up and a row writes itself cell by cell, each cell landing on an eighth note:
`Rahul P. | 98xxx 41208 | Skyline Residency | WhatsApp | Site visit — Sat 11 AM`
Caption: **"Every lead writes itself down. Nothing is retyped."**

**S7 · f1678–2217 · The dashboard.** The sheet row lifts off the sheet and **becomes** a card in a clean
dashboard (same width, same text, the background changes around it).
- The card lands at the top of a list with a blue **WhatsApp** source tag and a timer chip "9 sec".
- A cursor drags it onto **Sneha — Sales**; her avatar snaps on with a small bounce.
- Cut to **her screen**: she opens the lead, a status dropdown falls open, she picks **Site visit scheduled**
  and the card's left edge turns amber.
- A "Saturday" label wipes across (a short time jump), she taps again: **Booking done**, the edge turns
  green, and a counter at the top ticks **11 → 12** with the digits rolling.
Captions: **"You see every lead the moment it lands."** → **"Give it to the right person."** →
**"And watch it become a booking."**

**S8 · f2218–2577 · AI calling.** Hard cut to the dark scene (`#16181D`) — the only dark shot in the film.
A list of old enquiries scrolls, greyed, headed **"Cold list — never called back"**. One row highlights, a
call connects, a waveform moves in time with the voice, and two lines of transcript type out:
- *(agent)* "Namaskar, you had enquired about Skyline Residency. Still looking?"
- *(lead)* "Haan, budget 80 lakh."
The row turns green, lifts out of the list and **flies into the same sheet and the same dashboard** from S6
and S7 — reuse those exact assets so the viewer recognises them.
Captions: **"The old list gets called too."** → **"Hot ones land in the same place."**

**S9 · f2578–2699 · Close.** Everything simplifies to white. Five dots draw across the centre with a line
between them — ad, page, WhatsApp, dashboard, booking — each lighting up in turn on the beat. The line
collapses into the Golden Ratio logo.
End card: **Golden Ratio Solution** / **goldenratiosolution.com** / **Book a free 30-minute check**.
Hold 40 frames. The last thing to move is a single gold underline sliding out under the name.
</story>

<matchcuts>
Transitions are where this film is won. Each scene must **become** the next, not cut to it. Required:

- **S1 → S2**: the phone's screen rectangle expands to become the whole frame.
- **S3 → S4**: the Instagram ad card he taps expands into the landing page.
- **S4 → S5**: the green WhatsApp button grows and becomes the green WhatsApp header bar of the chat.
- **S5 → S6**: the **blue double tick** on the last message scales up and becomes the **tick in the sheet's
  status cell**.
- **S6 → S7**: the sheet row keeps its exact position and width while the background changes around it into
  the dashboard — the row never moves.
- **S7 → S8**: the green "Booking done" dot shrinks to a point and becomes the glowing dot of the active
  call in the dark scene.
- **S8 → S9**: the call waveform flattens into the straight line of the five-dot journey.

Every one of these is a continuity cut on a shape that already exists on screen. No crossfades anywhere.
</matchcuts>

<banned>
Crossfades. Frozen frames except the two deliberate holds (the 0:09 timer, the end card). Spinning 3D logos.
Lens flares. Particle explosions. Fake UI kits with lorem text. Drop shadows on text. Stock "swoosh" wipes.
`Math.random` anywhere. Motion that does not serve the explanation. More than one caption on screen at once.
Any statistic I did not give you.
</banned>

<build>
1. **One HTML page, 1920×1080, drawn by `seek(frame)` as a pure function of the frame number.** No CSS
   transitions, no `requestAnimationFrame`, no timers, no `Math.random` (seeded hashes only). Any frame must
   be reproducible on its own — this is what makes the render restartable.
2. Shots register as `{f0, f1, render(localFrame)}`. Animate with keyframe tables
   `kf(frame, [[f, value], ...], ease)` with ease-out, ease-in-out and overshoot curves. Every value
   continuous in the frame number.
3. Blur: CSS `filter: blur()` for round blur; SVG `feGaussianBlur` with separate x/y `stdDeviation` for
   directional smear on fast moves.
4. One cursor asset (macOS arrow, black fill, white outline, soft shadow), reused across S2, S4, S7 with
   rotation and scale. One thumb asset for the phone presses.
5. `record.py` — Playwright at 1920×1080, `device_scale_factor=1`, steps f0→f2699, one screenshot per frame,
   then encodes. Make it **resumable**: skip frames already on disk.
6. `record.py --stills` builds a storyboard sheet.
7. Encode with ffmpeg: libx264, crf 19, preset slow, yuv420p, `+faststart`.
8. Plain `python3`. Set up with
   `pip install playwright pillow && playwright install --with-deps chromium`.
9. If the Artifact tool is available to you, read the illustrated pitch deck at
   https://claude.ai/artifact/DQoQiUKraL6ddE1r8HaX76 and reuse its drawing style so the film and the deck
   look like one family. If you cannot open it, build from the palette and the figure description in this
   brief alone — do not invent a different style.
</build>

<gotchas>
- Measure text only after the fonts load, or every layout shifts on the first frames.
- **Devanagari**: DM Sans has no Devanagari. Load **Noto Sans Devanagari** for that one bubble, and verify
  the glyphs actually render in a still before relying on them.
- Heavy blur tables can wipe a shape out completely. If a frame looks empty, lower the blur until the shape
  still reads.
- A white card on a white page disappears without a 1 px `#E6E8EC` edge and a faint shadow.
- Do not bake text into any image asset — it doubles against the real text.
- 2700 frames is a long render and a cloud session can be interrupted. **Build the resume logic before the
  first full run**, not after it fails: skip any frame whose PNG is already on disk.
- Commit the finished MP4 to the `gr-video` branch only, never to `main`. See `README.md`.
</gotchas>

<deliverables>
1. `out/gr-realestate-journey-90s.mp4` — 1920×1080, silent.
2. `out/gr-realestate-journey-9x16.mp4` — 1080×1920, **re-laid out, not cropped**: captions move, the phone
   fills more of the frame, the dashboard is shown two rows at a time.
3. `out/poster.jpg`.
4. `SCRIPT.md` — every on-screen word plus a voiceover script I can record or send to a voice artist.
5. A list of every placeholder and every invented name you used.

Silent by default — captions do the work and I add music in the app. If a voiceover is cheap to add, also
produce `out/with-vo.mp4` with edge-tts from the Hermes venv, Indian English, mixed low.
</deliverables>

<start>
Ask me for the inputs — post the questions in the chat and wait for my answers, do not assume. Then render
**four stills**, commit them to the branch, and stop:
**f300** (the Google search typed), **f1100** (the WhatsApp thread mid-conversation with the timer visible),
**f1900** (the dashboard with the lead assigned), **f2650** (the end card).
Wait for my approval on those four, then render the full film.
</start>

---
