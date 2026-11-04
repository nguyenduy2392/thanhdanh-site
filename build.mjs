// Site riêng của game Rain Of Fire. Build: node build.mjs  ->  dist/
// Không có phụ thuộc ngoài Node. Sinh: HTML (EN + VI), sitemap.xml (hreflang), robots.txt, llms.txt, _headers, CSS có hash.
import { mkdirSync, writeFileSync, readFileSync, cpSync, rmSync, existsSync, readdirSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { SITE_URL, COMPANY_URL, BUILD_DATE, company, game, languages, defaultLang, urlFor, absUrl } from './src/config.mjs';
import { heroArt, icons, storeBadges } from './src/art.mjs';
import en from './src/content/en.mjs';
import vi from './src/content/vi.mjs';

const ROOT = dirname(fileURLToPath(import.meta.url));
const SRC = join(ROOT, 'src');
const DIST = join(ROOT, 'dist');
const content = { en, vi };

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const json = (o) => JSON.stringify(o).replace(/</g, '\\u003c');

// ── Trang: trang chủ = trang game; các bài hướng dẫn nằm ngay dưới gốc ─────────────────────────
const sections = ['how-to-play', 'game-modes', 'defense-guide', 'faq'];
const pages = [
  { key: 'game', path: '', kind: 'game' },
  ...sections.map((k) => ({ key: k, path: k, kind: 'article' })),
];
const pathOf = (key) => (key === 'game' ? '' : key);
const companyHome = (lang) => `${COMPANY_URL}/${lang === defaultLang ? '' : `${lang}/`}`;

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
const screenshots = existsSync(join(SRC, 'assets/img/screens'))
  ? readdirSync(join(SRC, 'assets/img/screens')).filter((f) => /\.(jpe?g|png|webp)$/i.test(f)).sort()
  : [];

// ── Thành phần giao diện ────────────────────────────────────────────────────────────────────────
const storeButtons = (c, extra = '') => `
<div class="store-buttons ${extra}">
  <a class="btn btn-store" href="${game.androidUrl}" rel="noopener" data-store="google-play">${storeBadges.android}<span><small>${esc(c.ui.storeSmall.android)}</small><b>Google Play</b></span></a>
  <a class="btn btn-store" href="${game.iosUrl}" rel="noopener" data-store="app-store">${storeBadges.ios}<span><small>${esc(c.ui.storeSmall.ios)}</small><b>App Store</b></span></a>
</div>`;

const langSwitch = (lang, pagePath) =>
  `<nav class="lang" aria-label="${esc(content[lang].ui.language)}">` +
  languages.map((l) => (l.code === lang
    ? `<span aria-current="true">${l.short}</span>`
    : `<a href="${urlFor(l.code, pagePath)}" hreflang="${l.hreflang}" lang="${l.code}" title="${esc(l.label)}">${l.short}</a>`)).join('') + '</nav>';

const navKeys = ['game', ...sections];
const navLabel = (c, k) => c.ui.gameNav[k === 'game' ? 'overview' : k];

const header = (lang, pagePath, activeKey) => {
  const c = content[lang];
  return `
<header class="site-header">
  <div class="wrap bar">
    <a class="brand" href="${urlFor(lang)}"><img src="/img/rain-of-fire-icon-64.png" width="36" height="36" alt="" decoding="async"><span>${esc(game.shortName)}</span></a>
    <nav class="primary" aria-label="Main">
      ${navKeys.map((k) => `<a href="${urlFor(lang, pathOf(k))}"${k === activeKey ? ' aria-current="page"' : ''}>${esc(navLabel(c, k))}</a>`).join('')}
      <a href="${companyHome(lang)}" rel="noopener">${esc(company.name)}</a>
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
      <p class="foot-brand"><img src="/img/rain-of-fire-icon-64.png" width="28" height="28" alt="" loading="lazy"> ${esc(game.name)}</p>
      <p class="muted">${esc(c.ui.developedBy)} <a href="${companyHome(lang)}" rel="noopener">${esc(company.name)}</a><br>${esc(company.legalName)}<br>${esc(c.ui.taxCode)}: ${company.taxCode} · D-U-N-S: ${company.duns}<br>${esc(c.ui.address)}</p>
    </div>
    <div>
      <p class="foot-h">${esc(game.shortName)}</p>
      <ul class="plain">${navKeys.map((k) => `<li><a href="${urlFor(lang, pathOf(k))}">${esc(navLabel(c, k))}</a></li>`).join('')}</ul>
    </div>
    <div>
      <p class="foot-h">${esc(c.ui.followUs)}</p>
      <ul class="plain">
        <li><a href="${company.tiktok}" rel="me noopener">TikTok @rainoffire.co</a></li>
        <li><a href="${company.facebook}" rel="me noopener">Facebook</a></li>
        <li><a href="${companyHome(lang)}" rel="noopener">${esc(c.ui.developerSite)}</a></li>
        <li><a href="mailto:${company.email}">${esc(company.email)}</a></li>
      </ul>
    </div>
  </div>
  <div class="wrap legal"><span>© ${BUILD_DATE.slice(0, 4)} ${esc(company.name)}. ${esc(c.ui.copyright)}</span>${langSwitch(lang, pagePath)}</div>
</footer>`;
};

const ctaBlock = (c) => `
<section class="cta-band" aria-labelledby="cta-h">
  <h2 id="cta-h">${esc(game.name)}</h2>
  <p>${esc(c.ui.free)} · Android · iOS</p>
  ${storeButtons(c, 'center')}
</section>`;

const renderBlocks = (c, blocks) => blocks.map((b) => {
  switch (b.t) {
    case 'h2': return `<h2 id="${b.id}">${esc(b.text)}</h2>`;
    case 'p': return `<p>${b.html}</p>`;
    case 'ul': return `<ul>${b.items.map((i) => `<li>${i}</li>`).join('')}</ul>`;
    case 'ol': return `<ol>${b.items.map((i) => `<li>${i}</li>`).join('')}</ol>`;
    case 'table': return `<div class="table-wrap"><table><thead><tr>${b.head.map((h) => `<th scope="col">${esc(h)}</th>`).join('')}</tr></thead><tbody>${b.rows.map((r) => `<tr>${r.map((cell, i) => (i === 0 ? `<th scope="row">${esc(cell)}</th>` : `<td>${esc(cell)}</td>`)).join('')}</tr>`).join('')}</tbody></table></div>`;
    case 'faq': return b.items.map((f) => `<h3>${esc(f.q)}</h3><p>${esc(f.a)}</p>`).join('');
    case 'cta': return ctaBlock(c);
    default: throw new Error(`block lạ: ${b.t}`);
  }
}).join('\n');

const relatedLinks = (lang, keys) => {
  const c = content[lang];
  return `<nav class="related" aria-labelledby="rel-h"><h2 id="rel-h">${esc(c.ui.related)}</h2><ul class="cards-links">${keys.map((k) => `<li><a href="${urlFor(lang, pathOf(k))}"><b>${esc(content[lang][k].h1)}</b><span>${esc(content[lang][k].description)}</span></a></li>`).join('')}</ul></nav>`;
};

const breadcrumb = (lang, trail) => `<nav class="crumbs" aria-label="${esc(content[lang].ui.breadcrumbs)}"><ol>${trail.map((t, i) => `<li>${i < trail.length - 1 ? `<a href="${t.href}">${esc(t.name)}</a>` : `<span aria-current="page">${esc(t.name)}</span>`}</li>`).join('')}</ol></nav>`;

// ── JSON-LD ─────────────────────────────────────────────────────────────────────────────────────
// Organization dùng cùng @id với site công ty (thanhdanh-site) để search engine nối hai site thành một thực thể.
const orgId = `${COMPANY_URL}/#organization`;
const orgNode = () => ({
  '@type': 'Organization', '@id': orgId, name: company.name, legalName: company.legalName, url: `${COMPANY_URL}/`,
  logo: { '@type': 'ImageObject', url: `${SITE_URL}/img/logo-512.png`, width: 512, height: 512 },
  sameAs: [`${COMPANY_URL}/`, company.tiktok, company.facebook],
});
const gameId = `${SITE_URL}/#game`;
const gameNode = (lang) => ({
  '@type': 'VideoGame', '@id': gameId, name: game.name, alternateName: ['Rain Of Fire', 'Iron Dome vs ICBM War'],
  description: content[lang].game.lead, url: `${SITE_URL}/`, image: `${SITE_URL}/img/rain-of-fire-icon-512.png`,
  genre: ['Strategy', 'Tower defense', 'Multiplayer'], applicationCategory: 'GameApplication', gamePlatform: ['Android', 'iOS'],
  operatingSystem: 'Android, iOS', inLanguage: game.languageCodes, playMode: ['SinglePlayer', 'MultiPlayer'],
  publisher: { '@id': orgId }, author: { '@id': orgId },
  installUrl: [game.androidUrl, game.iosUrl],
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD', availability: 'https://schema.org/InStock' },
});

const faqNode = (items) => ({ '@type': 'FAQPage', mainEntity: items.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })) });

