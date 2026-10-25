import { useState } from "react";

const TOKEN = import.meta.env.VITE_LOVABLE_CONNECTOR_LOGO_DEV_API_KEY ?? "";

export function logoUrl(domain: string, size = 128) {
  const query = new URLSearchParams({ token: TOKEN, size: String(size), format: "png" });
  return `https://img.logo.dev/${domain}?${query.toString()}`;
}

function initialsOf(name: string) {
  const words = name.replace(/[^a-zA-Z0-9\s']/g, " ").split(/\s+/).filter(Boolean);
  const letters = words.length === 1 && words[0].length <= 4
    ? words[0]
    : words.length === 1
      ? words[0].slice(0, 2)
      : words.slice(0, 2).map((w) => w[0]).join("");
  return (letters || "C").toUpperCase();
}

/**
 * Official brand logo from Logo.dev. Missing logos use a local text mark so
 * Logo.dev's generated monogram can never be mistaken for a brand logo.
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
  const [failedDomain, setFailedDomain] = useState<string | null>(null);

  if (domain === "plusmore.co.za") {
    return (
      <div className={`grid shrink-0 place-items-center rounded-full bg-white ${className}`} aria-hidden="true">
        <span className="whitespace-nowrap font-sans text-[9px] font-extrabold tracking-[-0.08em] text-[#171717]">+more</span>
      </div>
    );
  }

  if (!domain || failedDomain === domain) {
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
        onError={() => setFailedDomain(domain)}
        className="h-full w-full object-contain p-[18%]"
      />
    </div>
  );
}
