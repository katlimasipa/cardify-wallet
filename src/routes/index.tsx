import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { useAuth } from "@/lib/auth";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "CardVault — Loyalty Card Wallet" },
      { name: "description", content: "A premium wallet for every loyalty and rewards card you carry." },
    ],
  }),
  component: Welcome,
});

function Welcome() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && user) navigate({ to: "/dashboard", replace: true });
  }, [loading, user, navigate]);

  return (
    <div className="mx-auto flex min-h-dvh w-full max-w-[480px] flex-col px-7 pt-[max(env(safe-area-inset-top),3rem)] pb-[max(env(safe-area-inset-bottom),1.5rem)]">
      <div className="flex items-center gap-2.5">
        <Wordmark />
      </div>

      <div className="mt-auto">
        <p className="text-[11px] uppercase tracking-[0.3em] text-muted-foreground">A loyalty wallet</p>
        <h1 className="mt-5 font-display text-[3.25rem] font-semibold leading-[0.95] tracking-[-0.03em]">
          Every card<br />you carry,<br />
          <span className="italic text-accent">quietly kept.</span>
        </h1>
        <p className="mt-6 max-w-[18rem] text-[15px] leading-relaxed text-muted-foreground">
          Store, scan and access your loyalty cards in one place — no plastic, no clutter.
        </p>

        <div className="mt-10 grid gap-2.5">
          <Link
            to="/auth"
            search={{ mode: "signup" }}
            className="rounded-full bg-foreground px-6 py-4 text-center text-[15px] font-medium text-background tap"
          >
            Create your vault
          </Link>
          <Link
            to="/auth"
            search={{ mode: "signin" }}
            className="rounded-full hairline px-6 py-4 text-center text-[15px] font-medium tap"
          >
            Sign in
          </Link>
        </div>
      </div>

      <p className="mt-10 text-center text-[11px] tracking-wide text-muted-foreground">
        Built by{" "}
        <a href="https://architeq.co.za" target="_blank" rel="noreferrer"
          className="text-foreground underline-offset-4 hover:underline">Architeq Web Agency</a>
      </p>
    </div>
  );
}

function Wordmark() {
  return (
    <div className="flex items-center gap-2">
      <div className="grid h-7 w-7 place-items-center rounded-[9px] bg-foreground text-background">
        <span className="font-display text-[13px] font-bold leading-none">C</span>
      </div>
      <span className="font-display text-[15px] font-semibold tracking-tight">CardVault</span>
    </div>
  );
}
