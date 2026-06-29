import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { ArrowLeft, Loader2, ScanLine, X } from "lucide-react";
import { z } from "zod";
import { createCard } from "@/lib/cards";
import { CATEGORIES, BARCODE_FORMATS, type BarcodeFormat } from "@/lib/categories";
import { BarcodeView } from "@/components/BarcodeView";

export const Route = createFileRoute("/_authenticated/cards/new")({
  head: () => ({ meta: [{ title: "Add Card — CardVault" }] }),
  component: AddCard,
});

const COLORS = ["#1a1a1a", "#2f5d49", "#1f4a63", "#732c1f", "#4a3766", "#73522a", "#2d3654", "#0a0a0a"];

function AddCard() {
  const navigate = useNavigate();
  const qc = useQueryClient();
  const [name, setName] = useState("");
  const [category, setCategory] = useState("retail");
  const [membership, setMembership] = useState("");
  const [barcode, setBarcode] = useState("");
  const [format, setFormat] = useState<BarcodeFormat>("CODE128");
  const [color, setColor] = useState(COLORS[0]);
  const [notes, setNotes] = useState("");
  const [expiry, setExpiry] = useState("");

  const mut = useMutation({
    mutationFn: createCard,
    onSuccess: (c) => {
      qc.invalidateQueries({ queryKey: ["cards"] });
      toast.success("Card added");
      navigate({ to: "/cards/$id", params: { id: c.id } });
    },
    onError: (e: any) => toast.error(e?.message ?? "Failed"),
  });

  function submit(e: React.FormEvent) {
    e.preventDefault();
    try {
      const schema = z.object({
        name: z.string().trim().min(1).max(80),
        barcode_value: z.string().trim().min(1).max(200),
      });
      schema.parse({ name, barcode_value: barcode });
    } catch (err: any) {
      toast.error(err?.errors?.[0]?.message ?? "Check required fields");
      return;
    }
    mut.mutate({
      name: name.trim(),
      category,
      membership_number: membership.trim() || null,
      barcode_value: barcode.trim(),
      barcode_format: format,
      color,
      notes: notes.trim() || null,
      expiry_date: expiry || null,
    });
  }

  return (
    <div className="mx-auto min-h-dvh w-full max-w-[480px] px-6 pt-[max(env(safe-area-inset-top),1.25rem)] pb-[max(env(safe-area-inset-bottom),2.5rem)]">
      <div className="flex items-center justify-between">
        <button onClick={() => navigate({ to: "/cards" })} className="grid h-10 w-10 place-items-center rounded-full surface tap">
          <ArrowLeft className="h-4 w-4" />
        </button>
        <span className="text-[11px] uppercase tracking-[0.22em] text-muted-foreground">New card</span>
        <div className="w-10" />
      </div>

      <h1 className="mt-8 font-display text-[2.25rem] font-semibold leading-none tracking-[-0.03em]">Add a card</h1>
      <p className="mt-2 text-[13px] text-muted-foreground">Scan or enter the details manually.</p>

      <Scanner onResult={(val, fmt) => { setBarcode(val); if (fmt) setFormat(fmt); toast.success("Barcode captured"); }} />

      <form onSubmit={submit} className="mt-7 grid gap-5">
        <Field label="Card name">
          <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Pick n Pay Smart Shopper" className="cv-input" required />
        </Field>

        <Field label="Category">
          <div className="grid grid-cols-4 gap-1.5">
            {CATEGORIES.map((c) => (
              <button
                key={c.value} type="button" onClick={() => setCategory(c.value)}
                className={`flex flex-col items-center gap-1 rounded-2xl px-1.5 py-2.5 text-[10px] font-medium tap ${
                  category === c.value ? "bg-foreground text-background" : "surface text-muted-foreground"
                }`}
              >
                <c.icon className="h-3.5 w-3.5" strokeWidth={1.75} /> {c.label}
              </button>
            ))}
          </div>
        </Field>

        <Field label="Membership number">
          <input value={membership} onChange={(e) => setMembership(e.target.value)} placeholder="Optional" className="cv-input" />
        </Field>

        <Field label="Barcode value">
          <input value={barcode} onChange={(e) => setBarcode(e.target.value)} placeholder="Enter or scan" className="cv-input font-mono" required />
        </Field>

        <Field label="Format">
          <div className="no-scrollbar flex gap-1.5 overflow-x-auto">
            {BARCODE_FORMATS.map((f) => (
              <button key={f} type="button" onClick={() => setFormat(f)}
                className={`shrink-0 rounded-full px-3.5 py-1.5 text-[11px] font-medium tap ${
                  format === f ? "bg-foreground text-background" : "surface text-muted-foreground"
                }`}>{f}</button>
            ))}
          </div>
        </Field>

        {barcode && (
          <div>
            <div className="mb-2 px-1 text-[10px] uppercase tracking-[0.22em] text-muted-foreground">Preview</div>
            <BarcodeView value={barcode} format={format} height={80} />
          </div>
        )}

        <Field label="Card color">
          <div className="flex flex-wrap gap-2">
            {COLORS.map((c) => (
              <button key={c} type="button" onClick={() => setColor(c)}
                aria-label={`Color ${c}`}
                className={`h-9 w-9 rounded-full ring-offset-2 ring-offset-background transition ${color === c ? "ring-2 ring-foreground" : ""}`}
                style={{ background: c }} />
            ))}
          </div>
        </Field>

        <div className="grid grid-cols-2 gap-3">
          <Field label="Expires">
            <input type="date" value={expiry} onChange={(e) => setExpiry(e.target.value)} className="cv-input" />
          </Field>
          <Field label="Notes">
            <input value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Optional" className="cv-input" />
          </Field>
        </div>

        <button type="submit" disabled={mut.isPending}
          className="mt-3 flex items-center justify-center gap-2 rounded-full bg-foreground px-5 py-4 text-[15px] font-medium text-background tap disabled:opacity-70">
          {mut.isPending && <Loader2 className="h-4 w-4 animate-spin" />}
          Save card
        </button>
      </form>

      <style>{`
        .cv-input { width:100%; padding:.95rem 1.125rem; border-radius:14px; background:var(--color-surface); border:1px solid var(--color-hairline); outline:none; font-size:.92rem; color:var(--color-foreground); }
        .cv-input::placeholder { color: var(--color-muted-foreground); }
        .cv-input:focus { border-color: var(--color-foreground); }
      `}</style>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="grid gap-2">
      <span className="px-1 text-[10px] uppercase tracking-[0.22em] text-muted-foreground">{label}</span>
      {children}
    </label>
  );
}

