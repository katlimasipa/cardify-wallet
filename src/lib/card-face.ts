import type { Card } from "@/lib/cards";
import { getCategory } from "@/lib/categories";

const DEFAULT_CARD_COLOR = "#1a1a1a";
const LIGHT_INK = "#101a14";
const WARM_WHITE = "#fbf8ef";

function relativeLuminance(hex: string) {
  const value = hex.replace("#", "");
  if (!/^[0-9a-f]{6}$/i.test(value)) return 0.12;
  const channels = [0, 2, 4].map((offset) => {
    const channel = Number.parseInt(value.slice(offset, offset + 2), 16) / 255;
    return channel <= 0.04045 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * channels[0] + 0.7152 * channels[1] + 0.0722 * channels[2];
}

export function getCardFace(card: Pick<Card, "category" | "color">) {
  const background = card.color && card.color.toLowerCase() !== DEFAULT_CARD_COLOR
    ? card.color
    : getCategory(card.category).color;

  return {
    background,
    foreground: relativeLuminance(background) > 0.19 ? LIGHT_INK : WARM_WHITE,
  };
}
