import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { useAuth } from "@/lib/auth";
import { BrandLockup } from "@/components/BrandLockup";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "CardVault — Loyalty Card Wallet" },
      { name: "description", content: "A premium wallet for every loyalty and rewards card you carry." },
      { property: "og:title", content: "CardVault — Loyalty Card Wallet" },
      { property: "og:description", content: "A premium wallet for every loyalty and rewards card you carry." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
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
    <div className="welcome-grain mx-auto flex min-h-dvh w-full max-w-[480px] flex-col px-6 pt-[max(env(safe-area-inset-top),2rem)] pb-[max(env(safe-area-inset-bottom),1.5rem)] sm:px-8">
      <BrandLockup />

      <div className="mt-auto pt-20">
        <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">Your everyday cards, refined</p>
        <h1 className="mt-5 max-w-[9ch] font-display text-[3.4rem] font-semibold leading-[0.92]">
          Carry less.<br />Keep more.
        </h1>
        <p className="mt-6 max-w-[21rem] text-[15px] leading-7 text-muted-foreground">
          Your loyalty cards, ready at the till. No plastic. No searching.
        </p>

        <div className="mt-9 grid gap-2.5">
          <Link
            to="/auth"
            search={{ mode: "signup" }}
          className="rounded-xl bg-primary px-6 py-4 text-center text-[15px] font-semibold text-primary-foreground tap"
          >
            Create your vault
          </Link>
          <Link
            to="/auth"
            search={{ mode: "signin" }}
          className="rounded-xl surface px-6 py-4 text-center text-[15px] font-semibold tap"
          >
            Sign in
          </Link>
        </div>
      </div>

      <p className="mt-8 text-center text-[10px] text-muted-foreground">
        Built by{" "}
        <a href="https://architeq.co.za" target="_blank" rel="noreferrer"
          className="text-foreground underline-offset-4 hover:underline">Architeq Web Agency</a>
      </p>
    </div>
  );
}
