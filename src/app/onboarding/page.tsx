'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { useCharacter } from '@/contexts/CharacterContext';
import { MobileButton } from '@/components/ui/MobileButton';
import { MobileCard } from '@/components/ui/MobileCard';
import { MobileLayout } from '@/components/layout/MobileLayout';
import { FloatingCharacter } from '@/components/character/FloatingCharacter';
import { characterPersonalities } from '@/services/mock';
import { OnboardingData, CharacterPersonality } from '@/types';
import { ChevronLeft } from 'lucide-react';

const OnboardingPage: React.FC = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<OnboardingData>({
    name: '',
    hobby_tags: [],
    ai_partner_personality: 'gentle',
    speaking_level: 10,
  });
  const [isLoading, setIsLoading] = useState(false);

  const { user, updateUser } = useAuth();
  const { setPersonality } = useCharacter();
  const router = useRouter();

  const availableHobbies = [
    '映画', '読書', '料理', '旅行', '音楽', '運動',
    'ゲーム', '写真', 'ペット', 'ファッション',
    '勉強', '仕事', 'アニメ', '自然',
  ];

  const totalSteps = 3;

  const handleNext = () => {
    if (step < totalSteps) {
      setStep(step + 1);
    } else {
      handleComplete();
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const handleComplete = async () => {
    if (!user) return;

    setIsLoading(true);

    try {
      await updateUser({
        ...formData,
        name: user.name, // 既存の名前は維持
        is_onboarded: true,
        streak_days: 1,
      });

      setPersonality(formData.ai_partner_personality);
      router.push('/dashboard');
    } catch (error) {
      console.error('Onboarding error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleHobby = (hobby: string) => {
    const newHobbies = formData.hobby_tags.includes(hobby)
      ? formData.hobby_tags.filter((h) => h !== hobby)
      : [...formData.hobby_tags, hobby];

    setFormData({ ...formData, hobby_tags: newHobbies });
  };

  const setAIPersonality = (personalityId: CharacterPersonality['id']) => {
    setFormData({ ...formData, ai_partner_personality: personalityId });
  };

  const canProceed = () => {
    switch (step) {
      case 1:
        return formData.hobby_tags.length > 0;
      case 2:
        return true;
      case 3:
        return true;
      default:
        return false;
    }
  };

  const currentPersonality =
    characterPersonalities.find(
      (p) => p.id === formData.ai_partner_personality,
    ) || characterPersonalities[0];

  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 300 : -300,
      opacity: 0,
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? 300 : -300,
      opacity: 0,
    }),
  };

  // direction は固定値で十分
  const direction = 0;

  return (
    <MobileLayout>
      <div className="min-h-screen-mobile py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={handleBack}
            disabled={step === 1}
            className="p-2 text-gray-400 disabled:opacity-50 touch-feedback rounded-lg"
          >
            <ChevronLeft size={24} />
          </button>

          <div className="flex space-x-2">
            {[...Array(totalSteps)].map((_, i) => (
              <div
                key={i}
                className={`w-8 h-1 rounded-full transition-colors ${
                  i + 1 <= step ? 'bg-primary-500' : 'bg-gray-200'
                }`}
              />
            ))}
          </div>

          <div className="w-8" />
        </div>

        {/* Steps Container */}
        <div className="relative overflow-hidden">
          <AnimatePresence initial={false} custom={direction}>
            <motion.div
              key={step}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{
                x: { type: 'spring', stiffness: 300, damping: 30 },
                opacity: { duration: 0.2 },
              }}
              className="w-full"
            >
              {/* Step 1: Hobbies */}
              {step === 1 && (
                <div className="space-y-6">
                  <div className="text-center mb-8">
                    <FloatingCharacter
                      personality={currentPersonality}
                      message="趣味や興味のあることを教えてください"
                      size="md"
                    />
                  </div>

                  <MobileCard>
                    <h2 className="text-xl font-bold text-center mb-6">
                      興味・関心のあることは？
                    </h2>

                    <div className="grid grid-cols-2 gap-3">
                      {availableHobbies.map((hobby) => (
                        <button
                          key={hobby}
                          onClick={() => toggleHobby(hobby)}
                          className={`p-3 rounded-xl text-sm font-medium transition-all touch-feedback ${
                            formData.hobby_tags.includes(hobby)
                              ? 'bg-primary-500 text-white shadow-md'
                              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                          }`}
                        >
                          {hobby}
                        </button>
                      ))}
                    </div>

                    <p className="text-xs text-gray-500 mt-4 text-center">
                      複数選択できます（{formData.hobby_tags.length}個選択中）
                    </p>
                  </MobileCard>
                </div>
              )}

              {/* Step 2: AI Personality */}
              {step === 2 && (
                <div className="space-y-6">
                  <div className="text-center mb-8">
                    <FloatingCharacter
                      personality={currentPersonality}
                      message="あなたのパートナーを選んでください"
                      size="md"
                    />
                  </div>

                  <MobileCard>
                    <h2 className="text-xl font-bold text-center mb-6">
                      AIパートナーの性格は？
                    </h2>

                    <div className="space-y-3">
                      {characterPersonalities.map((personality) => (
                        <button
                          key={personality.id}
                          onClick={() => setAIPersonality(personality.id)}
                          className={`w-full p-4 rounded-xl transition-all touch-feedback text-left ${
                            formData.ai_partner_personality === personality.id
                              ? 'bg-primary-50 border-2 border-primary-500'
                              : 'bg-gray-50 border-2 border-transparent hover:bg-gray-100'
                          }`}
                        >
                          <div className="flex items-center space-x-3">
                            <div
                              className={`w-12 h-12 character-avatar bg-gradient-to-br ${personality.gradient} text-lg`}
                            >
                              {personality.avatar}
                            </div>
                            <div className="flex-1">
                              <h3 className="font-semibold text-gray-900">
                                {personality.name}
                              </h3>
                              <p className="text-sm text-gray-600">
                                {personality.description}
                              </p>
                            </div>
                          </div>
                        </button>
                      ))}
                    </div>
                  </MobileCard>
                </div>
              )}

              {/* Step 3: Speaking Level */}
              {step === 3 && (
                <div className="space-y-6">
                  <div className="text-center mb-8">
                    <FloatingCharacter
                      personality={currentPersonality}
                      message="準備完了！一緒に学習を始めましょう"
                      size="md"
                    />
                  </div>

                  <MobileCard>
                    <h2 className="text-xl font-bold text-center mb-6">
                      スピーキングレベル
                    </h2>

                    <div className="mb-6">
                      <div className="flex justify-between text-sm text-gray-600 mb-2">
                        <span>初心者</span>
                        <span>上級者</span>
                      </div>
                      <input
                        type="range"
                        min="1"
                        max="20"
                        value={formData.speaking_level}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            speaking_level: parseInt(e.target.value),
                          })
                        }
                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                        style={{
                          background: `linear-gradient(to right, #ff6b35 0%, #ff6b35 ${
                            (formData.speaking_level / 20) * 100
                          }%, #e5e7eb ${(formData.speaking_level / 20) * 100}%, #e5e7eb 100%)`,
                        }}
                      />
                      <div className="text-center mt-3">
                        <span className="text-2xl font-bold text-primary-500">
                          {formData.speaking_level}
                        </span>
                        <span className="text-gray-600">/20</span>
                      </div>
                    </div>

                    <div className="bg-secondary-50 rounded-xl p-4">
                      <h3 className="font-semibold text-gray-900 mb-2">
                        あなたの学習プラン
                      </h3>
                      <ul className="text-sm text-gray-700 space-y-1">
                        <li>
                          • 選択した趣味（{formData.hobby_tags.join('、')}）を中心とした会話練習
                        </li>
                        <li>• {currentPersonality.name}があなたをサポート</li>
                        <li>
                          • レベル{formData.speaking_level}に最適化された質問とフィードバック
                        </li>
                      </ul>
                    </div>
                  </MobileCard>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Navigation */}
        <div className="mt-8">
          <MobileButton
            onClick={handleNext}
            disabled={!canProceed() || isLoading}
          >
            {isLoading ? '設定中...' : step === totalSteps ? '完了' : '次へ'}
          </MobileButton>
        </div>
      </div>
    </MobileLayout>
  );
};

export default OnboardingPage;
