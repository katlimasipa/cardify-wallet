import { createFileRoute, Link, useNavigate, useSearch } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { z } from "zod";
import { toast } from "sonner";
import { ArrowLeft, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import { BrandLockup } from "@/components/BrandLockup";

const searchSchema = z.object({
  mode: z.enum(["signin", "signup", "forgot", "reset"]).default("signin").catch("signin"),
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
  const [recoverySent, setRecoverySent] = useState(false);

  const isSignup = mode === "signup";
  const isForgotPassword = mode === "forgot";
  const isReset = mode === "reset";

  useEffect(() => {
    if (!authLoading && user && !isReset && !isForgotPassword) navigate({ to: "/dashboard", replace: true });
  }, [authLoading, user, isReset, isForgotPassword, navigate]);

  if (authLoading || (user && !isReset && !isForgotPassword)) {
    return (
      <div className="grid min-h-dvh place-items-center bg-background" aria-label="Opening your wallet">
        <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (isReset && !authLoading && !user) {
    return (
      <div className="mx-auto flex min-h-dvh w-full max-w-[480px] flex-col px-7 pt-[max(env(safe-area-inset-top),1.25rem)] pb-[max(env(safe-area-inset-bottom),1.5rem)]">
        <Link to="/auth" search={{ mode: "signin" }} className="inline-flex w-fit items-center gap-1.5 rounded-full text-[13px] text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-4 w-4" /> Back to sign in
        </Link>
        <div className="mt-10"><BrandLockup /></div>
        <div className="mt-8">
          <p className="text-[11px] uppercase tracking-[0.3em] text-muted-foreground">Password reset</p>
          <h1 className="mt-3 font-display text-[2rem] font-semibold leading-tight tracking-[-0.03em]">This reset link has expired</h1>
          <p className="mt-3 text-[14px] leading-6 text-muted-foreground">Request a new password reset email and open its link on this device.</p>
          <Link to="/auth" search={{ mode: "forgot" }} className="mt-6 inline-flex rounded-full bg-primary px-5 py-3 text-[13px] font-semibold text-primary-foreground tap">
            Request a new link
          </Link>
        </div>
      </div>
    );
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const passwordSchema = z.string().min(8, "Password must be at least 8 characters").max(72);

      if (isReset) {
        const parsedPassword = passwordSchema.parse(password);
        const { error } = await supabase.auth.updateUser({ password: parsedPassword });
        if (error) throw error;
        toast.success("Password updated");
        navigate({ to: "/dashboard", replace: true });
        return;
      }

      const parsedEmail = z.string().trim().email("Enter a valid email").max(255).parse(email);

      if (isForgotPassword) {
        const redirectTo = new URL("/auth?mode=reset", window.location.origin).toString();
        const { error } = await supabase.auth.resetPasswordForEmail(parsedEmail, { redirectTo });
        if (error) throw error;
        setRecoverySent(true);
        toast.success("If that account exists, a reset link is on its way.");
        return;
      }

      const parsedPassword = passwordSchema.parse(password);

      if (isSignup) {
        const { error } = await supabase.auth.signUp({
          email: parsedEmail,
          password: parsedPassword,
        });
        if (error) throw error;
        toast.success("Welcome");
        navigate({ to: "/dashboard", replace: true });
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email: parsedEmail, password: parsedPassword });
        if (error) throw error;
        navigate({ to: "/dashboard", replace: true });
      }
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto flex min-h-dvh w-full max-w-[480px] flex-col px-7 pt-[max(env(safe-area-inset-top),1.25rem)] pb-[max(env(safe-area-inset-bottom),1.5rem)]">
      <Link to="/" className="inline-flex w-fit items-center gap-1.5 rounded-full text-[13px] text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-4 w-4" /> Back
      </Link>

      <div className="mt-10"><BrandLockup /></div>

      <div className="mt-8">
        <p className="text-[11px] uppercase tracking-[0.3em] text-muted-foreground">
          {isReset ? "Password reset" : isForgotPassword ? "Account recovery" : isSignup ? "New vault" : "Welcome back"}
        </p>
        <h1 className="mt-3 font-display text-[2.5rem] font-semibold leading-[1] tracking-[-0.03em]">
          {isReset ? "Choose a new password" : isForgotPassword ? "Reset your password" : isSignup ? "Create your account" : "Sign in"}
        </h1>
      </div>

      <form onSubmit={onSubmit} className="mt-10 grid gap-5">
        {!isReset && (
          <Field label="Email">
            <input
              type="email" autoComplete="email" required
              value={email} onChange={(e) => { setEmail(e.target.value); setRecoverySent(false); }}
              className="cv-input"
              placeholder="you@example.com"
            />
          </Field>
        )}
        {!isForgotPassword && (
          <Field label={isReset ? "New password" : "Password"}>
            <input
              type="password" required
              autoComplete={isSignup || isReset ? "new-password" : "current-password"}
              value={password} onChange={(e) => setPassword(e.target.value)}
              className="cv-input"
              placeholder="At least 8 characters"
              minLength={8}
            />
          </Field>
        )}

        {isForgotPassword && recoverySent && (
          <p role="status" className="rounded-xl bg-primary/5 px-4 py-3 text-[13px] leading-6 text-muted-foreground">
            If an account uses this email, you’ll receive a reset link. Open it on this device to choose a new password. Your cards stay attached to your account.
          </p>
        )}

        <button
          type="submit" disabled={loading}
          className="mt-3 flex items-center justify-center gap-2 rounded-full bg-primary px-6 py-4 text-[15px] font-semibold text-primary-foreground tap disabled:opacity-60"
        >
          {loading && <Loader2 className="h-4 w-4 animate-spin" />}
          {isReset ? "Update password" : isForgotPassword ? recoverySent ? "Send another link" : "Send reset link" : isSignup ? "Create account" : "Sign in"}
        </button>
      </form>

      {isForgotPassword ? (
        <Link to="/auth" search={{ mode: "signin" }} className="mt-5 text-center text-[13px] font-medium text-foreground underline-offset-4 hover:underline">
          Back to sign in
        </Link>
      ) : isReset ? (
        <Link to="/auth" search={{ mode: "signin" }} className="mt-5 text-center text-[13px] font-medium text-foreground underline-offset-4 hover:underline">Back to sign in</Link>
      ) : (
        <div className="mt-auto pt-10 text-center text-[13px] text-muted-foreground">
          {!isSignup && (
            <Link to="/auth" search={{ mode: "forgot" }} className="mb-5 block w-full font-medium text-foreground underline-offset-4 hover:underline">
              Forgot your password?
            </Link>
          )}
          {isSignup ? "Already have an account? " : "New here? "}
          <Link to="/auth" search={{ mode: isSignup ? "signin" : "signup" }} className="font-medium text-foreground underline-offset-4 hover:underline">
            {isSignup ? "Sign in" : "Create one"}
          </Link>
          {!isSignup && (
            <p className="mx-auto mt-5 max-w-[19rem] text-[11px] leading-5 text-muted-foreground">
              Sign in with the same account you used to save your cards. They remain in your vault when you log out.
            </p>
          )}
        </div>
      )}

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
