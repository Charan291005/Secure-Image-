import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  endAdornment?: React.ReactNode;
}

export const Input: React.FC<InputProps> = ({ label, id, endAdornment, ...props }) => {
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-slate-700 dark:text-slate-300">
        {label}
      </label>
      <div className="mt-2 relative">
        <input
          id={id}
          className={`block w-full px-4 py-3 bg-slate-200/40 dark:bg-black/20 text-slate-800 dark:text-slate-100 border border-slate-400/50 dark:border-white/20 rounded-lg shadow-sm placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500 sm:text-sm disabled:opacity-50 transition-all ${endAdornment ? 'pr-10' : ''}`}
          {...props}
        />
        {endAdornment && (
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                {endAdornment}
            </div>
        )}
      </div>
    </div>
  );
};
