import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { Search, Plus, Sparkles } from "lucide-react";
import { listCards } from "@/lib/cards";
import { AppShell } from "@/components/AppShell";
import { CardTile } from "@/components/CardTile";
import { CATEGORIES } from "@/lib/categories";

export const Route = createFileRoute("/_authenticated/cards/")({
  head: () => ({ meta: [{ title: "My Cards — CardVault" }] }),
  component: MyCards,
});

function MyCards() {
  const { data: cards = [], isLoading } = useQuery({ queryKey: ["cards"], queryFn: listCards });
  const [q, setQ] = useState("");
  const [cat, setCat] = useState<string>("all");

  const filtered = useMemo(() => {
    return cards.filter((c) => {
      if (cat !== "all" && c.category !== cat) return false;
      if (!q) return true;
      const s = q.toLowerCase();
      return c.name.toLowerCase().includes(s) || (c.membership_number ?? "").toLowerCase().includes(s);
    });
  }, [cards, q, cat]);

  return (
    <AppShell title="My Cards">
      <div className="mt-2 flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            value={q} onChange={(e) => setQ(e.target.value)}
            placeholder="Search cards"
            className="w-full rounded-2xl glass pl-10 pr-4 py-3 text-sm outline-none focus:ring-2 focus:ring-[var(--violet)]"
          />
        </div>
        <Link to="/cards/new" className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl aurora-bg text-white card-shadow active:scale-95">
          <Plus className="h-5 w-5" />
        </Link>
      </div>

      <div className="no-scrollbar -mx-4 mt-4 flex gap-2 overflow-x-auto px-4 pb-1">
        <Chip active={cat === "all"} onClick={() => setCat("all")}>All</Chip>
        {CATEGORIES.map((c) => (
          <Chip key={c.value} active={cat === c.value} onClick={() => setCat(c.value)}>{c.label}</Chip>
        ))}
      </div>

      <div className="mt-5">
        {isLoading ? (
          <div className="grid gap-3">{[0,1,2,3].map(i => <div key={i} className="h-[120px] animate-pulse rounded-3xl bg-muted/40" />)}</div>
        ) : filtered.length === 0 ? (
          <div className="grid place-items-center rounded-3xl glass p-10 text-center">
            <Sparkles className="mb-3 h-6 w-6 text-[var(--violet)]" />
            <p className="text-sm text-muted-foreground">{cards.length === 0 ? "No cards yet" : "No cards match"}</p>
            {cards.length === 0 && (
              <Link to="/cards/new" className="mt-4 rounded-full aurora-bg px-4 py-2 text-xs font-semibold text-white">Add a card</Link>
            )}
          </div>
        ) : (
          <div className="grid gap-3">
            {filtered.map((c) => <CardTile key={c.id} card={c} />)}
          </div>
        )}
      </div>
    </AppShell>
  );
}

function Chip({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      className={`shrink-0 rounded-full px-3.5 py-1.5 text-xs font-medium transition ${
        active ? "aurora-bg text-white card-shadow" : "glass text-muted-foreground"
      }`}
    >
      {children}
    </button>
  );
}
