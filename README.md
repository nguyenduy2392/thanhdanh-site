# thanhdanh.pro.vn — web công ty Thanh Danh Soft

Site tĩnh song ngữ (English `/`, Tiếng Việt `/vi/`): trang chủ, `/about/`, `/games/`, `/contact/` + `404.html`. Site game nằm ở repo riêng `rainoffire-site` (subdomain `rainoffire.thanhdanh.pro.vn`).

Build tự sinh: canonical, hreflang (kèm x-default), Open Graph, JSON-LD (Organization, WebSite, WebPage/AboutPage/CollectionPage/ContactPage, FAQPage, VideoGame, BreadcrumbList), `sitemap.xml`, `robots.txt`, `llms.txt`, `_headers`, và `app-ads.txt` ở gốc domain (nguồn: `src/app-ads.txt`, nội dung giữ nguyên bản cũ).
`@id` của Organization (`https://thanhdanh.pro.vn/#organization`) trùng với site game để search engine nối hai site thành một thực thể.

## Dùng

```bash
npm run qa          # build + kiểm tra SEO kỹ thuật, phải in "QA: không có vấn đề."
npm run preview     # http://localhost:8098
npm run assets      # sinh lại favicon, logo sáng, ảnh OG (cần Pillow)
npm install && npm run deploy   # wrangler deploy (worker "thanhdanh-site")
```

Nội dung sửa ở `src/content/en.mjs` và `vi.mjs` (cùng cấu trúc); thông tin công ty ở `src/config.mjs`.

## Trước / sau khi deploy

1. Deploy site mới sẽ thay thế bản template cũ (nhánh `main`). Giữ nguyên `app-ads.txt` đã có trong `dist/`.
2. Nộp `sitemap.xml` vào Google Search Console và Bing Webmaster Tools; đặt website nhà phát triển trên Google Play/App Store trỏ về `https://thanhdanh.pro.vn`.

## Chưa có (không bịa)

- Form liên hệ: cần backend, hiện dùng email/điện thoại.
- Trang chính sách riêng tư, điều khoản: store thường yêu cầu, cần người có chuyên môn duyệt trước khi đăng.
- Giờ làm việc, địa chỉ chi tiết, ảnh đội ngũ: chưa có dữ liệu thật.
