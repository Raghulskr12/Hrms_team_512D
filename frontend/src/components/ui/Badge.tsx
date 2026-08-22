import React from 'react';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'success' | 'danger' | 'warning' | 'info' | 'purple' | 'neutral' | 'indigo';
  size?: 'sm' | 'md';
}

export const Badge: React.FC<BadgeProps> = ({ children, variant = 'neutral', size = 'sm' }) => {
  const styles: Record<string, React.CSSProperties> = {
    success: {
      background: 'rgba(16, 185, 129, 0.1)',
      color: '#10B981',
      border: '1px solid rgba(16, 185, 129, 0.2)',
    },
    danger: {
      background: 'rgba(244, 63, 94, 0.1)',
      color: '#F43F5E',
      border: '1px solid rgba(244, 63, 94, 0.2)',
    },
    warning: {
      background: 'rgba(245, 158, 11, 0.1)',
      color: '#F59E0B',
      border: '1px solid rgba(245, 158, 11, 0.2)',
    },
    info: {
      background: 'rgba(14, 165, 233, 0.1)',
      color: '#0EA5E9',
      border: '1px solid rgba(14, 165, 233, 0.2)',
    },
    purple: {
      background: 'rgba(139, 92, 246, 0.1)',
      color: '#8B5CF6',
      border: '1px solid rgba(139, 92, 246, 0.2)',
    },
    neutral: {
      background: 'rgba(100, 116, 139, 0.1)',
      color: '#94A3B8',
      border: '1px solid rgba(100, 116, 139, 0.2)',
    },
    indigo: {
      background: 'rgba(99, 102, 241, 0.1)',
      color: '#818CF8',
      border: '1px solid rgba(99, 102, 241, 0.2)',
    },
  };

  const sizeClass = size === 'sm' ? 'px-2 py-0.5 text-[10px]' : 'px-2.5 py-1 text-xs';

  return (
    <span
      className={`inline-flex items-center font-semibold rounded-full ${sizeClass}`}
      style={styles[variant] || styles.neutral}
    >
      {children}
    </span>
  );
};
