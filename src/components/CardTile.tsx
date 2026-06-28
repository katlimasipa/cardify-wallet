import { Link } from "@tanstack/react-router";
import { Star } from "lucide-react";
import type { Card } from "@/lib/cards";
import { getCategory } from "@/lib/categories";

export function CardTile({ card }: { card: Card }) {
  const cat = getCategory(card.category);
  const Icon = cat.icon;
  const bg = card.color && card.color !== "#1a1a1a"
    ? `linear-gradient(135deg, ${card.color}, color-mix(in oklab, ${card.color} 60%, black))`
    : cat.gradient;

  return (
    <Link
      to="/cards/$id"
      params={{ id: card.id }}
      className="group block w-full"
    >
      <div
        className="relative flex h-[120px] w-full overflow-hidden rounded-3xl p-5 text-white card-shadow transition-transform duration-300 active:scale-[0.98] group-hover:scale-[1.01]"
        style={{ background: bg }}
      >
        <div className="absolute -right-6 -top-6 h-32 w-32 rounded-full bg-white/10 blur-2xl" />
        <div className="relative flex flex-1 flex-col justify-between min-w-0">
          <div className="flex items-center gap-2 min-w-0">
            <div className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-white/15 backdrop-blur">
              <Icon className="h-4.5 w-4.5" />
            </div>
            <div className="min-w-0">
              <div className="truncate text-base font-semibold tracking-tight">{card.name}</div>
              <div className="text-[10px] uppercase tracking-[0.18em] opacity-70">{cat.label}</div>
            </div>
            {card.is_favorite && <Star className="ml-auto h-4 w-4 shrink-0 fill-yellow-300 text-yellow-300" />}
          </div>
          {card.membership_number && (
            <div className="font-mono text-xs tracking-widest opacity-80 truncate">
              •••• {card.membership_number.slice(-4)}
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}
