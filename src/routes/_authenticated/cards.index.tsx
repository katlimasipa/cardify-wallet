import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useMemo, useRef, useState } from "react";
import { Search, X } from "lucide-react";
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
  const [searchOpen, setSearchOpen] = useState(false);
  const [cat, setCat] = useState<string>("all");
  const searchRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (searchOpen) searchRef.current?.focus();
  }, [searchOpen]);

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
      <div className="mt-1 flex items-center justify-between">
        <p className="text-[13px] text-muted-foreground">
          {filtered.length} {filtered.length === 1 ? "card" : "cards"}
        </p>
        <button
          type="button"
          onClick={() => {
            if (searchOpen) setQ("");
            setSearchOpen((open) => !open);
          }}
          aria-label={searchOpen ? "Close card search" : "Search cards"}
          aria-expanded={searchOpen}
          className="grid h-10 w-10 place-items-center rounded-full surface tap"
        >
          {searchOpen ? <X className="h-[18px] w-[18px]" /> : <Search className="h-[18px] w-[18px]" />}
        </button>
      </div>

      {searchOpen && (
        <div className="relative mt-2">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            ref={searchRef}
            value={q}
            onChange={(e) => setQ(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Escape") {
                setQ("");
                setSearchOpen(false);
              }
            }}
            placeholder="Search cards"
            aria-label="Search cards"
            className="w-full rounded-full surface bg-white px-4 py-3 pl-10 text-[14px] outline-none focus:border-foreground"
          />
        </div>
      )}

      <div className="no-scrollbar -mx-5 mt-4 flex gap-2 overflow-x-auto px-5 pb-1">
        <Chip active={cat === "all"} onClick={() => setCat("all")}>All</Chip>
        {CATEGORIES.map((c) => (
          <Chip key={c.value} active={cat === c.value} onClick={() => setCat(c.value)}>{c.label}</Chip>
        ))}
      </div>

      <div className="mt-5">
        {isLoading ? (
          <div className="grid gap-3">{[0,1,2].map(i => <div key={i} className="h-[148px] animate-pulse rounded-[22px] surface" />)}</div>
        ) : filtered.length === 0 ? (
          <div className="surface rounded-[22px] px-6 py-12 text-center">
            <p className="text-[13px] text-muted-foreground">{cards.length === 0 ? "No cards yet." : "No cards match."}</p>
            {cards.length === 0 && (
              <Link to="/cards/new" className="mt-4 inline-flex rounded-full bg-foreground px-4 py-2 text-[12px] font-medium text-background">Add a card</Link>
            )}
          </div>
        ) : (
          <div className="flex flex-col">
            {filtered.map((c, index) => (
              <CardTile key={c.id} card={c} stacked stackIndex={index} />
            ))}
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
      className={`shrink-0 rounded-full px-4 py-2 text-[12px] font-medium tap ${
        active ? "bg-foreground text-background" : "border border-hairline bg-white text-muted-foreground"
      }`}
    >
      {children}
    </button>
  );
}
