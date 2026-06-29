import { Link, useRouterState } from "@tanstack/react-router";
import { Home, Wallet, Plus, Star, Settings } from "lucide-react";
import type { ReactNode } from "react";

type Tab = { to: string; label: string; icon: typeof Home; prominent?: boolean };
const tabs: Tab[] = [
  { to: "/dashboard", label: "Home", icon: Home },
  { to: "/cards", label: "Cards", icon: Wallet },
  { to: "/cards/new", label: "Add", icon: Plus, prominent: true },
  { to: "/favorites", label: "Saved", icon: Star },
  { to: "/settings", label: "Settings", icon: Settings },
];

const NAV_RESERVE = "calc(env(safe-area-inset-bottom) + 5.5rem)";

export function AppShell({ children, title }: { children: ReactNode; title?: string }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  return (
    <div className="relative mx-auto flex min-h-dvh w-full max-w-[480px] flex-col">
      {title && (
        <header className="sticky top-0 z-30 border-b border-hairline bg-background/85 px-5 pt-[max(env(safe-area-inset-top),0.875rem)] pb-3 backdrop-blur-xl">
          <h1 className="font-display text-[1.65rem] font-semibold leading-none tracking-tight">{title}</h1>
        </header>
      )}
      <main className="flex-1 px-5 pt-5" style={{ paddingBottom: NAV_RESERVE }}>
        {children}
        <p className="mt-12 mb-4 text-center text-[11px] tracking-wide text-muted-foreground">
          Built by{" "}
          <a href="https://architeq.co.za" target="_blank" rel="noreferrer"
            className="text-foreground underline-offset-4 hover:underline">Architeq Web Agency</a>
        </p>
      </main>

      <nav
        aria-label="Primary"
        className="fixed inset-x-0 bottom-0 z-40 mx-auto w-full max-w-[480px] px-3 pb-[max(env(safe-area-inset-bottom),0.5rem)] pt-2"
      >
        <div className="surface card-shadow flex items-center justify-between rounded-[26px] px-1.5 py-1.5">
          {tabs.map(({ to, label, icon: Icon, prominent }) => {
            const active = pathname === to || (to !== "/dashboard" && pathname.startsWith(to));
            return (
              <Link
                key={to}
                to={to as any}
                className="relative flex min-w-0 flex-1 items-center justify-center"
                aria-label={label}
              >
                {prominent ? (
                  <span className="grid h-12 w-12 -translate-y-2.5 place-items-center rounded-full bg-foreground text-background tap soft-shadow">
                    <Icon className="h-5 w-5" strokeWidth={2} />
                  </span>
                ) : (
                  <span
                    className={`flex flex-col items-center gap-0.5 px-2 py-1.5 text-[10px] font-medium tap ${
                      active ? "text-foreground" : "text-muted-foreground"
                    }`}
                  >
                    <Icon className="h-5 w-5" strokeWidth={1.75} />
                    <span className="leading-none tracking-wide">{label}</span>
                  </span>
                )}
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
