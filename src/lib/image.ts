// Compress an image file to a small data URL suitable for storing inline.
export async function compressImage(file: File, maxDim = 1100, quality = 0.82): Promise<string> {
  const bitmap = await createImageBitmap(file);
  const scale = Math.min(1, maxDim / Math.max(bitmap.width, bitmap.height));
  const w = Math.round(bitmap.width * scale);
  const h = Math.round(bitmap.height * scale);
  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d")!;
  ctx.drawImage(bitmap, 0, 0, w, h);
  bitmap.close?.();
  // Prefer webp; fall back to jpeg
  const type = "image/webp";
  return canvas.toDataURL(type, quality);
}
