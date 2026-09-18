export function BrandLockup({ compact = false }: { compact?: boolean }) {
  return (
    <div className="flex items-center gap-2" aria-label="CardVault">
      <img
        src="/icons/icon-192.png"
        alt=""
        className={`${compact ? "h-6 w-6" : "h-8 w-8"} object-contain`}
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