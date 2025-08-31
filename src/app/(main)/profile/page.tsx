'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { useCharacter } from '@/contexts/CharacterContext';
import { MobileLayout } from '@/components/layout/MobileLayout';
import { MobileCard } from '@/components/ui/MobileCard';
import { MobileButton } from '@/components/ui/MobileButton';
import { characterPersonalities, getCharacterPersonality } from '@/services/mock';
import { CharacterPersonality } from '@/types';
import { 
  Bell, 
  Moon, 
  Download, 
  HelpCircle, 
  LogOut,
  ChevronRight
} from 'lucide-react';

const ProfilePage: React.FC = () => {
  const { user, logout, updateUser } = useAuth();
  // personality は未使用なので削除、setPersonality だけ使う
  const { setPersonality } = useCharacter();
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    name: user?.name || '',
    hobby_tags: user?.hobby_tags || []
  });

  const handleSave = async () => {
    if (user) {
      try {
        await updateUser(editData);
        setIsEditing(false);
      } catch (error) {
        console.error('Profile update error:', error);
      }
    }
  };

  const handlePersonalityChange = async (personalityId: CharacterPersonality['id']) => {
    if (user) {
      try {
        await updateUser({ ai_partner_personality: personalityId });
        setPersonality(personalityId);
      } catch (error) {
        console.error('Personality update error:', error);
      }
    }
  };

  const availableHobbies = [
    '映画', '読書', '料理', '旅行', '音楽', '運動',
    'ゲーム', '写真', 'ペット', 'ファッション',
    '勉強', '仕事', 'アニメ', '自然'
  ];

  const toggleHobby = (hobby: string) => {
    const newHobbies = editData.hobby_tags.includes(hobby)
      ? editData.hobby_tags.filter(h => h !== hobby)
      : [...editData.hobby_tags, hobby];
    
    setEditData({ ...editData, hobby_tags: newHobbies });
  };

  if (!user) return null;

  const currentPersonality = getCharacterPersonality(user.ai_partner_personality);

  const settingItems = [
    {
      icon: <Bell className="w-5 h-5" />,
      title: '通知設定',
      subtitle: 'リマインダーとお知らせ',
      onClick: () => console.log('Notifications')
    },
    {
      icon: <Moon className="w-5 h-5" />,
      title: 'ダークモード',
      subtitle: '外観設定',
      hasSwitch: true,
      onClick: () => console.log('Dark mode')
    },
    {
      icon: <Download className="w-5 h-5" />,
      title: 'データエクスポート',
      subtitle: '学習データのダウンロード',
      onClick: () => console.log('Export data')
    },
    {
      icon: <HelpCircle className="w-5 h-5" />,
      title: 'ヘルプ・サポート',
      subtitle: '使い方とFAQ',
      onClick: () => console.log('Help')
    }
  ];

  return (
    <MobileLayout>
      <div className="min-h-screen-mobile py-8 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">プロフィール</h1>
          <button
            onClick={() => {
              if (isEditing) {
                handleSave();
              } else {
                setIsEditing(true);
              }
            }}
            className="text-primary-500 font-medium px-4 py-2 rounded-lg touch-feedback"
          >
            {isEditing ? '保存' : '編集'}
          </button>
        </div>

        {/* User Info Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <MobileCard>
            <div className="flex items-center space-x-4">
              <div className="w-20 h-20 character-avatar bg-gradient-to-r from-primary-400 to-primary-600 text-white text-2xl">
                {user.name?.[0]}
              </div>
              <div className="flex-1">
                {isEditing ? (
                  <input
                    type="text"
                    value={editData.name}
                    onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                    className="text-xl font-bold bg-gray-100 px-3 py-1 rounded-lg w-full"
                  />
                ) : (
                  <h2 className="text-xl font-bold text-gray-900">{user.name}</h2>
                )}
                <p className="text-gray-600">{user.email}</p>
                <div className="flex items-center mt-2 space-x-2">
                  <span className="bg-primary-100 text-primary-700 px-2 py-1 rounded-full text-xs font-medium">
                    レベル {user.speaking_level}/20
                  </span>
                  <span className="bg-secondary-100 text-secondary-700 px-2 py-1 rounded-full text-xs font-medium">
                    {user.streak_days}日連続
                  </span>
                </div>
              </div>
            </div>
          </MobileCard>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="grid grid-cols-2 gap-4"
        >
          <MobileCard className="text-center">
            <div className="text-2xl font-bold text-primary-600 mb-1">127</div>
            <div className="text-gray-600 text-sm">総録音回数</div>
          </MobileCard>
          <MobileCard className="text-center">
            <div className="text-2xl font-bold text-secondary-600 mb-1">{user.streak_days}</div>
            <div className="text-gray-600 text-sm">連続記録日</div>
          </MobileCard>
        </motion.div>

        {/* Hobbies */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <MobileCard>
            <h3 className="font-bold text-gray-800 mb-4">興味・関心事</h3>
            {isEditing ? (
              <div className="grid grid-cols-2 gap-2">
                {availableHobbies.map((hobby) => (
                  <button
                    key={hobby}
                    onClick={() => toggleHobby(hobby)}
                    className={`p-2 rounded-lg text-sm transition-colors ${
                      editData.hobby_tags.includes(hobby)
                        ? 'bg-primary-500 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {hobby}
                  </button>
                ))}
              </div>
            ) : (
              <div className="flex flex-wrap gap-2">
                {user.hobby_tags.map(tag => (
                  <span 
                    key={tag}
                    className="bg-primary-100 text-primary-700 px-3 py-1 rounded-full text-sm font-medium"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </MobileCard>
        </motion.div>

        {/* AI Partner */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <MobileCard>
            <h3 className="font-bold text-gray-800 mb-4">AIパートナー</h3>
            
            {isEditing ? (
              <div className="space-y-3">
                {characterPersonalities.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => handlePersonalityChange(p.id)}
                    className={`w-full p-3 rounded-xl transition-all text-left ${
                      user.ai_partner_personality === p.id
                        ? 'bg-primary-50 border-2 border-primary-500'
                        : 'bg-gray-50 border-2 border-transparent hover:bg-gray-100'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <div className={`w-10 h-10 character-avatar bg-gradient-to-br ${p.gradient} text-lg`}>
                        {p.avatar}
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900">{p.name}</h4>
                        <p className="text-sm text-gray-600">{p.description}</p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            ) : (
              <div className="flex items-center space-x-3 p-3 bg-secondary-50 rounded-xl">
                <div className={`w-12 h-12 character-avatar bg-gradient-to-br ${currentPersonality.gradient} text-lg`}>
                  {currentPersonality.avatar}
                </div>
                <div>
                  <h4 className="font-semibold text-gray-800">{currentPersonality.name}</h4>
                  <p className="text-gray-600 text-sm">{currentPersonality.description}</p>
                </div>
              </div>
            )}
          </MobileCard>
        </motion.div>

        {/* Settings */}
        {!isEditing && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="space-y-3"
          >
            <h3 className="font-bold text-gray-800 text-lg">設定</h3>
            
            {settingItems.map((item) => (
              <motion.button
                key={item.title}
                onClick={item.onClick}
                className="w-full p-4 bg-white rounded-2xl shadow-sm border border-gray-100 flex items-center space-x-4 touch-feedback active:scale-[0.98] transition-transform"
                whileTap={{ scale: 0.98 }}
              >
                <div className="text-gray-600">{item.icon}</div>
                <div className="flex-1 text-left">
                  <h4 className="font-semibold text-gray-800">{item.title}</h4>
                  <p className="text-gray-600 text-sm">{item.subtitle}</p>
                </div>
                {item.hasSwitch ? (
                  <div className="w-12 h-6 bg-gray-300 rounded-full p-1">
                    <div className="w-4 h-4 bg-white rounded-full transition-transform" />
                  </div>
                ) : (
                  <ChevronRight className="w-5 h-5 text-gray-400" />
                )}
              </motion.button>
            ))}
          </motion.div>
        )}

        {/* Logout */}
        {!isEditing && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            <MobileButton
              variant="secondary"
              onClick={logout}
              className="text-red-600 hover:bg-red-50"
            >
              <LogOut className="w-5 h-5" />
              ログアウト
            </MobileButton>
          </motion.div>
        )}
      </div>
    </MobileLayout>
  );
};

export default ProfilePage;
