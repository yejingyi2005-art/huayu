import { supabase } from "../supabase/client";
import type { User } from "../types";

export const authService = {
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
      const { data: profile } = await supabase
        .from("users")
        .select()
        .eq("user_id", userId)
        .single();
      if (profile) return profile as User;
      await new Promise((r) => setTimeout(r, 300));
    }
    throw { code: "PROFILE_CREATE_FAILED", message: "用户档案创建失败，请稍后重试" };
  },

  async signIn(email: string, password: string): Promise<User> {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw { code: "AUTH_SIGNIN_FAILED", message: error.message };
    const userId = data.user?.id;
    if (!userId) throw { code: "AUTH_NO_USER", message: "Sign in returned no user ID" };

    const { data: profile } = await supabase
      .from("users")
      .select()
      .eq("user_id", userId)
      .single();
    return profile as User;
  },

  async signOut(): Promise<void> {
    const { error } = await supabase.auth.signOut();
    if (error) throw { code: "AUTH_SIGNOUT_FAILED", message: error.message };
  },

  async getCurrentUser(): Promise<User | null> {
    const { data: sessionData } = await supabase.auth.getSession();
    const userId = sessionData.session?.user?.id;
    if (!userId) return null;

    const { data } = await supabase.from("users").select().eq("user_id", userId).single();
    return data as User | null;
  },
};
