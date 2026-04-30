import React from 'react';

interface MobileContainerProps {
  children: React.ReactNode;
  className?: string;
}

export function MobileContainer({ children, className = '' }: MobileContainerProps) {
  return (
    <div 
      className={`max-w-md w-full mx-auto min-h-screen bg-background shadow-2xl border-x border-slate-200 dark:border-slate-800 relative flex flex-col ${className}`}
      style={{ maxWidth: '430px' }}
    >
      {children}
    </div>
  );
}
