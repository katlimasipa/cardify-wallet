import mark from "@/assets/brand-mark.png";

export function BrandLockup({ compact = false }: { compact?: boolean }) {
  return (
    <div className="flex items-center gap-2" aria-label="CardVault">
      <img
        src={mark}
        alt=""
        width={32}
        height={32}
        className={`${compact ? "h-6 w-6" : "h-8 w-8"} shrink-0 object-contain invert dark:invert-0`}
      />
      <span
        className={`font-display font-semibold leading-none tracking-[-0.03em] ${
          compact ? "text-[1rem]" : "text-[1.35rem]"
        }`}
      >
        CardVault
      </span>
    </div>
  );
}
