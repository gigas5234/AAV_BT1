"""
Split the 7 event posters into animatable 2.5D layers.

For every poster:
  - each listed element is cut out with GrabCut (or a soft-edged rect for
    crowds/bands) into its own transparent WebP;
  - elements flagged `hole` are removed from a "clean plate" with multi-scale
    inpainting, so the element can pop in / move without revealing a copy of
    itself underneath;
  - everything is written at 2x (Lanczos + light unsharp) so camera zooms stay crisp.

    python assets-src/build_layers.py      ->  public/layers/*.webp + src/layers.json

Coordinates below are in ORIGINAL poster pixels (941 x 1672).
"""
import json
import os

import cv2
import numpy as np
from PIL import Image, ImageFilter

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(HERE)
SRC = os.path.join(HERE, "posters")
OUT = os.path.join(ROOT, "public", "layers")
os.makedirs(OUT, exist_ok=True)
UP = 2  # output scale

# name: (x0, y0, x1, y1), method, hole?, extra
# method: 'gc' = GrabCut, 'rect' = soft rect (feather px), 'none' = no cutout (hole only)
POSTERS = {
    "p01": {
        "file": "01_opening_bear_trap.png",
        "els": {
            "plaque": dict(r=(140, 85, 800, 266), m="gc", hole=True),
            "ribbon": dict(r=(12, 250, 880, 388), m="gc", hole=True),
            "title": dict(r=(52, 352, 884, 738), m="gc", hole=True),
            "bear": dict(r=(150, 760, 742, 1452), m="gc", hole=True, bg=[(588, 760, 742, 905)]),
            "bang": dict(r=(588, 762, 742, 905), m="color", hue=["red"], hole=True),
        },
    },
    "p02": {
        "file": "02_90k_no_limits.png",
        "els": {
            "banner": dict(r=(28, 292, 912, 522), m="gc", hole=True),
            "sign": dict(r=(118, 468, 872, 1078), m="gc", hole=True),
            "bear": dict(r=(0, 1040, 722, 1672), m="gc", hole=True),
            "troopsL": dict(r=(0, 1160, 175, 1520), m="rect", feather=30),
            "troopsR": dict(r=(560, 1170, 941, 1530), m="rect", feather=30),
        },
    },
    "p03": {
        "file": "03_full_troops.png",
        "els": {
            "sign": dict(r=(92, 282, 832, 638), m="gc", hole=True),
            "bear": dict(r=(18, 598, 402, 885), m="gc", hole=True),
            "fg": dict(r=(0, 1030, 941, 1672), m="rect", feather=90, edges="t"),
            "cav": dict(r=(380, 640, 941, 1150), m="rect", feather=70),
            "flagR": dict(r=(780, 780, 930, 945), m="rect", feather=16),
            "flagL": dict(r=(0, 380, 150, 650), m="rect", feather=16),
        },
    },
    "p04": {
        "file": "04_one_troop.png",
        "els": {
            "sign": dict(r=(38, 372, 872, 718), m="gc", hole=True),
            "bear": dict(r=(88, 700, 612, 1322), m="gc", hole=True, bg=[(515, 728, 690, 885), (150, 712, 305, 812)]),
            "qq": dict(r=(515, 728, 690, 885), m="color", hue=["red"], hole=True),
            "stars": dict(r=(150, 712, 305, 812), m="color", hue=["yellow"], hole=True),
            "soldier": dict(r=(606, 1236, 824, 1474), m="gc", hole=True, bg=[(686, 1136, 815, 1236)]),
            "bang": dict(r=(686, 1136, 815, 1236), m="gc", hole=True),
        },
    },
    "p05": {
        "file": "05_any_hero_cards.png",
        "els": {
            "banner": dict(r=(38, 248, 898, 472), m="gc", hole=True),
            "cards": dict(r=(108, 456, 842, 1146), m="none", hole=True),
            "bear": dict(r=(198, 1078, 742, 1462), m="gc", hole=True),
            "bpg": dict(r=(22, 1428, 918, 1628), m="gc", hole=True),
        },
    },
    "p06": {
        "file": "06_never_cancel.png",
        "els": {
            "sign": dict(r=(48, 282, 878, 758), m="gc", hole=True),
            "disc": dict(r=(392, 702, 884, 1218), m="gc", hole=True, bg=[(380, 860, 445, 1030)]),
            "bear": dict(r=(0, 738, 452, 1342), m="gc", hole=True, fg=[(4, 895, 172, 1052)]),
            "bar": dict(r=(0, 1332, 941, 1602), m="gc", hole=True),
        },
    },
    "p07": {
        "file": "07_target_reward.png",
        "els": {
            "emblem": dict(r=(118, 268, 818, 652), m="gc", hole=False),
            "ribbon": dict(r=(52, 902, 888, 1052), m="gc", hole=True),
            "chest": dict(r=(458, 1028, 918, 1372), m="gc", hole=True),
            "win": dict(r=(384, 1306, 932, 1548), m="gc", hole=True),
            "prize": dict(r=(394, 1518, 898, 1634), m="gc", hole=True),
            "bear": dict(r=(36, 1058, 452, 1672), m="gc", hole=True),
        },
    },
}


