import { 
  User, 
  CharacterPersonality, 
  EmotionType, 
  ChatMessage, 
  UserService, 
  AIService, 
  DiaryService, 
  OnboardingData 
} from '@/types';

// Character personalities
export const characterPersonalities: CharacterPersonality[] = [
  {
    id: 'gentle',
    name: '優しいサポーター',
    description: '包み込むような優しい性格',
    avatar: '😊',
    floatingStyle: 'gentle',
    speechBubbleStyle: 'rounded',
    gradient: 'from-pink-300 to-purple-300'
  },
  {
    id: 'encouraging',
    name: 'エネルギッシュな応援者',
    description: '元気いっぱいで励ましてくれる',
    avatar: '💪',
    floatingStyle: 'bouncy',
    speechBubbleStyle: 'modern',
    gradient: 'from-yellow-300 to-orange-300'
  },
  {
    id: 'thoughtful',
    name: '思慮深い相談者',
    description: 'じっくり考えて的確なアドバイス',
    avatar: '🤔',
    floatingStyle: 'calm',
    speechBubbleStyle: 'cloud',
    gradient: 'from-blue-300 to-teal-300'
  },
  {
    id: 'friendly',
    name: '親しみやすい友達',
    description: 'まるで親友のような親近感',
    avatar: '😄',
    floatingStyle: 'energetic',
    speechBubbleStyle: 'rounded',
    gradient: 'from-green-300 to-emerald-300'
  }
];

// Mock user data
export const createMockUser = (email: string, name: string): User => ({
  id: crypto.randomUUID(),
  email,
  name,
  speaking_level: 8,
  ai_partner_personality: 'gentle',
  hobby_tags: [],
  is_onboarded: false,
  created_at: new Date().toISOString(),
  streak_days: 0
});

export const mockUser: User = {
  id: 'demo-user',
  email: 'demo@hermeln.com',
  name: 'デモユーザー',
  speaking_level: 8,
  ai_partner_personality: 'gentle',
  hobby_tags: ['映画', '旅行', '料理'],
  is_onboarded: true,
  created_at: '2024-01-01T00:00:00Z',
  streak_days: 5
};

// Mock AI responses by personality
export const mockAIResponses = {
  gentle: {
    greetings: [
      "おかえりなさい、{name}さん。今日はどんな気持ちですか？",
      "こんにちは！あなたの気持ちを聞かせてください",
      "素敵な一日を過ごされていますか？"
    ],
    responses: [
      "あなたの気持ち、とてもよく分かります",
      "素敵ですね！もう少し詳しく教えてもらえますか？",
      "その時の気持ちを表現するのは素晴らしいことです",
      "あなたの言葉から温かい気持ちが伝わってきます"
    ]
  },
  encouraging: {
    greetings: [
      "やあ、{name}さん！今日も頑張りましょう！",
      "素晴らしい！今日はどんな発見がありましたか？",
      "エネルギー満タンで行きましょう！"
    ],
    responses: [
      "すごい！その調子です！",
      "どんどん表現力が豊かになってますね！",
      "あなたの成長が見えて嬉しいです！",
      "完璧です！もっと聞かせてください！"
    ]
  },
  thoughtful: {
    greetings: [
      "こんにちは、{name}さん。今日のお話を聞かせてください",
      "深く考えてみましょう。どんな気持ちですか？",
      "ゆっくりとお話しください"
    ],
    responses: [
      "なるほど、とても興味深いですね",
      "その気持ちについてもう少し考えてみましょう",
      "あなたの洞察力は素晴らしいです",
      "深く理解できました。他にはどうでしょう？"
    ]
  },
  friendly: {
    greetings: [
      "やあ！{name}、元気にしてた？",
      "お疲れ様！今日はどうだった？",
      "また会えて嬉しいよ！"
    ],
    responses: [
      "いいね！それで？",
      "面白い！もっと教えて！",
      "そうそう、それだよ！",
      "君の話はいつも楽しいな！"
    ]
  }
};

