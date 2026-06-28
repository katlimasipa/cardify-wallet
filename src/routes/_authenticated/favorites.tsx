import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Star } from "lucide-react";
import { listCards } from "@/lib/cards";
import { AppShell } from "@/components/AppShell";
import { CardTile } from "@/components/CardTile";

export const Route = createFileRoute("/_authenticated/favorites")({
  head: () => ({ meta: [{ title: "Favorites — CardVault" }] }),
  component: Favorites,
});

function Favorites() {
  const { data: cards = [], isLoading } = useQuery({ queryKey: ["cards"], queryFn: listCards });
  const favs = cards.filter((c) => c.is_favorite);

  return (
    <AppShell title="Favorites">
      {isLoading ? (
        <div className="mt-4 grid gap-3">{[0,1,2].map(i => <div key={i} className="h-[120px] animate-pulse rounded-3xl bg-muted/40" />)}</div>
      ) : favs.length === 0 ? (
        <div className="mt-10 grid place-items-center rounded-3xl glass p-10 text-center">
          <Star className="mb-3 h-7 w-7 text-yellow-400" />
          <h3 className="font-display text-lg font-semibold">No favorites yet</h3>
          <p className="mt-1 max-w-[240px] text-sm text-muted-foreground">Tap the star on a card to add it here.</p>
          <Link to="/cards" className="mt-5 rounded-full aurora-bg px-5 py-2.5 text-sm font-semibold text-white">Browse cards</Link>
        </div>
      ) : (
        <div className="mt-2 grid gap-3">
          {favs.map((c) => <CardTile key={c.id} card={c} />)}
        </div>
      )}
    </AppShell>
  );
}
