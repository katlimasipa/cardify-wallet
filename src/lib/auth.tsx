import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import type { Session, User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";

const AuthCtx = createContext<{ user: User | null; session: Session | null; loading: boolean }>({
  user: null, session: null, loading: true,
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    let authEventSeen = false;
    const { data: sub } = supabase.auth.onAuthStateChange((_event, s) => {
      authEventSeen = true;
      setSession(s);
      setLoading(false);
    });
    supabase.auth.getSession().then(({ data }) => {
      if (!active) return;
      if (!authEventSeen) setSession(data.session);
      setLoading(false);
    }).catch(() => {
      if (!active) return;
      if (!authEventSeen) setSession(null);
      setLoading(false);
    });
    return () => {
      active = false;
      sub.subscription.unsubscribe();
    };
  }, []);

  return (
    <AuthCtx.Provider value={{ user: session?.user ?? null, session, loading }}>
      {children}
    </AuthCtx.Provider>
  );
}

export const useAuth = () => useContext(AuthCtx);
