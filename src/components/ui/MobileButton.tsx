'use client';

import React from 'react';
import { cn } from '@/lib/utils';

interface MobileButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
}

export const MobileButton: React.FC<MobileButtonProps> = ({
  variant = 'primary',
  size = 'md',
  className,
  children,
  ...props
}) => {
  const baseStyles = `
    w-full rounded-full font-semibold transition-all duration-200
    touch-feedback active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed
    flex items-center justify-center gap-2 min-h-touch-target
  `;

  const variants = {
    primary: 'bg-primary-500 text-white shadow-lg hover:bg-primary-600 active:bg-primary-600',
    secondary: 'bg-gray-100 text-gray-700 hover:bg-gray-200 active:bg-gray-200',
    ghost: 'bg-transparent text-gray-600 hover:bg-gray-100 active:bg-gray-100'
  };

  const sizes = {
    sm: 'h-10 px-4 text-sm',
    md: 'h-12 px-6 text-base',
    lg: 'h-14 px-8 text-lg'
  };

  return (
    <button
      className={cn(baseStyles, variants[variant], sizes[size], className)}
      {...props}
    >
      {children}
    </button>
  );
};