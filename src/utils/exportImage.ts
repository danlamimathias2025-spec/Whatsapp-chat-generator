import { toPng, toJpeg, toBlob } from 'html-to-image';
import confetti from 'canvas-confetti';

export interface ExportOptions {
  format: 'png' | 'jpeg';
  scale: number; // 1, 2, 3
  quality?: number; // 0.95
  fileName?: string;
}

export async function exportElementAsImage(
  element: HTMLElement,
  options: ExportOptions = { format: 'png', scale: 2, quality: 0.95, fileName: 'whatsapp-chat' }
): Promise<string> {
  const pixelRatio = options.scale || 2;
  const fileName = options.fileName || `whatsapp-chat-${Date.now()}.${options.format}`;

  const config = {
    quality: options.quality || 0.95,
    pixelRatio: pixelRatio,
    cacheBust: true,
    style: {
      transform: 'none',
      margin: '0',
    },
  };

  try {
    let dataUrl: string;
    if (options.format === 'jpeg') {
      dataUrl = await toJpeg(element, config);
    } else {
      dataUrl = await toPng(element, config);
    }

    // Trigger download
    const link = document.createElement('a');
    link.download = fileName;
    link.href = dataUrl;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    // Celebrate with confetti
    confetti({
      particleCount: 60,
      spread: 60,
      origin: { y: 0.8 },
      colors: ['#00a884', '#9d32b5', '#3b82f6', '#10b981'],
    });

    return dataUrl;
  } catch (err) {
    console.error('Failed to export screenshot:', err);
    throw err;
  }
}

export async function copyElementToClipboard(element: HTMLElement, scale: number = 2): Promise<boolean> {
  try {
    const blob = await toBlob(element, {
      pixelRatio: scale,
      cacheBust: true,
    });
    if (!blob) throw new Error('Failed to create image blob');

    await navigator.clipboard.write([
      new ClipboardItem({
        'image/png': blob,
      }),
    ]);

    confetti({
      particleCount: 40,
      spread: 45,
      origin: { y: 0.8 },
      colors: ['#00a884', '#10b981'],
    });

    return true;
  } catch (err) {
    console.error('Failed to copy image to clipboard:', err);
    return false;
  }
}
