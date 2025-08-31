'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence, Variants } from 'framer-motion';
import { CharacterPersonality, AICharacterState } from '@/types';
import { cn } from '@/lib/utils';

interface FloatingCharacterProps {
  personality: CharacterPersonality;
  state?: AICharacterState;
  onTap?: () => void;
  message?: string;
  size?: 'sm' | 'md' | 'lg';
  showMessage?: boolean;
}

export const FloatingCharacter: React.FC<FloatingCharacterProps> = ({
  personality,
  state,
  onTap,
  message,
  size = 'lg',
  showMessage = true
}) => {
  const [isPressed, setIsPressed] = useState(false);

  const sizes = {
    sm: { container: 'w-12 h-12', text: 'text-lg' },
    md: { container: 'w-20 h-20', text: 'text-3xl' },
    lg: { container: 'w-32 h-32', text: 'text-5xl' }
  };

  // ✅ Variants でアニメーション定義（将来拡張しやすい）
  const floatingVariants: Variants = {
    gentle: {
      y: [0, -15, 0],
      transition: { duration: 3, repeat: Infinity, ease: 'easeInOut' }
    },
    bouncy: {
      y: [0, -20, 0],
      scale: [1, 1.05, 1],
      transition: { duration: 2.5, repeat: Infinity, ease: 'easeInOut' }
    },
    calm: {
      y: [0, -10, 0],
      transition: { duration: 4, repeat: Infinity, ease: 'easeInOut' }
    },
    energetic: {
      y: [0, -25, 0],
      rotate: [0, 5, -5, 0],
      transition: { duration: 2, repeat: Infinity, ease: 'easeInOut' }
    }
  };

  const handleTap = () => {
    if (onTap) {
      setIsPressed(true);
      setTimeout(() => setIsPressed(false), 200);
      onTap();
    }
  };

  return (
    <div className="flex flex-col items-center">
      <motion.div
        className="relative cursor-pointer select-none"
        variants={floatingVariants}
        animate={personality.floatingStyle || 'gentle'} // ✅ 型エラー解消
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={handleTap}
      >
        {/* Listening indicator */}
        {state?.emotion === 'listening' && (
          <div
            className={cn(
              'absolute inset-0 rounded-full border-4 border-primary-400 animate-ping-gentle',
              sizes[size].container
            )}
          />
        )}

        {/* Character avatar */}
        <div
          className={cn(
            'character-avatar relative z-10 bg-gradient-to-br',
            personality.gradient,
            sizes[size].container,
            sizes[size].text,
            isPressed && 'scale-90'
          )}
        >
          {personality.avatar}

          {/* State indicators */}
          {state?.emotion === 'thinking' && (
            <motion.div
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              className="absolute -top-2 -right-2 w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center text-xs"
            >
              💭
            </motion.div>
          )}
        </div>

        {/* Speaking wave animation */}
        {state?.emotion === 'encouraging' && (
          <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2">
            <div className="flex items-end space-x-1">
              {[...Array(5)].map((_, i) => (
                <motion.div
                  key={i}
                  className="w-1 bg-primary-400 rounded-full"
                  animate={{
                    height: [4, 20, 4]
                  }}
                  transition={{
                    duration: 0.5,
                    repeat: Infinity,
                    delay: i * 0.1,
                    ease: 'easeInOut'
                  }}
                />
              ))}
            </div>
          </div>
        )}
      </motion.div>

      {/* Message bubble */}
      <AnimatePresence>
        {showMessage && message && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.9 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            className="mt-4 max-w-xs"
          >
            <div
              className={cn(
                'relative bg-white px-4 py-3 shadow-lg border border-gray-200',
                personality.speechBubbleStyle === 'rounded' && 'rounded-2xl',
                personality.speechBubbleStyle === 'cloud' && 'rounded-3xl',
                personality.speechBubbleStyle === 'modern' && 'rounded-xl'
              )}
            >
              <p className="text-sm text-gray-700 text-center leading-relaxed">
                {message}
              </p>
              {/* Speech bubble tail */}
              <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-2">
                <div className="w-4 h-4 bg-white border-l border-t border-gray-200 transform rotate-45"></div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
