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
          <label htmlFor={inputId} className="block text-xs font-semibold text-[#94A3B8]">
            {label}
          </label>
        )}
        <input
          id={inputId}
          ref={ref}
          className={`w-full px-4 py-2.5 text-sm text-[#E8EDFF] placeholder-[#374151] rounded-xl transition-all focus:outline-none ${className}`}
          style={{
            background: 'rgba(15, 22, 41, 0.8)',
            border: error ? '1px solid rgba(244, 63, 94, 0.5)' : '1px solid rgba(30, 45, 74, 0.9)',
          }}
          onFocus={(e) => {
            if (!error) {
              e.currentTarget.style.borderColor = 'rgba(99, 102, 241, 0.6)';
              e.currentTarget.style.boxShadow = '0 0 0 3px rgba(99, 102, 241, 0.1)';
            }
            props.onFocus?.(e);
          }}
          onBlur={(e) => {
            if (!error) {
              e.currentTarget.style.borderColor = 'rgba(30, 45, 74, 0.9)';
              e.currentTarget.style.boxShadow = 'none';
            }
            props.onBlur?.(e);
          }}
          {...props}
        />
        {error && <p className="text-xs font-medium" style={{ color: '#F43F5E' }}>{error}</p>}
        {helperText && !error && <p className="text-xs" style={{ color: '#64748B' }}>{helperText}</p>}
      </div>
    );
  }
);

Input.displayName = 'Input';
