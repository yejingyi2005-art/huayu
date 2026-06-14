import { useState, useEffect, useCallback } from "react";
import type { User } from "../lib/types";
import { authService } from "../lib/services/auth.service";

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    authService
      .getCurrentUser()
      .then((u) => { if (!cancelled) setUser(u); })
      .catch(() => { if (!cancelled) setUser(null); })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, []);

  const signIn = useCallback(async (email: string, password: string) => {
    setError(null);
    try {
      const u = await authService.signIn(email, password);
      setUser(u);
    } catch (e) {
      setError((e as { message?: string }).message ?? "登录失败");
    }
  }, []);

  const signUp = useCallback(async (email: string, password: string, nickname: string) => {
    setError(null);
    try {
      const u = await authService.signUp(email, password, nickname);
      setUser(u);
    } catch (e) {
      setError((e as { message?: string }).message ?? "注册失败");
    }
  }, []);

  const signOut = useCallback(async () => {
    await authService.signOut();
    setUser(null);
  }, []);

  return { user, loading, error, signIn, signUp, signOut };
}
