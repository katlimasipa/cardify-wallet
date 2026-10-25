import { createFileRoute, useNavigate, useParams } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ArrowLeft, Star, Trash2, Sun, Maximize2, Share2, Loader2, X } from "lucide-react";
import { toast } from "sonner";
import { bumpOpen, deleteCard, getCard, updateCard } from "@/lib/cards";
import { BarcodeView } from "@/components/BarcodeView";
import { BrandLogo } from "@/components/BrandLogo";
import { BrandCardArtwork } from "@/components/BrandCardArtwork";
import { getCategory } from "@/lib/categories";
import { matchBrand } from "@/lib/brands";
import { getCardFace } from "@/lib/card-face";

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

  const brand = useMemo(() => card ? matchBrand(card.name) : null, [card]);
  const cat = useMemo(() => card ? getCategory(brand?.category ?? card.category) : null, [card, brand]);

  if (isLoading || !card || !cat) {
    return <div className="grid min-h-dvh place-items-center"><Loader2 className="h-5 w-5 animate-spin text-muted-foreground" /></div>;
  }

  const face = getCardFace(card);

  return (
    <div className={`mx-auto min-h-dvh w-full max-w-[480px] px-6 pt-[max(env(safe-area-inset-top),1.25rem)] pb-[max(env(safe-area-inset-bottom),2.5rem)] ${bright ? "text-black" : ""}`}>
      <div className="flex items-center justify-between">
        <button onClick={() => navigate({ to: "/cards" })} aria-label="Back to cards" className="grid h-10 w-10 place-items-center rounded-full surface tap">
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
        <div className="membership-card relative aspect-[1.586/1] min-h-[210px] overflow-hidden rounded-[22px] p-6 text-card-face-foreground card-shadow" style={{ backgroundColor: face.background, "--card-face-foreground": card.image_url ? "#ffffff" : face.foreground } as React.CSSProperties}>
          {card.image_url ? (
            <>
              <img src={card.image_url} alt="" className="absolute inset-0 h-full w-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-b from-black/45 via-black/5 to-black/70" />
            </>
          ) : <BrandCardArtwork face={face.design} />}
          <div className="relative z-10 flex items-start gap-3">
            {!card.image_url && <BrandLogo domain={brand?.domain ?? null} name={brand?.short ?? card.name} className="h-11 w-11" />}
            <div className="min-w-0 flex-1 pt-0.5">
              <div className="text-[10px] font-semibold uppercase tracking-[0.16em] text-card-face-foreground/70">{cat.label}</div>
              <h2 className="mt-2 break-words font-display text-[1.8rem] font-medium leading-tight tracking-tight">{card.name}</h2>
              {card.membership_number && (
                <div className="mt-2 break-all font-mono text-[13px] tracking-[0.12em] text-card-face-foreground/85">{card.membership_number}</div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6">
        <BarcodeView value={card.barcode_value} format={card.barcode_format} height={120} />
        <div className="mt-3 text-center font-mono text-[12px] tracking-[0.22em] text-muted-foreground">{card.barcode_value}</div>
      </div>

      {card.back_image_url && (
        <div className="mt-6">
          <div className="mb-2 px-1 text-[10px] uppercase tracking-[0.22em] text-muted-foreground">Back of card</div>
          <figure className="overflow-hidden rounded-2xl border border-hairline bg-black/5">
            <img src={card.back_image_url} alt={`${card.name} back`} className="aspect-[1.586/1] w-full object-cover" />
          </figure>
        </div>
      )}

      <div className="mt-5 grid grid-cols-2 gap-2">
        <button onClick={() => setBright((b) => !b)} className="flex items-center justify-center gap-2 rounded-full surface py-3 text-[13px] font-semibold tap">
          <Sun className="h-4 w-4" strokeWidth={1.75} /> {bright ? "Normal" : "Brighten"}
        </button>
        <button onClick={() => setFull(true)} className="flex items-center justify-center gap-2 rounded-full bg-primary py-3 text-[13px] font-semibold text-primary-foreground tap">
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
        <div className="fixed inset-0 z-50 grid place-items-center bg-background p-6" onClick={() => setFull(false)}>
          <button onClick={() => setFull(false)} aria-label="Close fullscreen barcode" className="absolute right-5 top-5 grid h-10 w-10 place-items-center rounded-xl surface text-foreground">
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
  return <button onClick={onClick} className="grid h-10 w-10 place-items-center rounded-xl surface tap">{children}</button>;
}
function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start gap-4 border-b border-hairline px-4 py-3.5 last:border-0">
      <dt className="w-20 shrink-0 text-[10px] uppercase tracking-[0.22em] text-muted-foreground">{label}</dt>
      <dd className="flex-1">{value}</dd>
    </div>
  );
}
