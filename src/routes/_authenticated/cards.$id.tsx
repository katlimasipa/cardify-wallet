import { createFileRoute, useNavigate, useParams } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ArrowLeft, Star, Trash2, Sun, Maximize, Share2, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { bumpOpen, deleteCard, getCard, updateCard } from "@/lib/cards";
import { BarcodeView } from "@/components/BarcodeView";
import { getCategory } from "@/lib/categories";

export const Route = createFileRoute("/_authenticated/cards/$id")({
  head: () => ({ meta: [{ title: "Card — CardVault" }] }),
  component: CardDetail,
});

function CardDetail() {
  const { id } = useParams({ from: "/_authenticated/cards/$id" });
  const navigate = useNavigate();
  const qc = useQueryClient();
  const { data: card, isLoading } = useQuery({ queryKey: ["card", id], queryFn: () => getCard(id) });
  const [bright, setBright] = useState(false);
  const [full, setFull] = useState(false);

  useEffect(() => {
    if (card) bumpOpen(card.id, card.open_count).then(() => qc.invalidateQueries({ queryKey: ["cards"] }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [card?.id]);

  useEffect(() => {
    if (!bright) return;
    const prev = document.body.style.background;
    document.body.style.background = "white";
    return () => { document.body.style.background = prev; };
  }, [bright]);

  const favMut = useMutation({
    mutationFn: () => updateCard(id, { is_favorite: !card!.is_favorite }),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["card", id] }); qc.invalidateQueries({ queryKey: ["cards"] }); },
  });
  const delMut = useMutation({
    mutationFn: () => deleteCard(id),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["cards"] }); toast.success("Card deleted"); navigate({ to: "/cards" }); },
  });

  const cat = useMemo(() => card ? getCategory(card.category) : null, [card]);

  if (isLoading || !card || !cat) {
    return <div className="grid min-h-dvh place-items-center"><Loader2 className="h-6 w-6 animate-spin text-muted-foreground" /></div>;
  }

  const bg = card.color && card.color !== "#1a1a1a"
    ? `linear-gradient(135deg, ${card.color}, color-mix(in oklab, ${card.color} 60%, black))`
    : cat.gradient;

  return (
    <div className={`mx-auto min-h-dvh w-full max-w-[480px] px-5 pt-[max(env(safe-area-inset-top),1rem)] pb-[max(env(safe-area-inset-bottom),2rem)] ${bright ? "text-black" : ""}`}>
      <div className="flex items-center justify-between">
        <button onClick={() => navigate({ to: "/cards" })} className="grid h-10 w-10 place-items-center rounded-full glass">
          <ArrowLeft className="h-4 w-4" />
        </button>
        <div className="flex gap-2">
          <button onClick={() => favMut.mutate()} className="grid h-10 w-10 place-items-center rounded-full glass">
            <Star className={`h-4 w-4 ${card.is_favorite ? "fill-yellow-400 text-yellow-400" : ""}`} />
          </button>
          <button onClick={async () => {
            try { await navigator.share?.({ title: card.name, text: `${card.name}: ${card.barcode_value}` }); }
            catch {}
          }} className="grid h-10 w-10 place-items-center rounded-full glass">
            <Share2 className="h-4 w-4" />
          </button>
          <button onClick={() => { if (confirm("Delete this card?")) delMut.mutate(); }} className="grid h-10 w-10 place-items-center rounded-full glass">
            <Trash2 className="h-4 w-4 text-destructive" />
          </button>
        </div>
      </div>

      <div className="mt-6">
        <div className="relative overflow-hidden rounded-3xl p-6 text-white card-shadow" style={{ background: bg }}>
          <div className="absolute -right-8 -top-8 h-40 w-40 rounded-full bg-white/15 blur-2xl" />
          <div className="relative">
            <div className="flex items-center gap-2">
              <div className="grid h-9 w-9 place-items-center rounded-xl bg-white/15 backdrop-blur">
                <cat.icon className="h-4.5 w-4.5" />
              </div>
              <div className="text-[10px] uppercase tracking-[0.18em] opacity-80">{cat.label}</div>
            </div>
            <h2 className="mt-3 font-display text-2xl font-semibold tracking-tight">{card.name}</h2>
            {card.membership_number && (
              <div className="mt-1 font-mono text-sm tracking-widest opacity-90">{card.membership_number}</div>
            )}
          </div>
        </div>
      </div>

      <div className="mt-5">
        <BarcodeView value={card.barcode_value} format={card.barcode_format} height={120} />
        <div className="mt-3 text-center font-mono text-sm tracking-widest text-muted-foreground">{card.barcode_value}</div>
      </div>

      <div className="mt-5 grid grid-cols-2 gap-2">
        <button onClick={() => setBright((b) => !b)} className="flex items-center justify-center gap-2 rounded-2xl glass py-3 text-sm font-medium">
          <Sun className="h-4 w-4 text-[var(--violet)]" /> {bright ? "Normal" : "Brighten"}
        </button>
        <button onClick={() => setFull(true)} className="flex items-center justify-center gap-2 rounded-2xl glass py-3 text-sm font-medium">
          <Maximize className="h-4 w-4 text-[var(--violet)]" /> Fullscreen
        </button>
      </div>

      {card.notes && (
        <div className="mt-5 rounded-2xl glass p-4">
          <div className="text-[11px] uppercase tracking-[0.16em] text-muted-foreground">Notes</div>
          <p className="mt-1 text-sm">{card.notes}</p>
        </div>
      )}
      {card.expiry_date && (
        <div className="mt-3 rounded-2xl glass p-4">
          <div className="text-[11px] uppercase tracking-[0.16em] text-muted-foreground">Expires</div>
          <p className="mt-1 text-sm">{new Date(card.expiry_date).toLocaleDateString()}</p>
        </div>
      )}

      {full && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-white p-6" onClick={() => setFull(false)}>
          <div className="w-full max-w-md">
            <BarcodeView value={card.barcode_value} format={card.barcode_format} height={220} />
            <div className="mt-4 text-center text-sm font-mono tracking-widest text-black">{card.barcode_value}</div>
            <div className="mt-6 text-center text-xs text-neutral-500">Tap anywhere to close</div>
          </div>
        </div>
      )}
    </div>
  );
}
