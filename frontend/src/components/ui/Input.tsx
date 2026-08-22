import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, helperText, className = '', id, ...props }, ref) => {
    const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

    return (
      <div className="w-full space-y-1.5">
        {label && (
          <label htmlFor={inputId} className="block text-xs font-semibold text-slate-600 dark:text-slate-300">
            {label}
          </label>
        )}
        <input
          id={inputId}
          ref={ref}
          className={`w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border text-slate-850 dark:text-slate-100 placeholder-slate-405 dark:placeholder-slate-500 rounded-xl text-sm transition-all focus:outline-none focus:ring-2 focus:ring-purple-500/20 ${
            error ? 'border-rose-450 dark:border-rose-500 focus:border-rose-500' : 'border-slate-200 dark:border-slate-800/80 focus:border-purple-500 dark:focus:border-purple-500'
          } ${className}`}
          {...props}
        />
        {error && <p className="text-xs text-rose-500 dark:text-rose-400 font-medium">{error}</p>}
        {helperText && !error && <p className="text-xs text-slate-400 dark:text-slate-500">{helperText}</p>}
      </div>
    );
  }
);

Input.displayName = 'Input';
