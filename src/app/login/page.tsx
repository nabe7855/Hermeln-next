'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { MobileButton } from '@/components/ui/MobileButton';
import { MobileCard } from '@/components/ui/MobileCard';
import { MobileLayout } from '@/components/layout/MobileLayout';
import { FloatingCharacter } from '@/components/character/FloatingCharacter';
import { getCharacterPersonality } from '@/services/mock';

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const router = useRouter();
  const personality = getCharacterPersonality('friendly');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email.trim() || !name.trim()) {
      return;
    }

    setIsLoading(true);
    
    try {
      await login(email, name);
      router.push('/onboarding');
    } catch (error) {
      console.error('Login error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDemoLogin = async () => {
    setIsLoading(true);
    try {
      await login('demo@hermeln.com', 'デモユーザー');
      router.push('/dashboard'); // Skip onboarding for demo
    } catch (error) {
      console.error('Demo login error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <MobileLayout>
      <div className="min-h-screen-mobile flex flex-col justify-center py-8">
        {/* Character Welcome */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-8"
        >
          <FloatingCharacter
            personality={personality}
            message="はじめまして！あなたのことを教えてください"
            size="md"
          />
        </motion.div>

        {/* Login Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <MobileCard>
            <h1 className="text-2xl font-bold text-center text-gray-900 mb-6">
              Hermeln へようこそ
            </h1>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label 
                  htmlFor="name" 
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  お名前
                </label>
                <input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary-500 focus:ring focus:ring-primary-200 transition-colors text-base"
                  placeholder="田中太郎"
                  required
                />
              </div>

              <div>
                <label 
                  htmlFor="email" 
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  メールアドレス
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary-500 focus:ring focus:ring-primary-200 transition-colors text-base"
                  placeholder="your.email@example.com"
                  required
                />
              </div>

              <MobileButton
                type="submit"
                disabled={isLoading || !email.trim() || !name.trim()}
                className="mt-6"
              >
                {isLoading ? '処理中...' : 'はじめる'}
              </MobileButton>
            </form>

            <div className="mt-6 pt-6 border-t border-gray-100">
              <MobileButton
                variant="secondary"
                onClick={handleDemoLogin}
                disabled={isLoading}
              >
                🚀 デモで体験する
              </MobileButton>
              <p className="text-xs text-gray-500 text-center mt-2">
                すぐに Hermeln を体験できます
              </p>
            </div>
          </MobileCard>
        </motion.div>

        {/* Privacy Notice */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="text-xs text-gray-500 text-center mt-6 px-4"
        >
          続行することで、あなたの情報は安全に保護されることに同意したものとみなします
        </motion.p>
      </div>
    </MobileLayout>
  );
};

export default LoginPage;