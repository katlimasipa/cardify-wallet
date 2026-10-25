import {
  ShoppingBasket, Cross, Droplet, ShoppingBag, Utensils, IdCard, Circle,
} from "lucide-react";

export type Category =
  | "grocery" | "pharmacy" | "fuel" | "retail" | "restaurants" | "memberships" | "other";

export const CATEGORIES: { value: Category; label: string; icon: typeof Circle; color: string }[] = [
  { value: "grocery",     label: "Grocery",     icon: ShoppingBasket, color: "#244c3d" },
  { value: "pharmacy",    label: "Pharmacy",    icon: Cross,          color: "#28576a" },
  { value: "fuel",        label: "Fuel",        icon: Droplet,        color: "#704333" },
  { value: "retail",      label: "Retail",      icon: ShoppingBag,    color: "#514664" },
  { value: "restaurants", label: "Restaurants", icon: Utensils,       color: "#785a31" },
  { value: "memberships", label: "Memberships", icon: IdCard,         color: "#3b4b62" },
  { value: "other",       label: "Other",       icon: Circle,         color: "#424742" },
];

export const getCategory = (v: string) => CATEGORIES.find((c) => c.value === v) ?? CATEGORIES[6];

export const BARCODE_FORMATS = ["CODE128", "EAN13", "UPC", "PDF417", "DATAMATRIX", "QR"] as const;
export type BarcodeFormat = typeof BARCODE_FORMATS[number];
