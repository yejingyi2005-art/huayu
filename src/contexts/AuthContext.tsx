import { createContext, useContext, useState, useEffect, type ReactNode } from "react";
import type { User } from "../lib/types";
import { supabase } from "../lib/supabase/client";
import { authService } from "../lib/services/auth.service";

interface AuthContextValue {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, nickname: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        authService.getCurrentUser().then((u) => setUser(u)).finally(() => setLoading(false));
      } else {
        setLoading(false);
      }
    });
  }, []);

  const signIn = async (email: string, password: string) => {
    const u = await authService.signIn(email, password);
    setUser(u);
  };

  const signUp = async (email: string, password: string, nickname: string) => {
    const u = await authService.signUp(email, password, nickname);
    setUser(u);
  };

  const signOut = async () => {
    await authService.signOut();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signUp, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
