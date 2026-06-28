import { Link, useRouterState } from "@tanstack/react-router";
import { Home, Wallet, Plus, Star, Settings } from "lucide-react";
import type { ReactNode } from "react";
import { BrandFooter } from "./BrandFooter";

type Tab = { to: string; label: string; icon: typeof Home; prominent?: boolean };
const tabs: Tab[] = [
  { to: "/dashboard", label: "Home", icon: Home },
  { to: "/cards", label: "Cards", icon: Wallet },
  { to: "/cards/new", label: "Add", icon: Plus, prominent: true },
  { to: "/favorites", label: "Favorites", icon: Star },
  { to: "/settings", label: "Settings", icon: Settings },
];

export function AppShell({ children, title }: { children: ReactNode; title?: string }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  return (
    <div className="relative mx-auto flex min-h-dvh w-full max-w-[480px] flex-col">
      {title && (
        <header className="sticky top-0 z-30 glass px-5 pt-[max(env(safe-area-inset-top),0.75rem)] pb-3">
          <h1 className="font-display text-2xl font-semibold tracking-tight">{title}</h1>
        </header>
      )}
      <main className="flex-1 px-4 pb-[calc(env(safe-area-inset-bottom)+6.5rem)] pt-4">
        {children}
      </main>
      <BrandFooter />
      <nav
        aria-label="Primary"
        className="fixed inset-x-0 bottom-0 z-40 mx-auto w-full max-w-[480px] px-3 pb-[max(env(safe-area-inset-bottom),0.5rem)] pt-2"
      >
        <div className="glass card-shadow flex items-center justify-around rounded-3xl px-2 py-1.5">
          {tabs.map(({ to, label, icon: Icon, prominent }) => {
            const active = pathname === to || (to !== "/dashboard" && pathname.startsWith(to));
            return (
              <Link
                key={to}
                to={to as any}
                className="group relative flex min-w-0 flex-1 items-center justify-center"
                aria-label={label}
              >
                {prominent ? (
                  <span className="grid h-12 w-12 -translate-y-3 place-items-center rounded-2xl aurora-bg text-white shadow-[0_10px_30px_-10px_color-mix(in_oklab,var(--violet)_60%,transparent)] transition-transform group-active:scale-95">
                    <Icon className="h-6 w-6" />
                  </span>
                ) : (
                  <span
                    className={`flex flex-col items-center gap-0.5 px-2 py-1.5 text-[10px] font-medium transition-colors ${
                      active ? "text-foreground" : "text-muted-foreground"
                    }`}
                  >
                    <Icon className={`h-5 w-5 ${active ? "text-[var(--violet)]" : ""}`} />
                    <span className="leading-none">{label}</span>
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
