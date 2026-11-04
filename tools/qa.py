#!/usr/bin/env python3
"""Kiểm tra SEO kỹ thuật cho dist/ (chỉ dùng stdlib): python3 tools/qa.py"""
import json, re, sys
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import urlparse
import xml.etree.ElementTree as ET

DIST = Path(__file__).resolve().parent.parent / "dist"
problems, notes = [], []

class P(HTMLParser):
    def __init__(s):
        super().__init__(); s.title = ""; s._t = False; s.meta = {}; s.links = []; s.h = {"h1": [], "h2": [], "h3": []}
        s._h = None; s.a = []; s.img = []; s.ld = []; s._ld = False; s.canon = None; s.alts = {}; s.text = []; s.skip = 0
    def handle_starttag(s, tag, at):
        d = dict(at)
        if tag == "title": s._t = True
        if tag == "meta":
            k = d.get("name") or d.get("property")
            if k: s.meta[k] = d.get("content", "")
        if tag == "link":
            if d.get("rel") == "canonical": s.canon = d.get("href")
            if d.get("rel") == "alternate" and d.get("hreflang"): s.alts[d["hreflang"]] = d["href"]
        if tag in s.h: s._h = tag; s.h[tag].append("")
        if tag == "a" and d.get("href"): s.a.append(d["href"])
        if tag == "img": s.img.append(d)
        if tag == "script" and d.get("type") == "application/ld+json": s._ld = True; s.ld.append("")
        if tag in ("script", "style", "svg"): s.skip += 1
    def handle_endtag(s, tag):
        if tag == "title": s._t = False
        if tag in s.h: s._h = None
        if tag == "script": s._ld = False
        if tag in ("script", "style", "svg"): s.skip = max(0, s.skip - 1)
    def handle_data(s, data):
        if s._t: s.title += data
        if s._h: s.h[s._h][-1] += data
        if s._ld: s.ld[-1] += data
        if not s.skip: s.text.append(data)

pages = {}
for f in sorted(DIST.rglob("index.html")):
    rel = "/" + str(f.parent.relative_to(DIST)).replace("\\", "/") + "/"
    rel = "/" if rel == "/./" else rel
    p = P(); p.feed(f.read_text(encoding="utf-8")); pages[rel] = p

def exists(url):
    u = urlparse(url); path = u.path
    if path.endswith("/"): return (DIST / path.lstrip("/") / "index.html").exists()
    return (DIST / path.lstrip("/")).exists() or (DIST / path.lstrip("/") / "index.html").exists()

site = None
for rel, p in pages.items():
    words = len(re.findall(r"\w+", " ".join(p.text)))
    t, d = p.title.strip(), p.meta.get("description", "")
    if len(t) > 70: problems.append(f"{rel}: title dài {len(t)} (>70): {t}")
    elif len(t) > 60: notes.append(f"{rel}: title {len(t)} ký tự (có thể bị cắt)")
    if not 70 <= len(d) <= 165: problems.append(f"{rel}: description {len(d)} ký tự (nên 70-165)")
    if len(p.h["h1"]) != 1: problems.append(f"{rel}: có {len(p.h['h1'])} thẻ h1")
    if not p.canon: problems.append(f"{rel}: thiếu canonical")
    else:
        site = site or p.canon.split("/", 3)[0:3]
        if urlparse(p.canon).path != rel: problems.append(f"{rel}: canonical không tự trỏ ({p.canon})")
    for img in p.img:
        if "alt" not in img: problems.append(f"{rel}: <img {img.get('src')}> thiếu alt")
        if not img.get("width") or not img.get("height"): problems.append(f"{rel}: <img {img.get('src')}> thiếu width/height (CLS)")
    # hreflang: tự tham chiếu + hai chiều + x-default
    if "x-default" not in p.alts: problems.append(f"{rel}: thiếu x-default")
    for lang, href in p.alts.items():
        path = urlparse(href).path
        if not exists(href): problems.append(f"{rel}: hreflang {lang} -> {path} không tồn tại")
        else:
            back = pages.get(path)
            if back and urlparse(back.alts.get(lang if lang != "x-default" else "x-default", "")).path != path and lang != "x-default":
                problems.append(f"{rel}: hreflang {lang} không có tag quay lại hợp lệ ở {path}")
    if urlparse(p.alts.get(rel.split("/")[1] if rel.startswith("/vi/") else "en", "")).path != rel: problems.append(f"{rel}: thiếu hreflang tự tham chiếu")
    # JSON-LD
    if not p.ld: problems.append(f"{rel}: không có JSON-LD")
    for raw in p.ld:
        try:
            g = json.loads(raw)
            for n in g.get("@graph", [g]):
                if "@type" not in n: problems.append(f"{rel}: JSON-LD node thiếu @type")
        except Exception as e: problems.append(f"{rel}: JSON-LD lỗi: {e}")
        if re.search(r'"(url|item|image|logo)":"/', raw): problems.append(f"{rel}: JSON-LD có URL tương đối")
    # liên kết nội bộ
    for href in p.a:
        if href.startswith(("mailto:", "tel:", "http://", "https://")): continue
        path = href.split("#")[0]
        if path and not exists("https://x" + path): problems.append(f"{rel}: liên kết hỏng {href}")
    if "og:image" not in p.meta: problems.append(f"{rel}: thiếu og:image")
    elif not exists(p.meta["og:image"]): problems.append(f"{rel}: og:image không tồn tại ({p.meta['og:image']})")
    notes.append(f"{rel:46} words={words:4}  h2={len(p.h['h2']):2}  title={len(t):2}  desc={len(d):3}")

# sitemap
ns = {"s": "http://www.sitemaps.org/schemas/sitemap/0.9"}
locs = [e.text for e in ET.parse(DIST / "sitemap.xml").getroot().findall(".//s:loc", ns)]
for loc in locs:
    if not exists(loc): problems.append(f"sitemap: {loc} không có file")
for rel in pages:
    if not any(urlparse(l).path == rel for l in locs): problems.append(f"sitemap: thiếu {rel}")
for need in ("robots.txt", "llms.txt", "404.html", "_headers"):
    if not (DIST / need).exists(): problems.append(f"thiếu {need}")

print("\n".join(notes))
print(f"\n{len(pages)} trang, {len(locs)} URL trong sitemap")
if problems:
    print("\nVẤN ĐỀ:"); print("\n".join(" - " + x for x in problems)); sys.exit(1)
print("QA: không có vấn đề.")
