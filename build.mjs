// Web công ty Thanh Danh Soft. Build: node build.mjs  ->  dist/
// Không có phụ thuộc ngoài Node. Sinh: HTML (EN + VI), sitemap.xml (hreflang), robots.txt, llms.txt, _headers, app-ads.txt, CSS có hash.
import { mkdirSync, writeFileSync, readFileSync, cpSync, rmSync, existsSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { SITE_URL, GAME_URL, BUILD_DATE, company, game, languages, defaultLang, urlFor, absUrl, gameHome } from './src/config.mjs';
import { icons, storeBadges } from './src/art.mjs';
import en from './src/content/en.mjs';
import vi from './src/content/vi.mjs';

const ROOT = dirname(fileURLToPath(import.meta.url));
const SRC = join(ROOT, 'src');
const DIST = join(ROOT, 'dist');
const content = { en, vi };

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const json = (o) => JSON.stringify(o).replace(/</g, '\\u003c');

const pages = [
  { key: 'home', path: '' },
  { key: 'about', path: 'about' },
  { key: 'games', path: 'games' },
  { key: 'contact', path: 'contact' },
];
const navKeys = pages.map((p) => p.key);
const pathOf = (key) => pages.find((p) => p.key === key).path;

// ── Tài nguyên tĩnh ─────────────────────────────────────────────────────────────────────────────
rmSync(DIST, { recursive: true, force: true });
mkdirSync(DIST, { recursive: true });
const css = readFileSync(join(SRC, 'assets/css/site.css'), 'utf8');
const cssHash = createHash('sha1').update(css).digest('hex').slice(0, 10);
mkdirSync(join(DIST, 'css'), { recursive: true });
writeFileSync(join(DIST, 'css', `site.${cssHash}.css`), css);
cpSync(join(SRC, 'assets/img'), join(DIST, 'img'), { recursive: true });
for (const f of ['favicon.ico', 'favicon-32.png', 'apple-touch-icon.png']) {
  if (existsSync(join(SRC, 'assets', f))) cpSync(join(SRC, 'assets', f), join(DIST, f));
}
// app-ads.txt phải nằm ở gốc domain nhà phát triển để các mạng quảng cáo xác thực
cpSync(join(SRC, 'app-ads.txt'), join(DIST, 'app-ads.txt'));

// ── Thành phần giao diện ────────────────────────────────────────────────────────────────────────
const langSwitch = (lang, pagePath) =>
  `<nav class="lang" aria-label="${esc(content[lang].ui.language)}">` +
  languages.map((l) => (l.code === lang
    ? `<span aria-current="true">${l.short}</span>`
    : `<a href="${urlFor(l.code, pagePath)}" hreflang="${l.hreflang}" lang="${l.code}" title="${esc(l.label)}">${l.short}</a>`)).join('') + '</nav>';

const header = (lang, pagePath, activeKey) => {
  const c = content[lang];
  return `
<header class="site-header">
  <div class="wrap bar">
    <a class="brand" href="${urlFor(lang)}"><img src="/img/logo-light-96.png" width="36" height="36" alt="" decoding="async"><span>${esc(company.name)}</span></a>
    <nav class="primary" aria-label="Main">
      ${navKeys.map((k) => `<a href="${urlFor(lang, pathOf(k))}"${k === activeKey ? ' aria-current="page"' : ''}>${esc(c.ui.nav[k])}</a>`).join('')}
    </nav>
    ${langSwitch(lang, pagePath)}
  </div>
</header>`;
};

const footer = (lang, pagePath) => {
  const c = content[lang];
  return `
<footer class="site-footer">
  <div class="wrap foot">
    <div>
      <p class="foot-brand"><img src="/img/logo-light-96.png" width="28" height="28" alt="" loading="lazy"> ${esc(company.name)}</p>
      <p class="muted">${esc(company.legalName)}<br>${esc(c.ui.taxCode)}: ${company.taxCode} · D-U-N-S: ${company.duns}<br>${esc(c.ui.address)}</p>
    </div>
    <div>
      <p class="foot-h">${esc(c.ui.companyInfo)}</p>
      <ul class="plain">${navKeys.map((k) => `<li><a href="${urlFor(lang, pathOf(k))}">${esc(c.ui.nav[k])}</a></li>`).join('')}</ul>
    </div>
    <div>
      <p class="foot-h">${esc(c.ui.followUs)}</p>
      <ul class="plain">
        <li><a href="${gameHome(lang)}" rel="noopener">${esc(game.shortName)}</a></li>
        <li><a href="${company.tiktok}" rel="me noopener">TikTok @rainoffire.co</a></li>
        <li><a href="${company.facebook}" rel="me noopener">Facebook</a></li>
        <li><a href="${company.reddit}" rel="me noopener">Reddit r/rainoffire</a></li>
        <li><a href="mailto:${company.email}">${esc(company.email)}</a></li>
      </ul>
    </div>
  </div>
  <div class="wrap legal"><span>© ${BUILD_DATE.slice(0, 4)} ${esc(company.name)}. ${esc(c.ui.legal)}</span>${langSwitch(lang, pagePath)}</div>
</footer>`;
};

const breadcrumb = (lang, trail) => `<nav class="crumbs" aria-label="${esc(content[lang].ui.breadcrumbs)}"><ol>${trail.map((t, i) => `<li>${i < trail.length - 1 ? `<a href="${t.href}">${esc(t.name)}</a>` : `<span aria-current="page">${esc(t.name)}</span>`}</li>`).join('')}</ol></nav>`;

const renderBlocks = (lang, blocks) => blocks.map((b) => {
  switch (b.t) {
    case 'h2': return `<h2 id="${b.id}">${esc(b.text)}</h2>`;
    case 'p': return `<p>${b.html.replaceAll('__GAME__', gameHome(lang))}</p>`;
    case 'ul': return `<ul>${b.items.map((i) => `<li>${i}</li>`).join('')}</ul>`;
    case 'table': return `<div class="table-wrap"><table><thead><tr>${b.head.map((h) => `<th scope="col">${esc(h)}</th>`).join('')}</tr></thead><tbody>${b.rows.map((r) => `<tr>${r.map((cell, i) => (i === 0 ? `<th scope="row">${esc(cell)}</th>` : `<td>${esc(cell)}</td>`)).join('')}</tr>`).join('')}</tbody></table></div>`;
    default: throw new Error(`block lạ: ${b.t}`);
  }
}).join('\n');

const storeButtons = (c) => `
<div class="store-buttons">
  <a class="btn btn-store" href="${game.androidUrl}" rel="noopener">${storeBadges.android}<span><small>${esc(c.ui.storeSmall.android)}</small><b>Google Play</b></span></a>
  <a class="btn btn-store" href="${game.iosUrl}" rel="noopener">${storeBadges.ios}<span><small>${esc(c.ui.storeSmall.ios)}</small><b>App Store</b></span></a>
</div>`;

const gameCard = (lang, text, cta) => {
  const c = content[lang];
  return `
<div class="product-card">
  <img class="app-icon" src="/img/rain-of-fire-icon-256.png" width="128" height="128" alt="${esc(game.name)} app icon" loading="lazy" decoding="async">
  <div>
    <h3><a href="${gameHome(lang)}" rel="noopener">${esc(game.name)}</a></h3>
    <p>${esc(text)}</p>
    <p class="chips">${[c.ui.free, 'Android', 'iOS'].map((m) => `<span>${esc(m)}</span>`).join('')}</p>
    <div class="actions"><a class="btn btn-primary" href="${gameHome(lang)}" rel="noopener">${esc(cta)}</a></div>
  </div>
</div>`;
};

// ── JSON-LD ─────────────────────────────────────────────────────────────────────────────────────
// @id của Organization trùng với site game (rainoffire-site) để search engine nối hai site thành một thực thể.
const orgId = `${SITE_URL}/#organization`;
const orgNode = (lang) => ({
  '@type': 'Organization', '@id': orgId, name: company.name, legalName: company.legalName, url: `${SITE_URL}/`,
  logo: { '@type': 'ImageObject', url: `${SITE_URL}/img/logo-512.png`, width: 512, height: 512 },
  description: content[lang].home.description,
  foundingDate: company.foundingDate, taxID: company.taxCode, duns: company.duns,
  email: company.email, telephone: company.phoneTel,
  address: { '@type': 'PostalAddress', addressLocality: company.city, addressCountry: company.country },
  founder: [{ '@type': 'Person', name: company.founder, jobTitle: 'Founder' }, { '@type': 'Person', name: company.coFounder, jobTitle: 'Co-Founder' }],
  contactPoint: [{ '@type': 'ContactPoint', contactType: 'customer support', email: company.email, telephone: company.phoneTel, availableLanguage: ['English', 'Vietnamese'] }],
  sameAs: [company.facebook, company.tiktok, company.reddit, game.androidUrl, game.iosUrl, `${GAME_URL}/`],
});
const gameNode = () => ({
  '@type': 'VideoGame', '@id': `${GAME_URL}/#game`, name: game.name, url: `${GAME_URL}/`, image: `${SITE_URL}/img/rain-of-fire-icon-512.png`,
  genre: ['Strategy', 'Tower defense', 'Multiplayer'], applicationCategory: 'GameApplication', gamePlatform: ['Android', 'iOS'],
  publisher: { '@id': orgId }, author: { '@id': orgId }, installUrl: [game.androidUrl, game.iosUrl],
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD', availability: 'https://schema.org/InStock' },
});
const faqNode = (items) => ({ '@type': 'FAQPage', mainEntity: items.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })) });
const pageType = { home: 'WebPage', about: 'AboutPage', games: 'CollectionPage', contact: 'ContactPage' };

