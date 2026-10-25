import { Link, useRouterState } from "@tanstack/react-router";
import { Home, Wallet, Plus, Star, UserRound } from "lucide-react";
import type { ReactNode } from "react";
import { BrandLockup } from "@/components/BrandLockup";

type Tab = { to: string; label: string; icon: typeof Home; prominent?: boolean };
const tabs: Tab[] = [
  { to: "/dashboard", label: "Home", icon: Home },
  { to: "/cards", label: "Cards", icon: Wallet },
  { to: "/cards/new", label: "Add", icon: Plus, prominent: true },
  { to: "/favorites", label: "Saved", icon: Star },
];

const NAV_RESERVE = "calc(env(safe-area-inset-bottom) + 5.5rem)";

export function AppShell({ children, title }: { children: ReactNode; title?: string }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  return (
    <div className="relative mx-auto flex min-h-dvh w-full max-w-[520px] flex-col">
      <header className="sticky top-0 z-30 flex min-h-[4.6rem] items-center justify-between border-b border-hairline bg-background px-5 pt-[max(env(safe-area-inset-top),0.875rem)] pb-3">
        {title ? (
          <h1 className="font-display text-[1.65rem] font-medium leading-none">{title}</h1>
        ) : (
          <BrandLockup />
        )}
        <Link
          to="/settings"
          aria-label="Account settings"
          className="grid h-10 w-10 place-items-center rounded-xl surface text-foreground tap"
        >
          <UserRound className="h-[18px] w-[18px]" strokeWidth={1.8} />
        </Link>
      </header>
      <main className="flex-1 px-5 pt-5" style={{ paddingBottom: NAV_RESERVE }}>
        {children}
        <p className="mt-14 mb-6 text-center text-[10px] text-muted-foreground">
          Built by{" "}
          <a href="https://architeq.co.za" target="_blank" rel="noreferrer"
            className="text-foreground underline-offset-4 hover:underline">Architeq Web Agency</a>
        </p>
      </main>

      <nav
        aria-label="Primary"
        className="fixed inset-x-0 bottom-0 z-40 mx-auto w-full max-w-[520px] px-0"
      >
        <div className="nav-surface flex items-center justify-between px-3 pt-2 pb-[max(env(safe-area-inset-bottom),0.65rem)]">
          {tabs.map(({ to, label, icon: Icon, prominent }) => {
            const active = pathname === to || (to === "/cards" && pathname.startsWith("/cards/") && pathname !== "/cards/new");
            return (
              <Link
                key={to}
                to={to as any}
                className="relative flex min-w-0 flex-1 items-center justify-center"
                aria-label={label}
              >
                {prominent ? (
                  <span className="grid h-11 w-12 -translate-y-1.5 place-items-center rounded-xl bg-primary text-primary-foreground tap soft-shadow">
                    <Icon className="h-5 w-5" strokeWidth={2} />
                  </span>
                ) : (
                  <span
                    className={`flex flex-col items-center gap-0.5 px-2 py-1.5 text-[10px] font-semibold tap ${
                      active ? "text-primary" : "text-muted-foreground"
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
