import { supabase } from "@/lib/supabaseClient";
import type {
  User,
  AuthError,
  AuthResponse,
  OAuthResponse,
} from "@supabase/supabase-js";

// 📩 メール & パスワードでサインアップ
export const signUpWithEmail = async (
  email: string,
  password: string,
  name: string
): Promise<{ user: User | null; error: AuthError | null }> => {
  const { data, error }: AuthResponse = await supabase.auth.signUp({
    email: email.trim().toLowerCase(),
    password,
    options: { data: { name: name.trim() } },
  });

  console.log("📩 Supabase signup result:", data, error);

  if (error) return { user: null, error };

  const user = data.user ?? null;
  if (!user) return { user: null, error: new Error("ユーザー作成失敗") as AuthError };

  // 2. API 経由で profiles を作成（service_role 使用）
  try {
    const res = await fetch("/api/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId: user.id, email, name }),
    });

    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      const apiError = body.error || "DB初期化に失敗しました";
      return { user: null, error: new Error(apiError) as AuthError };
    }
  } catch (err) {
    return {
      user: null,
      error: err as AuthError,
    };
  }

  return { user, error: null };
};

// 📩 ログイン
export const signInWithEmail = async (
  email: string,
  password: string
): Promise<{ user: User | null; error: AuthError | null }> => {
  const { data, error }: AuthResponse = await supabase.auth.signInWithPassword({
    email: email.trim().toLowerCase(),
    password,
  });

  return { user: data.user ?? null, error };
};

// 🔑 Google ログイン
export const signInWithGoogle = async (): Promise<{
  url: string | null;
  error: AuthError | null;
}> => {
  const { data, error }: OAuthResponse = await supabase.auth.signInWithOAuth({
    provider: "google",
  });

  return { url: data?.url ?? null, error };
};

// 🚪 ログアウト
export const signOut = async (): Promise<void> => {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
};

// 👤 現在ログインしているユーザー
export const getCurrentUser = async (): Promise<User | null> => {
  const { data, error } = await supabase.auth.getUser();
  if (error) throw error;
  return data.user ?? null;
};
