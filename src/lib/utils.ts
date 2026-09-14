import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Client-side Canvas Image Resizer & Compressor for Mobile Devices.
 * Reduces 10MB+ camera screenshots down to ~300KB Base64 payload.
 */
export async function compressImageForMobile(
  dataUrl: string,
  maxWidth: number = 1280,
  maxHeight: number = 1280,
  quality: number = 0.85
): Promise<string> {
  return new Promise((resolve) => {
    // If SVG or tiny preset, return immediately
    if (dataUrl.startsWith("data:image/svg+xml") || dataUrl.length < 50000) {
      resolve(dataUrl);
      return;
    }

    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      let width = img.width;
      let height = img.height;

      if (width > maxWidth || height > maxHeight) {
        if (width > height) {
          height = Math.round((height * maxWidth) / width);
          width = maxWidth;
        } else {
          width = Math.round((width * maxHeight) / height);
          height = maxHeight;
        }
      }

      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext("2d");

      if (!ctx) {
        resolve(dataUrl);
        return;
      }

      ctx.drawImage(img, 0, 0, width, height);
      const compressedDataUrl = canvas.toDataURL("image/jpeg", quality);
      resolve(compressedDataUrl);
    };

    img.onerror = () => {
      resolve(dataUrl);
    };

    img.src = dataUrl;
  });
}

