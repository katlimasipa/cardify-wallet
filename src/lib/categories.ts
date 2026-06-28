import {
  ShoppingCart, Pill, Fuel, Store, UtensilsCrossed, IdCard, Sparkles,
} from "lucide-react";

export type Category =
  | "grocery" | "pharmacy" | "fuel" | "retail" | "restaurants" | "memberships" | "other";

export const CATEGORIES: { value: Category; label: string; icon: typeof ShoppingCart; gradient: string }[] = [
  { value: "grocery",     label: "Grocery",     icon: ShoppingCart,     gradient: "linear-gradient(135deg,#16a34a,#65a30d)" },
  { value: "pharmacy",    label: "Pharmacy",    icon: Pill,             gradient: "linear-gradient(135deg,#06b6d4,#3b82f6)" },
  { value: "fuel",        label: "Fuel",        icon: Fuel,             gradient: "linear-gradient(135deg,#ef4444,#f97316)" },
  { value: "retail",      label: "Retail",      icon: Store,            gradient: "linear-gradient(135deg,#a855f7,#ec4899)" },
  { value: "restaurants", label: "Restaurants", icon: UtensilsCrossed,  gradient: "linear-gradient(135deg,#f59e0b,#d97706)" },
  { value: "memberships", label: "Memberships", icon: IdCard,           gradient: "linear-gradient(135deg,#6366f1,#8b5cf6)" },
  { value: "other",       label: "Other",       icon: Sparkles,         gradient: "linear-gradient(135deg,#64748b,#475569)" },
];

export const getCategory = (v: string) => CATEGORIES.find((c) => c.value === v) ?? CATEGORIES[6];

export const BARCODE_FORMATS = ["CODE128", "EAN13", "UPC", "PDF417", "DATAMATRIX", "QR"] as const;
export type BarcodeFormat = typeof BARCODE_FORMATS[number];
