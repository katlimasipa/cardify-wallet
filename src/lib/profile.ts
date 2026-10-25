import type { User } from "@supabase/supabase-js";

export function getDisplayName(user: User | null) {
  const metadata = user?.user_metadata as Record<string, unknown> | undefined;
  for (const key of ["display_name", "full_name", "name"]) {
    const value = metadata?.[key];
    if (typeof value === "string" && value.trim()) return value.trim();
  }
  return "";
}
