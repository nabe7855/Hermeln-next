"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { User as AppUser } from "@/types";
import {
  signUpWithEmail,
  signInWithEmail,
  signOut,
} from "@/services/auth";
import { supabase } from "@/lib/supabaseClient";
import type { User as SupabaseUser } from "@supabase/supabase-js"; // ← SupabaseのUser型

interface AuthContextType {
  user: AppUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  register: (email: string, password: string, name: string) => Promise<AppUser>;
  login: (email: string, password: string) => Promise<AppUser>;
  logout: () => Promise<void>;
  updateUser: (updates: Partial<AppUser>) => Promise<AppUser>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

// Supabase → アプリ用 User 型に変換
const mapSupabaseUserToAppUser = (supabaseUser: SupabaseUser): AppUser => {
  return {
    id: supabaseUser.id,
    email: supabaseUser.email ?? "",
    name: supabaseUser.user_metadata?.name ?? "",
    image: supabaseUser.user_metadata?.avatar_url ?? null,

    // アプリ独自フィールド（初期値）
    speaking_level: 1,
    ai_partner_personality: "friendly",
    hobby_tags: [],
    is_onboarded: false,
    created_at: new Date().toISOString(),
    streak_days: 0,
  };
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<AppUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // 初期化（セッション確認）
  useEffect(() => {
    const initAuth = async () => {
      try {
        console.log("🔍 Auth init start");

        const { data, error } = await supabase.auth.getSession();

        if (error) {
          console.warn("⚠️ Auth session error:", error.message);
          setUser(null);
        } else if (data.session?.user) {
          console.log("✅ セッションあり:", data.session.user);
          setUser(mapSupabaseUserToAppUser(data.session.user));
        } else {
          console.log("ℹ️ セッションなし");
          setUser(null);
        }
      } catch (err: unknown) {
        if (err instanceof Error) {
          console.warn("⚠️ Auth initialization warning:", err.message);
        } else {
          console.warn("⚠️ Auth initialization unknown error:", err);
        }
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    initAuth();

    // ✅ リアルタイムでセッション変化を監視
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setUser(mapSupabaseUserToAppUser(session.user));
      } else {
        setUser(null);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // 📩 会員登録
  const register = async (
    email: string,
    password: string,
    name: string
  ): Promise<AppUser> => {
    const { user, error } = await signUpWithEmail(email, password, name);
    if (error || !user) throw new Error(error?.message ?? "ユーザー登録に失敗しました");

    const mapped = mapSupabaseUserToAppUser(user);
    setUser(mapped);
    return mapped;
  };

  // 📩 ログイン
  const login = async (email: string, password: string): Promise<AppUser> => {
    const { user, error } = await signInWithEmail(email, password);
    if (error || !user) throw new Error(error?.message ?? "ログインに失敗しました");

    const mapped = mapSupabaseUserToAppUser(user);
    setUser(mapped);
    return mapped;
  };

  // 🚪 ログアウト
  const logout = async () => {
    await signOut();
    setUser(null);
  };

  // ✏️ ユーザー情報を更新
  const updateUser = async (updates: Partial<AppUser>): Promise<AppUser> => {
    if (!user) throw new Error("ログインしていません");

    const { error } = await supabase
      .from("profile") // ✅ Profileを管理するテーブル
      .update({
        ...updates,
        updatedAt: new Date().toISOString(),
      })
      .eq("id", user.id);

    if (error) throw error;

    const updatedUser = { ...user, ...updates };
    setUser(updatedUser);
    return updatedUser;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        register,
        login,
        logout,
        updateUser,
      }}
    >
      {isLoading ? <div>Loading...</div> : children}
    </AuthContext.Provider>
  );
};