const graph = (lang, page, trail) => {
  const c = content[lang], d = c[page.key], url = absUrl(lang, page.path);
  const nodes = [orgNode(lang),
    { '@type': 'WebSite', '@id': `${SITE_URL}/#website`, url: `${SITE_URL}/`, name: company.name, publisher: { '@id': orgId }, inLanguage: languages.map((l) => l.hreflang) },
    { '@type': pageType[page.key], '@id': `${url}#webpage`, url, name: d.title, description: d.description, inLanguage: lang, isPartOf: { '@id': `${SITE_URL}/#website` }, about: { '@id': orgId }, dateModified: BUILD_DATE }];
  if (page.key === 'home') { nodes.push(faqNode(d.faq), gameNode()); }
  if (page.key === 'games') nodes.push(gameNode());
  if (trail.length > 1) nodes.push({ '@type': 'BreadcrumbList', itemListElement: trail.map((t, i) => ({ '@type': 'ListItem', position: i + 1, name: t.name, item: `${SITE_URL}${t.href}` })) });
  return { '@context': 'https://schema.org', '@graph': nodes };
};

// ── <head> ──────────────────────────────────────────────────────────────────────────────────────
const head = ({ lang, page, title, description, ldGraph, noindex }) => {
  const url = absUrl(lang, page.path);
  const alts = languages.map((l) => `<link rel="alternate" hreflang="${l.hreflang}" href="${absUrl(l.code, page.path)}">`).join('\n')
    + `\n<link rel="alternate" hreflang="x-default" href="${absUrl(defaultLang, page.path)}">`;
  const l = languages.find((x) => x.code === lang);
  return `<!doctype html>
<html lang="${lang}">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(title)}</title>
<meta name="description" content="${esc(description)}">
<link rel="canonical" href="${url}">
${noindex ? '<meta name="robots" content="noindex">' : '<meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1">'}
${noindex ? '' : alts}
<meta name="theme-color" content="#0b1220">
<meta property="og:type" content="website">
<meta property="og:site_name" content="${esc(company.name)}">
<meta property="og:title" content="${esc(title)}">
<meta property="og:description" content="${esc(description)}">
<meta property="og:url" content="${url}">
<meta property="og:image" content="${SITE_URL}/img/og/company-${lang}.png">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta property="og:image:alt" content="${esc(company.name)}">
<meta property="og:locale" content="${l.locale}">
${languages.filter((x) => x.code !== lang).map((x) => `<meta property="og:locale:alternate" content="${x.locale}">`).join('\n')}
<meta name="twitter:card" content="summary_large_image">
<link rel="icon" href="/favicon.ico" sizes="any">
<link rel="icon" type="image/png" sizes="32x32" href="/favicon-32.png">
<link rel="apple-touch-icon" href="/apple-touch-icon.png">
<link rel="preload" as="style" href="/css/site.${cssHash}.css">
<link rel="stylesheet" href="/css/site.${cssHash}.css">
${ldGraph ? `<script type="application/ld+json">${json(ldGraph)}</script>` : ''}
</head>`;
};

