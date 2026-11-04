// Web công ty Thanh Danh Soft (thanhdanh.pro.vn). Site game nằm ở repo rainoffire-site.
// Đổi domain khi deploy:  SITE_URL=https://example.com GAME_URL=https://game.example.com node build.mjs
export const SITE_URL = (process.env.SITE_URL || 'https://thanhdanh.pro.vn').replace(/\/$/, '');
export const GAME_URL = (process.env.GAME_URL || 'https://rainoffire.thanhdanh.pro.vn').replace(/\/$/, '');

export const BUILD_DATE = process.env.BUILD_DATE || new Date().toISOString().slice(0, 10);

export const company = {
  name: 'Thanh Danh Soft',
  legalName: 'THANH DANH SOFTWARE TECHNOLOGY COMPANY LIMITED',
  taxCode: '0202349227',
  duns: '665471930',
  foundingDate: '2026',
  email: 'thanhdanh.techsoft@gmail.com',
  phoneDisplay: '+84 795 338 885',
  phoneTel: '+84795338885',
  city: 'Hai Phong',
  country: 'VN',
  founder: 'Nguyen Thanh Duy',
  coFounder: 'Sandy',
  facebook: 'https://www.facebook.com/profile.php?id=61590556208270',
  tiktok: 'https://www.tiktok.com/@rainoffire.co',
  reddit: 'https://www.reddit.com/r/rainoffire/',
};

export const game = {
  name: 'Rain Of Fire: War Defense',
  shortName: 'Rain Of Fire',
  androidUrl: 'https://play.google.com/store/apps/details?id=com.nguyenduy.rainoffire',
  iosUrl: 'https://apps.apple.com/us/app/iron-dome-vs-icbm-war/id6753122521',
  languageCount: 15,
};

// 'en' là mặc định (x-default), nằm ở gốc; các ngôn ngữ khác nằm dưới /<code>/.
export const languages = [
  { code: 'en', hreflang: 'en', locale: 'en_US', label: 'English', short: 'EN' },
  { code: 'vi', hreflang: 'vi', locale: 'vi_VN', label: 'Tiếng Việt', short: 'VI' },
];
export const defaultLang = 'en';

export const urlFor = (lang, path = '') => {
  const prefix = lang === defaultLang ? '' : `/${lang}`;
  const p = path ? `/${path.replace(/^\/|\/$/g, '')}` : '';
  return `${prefix}${p}/` || '/';
};
export const absUrl = (lang, path = '') => `${SITE_URL}${urlFor(lang, path)}`.replace(/\/\/$/, '/');
export const gameHome = (lang) => `${GAME_URL}/${lang === defaultLang ? '' : `${lang}/`}`;
