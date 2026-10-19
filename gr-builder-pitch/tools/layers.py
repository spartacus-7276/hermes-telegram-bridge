"""Cut the real screens into transparent layers with known coordinates, so parts can move on their own.

Writes gen/layers/*.png and gen/layers.json:
  {name: {"src": "layers/x.png", "x": .., "y": .., "w": .., "h": .., "sheet": "<screen id>", "sw": .., "sh": ..}}
x/y/w/h are in the source screen's own pixel space (sheet size sw x sh).

Also masks every lead phone number except Karan's obvious demo number (98765 43210),
so nothing on screen looks like real customer data.
    python tools/layers.py
"""
import json
from pathlib import Path

import numpy as np
from PIL import Image, ImageDraw, ImageFilter, ImageFont
from scipy import ndimage

ROOT = Path(__file__).resolve().parent.parent
A = ROOT / "assets"
OUT = ROOT / "gen" / "layers"
OUT.mkdir(parents=True, exist_ok=True)
INTER = str(ROOT / "fonts" / "Inter-Regular.otf")
META = {}
rng = np.random.default_rng(7)


def save(name, im, x, y, sheet, size):
    if im.mode == "RGB" and im.width * im.height > 3_000_000:  # big opaque sheets: JPEG keeps decode fast
        fn = f"{name}.jpg"; im.save(OUT / fn, quality=95, subsampling=0)
    else:
        fn = f"{name}.png"; im.save(OUT / fn, optimize=False, compress_level=3)
    META[name] = {"src": f"layers/{fn}", "x": int(x), "y": int(y), "w": im.width, "h": im.height,
                  "sheet": sheet, "sw": size[0], "sh": size[1]}


def crop(im, box, name, sheet):
    save(name, im.crop(box), box[0], box[1], sheet, im.size)


# ------------------------------------------------------------------ phone-number masking
def fake_number(i):
    return "98\u2022\u2022\u2022\u2022\u2022" + f"{int(rng.integers(100, 999))}"


def mask_numbers(im, x0, x1, rows, skip=()):
    """rows: list of (y0, y1) row bands. Finds the grey number line under the name and replaces it."""
    a = np.asarray(im.convert("RGB")).astype(int)
    d = ImageDraw.Draw(im)
    for i, (y0, y1) in enumerate(rows):
        if i in skip:
            continue
        top = y0 + int((y1 - y0) * 0.52)  # the number sits in the lower half of the cell, under the name
        y0 = top
        reg = a[y0:y1, x0:x1]
        mn, mx = reg.min(2), reg.max(2)
        grey = (mn > 95) & (mx < 200) & ((mx - mn) < 14)
        ys, xs = np.nonzero(grey)
        if len(ys) < 40:
            continue
        # the number is the lowest grey text line in the cell
        yb = ys.max()
        line = ys > yb - 40
        gy0, gy1 = ys[line].min(), ys[line].max()
        gx0, gx1 = xs[line].min(), xs[line].max()
        bg = tuple(int(v) for v in a[y0 + gy0 - 6, x0 + gx0 - 12])
        col = tuple(int(v) for v in np.median(reg[grey & (np.arange(reg.shape[0])[:, None] > gy0 - 2)], 0))
        bx = (x0 + gx0 - 3, y0 + gy0 - 3, x0 + gx1 + 4, y0 + gy1 + 4)
        d.rectangle(bx, fill=bg)
        h = gy1 - gy0 + 1  # digit height ~ cap height
        font = ImageFont.truetype(INTER, int(round(h / 0.727)))
        d.text((x0 + gx0, y0 + gy1 + 1), fake_number(i), font=font, fill=col, anchor="ls")
    return im


