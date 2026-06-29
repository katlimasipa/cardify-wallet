import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { ArrowLeft, Download, Upload } from "lucide-react";
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
    a.href = url; a.download = `cardvault-${new Date().toISOString().slice(0,10)}.json`; a.click();
    URL.revokeObjectURL(url);
    toast.success("Backup downloaded");
  }
  async function importJson(file: File) {
    try {
      const data = JSON.parse(await file.text());
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
    } catch (e: any) { toast.error(e?.message ?? "Import failed"); }
  }

  return (
    <AppShell>
      <button onClick={() => navigate({ to: "/settings" })} className="mb-5 inline-flex items-center gap-1.5 text-[13px] text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-4 w-4" /> Settings
      </button>
      <h1 className="font-display text-[2.25rem] font-semibold leading-none tracking-[-0.03em]">Backup</h1>
      <p className="mt-2 text-[13px] text-muted-foreground">Export a snapshot of your vault, or restore from one.</p>

      <div className="mt-7 grid gap-2">
        <button onClick={exportJson} className="flex items-center justify-between rounded-2xl surface px-5 py-4 text-left tap">
          <div>
            <div className="text-[14px] font-medium">Export to JSON</div>
            <div className="text-[11px] text-muted-foreground">{cards.length} card{cards.length === 1 ? "" : "s"} in your vault</div>
          </div>
          <Download className="h-4 w-4 text-muted-foreground" strokeWidth={1.75} />
        </button>

        <button onClick={() => fileRef.current?.click()} className="flex items-center justify-between rounded-2xl surface px-5 py-4 text-left tap">
          <div>
            <div className="text-[14px] font-medium">Import from JSON</div>
            <div className="text-[11px] text-muted-foreground">Restore from a previous backup</div>
          </div>
          <Upload className="h-4 w-4 text-muted-foreground" strokeWidth={1.75} />
          <input ref={fileRef} type="file" accept="application/json" className="hidden"
            onChange={(e) => { const f = e.target.files?.[0]; if (f) importJson(f); e.target.value = ""; }} />
        </button>
      </div>
    </AppShell>
  );
}
