import { createFileRoute, Link, redirect } from "@tanstack/react-router";
import { ArrowRight, Wallet, Shield, ScanLine } from "lucide-react";
import { BrandFooter } from "@/components/BrandFooter";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "CardVault — Loyalty Card Wallet" },
      { name: "description", content: "All your loyalty cards in one beautiful, secure wallet." },
    ],
  }),
  beforeLoad: async () => {
    if (typeof window === "undefined") return;
    const { data } = await supabase.auth.getSession();
    if (data.session) throw redirect({ to: "/dashboard" });
  },
  component: Welcome,
});

function Welcome() {
  return (
    <div className="mx-auto flex min-h-dvh w-full max-w-[480px] flex-col px-6 pt-[max(env(safe-area-inset-top),2rem)] pb-[max(env(safe-area-inset-bottom),1rem)]">
      <div className="flex flex-1 flex-col items-center justify-center text-center">
        <div className="relative mb-8">
          <div className="absolute inset-0 -z-10 blur-3xl opacity-60 aurora-bg rounded-full" />
          <div className="relative h-44 w-32">
            <div className="absolute left-1/2 top-2 h-40 w-28 -translate-x-1/2 rotate-[-8deg] rounded-2xl aurora-bg card-shadow" />
            <div className="absolute left-1/2 top-0 h-40 w-28 -translate-x-1/2 rotate-[4deg] rounded-2xl bg-gradient-to-br from-fuchsia-500 to-rose-500 card-shadow" />
            <div className="absolute left-1/2 top-3 h-40 w-28 -translate-x-1/2 rounded-2xl bg-gradient-to-br from-indigo-600 to-violet-700 card-shadow ring-1 ring-white/20" />
          </div>
        </div>

        <h1 className="font-display text-5xl font-bold leading-[1.05] tracking-tight text-balance">
          Your cards.<br />One <span className="bg-clip-text text-transparent aurora-bg" style={{ WebkitBackgroundClip: "text" }}>vault</span>.
        </h1>
        <p className="mt-4 max-w-xs text-[15px] leading-relaxed text-muted-foreground">
          Carry every loyalty, rewards and membership card in a wallet that feels native.
        </p>

        <div className="mt-10 grid w-full gap-2 text-left">
          <Feature icon={Wallet} title="Unlimited cards" body="Grocery, pharmacy, fuel, retail — all in one place." />
          <Feature icon={ScanLine} title="Instant scanning" body="Large, bright barcodes ready at checkout." />
          <Feature icon={Shield} title="Encrypted & synced" body="Secure cloud sync with offline access." />
        </div>
      </div>

      <div className="mt-8 grid gap-3">
        <Link
          to="/auth"
          search={{ mode: "signup" }}
          className="group flex items-center justify-center gap-2 rounded-2xl aurora-bg px-6 py-4 text-base font-semibold text-white card-shadow transition-transform active:scale-[0.98]"
        >
          Create your vault <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
        </Link>
        <Link
          to="/auth"
          search={{ mode: "signin" }}
          className="rounded-2xl glass px-6 py-4 text-center text-sm font-medium"
        >
          I already have an account
        </Link>
      </div>
      <BrandFooter />
    </div>
  );
}

function Feature({ icon: Icon, title, body }: { icon: typeof Wallet; title: string; body: string }) {
  return (
    <div className="flex items-start gap-3 rounded-2xl glass p-3.5">
      <div className="grid h-9 w-9 shrink-0 place-items-center rounded-xl aurora-bg text-white">
        <Icon className="h-4.5 w-4.5" />
      </div>
      <div className="min-w-0">
        <div className="text-sm font-semibold">{title}</div>
        <div className="text-xs text-muted-foreground">{body}</div>
      </div>
    </div>
  );
}
