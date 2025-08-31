'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { useCharacter } from '@/contexts/CharacterContext';
import { MobileLayout } from '@/components/layout/MobileLayout';
import { MobileCard } from '@/components/ui/MobileCard';
import { FloatingCharacter } from '@/components/character/FloatingCharacter';
import { getCharacterPersonality, getRandomGreeting } from '@/services/mock';
import { vibrate } from '@/lib/utils';
import { Calendar, Target, TrendingUp, Zap } from 'lucide-react';

const DashboardPage: React.FC = () => {
  const { user } = useAuth();
  const { setPersonality, characterState, updateCharacterState } = useCharacter();
  const [greeting, setGreeting] = useState('');
  const [currentTime, setCurrentTime] = useState(new Date());
  const router = useRouter();

  useEffect(() => {
    if (user) {
      // personality の一時変数は未使用なので削除
      setPersonality(user.ai_partner_personality);
      setGreeting(getRandomGreeting(user.ai_partner_personality, user.name));
    }
  }, [user, setPersonality]);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const handleCharacterTap = () => {
    vibrate(50);
    updateCharacterState({ emotion: 'encouraging' });
    
    setTimeout(() => {
      router.push('/record');
    }, 300);
  };

  const getTimeBasedMessage = () => {
    const hour = currentTime.getHours();
    if (hour < 12) return '今日も素敵な一日にしましょう';
    if (hour < 17) return '午後も頑張りましょうね';
    return 'お疲れ様でした。今日はどうでしたか？';
  };

  if (!user) return null;

  // personality はここだけで定義
  const personality = getCharacterPersonality(user.ai_partner_personality);

  const stats = [
    {
      icon: <Calendar className="w-5 h-5" />,
      label: '連続記録',
      value: `${user.streak_days}日`,
      color: 'text-primary-600'
    },
    {
      icon: <Target className="w-5 h-5" />,
      label: 'レベル',
      value: `${user.speaking_level}/20`,
      color: 'text-secondary-600'
    },
    {
      icon: <TrendingUp className="w-5 h-5" />,
      label: '成長率',
      value: '+12%',
      color: 'text-green-600'
    }
  ];

  return (
    <MobileLayout>
      <div className="min-h-screen-mobile py-8 space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex items-center justify-between"
        >
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              おかえりなさい、{user.name}さん
            </h1>
            <p className="text-gray-600 text-sm mt-1">
              {getTimeBasedMessage()}
            </p>
          </div>
          <button
            onClick={() => router.push('/profile')}
            className="w-12 h-12 character-avatar bg-gradient-to-r from-primary-400 to-primary-600 text-white text-lg touch-feedback"
          >
            {user.name?.[0]}
          </button>
        </motion.div>

        {/* Main Character Section */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-center py-8"
        >
          <FloatingCharacter
            personality={personality}
            state={characterState}
            message={greeting}
            onTap={handleCharacterTap}
            size="lg"
          />
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="mt-6"
          >
            <button
              onClick={handleCharacterTap}
              className="bg-primary-500 text-white px-8 py-4 rounded-2xl font-semibold text-lg shadow-lg active:scale-95 transition-transform touch-feedback hover:bg-primary-600"
            >
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center">
                  <div className="w-3 h-3 bg-white rounded-full animate-pulse"></div>
                </div>
                今日の気持ちを聞かせて
              </div>
            </button>
          </motion.div>
        </motion.div>

        {/* Stats Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="grid grid-cols-3 gap-3"
        >
          {stats.map((stat) => (
            <MobileCard key={stat.label} className="text-center p-4">
              <div className={`mb-2 flex justify-center ${stat.color}`}>
                {stat.icon}
              </div>
              <div className="text-lg font-bold text-gray-900 mb-1">
                {stat.value}
              </div>
              <div className="text-xs text-gray-600">
                {stat.label}
              </div>
            </MobileCard>
          ))}
        </motion.div>

        {/* Progress Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <MobileCard className="bg-gradient-to-r from-secondary-500 to-primary-500 text-white">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-lg mb-1">継続記録</h3>
                <p className="text-white/80 text-sm">連続で頑張っています！</p>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold">{user.streak_days}</div>
                <div className="text-white/80 text-xs">日連続</div>
              </div>
            </div>
          </MobileCard>
        </motion.div>

        {/* Recent Growth */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="space-y-4"
        >
          <h3 className="font-bold text-gray-800 text-lg">最近の成長</h3>
          
          <MobileCard>
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-green-600" />
              </div>
              <div className="flex-1">
                <h4 className="font-semibold text-gray-800">表現力アップ</h4>
                <p className="text-gray-600 text-sm">新しい感情表現を3つ習得しました</p>
              </div>
              <div className="text-green-600 font-bold">+15%</div>
            </div>
          </MobileCard>

          <MobileCard>
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <Zap className="w-6 h-6 text-blue-600" />
              </div>
              <div className="flex-1">
                <h4 className="font-semibold text-gray-800">流暢さ向上</h4>
                <p className="text-gray-600 text-sm">自然な会話のリズムが身についています</p>
              </div>
              <div className="text-blue-600 font-bold">+8%</div>
            </div>
          </MobileCard>
        </motion.div>

        {/* AI Partner Message */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <MobileCard className="bg-gradient-to-r from-secondary-50 to-primary-50 border border-secondary-200">
            <div className="flex items-start space-x-3">
              <div className={`w-10 h-10 character-avatar bg-gradient-to-br ${personality.gradient} text-lg flex-shrink-0`}>
                {personality.avatar}
              </div>
              <div>
                <h4 className="font-semibold text-gray-800 mb-2">
                  {personality.name}より
                </h4>
                <p className="text-gray-700 text-sm leading-relaxed">
                  最近、感情を表現する語彙が豊富になってきましたね！特に「{user.hobby_tags[0]}」の話をする時の表現が印象的です✨
                </p>
                <div className="mt-3 text-xs text-secondary-600">
                  あなた専用のAIパートナー
                </div>
              </div>
            </div>
          </MobileCard>
        </motion.div>
      </div>
    </MobileLayout>
  );
};

export default DashboardPage;