function Scanner({ onResult }: { onResult: (value: string, format?: BarcodeFormat) => void }) {
  const [open, setOpen] = useState(false);
  const [supported, setSupported] = useState<boolean | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    setSupported(typeof window !== "undefined" && "BarcodeDetector" in window);
  }, []);

  useEffect(() => {
    if (!open) return;
    let cancelled = false;
    (async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } });
        if (cancelled) { stream.getTracks().forEach(t => t.stop()); return; }
        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          await videoRef.current.play();
        }
        const Detector = (window as any).BarcodeDetector;
        if (!Detector) return;
        const detector = new Detector({ formats: ["code_128", "ean_13", "ean_8", "upc_a", "upc_e", "qr_code", "pdf417", "data_matrix"] });
        const tick = async () => {
          if (!videoRef.current || cancelled) return;
          try {
            const codes = await detector.detect(videoRef.current);
            if (codes.length > 0) {
              const code = codes[0];
              const map: Record<string, BarcodeFormat> = { code_128: "CODE128", ean_13: "EAN13", upc_a: "UPC", qr_code: "QR", pdf417: "PDF417", data_matrix: "DATAMATRIX" };
              onResult(code.rawValue, map[code.format as string]);
              navigator.vibrate?.(50);
              setOpen(false);
              return;
            }
          } catch {}
          rafRef.current = requestAnimationFrame(tick);
        };
        rafRef.current = requestAnimationFrame(tick);
      } catch {
        toast.error("Camera unavailable. Enter the barcode manually.");
        setOpen(false);
      }
    })();
    return () => {
      cancelled = true;
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      streamRef.current?.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    };
  }, [open, onResult]);

  return (
    <>
      <button type="button" onClick={() => setOpen(true)}
        className="mt-7 flex w-full items-center justify-between rounded-2xl surface px-5 py-4 text-left tap">
        <div>
          <div className="text-[14px] font-medium">Scan a barcode</div>
          <div className="text-[11px] text-muted-foreground">Use your camera</div>
        </div>
        <ScanLine className="h-5 w-5 text-muted-foreground" strokeWidth={1.5} />
      </button>

      {open && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/90 backdrop-blur-md p-4">
          <div className="relative w-full max-w-md overflow-hidden rounded-3xl bg-black">
            <video ref={videoRef} playsInline muted className="aspect-[3/4] w-full object-cover" />
            <div className="pointer-events-none absolute inset-8 rounded-2xl border border-white/70" />
            <button onClick={() => setOpen(false)} className="absolute right-3 top-3 grid h-9 w-9 place-items-center rounded-full bg-white/10 text-white backdrop-blur">
              <X className="h-4 w-4" />
            </button>
            <div className="absolute inset-x-0 bottom-4 text-center text-[11px] tracking-wide text-white/70">
              {supported === false ? "Live detection unsupported" : "Align the barcode in the frame"}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
