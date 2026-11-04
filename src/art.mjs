// Hình minh họa SVG nội tuyến (không tải thêm file, không ảnh hưởng LCP).

// Cảnh chiến trường: radar, ICBM đang lao tới, tên lửa đánh chặn, vụ nổ. aria-hidden: trang trí.
export const heroArt = `
<svg class="hero-art" viewBox="0 0 1200 520" role="img" aria-label="Illustration: a city defended by radar and interceptor missiles as incoming missiles are intercepted in the sky" preserveAspectRatio="xMidYMax slice" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#070b16"/><stop offset=".55" stop-color="#1b1330"/><stop offset=".85" stop-color="#5a1f2b"/><stop offset="1" stop-color="#ff7a2f"/>
    </linearGradient>
    <radialGradient id="boom" cx=".5" cy=".5" r=".5">
      <stop offset="0" stop-color="#fff6d6"/><stop offset=".35" stop-color="#ffb000"/><stop offset=".7" stop-color="#ff5a1f" stop-opacity=".6"/><stop offset="1" stop-color="#ff5a1f" stop-opacity="0"/>
    </radialGradient>
    <linearGradient id="trail" x1="0" x2="1"><stop offset="0" stop-color="#ff7a2f" stop-opacity="0"/><stop offset="1" stop-color="#ffd27a"/></linearGradient>
    <linearGradient id="trailb" x1="0" x2="1"><stop offset="0" stop-color="#4aa3d0" stop-opacity="0"/><stop offset="1" stop-color="#bfe6ff"/></linearGradient>
  </defs>
  <rect width="1200" height="520" fill="url(#sky)"/>
  <g fill="#fff" opacity=".7">
    <circle cx="90" cy="60" r="1.4"/><circle cx="240" cy="120" r="1.1"/><circle cx="410" cy="48" r="1.5"/><circle cx="560" cy="150" r="1"/><circle cx="700" cy="70" r="1.4"/><circle cx="880" cy="130" r="1.1"/><circle cx="1020" cy="52" r="1.5"/><circle cx="1130" cy="140" r="1"/><circle cx="330" cy="200" r="1"/><circle cx="960" cy="210" r="1.2"/>
  </g>
  <!-- radar sweep -->
  <g transform="translate(250 392)" fill="none" stroke="#4aa3d0">
    <circle r="150" stroke-opacity=".18" stroke-dasharray="4 8"/><circle r="100" stroke-opacity=".28" stroke-dasharray="4 8"/><circle r="50" stroke-opacity=".4"/>
    <path d="M0 0 L150 -60 A160 160 0 0 0 120 -104 Z" fill="#4aa3d0" fill-opacity=".16" stroke="none"/>
  </g>
  <!-- incoming ICBMs -->
  <path d="M60 40 C 300 60, 520 120, 700 250" stroke="url(#trail)" stroke-width="3" fill="none"/>
  <path d="M-10 120 C 260 120, 480 190, 640 300" stroke="url(#trail)" stroke-width="3" fill="none" opacity=".8"/>
  <path d="M820 20 C 900 90, 1000 180, 1060 330" stroke="url(#trail)" stroke-width="3" fill="none" opacity=".9"/>
  <g fill="#ffd27a"><circle cx="700" cy="250" r="5"/><circle cx="640" cy="300" r="4.5"/><circle cx="1060" cy="330" r="5"/></g>
  <!-- interceptors -->
  <path d="M300 410 C 380 300, 520 250, 690 248" stroke="url(#trailb)" stroke-width="3" fill="none"/>
  <path d="M430 420 C 480 360, 560 320, 636 300" stroke="url(#trailb)" stroke-width="3" fill="none" opacity=".85"/>
  <path d="M900 420 C 940 380, 1000 350, 1058 332" stroke="url(#trailb)" stroke-width="3" fill="none" opacity=".85"/>
  <!-- explosions -->
  <circle cx="697" cy="249" r="58" fill="url(#boom)"/><circle cx="1058" cy="331" r="42" fill="url(#boom)"/><circle cx="637" cy="300" r="30" fill="url(#boom)" opacity=".85"/>
  <!-- city -->
  <path d="M0 520 L0 455 Q 600 360 1200 455 L1200 520 Z" fill="#0d2b3d"/>
  <g fill="#0f3a52">
    <rect x="70" y="402" width="26" height="70"/><rect x="104" y="388" width="22" height="84"/><rect x="134" y="410" width="30" height="62"/>
    <rect x="180" y="380" width="24" height="94"/><rect x="212" y="398" width="34" height="76"/>
    <rect x="300" y="372" width="28" height="104"/><rect x="336" y="392" width="24" height="86"/><rect x="368" y="378" width="32" height="100"/><rect x="408" y="400" width="26" height="78"/>
    <rect x="500" y="368" width="30" height="112"/><rect x="538" y="384" width="22" height="98"/><rect x="568" y="372" width="34" height="112"/>
    <rect x="690" y="372" width="26" height="110"/><rect x="724" y="392" width="30" height="92"/><rect x="762" y="380" width="24" height="106"/>
    <rect x="860" y="392" width="30" height="94"/><rect x="898" y="376" width="26" height="112"/><rect x="934" y="398" width="34" height="90"/>
    <rect x="1030" y="404" width="26" height="76"/><rect x="1064" y="390" width="30" height="92"/><rect x="1102" y="410" width="28" height="70"/>
  </g>
  <g fill="#ffb000" opacity=".8"><rect x="188" y="396" width="4" height="4"/><rect x="308" y="388" width="4" height="4"/><rect x="376" y="396" width="4" height="4"/><rect x="508" y="384" width="4" height="4"/><rect x="574" y="390" width="4" height="4"/><rect x="898" y="394" width="4" height="4"/></g>
</svg>`;

