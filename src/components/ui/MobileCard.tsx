'use client';

import React from 'react';
import { cn } from '@/lib/utils';

interface MobileCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export const MobileCard: React.FC<MobileCardProps> = ({
  className,
  children,
  ...props
}) => {
  return (
    <div
      className={cn(
        'bg-white rounded-2xl p-6 shadow-sm border border-gray-100 touch-feedback',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};