# ------------------------------------------------------------------ WhatsApp chats
def bubble_alpha(rgb, box):
    """Alpha for a chat bubble cut from the beige dotted wallpaper."""
    a = np.asarray(rgb.crop(box)).astype(int)
    beige = np.array([239, 231, 221]); dot = np.array([231, 223, 213])
    far = (np.abs(a - beige).sum(2) > 14) & (np.abs(a - dot).sum(2) > 14)
    far = ndimage.binary_closing(far, iterations=3)
    far = ndimage.binary_fill_holes(far)
    far = ndimage.binary_opening(far, iterations=2)
    m = Image.fromarray((far * 255).astype(np.uint8)).filter(ImageFilter.GaussianBlur(0.7))
    im = rgb.crop(box).convert("RGBA"); im.putalpha(m)
    return im


def whatsapp():
    w1 = Image.open(A / "whatsapp/01-chat-needs-and-options.png").convert("RGB")
    w2 = Image.open(A / "whatsapp/02-chat-brochure-and-visit-booked.png").convert("RGB")
    # Karan's Hinglish message: the brochure arrives before it in the film (voice order), so his
    # "Brochure bhej do." is removed and the line reads "...lag raha hai."
    ImageDraw.Draw(w1).rectangle((436, 2238, 912, 2312), fill=(217, 253, 211))
    crop(w1, (0, 0, 1560, 376), "wa_head", "wa")
    crop(w1, (0, 3176, 1560, 3376), "wa_foot", "wa")
    B1 = {"wa_today": (650, 420, 910, 532), "wa_k1": (296, 552, 1530, 838), "wa_ai1": (16, 840, 1272, 1200),
          "wa_opts": (16, 1196, 1105, 1838), "wa_aiq": (16, 1840, 1272, 2121), "wa_k2": (296, 2124, 1530, 2410)}
    B2 = {"wa_pdf": (16, 402, 1104, 753), "wa_aislot": (16, 756, 1216, 1033), "wa_slots": (16, 1036, 997, 1485),
          "wa_ksun": (995, 1488, 1530, 1705), "wa_done": (16, 1690, 1272, 2281), "wa_kthx": (872, 2284, 1530, 2493)}
    for n, b in B1.items():
        save(n, bubble_alpha(w1, b), b[0], b[1], "wa", w1.size)
    for n, b in B2.items():
        save(n, bubble_alpha(w2, b), b[0], b[1], "wa", w2.size)


# ------------------------------------------------------------------ AI calling
def calling():
    r = Image.open(A / "ai-calling/01-morning-ai-calling-ringing.png").convert("RGB")
    save("call_ring", r, 0, 0, "ring", r.size)
    c = Image.open(A / "ai-calling/02-morning-ai-reminder-call-live.png").convert("RGB")
    save("call_live", c, 0, 0, "live", c.size)
    crop(c, (0, 0, 1560, 1040), "call_top", "live")
    crop(c, (56, 1064, 1504, 1200), "tr_head", "live")
    for i, (y0, y1) in enumerate([(1222, 1534), (1595, 1744), (1798, 2038), (2083, 2242)]):
        crop(c, (56, y0, 1504, y1), f"tr_{i}", "live")
    crop(c, (56, 2712, 1504, 2944), "call_confirmed", "live")


# ------------------------------------------------------------------ CRM
def table(sheet, path, x0, x1, first, step, n, gap, numx, skip_mask=(), extra=None):
    im = Image.open(path).convert("RGB")
    rows = [(first + i * step, first + i * step + step - gap) for i in range(n)]
    rows = [r for r in rows if r[1] <= im.height]
    mask_numbers(im, numx[0], numx[1], rows, skip=skip_mask)
    for i, (y0, y1) in enumerate(rows):
        crop(im, (x0, y0, x1, y1 + gap), f"{sheet}_r{i}", sheet)
    bg = im.copy()
    d = ImageDraw.Draw(bg)
    d.rectangle((x0, rows[0][0], x1 - 1, im.height), fill=(255, 255, 255))
    if extra:
        extra(bg, d)
    save(f"{sheet}_bg", bg, 0, 0, sheet, im.size)
    return im


