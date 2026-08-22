import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

export const Card: React.FC<CardProps> = ({ children, className = '', onClick }) => (
  <div
    onClick={onClick}
    className={`bg-slate-900/90 border border-slate-800 rounded-xl p-5 shadow-sm transition-all ${
      onClick ? 'cursor-pointer hover:border-slate-700 hover:bg-slate-900' : ''
    } ${className}`}
  >
    {children}
  </div>
);

export const CardHeader: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = '' }) => (
  <div className={`flex items-center justify-between pb-3 border-b border-slate-800/80 mb-4 ${className}`}>
    {children}
  </div>
);

export const CardTitle: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = '' }) => (
  <h3 className={`text-base font-semibold text-slate-100 ${className}`}>{children}</h3>
);