const shell = ({ lang, page, title, description, ldGraph, noindex, body, activeKey }) => `${head({ lang, page, title, description, ldGraph, noindex })}
<body>
<a class="skip" href="#main">${esc(content[lang].ui.skip)}</a>
${header(lang, page.path, activeKey)}
${body}
${footer(lang, page.path)}
</body>
</html>
`;

const contactList = (lang, withSocial = true) => {
  const c = content[lang];
  const items = [
    ['mail', c.contact.items.email, `<a href="mailto:${company.email}">${esc(company.email)}</a>`],
    ['phone', c.contact.items.phone, `<a href="tel:${company.phoneTel}">${esc(company.phoneDisplay)}</a>`],
    ['pin', c.contact.items.address, esc(c.contact.addressValue)],
  ];
  if (withSocial) items.push(['globe', c.contact.items.social, `<a href="${company.facebook}" rel="me noopener">Facebook</a> · <a href="${company.tiktok}" rel="me noopener">TikTok</a> · <a href="${company.reddit}" rel="me noopener">Reddit</a>`]);
  return `<ul class="contact">${items.map(([i, k, v]) => `<li>${icons[i]}<div><span>${esc(k)}</span>${v}</div></li>`).join('')}</ul>`;
};

// ── Trang chủ ───────────────────────────────────────────────────────────────────────────────────
const renderHome = (lang) => {
  const c = content[lang], h = c.home, page = pages[0];
  const f = c.ui.facts;
  const facts = [[f.legalName, company.legalName], [f.taxCode, company.taxCode], [f.duns, company.duns], [f.founded, company.foundingDate], [f.location, c.ui.address], [f.founders, c.ui.foundersValue]];
  const body = `
<main id="main">
  <section class="hero">
    <div class="wrap narrow-hero">
      <p class="eyebrow">${esc(h.eyebrow)}</p>
      <h1>${esc(h.h1)}</h1>
      <p class="lead">${esc(h.lead)}</p>
      <div class="actions">
        <a class="btn btn-primary" href="${gameHome(lang)}" rel="noopener">${esc(c.ui.playGame)}</a>
        <a class="btn btn-ghost" href="${urlFor(lang, 'contact')}">${esc(c.ui.contactUs)}</a>
      </div>
    </div>
  </section>

  <section class="section" aria-labelledby="what-h">
    <div class="wrap">
      <h2 id="what-h">${esc(h.whatTitle)}</h2>
      <ul class="features three">${h.pillars.map((p) => `<li>${icons[p.icon]}<h3>${esc(p.title)}</h3><p>${esc(p.text)}</p></li>`).join('')}</ul>
    </div>
  </section>

  <section class="section alt" aria-labelledby="game-h">
    <div class="wrap">
      <h2 id="game-h">${esc(h.gameTitle)}</h2>
      ${gameCard(lang, h.gameLead, h.gameCta)}
      ${storeButtons(c)}
    </div>
  </section>

  <section class="section" aria-labelledby="upd-h">
    <div class="wrap">
      <h2 id="upd-h">${esc(h.updatesTitle)}</h2>
      <ul class="features">${h.updates.map((u) => `<li>${icons.bolt}<h3>${esc(u.title)}</h3><p>${esc(u.text)}</p></li>`).join('')}</ul>
    </div>
  </section>

  <section class="section alt" aria-labelledby="facts-h">
    <div class="wrap">
      <h2 id="facts-h">${esc(h.factsTitle)}</h2>
      <dl class="facts">${facts.map(([k, v]) => `<div><dt>${esc(k)}</dt><dd>${esc(v)}</dd></div>`).join('')}</dl>
      <p><a class="textlink" href="${urlFor(lang, 'about')}">${esc(c.ui.learnMore)} →</a></p>
    </div>
  </section>

  <section class="section" aria-labelledby="faq-h">
    <div class="wrap narrow">
      <h2 id="faq-h">${esc(h.faqTitle)}</h2>
      ${h.faq.map((q) => `<h3>${esc(q.q)}</h3><p>${esc(q.a)}</p>`).join('')}
    </div>
  </section>

  <section class="section alt" aria-labelledby="contact-h">
    <div class="wrap">
      <h2 id="contact-h">${esc(h.contactTitle)}</h2>
      <p class="section-lead">${esc(h.contactText)}</p>
      ${contactList(lang, false)}
    </div>
  </section>
</main>`;
  return shell({ lang, page, title: h.title, description: h.description, ldGraph: graph(lang, page, [{ name: company.name, href: urlFor(lang) }]), body, activeKey: 'home' });
};