def grabcut(img, r, bg_rects=(), fg_rects=()):
    x0, y0, x1, y1 = r
    H, W = img.shape[:2]
    mask = np.zeros((H, W), np.uint8)  # GC_BGD
    mask[y0:y1, x0:x1] = cv2.GC_PR_FGD
    # a thin probable-background frame just inside the rect helps when the rect touches the image edge
    for bx0, by0, bx1, by1 in bg_rects:
        mask[by0:by1, bx0:bx1] = cv2.GC_BGD
    for fx0, fy0, fx1, fy1 in fg_rects:
        mask[fy0 + 6 : fy1 - 6, fx0 + 6 : fx1 - 6] = cv2.GC_PR_FGD
    bgd = np.zeros((1, 65), np.float64)
    fgd = np.zeros((1, 65), np.float64)
    cv2.grabCut(img, mask, None, bgd, fgd, 6, cv2.GC_INIT_WITH_MASK)
    m = np.where((mask == cv2.GC_FGD) | (mask == cv2.GC_PR_FGD), 255, 0).astype(np.uint8)
    # keep the biggest blobs (drop specks), fill holes
    n, lab, stats, _ = cv2.connectedComponentsWithStats(m, 8)
    keep = np.zeros_like(m)
    if n > 1:
        areas = stats[1:, cv2.CC_STAT_AREA]
        big = areas.max()
        for i, a in enumerate(areas, start=1):
            if a > big * 0.04:
                keep[lab == i] = 255
    m = keep
    m = cv2.morphologyEx(m, cv2.MORPH_CLOSE, np.ones((9, 9), np.uint8))
    # fill interior holes
    inv = cv2.bitwise_not(m)
    n, lab, stats, _ = cv2.connectedComponentsWithStats(inv, 4)
    for i in range(1, n):
        x, y, w, h, a = stats[i]
        if x > 0 and y > 0 and x + w < W and y + h < H and a < 25000:
            m[lab == i] = 255
    return m


def color_key(img, r, hues):
    """Pick saturated strokes (the !!! / ??? / stars) out of a light burst behind them."""
    x0, y0, x1, y1 = r
    hsv = cv2.cvtColor(img, cv2.COLOR_BGR2HSV)
    h, s_, v = hsv[..., 0], hsv[..., 1], hsv[..., 2]
    m = np.zeros(img.shape[:2], bool)
    for hue in hues:
        if hue == "red":
            m |= ((h < 7) | (h > 168)) & (s_ > 150) & (v > 120)
        elif hue == "yellow":
            m |= (h >= 12) & (h <= 38) & (s_ > 110) & (v > 120)
        elif hue == "dark":
            m |= v < 90
    out = np.zeros(img.shape[:2], np.uint8)
    out[y0:y1, x0:x1] = (m[y0:y1, x0:x1] * 255).astype(np.uint8)
    out = cv2.morphologyEx(out, cv2.MORPH_CLOSE, np.ones((5, 5), np.uint8))
    out = cv2.dilate(out, np.ones((3, 3), np.uint8))  # keep the dark outline
    return out


def rect_mask(shape, r, feather, edges="tblr"):
    H, W = shape[:2]
    x0, y0, x1, y1 = r
    m = np.zeros((H, W), np.float32)
    yy, xx = np.mgrid[y0:y1, x0:x1].astype(np.float32)
    a = np.ones_like(yy)
    if "t" in edges and y0 > 0:
        a *= np.clip((yy - y0) / feather, 0, 1)
    if "b" in edges and y1 < H:
        a *= np.clip((y1 - yy) / feather, 0, 1)
    if "l" in edges and x0 > 0:
        a *= np.clip((xx - x0) / feather, 0, 1)
    if "r" in edges and x1 < W:
        a *= np.clip((x1 - xx) / feather, 0, 1)
    m[y0:y1, x0:x1] = a
    return (m * 255).astype(np.uint8)


