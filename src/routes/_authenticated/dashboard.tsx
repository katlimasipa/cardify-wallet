import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { listCards } from "@/lib/cards";
import { AppShell } from "@/components/AppShell";
import { CardTile } from "@/components/CardTile";
import { useAuth } from "@/lib/auth";
import { Star, Clock, Sparkles, TrendingUp } from "lucide-react";

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
  const mostUsed = [...cards].sort((a, b) => b.open_count - a.open_count).slice(0, 3);
  const totalOpens = cards.reduce((sum, c) => sum + (c.open_count || 0), 0);

  const greeting = (() => {
    const h = new Date().getHours();
    if (h < 12) return "Good morning";
    if (h < 18) return "Good afternoon";
    return "Good evening";
  })();
  const name = (user?.user_metadata?.full_name as string) || user?.email?.split("@")[0] || "there";

  return (
    <AppShell>
      <div className="pt-[max(env(safe-area-inset-top),1rem)]">
        <p className="text-sm text-muted-foreground">{greeting},</p>
        <h1 className="font-display text-3xl font-semibold tracking-tight">{name}</h1>
      </div>

      <div className="mt-5 grid grid-cols-3 gap-2.5">
        <Stat label="Cards" value={cards.length} icon={Sparkles} />
        <Stat label="Favorites" value={favorites.length} icon={Star} />
        <Stat label="Scans" value={totalOpens} icon={TrendingUp} />
      </div>

      {isLoading ? (
        <div className="mt-8 grid gap-3">
          {[0,1,2].map(i => <div key={i} className="h-[120px] animate-pulse rounded-3xl bg-muted/40" />)}
        </div>
      ) : cards.length === 0 ? (
        <EmptyState />
      ) : (
        <>
          {recent.length > 0 && (
            <Section title="Recently used" icon={Clock}>
              <div className="grid gap-3">
                {recent.map((c) => <CardTile key={c.id} card={c} />)}
              </div>
            </Section>
          )}

          {favorites.length > 0 && (
            <Section title="Favorites" icon={Star} link={{ to: "/favorites", label: "See all" }}>
              <div className="grid gap-3">
                {favorites.map((c) => <CardTile key={c.id} card={c} />)}
              </div>
            </Section>
          )}

          {mostUsed.length > 0 && (
            <Section title="Most opened" icon={TrendingUp}>
              <div className="grid gap-2.5">
                {mostUsed.map((c, i) => (
                  <Link key={c.id} to="/cards/$id" params={{ id: c.id }} className="flex items-center justify-between rounded-2xl glass p-3.5">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="grid h-8 w-8 shrink-0 place-items-center rounded-lg aurora-bg text-xs font-bold text-white">#{i + 1}</div>
                      <div className="truncate text-sm font-medium">{c.name}</div>
                    </div>
                    <div className="shrink-0 text-xs text-muted-foreground">{c.open_count} opens</div>
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

function Stat({ label, value, icon: Icon }: { label: string; value: number; icon: typeof Star }) {
  return (
    <div className="rounded-2xl glass px-3 py-3">
      <Icon className="h-4 w-4 text-[var(--violet)]" />
      <div className="mt-2 font-display text-2xl font-semibold leading-none">{value}</div>
      <div className="mt-1 text-[10px] uppercase tracking-[0.14em] text-muted-foreground">{label}</div>
    </div>
  );
}

function Section({ title, icon: Icon, link, children }: { title: string; icon: typeof Star; link?: { to: string; label: string }; children: React.ReactNode }) {
  return (
    <section className="mt-7">
      <div className="mb-3 flex items-center justify-between">
        <h2 className="flex items-center gap-2 font-display text-base font-semibold">
          <Icon className="h-4 w-4 text-[var(--violet)]" /> {title}
        </h2>
        {link && <Link to={link.to as any} className="text-xs text-muted-foreground hover:text-foreground">{link.label}</Link>}
      </div>
      {children}
    </section>
  );
}

function EmptyState() {
  return (
    <div className="mt-10 grid place-items-center rounded-3xl glass p-8 text-center">
      <div className="mb-4 grid h-14 w-14 place-items-center rounded-2xl aurora-bg text-white card-shadow">
        <Sparkles className="h-6 w-6" />
      </div>
      <h3 className="font-display text-lg font-semibold">Your vault is empty</h3>
      <p className="mt-1.5 max-w-[240px] text-sm text-muted-foreground">Add your first loyalty card to get started.</p>
      <Link to="/cards/new" className="mt-5 inline-flex rounded-full aurora-bg px-5 py-2.5 text-sm font-semibold text-white">Add a card</Link>
    </div>
  );
}
