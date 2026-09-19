/**
 * Client-Side WebP Image Compressor (FR-C3)
 * Mengompresi dan mengonversi gambar yang diunggah via admin/user
 * ke format WebP teroptimasi (< 200KB) sebelum disimpan ke Firestore/Storage.
 */

export interface CompressOptions {
  maxWidth?: number;
  maxHeight?: number;
  quality?: number;
}

export async function compressImageToWebP(
  file: File | Blob,
  options: CompressOptions = {}
): Promise<{ dataUrl: string; sizeBytes: number; width: number; height: number }> {
  const maxWidth = options.maxWidth || 1200;
  const maxHeight = options.maxHeight || 1200;
  const quality = options.quality !== undefined ? options.quality : 0.82;

  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target?.result as string;

      img.onload = () => {
        let width = img.width;
        let height = img.height;

        // Calculate aspect ratio aspect scale
        if (width > maxWidth) {
          height = Math.round((height * maxWidth) / width);
          width = maxWidth;
        }
        if (height > maxHeight) {
          width = Math.round((width * maxHeight) / height);
          height = maxHeight;
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('Gagal membuat HTML5 Canvas context'));
          return;
        }

        ctx.drawImage(img, 0, 0, width, height);

        // Convert to WebP format
        const webpDataUrl = canvas.toDataURL('image/webp', quality);
        const approxSize = Math.round((webpDataUrl.length * 3) / 4);

        resolve({
          dataUrl: webpDataUrl,
          sizeBytes: approxSize,
          width,
          height,
        });
      };

      img.onerror = (err) => reject(err);
    };
    reader.onerror = (err) => reject(err);
  });
}
