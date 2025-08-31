'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { useCharacter } from '@/contexts/CharacterContext';
import { MobileLayout } from '@/components/layout/MobileLayout';
import { MobileCard } from '@/components/ui/MobileCard';
import { FloatingCharacter } from '@/components/character/FloatingCharacter';
import { ChatMessage, EmotionType } from '@/types';
import { apiService } from '@/services/api';
import { vibrate, formatTimeAgo } from '@/lib/utils';
import { ArrowLeft, Mic } from 'lucide-react';
import { useRouter } from 'next/navigation';

const RecordPage: React.FC = () => {
  const { user } = useAuth();
  const { personality, characterState, updateCharacterState } = useCharacter();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recordingTimerRef = useRef<NodeJS.Timeout | null>(null);
  const router = useRouter();

  // Emotions for quick selection
  const emotions: { type: EmotionType; emoji: string; label: string }[] = [
    { type: 'happy', emoji: '😊', label: 'Happy' },
    { type: 'excited', emoji: '🤩', label: 'Excited' },
    { type: 'calm', emoji: '😌', label: 'Calm' },
    { type: 'sad', emoji: '😢', label: 'Sad' },
    { type: 'anxious', emoji: '😰', label: 'Anxious' },
    { type: 'frustrated', emoji: '😤', label: 'Frustrated' },
    { type: 'curious', emoji: '🤔', label: 'Curious' },
    { type: 'grateful', emoji: '🙏', label: 'Grateful' }
  ];

  useEffect(() => {
    // Initialize with welcome message
    if (user && messages.length === 0) {
      const welcomeMessage: ChatMessage = {
        id: 'welcome',
        type: 'ai',
        content: `こんにちは、${user.name}さん！今日はどんな気持ちですか？下の感情から選んでタップしてみてください。`,
        timestamp: new Date().toISOString()
      };
      setMessages([welcomeMessage]);
    }
  }, [user, messages.length]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isRecording && recordingTimerRef.current === null) {
      recordingTimerRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);
    } else if (!isRecording && recordingTimerRef.current) {
      clearInterval(recordingTimerRef.current);
      recordingTimerRef.current = null;
      setRecordingTime(0);
    }

    return () => {
      if (recordingTimerRef.current) {
        clearInterval(recordingTimerRef.current);
      }
    };
  }, [isRecording]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const startRecording = async () => {
    vibrate([50, 100, 50]);
    setIsRecording(true);
    updateCharacterState({ emotion: 'listening' });
    console.log('🎤 Recording started...');
  };

  const stopRecording = async () => {
    if (!isRecording) return;
    
    vibrate(50);
    setIsRecording(false);
    setIsProcessing(true);
    updateCharacterState({ emotion: 'thinking' });
    
    try {
      // Mock audio processing
      const mockTranscript = await apiService.ai.transcribeAudio(new Blob());
      
      // Add user message
      const userMessage: ChatMessage = {
        id: Date.now().toString(),
        type: 'user',
        content: mockTranscript,
        timestamp: new Date().toISOString()
      };
      
      setMessages(prev => [...prev, userMessage]);
      await apiService.diary.saveEntry(userMessage);
      
      // Generate AI response
      if (user) {
        const aiResponse = await apiService.ai.provideFeedback(mockTranscript, user);
        
        const aiMessage: ChatMessage = {
          id: (Date.now() + 1).toString(),
          type: 'ai',
          content: aiResponse,
          timestamp: new Date().toISOString()
        };
        
        setMessages(prev => [...prev, aiMessage]);
        await apiService.diary.saveEntry(aiMessage);
      }
      
    } catch (error) {
      console.error('Recording processing error:', error);
    } finally {
      setIsProcessing(false);
      updateCharacterState({ emotion: 'neutral' });
    }
  };

  const handleEmotionSelect = async (emotion: EmotionType) => {
    vibrate(30);
    
    if (user) {
      const questions = await apiService.ai.generateQuestions(emotion, user);
      const randomQuestion = questions[Math.floor(Math.random() * questions.length)];
      
      const aiMessage: ChatMessage = {
        id: Date.now().toString(),
        type: 'ai',
        content: randomQuestion,
        timestamp: new Date().toISOString()
      };
      
      setMessages(prev => [...prev, aiMessage]);
      updateCharacterState({ emotion: 'encouraging' });
    }
  };

  const formatRecordingTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  if (!user) return null;

  return (
    <MobileLayout>
      <div className="min-h-screen-mobile flex flex-col">
        {/* Header */}
        <div className="sticky top-0 z-10 bg-white/80 backdrop-blur-sm border-b border-gray-100">
          <div className="flex items-center justify-between p-4">
            <button
              onClick={() => router.back()}
              className="p-2 text-gray-600 hover:text-gray-900 touch-feedback rounded-lg"
            >
              <ArrowLeft size={24} />
            </button>
            
            <div className="flex items-center space-x-2">
              <FloatingCharacter
                personality={personality}
                state={characterState}
                size="sm"
                showMessage={false}
              />
              <div className="text-sm">
                <div className="font-medium text-gray-900">{personality.name}</div>
                <div className="text-gray-500 text-xs">
                  {isRecording ? '聞いています...' : 
                   isProcessing ? '考え中...' : 
                   'オンライン'}
                </div>
              </div>
            </div>
            
            <div className="w-10" />
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 p-4 space-y-4 native-scroll overflow-y-auto pb-32">
          <AnimatePresence initial={false}>
            {messages.map((message, index) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`max-w-[80%] ${
                  message.type === 'user' 
                    ? 'bg-primary-500 text-white rounded-2xl rounded-br-md' 
                    : 'bg-white border border-gray-200 rounded-2xl rounded-bl-md'
                } px-4 py-3 shadow-sm`}>
                  <p className="text-sm leading-relaxed">
                    {message.content}
                  </p>
                  <div className={`text-xs mt-1 ${
                    message.type === 'user' ? 'text-primary-100' : 'text-gray-500'
                  }`}>
                    {formatTimeAgo(message.timestamp)}
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {/* Emotion Selector */}
          {messages.length <= 1 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <MobileCard className="bg-gradient-to-r from-primary-50 to-secondary-50">
                <h3 className="font-semibold text-gray-900 mb-4 text-center">
                  今の気持ちを選んでください
                </h3>
                <div className="grid grid-cols-4 gap-3">
                  {emotions.map((emotion) => (
                    <button
                      key={emotion.type}
                      onClick={() => handleEmotionSelect(emotion.type)}
                      className="flex flex-col items-center p-3 rounded-xl bg-white hover:bg-gray-50 active:scale-95 transition-all touch-feedback border border-gray-200"
                    >
                      <span className="text-2xl mb-1">{emotion.emoji}</span>
                      <span className="text-xs text-gray-600">{emotion.label}</span>
                    </button>
                  ))}
                </div>
              </MobileCard>
            </motion.div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Recording Interface */}
        <div className="fixed bottom-20 left-0 right-0 p-4 bg-white/90 backdrop-blur-sm border-t border-gray-200">
          <div className="mobile-container">
            {/* Recording Timer */}
            <AnimatePresence>
              {isRecording && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="text-center mb-4"
                >
                  <div className="bg-red-100 text-red-600 px-4 py-2 rounded-full inline-flex items-center space-x-2">
                    <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                    <span className="font-medium">{formatRecordingTime(recordingTime)}</span>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Recording Button */}
            <div className="flex justify-center">
              <motion.button
                onClick={isRecording ? stopRecording : startRecording}
                disabled={isProcessing}
                className={`w-16 h-16 rounded-full flex items-center justify-center transition-all touch-feedback shadow-lg ${
                  isRecording 
                    ? 'bg-red-500 text-white animate-pulse' 
                    : isProcessing
                    ? 'bg-gray-400 text-white cursor-not-allowed'
                    : 'bg-primary-500 text-white hover:bg-primary-600 active:scale-95'
                }`}
                whileTap={!isProcessing ? { scale: 0.9 } : {}}
              >
                {isProcessing ? (
                  <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : isRecording ? (
                  <div className="w-4 h-4 bg-white rounded-sm"></div>
                ) : (
                  <Mic size={24} />
                )}
              </motion.button>
            </div>

            <p className="text-center text-xs text-gray-500 mt-2">
              {isRecording ? 'タップして録音停止' : 
               isProcessing ? '処理中...' : 
               'タップして録音開始'}
            </p>
          </div>
        </div>
      </div>
    </MobileLayout>
  );
};

export default RecordPage;
