"use client";
import React, { useState } from "react";
import { CHARACTERS } from "@/lib/constants";
import Logo from "@/components/Logo";
import GoogleIcon from "@/components/GoogleIcon";
import BackButton from "@/components/BackButton"; // ← 戻るボタン追加
import { motion } from "framer-motion";
import { Heart, MessageCircle, Sparkles, Users } from "lucide-react";
import Image from "next/image";

type View = "default" | "loginOptions" | "register";

export default function TestPage() {
  const [view, setView] = useState<View>("default");

  // Background characters
  const backgroundCharacters = CHARACTERS.slice(0, 6).map((char, index) => ({
    ...char,
    positions: [
      "top-1/4 left-1/4",
      "top-1/2 right-1/4",
      "bottom-1/4 left-1/3",
      "top-1/3 right-1/2",
      "bottom-1/2 left-1/4",
      "bottom-1/3 right-1/3",
    ][index],
  }));

  // Features
  const features = [
    { icon: <Heart className="w-6 h-6" />, title: "感情ファースト", description: "あなたの気持ちを大切に" },
    { icon: <MessageCircle className="w-6 h-6" />, title: "AI会話パートナー", description: "いつでもそばにいる聞き手" },
    { icon: <Sparkles className="w-6 h-6" />, title: "楽しい成長体験", description: "毎日の小さな発見を祝福" },
    { icon: <Users className="w-6 h-6" />, title: "心理的安全性", description: "間違いを恐れない環境" },
  ];

  const isLoginFlow = view === "loginOptions" || view === "register";

  return (
    <div
      className={`relative min-h-screen w-full font-sans overflow-hidden bg-gradient-to-br from-green-50 via-teal-50 to-purple-100 flex flex-col items-center p-4 sm:p-8 ${
        isLoginFlow ? "justify-center" : "justify-between"
      }`}
    >
      {/* Background decorative images */}
      {backgroundCharacters.map((char) => (
        <Image
          key={char.id}
          src={char.imageUrl}
          alt=""
          width={128}
          height={128}
          unoptimized
          className={`absolute ${char.positions} w-20 h-20 sm:w-24 sm:h-24 lg:w-32 lg:h-32 rounded-full opacity-10 filter blur-sm -translate-x-1/2 -translate-y-1/2`}
        />
      ))}

      {/* Header */}
      <header className="flex flex-col items-center text-center z-10 pt-8 sm:pt-12 w-full max-w-xs sm:max-w-sm relative">
        {/* 戻るボタンをヘッダー左上に配置 */}
        {view === "register" && (
          <div className="absolute left-0 top-2 sm:top-4">
            <BackButton onClick={() => setView("loginOptions")} />
          </div>
        )}

        {view === "default" && (
          <>
            <Logo />
            <h1 className="text-4xl sm:text-5xl font-bold text-gray-800 mt-4">Hermeln</h1>
            <p className="text-base sm:text-lg text-gray-600 mt-2">自分の話したいで語学する</p>
          </>
        )}
        {view === "loginOptions" && (
          <>
            <h1 className="text-4xl sm:text-5xl font-bold text-gray-800">Hermelnをはじめよう</h1>
            <p className="text-sm sm:text-base text-gray-600 mt-4 leading-relaxed">
              アカウント登録しておくと<br />別のデバイスでもHermelnの記憶が引き継がれます
            </p>
          </>
        )}
        {view === "register" && (
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-800">アカウント登録</h2>
        )}
      </header>

      {/* Main logo */}
      <main
        className={`flex flex-col items-center justify-center w-full z-10 px-4 ${
          isLoginFlow ? "my-8" : "flex-grow my-4 sm:my-8"
        }`}
      >
        <div className="w-64 h-64 sm:w-80 sm:h-80 flex items-center justify-center p-4 relative">
          <div className="text-center flex flex-col items-center justify-center gap-4 animate-float">
            <Image
              src="/logo.png"
              alt="Hermeln Logo"
              width={160}
              height={160}
              priority
              className="w-32 h-32 sm:w-40 sm:h-40 rounded-full object-cover shadow-2xl shadow-purple-400/50"
            />
            {view !== "register" && (
              <p className="text-xl sm:text-2xl font-bold text-gray-800 bg-white/60 backdrop-blur-sm px-6 py-2 rounded-full mt-4">
                Hermeln
              </p>
            )}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full max-w-xs sm:max-w-sm flex flex-col items-center gap-4 pb-6 sm:pb-8 z-10">
        {view === "default" && (
          <>
            <p className="text-xs text-gray-500 text-center px-4">
              Hermelnを利用することで、<a href="#" className="underline">利用規約</a>及び<a href="#" className="underline">プライバシーポリシー</a>に同意したものとします
            </p>
            <button
              onClick={() => setView("loginOptions")}
              className="w-full py-4 text-lg font-bold text-white bg-gray-800 rounded-full shadow-lg transition-all duration-300 hover:bg-gray-700 active:scale-95"
            >
              次へ
            </button>
          </>
        )}

        {view === "loginOptions" && (
  <>
    <a
      href="#"
      onClick={(e) => {
        e.preventDefault();
        setView("register");
      }}
      className="text-sm font-semibold text-gray-700 py-2 hover:underline"
    >
      アカウント登録
    </a>

    {/* ログインフォーム */}
    <input
      type="email"
      placeholder="メールアドレス"
      className="w-full px-4 py-3 text-base border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-purple-400"
    />
    <input
      type="password"
      placeholder="パスワード"
      className="w-full px-4 py-3 text-base border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-purple-400"
    />
    <button className="w-full py-4 text-lg font-bold text-white bg-gray-800 rounded-full shadow-lg transition-all duration-300 hover:bg-gray-700 active:scale-95">
      ログイン
    </button>

    <div className="flex items-center my-2 w-full">
      <div className="flex-grow border-t border-gray-300"></div>
      <span className="flex-shrink mx-4 text-gray-500 text-sm">OR</span>
      <div className="flex-grow border-t border-gray-300"></div>
    </div>

    <button className="w-full py-4 text-lg font-bold text-white bg-gray-800 rounded-full shadow-lg transition-all duration-300 hover:bg-gray-700 active:scale-95 flex items-center justify-center gap-3">
      <GoogleIcon />
      Googleで続ける
    </button>
  </>
)}


        {view === "register" && (
          <>
            <input
              type="email"
              placeholder="メールアドレス"
              className="w-full px-4 py-3 text-base border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-purple-400"
            />
            <input
              type="password"
              placeholder="パスワード"
              className="w-full px-4 py-3 text-base border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-purple-400"
            />
            <button className="w-full py-4 text-lg font-bold text-white bg-gray-800 rounded-full shadow-lg transition-all duration-300 hover:bg-gray-700 active:scale-95">
              アカウント登録
            </button>
            <div className="flex items-center my-1 w-full">
              <div className="flex-grow border-t border-gray-300"></div>
              <span className="flex-shrink mx-4 text-gray-500 text-sm">OR</span>
              <div className="flex-grow border-t border-gray-300"></div>
            </div>
            <button className="w-full py-4 text-lg font-bold text-white bg-gray-800 rounded-full shadow-lg transition-all duration-300 hover:bg-gray-700 active:scale-95 flex items-center justify-center gap-3">
              <GoogleIcon />
              Googleで登録
            </button>
          </>
        )}
      </footer>

      {/* Features Section */}
      {view === "default" && (
        <motion.section
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="py-12 w-full max-w-3xl"
        >
          <h2 className="text-2xl font-bold text-center mb-6">話そう。 あなたの想いを。 世界の言葉で。</h2>
          <p className="text-center text-gray-600 mb-6">
            話したいことを話すことが最高の語学という哲学で<br />
            Hermelnは、AIを使いあなたの「話したい」を引き出します。。<br />
            自分の言葉で、自由に表現しましょう。
          </p>
          <div className="grid grid-cols-2 gap-4">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.8 + index * 0.1 }}
                className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 text-center"
              >
                <div className="text-primary-500 mb-3 flex justify-center">{feature.icon}</div>
                <h3 className="font-semibold text-gray-900 mb-1 text-sm">{feature.title}</h3>
                <p className="text-xs text-gray-600 leading-relaxed">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.section>
      )}
    </div>
  );
}
