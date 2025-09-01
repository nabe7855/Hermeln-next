"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import GoogleIcon from "@/components/GoogleIcon";
import { signInWithEmail, signInWithGoogle } from "@/services/auth";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await signInWithEmail(email, password);
      router.push("/dashboard"); // ログイン成功後にダッシュボードへ遷移
    } catch (err: unknown) {
      if (err instanceof Error) {
        console.error("ログインエラー:", err.message);
        alert(err.message);
      } else {
        console.error("ログインエラー (unknown):", err);
        alert("ログインに失敗しました");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      await signInWithGoogle();
    } catch (err: unknown) {
      if (err instanceof Error) {
        console.error("Googleログインエラー:", err.message);
        alert(err.message);
      } else {
        console.error("Googleログインエラー (unknown):", err);
        alert("Googleログインに失敗しました");
      }
    }
  };

  return (
    <div className="flex flex-col min-h-screen items-center justify-center bg-gradient-to-br from-green-50 via-teal-50 to-purple-100 p-4">
      <h1 className="text-4xl sm:text-5xl font-bold text-gray-800 mb-4">
        Hermelnをはじめよう
      </h1>
      <p className="text-sm sm:text-base text-gray-600 mb-8 leading-relaxed text-center">
        アカウント登録しておくと<br />
        別のデバイスでもHermelnの記憶が引き継がれます
      </p>

      <form onSubmit={handleLogin} className="w-full max-w-sm space-y-4">
        <input
          type="email"
          placeholder="メールアドレス"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full px-4 py-3 border border-gray-300 rounded-full"
          required
        />
        <input
          type="password"
          placeholder="パスワード"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full px-4 py-3 border border-gray-300 rounded-full"
          required
        />
        <button
          type="submit"
          disabled={loading}
          className="w-full py-4 text-lg font-bold text-white bg-gray-800 rounded-full shadow-lg hover:bg-gray-700 active:scale-95 disabled:opacity-50"
        >
          {loading ? "処理中..." : "ログイン"}
        </button>
      </form>

      <div className="flex items-center my-4 w-full max-w-sm">
        <div className="flex-grow border-t border-gray-300"></div>
        <span className="mx-4 text-gray-500 text-sm">OR</span>
        <div className="flex-grow border-t border-gray-300"></div>
      </div>

      <button
        onClick={handleGoogleLogin}
        className="w-full max-w-sm py-4 text-lg font-bold text-white bg-gray-800 rounded-full shadow-lg hover:bg-gray-700 flex items-center justify-center gap-3"
      >
        <GoogleIcon />
        Googleで続ける
      </button>

      <p className="mt-6 text-sm text-gray-600">
        アカウントをお持ちでないですか？{" "}
        <button
          onClick={() => router.push("/register")}
          className="text-blue-600 underline"
        >
          会員登録
        </button>
      </p>
    </div>
  );
}
