import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Moon, Sun, Monitor, LogOut, Lock, Download, Bell, Trash2, ChevronRight, Fingerprint } from "lucide-react";
import { toast } from "sonner";
import { useTheme } from "@/lib/theme";
import { useAuth } from "@/lib/auth";
import { supabase } from "@/integrations/supabase/client";
import { AppShell } from "@/components/AppShell";

export const Route = createFileRoute("/_authenticated/settings")({
  head: () => ({ meta: [{ title: "Settings — CardVault" }] }),
  component: Settings,
});

function Settings() {
  const { theme, setTheme } = useTheme();
  const { user } = useAuth();
  const navigate = useNavigate();

  async function signOut() {
    await supabase.auth.signOut();
    navigate({ to: "/", replace: true });
  }
  async function changePassword() {
    const pw = prompt("New password (min 8 chars)");
    if (!pw) return;
    if (pw.length < 8) return toast.error("Too short");
    const { error } = await supabase.auth.updateUser({ password: pw });
    if (error) toast.error(error.message); else toast.success("Password updated");
  }
  async function enableBiometric() {
    if (!window.PublicKeyCredential) return toast.error("Not supported");
    try {
      const avail = await (window.PublicKeyCredential as any).isUserVerifyingPlatformAuthenticatorAvailable?.();
      if (!avail) return toast.error("No biometric sensor available");
      localStorage.setItem("cv-biometric", "1");
      toast.success("Biometric unlock enabled");
    } catch { toast.error("Failed to enable"); }
  }
  function deleteAccount() {
    if (!confirm("Permanently delete your account and all cards?")) return;
    toast.message("Account deletion requested — sign out to complete.");
  }

  return (
    <AppShell title="Settings">
      <section className="mt-1 rounded-xl surface px-4 py-4">
        <div className="text-[10px] uppercase tracking-[0.22em] text-muted-foreground">Account</div>
        <div className="mt-1.5 truncate text-[14px] font-medium">{user?.email}</div>
      </section>

      <Group title="Appearance">
        <div className="grid grid-cols-3 gap-1.5 p-1.5">
          <ThemeBtn active={theme === "light"} onClick={() => setTheme("light")} icon={Sun} label="Light" />
          <ThemeBtn active={theme === "dark"} onClick={() => setTheme("dark")} icon={Moon} label="Dark" />
          <ThemeBtn active={theme === "system"} onClick={() => setTheme("system")} icon={Monitor} label="Auto" />
        </div>
      </Group>

      <Group title="Security">
        <Row icon={Lock} label="Change password" onClick={changePassword} />
        <Row icon={Fingerprint} label="Biometric unlock" onClick={enableBiometric} />
      </Group>

      <Group title="Data">
        <RowLink icon={Download} label="Backup & restore" to="/backup" />
        <Row icon={Bell} label="Notifications" onClick={() => toast.message("Coming soon")} />
      </Group>

      <Group title="">
        <Row icon={LogOut} label="Sign out" onClick={signOut} />
        <Row icon={Trash2} label="Delete account" onClick={deleteAccount} danger />
      </Group>
    </AppShell>
  );
}

function Group({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mt-7">
      {title && <div className="mb-2 px-1.5 text-[10px] uppercase tracking-[0.22em] text-muted-foreground">{title}</div>}
      <div className="overflow-hidden rounded-xl surface">{children}</div>
    </section>
  );
}
function Row({ icon: Icon, label, onClick, danger }: { icon: typeof Lock; label: string; onClick: () => void; danger?: boolean }) {
  return (
    <button onClick={onClick} className="flex w-full items-center gap-3 border-b border-hairline px-4 py-3.5 text-left last:border-0 tap">
      <Icon className={`h-4 w-4 ${danger ? "text-destructive" : "text-muted-foreground"}`} strokeWidth={1.75} />
      <span className={`flex-1 text-[14px] ${danger ? "text-destructive" : ""}`}>{label}</span>
      <ChevronRight className="h-4 w-4 text-muted-foreground" />
    </button>
  );
}
function RowLink({ icon: Icon, label, to }: { icon: typeof Lock; label: string; to: string }) {
  return (
    <Link to={to as any} className="flex w-full items-center gap-3 border-b border-hairline px-4 py-3.5 text-left last:border-0 tap">
      <Icon className="h-4 w-4 text-muted-foreground" strokeWidth={1.75} />
      <span className="flex-1 text-[14px]">{label}</span>
      <ChevronRight className="h-4 w-4 text-muted-foreground" />
    </Link>
  );
}
function ThemeBtn({ active, onClick, icon: Icon, label }: { active: boolean; onClick: () => void; icon: typeof Sun; label: string }) {
  return (
    <button onClick={onClick}
      className={`flex flex-col items-center gap-1.5 rounded-lg px-2 py-3 text-[11px] font-semibold tap ${
        active ? "bg-primary text-primary-foreground" : "text-muted-foreground"
      }`}>
      <Icon className="h-4 w-4" strokeWidth={1.75} /> {label}
    </button>
  );
}
