import { Link, useRouterState } from "@tanstack/react-router";
import { Home, Wallet, Plus, Star, UserRound } from "lucide-react";
import type { ReactNode } from "react";
import { BrandLockup } from "@/components/BrandLockup";

type Tab = { to: string; label: string; icon: typeof Home; prominent?: boolean };
const tabs: Tab[] = [
  { to: "/dashboard", label: "Home", icon: Home },
  { to: "/cards", label: "Cards", icon: Wallet },
  { to: "/cards/new", label: "Add card", icon: Plus, prominent: true },
  { to: "/favorites", label: "Saved", icon: Star },
];

const NAV_RESERVE = "calc(env(safe-area-inset-bottom) + 5.25rem)";

export function AppShell({ children, title }: { children: ReactNode; title?: string }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const isActive = (to: string) => pathname === to || (to === "/cards" && pathname.startsWith("/cards/") && pathname !== "/cards/new");

  return (
    <div className="relative mx-auto flex min-h-dvh w-full max-w-[1240px] flex-col">
      <header className="sticky top-0 z-30 border-b border-hairline bg-background/90 px-5 pt-[max(env(safe-area-inset-top),0.5rem)] backdrop-blur-xl">
        <div className="mx-auto flex min-h-[3.8rem] max-w-[1120px] items-center justify-between gap-4 pb-2">
          <div className="flex min-w-0 items-center gap-3">
            {title ? (
              <h1 className="truncate font-sans text-[1.05rem] font-semibold tracking-[-0.025em] md:text-[1.15rem]">{title}</h1>
            ) : (
              <BrandLockup compact />
            )}
          </div>

          <nav aria-label="Primary" className="hidden items-center gap-1 md:flex">
            {tabs.map(({ to, label, prominent }) => {
              const active = isActive(to);
              return (
                <Link
                  key={to}
                  to={to as any}
                  aria-current={active ? "page" : undefined}
                  className={prominent
                    ? "ml-2 inline-flex items-center gap-2 rounded-full bg-primary px-4 py-2 text-[13px] font-semibold text-primary-foreground transition hover:opacity-90"
                    : `rounded-full px-4 py-2 text-[13px] font-medium transition ${active ? "bg-surface-2 text-foreground" : "text-muted-foreground hover:text-foreground"}`}
                >
                  {prominent && <Plus className="h-4 w-4" strokeWidth={2} />}
                  {label}
                </Link>
              );
            })}
          </nav>

          <Link
            to="/settings"
            aria-label="Profile and settings"
            className="flex h-10 shrink-0 items-center justify-center gap-2 rounded-full bg-surface-2 px-3 text-foreground transition hover:bg-secondary"
          >
            <UserRound className="h-[17px] w-[17px]" strokeWidth={1.8} />
            <span className="hidden text-[12px] font-medium sm:inline">Profile</span>
          </Link>
        </div>
      </header>

      <main className="mx-auto w-full max-w-[1120px] flex-1 px-5 pt-7 md:px-8 md:pt-10" style={{ paddingBottom: NAV_RESERVE }}>
        {children}
        <p className="mt-16 mb-5 text-center text-[10px] text-muted-foreground">
          Built by{" "}
          <a href="https://architeq.co.za" target="_blank" rel="noreferrer" className="text-foreground underline-offset-4 hover:underline">
            Architeq Web Agency
          </a>
        </p>
      </main>

      <nav aria-label="Primary" className="fixed inset-x-0 bottom-0 z-40 mx-auto w-full max-w-[520px] px-3 md:hidden">
        <div className="nav-surface mb-[max(env(safe-area-inset-bottom),0.5rem)] flex items-center justify-between rounded-full border border-hairline px-2 py-1.5 shadow-[0_8px_30px_-18px_rgba(0,0,0,.35)]">
          {tabs.map(({ to, label, icon: Icon, prominent }) => {
            const active = isActive(to);
            return (
              <Link key={to} to={to as any} aria-label={label} aria-current={active ? "page" : undefined}
                className={`flex min-h-11 min-w-0 flex-1 items-center justify-center rounded-full transition ${prominent ? "bg-primary text-primary-foreground" : active ? "text-primary" : "text-muted-foreground"}`}>
                {prominent ? <Icon className="h-5 w-5" strokeWidth={2} /> : (
                  <span className="flex flex-col items-center gap-0.5 px-2 py-1 text-[9px] font-medium">
                    <Icon className="h-[17px] w-[17px]" strokeWidth={1.8} />
                    <span>{label}</span>
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