// ── Các trang con ───────────────────────────────────────────────────────────────────────────────
const trailFor = (lang, key) => [{ name: company.name, href: urlFor(lang) }, { name: content[lang].ui.nav[key], href: urlFor(lang, pathOf(key)) }];
const articleHead = (lang, key, d, trail) => `${breadcrumb(lang, trail)}
    <h1>${esc(d.h1)}</h1>
    <p class="lead">${esc(d.lead)}</p>`;

const renderAbout = (lang) => {
  const c = content[lang], d = c.about, page = pages[1], trail = trailFor(lang, 'about');
  const body = `
<main id="main">
  <article class="article wrap narrow">
    ${articleHead(lang, 'about', d, trail)}
    ${renderBlocks(lang, d.blocks)}
    <div class="actions"><a class="btn btn-primary" href="${urlFor(lang, 'contact')}">${esc(c.ui.contactUs)}</a></div>
  </article>
</main>`;
  return shell({ lang, page, title: d.title, description: d.description, ldGraph: graph(lang, page, trail), body, activeKey: 'about' });
};

const renderGames = (lang) => {
  const c = content[lang], d = c.games, page = pages[2], trail = trailFor(lang, 'games');
  const body = `
<main id="main">
  <article class="article wrap narrow">
    ${articleHead(lang, 'games', d, trail)}
    <h2 id="rof">${esc(d.gameName)}</h2>
    ${gameCard(lang, d.gameText, c.ui.playGame)}
    <dl class="facts">${d.meta.map(([k, v]) => `<div><dt>${esc(k)}</dt><dd>${esc(v)}</dd></div>`).join('')}</dl>
    <p class="muted">${esc(d.note)}</p>
    ${storeButtons(c)}
    <h2 id="guides">${esc(d.guidesTitle)}</h2>
    <ul>${d.guides.map(([k, label]) => `<li><a href="${gameHome(lang)}${k}/" rel="noopener">${esc(label)}</a></li>`).join('')}</ul>
  </article>
</main>`;
  return shell({ lang, page, title: d.title, description: d.description, ldGraph: graph(lang, page, trail), body, activeKey: 'games' });
};

