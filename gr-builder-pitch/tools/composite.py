"""Put our real screens into the blank screens of the AI photos (after composite_reference.py).

The white blob of the blank screen gives both the 4 corners and the mask, so a thumb over the screen stays on top.
A phone lying flat (07) takes its corners along its own long/short axes (PCA), and the call screen is turned to match.
Photo 02 (sofa) shows the back of the phone, so it gets no screen.
Writes gen/photos/<photo>.jpg and gen/quads.json.
    python tools/composite.py
"""
import asyncio
import json
from pathlib import Path

import numpy as np
from PIL import Image, ImageFilter
from scipy import ndimage

from browser import launch_args

ROOT = Path(__file__).resolve().parent.parent
A = ROOT / "assets"
GEN = ROOT / "gen"
OUT = GEN / "photos"; OUT.mkdir(parents=True, exist_ok=True)

# photo -> (screen key, search region x0,y0,x1,y1 or None)
JOBS = {
    "02-buyer-sofa": ("plain", None), "02b-buyer-sofa-tall": ("plain", None),
    "03-thumb-tap": ("project", None), "03b-thumb-tap-tall": ("project", None),
    "07-morning-call": ("ring_rot", (900, 700, 1320, 960)), "07b-morning-call-tall": ("ring_rot", (650, 1000, 1010, 1260)),
    "08-site-visit": ("plain", None), "08b-site-visit-tall": ("plain", None),
    "09-handshake-keys": ("plain", None),
    "10-owner-analytics": ("overview", None),
}


async def render_project():
    from playwright.async_api import async_playwright
    async with async_playwright() as p:
        b = await p.chromium.launch(**launch_args())
        pg = await b.new_page(viewport={"width": 1080, "height": 2340})
        await pg.goto((ROOT / "src/screens/project.html").as_uri())
        await pg.evaluate("document.fonts.ready")
        await pg.wait_for_timeout(300)
        await pg.screenshot(path=str(GEN / "project.png"))
        await b.close()


def screen(key):
    if key == "project":
        return Image.open(GEN / "project.png").convert("RGB")
    if key == "ring_rot":
        return Image.open(A / "ai-calling/01-morning-ai-calling-ringing.png").convert("RGB").rotate(90, expand=True)
    if key == "overview":
        return Image.open(GEN / "layers/c12.jpg").convert("RGB")
    raise KeyError(key)


def coeffs(dst, w, h):
    """PIL PERSPECTIVE coefficients mapping output (photo) coords -> input (screen) coords."""
    src = [(0, 0), (w, 0), (w, h), (0, h)]
    M, B = [], []
    for (x, y), (u, v) in zip(dst, src):
        M += [[x, y, 1, 0, 0, 0, -u * x, -u * y], [0, 0, 0, x, y, 1, -v * x, -v * y]]; B += [u, v]
    return np.linalg.solve(np.array(M, float), np.array(B, float)).tolist()


def main():
    asyncio.run(render_project())
    quads = {}
    for name, (scr, region) in JOBS.items():
        photo = Image.open(A / f"photos/{name}.jpg").convert("RGB")
        if scr == "plain":
            photo.save(OUT / f"{name}.jpg", quality=94); continue
        a = np.asarray(photo).astype(int)
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
        if scr == "ring_rot":  # lying at an angle: corners along its own long (u) and short (v) axes
            P = np.stack([xs, ys], 1).astype(float); c = P.mean(0)
            _, vec = np.linalg.eigh(np.cov((P - c).T)); u = vec[:, 1]; u = u if u[0] > 0 else -u
            v = np.array([-u[1], u[0]]); v = v if v[1] > 0 else -v
            pu, pv = (P - c) @ u, (P - c) @ v
            # oriented box from the blob's extents along its own axes (robust to the rounded corners)
            u0, u1 = np.percentile(pu, [0.3, 99.7]); v0, v1 = np.percentile(pv, [0.3, 99.7])
            corner = lambda a_, b_: tuple(int(round(t)) for t in c + u * a_ + v * b_)
            q = [corner(u0, v0), corner(u1, v0), corner(u1, v1), corner(u0, v1)]
        if name == "10-owner-analytics":
            # the wall screen runs off the top of the frame: corners from its edge lines
            # (top y = 139 - .49(x - 995), bottom y = 600 + .2(x - 995), bezel at x = 1510)
            q = [(995, 139), (1510, -113), (1510, 703), (995, 600)]
        quads[name] = q
        sc = screen(scr)
        warped = sc.transform(photo.size, Image.PERSPECTIVE, coeffs(q, sc.width, sc.height), Image.BICUBIC)
        whiteness = np.clip((a.min(axis=2) - 175) / 50, 0, 1)
        region_m = ndimage.binary_dilation(blob, iterations=3)
        m = Image.fromarray((whiteness * region_m * 255).astype(np.uint8)).filter(ImageFilter.GaussianBlur(.8))
        Image.composite(warped, photo, m).save(OUT / f"{name}.jpg", quality=94)
        print(name, q)
    (GEN / "quads.json").write_text(json.dumps(quads, indent=1))


if __name__ == "__main__":
    main()