const graph = (lang, page, trail) => {
  const c = content[lang];
  const url = absUrl(lang, page.path);
  const pageData = c[page.key];
  const nodes = [orgNode(),
    { '@type': 'WebSite', '@id': `${SITE_URL}/#website`, url: `${SITE_URL}/`, name: game.name, publisher: { '@id': orgId }, inLanguage: languages.map((l) => l.hreflang) },
    gameNode(lang)];
  const base = { '@id': `${url}#webpage`, url, name: pageData.title, description: pageData.description, inLanguage: lang, isPartOf: { '@id': `${SITE_URL}/#website` }, datePublished: '2026-10-31', dateModified: BUILD_DATE, about: { '@id': gameId } };
  if (page.kind === 'game') {
    nodes.push({ '@type': 'WebPage', ...base }, faqNode(pageData.faq));
  } else {
    nodes.push({ '@type': 'Article', ...base, '@id': `${url}#article`, headline: pageData.h1, author: { '@id': orgId }, publisher: { '@id': orgId }, mainEntityOfPage: url });
    const faqBlock = (pageData.blocks || []).find((b) => b.t === 'faq');
    if (faqBlock) nodes.push(faqNode(faqBlock.items));
  }
  if (trail.length > 1) nodes.push({ '@type': 'BreadcrumbList', itemListElement: trail.map((t, i) => ({ '@type': 'ListItem', position: i + 1, name: t.name, item: `${SITE_URL}${t.href}` })) });
  return { '@context': 'https://schema.org', '@graph': nodes };
};

