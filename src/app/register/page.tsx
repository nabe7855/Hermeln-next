"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import GoogleIcon from "@/components/GoogleIcon";
import BackButton from "@/components/BackButton";
import { signUpWithEmail, signInWithGoogle } from "@/services/auth";

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { user, error } = await signUpWithEmail(email, password, name);

      if (error) {
        console.error("会員登録エラー:", error.message);
        alert(error.message || "会員登録に失敗しました");
        return;
      }

      if (user) {
        alert("確認メールを送信しました！");
        router.push("/login"); // 登録後ログイン画面へ
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        console.error("会員登録エラー:", err.message);
        alert(err.message);
      } else {
        console.error("会員登録エラー (unknown):", err);
        alert("会員登録に失敗しました");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleRegister = async () => {
    try {
      const { url, error } = await signInWithGoogle();
      if (error) {
        console.error("Google登録エラー:", error.message);
        alert("Google登録に失敗しました");
        return;
      }
      if (url) {
        window.location.href = url; // Googleの認証ページにリダイレクト
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        console.error("Google登録エラー:", err.message);
        alert(err.message);
      } else {
        console.error("Google登録エラー (unknown):", err);
        alert("Google登録に失敗しました");
      }
    }
  };

  return (
    <div className="flex flex-col min-h-screen items-center justify-center bg-gradient-to-br from-green-50 via-teal-50 to-purple-100 p-4 relative">
      {/* 戻るボタン */}
      <div className="absolute left-4 top-4">
        <BackButton onClick={() => router.push("/login")} />
      </div>

      <h2 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-6">
        アカウント登録
      </h2>

      <form onSubmit={handleRegister} className="w-full max-w-sm space-y-4">
        <input
          type="text"
          placeholder="名前"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full px-4 py-3 border border-gray-300 rounded-full"
          required
        />

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
          className="w-full py-4 text-lg font-bold text-white bg-gray-800 rounded-full shadow-lg hover:bg-gray-700 disabled:opacity-50"
        >
          {loading ? "処理中..." : "アカウント登録"}
        </button>
      </form>

      <div className="flex items-center my-4 w-full max-w-sm">
        <div className="flex-grow border-t border-gray-300"></div>
        <span className="mx-4 text-gray-500 text-sm">OR</span>
        <div className="flex-grow border-t border-gray-300"></div>
      </div>

      <button
        onClick={handleGoogleRegister}
        className="w-full max-w-sm py-4 text-lg font-bold text-white bg-gray-800 rounded-full shadow-lg hover:bg-gray-700 flex items-center justify-center gap-3"
      >
        <GoogleIcon />
        Googleで登録
      </button>
    </div>
  );
}
