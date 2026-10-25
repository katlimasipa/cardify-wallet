import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { ArrowLeft, Camera, Loader2, ScanLine, Upload, X } from "lucide-react";
import { z } from "zod";
import { createCard } from "@/lib/cards";
import { CATEGORIES, BARCODE_FORMATS, getCategory, type BarcodeFormat } from "@/lib/categories";
import { BarcodeView } from "@/components/BarcodeView";
import { BrandLogo } from "@/components/BrandLogo";
import { compressImage } from "@/lib/image";
import { matchBrand, POPULAR_BRANDS } from "@/lib/brands";
import { BrowserMultiFormatReader } from "@zxing/browser";
import { BarcodeFormat as ZXFormat, DecodeHintType } from "@zxing/library";

export const Route = createFileRoute("/_authenticated/cards/new")({
  head: () => ({ meta: [{ title: "Add Card — CardVault" }] }),
  component: AddCard,
});

const COLORS = ["#514664", "#244c3d", "#28576a", "#704333", "#3b4b62", "#785a31", "#983b36", "#101a14"];

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
  const [frontImg, setFrontImg] = useState<string | null>(null);
  const [backImg, setBackImg] = useState<string | null>(null);
  const matchedBrand = matchBrand(name);

  function updateName(value: string) {
    setName(value);
    const brand = matchBrand(value);
    if (brand) {
      setCategory(brand.category);
    }
  }

  function selectBrand(brand: (typeof POPULAR_BRANDS)[number]) {
    setName(brand.name);
    setCategory(brand.category);
  }

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
      image_url: frontImg,
      back_image_url: backImg,
    });
  }

  return (
    <div className="mx-auto min-h-dvh w-full max-w-[480px] px-6 pt-[max(env(safe-area-inset-top),1.25rem)] pb-[max(env(safe-area-inset-bottom),2.5rem)]">
      <div className="flex items-center justify-between">
        <button onClick={() => navigate({ to: "/cards" })} aria-label="Back to cards" className="grid h-10 w-10 place-items-center rounded-full surface tap">
          <ArrowLeft className="h-4 w-4" />
        </button>
        <span className="text-[11px] uppercase tracking-[0.22em] text-muted-foreground">New card</span>
        <div className="w-10" />
      </div>

      <h1 className="mt-8 font-display text-[2.8rem] font-medium leading-[0.95] tracking-[-0.04em]">Add a card</h1>
      <p className="mt-2 text-[13px] text-muted-foreground">Scan, upload or enter manually.</p>

      <Scanner onResult={(val, fmt) => { setBarcode(val); if (fmt) setFormat(fmt); toast.success("Barcode captured"); }} />

      <form onSubmit={submit} className="mt-7 grid gap-5">
        <section aria-labelledby="popular-cards-label">
          <h2 id="popular-cards-label" className="field-label mb-2 px-1">Popular cards</h2>
          <div className="grid grid-cols-3 gap-2">
            {POPULAR_BRANDS.map((brand) => {
              const selected = matchedBrand?.name === brand.name;
              return (
                <button
                  key={brand.name}
                  type="button"
                  onClick={() => selectBrand(brand)}
                  aria-label={`Use ${brand.name}`}
                  aria-pressed={selected}
                  className={`flex min-h-[64px] min-w-0 items-center gap-2 rounded-xl px-2 text-left tap ${selected ? "border border-primary bg-primary/5" : "surface"}`}
                >
                  <BrandLogo domain={brand.domain} name={brand.short} className="h-8 w-8" />
                  <span className="min-w-0 truncate text-[11px] font-semibold">{brand.short}</span>
                </button>
              );
            })}
          </div>
        </section>

        <Field label="Card name">
          <input value={name} onChange={(e) => updateName(e.target.value)} placeholder="Pick n Pay Smart Shopper" className="cv-input" required />
        </Field>

        {matchedBrand && (
          <div className="-mt-3 flex items-center gap-3 rounded-xl surface px-3 py-2.5" aria-live="polite">
            <BrandLogo domain={matchedBrand.domain} name={matchedBrand.short} className="h-9 w-9" />
            <div className="min-w-0 flex-1">
              <div className="truncate text-[12px] font-medium">{matchedBrand.short} card design</div>
              <div className="mt-0.5 text-[10px] text-muted-foreground">{getCategory(matchedBrand.category).label} category and brand styling selected</div>
            </div>
            <span className="text-[10px] font-medium text-primary">Matched</span>
          </div>
        )}

        <Field label="Category">
          <div className="grid grid-cols-4 gap-1.5">
            {CATEGORIES.map((c) => (
              <button
                key={c.value} type="button" onClick={() => { setCategory(c.value); setColor(c.color); }}
                aria-pressed={category === c.value}
                className={`flex flex-col items-center gap-1 rounded-xl px-1.5 py-2.5 text-[10px] font-semibold tap ${
                  category === c.value ? "bg-primary text-primary-foreground" : "surface text-muted-foreground"
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
                className={`shrink-0 rounded-lg px-3.5 py-2 text-[11px] font-semibold tap ${
                  format === f ? "bg-primary text-primary-foreground" : "surface text-muted-foreground"
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

        <Field label="Card photos (optional)">
          <div className="grid grid-cols-2 gap-2.5">
            <ImagePicker label="Front" value={frontImg} onChange={setFrontImg} />
            <ImagePicker label="Back" value={backImg} onChange={setBackImg} />
          </div>
          <span className="mt-1.5 px-1 text-[11px] text-muted-foreground">Keep a digital copy of the actual card, just like in your wallet.</span>
        </Field>

        {!matchedBrand && (
          <Field label="Card color">
            <div className="flex flex-wrap gap-2">
              {COLORS.map((c) => (
                <button key={c} type="button" onClick={() => setColor(c)}
                  aria-label={`Color ${c}`}
                  aria-pressed={color === c}
                  className={`h-9 w-9 rounded-full ring-offset-2 ring-offset-background transition ${color === c ? "ring-2 ring-primary" : ""}`}
                  style={{ background: c }} />
              ))}
            </div>
          </Field>
        )}

        <div className="grid grid-cols-2 gap-3">
          <Field label="Expires">
            <input type="date" value={expiry} onChange={(e) => setExpiry(e.target.value)} className="cv-input" />
          </Field>
          <Field label="Notes">
            <input value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Optional" className="cv-input" />
          </Field>
        </div>

        <button type="submit" disabled={mut.isPending}
          className="mt-3 flex items-center justify-center gap-2 rounded-full bg-primary px-6 py-4 text-[15px] font-semibold text-primary-foreground tap disabled:opacity-70">
          {mut.isPending && <Loader2 className="h-4 w-4 animate-spin" />}
          Save card
        </button>
      </form>

    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="grid gap-2">
      <span className="field-label px-1">{label}</span>
      {children}
    </label>
  );
}

function ImagePicker({ label, value, onChange }: { label: string; value: string | null; onChange: (v: string | null) => void }) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [busy, setBusy] = useState(false);

  async function handle(file: File) {
    setBusy(true);
    try {
      const url = await compressImage(file);
      onChange(url);
    } catch {
      toast.error("Could not read image");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="relative">
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        capture="environment"
        className="hidden"
        onChange={(e) => { const f = e.target.files?.[0]; if (f) handle(f); e.target.value = ""; }}
      />
      {value ? (
        <div className="group relative aspect-[1.586/1] overflow-hidden rounded-xl border border-hairline">
          <img src={value} alt={label} className="h-full w-full object-cover" />
          <button
            type="button"
            onClick={() => onChange(null)}
            className="absolute right-1.5 top-1.5 grid h-8 w-8 place-items-center rounded-lg bg-black/60 text-white"
            aria-label={`Remove ${label}`}
          >
            <X className="h-3.5 w-3.5" />
          </button>
          <div className="absolute bottom-1.5 left-2 text-[10px] uppercase tracking-[0.22em] text-white/85">{label}</div>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="flex aspect-[1.586/1] w-full flex-col items-center justify-center gap-1.5 rounded-xl surface text-muted-foreground tap"
        >
          {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" strokeWidth={1.75} />}
          <span className="text-[11px] font-medium">{label}</span>
        </button>
      )}
    </div>
  );
}

function Scanner({ onResult }: { onResult: (value: string, format?: BarcodeFormat) => void }) {
  const [open, setOpen] = useState(false);
  const [status, setStatus] = useState("Align the barcode in the frame");
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const rafRef = useRef<number | null>(null);
  const zxingRef = useRef<BrowserMultiFormatReader | null>(null);

  useEffect(() => {
    if (!open) return;
    let cancelled = false;
    let stopZxing: (() => void) | null = null;

    const zxMap: Record<string, BarcodeFormat> = {
      CODE_128: "CODE128", EAN_13: "EAN13", EAN_8: "EAN13",
      UPC_A: "UPC", UPC_E: "UPC", QR_CODE: "QR",
      PDF_417: "PDF417", DATA_MATRIX: "DATAMATRIX",
    };
    const nativeMap: Record<string, BarcodeFormat> = {
      code_128: "CODE128", ean_13: "EAN13", ean_8: "EAN13",
      upc_a: "UPC", upc_e: "UPC", qr_code: "QR",
      pdf417: "PDF417", data_matrix: "DATAMATRIX",
    };

    (async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: { ideal: "environment" }, width: { ideal: 1280 }, height: { ideal: 720 } },
        });
        if (cancelled) { stream.getTracks().forEach((t) => t.stop()); return; }
        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.setAttribute("playsinline", "true");
          await videoRef.current.play();
        }

        const finish = (value: string, fmt?: BarcodeFormat) => {
          if (cancelled) return;
          navigator.vibrate?.(50);
          onResult(value, fmt);
          setOpen(false);
        };

        // Prefer native BarcodeDetector when available (Chrome/Android)
        const Detector = (window as any).BarcodeDetector;
        if (Detector) {
          setStatus("Point at the barcode");
          const detector = new Detector({
            formats: ["code_128", "ean_13", "ean_8", "upc_a", "upc_e", "qr_code", "pdf417", "data_matrix"],
          });
          const tick = async () => {
            if (!videoRef.current || cancelled) return;
            try {
              const codes = await detector.detect(videoRef.current);
              if (codes && codes.length > 0) {
                finish(codes[0].rawValue, nativeMap[codes[0].format as string]);
                return;
              }
            } catch {}
            rafRef.current = requestAnimationFrame(tick);
          };
          rafRef.current = requestAnimationFrame(tick);
          return;
        }

        // Fallback: ZXing (iOS Safari, Firefox)
        setStatus("Scanning…");
        const hints = new Map();
        hints.set(DecodeHintType.POSSIBLE_FORMATS, [
          ZXFormat.CODE_128, ZXFormat.EAN_13, ZXFormat.EAN_8,
          ZXFormat.UPC_A, ZXFormat.UPC_E, ZXFormat.QR_CODE,
          ZXFormat.PDF_417, ZXFormat.DATA_MATRIX, ZXFormat.CODE_39, ZXFormat.ITF,
        ]);
        const reader = new BrowserMultiFormatReader(hints, { delayBetweenScanAttempts: 120 });
        zxingRef.current = reader;
        const controls = await reader.decodeFromStream(stream, videoRef.current!, (result) => {
          if (!result || cancelled) return;
          const fmtName = ZXFormat[result.getBarcodeFormat()] as string;
          finish(result.getText(), zxMap[fmtName]);
        });
        stopZxing = () => controls.stop();
      } catch {
        toast.error("Camera unavailable. Enter the barcode manually.");
        setOpen(false);
      }
    })();

    return () => {
      cancelled = true;
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      stopZxing?.();
      streamRef.current?.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
      zxingRef.current = null;
    };
  }, [open, onResult]);

  return (
    <>
      <button type="button" onClick={() => setOpen(true)}
        className="mt-7 flex w-full items-center justify-between rounded-xl surface px-5 py-4 text-left tap">
        <div className="flex items-center gap-3">
          <span className="grid h-10 w-10 place-items-center rounded-lg bg-primary text-primary-foreground">
            <ScanLine className="h-4 w-4" strokeWidth={1.75} />
          </span>
          <div>
            <div className="text-[14px] font-medium">Scan a barcode</div>
            <div className="text-[11px] text-muted-foreground">Live camera detection</div>
          </div>
        </div>
        <Camera className="h-4 w-4 text-muted-foreground" strokeWidth={1.5} />
      </button>

      {open && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/95 p-4">
          <div className="relative w-full max-w-md overflow-hidden rounded-3xl bg-black">
            <video ref={videoRef} playsInline muted className="aspect-[3/4] w-full object-cover" />
            <div className="pointer-events-none absolute inset-0">
              <div className="absolute inset-x-8 top-1/2 h-40 -translate-y-1/2 rounded-2xl border border-white/70 shadow-[0_0_0_9999px_rgba(0,0,0,0.35)]" />
              <div className="scanline absolute left-8 right-8 top-1/2 -mt-20 h-40 overflow-hidden rounded-2xl">
                <div className="absolute inset-x-0 h-[2px] animate-scanline bg-white/90" />
              </div>
            </div>
            <button onClick={() => setOpen(false)} aria-label="Close scanner" className="absolute right-3 top-3 grid h-10 w-10 place-items-center rounded-xl bg-white/10 text-white backdrop-blur">
              <X className="h-4 w-4" />
            </button>
            <div className="absolute inset-x-0 bottom-4 text-center text-[11px] tracking-wide text-white/75">
              {status}
            </div>
          </div>
          <style>{`
            @keyframes scanline { 0% { transform: translateY(0); } 100% { transform: translateY(160px); } }
            .animate-scanline { animation: scanline 1.6s ease-in-out infinite alternate; }
          `}</style>
        </div>
      )}
    </>
  );
}
