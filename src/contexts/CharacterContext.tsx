'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';
import { AICharacterState, CharacterPersonality } from '@/types';
import { getCharacterPersonality } from '@/services/mock';

interface CharacterContextType {
  characterState: AICharacterState;
  personality: CharacterPersonality;
  updateCharacterState: (updates: Partial<AICharacterState>) => void;
  setPersonality: (personalityId: CharacterPersonality['id']) => void;
}

const CharacterContext = createContext<CharacterContextType | undefined>(undefined);

export const useCharacter = () => {
  const context = useContext(CharacterContext);
  if (!context) {
    throw new Error('useCharacter must be used within a CharacterProvider');
  }
  return context;
};

export const CharacterProvider = ({ children }: { children: ReactNode }) => {
  const [characterState, setCharacterState] = useState<AICharacterState>({
    emotion: 'neutral',
    animation: 'floating',
    position: { x: 0, y: 0 },
    scale: 1,
    opacity: 1
  });

  const [personality, setPersonalityState] = useState<CharacterPersonality>(
    getCharacterPersonality('gentle')
  );

  const updateCharacterState = (updates: Partial<AICharacterState>) => {
    setCharacterState(prev => ({ ...prev, ...updates }));
  };

  const setPersonality = (personalityId: CharacterPersonality['id']) => {
    const newPersonality = getCharacterPersonality(personalityId);
    setPersonalityState(newPersonality);
  };

  return (
    <CharacterContext.Provider
      value={{
        characterState,
        personality,
        updateCharacterState,
        setPersonality
      }}
    >
      {children}
    </CharacterContext.Provider>
  );
};