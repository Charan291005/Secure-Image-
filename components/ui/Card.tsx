import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
}

export const Card: React.FC<CardProps> = ({ children, className }) => {
  return (
    <div className={`bg-white/60 dark:bg-slate-900/60 backdrop-blur-3xl rounded-2xl shadow-2xl shadow-slate-500/10 dark:shadow-black/50 border border-black/10 dark:border-white/10 overflow-hidden ${className}`}>
      {children}
    </div>
  );
};