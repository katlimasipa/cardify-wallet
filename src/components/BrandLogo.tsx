import { useState } from "react";

const TOKEN = import.meta.env.VITE_LOVABLE_CONNECTOR_LOGO_DEV_API_KEY ?? "";

export function logoUrl(domain: string, size = 128) {
  return `https://img.logo.dev/${domain}?token=${TOKEN}&size=${size}&format=png&fallback=monogram`;
}

function initialsOf(name: string) {
  const words = name.replace(/[^a-zA-Z0-9\s']/g, " ").split(/\s+/).filter(Boolean);
  const letters = words.slice(0, 2).map((w) => w[0]).join("");
  return (letters || "C").toUpperCase();
}

/**
 * Real brand logo from Logo.dev inside a white chip, so any logo stays
 * legible on dark or colored card faces. Falls back to a monogram.
 */
export function BrandLogo({
  domain,
  name,
  className = "h-11 w-11",
}: {
  domain: string | null;
  name: string;
  className?: string;
}) {
  const [failed, setFailed] = useState(false);

  if (!domain || failed) {
    return (
      <div
        className={`grid shrink-0 place-items-center rounded-full bg-white/95 ${className}`}
        aria-hidden="true"
      >
        <span className="font-display text-[13px] font-semibold tracking-tight text-black/70">
          {initialsOf(name)}
        </span>
      </div>
    );
  }

  return (
    <div className={`shrink-0 overflow-hidden rounded-full bg-white/95 ${className}`}>
      <img
        src={logoUrl(domain)}
        alt=""
        loading="lazy"
        onError={() => setFailed(true)}
        className="h-full w-full object-contain p-[18%]"
      />
    </div>
  );
}
