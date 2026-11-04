#!/usr/bin/env python3
"""Sinh ảnh cho site từ nguồn gốc (logo công ty, icon game): logo, icon, favicon, ảnh OG 1200x630.
Chạy: python3 tools/make_assets.py   (cần Pillow). Nguồn nằm ở tools/source/."""
from pathlib import Path
from PIL import Image, ImageDraw, ImageFont, ImageFilter

ROOT = Path(__file__).resolve().parent.parent
SRC = ROOT / "tools" / "source"
OUT = ROOT / "src" / "assets"
IMG = OUT / "img"
(IMG / "og").mkdir(parents=True, exist_ok=True)

logo = Image.open(SRC / "logo.png").convert("RGBA")
icon = Image.open(SRC / "game-icon.png").convert("RGBA")

def resize(im, n): return im.resize((n, n), Image.LANCZOS)

# Logo công ty (xanh) chỉ dùng cho schema Organization
resize(logo, 512).save(IMG / "logo-512.png", optimize=True)

# Icon game
for n in (64, 256, 512):
    resize(icon, n).save(IMG / f"rain-of-fire-icon-{n}.png", optimize=True)
resize(icon, 180).convert("RGB").save(OUT / "apple-touch-icon.png", optimize=True)
resize(icon, 32).save(OUT / "favicon-32.png", optimize=True)
icon.resize((48, 48), Image.LANCZOS).save(OUT / "favicon.ico", sizes=[(16, 16), (32, 32), (48, 48)])

# Ảnh OG
W, H = 1200, 630
def font(size, bold=True):
    for p in ("/System/Library/Fonts/Supplemental/Arial Bold.ttf" if bold else "/System/Library/Fonts/Supplemental/Arial.ttf",
              "/System/Library/Fonts/Helvetica.ttc"):
        if Path(p).exists(): return ImageFont.truetype(p, size)
    return ImageFont.load_default()

def gradient():
    im = Image.new("RGB", (W, H), "#0b1220"); px = im.load()
    for y in range(H):
        t = y / H
        for x in range(W):
            r = 11 + int(70 * max(0, t - .45) * 2.2 + 40 * max(0, (x / W) - .55) * (1 - t))
            g = 18 + int(22 * max(0, t - .45) * 2.2)
            b = 32 + int(20 * (1 - t))
            px[x, y] = (min(r, 255), min(g, 255), min(b, 255))
    return im

def wrap(draw, text, fnt, maxw):
    words, lines, cur = text.split(), [], ""
    for w in words:
        t = (cur + " " + w).strip()
        if draw.textlength(t, font=fnt) <= maxw: cur = t
        else: lines.append(cur); cur = w
    if cur: lines.append(cur)
    return lines

def og(name, title, sub, badge, with_icon):
    im = gradient().convert("RGBA")
    # vòng radar trang trí
    ov = Image.new("RGBA", (W, H), (0, 0, 0, 0)); d = ImageDraw.Draw(ov)
    for r in (150, 260, 370):
        d.ellipse((W - 230 - r, H - 120 - r, W - 230 + r, H - 120 + r), outline=(74, 163, 208, 60), width=3)
    im = Image.alpha_composite(im, ov)
    d = ImageDraw.Draw(im)
    x0 = 70
    if with_icon:
        ic = resize(icon, 230)
        mask = Image.new("L", (230, 230), 0); ImageDraw.Draw(mask).rounded_rectangle((0, 0, 229, 229), 52, fill=255)
        im.paste(ic, (W - 330, 110), mask)
    d.text((x0, 70), badge.upper(), font=font(26), fill=(255, 176, 0))
    f1 = font(76)
    y = 130
    for line in wrap(d, title, f1, 700 if with_icon else 980):
        d.text((x0, y), line, font=f1, fill=(255, 255, 255)); y += 90
    f2 = font(34, bold=False)
    y += 14
    for line in wrap(d, sub, f2, 720 if with_icon else 980):
        d.text((x0, y), line, font=f2, fill=(201, 213, 230)); y += 46
    bar = Image.new("RGBA", (W, 12), (255, 122, 47, 255)); im.paste(bar, (0, H - 12))
    im.convert("RGB").save(IMG / "og" / f"{name}.png", optimize=True)

og("game-en", "Rain Of Fire: War Defense", "Missile-defense strategy game for Android and iOS. Free to play.", "Thanh Danh Soft", True)
og("game-vi", "Rain Of Fire: War Defense", "Game chiến thuật phòng thủ tên lửa cho Android và iOS. Miễn phí.", "Thanh Danh Soft", True)
print("ok")
