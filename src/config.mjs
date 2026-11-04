// Site riêng của game Rain Of Fire (SEO cho chính game). Web công ty nằm ở repo thanhdanh-site.
// Đổi domain khi deploy:  SITE_URL=https://rainoffire.example node build.mjs
export const SITE_URL = (process.env.SITE_URL || 'https://rainoffire.thanhdanh.pro.vn').replace(/\/$/, '');
export const COMPANY_URL = (process.env.COMPANY_URL || 'https://thanhdanh.pro.vn').replace(/\/$/, '');

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
  facebook: 'https://www.facebook.com/share/1GAVYiUypz/?mibextid=wwXIfr',
  tiktok: 'https://www.tiktok.com/@rainoffire.co',
};

export const game = {
  name: 'Rain Of Fire: War Defense',
  shortName: 'Rain Of Fire',
  androidUrl: 'https://play.google.com/store/apps/details?id=com.nguyenduy.rainoffire',
  iosUrl: 'https://apps.apple.com/us/app/iron-dome-vs-icbm-war/id6753122521',
  androidPackage: 'com.nguyenduy.rainoffire',
  // 16 ngôn ngữ trong game (Assets/Local)
  languages: ['Albanian', 'Arabic', 'Burmese', 'Chinese (Simplified)', 'Dutch', 'English', 'French', 'German', 'Hebrew', 'Indonesian', 'Korean', 'Malay', 'Persian', 'Turkish', 'Vietnamese'],
  languageCodes: ['sq', 'ar', 'my', 'zh-Hans', 'nl', 'en', 'fr', 'de', 'he', 'id', 'ko', 'ms', 'fa', 'tr', 'vi'],
};

// Ngôn ngữ của site. 'en' là mặc định (x-default), nằm ở gốc; các ngôn ngữ khác nằm dưới /<code>/.
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
