import { Link } from "@tanstack/react-router";
import type { Card } from "@/lib/cards";
import { getCategory } from "@/lib/categories";
import { matchBrand } from "@/lib/brands";
import { BrandLogo } from "@/components/BrandLogo";
import { getCardFace } from "@/lib/card-face";
import { Star } from "lucide-react";

export function CardTile({
  card,
  stacked = false,
  stackIndex = 0,
}: {
  card: Card;
  stacked?: boolean;
  stackIndex?: number;
}) {
  const cat = getCategory(card.category);
  const brand = matchBrand(card.name);
  const face = getCardFace(card);

  return (
    <Link
      to="/cards/$id"
      params={{ id: card.id }}
      className={`group block w-full tap ${stacked ? "relative" : ""}`}
      style={stacked ? { marginTop: stackIndex === 0 ? 0 : "-5rem", zIndex: stackIndex + 1 } : undefined}
    >
      <article
        className="membership-card relative flex aspect-[2.05/1] min-h-[148px] w-full overflow-hidden rounded-[18px] p-[18px] text-card-face-foreground card-shadow"
        style={{ backgroundColor: face.background, "--card-face-foreground": face.foreground } as React.CSSProperties}
      >
        <div className="relative flex flex-1 flex-col justify-between min-w-0">
          <div className="flex min-w-0 items-center gap-3.5">
            <BrandLogo domain={brand?.domain ?? null} name={card.name} className="h-10 w-10" />
            <div className="min-w-0">
              <div className="text-[9px] font-semibold uppercase tracking-[0.15em] text-card-face-foreground/70">{cat.label}</div>
              <h3 className="mt-0.5 truncate font-display text-[1.25rem] font-medium leading-tight">{card.name}</h3>
            </div>
          </div>
          {card.membership_number ? (
            <div className="font-mono text-[11px] tracking-[0.12em] text-card-face-foreground/80 truncate">
              {card.membership_number}
            </div>
          ) : (
            <div className="text-[10px] uppercase tracking-[0.15em] text-card-face-foreground/60">Digital membership</div>
          )}
        </div>

        {card.is_favorite && (
          <div className="relative ml-4 self-start">
            <Star className="h-3.5 w-3.5 fill-card-face-foreground text-card-face-foreground" aria-label="Favorite" />
          </div>
        )}
      </article>
    </Link>
  );
}

