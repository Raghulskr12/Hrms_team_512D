import React from 'react';

interface Option {
  value: string;
  label: string;
}

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  options: Option[];
  error?: string;
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, options, error, className = '', id, ...props }, ref) => {
    const selectId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

    return (
      <div className="w-full space-y-1.5">
        {label && (
          <label htmlFor={selectId} className="block text-xs font-semibold" style={{ color: 'var(--text-secondary)' }}>
            {label}
          </label>
        )}
        <select
          id={selectId}
          ref={ref}
          className={`w-full px-3.5 py-2.5 rounded-xl text-xs transition-all focus:outline-none ${className}`}
          style={{
            background: 'var(--bg-elevated)',
            border: error ? '1px solid var(--danger)' : '1px solid var(--border)',
            color: 'var(--text-primary)',
          }}
          onFocus={(e) => {
            if (!error) {
              e.currentTarget.style.borderColor = 'var(--accent)';
              e.currentTarget.style.boxShadow = '0 0 0 3px var(--accent-glow-sm)';
            }
          }}
          onBlur={(e) => {
            if (!error) {
              e.currentTarget.style.borderColor = 'var(--border)';
              e.currentTarget.style.boxShadow = 'none';
            }
          }}
          {...props}
        >
          {options.map((opt) => (
            <option key={opt.value} value={opt.value} style={{ background: 'var(--bg-surface)', color: 'var(--text-primary)' }}>
              {opt.label}
            </option>
          ))}
        </select>
        {error && <p className="text-xs font-medium" style={{ color: 'var(--danger)' }}>{error}</p>}
      </div>
    );
  }
);

Select.displayName = 'Select';
