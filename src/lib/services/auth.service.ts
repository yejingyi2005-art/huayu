import { supabase } from "../supabase/client";
import type { User } from "../types";

export const authService = {
  async ensureProfile(userId: string, nickname: string): Promise<User> {
    const { data: existing } = await supabase
      .from("users")
      .select()
      .eq("user_id", userId)
      .single();
    if (existing) return existing as User;

    const { data: created, error } = await supabase
      .from("users")
      .insert({ user_id: userId, nickname })
      .select()
      .single();
    if (error && error.code !== "23505") throw { code: "PROFILE_CREATE_FAILED", message: "用户档案创建失败" };
    return (created ?? { user_id: userId, nickname, avatar: null, email: null, created_at: new Date().toISOString() }) as User;
  },

  async signUp(email: string, password: string, nickname: string): Promise<User> {
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { nickname } },
    });
    if (authError) throw { code: "AUTH_CREATE_FAILED", message: authError.message };
    const userId = authData.user?.id;
    if (!userId) throw { code: "AUTH_NO_USER", message: "User creation returned no ID" };

    for (let i = 0; i < 5; i++) {
      const profile = await authService.ensureProfile(userId, nickname).catch(() => null);
      if (profile) return profile;
      await new Promise((r) => setTimeout(r, 300));
    }
    throw { code: "PROFILE_CREATE_FAILED", message: "用户档案创建失败，请稍后重试" };
  },

  async signIn(email: string, password: string): Promise<User> {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw { code: "AUTH_SIGNIN_FAILED", message: error.message };
    const userId = data.user?.id;
    if (!userId) throw { code: "AUTH_NO_USER", message: "Sign in returned no user ID" };

    const profile = await authService.ensureProfile(userId, data.user?.user_metadata?.nickname ?? "花屿用户");
    return profile;
  },

  async signOut(): Promise<void> {
    const { error } = await supabase.auth.signOut();
    if (error) throw { code: "AUTH_SIGNOUT_FAILED", message: error.message };
  },

  async getCurrentUser(): Promise<User | null> {
    const { data: sessionData } = await supabase.auth.getSession();
    const userId = sessionData.session?.user?.id;
    if (!userId) return null;

    const profile = await authService.ensureProfile(userId, sessionData.session?.user?.user_metadata?.nickname ?? "花屿用户").catch(() => null);
    return profile;
  },
};
