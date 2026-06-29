import { Link } from "@tanstack/react-router";
import type { Card } from "@/lib/cards";
import { getCategory } from "@/lib/categories";

export function CardTile({ card }: { card: Card }) {
  const cat = getCategory(card.category);
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
        className="relative flex h-[122px] w-full overflow-hidden rounded-[22px] p-5 text-white card-shadow"
        style={{ background: bg }}
      >
        {/* subtle inner highlight */}
        <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-white/15" />
        <div className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full bg-white/[0.06] blur-2xl" />

        <div className="relative flex flex-1 flex-col justify-between min-w-0">
          <div className="min-w-0">
            <div className="text-[10px] uppercase tracking-[0.22em] text-white/55">{cat.label}</div>
            <h3 className="mt-1 truncate font-display text-[1.05rem] font-semibold leading-tight">{card.name}</h3>
          </div>
          {card.membership_number ? (
            <div className="font-mono text-[11px] tracking-[0.18em] text-white/70 truncate">
              {card.membership_number}
            </div>
          ) : (
            <div className="text-[11px] text-white/45">No number</div>
          )}
        </div>

        {card.is_favorite && (
          <div className="absolute right-4 top-4 h-1.5 w-1.5 rounded-full bg-white/90" aria-label="Favorite" />
        )}
      </article>
    </Link>
  );
}
