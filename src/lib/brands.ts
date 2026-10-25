// South African loyalty-card brand catalog.
// Each preset maps a card name to a Logo.dev domain so tiles show the real brand logo.

export interface BrandPreset {
  name: string; // Full card / program name
  short: string; // Short display label
  domain: string; // Logo.dev lookup domain
  category: string;
  color: string; // Card face color
  keywords: string[]; // Substrings matched against a user-entered name
}

export const BRAND_PRESETS: BrandPreset[] = [
  // Grocery
  { name: "Pick n Pay Smart Shopper", short: "Pick n Pay", domain: "pnp.co.za", category: "grocery", color: "#0a5eb0", keywords: ["pick n pay", "pnp", "smart shopper"] },
  { name: "Checkers Xtra Savings", short: "Checkers", domain: "checkers.co.za", category: "grocery", color: "#d21f2b", keywords: ["checkers"] },
  { name: "Shoprite Xtra Savings", short: "Shoprite", domain: "shoprite.co.za", category: "grocery", color: "#e2001a", keywords: ["shoprite"] },
  { name: "Woolworths WRewards", short: "Woolworths", domain: "woolworths.co.za", category: "grocery", color: "#2a2a2a", keywords: ["woolworths", "wrewards"] },
  { name: "SPAR Rewards", short: "SPAR", domain: "thespar.co.za", category: "grocery", color: "#3f8f27", keywords: ["spar"] },
  { name: "Makro mCard", short: "Makro", domain: "makro.co.za", category: "retail", color: "#b78b00", keywords: ["makro", "mcard"] },
  // Pharmacy
  { name: "Clicks ClubCard", short: "Clicks", domain: "clicks.co.za", category: "pharmacy", color: "#0b7d77", keywords: ["clicks"] },
  { name: "Clicks Baby Club", short: "Clicks Baby", domain: "clicks.co.za", category: "pharmacy", color: "#0b7d77", keywords: ["clicks baby"] },
  { name: "Dis-Chem Benefit", short: "Dis-Chem", domain: "dischem.co.za", category: "pharmacy", color: "#005eb8", keywords: ["dis-chem", "dischem"] },
  { name: "Dis-Chem Baby Programme", short: "Dis-Chem Baby", domain: "dischem.co.za", category: "pharmacy", color: "#005eb8", keywords: ["dis-chem baby", "dischem baby"] },
  // Fuel
  { name: "Shell V+ Rewards", short: "Shell", domain: "shell.com", category: "fuel", color: "#dd1d21", keywords: ["shell"] },
  { name: "BP Rewards", short: "BP", domain: "bp.com", category: "fuel", color: "#1a6a34", keywords: ["bp"] },
  { name: "Sasol Rewards", short: "Sasol", domain: "sasol.com", category: "fuel", color: "#0f4f8c", keywords: ["sasol"] },
  { name: "Astron Energy Rewards", short: "Astron", domain: "astronenergy.co.za", category: "fuel", color: "#b3251f", keywords: ["astron"] },
  { name: "Engen 1App", short: "Engen", domain: "engen.co.za", category: "fuel", color: "#d9531e", keywords: ["engen"] },
  { name: "TotalEnergies Club", short: "TotalEnergies", domain: "totalenergies.com", category: "fuel", color: "#d0021b", keywords: ["total", "totalenergies"] },
  { name: "Puma Energy Rewards", short: "Puma Energy", domain: "pumaenergy.com", category: "fuel", color: "#b01c2e", keywords: ["puma"] },
  // Retail
  { name: "TFG Rewards", short: "TFG", domain: "tfg.co.za", category: "retail", color: "#c8102e", keywords: ["tfg", "foschini"] },
  { name: "PEP Club Card", short: "PEP", domain: "pep.co.za", category: "retail", color: "#d92b2b", keywords: ["pep"] },
  { name: "Ackermans Rewards", short: "Ackermans", domain: "ackermans.co.za", category: "retail", color: "#c0392b", keywords: ["ackermans"] },
  { name: "Builders Rewards", short: "Builders", domain: "builders.co.za", category: "retail", color: "#005bab", keywords: ["builders"] },
  { name: "Game Rewards", short: "Game", domain: "game.co.za", category: "retail", color: "#d21f2b", keywords: ["game"] },
  { name: "Tekkie Town Rewards", short: "Tekkie Town", domain: "tekkietown.co.za", category: "retail", color: "#1f3a5f", keywords: ["tekkie town"] },
  { name: "Baby City Rewards", short: "Baby City", domain: "babycity.co.za", category: "retail", color: "#1f6fd0", keywords: ["baby city"] },
  // Banks & rewards programs
  { name: "FNB eBucks", short: "eBucks", domain: "ebucks.com", category: "memberships", color: "#e03a48", keywords: ["ebucks", "fnb"] },
  { name: "Capitec Live Better", short: "Capitec", domain: "capitecbank.co.za", category: "memberships", color: "#0057b8", keywords: ["capitec", "live better"] },
  { name: "Discovery Miles", short: "Discovery", domain: "discovery.co.za", category: "memberships", color: "#1a5ec8", keywords: ["discovery miles", "discovery"] },
  { name: "Discovery Vitality", short: "Vitality", domain: "discovery.co.za", category: "memberships", color: "#1a5ec8", keywords: ["vitality"] },
  { name: "Absa Rewards", short: "Absa", domain: "absa.co.za", category: "memberships", color: "#c0141c", keywords: ["absa"] },
  { name: "Standard Bank UCount", short: "UCount", domain: "ucount.co.za", category: "memberships", color: "#1040a0", keywords: ["ucount", "standard bank"] },
  { name: "Nedbank Greenbacks", short: "Nedbank", domain: "nedbank.co.za", category: "memberships", color: "#0b8a47", keywords: ["greenbacks", "nedbank"] },
  { name: "Old Mutual Rewards", short: "Old Mutual", domain: "oldmutual.co.za", category: "memberships", color: "#0a7a5f", keywords: ["old mutual"] },
  { name: "Sanlam Reality", short: "Sanlam", domain: "sanlam.co.za", category: "memberships", color: "#004576", keywords: ["sanlam", "reality"] },
  { name: "TymeBank Rewards", short: "TymeBank", domain: "tymebank.co.za", category: "memberships", color: "#6a2c85", keywords: ["tymebank", "tyme"] },
  // Restaurants
  { name: "Spur Family Card", short: "Spur", domain: "spursteakhouses.co.za", category: "restaurants", color: "#c94f1e", keywords: ["spur"] },
  { name: "Kauai Rewards", short: "Kauai", domain: "kauai.co.za", category: "restaurants", color: "#4a8c2a", keywords: ["kauai"] },
  { name: "Wimpy Rewards", short: "Wimpy", domain: "wimpy.co.za", category: "restaurants", color: "#d0342c", keywords: ["wimpy"] },
  { name: "Panarottis Rewards", short: "Panarottis", domain: "panarottis.co.za", category: "restaurants", color: "#1d4f8c", keywords: ["panarottis"] },
  { name: "Steers Rewards", short: "Steers", domain: "steers.co.za", category: "restaurants", color: "#e31837", keywords: ["steers"] },
  { name: "Debonairs Pizza Rewards", short: "Debonairs", domain: "debonairspizza.co.za", category: "restaurants", color: "#d8232a", keywords: ["debonairs"] },
  { name: "Nando's PERi-Perks", short: "Nando's", domain: "nandos.co.za", category: "restaurants", color: "#dc0714", keywords: ["nando"] },
  { name: "McDonald's Rewards", short: "McDonald's", domain: "mcdonalds.co.za", category: "restaurants", color: "#da291c", keywords: ["mcdonald"] },
  { name: "KFC Rewards", short: "KFC", domain: "kfc.co.za", category: "restaurants", color: "#a3080c", keywords: ["kfc"] },
  { name: "Vida e Caffè Rewards", short: "Vida e", domain: "vidae.co.za", category: "restaurants", color: "#24523f", keywords: ["vida"] },
  // Travel & hotels
  { name: "SAA Voyager", short: "SAA", domain: "flysaa.com", category: "memberships", color: "#1f4e9c", keywords: ["saa", "voyager"] },
  { name: "British Airways Club", short: "BA Club", domain: "britishairways.com", category: "memberships", color: "#1a5a9e", keywords: ["british airways", "ba club"] },
  { name: "Airlink Skybucks", short: "Airlink", domain: "flyairlink.com", category: "memberships", color: "#0060a9", keywords: ["airlink", "skybucks"] },
  { name: "Tsogo Sun Rewards", short: "Tsogo Sun", domain: "tsogosun.com", category: "memberships", color: "#cc5214", keywords: ["tsogo"] },
  { name: "Legacy Lifestyle Rewards", short: "Legacy", domain: "legacyhotels.co.za", category: "memberships", color: "#8a6d2f", keywords: ["legacy"] },
  { name: "City Lodge Rewards", short: "City Lodge", domain: "citylodge.co.za", category: "memberships", color: "#c8102e", keywords: ["city lodge"] },
  { name: "Avis Preferred", short: "Avis", domain: "avis.co.za", category: "memberships", color: "#c1123f", keywords: ["avis"] },
  // Entertainment, media & other
  { name: "Ster-Kinekor SK Club", short: "Ster-Kinekor", domain: "sterkinekor.com", category: "memberships", color: "#b01230", keywords: ["ster-kinekor", "ster kinekor", "sk club"] },
  { name: "Nu Metro Scene Club", short: "Nu Metro", domain: "numetro.co.za", category: "memberships", color: "#d0021b", keywords: ["nu metro", "scene"] },
  { name: "Sun International MVG", short: "Sun MVG", domain: "suninternational.com", category: "memberships", color: "#a5761d", keywords: ["sun international", "mvg"] },
  { name: "DStv Rewards", short: "DStv", domain: "dstv.com", category: "memberships", color: "#0a3a8c", keywords: ["dstv"] },
  { name: "Virgin Active Rewards", short: "Virgin Active", domain: "virginactive.co.za", category: "memberships", color: "#c22026", keywords: ["virgin"] },
  { name: "Vodacom VodaBucks", short: "VodaBucks", domain: "vodacom.co.za", category: "memberships", color: "#d02424", keywords: ["vodacom", "vodabucks"] },
  { name: "MTN Rewards", short: "MTN", domain: "mtn.co.za", category: "memberships", color: "#e8b400", keywords: ["mtn"] },
  { name: "Telkom Rewards", short: "Telkom", domain: "telkom.co.za", category: "memberships", color: "#0a7fb0", keywords: ["telkom"] },
  { name: "MySchool MyVillage MyPlanet", short: "MySchool", domain: "myschool.co.za", category: "memberships", color: "#2f8c22", keywords: ["myschool", "myvillage", "myplanet"] },
  { name: "Varsity Vibe", short: "Varsity Vibe", domain: "varsityvibe.co.za", category: "memberships", color: "#5b2bd6", keywords: ["varsity"] },
];

// More specific keywords first so e.g. "Dis-Chem Baby" wins over "Dis-Chem".
const SORTED = [...BRAND_PRESETS].sort(
  (a, b) => Math.min(...b.keywords.map((k) => k.length)) - Math.min(...a.keywords.map((k) => k.length))
);

export function matchBrand(name: string): BrandPreset | null {
  const n = name.toLowerCase().trim();
  if (!n) return null;
  return SORTED.find((b) => b.keywords.some((k) => n.includes(k))) ?? null;
}
