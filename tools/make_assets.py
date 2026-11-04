#!/usr/bin/env python3
"""Sinh ảnh cho site công ty từ nguồn gốc (logo, icon game): logo sáng cho nền tối, favicon, ảnh OG 1200x630.
Chạy: python3 tools/make_assets.py   (cần Pillow). Nguồn nằm ở tools/source/."""
from pathlib import Path
from PIL import Image, ImageDraw, ImageFont

ROOT = Path(__file__).resolve().parent.parent
SRC = ROOT / "tools" / "source"
OUT = ROOT / "src" / "assets"
IMG = OUT / "img"
(IMG / "og").mkdir(parents=True, exist_ok=True)

logo = Image.open(SRC / "logo.png").convert("RGBA")
icon = Image.open(SRC / "game-icon.png").convert("RGBA")

def resize(im, n): return im.resize((n, n), Image.LANCZOS)

def tint(im, rgb):
    out = Image.new("RGBA", im.size, rgb + (0,))
    out.putalpha(im.getchannel("A"))
    return out

# Logo xanh gốc (schema Organization, nền sáng) + bản sáng cho header nền tối
resize(logo, 512).save(IMG / "logo-512.png", optimize=True)
light = tint(logo, (124, 196, 234))
resize(light, 96).save(IMG / "logo-light-96.png", optimize=True)

# Favicon theo logo công ty (nền tối bo tròn để dễ nhìn trên tab sáng/tối)
def badge(n):
    bg = Image.new("RGBA", (n, n), (0, 0, 0, 0))
    ImageDraw.Draw(bg).rounded_rectangle((0, 0, n - 1, n - 1), n // 5, fill=(11, 18, 32, 255))
    g = resize(light, int(n * .8))
    bg.alpha_composite(g, ((n - g.width) // 2, (n - g.height) // 2))
    return bg
badge(180).convert("RGB").save(OUT / "apple-touch-icon.png", optimize=True)
badge(32).save(OUT / "favicon-32.png")
badge(48).save(OUT / "favicon.ico", sizes=[(16, 16), (32, 32), (48, 48)])

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
    lines, cur = [], ""
    for w in text.split():
        t = (cur + " " + w).strip()
        if draw.textlength(t, font=fnt) <= maxw: cur = t
        else: lines.append(cur); cur = w
    if cur: lines.append(cur)
    return lines

def og(name, title, sub, badge_text):
    im = gradient().convert("RGBA")
    im.alpha_composite(resize(light, 300), (W - 400, 110))
    d = ImageDraw.Draw(im)
    x0 = 70
    d.text((x0, 70), badge_text.upper(), font=font(26), fill=(255, 176, 0))
    f1 = font(84); y = 140
    for line in wrap(d, title, f1, 720):
        d.text((x0, y), line, font=f1, fill=(255, 255, 255)); y += 98
    f2 = font(34, bold=False); y += 14
    for line in wrap(d, sub, f2, 720):
        d.text((x0, y), line, font=f2, fill=(201, 213, 230)); y += 46
    im.paste(Image.new("RGBA", (W, 12), (255, 122, 47, 255)), (0, H - 12))
    im.convert("RGB").save(IMG / "og" / f"{name}.png", optimize=True)

og("company-en", "Thanh Danh Soft", "Mobile game studio in Hai Phong, Vietnam. Makers of Rain Of Fire: War Defense.", "thanhdanh.pro.vn")
og("company-vi", "Thanh Danh Soft", "Studio game di động tại Hải Phòng, Việt Nam. Nhà phát hành Rain Of Fire: War Defense.", "thanhdanh.pro.vn")
print("ok")
