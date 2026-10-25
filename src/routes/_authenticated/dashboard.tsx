import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { listCards } from "@/lib/cards";
import { AppShell } from "@/components/AppShell";
import { CardTile } from "@/components/CardTile";
import { useAuth } from "@/lib/auth";
import { getDisplayName } from "@/lib/profile";

export const Route = createFileRoute("/_authenticated/dashboard")({
  head: () => ({ meta: [{ title: "Dashboard — CardVault" }] }),
  component: Dashboard,
});

function Dashboard() {
  const { user } = useAuth();
  const { data: cards = [], isLoading } = useQuery({ queryKey: ["cards"], queryFn: listCards });

  const recent = [...cards]
    .filter((c) => c.last_opened_at)
    .sort((a, b) => (b.last_opened_at ?? "").localeCompare(a.last_opened_at ?? ""))
    .slice(0, 4);
  const favorites = cards.filter((c) => c.is_favorite).slice(0, 4);
  const mostUsed = [...cards].sort((a, b) => b.open_count - a.open_count).filter(c => c.open_count > 0).slice(0, 3);
  const totalOpens = cards.reduce((sum, c) => sum + (c.open_count || 0), 0);

  const greeting = (() => {
    const h = new Date().getHours();
    if (h < 12) return "Morning";
    if (h < 18) return "Afternoon";
    return "Evening";
  })();
  const name = getDisplayName(user);

  return (
    <AppShell>
      <div className="pt-[max(env(safe-area-inset-top),1rem)]">
        <p className="text-[11px] uppercase tracking-[0.28em] text-muted-foreground">{greeting}</p>
        <h1 className="mt-2 font-display text-[2.65rem] font-semibold leading-[0.98] tracking-[-0.05em]">{name || "Your cards"}</h1>
      </div>

      <dl className="mt-7 grid grid-cols-3 gap-3 border-y border-hairline py-5">
        <Stat label="Cards" value={cards.length} />
        <Stat label="Saved" value={favorites.length} divide />
        <Stat label="Scans" value={totalOpens} divide />
      </dl>

      {isLoading ? (
        <div className="mt-8 grid gap-3">
          {[0,1,2].map(i => <div key={i} className="h-[122px] animate-pulse rounded-[22px] surface" />)}
        </div>
      ) : cards.length === 0 ? (
        <EmptyState />
      ) : (
        <>
          {recent.length > 0 && (
            <Section title="Recent">
              <div className="grid gap-4 sm:grid-cols-2">{recent.map((c) => <CardTile key={c.id} card={c} />)}</div>
            </Section>
          )}

          {favorites.length > 0 && (
            <Section title="Saved" link={{ to: "/favorites", label: "See all" }}>
              <div className="grid gap-4 sm:grid-cols-2">{favorites.map((c) => <CardTile key={c.id} card={c} />)}</div>
            </Section>
          )}

          {mostUsed.length > 0 && (
            <Section title="Most opened">
              <div className="overflow-hidden rounded-[18px] surface">
                {mostUsed.map((c, i) => (
                  <Link key={c.id} to="/cards/$id" params={{ id: c.id }}
                    className="flex items-center justify-between border-b border-hairline px-4 py-3.5 last:border-0">
                    <div className="flex items-center gap-3 min-w-0">
                      <span className="text-[11px] tabular-nums text-muted-foreground w-4">{i + 1}</span>
                      <span className="truncate text-[14px] font-medium">{c.name}</span>
                    </div>
                    <span className="shrink-0 text-[11px] tabular-nums text-muted-foreground">{c.open_count}</span>
                  </Link>
                ))}
              </div>
            </Section>
          )}
        </>
      )}
    </AppShell>
  );
}

function Stat({ label, value, divide }: { label: string; value: number; divide?: boolean }) {
  return (
    <div className={divide ? "border-l border-hairline pl-3" : ""}>
      <dd className="font-display text-[2rem] font-medium leading-none tabular-nums">{value}</dd>
      <dt className="mt-1.5 text-[10px] uppercase tracking-[0.22em] text-muted-foreground">{label}</dt>
    </div>
  );
}

function Section({ title, link, children }: { title: string; link?: { to: string; label: string }; children: React.ReactNode }) {
  return (
    <section className="mt-8">
      <div className="mb-3 flex items-baseline justify-between">
      <h2 className="font-sans text-[1.25rem] font-semibold tracking-[-0.035em]">{title}</h2>
        {link && <Link to={link.to as any} className="text-[13px] font-medium text-primary hover:opacity-75">{link.label}</Link>}
      </div>
      {children}
    </section>
  );
}

function EmptyState() {
  return (
    <div className="mt-12 surface rounded-[18px] px-6 py-12 text-center">
      <h3 className="font-display text-[1.7rem] font-medium">Your vault is empty</h3>
      <p className="mx-auto mt-2 max-w-[18rem] text-[13px] text-muted-foreground">
        Add your first loyalty card and it will appear here for instant scanning.
      </p>
      <Link to="/cards/new" className="mt-6 inline-flex rounded-xl bg-primary px-5 py-3 text-[13px] font-semibold text-primary-foreground tap">
        Add a card
      </Link>
    </div>
  );
}
