import React from 'react';

interface ProgressBarProps {
  progress: number;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({ progress }) => {
  const safeProgress = Math.min(100, Math.max(0, progress));
  const isActive = progress > 0 && progress < 100;
  return (
    <div className="w-full bg-slate-200/20 dark:bg-slate-700/50 rounded-full h-2.5">
      <div
        className={`bg-gradient-to-r from-sky-500 to-cyan-400 h-2.5 rounded-full transition-all duration-500 ease-out ${isActive ? 'animate-pulse' : ''}`}
        style={{ width: `${safeProgress}%` }}
      ></div>
    </div>
  );
};