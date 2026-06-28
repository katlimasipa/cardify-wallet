import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { ArrowLeft, Download, Upload, FileText } from "lucide-react";
import { toast } from "sonner";
import { useRef } from "react";
import { createCard, listCards } from "@/lib/cards";
import { AppShell } from "@/components/AppShell";

export const Route = createFileRoute("/_authenticated/backup")({
  head: () => ({ meta: [{ title: "Backup — CardVault" }] }),
  component: Backup,
});

function Backup() {
  const navigate = useNavigate();
  const qc = useQueryClient();
  const fileRef = useRef<HTMLInputElement>(null);
  const { data: cards = [] } = useQuery({ queryKey: ["cards"], queryFn: listCards });

  function exportJson() {
    const out = {
      app: "CardVault",
      exported_at: new Date().toISOString(),
      cards: cards.map(({ id, user_id, created_at, updated_at, ...rest }) => rest),
    };
    const blob = new Blob([JSON.stringify(out, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `cardvault-${new Date().toISOString().slice(0,10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Backup downloaded");
  }

  async function importJson(file: File) {
    try {
      const text = await file.text();
      const data = JSON.parse(text);
      const items = Array.isArray(data) ? data : data.cards;
      if (!Array.isArray(items)) throw new Error("Invalid file");
      let n = 0;
      for (const c of items) {
        if (!c?.name || !c?.barcode_value) continue;
        await createCard({
          name: String(c.name),
          category: c.category ?? "other",
          membership_number: c.membership_number ?? null,
          barcode_value: String(c.barcode_value),
          barcode_format: c.barcode_format ?? "CODE128",
          notes: c.notes ?? null,
          expiry_date: c.expiry_date ?? null,
          color: c.color ?? null,
          is_favorite: Boolean(c.is_favorite),
        });
        n++;
      }
      qc.invalidateQueries({ queryKey: ["cards"] });
      toast.success(`Imported ${n} card${n === 1 ? "" : "s"}`);
    } catch (e: any) {
      toast.error(e?.message ?? "Import failed");
    }
  }

  return (
    <AppShell>
      <button onClick={() => navigate({ to: "/settings" })} className="mb-3 inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-4 w-4" /> Settings
      </button>
      <h1 className="font-display text-3xl font-semibold tracking-tight">Backup & Restore</h1>
      <p className="mt-1 text-sm text-muted-foreground">Export a JSON snapshot of your vault or import one.</p>

      <div className="mt-6 grid gap-3">
        <button onClick={exportJson} className="flex items-center gap-3 rounded-3xl glass p-4 text-left">
          <div className="grid h-11 w-11 place-items-center rounded-2xl aurora-bg text-white"><Download className="h-5 w-5" /></div>
          <div>
            <div className="font-semibold">Export to JSON</div>
            <div className="text-xs text-muted-foreground">{cards.length} card{cards.length === 1 ? "" : "s"} in your vault</div>
          </div>
        </button>

        <button onClick={() => fileRef.current?.click()} className="flex items-center gap-3 rounded-3xl glass p-4 text-left">
          <div className="grid h-11 w-11 place-items-center rounded-2xl aurora-bg text-white"><Upload className="h-5 w-5" /></div>
          <div>
            <div className="font-semibold">Import from JSON</div>
            <div className="text-xs text-muted-foreground">Restore from a previous backup</div>
          </div>
          <input ref={fileRef} type="file" accept="application/json" className="hidden"
            onChange={(e) => { const f = e.target.files?.[0]; if (f) importJson(f); e.target.value = ""; }} />
        </button>

        <div className="flex items-center gap-3 rounded-3xl glass p-4 text-left opacity-70">
          <div className="grid h-11 w-11 place-items-center rounded-2xl bg-muted text-muted-foreground"><FileText className="h-5 w-5" /></div>
          <div>
            <div className="font-semibold">Printable PDF</div>
            <div className="text-xs text-muted-foreground">Coming soon</div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
