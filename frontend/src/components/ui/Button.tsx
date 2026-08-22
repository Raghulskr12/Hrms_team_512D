import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'danger' | 'ghost' | 'success' | 'glow';
  size?: 'xs' | 'sm' | 'md' | 'lg';
  isLoading?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  className = '',
  disabled,
  ...props
}) => {
  const baseStyles =
    'inline-flex items-center justify-center font-semibold transition-all duration-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/30 disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden';

  const variants = {
    primary:
      'bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-violet-500 text-white shadow-lg shadow-indigo-600/20 hover:shadow-indigo-500/35 hover:-translate-y-0.5',
    secondary:
      'bg-[#131D36] hover:bg-[#1A2540] text-[#CBD5E1] border border-[#1E2D4A] hover:border-indigo-500/30',
    outline:
      'bg-transparent border border-[#1E2D4A] hover:border-indigo-500/40 hover:bg-indigo-500/5 text-[#94A3B8] hover:text-[#E8EDFF]',
    danger:
      'bg-gradient-to-r from-rose-600 to-rose-500 hover:from-rose-500 hover:to-pink-500 text-white shadow-lg shadow-rose-600/20 hover:shadow-rose-500/30 hover:-translate-y-0.5',
    ghost:
      'bg-transparent hover:bg-[#131D36] text-[#64748B] hover:text-[#E8EDFF]',
    success:
      'bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-teal-500 text-white shadow-lg shadow-emerald-600/20 hover:shadow-emerald-500/30 hover:-translate-y-0.5',
    glow:
      'bg-gradient-to-r from-indigo-600 via-violet-600 to-indigo-600 text-white shadow-xl shadow-indigo-500/30 hover:shadow-indigo-500/50 hover:-translate-y-0.5 glow-indigo-sm',
  };

  const sizes = {
    xs: 'px-2 py-1 text-[11px]',
    sm: 'px-3 py-1.5 text-xs',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base',
  };

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <>
          <svg className="animate-spin -ml-1 mr-2 h-3.5 w-3.5 text-current" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
          Loading...
        </>
      ) : (
        children
      )}
    </button>
  );
};
