import fs from 'fs';
import path from 'path';
import { Resvg } from '@resvg/resvg-js';

const publicDir = path.resolve('public');
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

// Exact replica of the user's uploaded icon
const svgContent = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512">
  <defs>
    <linearGradient id="waGreenGrad" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#4CE876"/>
      <stop offset="50%" stop-color="#3CD56B"/>
      <stop offset="100%" stop-color="#23BD5E"/>
    </linearGradient>
    <filter id="subtleShadow" x="-10%" y="-10%" width="120%" height="120%">
      <feDropShadow dx="0" dy="4" stdDeviation="6" flood-color="#000000" flood-opacity="0.1"/>
    </filter>
  </defs>

  <!-- App Icon Squircle Background -->
  <rect width="512" height="512" rx="115" fill="url(#waGreenGrad)"/>

  <!-- Logo Graphics Group -->
  <g fill="none" stroke="#FFFFFF" stroke-linecap="round" stroke-linejoin="round">
    <!-- Speech Bubble Outline with gap at top right and speech tail at bottom left -->
    <path 
      d="M 296 155 
         C 200 152, 134 220, 134 300 
         C 134 330, 144 354, 160 376 
         L 133 425 
         L 194 407 
         C 216 418, 240 424, 266 424 
         C 346 424, 412 360, 412 280 
         C 412 254, 405 230, 392 210" 
      stroke-width="26" 
    />
  </g>

  <!-- Horizontal Minus / Pill Bar at Top Right -->
  <rect x="318" y="170" width="80" height="24" rx="12" fill="#FFFFFF"/>

  <!-- Phone Receiver Handle Centered inside bubble -->
  <path 
    fill="#FFFFFF" 
    d="M 226 205
       C 218 205, 206 211, 201 219
       C 193 232, 195 258, 218 296
       C 241 334, 266 348, 281 349
       C 292 349, 302 342, 309 332
       C 313 326, 319 313, 314 306
       C 310 299, 296 290, 287 285
       C 278 280, 273 282, 268 288
       C 264 293, 258 299, 252 297
       C 246 295, 235 287, 225 272
       C 215 257, 213 247, 216 242
       C 219 237, 227 234, 230 228
       C 233 222, 230 209, 226 205 Z"
  />
</svg>`;

// Also generate full-bleed / maskable version (without rounded corners so OS can crop safely)
const maskableSvgContent = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512">
  <defs>
    <linearGradient id="waGreenGradMask" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#4CE876"/>
      <stop offset="50%" stop-color="#3CD56B"/>
      <stop offset="100%" stop-color="#23BD5E"/>
    </linearGradient>
  </defs>

  <!-- Full bleed Background for Maskable Icon -->
  <rect width="512" height="512" fill="url(#waGreenGradMask)"/>

  <!-- Scaled slightly for safe zone -->
  <g transform="translate(38, 38) scale(0.85)">
    <!-- Speech Bubble Outline with gap at top right and speech tail at bottom left -->
    <path 
      d="M 296 155 
         C 200 152, 134 220, 134 300 
         C 134 330, 144 354, 160 376 
         L 133 425 
         L 194 407 
         C 216 418, 240 424, 266 424 
         C 346 424, 412 360, 412 280 
         C 412 254, 405 230, 392 210" 
      fill="none"
      stroke="#FFFFFF" 
      stroke-width="26" 
      stroke-linecap="round" 
      stroke-linejoin="round"
    />

    <!-- Horizontal Minus / Pill Bar at Top Right -->
    <rect x="318" y="170" width="80" height="24" rx="12" fill="#FFFFFF"/>

    <!-- Phone Receiver Handle Centered inside bubble -->
    <path 
      fill="#FFFFFF" 
      d="M 226 205
         C 218 205, 206 211, 201 219
         C 193 232, 195 258, 218 296
         C 241 334, 266 348, 281 349
         C 292 349, 302 342, 309 332
         C 313 326, 319 313, 314 306
         C 310 299, 296 290, 287 285
         C 278 280, 273 282, 268 288
         C 264 293, 258 299, 252 297
         C 246 295, 235 287, 225 272
         C 215 257, 213 247, 216 242
         C 219 237, 227 234, 230 228
         C 233 222, 230 209, 226 205 Z"
    />
  </g>
</svg>`;

// Save SVG icon
fs.writeFileSync(path.join(publicDir, 'icon.svg'), svgContent);
console.log('Saved public/icon.svg');

// Render PNGs for Web & PWA
const icons = [
  { name: 'pwa-192x192.png', size: 192, svg: svgContent },
  { name: 'pwa-512x512.png', size: 512, svg: svgContent },
  { name: 'apple-touch-icon.png', size: 180, svg: svgContent },
  { name: 'pwa-maskable-512x512.png', size: 512, svg: maskableSvgContent },
];

for (const icon of icons) {
  const resvg = new Resvg(icon.svg, {
    fitTo: {
      mode: 'width',
      value: icon.size,
    },
  });
  const pngData = resvg.render();
  const pngBuffer = pngData.asPng();
  fs.writeFileSync(path.join(publicDir, icon.name), pngBuffer);
  console.log(`Generated ${icon.name} (${icon.size}x${icon.size})`);
}

// Generate Android Launcher Icons into android/ directory if present
const androidResDir = path.resolve('android/app/src/main/res');
if (fs.existsSync(androidResDir)) {
  const androidDensities = [
    { dir: 'mipmap-mdpi', size: 48, fgSize: 108 },
    { dir: 'mipmap-hdpi', size: 72, fgSize: 162 },
    { dir: 'mipmap-xhdpi', size: 96, fgSize: 216 },
    { dir: 'mipmap-xxhdpi', size: 144, fgSize: 324 },
    { dir: 'mipmap-xxxhdpi', size: 192, fgSize: 432 },
  ];

  for (const { dir, size, fgSize } of androidDensities) {
    const targetDir = path.join(androidResDir, dir);
    if (!fs.existsSync(targetDir)) {
      fs.mkdirSync(targetDir, { recursive: true });
    }
    
    // 1. Full launcher icon (legacy & round)
    const resvgFull = new Resvg(svgContent, {
      fitTo: {
        mode: 'width',
        value: size,
      },
    });
    const pngBufferFull = resvgFull.render().asPng();
    fs.writeFileSync(path.join(targetDir, 'ic_launcher.png'), pngBufferFull);
    fs.writeFileSync(path.join(targetDir, 'ic_launcher_round.png'), pngBufferFull);

    // 2. Adaptive Foreground launcher icon (maskable full-bleed)
    const resvgFg = new Resvg(maskableSvgContent, {
      fitTo: {
        mode: 'width',
        value: fgSize,
      },
    });
    const pngBufferFg = resvgFg.render().asPng();
    fs.writeFileSync(path.join(targetDir, 'ic_launcher_foreground.png'), pngBufferFg);

    console.log(`Generated Android launcher icons for ${dir}`);
  }
}
