import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { ArrowLeft, Loader2, Camera, ScanLine } from "lucide-react";
import { z } from "zod";
import { createCard } from "@/lib/cards";
import { CATEGORIES, BARCODE_FORMATS, type BarcodeFormat } from "@/lib/categories";
import { BarcodeView } from "@/components/BarcodeView";

export const Route = createFileRoute("/_authenticated/cards/new")({
  head: () => ({ meta: [{ title: "Add Card — CardVault" }] }),
  component: AddCard,
});

const COLORS = ["#7c3aed", "#16a34a", "#dc2626", "#f59e0b", "#0ea5e9", "#ec4899", "#0f172a", "#475569"];

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
    <div className="mx-auto min-h-dvh w-full max-w-[480px] px-5 pt-[max(env(safe-area-inset-top),1rem)] pb-[max(env(safe-area-inset-bottom),2rem)]">
      <button onClick={() => navigate({ to: "/cards" })} className="mb-4 inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-4 w-4" /> Back
      </button>

      <h1 className="font-display text-3xl font-semibold tracking-tight">Add a card</h1>
      <p className="mt-1 text-sm text-muted-foreground">Scan a barcode or enter the details manually.</p>

      <Scanner onResult={(val, fmt) => { setBarcode(val); if (fmt) setFormat(fmt); toast.success("Barcode captured"); }} />

      <form onSubmit={submit} className="mt-6 grid gap-4">
        <Field label="Card name">
          <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Pick n Pay Smart Shopper" className="input" required />
        </Field>

        <Field label="Category">
          <div className="grid grid-cols-4 gap-2">
            {CATEGORIES.map((c) => (
              <button
                key={c.value} type="button" onClick={() => setCategory(c.value)}
                className={`flex flex-col items-center gap-1 rounded-2xl px-2 py-2.5 text-[10px] font-medium transition ${
                  category === c.value ? "aurora-bg text-white card-shadow" : "glass text-muted-foreground"
                }`}
              >
                <c.icon className="h-4 w-4" /> {c.label}
              </button>
            ))}
          </div>
        </Field>

        <Field label="Membership number">
          <input value={membership} onChange={(e) => setMembership(e.target.value)} placeholder="Optional" className="input" />
        </Field>

        <Field label="Barcode value">
          <input value={barcode} onChange={(e) => setBarcode(e.target.value)} placeholder="Enter or scan" className="input font-mono" required />
        </Field>

        <Field label="Barcode format">
          <div className="no-scrollbar flex gap-2 overflow-x-auto">
            {BARCODE_FORMATS.map((f) => (
              <button key={f} type="button" onClick={() => setFormat(f)}
                className={`shrink-0 rounded-full px-3.5 py-1.5 text-xs font-medium transition ${
                  format === f ? "aurora-bg text-white" : "glass text-muted-foreground"
                }`}>{f}</button>
            ))}
          </div>
        </Field>

        {barcode && (
          <div>
            <div className="mb-2 text-[11px] uppercase tracking-[0.16em] text-muted-foreground">Preview</div>
            <BarcodeView value={barcode} format={format} height={80} />
          </div>
        )}

        <Field label="Color">
          <div className="flex gap-2">
            {COLORS.map((c) => (
              <button key={c} type="button" onClick={() => setColor(c)}
                aria-label={`Color ${c}`}
                className={`h-9 w-9 rounded-full ring-offset-2 ring-offset-background transition ${color === c ? "ring-2 ring-[var(--violet)]" : ""}`}
                style={{ background: c }} />
            ))}
          </div>
        </Field>

        <div className="grid grid-cols-2 gap-3">
          <Field label="Expiry (optional)">
            <input type="date" value={expiry} onChange={(e) => setExpiry(e.target.value)} className="input" />
          </Field>
          <Field label="Notes">
            <input value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Optional" className="input" />
          </Field>
        </div>

        <button type="submit" disabled={mut.isPending}
          className="mt-2 flex items-center justify-center gap-2 rounded-2xl aurora-bg px-5 py-4 text-sm font-semibold text-white card-shadow active:scale-[0.99] disabled:opacity-70">
          {mut.isPending && <Loader2 className="h-4 w-4 animate-spin" />}
          Save card
        </button>
      </form>

      <style>{`.input { width:100%; padding:.85rem 1rem; border-radius:1rem; background:var(--glass); border:1px solid var(--glass-border); backdrop-filter: blur(24px) saturate(160%); outline:none; font-size:.875rem; }
      .input:focus { box-shadow: 0 0 0 2px var(--violet); }`}</style>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="grid gap-1.5">
      <span className="px-1 text-[11px] uppercase tracking-[0.16em] text-muted-foreground">{label}</span>
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
        // @ts-ignore
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
              close();
              return;
            }
          } catch {}
          rafRef.current = requestAnimationFrame(tick);
        };
        rafRef.current = requestAnimationFrame(tick);
      } catch (e: any) {
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

  function close() { setOpen(false); }

  return (
    <>
      <div className="mt-5 grid grid-cols-2 gap-2">
        <button type="button" onClick={() => setOpen(true)}
          className="flex items-center justify-center gap-2 rounded-2xl glass px-4 py-3.5 text-sm font-medium active:scale-[0.99]">
          <ScanLine className="h-4 w-4 text-[var(--violet)]" /> Scan barcode
        </button>
        <label className="flex cursor-pointer items-center justify-center gap-2 rounded-2xl glass px-4 py-3.5 text-sm font-medium active:scale-[0.99]">
          <Camera className="h-4 w-4 text-[var(--violet)]" /> Photo of card
          <input type="file" accept="image/*" className="hidden" onChange={(e) => {
            const f = e.target.files?.[0]; if (!f) return;
            toast.message("Photo attached. Enter the barcode below to make it scannable.");
          }} />
        </label>
      </div>

      {open && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/80 backdrop-blur-md p-4">
          <div className="relative w-full max-w-md overflow-hidden rounded-3xl bg-black">
            <video ref={videoRef} playsInline muted className="aspect-[3/4] w-full object-cover" />
            <div className="pointer-events-none absolute inset-8 rounded-2xl border-2 border-white/70" />
            <button onClick={close} className="absolute right-3 top-3 rounded-full bg-white/15 px-3 py-1.5 text-xs font-medium text-white backdrop-blur">Close</button>
            <div className="absolute inset-x-0 bottom-3 text-center text-xs text-white/70">
              {supported === false ? "Live detection unsupported on this browser" : "Align barcode inside the frame"}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
