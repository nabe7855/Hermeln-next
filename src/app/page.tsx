'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { FloatingCharacter } from '@/components/character/FloatingCharacter';
import { MobileButton } from '@/components/ui/MobileButton';
import { MobileLayout } from '@/components/layout/MobileLayout';
import { getCharacterPersonality } from '@/services/mock';
import { Heart, MessageCircle, Sparkles, Users } from 'lucide-react';

const LandingPage: React.FC = () => {
  const demoPersonality = getCharacterPersonality('gentle');

  const features = [
    {
      icon: <Heart className="w-6 h-6" />,
      title: "感情ファースト",
      description: "あなたの気持ちを大切に"
    },
    {
      icon: <MessageCircle className="w-6 h-6" />,
      title: "AI会話パートナー",
      description: "いつでもそばにいる聞き手"
    },
    {
      icon: <Sparkles className="w-6 h-6" />,
      title: "楽しい成長体験",
      description: "毎日の小さな発見を祝福"
    },
    {
      icon: <Users className="w-6 h-6" />,
      title: "心理的安全性",
      description: "間違いを恐れない環境"
    }
  ];

  return (
    <MobileLayout>
      <div className="min-h-screen-mobile flex flex-col">
        {/* Hero Section */}
        <section className="flex-1 flex flex-col items-center justify-center py-12 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <FloatingCharacter
              personality={demoPersonality}
              message="はじめまして！一緒に言葉の旅を始めましょう"
              size="lg"
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="mt-8"
          >
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Hermeln
            </h1>
            <p className="text-xl text-primary-600 font-medium mb-2">
              感じたことが、ことばになる
            </p>
            <p className="text-gray-600 mb-8 px-4">
              あなたの感情を起点とした<br/>
              新しい言語学習体験
            </p>

            <Link href="/login">
              <MobileButton size="lg" className="max-w-xs mx-auto">
                今すぐ始める
              </MobileButton>
            </Link>
          </motion.div>
        </section>

        {/* Features Section */}
        <motion.section
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="py-8"
        >
          <h2 className="text-2xl font-bold text-center mb-6">
            なぜHermeln？
          </h2>
          
          <div className="grid grid-cols-2 gap-4">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.8 + index * 0.1 }}
                className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 text-center"
              >
                <div className="text-primary-500 mb-3 flex justify-center">
                  {feature.icon}
                </div>
                <h3 className="font-semibold text-gray-900 mb-1 text-sm">
                  {feature.title}
                </h3>
                <p className="text-xs text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Demo Preview */}
        <motion.section
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 1 }}
          className="py-8"
        >
          <div className="bg-gradient-to-r from-primary-500 to-secondary-500 rounded-2xl p-6 text-white text-center">
            <h3 className="text-lg font-bold mb-2">
              🎤 音声で自然に表現
            </h3>
            <p className="text-primary-100 text-sm mb-4">
              AIパートナーがあなたの声に耳を傾け、<br/>
              感情に寄り添った会話をサポート
            </p>
            <div className="bg-white/20 rounded-xl p-3 backdrop-blur-sm">
              <p className="text-xs text-white/90">
                &quot;今日は映画を見て感動しました...&quot;
              </p>
            </div>
          </div>
        </motion.section>
      </div>
    </MobileLayout>
  );
};

export default LandingPage;
