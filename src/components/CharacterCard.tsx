import React from 'react';
import Image from 'next/image';
import { Character } from '../types/types';

interface CharacterCardProps {
  character: Character;
  isSelected: boolean;
  onSelect: (id: number) => void;
}

const CharacterCard: React.FC<CharacterCardProps> = ({ character, isSelected, onSelect }) => {
  return (
    <button
      onClick={() => onSelect(character.id)}
      className={`
        flex flex-col items-center justify-center gap-2 sm:gap-3 p-2 sm:p-3
        w-24 h-24 sm:w-28 sm:h-28 lg:w-32 lg:h-32
        bg-white/70 backdrop-blur-md rounded-3xl
        transition-all duration-300 ease-in-out
        transform hover:scale-105
        focus:outline-none focus:ring-4 focus:ring-pink-400
        ${
          isSelected
            ? 'ring-4 ring-pink-400 shadow-2xl shadow-pink-200/80 scale-105'
            : 'ring-2 ring-transparent shadow-lg'
        }
      `}
      aria-pressed={isSelected}
      aria-label={`Select ${character.name}`}
    >
      <div className="w-12 h-12 sm:w-16 sm:h-16 lg:w-20 lg:h-20 rounded-full overflow-hidden">
        <Image
          src={character.imageUrl}
          alt={character.name}
          width={80}   // ✅ 必須: width
          height={80}  // ✅ 必須: height
          className="w-full h-full object-cover"
        />
      </div>
      <p className="text-xs sm:text-sm font-semibold text-gray-700">{character.name}</p>
    </button>
  );
};

export default CharacterCard;
