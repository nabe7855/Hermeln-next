export interface User {
  id: string;
  email: string;
  name: string;
  speaking_level: number; // 1-20
  ai_partner_personality: 'gentle' | 'encouraging' | 'thoughtful' | 'friendly';
  hobby_tags: string[];
  is_onboarded: boolean;
  created_at: string;
  streak_days: number;
}

export interface AICharacterState {
  emotion: 'neutral' | 'listening' | 'thinking' | 'encouraging' | 'celebrating';
  animation: 'idle' | 'floating' | 'nodding' | 'speaking' | 'reacting';
  position: { x: number; y: number };
  scale: number;
  opacity: number;
}

export interface CharacterPersonality {
  id: 'gentle' | 'encouraging' | 'thoughtful' | 'friendly';
  name: string;
  description: string;
  avatar: string;
  floatingStyle: 'gentle' | 'bouncy' | 'calm' | 'energetic';
  speechBubbleStyle: 'rounded' | 'cloud' | 'modern';
  gradient: string;
}

export interface ChatMessage {
  id: string;
  type: 'user' | 'ai';
  content: string;
  timestamp: string;
  audioUrl?: string;
}

export type EmotionType = 'happy' | 'excited' | 'calm' | 'sad' | 'anxious' | 'frustrated' | 'curious' | 'grateful';

export interface OnboardingData {
  name: string;
  hobby_tags: string[];
  ai_partner_personality: CharacterPersonality['id'];
  speaking_level: number;
}

export interface ApiService {
  users: UserService;
  ai: AIService;
  diary: DiaryService;
}

export interface UserService {
  getCurrentUser(): Promise<User | null>;
  updateUser(updates: Partial<User>): Promise<User>;
  completeOnboarding(data: OnboardingData): Promise<User>;
  login(email: string, name: string): Promise<User>;
  logout(): void;
}

export interface AIService {
  generateQuestions(emotion: EmotionType, userProfile: User): Promise<string[]>;
  provideFeedback(message: string, userProfile: User): Promise<string>;
  transcribeAudio(audioBlob: Blob): Promise<string>;
}

export interface DiaryService {
  getRecentEntries(limit: number): Promise<ChatMessage[]>;
  saveEntry(entry: Omit<ChatMessage, 'id' | 'timestamp'>): Promise<ChatMessage>;
}