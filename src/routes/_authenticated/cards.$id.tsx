import { createFileRoute, useNavigate, useParams } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ArrowLeft, Star, Trash2, Sun, Maximize2, Share2, Loader2, X } from "lucide-react";
import { toast } from "sonner";
import { bumpOpen, deleteCard, getCard, updateCard } from "@/lib/cards";
import { BarcodeView } from "@/components/BarcodeView";
import { BrandLogo } from "@/components/BrandLogo";
import { getCategory } from "@/lib/categories";
import { matchBrand } from "@/lib/brands";

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
    document.body.style.background = "#ffffff";
    return () => { document.body.style.background = prev; };
  }, [bright]);

  const favMut = useMutation({
    mutationFn: () => updateCard(id, { is_favorite: !card!.is_favorite }),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["card", id] }); qc.invalidateQueries({ queryKey: ["cards"] }); },
  });
  const delMut = useMutation({
    mutationFn: () => deleteCard(id),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["cards"] }); toast.success("Deleted"); navigate({ to: "/cards" }); },
  });

  const cat = useMemo(() => card ? getCategory(card.category) : null, [card]);

  if (isLoading || !card || !cat) {
    return <div className="grid min-h-dvh place-items-center"><Loader2 className="h-5 w-5 animate-spin text-muted-foreground" /></div>;
  }

  const bg = card.color && card.color !== "#1a1a1a"
    ? `linear-gradient(155deg, ${card.color}, color-mix(in oklab, ${card.color} 55%, #000))`
    : cat.gradient;

  return (
    <div className={`mx-auto min-h-dvh w-full max-w-[480px] px-6 pt-[max(env(safe-area-inset-top),1.25rem)] pb-[max(env(safe-area-inset-bottom),2.5rem)] ${bright ? "text-black" : ""}`}>
      <div className="flex items-center justify-between">
        <button onClick={() => navigate({ to: "/cards" })} className="grid h-10 w-10 place-items-center rounded-full surface tap">
          <ArrowLeft className="h-4 w-4" />
        </button>
        <div className="flex gap-2">
          <IconButton onClick={() => favMut.mutate()}>
            <Star className={`h-4 w-4 ${card.is_favorite ? "fill-accent text-accent" : ""}`} strokeWidth={1.75} />
          </IconButton>
          <IconButton onClick={async () => { try { await navigator.share?.({ title: card.name, text: `${card.name}: ${card.barcode_value}` }); } catch {} }}>
            <Share2 className="h-4 w-4" strokeWidth={1.75} />
          </IconButton>
          <IconButton onClick={() => { if (confirm("Delete this card?")) delMut.mutate(); }}>
            <Trash2 className="h-4 w-4 text-destructive" strokeWidth={1.75} />
          </IconButton>
        </div>
      </div>

      <div className="mt-7">
        <div className="relative overflow-hidden rounded-[26px] p-6 text-white card-shadow" style={{ background: bg }}>
          <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-white/15" />
          <div className="pointer-events-none absolute -right-12 -top-12 h-44 w-44 rounded-full bg-white/[0.07] blur-2xl" />
          <div className="relative">
            <div className="text-[10px] uppercase tracking-[0.28em] text-white/55">{cat.label}</div>
            <h2 className="mt-3 font-display text-[1.6rem] font-semibold leading-tight tracking-tight">{card.name}</h2>
            {card.membership_number && (
              <div className="mt-2 font-mono text-[13px] tracking-[0.22em] text-white/85">{card.membership_number}</div>
            )}
          </div>
        </div>
      </div>

      <div className="mt-6">
        <BarcodeView value={card.barcode_value} format={card.barcode_format} height={120} />
        <div className="mt-3 text-center font-mono text-[12px] tracking-[0.22em] text-muted-foreground">{card.barcode_value}</div>
      </div>

      {(card.image_url || card.back_image_url) && (
        <div className="mt-6">
          <div className="mb-2 px-1 text-[10px] uppercase tracking-[0.22em] text-muted-foreground">Physical card</div>
          <div className={`grid gap-2.5 ${card.image_url && card.back_image_url ? "grid-cols-2" : "grid-cols-1"}`}>
            {card.image_url && (
              <figure className="overflow-hidden rounded-2xl border border-hairline bg-black/5">
                <img src={card.image_url} alt={`${card.name} front`} className="aspect-[1.586/1] w-full object-cover" />
                <figcaption className="px-3 py-2 text-[10px] uppercase tracking-[0.22em] text-muted-foreground">Front</figcaption>
              </figure>
            )}
            {card.back_image_url && (
              <figure className="overflow-hidden rounded-2xl border border-hairline bg-black/5">
                <img src={card.back_image_url} alt={`${card.name} back`} className="aspect-[1.586/1] w-full object-cover" />
                <figcaption className="px-3 py-2 text-[10px] uppercase tracking-[0.22em] text-muted-foreground">Back</figcaption>
              </figure>
            )}
          </div>
        </div>
      )}

      <div className="mt-5 grid grid-cols-2 gap-2">
        <button onClick={() => setBright((b) => !b)} className="flex items-center justify-center gap-2 rounded-full surface py-3 text-[13px] font-medium tap">
          <Sun className="h-4 w-4" strokeWidth={1.75} /> {bright ? "Normal" : "Brighten"}
        </button>
        <button onClick={() => setFull(true)} className="flex items-center justify-center gap-2 rounded-full surface py-3 text-[13px] font-medium tap">
          <Maximize2 className="h-4 w-4" strokeWidth={1.75} /> Fullscreen
        </button>
      </div>

      {(card.notes || card.expiry_date) && (
        <dl className="mt-6 overflow-hidden rounded-2xl surface text-[13px]">
          {card.notes && <Row label="Notes" value={card.notes} />}
          {card.expiry_date && <Row label="Expires" value={new Date(card.expiry_date).toLocaleDateString()} />}
        </dl>
      )}

      {full && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-white p-6" onClick={() => setFull(false)}>
          <button onClick={() => setFull(false)} className="absolute right-5 top-5 grid h-10 w-10 place-items-center rounded-full bg-black/5 text-black">
            <X className="h-4 w-4" />
          </button>
          <div className="w-full max-w-md">
            <BarcodeView value={card.barcode_value} format={card.barcode_format} height={220} />
            <div className="mt-5 text-center font-mono text-[13px] tracking-[0.22em] text-black">{card.barcode_value}</div>
            <div className="mt-8 text-center text-[11px] uppercase tracking-[0.22em] text-neutral-400">Tap to close</div>
          </div>
        </div>
      )}
    </div>
  );
}

function IconButton({ onClick, children }: { onClick: () => void; children: React.ReactNode }) {
  return <button onClick={onClick} className="grid h-10 w-10 place-items-center rounded-full surface tap">{children}</button>;
}
function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start gap-4 border-b border-hairline px-4 py-3.5 last:border-0">
      <dt className="w-20 shrink-0 text-[10px] uppercase tracking-[0.22em] text-muted-foreground">{label}</dt>
      <dd className="flex-1">{value}</dd>
    </div>
  );
}
