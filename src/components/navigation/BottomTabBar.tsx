'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Mic, User } from 'lucide-react';

const tabs = [
  { href: '/dashboard', icon: Home, label: 'ホーム' },
  { href: '/record', icon: Mic, label: '録音' },
  { href: '/profile', icon: User, label: 'プロフィール' },
];

export const BottomTabBar: React.FC = () => {
  const pathname = usePathname();

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 safe-area-inset">
      <div className="flex justify-around items-center py-2 pb-safe max-w-sm mx-auto">
        {tabs.map(({ href, icon: Icon, label }) => {
          const isActive = pathname === href;
          
          return (
            <Link
              key={href}
              href={href}
              className={`
                flex flex-col items-center py-2 px-4 min-w-0 flex-1
                transition-colors duration-200 touch-feedback rounded-lg
                ${isActive 
                  ? 'text-primary-500' 
                  : 'text-gray-500 hover:text-gray-700 active:text-gray-800'
                }
              `}
            >
              <Icon size={24} className="mb-1" />
              <span className="text-xs font-medium truncate">{label}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
};
