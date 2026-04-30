import React from 'react';

interface MobileContainerProps {
  children: React.ReactNode;
  className?: string;
}

export function MobileContainer({ children, className = '' }: MobileContainerProps) {
  return (
    <div className={`max-w-[430px] w-full mx-auto min-h-screen bg-white shadow-2xl relative flex flex-col ${className}`}>
      {children}
    </div>
  );
}
