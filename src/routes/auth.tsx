import { createFileRoute, Link, useNavigate, useSearch } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { z } from "zod";
import { toast } from "sonner";
import { ArrowLeft, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import { BrandLockup } from "@/components/BrandLockup";

const searchSchema = z.object({
  mode: z.enum(["signin", "signup"]).default("signin").catch("signin"),
});

export const Route = createFileRoute("/auth")({
  validateSearch: searchSchema,
  head: () => ({ meta: [
    { title: "Sign in — CardVault" },
    { name: "description", content: "Sign in to access your CardVault wallet." },
    { property: "og:title", content: "Sign in — CardVault" },
    { property: "og:description", content: "Sign in to access your CardVault wallet." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary" },
  ] }),
  component: AuthPage,
});

function AuthPage() {
  const { mode } = useSearch({ from: "/auth" });
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const isSignup = mode === "signup";

  useEffect(() => {
    if (!authLoading && user) navigate({ to: "/dashboard", replace: true });
  }, [authLoading, user, navigate]);

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
        });
        if (error) throw error;
        toast.success("Welcome");
        navigate({ to: "/dashboard", replace: true });
      } else {
        const { error } = await supabase.auth.signInWithPassword(parsed);
        if (error) throw error;
        navigate({ to: "/dashboard", replace: true });
      }
    } catch (err: any) {
      toast.error(err?.message ?? "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto flex min-h-dvh w-full max-w-[480px] flex-col px-7 pt-[max(env(safe-area-inset-top),1.25rem)] pb-[max(env(safe-area-inset-bottom),1.5rem)]">
      <Link to="/" className="inline-flex w-fit items-center gap-1.5 text-[13px] text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-4 w-4" /> Back
      </Link>

      <div className="mt-10"><BrandLockup /></div>

      <div className="mt-8">
        <p className="text-[11px] uppercase tracking-[0.3em] text-muted-foreground">
          {isSignup ? "New vault" : "Welcome back"}
        </p>
        <h1 className="mt-3 font-display text-[2.5rem] font-semibold leading-[1] tracking-[-0.03em]">
          {isSignup ? "Create your account" : "Sign in"}
        </h1>
      </div>

      <form onSubmit={onSubmit} className="mt-10 grid gap-5">
        <Field label="Email">
          <input
            type="email" autoComplete="email" required
            value={email} onChange={(e) => setEmail(e.target.value)}
            className="cv-input"
            placeholder="you@example.com"
          />
        </Field>
        <Field label="Password">
          <input
            type="password" required
            autoComplete={isSignup ? "new-password" : "current-password"}
            value={password} onChange={(e) => setPassword(e.target.value)}
            className="cv-input"
            placeholder="At least 8 characters"
            minLength={8}
          />
        </Field>

        <button
          type="submit" disabled={loading}
          className="mt-3 flex items-center justify-center gap-2 rounded-xl bg-primary px-5 py-4 text-[15px] font-semibold text-primary-foreground tap disabled:opacity-60"
        >
          {loading && <Loader2 className="h-4 w-4 animate-spin" />}
          {isSignup ? "Create account" : "Sign in"}
        </button>
      </form>

      <div className="mt-auto pt-10 text-center text-[13px] text-muted-foreground">
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
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="grid gap-2">
      <span className="field-label px-1">{label}</span>
      {children}
    </label>
  );
}
