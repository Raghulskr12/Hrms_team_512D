import React from 'react';

export const LoadingSpinner: React.FC<{ message?: string; size?: 'sm' | 'md' | 'lg' }> = ({
  message = 'Loading...',
  size = 'md',
}) => {
  const sizes = {
    sm: 'w-5 h-5 border-2',
    md: 'w-8 h-8 border-3',
    lg: 'w-12 h-12 border-4',
  };

  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 space-y-3">
      <div
        className={`${sizes[size]} border-purple-500/30 border-t-purple-500 rounded-full animate-spin`}
      />
      {message && <p className="text-sm font-medium text-slate-400 animate-pulse">{message}</p>}
    </div>
  );
};
