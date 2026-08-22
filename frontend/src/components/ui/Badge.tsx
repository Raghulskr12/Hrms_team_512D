import React from 'react';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'success' | 'danger' | 'warning' | 'info' | 'purple' | 'neutral';
  size?: 'sm' | 'md';
}

export const Badge: React.FC<BadgeProps> = ({ children, variant = 'neutral', size = 'sm' }) => {
  const styles = {
    success: 'bg-emerald-950/70 text-emerald-400 border-emerald-800/60',
    danger: 'bg-rose-950/70 text-rose-400 border-rose-800/60',
    warning: 'bg-amber-950/70 text-amber-400 border-amber-800/60',
    info: 'bg-sky-950/70 text-sky-400 border-sky-800/60',
    purple: 'bg-purple-950/70 text-purple-400 border-purple-800/60',
    neutral: 'bg-slate-800/70 text-slate-400 border-slate-700/60',
  };

  const sizes = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2.5 py-1 text-xs font-semibold',
  };

  return (
    <span className={`inline-flex items-center font-medium rounded-full border ${styles[variant]} ${sizes[size]}`}>
      {children}
    </span>
  );
};
