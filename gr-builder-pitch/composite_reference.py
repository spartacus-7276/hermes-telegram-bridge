"""Put our real screens onto the blank screens in the AI photos.
The white blob of the blank screen gives both the 4 corners and the mask, so a thumb over the screen stays on top.
Writes img/c_<photo>.jpg + dev/quads.json + check/_composites.jpg."""
import json
from pathlib import Path
import numpy as np
from PIL import Image, ImageFilter
from scipy import ndimage

ROOT = Path(__file__).resolve().parent.parent
D = Path(r"C:\Users\Admin\Desktop\Golden Ratio Creatives\12 Ecosystem video")
AI = D / "07 AI images (ChatGPT)"
OUT = ROOT / "img"; OUT.mkdir(exist_ok=True)

PROJ = D / "02 Websites we built" / "OLD marketplace - 03 Single project page - phone.png"
BTN = D / "02 Websites we built" / "WhatsApp button (transparent).png"
WA2 = ROOT / "img" / "wa2_6.jpg"            # final chat state, made by screens step
RING = D / "05 AI calling" / "01 Morning - AI calling (ringing).png"
CRM = D / "04 CRM screens"

# photo -> (screen image, search region x0,y0,x1,y1 or None)
JOBS = {
    # 02 / 04: he looks at his screen, so the camera sees the back of the phone: no screen to fill
    "02-buyer-sofa": ("plain", None), "02b-buyer-sofa-tall": ("plain", None), "04b-buyer-smiles-tall": ("plain", None),
    "03-thumb-tap": ("proj_btn", None), "03b-thumb-tap-tall": ("proj_btn", None),
    "04-buyer-smiles": ("plain", None),
    "05-admin-office": (CRM / "02b Admin - Karan picked for Rohan.png", None),
    "06-sales-call": (CRM / "07 Rohan - site visits.png", None),
    # 07: the phone lies face up on the table, long side across the frame: the call screen is turned to match
    "07-morning-call": ("ring_rot", (900, 700, 1320, 960)), "07b-morning-call-tall": ("ring_rot", (650, 1000, 1010, 1260)),
    "10-owner-analytics": (CRM / "12 Admin - company overview after booking.png", None),
}


def screen(key):
    if key in ("proj", "proj_btn"):
        im = Image.open(PROJ).convert("RGBA")
        if key == "proj_btn":
            b = Image.open(BTN).convert("RGBA"); w = int(im.width * .86)
            b = b.resize((w, round(b.height * w / b.width)), Image.LANCZOS)
            im.alpha_composite(b, ((im.width - w) // 2, int(im.height * .80)))
        return im.convert("RGB")
    if key == "ring_rot":
        return Image.open(RING).convert("RGB").rotate(90, expand=True)
    if key == "wa2":
        return Image.open(WA2).convert("RGB")
    return Image.open(key).convert("RGB")


def coeffs(dst, w, h):
    """PIL PERSPECTIVE coefficients mapping output (photo) coords -> input (screen) coords."""
    src = [(0, 0), (w, 0), (w, h), (0, h)]
    A, B = [], []
    for (x, y), (u, v) in zip(dst, src):
        A += [[x, y, 1, 0, 0, 0, -u * x, -u * y], [0, 0, 0, x, y, 1, -v * x, -v * y]]; B += [u, v]
    return np.linalg.solve(np.array(A, float), np.array(B, float)).tolist()


quads, tiles = {}, []
for name, (scr, region) in JOBS.items():
    photo = Image.open(AI / f"{name}.png").convert("RGB"); a = np.asarray(photo).astype(int)
    if scr == "plain":
        photo.save(OUT / f"c_{name}.jpg", quality=93); t = photo.copy(); t.thumbnail((520, 520)); tiles.append(t); print(name, 'plain'); continue
    white = (a.min(axis=2) > 228) & ((a.max(axis=2) - a.min(axis=2)) < 22)
    if region:
        x0, y0, x1, y1 = region; keep = np.zeros_like(white); keep[y0:y1, x0:x1] = True; white &= keep
    white = ndimage.binary_opening(white, iterations=2)
    lab, k = ndimage.label(white)
    big = int(np.argmax(ndimage.sum(white, lab, range(1, k + 1)))) + 1
    blob = ndimage.binary_fill_holes(lab == big)
    ys, xs = np.nonzero(blob); s, d = xs + ys, xs - ys
    q = [(int(xs[s.argmin()]), int(ys[s.argmin()])), (int(xs[d.argmax()]), int(ys[d.argmax()])),
         (int(xs[s.argmax()]), int(ys[s.argmax()])), (int(xs[d.argmin()]), int(ys[d.argmin()]))]
    if scr == "ring_rot":          # a phone lying at an angle: corners along its own long (u) and short (v) axes
        P = np.stack([xs, ys], 1).astype(float); c = P.mean(0)
        w_, vec = np.linalg.eigh(np.cov((P - c).T)); u = vec[:, 1]; u = u if u[0] > 0 else -u; v = np.array([-u[1], u[0]]); v = v if v[1] > 0 else -v
        pu, pv = (P - c) @ u, (P - c) @ v
        corner = lambda su, sv: tuple(int(t) for t in P[np.argmax(su * pu / np.abs(pu).max() + sv * pv / np.abs(pv).max())])
        q = [corner(-1, -1), corner(1, -1), corner(1, 1), corner(-1, 1)]
    quads[name] = q
    sc = screen(scr)
    warped = sc.transform(photo.size, Image.PERSPECTIVE, coeffs(q, sc.width, sc.height), Image.BICUBIC)
    # mask: how white the photo pixel is, inside the slightly grown screen blob -> thumbs and bezels stay
    whiteness = np.clip((a.min(axis=2) - 175) / 50, 0, 1)
    region_m = ndimage.binary_dilation(blob, iterations=3)
    m = Image.fromarray((whiteness * region_m * 255).astype(np.uint8)).filter(ImageFilter.GaussianBlur(.8))
    # a touch of screen glow so it sits in the scene
    out = Image.composite(warped, photo, m)
    out.save(OUT / f"c_{name}.jpg", quality=93)
    t = out.copy(); t.thumbnail((520, 520)); tiles.append(t)
    print(name, q)
(Path(__file__).with_name("quads.json")).write_text(json.dumps(quads, indent=1))
W = 2700; s = Image.new("RGB", (W, 1100), "#222"); x = y = 0
for t in tiles:
    if x + t.width > W: x, y = 0, y + 540
    s.paste(t, (x, y)); x += t.width + 8
s.save(ROOT.parent / "check" / "_composites.jpg", quality=85)
