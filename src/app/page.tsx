"use client";
import React from "react";
import { useRouter } from "next/navigation";
import { CHARACTERS } from "@/lib/constants";
import Logo from "@/components/Logo";
import { motion } from "framer-motion";
import { Heart, MessageCircle, Sparkles, Users } from "lucide-react";
import Image from "next/image";

export default function HomePage() {
  const router = useRouter();

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

  const features = [
    { icon: <Heart className="w-6 h-6" />, title: "感情ファースト", description: "あなたの気持ちを大切に" },
    { icon: <MessageCircle className="w-6 h-6" />, title: "AI会話パートナー", description: "いつでもそばにいる聞き手" },
    { icon: <Sparkles className="w-6 h-6" />, title: "楽しい成長体験", description: "毎日の小さな発見を祝福" },
    { icon: <Users className="w-6 h-6" />, title: "心理的安全性", description: "間違いを恐れない環境" },
  ];

  return (
    <div className="relative min-h-screen w-full font-sans overflow-hidden bg-gradient-to-br from-green-50 via-teal-50 to-purple-100 flex flex-col items-center justify-between p-4 sm:p-8">
      {/* 背景 */}
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

      {/* ヘッダー */}
      <header className="flex flex-col items-center text-center z-10 pt-8 sm:pt-12">
        <Logo />
        <h1 className="text-4xl sm:text-5xl font-bold text-gray-800 mt-4">Hermeln</h1>
        <p className="text-base sm:text-lg text-gray-600 mt-2">自分の話したいで語学する</p>
      </header>

      {/* メインロゴ */}
      <main className="flex flex-col items-center justify-center z-10 my-4 sm:my-8">
        <Image
          src="/logo.png"
          alt="Hermeln Logo"
          width={160}
          height={160}
          priority
          className="w-32 h-32 sm:w-40 sm:h-40 rounded-full object-cover shadow-2xl shadow-purple-400/50"
        />
        <p className="text-xl sm:text-2xl font-bold text-gray-800 bg-white/60 backdrop-blur-sm px-6 py-2 rounded-full mt-4">
          Hermeln
        </p>
      </main>

      {/* フッター */}
      <footer className="w-full max-w-sm flex flex-col items-center gap-4 pb-6 sm:pb-8 z-10">
        <p className="text-xs text-gray-500 text-center px-4">
          Hermelnを利用することで、<a href="#" className="underline">利用規約</a>及び
          <a href="#" className="underline">プライバシーポリシー</a>に同意したものとします
        </p>
        <button
          onClick={() => router.push("/login")}
          className="w-full py-4 text-lg font-bold text-white bg-gray-800 rounded-full shadow-lg hover:bg-gray-700 active:scale-95"
        >
          次へ
        </button>
      </footer>

      {/* 特徴セクション */}
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
    </div>
  );
}
