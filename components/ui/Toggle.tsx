import React from 'react';

interface ToggleOption {
  value: string;
  label: string;
  icon?: React.ReactNode;
}

interface ToggleProps {
  label: string;
  option1: ToggleOption;
  option2: ToggleOption;
  value: string;
  onChange: (value: string) => void;
}

export const Toggle: React.FC<ToggleProps> = ({ label, option1, option2, value, onChange }) => {
  const isOption1Active = value === option1.value;

  return (
    <div>
      <label className="sr-only">{label}</label>
      <div className="relative flex p-1 bg-slate-200/60 dark:bg-black/20 rounded-lg">
        <div
          className={`absolute top-1 bottom-1 w-1/2 rounded-md bg-gradient-to-r from-sky-500 to-cyan-500 shadow-lg transition-transform duration-300 ease-in-out`}
          style={{ transform: isOption1Active ? 'translateX(0%)' : 'translateX(100%)' }}
        />
        <button
          onClick={() => onChange(option1.value)}
          className={`relative z-10 w-1/2 py-2 px-3 text-sm font-semibold rounded-md flex items-center justify-center transition-colors duration-300 ${isOption1Active ? 'text-white' : 'text-slate-600 dark:text-slate-300 hover:text-slate-800 dark:hover:text-white'}`}
        >
          {option1.icon && <span className="mr-2">{option1.icon}</span>}
          {option1.label}
        </button>
        <button
          onClick={() => onChange(option2.value)}
          className={`relative z-10 w-1/2 py-2 px-3 text-sm font-semibold rounded-md flex items-center justify-center transition-colors duration-300 ${!isOption1Active ? 'text-white' : 'text-slate-600 dark:text-slate-300 hover:text-slate-800 dark:hover:text-white'}`}
        >
          {option2.icon && <span className="mr-2">{option2.icon}</span>}
          {option2.label}
        </button>
      </div>
    </div>
  );
};