def crm():
    card = Image.open(A / "crm/00-new-lead-card-transparent.png").convert("RGBA")
    save("lead_card", card, 0, 0, "card", card.size)
    # 02 admin leads list: 10 rows of 130 px from y=1210, table card x 610..3758
    table("c02", A / "crm/02-admin-leads-move-to-a-sales-person.png", 612, 3757, 1210, 130, 9, 2,
          (640, 1100), skip_mask=(2,))
    # 02b: the same list scrolled 334 px; Karan's row picked for Rohan (gold-ruled)
    b = Image.open(A / "crm/02b-admin-karan-picked-for-rohan.png").convert("RGB")
    crop(b, (612, 1126, 3757, 1272), "c02b_karan", "c02")  # coordinates in its own sheet
    META["c02b_karan"]["y"] = 1126 + 334
    crop(b, (2550, 1172, 2800, 1228), "c02b_dd", "c02")  # the "Move to" dropdown set to Rohan Kulkarni
    META["c02b_dd"]["y"] = 1172 + 334
    # 06 Rohan's leads: rows of 138 px from y=316, table x 610..3758
    table("c06", A / "crm/06-rohan-my-leads.png", 612, 3757, 316, 138, 16, 2, (640, 815), skip_mask=(0,))
    # 05 Rohan home: mask Pranav's number in follow-ups, then cut the upcoming-visits rows
    h = Image.open(A / "crm/05-rohan-home-screen.png").convert("RGB")
    mask_numbers(h, 640, 815, [(2200, 2350)])
    save("c05", h, 0, 0, "c05", h.size)
    for i, (y0, y1) in enumerate([(944, 1028), (1030, 1114), (1116, 1200)]):
        crop(h, (612, y0, 3757, y1), f"c05_v{i}", "c05")
    # 07 site visits (Karan last row)
    v = Image.open(A / "crm/07-rohan-site-visits.png").convert("RGB")
    save("c07", v, 0, 0, "c07", v.size)
    # 12 overview after booking + 01 before: KPI numbers roll between the two
    o12 = Image.open(A / "crm/12-admin-company-overview-after-booking.png").convert("RGB")
    o01 = Image.open(A / "crm/01-admin-company-overview.png").convert("RGB")
    tiles = [(610, 1368), (1408, 2164), (2204, 2960), (3000, 3758)]
    num = (380, 470)  # number glyph band
    bg = o12.copy(); d = ImageDraw.Draw(bg)
    for i, (a0, a1) in enumerate(tiles):
        box = (a0 + 30, num[0], a0 + 400, num[1])
        crop(o12, box, f"kpi{i}_new", "c12")
        crop(o01, box, f"kpi{i}_old", "c12")
        d.rectangle(box, fill=(255, 255, 255))
    # the "Top performers" panel makes room for the bookings-by-channel card (drawn live in the page)
    d.rectangle((604, 596, 3764, 1188), fill=tuple(int(v) for v in np.asarray(o12)[560, 2000]))
    save("c12_bg", bg, 0, 0, "c12", bg.size)
    save("c12", o12, 0, 0, "c12", o12.size)
    tips = Image.open(A / "sheet-tips/02-ai-tips-card-transparent.png").convert("RGBA")
    save("tips", tips, 0, 0, "tips", tips.size)


if __name__ == "__main__":
    whatsapp(); calling(); crm()
    (ROOT / "gen" / "layers.json").write_text(json.dumps(META, indent=1))
    (ROOT / "gen" / "layers.js").write_text("window.LAYERS = " + json.dumps(META) + ";\n")
    tm = json.loads((ROOT / "audio" / "timing.json").read_text())
    for line in tm:
        line.pop("env", None)
    (ROOT / "gen" / "timing.js").write_text("window.TIMING = " + json.dumps(tm) + ";\n")
    print(len(META), "layers")
