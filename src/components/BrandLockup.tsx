import mark from "@/assets/cardvault-mark.png.asset.json";
import wordmark from "@/assets/cardvault-wordmark.png.asset.json";

export function BrandLockup({ compact = false }: { compact?: boolean }) {
  return (
    <div className="flex items-center gap-2.5" aria-label="CardVault">
      <img
        src={mark.url}
        alt=""
        className={`${compact ? "h-7 w-7" : "h-8 w-8"} object-contain invert dark:invert-0`}
      />
      <img
        src={wordmark.url}
        alt="CardVault"
        className={`${compact ? "h-[14px]" : "h-4"} w-auto object-contain invert dark:invert-0`}
      />
    </div>
  );
}