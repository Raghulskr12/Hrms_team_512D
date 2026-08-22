import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  variant?: 'default' | 'glass' | 'gradient' | 'bordered';
}

export const Card: React.FC<CardProps> = ({ children, className = '', onClick, variant = 'default' }) => {
  const variants = {
    default: 'bg-[#0F1629] border border-[#1E2D4A] rounded-2xl shadow-lg',
    glass: 'glass rounded-2xl shadow-xl',
    gradient: 'bg-gradient-to-br from-[#0F1629] to-[#131D36] border border-[#1E2D4A] rounded-2xl shadow-lg',
    bordered: 'bg-[#0F1629] rounded-2xl shadow-lg card-gradient-border',
  };

  return (
    <div
      onClick={onClick}
      className={`p-5 transition-all duration-200 ${variants[variant]} ${
        onClick ? 'cursor-pointer hover-lift hover:border-indigo-500/30' : ''
      } ${className}`}
    >
      {children}
    </div>
  );
};

export const GlassCard: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = '' }) => (
  <div className={`glass rounded-2xl p-5 shadow-xl ${className}`}>
    {children}
  </div>
);

export const CardHeader: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = '' }) => (
  <div className={`flex items-center justify-between pb-4 border-b border-[#1E2D4A] mb-4 ${className}`}>
    {children}
  </div>
);

export const CardTitle: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = '' }) => (
  <h3 className={`text-sm font-bold text-[#E8EDFF] ${className}`}>{children}</h3>
);