def inpaint_multiscale(img, hole):
    """Soft, painterly fill: inpaint at 1/3 scale, upsample, blend in with a feathered mask."""
    H, W = hole.shape
    k = 3
    small = cv2.resize(img, (W // k, H // k), interpolation=cv2.INTER_AREA)
    hs = cv2.resize(hole, (W // k, H // k), interpolation=cv2.INTER_NEAREST)
    hs = cv2.dilate(hs, np.ones((3, 3), np.uint8))
    filled = cv2.inpaint(small, hs, 9, cv2.INPAINT_TELEA)
    filled = cv2.GaussianBlur(filled, (0, 0), 2.2)
    up = cv2.resize(filled, (W, H), interpolation=cv2.INTER_CUBIC)
    soft = cv2.GaussianBlur(hole, (0, 0), 6).astype(np.float32)[..., None] / 255
    out = img.astype(np.float32) * (1 - soft) + up.astype(np.float32) * soft
    # a little grain so the fill doesn't look plastic
    grain = np.random.default_rng(3).normal(0, 2.2, out.shape).astype(np.float32)
    out = out + grain * soft
    return np.clip(out, 0, 255).astype(np.uint8)


def upscale(pil):
    big = pil.resize((pil.width * UP, pil.height * UP), Image.LANCZOS)
    return big.filter(ImageFilter.UnsharpMask(radius=2, percent=55, threshold=2))


def save_rgba(rgb_big, alpha_small, r, path):
    x0, y0, x1, y1 = r
    a = cv2.resize(alpha_small, (alpha_small.shape[1] * UP, alpha_small.shape[0] * UP), interpolation=cv2.INTER_LINEAR)
    a = cv2.GaussianBlur(a, (0, 0), 1.1)
    crop = rgb_big.crop((x0 * UP, y0 * UP, x1 * UP, y1 * UP)).convert("RGBA")
    crop.putalpha(Image.fromarray(a[y0 * UP : y1 * UP, x0 * UP : x1 * UP]))
    crop.save(path, "WEBP", quality=88, method=6)


import sys

only = sys.argv[1:]  # e.g. `python assets-src/build_layers.py p01 p04` rebuilds just those
man_path = os.path.join(ROOT, "src", "layers.json")
manifest = json.load(open(man_path, encoding="utf8")) if only and os.path.exists(man_path) else {}
for key, spec in POSTERS.items():
    if only and key not in only:
        continue
    bgr = cv2.imread(os.path.join(SRC, spec["file"]))
    rgb = cv2.cvtColor(bgr, cv2.COLOR_BGR2RGB)
    hole = np.zeros(bgr.shape[:2], np.uint8)
    layers = {}
    big_orig = upscale(Image.fromarray(rgb))
    for name, e in spec["els"].items():
        r = e["r"]
        if e["m"] == "gc":
            m = grabcut(bgr, r, e.get("bg", ()), e.get("fg", ()))
            for fx0, fy0, fx1, fy1 in e.get("fg", ()):  # forced pieces GrabCut tends to drop
                sub = color_key(bgr, (fx0, fy0, fx1, fy1), ["red", "yellow", "dark"])
                m = cv2.bitwise_or(m, sub)
            alpha = cv2.erode(m, np.ones((2, 2), np.uint8))
        elif e["m"] == "color":
            m = color_key(bgr, r, e["hue"])
            alpha = m
        elif e["m"] == "rect":
            alpha = rect_mask(bgr.shape, r, e["feather"], e.get("edges", "tblr"))
            m = (alpha > 0).astype(np.uint8) * 255
        else:
            m = np.zeros(bgr.shape[:2], np.uint8)
            x0, y0, x1, y1 = r
            m[y0:y1, x0:x1] = 255
            alpha = None
        if e.get("hole"):
            hole = cv2.bitwise_or(hole, cv2.dilate(m, np.ones((15, 15), np.uint8)))
        if alpha is not None:
            fn = f"{key}_{name}.webp"
            save_rgba(big_orig, alpha, r, os.path.join(OUT, fn))
            layers[name] = {"src": f"layers/{fn}", "x": r[0], "y": r[1], "w": r[2] - r[0], "h": r[3] - r[1]}
    # full original (for match cuts / end card) and the clean plate
    big_orig.save(os.path.join(OUT, f"{key}_full.webp"), "WEBP", quality=88, method=6)
    plate = inpaint_multiscale(bgr, hole)
    upscale(Image.fromarray(cv2.cvtColor(plate, cv2.COLOR_BGR2RGB))).save(os.path.join(OUT, f"{key}_plate.webp"), "WEBP", quality=88, method=6)
    manifest[key] = {"full": f"layers/{key}_full.webp", "plate": f"layers/{key}_plate.webp", "w": 941, "h": 1672, "layers": layers}
    print(key, "->", ", ".join(layers))

manifest = {k: manifest[k] for k in sorted(manifest)}
with open(man_path, "w", encoding="utf8") as f:
    json.dump(manifest, f, indent=1)
print("wrote src/layers.json")