const stroke = 'fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"';
const wrap = (inner) => `<svg class="icon" viewBox="0 0 48 48" width="40" height="40" aria-hidden="true" focusable="false" ${stroke} xmlns="http://www.w3.org/2000/svg">${inner}</svg>`;

export const icons = {
  radar: wrap('<circle cx="24" cy="24" r="18"/><circle cx="24" cy="24" r="10"/><path d="M24 24 L38 14"/><circle cx="33" cy="30" r="1.6" fill="currentColor"/>'),
  antiair: wrap('<path d="M8 40h32"/><path d="M14 40v-8h20v8"/><path d="M24 32V14"/><path d="M24 8l4 6H20z" fill="currentColor"/><path d="M18 30l-7-9M30 30l7-9"/>'),
  abm: wrap('<path d="M12 36L34 14"/><path d="M34 14l-1-7 7 1-6 6z" fill="currentColor"/><path d="M12 36l-4 4M17 31l-5-2M19 36l2 5"/>'),
  icbm: wrap('<path d="M10 10L36 36"/><path d="M36 36l1 6-6-1 5-5z" fill="currentColor"/><path d="M10 10c4 2 8 2 12 0"/><circle cx="38" cy="38" r="6" opacity=".5"/>'),
  city: wrap('<path d="M6 42h36"/><path d="M10 42V22h8v20M18 42V12h10v30M28 42V26h10v16"/><path d="M22 18h2M22 24h2M22 30h2"/>'),
  users: wrap('<circle cx="17" cy="16" r="6"/><path d="M5 40c0-8 5-12 12-12s12 4 12 12"/><circle cx="34" cy="18" r="5"/><path d="M32 29c6 0 11 3 11 10"/>'),
  globe: wrap('<circle cx="24" cy="24" r="18"/><path d="M6 24h36M24 6c-8 9-8 27 0 36M24 6c8 9 8 27 0 36"/>'),
  trophy: wrap('<path d="M14 8h20v10a10 10 0 0 1-20 0z"/><path d="M14 12H7c0 8 3 11 8 11M34 12h7c0 8-3 11-8 11"/><path d="M24 28v8M16 42h16M19 36h10"/>'),
  heli: wrap('<path d="M6 12h36M24 12v6"/><ellipse cx="22" cy="26" rx="12" ry="8"/><path d="M34 26h10l-3 6h-7"/><path d="M12 38h20"/>'),
  phone: wrap('<rect x="14" y="5" width="20" height="38" rx="4"/><path d="M21 38h6"/>'),
  mail: wrap('<rect x="5" y="10" width="38" height="28" rx="3"/><path d="M6 12l18 14 18-14"/>'),
  pin: wrap('<path d="M24 43s13-12 13-22a13 13 0 0 0-26 0c0 10 13 22 13 22z"/><circle cx="24" cy="21" r="5"/>'),
  check: wrap('<circle cx="24" cy="24" r="18"/><path d="M15 25l6 6 12-13"/>'),
  bolt: wrap('<path d="M26 4L10 26h12l-2 18 18-24H26z"/>'),
};

export const storeBadges = {
  android: '<svg class="badge-ico" viewBox="0 0 24 24" width="22" height="22" aria-hidden="true" focusable="false" xmlns="http://www.w3.org/2000/svg"><path fill="currentColor" d="M3.6 2.4c-.3.3-.5.8-.5 1.4v16.4c0 .6.2 1.1.5 1.4l.1.1 9.2-9.2v-.2L3.7 2.3z"/><path fill="currentColor" opacity=".8" d="M16 15.3l-3.1-3.1v-.2L16 8.9l.1.1 3.7 2.1c1 .6 1 1.5 0 2.1l-3.7 2.1z"/><path fill="currentColor" opacity=".6" d="M16.1 15.2L12.9 12 3.6 21.3c.3.4.9.4 1.5.1z"/><path fill="currentColor" opacity=".9" d="M16.1 8.8L5.1 2.6c-.6-.4-1.2-.3-1.5.1L12.9 12z"/></svg>',
  ios: '<svg class="badge-ico" viewBox="0 0 24 24" width="22" height="22" aria-hidden="true" focusable="false" xmlns="http://www.w3.org/2000/svg"><path fill="currentColor" d="M16.4 12.7c0-2.3 1.9-3.4 2-3.5-1.1-1.6-2.8-1.8-3.4-1.8-1.4-.2-2.8.8-3.5.8s-1.8-.8-3-.8c-1.5 0-3 .9-3.8 2.3-1.6 2.8-.4 7 1.2 9.3.8 1.100 1.700 2.400 2.900 2.300 1.200 0 1.600-.7 3-.7s1.800.7 3 .7c1.300 0 2.100-1.100 2.800-2.300.9-1.300 1.300-2.600 1.300-2.700-.1 0-2.500-1-2.500-3.600zM14.100 5.900c.6-.8 1.100-1.900.9-3-.9 0-2.100.6-2.700 1.400-.6.700-1.100 1.800-1 2.900 1 .1 2.100-.5 2.800-1.300z"/></svg>',
};
