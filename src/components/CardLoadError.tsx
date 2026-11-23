import { RefreshCw } from "lucide-react";

export function CardLoadError({
  onRetry,
  isRetrying = false,
}: {
  onRetry: () => void | Promise<unknown>;
  isRetrying?: boolean;
}) {
  return (
    <div role="alert" className="rounded-[18px] surface px-6 py-10 text-center">
      <h2 className="font-display text-[1.25rem] font-semibold">Your cards couldn’t load</h2>
      <p className="mx-auto mt-2 max-w-[20rem] text-[13px] leading-6 text-muted-foreground">
        Your cards are saved to your account. Check your connection and try again, or sign in with
        the same account you used to save them.
      </p>
      <button
        type="button"
        onClick={() => void onRetry()}
        disabled={isRetrying}
        className="mt-5 inline-flex items-center justify-center gap-2 rounded-full bg-primary px-5 py-3 text-[13px] font-semibold text-primary-foreground tap disabled:opacity-60"
      >
        <RefreshCw className={`h-4 w-4 ${isRetrying ? "animate-spin" : ""}`} />
        Try again
      </button>
    </div>
  );
}
