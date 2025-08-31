'use client';

import React, { ReactNode } from 'react';

interface MobileLayoutProps {
  children: ReactNode;
  className?: string;
}

export const MobileLayout: React.FC<MobileLayoutProps> = ({ 
  children, 
  className = "" 
}) => {
  return (
    <div className="min-h-screen-mobile bg-gradient-to-br from-surface-50 to-secondary-50">
      <div className={`mobile-container safe-area-inset ${className}`}>
        <div className="pt-safe pb-safe min-h-screen-mobile">
          {children}
        </div>
      </div>
    </div>
  );
};