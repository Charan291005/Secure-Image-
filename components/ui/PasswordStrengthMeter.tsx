import React from 'react';
import type { PasswordStrength } from '../../hooks/usePasswordStrength';

interface PasswordStrengthMeterProps {
  strength: PasswordStrength;
}

const strengthLevels = [
  { text: 'Very Weak', color: 'bg-red-500', textColor: 'text-red-500 dark:text-red-400' },
  { text: 'Weak', color: 'bg-orange-500', textColor: 'text-orange-500 dark:text-orange-400' },
  { text: 'Medium', color: 'bg-yellow-500', textColor: 'text-yellow-500 dark:text-yellow-400' },
  { text: 'Strong', color: 'bg-sky-500', textColor: 'text-sky-500 dark:text-sky-400' },
  { text: 'Very Strong', color: 'bg-emerald-500', textColor: 'text-emerald-500 dark:text-emerald-400' },
];

export const PasswordStrengthMeter: React.FC<PasswordStrengthMeterProps> = ({ strength }) => {
  const level = strengthLevels[strength];

  if (strength === 0 && !level) {
    return null;
  }

  return (
    <div className="mt-2">
      <div className="w-full bg-slate-300/50 dark:bg-slate-700/50 rounded-full h-1.5">
        <div
          className={`h-1.5 rounded-full ${level.color} transition-all duration-300`}
          style={{ width: strength > 0 ? `${(strength + 1) * 20}%` : '5%' }}
        />
      </div>
      <p className={`text-xs mt-1 font-medium ${level.textColor}`}>{level.text}</p>
    </div>
  );
};