// src/services/auth.ts
import { supabase } from "@/lib/supabaseClient"

// メール + パスワードで登録
export const signUpWithEmail = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  })
  if (error) throw error
  return data
}

// Googleログイン
export const signInWithGoogle = async () => {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
  })
  if (error) throw error
  return data
}