// ── <head> ──────────────────────────────────────────────────────────────────────────────────────
const head = ({ lang, page, title, description, ldGraph, noindex }) => {
  const url = absUrl(lang, page.path);
  const alts = languages.map((l) => `<link rel="alternate" hreflang="${l.hreflang}" href="${absUrl(l.code, page.path)}">`).join('\n')
    + `\n<link rel="alternate" hreflang="x-default" href="${absUrl(defaultLang, page.path)}">`;
  const ogImg = `${SITE_URL}/img/og/game-${lang}.png`;
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
<meta property="og:type" content="${page.kind === 'article' ? 'article' : 'website'}">
<meta property="og:site_name" content="${esc(game.name)}">
<meta property="og:title" content="${esc(title)}">
<meta property="og:description" content="${esc(description)}">
<meta property="og:url" content="${url}">
<meta property="og:image" content="${ogImg}">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta property="og:image:alt" content="${esc(game.name)}">
<meta property="og:locale" content="${l.locale}">
${languages.filter((x) => x.code !== lang).map((x) => `<meta property="og:locale:alternate" content="${x.locale}">`).join('\n')}
<meta name="twitter:card" content="summary_large_image">
<link rel="icon" href="/favicon.ico" sizes="any">
<link rel="icon" type="image/png" sizes="32x32" href="/favicon-32.png">
<link rel="apple-touch-icon" href="/apple-touch-icon.png">
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

// ── Trang chủ = trang game ──────────────────────────────────────────────────────────────────────
const renderGame = (lang) => {
  const c = content[lang], g = c.game;
  const page = pages[0];
  const trail = [{ name: game.shortName, href: urlFor(lang) }];
  const shots = screenshots.length
    ? `<section class="section" aria-labelledby="shots-h"><div class="wrap"><h2 id="shots-h">${esc(c.ui.screenshots)}</h2><div class="shots">${screenshots.map((f, i) => `<img src="/img/screens/${f}" alt="${esc((c.ui.shotAlts || {})[f.replace(/\.[^.]+$/, '')] || `${game.name} screenshot ${i + 1}`)}" width="960" height="540" loading="lazy" decoding="async">`).join('')}</div></div></section>`
    : '';
  const body = `
<main id="main">
  <section class="hero hero-game">
    <div class="wrap hero-grid">
      <div class="hero-copy">
        <img class="app-icon app-icon-sm" src="/img/rain-of-fire-icon-256.png" width="96" height="96" alt="${esc(game.name)} app icon" decoding="async">
        <h1>${esc(g.h1)}</h1>
        <p class="tagline">${esc(g.tagline)}</p>
        <p class="lead">${esc(g.lead)}</p>
        ${storeButtons(c)}
        <p class="chips">${[c.ui.free, 'Android', 'iOS'].map((m) => `<span>${esc(m)}</span>`).join('')}</p>
        <p class="byline">${esc(c.ui.developedBy)} <a href="${companyHome(lang)}" rel="noopener">${esc(company.name)}</a></p>
      </div>
      <div class="hero-visual">${heroArt}</div>
    </div>
  </section>

  <section class="section" aria-labelledby="facts-h">
    <div class="wrap">
      <h2 id="facts-h">${esc(g.factsTitle)}</h2>
      <dl class="facts">${g.facts.map(([k, v]) => `<div><dt>${esc(k)}</dt><dd>${esc(v)}</dd></div>`).join('')}</dl>
    </div>
  </section>

  ${shots}

  <section class="section alt" aria-labelledby="feat-h">
    <div class="wrap">
      <h2 id="feat-h">${esc(g.featuresTitle)}</h2>
      <ul class="features">${g.features.map((f) => `<li>${icons[f.icon]}<h3>${esc(f.title)}</h3><p>${esc(f.text)}</p></li>`).join('')}</ul>
    </div>
  </section>

  <section class="section" aria-labelledby="steps-h">
    <div class="wrap narrow">
      <h2 id="steps-h">${esc(g.stepsTitle)}</h2>
      <ol class="steps">${g.steps.map((s) => `<li>${esc(s)}</li>`).join('')}</ol>
    </div>
  </section>

  <section class="section alt" aria-labelledby="modes-h">
    <div class="wrap">
      <h2 id="modes-h">${esc(g.modesTitle)}</h2>
      <ul class="features three">${g.modes.map((m) => `<li>${icons[m.icon]}<h3>${esc(m.title)}</h3><p>${esc(m.text)}</p></li>`).join('')}</ul>
      <p><a class="textlink" href="${urlFor(lang, 'game-modes')}">${esc(g.modesLink)} →</a></p>
    </div>
  </section>

  <section class="section" aria-labelledby="lang-h">
    <div class="wrap narrow">
      <h2 id="lang-h">${esc(g.langTitle)}</h2>
      <p>${esc(g.langText)}</p>
      <ul class="chips big">${game.languages.map((l) => `<li>${esc(l)}</li>`).join('')}</ul>
    </div>
  </section>

  <section class="section alt" aria-labelledby="faq-h">
    <div class="wrap narrow">
      <h2 id="faq-h">${esc(g.faqTitle)}</h2>
      ${g.faq.map((f) => `<h3>${esc(f.q)}</h3><p>${esc(f.a)}</p>`).join('')}
      <p><a class="textlink" href="${urlFor(lang, 'faq')}">${esc(g.faqLink)} →</a></p>
    </div>
  </section>

  <div class="wrap">${ctaBlock(c)}</div>
  <div class="wrap">${relatedLinks(lang, g.related)}</div>
</main>`;
  return shell({ lang, page, title: g.title, description: g.description, ldGraph: graph(lang, page, trail), body, activeKey: 'game' });
};

// ── Trang bài viết ──────────────────────────────────────────────────────────────────────────────
const renderArticle = (lang, key) => {
  const c = content[lang], a = c[key];
  const page = pages.find((p) => p.key === key);
  const trail = [{ name: game.shortName, href: urlFor(lang) }, { name: c.ui.gameNav[key], href: urlFor(lang, page.path) }];
  const toc = a.blocks.filter((b) => b.t === 'h2');
  const body = `
<main id="main">
  <article class="article wrap narrow">
    ${breadcrumb(lang, trail)}
    <h1>${esc(a.h1)}</h1>
    <p class="lead">${esc(a.lead)}</p>
    <p class="meta">${esc(c.ui.updated)}: <time datetime="${BUILD_DATE}">${BUILD_DATE}</time></p>
    ${toc.length > 2 ? `<nav class="toc" aria-label="On this page"><ul>${toc.map((b) => `<li><a href="#${b.id}">${esc(b.text)}</a></li>`).join('')}</ul></nav>` : ''}
    ${renderBlocks(c, a.blocks)}
  </article>
  <div class="wrap">${relatedLinks(lang, a.related)}</div>
</main>`;
  return shell({ lang, page, title: a.title, description: a.description, ldGraph: graph(lang, page, trail), body, activeKey: key });
};

// ── Ghi file ────────────────────────────────────────────────────────────────────────────────────
const write = (rel, data) => {
  const file = join(DIST, rel);
  mkdirSync(dirname(file), { recursive: true });
  writeFileSync(file, data);
};

for (const l of languages) {
  for (const p of pages) {
    write(join(urlFor(l.code, p.path), 'index.html'), p.kind === 'game' ? renderGame(l.code) : renderArticle(l.code, p.key));
  }
}

{
  const c = content.en;
  const page = { key: '404', path: '', kind: 'game' };
  write('404.html', shell({ lang: 'en', page, title: `${c.ui.notFoundTitle} | ${game.name}`, description: c.ui.notFoundText, noindex: true, activeKey: '404',
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
  const e = content.en;
  const list = (lang) => navKeys.map((k) => {
    const pg = content[lang][k];
    return `- [${pg.h1}](${absUrl(lang, pathOf(k))}): ${pg.description}`;
  }).join('\n');
  write('llms.txt', `# ${game.name}

> ${e.game.description}

${game.name} is a free missile-defense strategy game for Android and iOS, made by ${company.name} (${company.legalName}), Hai Phong, Vietnam. Players build a city, defend it with radar, anti-air batteries and ABM interceptors, and attack with ICBMs. Modes: PvP online, PvE against bots, Play with Friends. 15 languages.

## Guides
${list('en')}

## Tiếng Việt
${list('vi')}

## Download and developer
- Google Play: ${game.androidUrl}
- App Store: ${game.iosUrl}
- Developer: [${company.name}](${COMPANY_URL}/)
- Contact: ${company.email}
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
`);

console.log(`Built ${pages.length * languages.length} pages + 404 → ${DIST} (SITE_URL=${SITE_URL}, css=${cssHash}, screenshots=${screenshots.length})`);
