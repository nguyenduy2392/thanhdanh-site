# Site riêng của game: Rain Of Fire: War Defense

Site tĩnh song ngữ (English `/`, Tiếng Việt `/vi/`) chỉ dành cho game, để SEO cho chính game. Web công ty nằm ở repo riêng `thanhdanh-site` (nhánh `redesign-seo`), có thẻ sản phẩm trỏ sang đây. **Chưa deploy.**

## Trang

`/` (trang game), `/how-to-play/`, `/game-modes/`, `/defense-guide/`, `/faq/` (mỗi trang có bản `/vi/...`) + `404.html`.
Build tự sinh: canonical, hreflang (kèm x-default), Open Graph, JSON-LD (VideoGame, WebSite, WebPage/Article, FAQPage, BreadcrumbList, Organization), `sitemap.xml`, `robots.txt` (kèm Content-Signal), `llms.txt`, `_headers`.
Organization dùng cùng `@id` (`https://thanhdanh.pro.vn/#organization`) với web công ty để search engine nối hai site thành một thực thể.

## Cấu trúc

```
site/
  build.mjs              # node build.mjs -> dist/ (không phụ thuộc gói ngoài)
  src/config.mjs         # SITE_URL, COMPANY_URL, link store, ngôn ngữ
  src/content/en.mjs     # nội dung tiếng Anh;  vi.mjs: tiếng Việt (cùng cấu trúc)
  src/art.mjs            # hình SVG nội tuyến
  src/assets/            # css, ảnh (img/screens/ = ảnh chụp game)
  tools/make_assets.py   # sinh icon/favicon/ảnh OG từ tools/source/ (cần Pillow)
  tools/qa.py            # kiểm tra SEO kỹ thuật trên dist/ (stdlib)
  wrangler.jsonc         # Cloudflare Workers static assets, thư mục ./dist
```

## Dùng

```bash
cd site
npm run build && python3 tools/qa.py     # phải in "QA: không có vấn đề."
npm run preview                          # http://localhost:8099
SITE_URL=https://example.com COMPANY_URL=https://company.example node build.mjs
npm install && npm run deploy            # wrangler deploy (worker tên "rainoffire-site")
```

## Trước khi deploy

1. **Domain**: mặc định `https://rainoffire.thanhdanh.pro.vn` (subdomain của domain công ty, không cần mua mới). Dùng domain khác thì đặt `SITE_URL`, và đặt cùng giá trị `GAME_URL` cho `thanhdanh-site`.
2. Thêm domain/subdomain trong Cloudflare cho worker `rainoffire-site`.
3. Sau deploy: nộp `sitemap.xml` vào Google Search Console và Bing Webmaster Tools. Trong listing Google Play/App Store, đặt "website" của nhà phát triển trỏ về web công ty (nơi có `app-ads.txt`), và liên kết tới site game ở phần mô tả.

## Việc nội dung còn thiếu (không bịa)

- Ảnh chụp màn hình thật: bỏ ảnh 16:9 (rộng 960 trở lên) vào `src/assets/img/screens/`, build tự thêm mục "Screenshots".
- Trang chính sách riêng tư: store bắt buộc, chưa có. Cần người có chuyên môn duyệt trước khi đăng.
- Đánh giá sao, lượt tải: chưa có số liệu nên không có `aggregateRating`.
- Tên game không nhất quán (Android "Rain Of Fire", iOS "Iron Dome vs ICBM War"): nên thống nhất trên store.
