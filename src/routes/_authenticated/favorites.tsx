import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { listCards } from "@/lib/cards";
import { AppShell } from "@/components/AppShell";
import { CardTile } from "@/components/CardTile";

export const Route = createFileRoute("/_authenticated/favorites")({
  head: () => ({ meta: [{ title: "Saved — CardVault" }] }),
  component: Favorites,
});

function Favorites() {
  const { data: cards = [], isLoading } = useQuery({ queryKey: ["cards"], queryFn: listCards });
  const favs = cards.filter((c) => c.is_favorite);

  return (
    <AppShell title="Saved">
      {isLoading ? (
        <div className="mt-3 grid gap-3">{[0,1,2].map(i => <div key={i} className="h-[122px] animate-pulse rounded-[22px] surface" />)}</div>
      ) : favs.length === 0 ? (
        <div className="mt-12 surface rounded-[22px] px-6 py-12 text-center">
          <h3 className="font-display text-[1.25rem] font-semibold">Nothing saved yet</h3>
          <p className="mx-auto mt-2 max-w-[18rem] text-[13px] text-muted-foreground">
            Tap the star on any card to keep it handy here.
          </p>
          <Link to="/cards" className="mt-6 inline-flex rounded-full bg-foreground px-5 py-2.5 text-[13px] font-medium text-background tap">
            Browse cards
          </Link>
        </div>
      ) : (
        <div className="mt-1 grid gap-3">
          {favs.map((c) => <CardTile key={c.id} card={c} />)}
        </div>
      )}
    </AppShell>
  );
}
