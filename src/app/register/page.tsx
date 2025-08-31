"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import GoogleIcon from "@/components/GoogleIcon";
import BackButton from "@/components/BackButton";

export default function RegisterPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("会員登録:", email, password);
    router.push("/login");
  };

  return (
    <div className="flex flex-col min-h-screen items-center justify-center bg-gradient-to-br from-green-50 via-teal-50 to-purple-100 p-4 relative">
      {/* 戻るボタン */}
      <div className="absolute left-4 top-4">
        <BackButton onClick={() => router.push("/login")} />
      </div>

      <h2 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-6">アカウント登録</h2>

      <form onSubmit={handleRegister} className="w-full max-w-sm space-y-4">
        <input
          type="email"
          placeholder="メールアドレス"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full px-4 py-3 border border-gray-300 rounded-full"
        />
        <input
          type="password"
          placeholder="パスワード"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full px-4 py-3 border border-gray-300 rounded-full"
        />
        <button className="w-full py-4 text-lg font-bold text-white bg-gray-800 rounded-full shadow-lg hover:bg-gray-700">
          アカウント登録
        </button>
      </form>

      <div className="flex items-center my-4 w-full max-w-sm">
        <div className="flex-grow border-t border-gray-300"></div>
        <span className="mx-4 text-gray-500 text-sm">OR</span>
        <div className="flex-grow border-t border-gray-300"></div>
      </div>

      <button className="w-full max-w-sm py-4 text-lg font-bold text-white bg-gray-800 rounded-full shadow-lg hover:bg-gray-700 flex items-center justify-center gap-3">
        <GoogleIcon />
        Googleで登録
      </button>
    </div>
  );
}
