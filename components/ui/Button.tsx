import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger';
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({ variant = 'primary', children, className, ...props }) => {
  const baseClasses = "inline-flex items-center justify-center px-5 py-2.5 border text-base font-semibold rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 ease-in-out transform hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98]";

  const variantClasses = {
    primary: 'text-white bg-sky-600 border-transparent bg-gradient-to-r from-sky-500 to-cyan-400 hover:shadow-lg hover:shadow-cyan-500/40 focus:ring-sky-500',
    secondary: 'text-slate-200 bg-white/10 hover:bg-white/20 border-white/20 focus:ring-sky-500 hover:shadow-md hover:shadow-sky-500/20',
    danger: 'text-white bg-red-600 hover:bg-red-700 border-transparent focus:ring-red-500 hover:shadow-lg hover:shadow-red-500/40',
  };

  return (
    <button
      className={`${baseClasses} ${variantClasses[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};