import { createFileRoute, Link, useNavigate, useSearch } from "@tanstack/react-router";
import { useState } from "react";
import { z } from "zod";
import { toast } from "sonner";
import { ArrowLeft, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable/index";
import { BrandFooter } from "@/components/BrandFooter";

const searchSchema = z.object({
  mode: z.enum(["signin", "signup"]).default("signin").catch("signin"),
});

export const Route = createFileRoute("/auth")({
  validateSearch: searchSchema,
  head: () => ({ meta: [{ title: "Sign in — CardVault" }] }),
  component: AuthPage,
});

function AuthPage() {
  const { mode } = useSearch({ from: "/auth" });
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  const isSignup = mode === "signup";

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const schema = z.object({
        email: z.string().trim().email("Enter a valid email").max(255),
        password: z.string().min(8, "Password must be at least 8 characters").max(72),
      });
      const parsed = schema.parse({ email, password });

      if (isSignup) {
        const { error } = await supabase.auth.signUp({
          email: parsed.email,
          password: parsed.password,
          options: { emailRedirectTo: window.location.origin + "/dashboard" },
        });
        if (error) throw error;
        toast.success("Welcome to CardVault!");
        navigate({ to: "/dashboard" });
      } else {
        const { error } = await supabase.auth.signInWithPassword(parsed);
        if (error) throw error;
        toast.success("Welcome back");
        navigate({ to: "/dashboard" });
      }
    } catch (err: any) {
      toast.error(err?.message ?? "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  async function onGoogle() {
    setGoogleLoading(true);
    try {
      const result = await lovable.auth.signInWithOAuth("google", {
        redirect_uri: window.location.origin,
      });
      if (result.error) {
        toast.error(result.error.message || "Google sign-in failed");
        setGoogleLoading(false);
        return;
      }
      if (result.redirected) return;
      navigate({ to: "/dashboard" });
    } catch (err: any) {
      toast.error(err?.message ?? "Google sign-in failed");
      setGoogleLoading(false);
    }
  }

  return (
    <div className="mx-auto flex min-h-dvh w-full max-w-[480px] flex-col px-6 pt-[max(env(safe-area-inset-top),1rem)] pb-[max(env(safe-area-inset-bottom),1rem)]">
      <Link to="/" className="mb-6 inline-flex w-fit items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-4 w-4" /> Back
      </Link>

      <div className="flex-1">
        <h1 className="font-display text-3xl font-semibold tracking-tight">
          {isSignup ? "Create your vault" : "Welcome back"}
        </h1>
        <p className="mt-1.5 text-sm text-muted-foreground">
          {isSignup ? "Start carrying every card in one place." : "Sign in to access your cards."}
        </p>

        <button
          type="button"
          onClick={onGoogle}
          disabled={googleLoading}
          className="mt-7 flex w-full items-center justify-center gap-3 rounded-2xl glass px-5 py-3.5 text-sm font-medium transition active:scale-[0.99] disabled:opacity-60"
        >
          {googleLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <GoogleMark />}
          Continue with Google
        </button>

        <div className="my-6 flex items-center gap-3 text-xs text-muted-foreground">
          <div className="h-px flex-1 bg-border" /> or use email <div className="h-px flex-1 bg-border" />
        </div>

        <form onSubmit={onSubmit} className="grid gap-3">
          <Field label="Email">
            <input
              type="email" autoComplete="email" required
              value={email} onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-2xl glass px-4 py-3.5 text-sm outline-none focus:ring-2 focus:ring-[var(--violet)]"
              placeholder="you@example.com"
            />
          </Field>
          <Field label="Password">
            <input
              type="password" required
              autoComplete={isSignup ? "new-password" : "current-password"}
              value={password} onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-2xl glass px-4 py-3.5 text-sm outline-none focus:ring-2 focus:ring-[var(--violet)]"
              placeholder="••••••••"
              minLength={8}
            />
          </Field>

          <button
            type="submit" disabled={loading}
            className="mt-3 flex items-center justify-center gap-2 rounded-2xl aurora-bg px-5 py-3.5 text-sm font-semibold text-white card-shadow active:scale-[0.99] disabled:opacity-70"
          >
            {loading && <Loader2 className="h-4 w-4 animate-spin" />}
            {isSignup ? "Create account" : "Sign in"}
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-muted-foreground">
          {isSignup ? "Already have an account? " : "New here? "}
          <Link
            to="/auth"
            search={{ mode: isSignup ? "signin" : "signup" }}
            className="font-medium text-foreground underline-offset-4 hover:underline"
          >
            {isSignup ? "Sign in" : "Create one"}
          </Link>
        </div>
      </div>
      <BrandFooter />
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="grid gap-1.5">
      <span className="px-1 text-[11px] uppercase tracking-[0.16em] text-muted-foreground">{label}</span>
      {children}
    </label>
  );
}

function GoogleMark() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true">
      <path fill="#EA4335" d="M12 11v3.6h5.1c-.2 1.3-1.6 3.9-5.1 3.9-3.1 0-5.6-2.6-5.6-5.7s2.5-5.7 5.6-5.7c1.8 0 2.9.7 3.6 1.4l2.4-2.3C16.5 4.8 14.5 4 12 4 6.9 4 2.8 8.1 2.8 13.2S6.9 22.4 12 22.4c6.9 0 9.5-4.8 9.5-7.4 0-.5-.1-.9-.2-1.3H12z" />
    </svg>
  );
}