const renderContact = (lang) => {
  const c = content[lang], d = c.contact, page = pages[3], trail = trailFor(lang, 'contact');
  const body = `
<main id="main">
  <article class="article wrap narrow">
    ${articleHead(lang, 'contact', d, trail)}
    ${contactList(lang)}
    <p>${esc(d.support)}</p>
    <div class="actions">
      <a class="btn btn-primary" href="mailto:${company.email}">${esc(c.ui.emailUs)}</a>
      <a class="btn btn-ghost" href="tel:${company.phoneTel}">${esc(c.ui.callUs)}</a>
    </div>
  </article>
</main>`;
  return shell({ lang, page, title: d.title, description: d.description, ldGraph: graph(lang, page, trail), body, activeKey: 'contact' });
};

const renderers = { home: renderHome, about: renderAbout, games: renderGames, contact: renderContact };

// ── Ghi file ────────────────────────────────────────────────────────────────────────────────────
const write = (rel, data) => {
  const file = join(DIST, rel);
  mkdirSync(dirname(file), { recursive: true });
  writeFileSync(file, data);
};

for (const l of languages) for (const p of pages) write(join(urlFor(l.code, p.path), 'index.html'), renderers[p.key](l.code));

{
  const c = content.en;
  write('404.html', shell({ lang: 'en', page: { key: '404', path: '' }, title: `${c.ui.notFoundTitle} | ${company.name}`, description: c.ui.notFoundText, noindex: true, activeKey: '404',
    body: `<main id="main" class="wrap narrow notfound"><h1>${esc(c.ui.notFoundTitle)}</h1><p class="lead">${esc(c.ui.notFoundText)}</p><p><a class="btn btn-primary" href="/">${esc(c.ui.backHome)}</a></p></main>` }));
}

