import { Link } from "@tanstack/react-router";
import type { Card } from "@/lib/cards";
import { getCategory } from "@/lib/categories";
import { matchBrand } from "@/lib/brands";
import { BrandLogo } from "@/components/BrandLogo";
import { ArrowUpRight, Star } from "lucide-react";

export function CardTile({ card }: { card: Card }) {
  const cat = getCategory(card.category);
  const brand = matchBrand(card.name);
  const bg = card.color && card.color !== "#1a1a1a"
    ? `linear-gradient(155deg, ${card.color}, color-mix(in oklab, ${card.color} 55%, #000))`
    : cat.gradient;

  return (
    <Link
      to="/cards/$id"
      params={{ id: card.id }}
      className="group block w-full tap"
    >
      <article
        className="membership-card relative flex aspect-[1.9/1] min-h-[132px] w-full overflow-hidden rounded-[18px] p-5 text-card-face-foreground card-shadow"
        style={{ background: bg }}
      >
        <div className="card-noise pointer-events-none absolute inset-0" />
        <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-card-face-foreground/20" />

        <div className="relative flex flex-1 flex-col justify-between min-w-0">
          <div className="flex min-w-0 items-center gap-3">
            <BrandLogo domain={brand?.domain ?? null} name={card.name} className="h-10 w-10" />
            <div className="min-w-0">
              <div className="text-[9px] font-semibold uppercase tracking-[0.2em] text-card-face-foreground/55">{cat.label}</div>
              <h3 className="mt-1 truncate font-display text-[1.2rem] font-semibold leading-tight">{card.name}</h3>
            </div>
          </div>
          {card.membership_number ? (
            <div className="font-mono text-[11px] tracking-[0.16em] text-card-face-foreground/70 truncate">
              {card.membership_number}
            </div>
          ) : (
            <div className="text-[10px] uppercase tracking-[0.16em] text-card-face-foreground/45">Digital membership</div>
          )}
        </div>

        <div className="relative ml-4 flex flex-col items-end justify-between">
          <ArrowUpRight className="h-4 w-4 text-card-face-foreground/55 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          {card.is_favorite && <Star className="h-3.5 w-3.5 fill-card-face-foreground text-card-face-foreground" aria-label="Favorite" />}
        </div>
      </article>
    </Link>
  );
}

