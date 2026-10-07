import { toBlob } from 'html-to-image';
import confetti from 'canvas-confetti';

export interface ExportOptions {
  format: 'png' | 'jpeg';
  scale: number; // 1, 2, 3
  quality?: number; // 0.95
  fileName?: string;
}

/**
 * Robust export function supporting Desktop, Mobile Browsers, PWA, and Android Capacitor WebView
 */
export async function exportElementAsImage(
  element: HTMLElement,
  options: ExportOptions = { format: 'png', scale: 2, quality: 0.95, fileName: 'whatscraft-chat' }
): Promise<string> {
  const scale = options.scale || 2;
  const extension = options.format || 'png';
  const fileName = options.fileName || `whatscraft-chat-${Date.now()}.${extension}`;
  const mimeType = extension === 'jpeg' ? 'image/jpeg' : 'image/png';

  const config = {
    quality: options.quality || 0.95,
    pixelRatio: scale,
    cacheBust: false,
    style: {
      transform: 'none',
      margin: '0',
    },
  };

  try {
    // 1. Generate image blob using html-to-image
    const blob = await toBlob(element, config);
    if (!blob) throw new Error('Failed to generate image blob from preview canvas.');

    // 2. Try Native Web Share API first (Ideal for Mobile / Android WebView)
    if (typeof navigator !== 'undefined' && navigator.share && navigator.canShare) {
      try {
        const file = new File([blob], fileName, { type: mimeType });
        if (navigator.canShare({ files: [file] })) {
          await navigator.share({
            title: 'WhatsCraft Screenshot',
            text: 'Check out this chat mockup created with WhatsCraft Studio!',
            files: [file],
          });

          confetti({
            particleCount: 60,
            spread: 60,
            origin: { y: 0.8 },
            colors: ['#00a884', '#9d32b5', '#3b82f6', '#10b981'],
          });

          return URL.createObjectURL(blob);
        }
      } catch (shareErr: any) {
        if (shareErr.name === 'AbortError') {
          return '';
        }
        console.warn('Native share failed, falling back to blob download:', shareErr);
      }
    }

    // 3. Fallback: Blob URL Download link (Works across Desktop & WebView where data: URLs are blocked)
    const blobUrl = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.download = fileName;
    link.href = blobUrl;
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();

    setTimeout(() => {
      document.body.removeChild(link);
      URL.revokeObjectURL(blobUrl);
    }, 1000);

    // Celebrate with confetti
    confetti({
      particleCount: 60,
      spread: 60,
      origin: { y: 0.8 },
      colors: ['#00a884', '#9d32b5', '#3b82f6', '#10b981'],
    });

    return blobUrl;
  } catch (err) {
    console.error('Failed to export screenshot:', err);
    throw err;
  }
}

export async function copyElementToClipboard(element: HTMLElement, scale: number = 2): Promise<boolean> {
  try {
    const blob = await toBlob(element, {
      pixelRatio: scale,
      cacheBust: false,
    });
    if (!blob) throw new Error('Failed to create image blob');

    if (navigator.clipboard && navigator.clipboard.write) {
      await navigator.clipboard.write([
        new ClipboardItem({
          [blob.type || 'image/png']: blob,
        }),
      ]);

      confetti({
        particleCount: 40,
        spread: 45,
        origin: { y: 0.8 },
        colors: ['#00a884', '#10b981'],
      });

      return true;
    }

    return false;
  } catch (err) {
    console.error('Failed to copy image to clipboard:', err);
    return false;
  }
}
