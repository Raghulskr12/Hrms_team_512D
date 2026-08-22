import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  style?: React.CSSProperties;
}

export const Card: React.FC<CardProps> = ({ children, className = '', onClick, style }) => (
  <div
    onClick={onClick}
    className={`rounded-2xl p-5 transition-all duration-200 ${onClick ? 'cursor-pointer hover-lift' : ''} ${className}`}
    style={{
      background: 'var(--bg-surface)',
      border: '1px solid var(--border)',
      ...style,
    }}
  >
    {children}
  </div>
);

export const GlassCard: React.FC<{ children: React.ReactNode; className?: string; style?: React.CSSProperties }> = ({ children, className = '', style }) => (
  <div
    className={`glass-dark rounded-2xl p-5 ${className}`}
    style={style}
  >
    {children}
  </div>
);

export const CardHeader: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = '' }) => (
  <div
    className={`flex items-center justify-between pb-4 mb-4 ${className}`}
    style={{ borderBottom: '1px solid var(--border)' }}
  >
    {children}
  </div>
);

export const CardTitle: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = '' }) => (
  <h3 className={`text-sm font-bold ${className}`} style={{ color: 'var(--text-primary)' }}>
    {children}
  </h3>
);
