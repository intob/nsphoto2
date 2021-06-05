import sharp from "sharp";

export function generateWebP(buffer) {
  return sharp(buffer).webp().toBuffer();
}