{
  const urls = pages.flatMap((p) => languages.map((l) => {
    const alts = languages.map((x) => `    <xhtml:link rel="alternate" hreflang="${x.hreflang}" href="${absUrl(x.code, p.path)}"/>`).join('\n')
      + `\n    <xhtml:link rel="alternate" hreflang="x-default" href="${absUrl(defaultLang, p.path)}"/>`;
    return `  <url>\n    <loc>${absUrl(l.code, p.path)}</loc>\n    <lastmod>${BUILD_DATE}</lastmod>\n${alts}\n  </url>`;
  }));
  write('sitemap.xml', `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n${urls.join('\n')}\n</urlset>\n`);
}

// Content-Signal: cho phép dùng để tìm kiếm và làm đầu vào AI (có trích dẫn). Cố ý KHÔNG khai báo ai-train: quyết định của chủ site.
write('robots.txt', `User-agent: *\nContent-Signal: search=yes, ai-input=yes\nAllow: /\n\nSitemap: ${SITE_URL}/sitemap.xml\n`);

{
  const list = (lang) => pages.map((p) => `- [${content[lang][p.key].h1 || company.name}](${absUrl(lang, p.path)}): ${content[lang][p.key].description}`).join('\n');
  write('llms.txt', `# ${company.name}

> ${content.en.home.description}

${company.name} (${company.legalName}) is a mobile game studio founded in 2026 in Hai Phong, Vietnam by ${company.founder} and ${company.coFounder}. Its first game is ${game.name}, a free missile-defense strategy game for Android and iOS.

## Pages
${list('en')}

## Tiếng Việt
${list('vi')}

## Game and contact
- Game site: ${GAME_URL}/
- Google Play: ${game.androidUrl}
- App Store: ${game.iosUrl}
- Contact: ${company.email}, ${company.phoneDisplay}
`);
}

write('_headers', `/*
  X-Content-Type-Options: nosniff
  Referrer-Policy: strict-origin-when-cross-origin
  Permissions-Policy: camera=(), microphone=(), geolocation=()
  X-Frame-Options: DENY

/css/*
  Cache-Control: public, max-age=31536000, immutable

/img/*
  Cache-Control: public, max-age=2592000

/app-ads.txt
  Content-Type: text/plain; charset=utf-8
  Cache-Control: public, max-age=3600
`);

console.log(`Built ${pages.length * languages.length} pages + 404 → ${DIST} (SITE_URL=${SITE_URL}, css=${cssHash})`);
