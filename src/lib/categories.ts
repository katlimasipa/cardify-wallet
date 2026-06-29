import {
  ShoppingBasket, Cross, Droplet, ShoppingBag, Utensils, IdCard, Circle,
} from "lucide-react";

export type Category =
  | "grocery" | "pharmacy" | "fuel" | "retail" | "restaurants" | "memberships" | "other";

// Card face palettes — refined, not neon. Two-stop gradients for depth.
export const CATEGORIES: { value: Category; label: string; icon: typeof Circle; gradient: string }[] = [
  { value: "grocery",     label: "Grocery",     icon: ShoppingBasket, gradient: "linear-gradient(155deg,#1f3a2e 0%,#2f5d49 100%)" },
  { value: "pharmacy",    label: "Pharmacy",    icon: Cross,          gradient: "linear-gradient(155deg,#0f2a3a 0%,#1f4a63 100%)" },
  { value: "fuel",        label: "Fuel",        icon: Droplet,        gradient: "linear-gradient(155deg,#3a1a14 0%,#732c1f 100%)" },
  { value: "retail",      label: "Retail",      icon: ShoppingBag,    gradient: "linear-gradient(155deg,#2a1f3a 0%,#4a3766 100%)" },
  { value: "restaurants", label: "Restaurants", icon: Utensils,       gradient: "linear-gradient(155deg,#3a2814 0%,#73522a 100%)" },
  { value: "memberships", label: "Memberships", icon: IdCard,         gradient: "linear-gradient(155deg,#1a1f2e 0%,#2d3654 100%)" },
  { value: "other",       label: "Other",       icon: Circle,         gradient: "linear-gradient(155deg,#262626 0%,#404040 100%)" },
];

export const getCategory = (v: string) => CATEGORIES.find((c) => c.value === v) ?? CATEGORIES[6];

export const BARCODE_FORMATS = ["CODE128", "EAN13", "UPC", "PDF417", "DATAMATRIX", "QR"] as const;
export type BarcodeFormat = typeof BARCODE_FORMATS[number];
