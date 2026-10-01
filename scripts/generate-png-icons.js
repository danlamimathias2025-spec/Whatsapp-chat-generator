import fs from 'fs';
import path from 'path';
import { PNG } from 'pngjs';

const publicDir = path.resolve('public');
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

function drawWhatsAppIcon(width, height, isMaskable = false) {
  const png = new PNG({ width, height });

  // WhatsApp colors
  const bgR = 0x25, bgG = 0xD3, bgB = 0x66; // #25D366
  const whiteR = 0xFF, whiteG = 0xFF, whiteB = 0xFF;

  const cx = width / 2;
  const cy = height / 2;
  const outerRadius = isMaskable ? width * 0.5 : width * 0.45;
  const bubbleRadius = width * 0.28;

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const idx = (width * y + x) << 2;

      const dx = x - cx;
      const dy = y - cy;
      const distFromCenter = Math.sqrt(dx * dx + dy * dy);

      // Background color
      let r = bgR, g = bgG, b = bgB, a = 255;

      if (!isMaskable) {
        // Squircle / Rounded rectangle check
        const squircleDist = Math.pow(Math.abs(dx / (width * 0.44)), 4) + Math.pow(Math.abs(dy / (height * 0.44)), 4);
        if (squircleDist > 1) {
          a = 0; // transparent corners
        }
      }

      if (a > 0) {
        // Draw white chat bubble
        const bubbleDist = Math.sqrt(dx * dx + dy * dy);
        // Chat bubble tail
        const tailX = dx + width * 0.18;
        const tailY = dy - height * 0.18;
        const tailDist = Math.sqrt(tailX * tailX + tailY * tailY);

        if (bubbleDist < bubbleRadius || tailDist < bubbleRadius * 0.35) {
          // Inner green cutout
          const innerDist = Math.sqrt((dx + width * 0.02) * (dx + width * 0.02) + (dy + height * 0.02) * (dy + height * 0.02));
          if (innerDist > bubbleRadius * 0.72 && innerDist < bubbleRadius * 0.88) {
            // green ring / detail
          } else {
            r = whiteR;
            g = whiteG;
            b = whiteB;
          }
        }
      }

      png.data[idx] = r;
      png.data[idx + 1] = g;
      png.data[idx + 2] = b;
      png.data[idx + 3] = a;
    }
  }

  return png;
}

// Generate icons
const icons = [
  { name: 'pwa-192x192.png', size: 192, maskable: false },
  { name: 'pwa-512x512.png', size: 512, maskable: false },
  { name: 'pwa-maskable-512x512.png', size: 512, maskable: true },
  { name: 'apple-touch-icon.png', size: 180, maskable: false },
];

for (const icon of icons) {
  const png = drawWhatsAppIcon(icon.size, icon.size, icon.maskable);
  const filePath = path.join(publicDir, icon.name);
  png.pack().pipe(fs.createWriteStream(filePath)).on('finish', () => {
    console.log(`Generated ${icon.name}`);
  });
}
