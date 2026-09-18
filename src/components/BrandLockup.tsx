import wordmark from "@/assets/cardvault-wordmark.png.asset.json";

export function BrandLockup({ compact = false }: { compact?: boolean }) {
  return (
    <div className="flex items-center" aria-label="CardVault">
      <img
        src={wordmark.url}
        alt="CardVault"
        className={`${compact ? "h-6" : "h-8"} w-auto object-contain invert dark:invert-0`}
      />
    </div>
  );
}