// Mock questions by emotion
export const mockQuestions = {
  happy: [
    "今日の嬉しい出来事について教えてください",
    "何があなたを幸せにしてくれましたか？",
    "その喜びをもっと詳しく聞かせてください"
  ],
  excited: [
    "何にそんなにワクワクしているのですか？",
    "今一番楽しみにしていることは何ですか？",
    "その興奮を他の人にも伝えてみてください"
  ],
  calm: [
    "どんなことで心が落ち着きますか？",
    "平和な時間について話してください",
    "その穏やかな気持ちを表現してみてください"
  ],
  sad: [
    "辛い気持ちを話すことで楽になることもあります",
    "今の気持ちをそのまま表現してみてください",
    "どんな小さなことでも構いません"
  ],
  anxious: [
    "不安な気持ちも大切な感情です",
    "心配事を言葉にしてみませんか？",
    "一緒に整理していきましょう"
  ],
  frustrated: [
    "どんなことにイライラしていますか？",
    "その気持ちを正直に表現してください",
    "怒りも大切な感情の一つです"
  ],
  curious: [
    "どんなことに興味を持っていますか？",
    "新しい発見について教えてください",
    "その好奇心について詳しく聞かせてください"
  ],
  grateful: [
    "感謝の気持ちについて話してください",
    "どんなことに感謝していますか？",
    "その温かい気持ちを表現してみてください"
  ]
};

// Mock services
export const createMockUserService = (): UserService => ({
  async getCurrentUser() {
    const userData = localStorage.getItem('hermeln_user');
    if (userData) {
      return JSON.parse(userData);
    }
    return null;
  },

  async updateUser(updates: Partial<User>) {
    const current = await this.getCurrentUser();
    if (!current) throw new Error('User not found');
    
    const updated = { ...current, ...updates };
    localStorage.setItem('hermeln_user', JSON.stringify(updated));
    return updated;
  },

  async completeOnboarding(data: OnboardingData) {
    const current = await this.getCurrentUser();
    if (!current) throw new Error('User not found');
    
    const updated = {
      ...current,
      ...data,
      is_onboarded: true,
      streak_days: 1
    };
    localStorage.setItem('hermeln_user', JSON.stringify(updated));
    return updated;
  },

  async login(email: string, name: string) {
    const user = createMockUser(email, name);
    localStorage.setItem('hermeln_user', JSON.stringify(user));
    return user;
  },

  logout() {
    localStorage.removeItem('hermeln_user');
    localStorage.removeItem('hermeln_chat_messages');
  }
});

export const createMockAIService = (): AIService => ({
  async generateQuestions(emotion: EmotionType) {
    await new Promise(resolve => setTimeout(resolve, 500)); // API遅延を模擬
    const questions = mockQuestions[emotion] || mockQuestions.happy;
    return questions.slice(0, 3);
  },

  async provideFeedback(message: string, userProfile: User) {
    await new Promise(resolve => setTimeout(resolve, 800)); // API遅延を模擬
    const personality = userProfile.ai_partner_personality;
    const responses = mockAIResponses[personality]?.responses || mockAIResponses.gentle.responses;
    const randomResponse = responses[Math.floor(Math.random() * responses.length)];
    return randomResponse;
  },

  async transcribeAudio() {
    await new Promise(resolve => setTimeout(resolve, 1000)); // API遅延を模擬
    return "これは音声から変換されたテキストのモックです。実際の音声認識機能は後で実装します。";
  }
});

export const createMockDiaryService = (): DiaryService => ({
  async getRecentEntries(limit: number) {
    const messages = localStorage.getItem('hermeln_chat_messages');
    if (messages) {
      const parsed = JSON.parse(messages);
      return parsed.slice(-limit);
    }
    return [];
  },

  async saveEntry(entry: Omit<ChatMessage, 'id' | 'timestamp'>) {
    const messages = localStorage.getItem('hermeln_chat_messages');
    const existingMessages = messages ? JSON.parse(messages) : [];
    
    const newEntry: ChatMessage = {
      ...entry,
      id: crypto.randomUUID(),
      timestamp: new Date().toISOString()
    };
    
    const updatedMessages = [...existingMessages, newEntry];
    localStorage.setItem('hermeln_chat_messages', JSON.stringify(updatedMessages));
    
    return newEntry;
  }
});

export const getCharacterPersonality = (id: CharacterPersonality['id']): CharacterPersonality => {
  return characterPersonalities.find(p => p.id === id) || characterPersonalities[0];
};

export const getRandomGreeting = (personality: CharacterPersonality['id'], userName: string): string => {
  const greetings = mockAIResponses[personality]?.greetings || mockAIResponses.gentle.greetings;
  const greeting = greetings[Math.floor(Math.random() * greetings.length)];
  return greeting.replace('{name}', userName);
};
