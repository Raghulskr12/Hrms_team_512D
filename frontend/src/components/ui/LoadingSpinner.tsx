import React from 'react';

interface LoadingSpinnerProps {
  message?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  message = 'Loading...',
  size = 'md',
}) => {
  const sizeMap = {
    sm: { wrapper: 'py-8', ring: 'w-8 h-8', text: 'text-xs', logo: 'text-base' },
    md: { wrapper: 'py-16', ring: 'w-12 h-12', text: 'text-sm', logo: 'text-xl' },
    lg: { wrapper: 'min-h-screen', ring: 'w-16 h-16', text: 'text-sm', logo: 'text-2xl' },
  };

  const s = sizeMap[size];

  return (
    <div className={`flex flex-col items-center justify-center ${s.wrapper} bg-[#0A0E1A]`}>
      {/* Logo mark */}
      <div className="mb-6 relative">
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-600 to-violet-600 flex items-center justify-center shadow-xl shadow-indigo-500/30">
          <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
            <path
              d="M14 3L24 8.5V19.5L14 25L4 19.5V8.5L14 3Z"
              stroke="white"
              strokeWidth="1.5"
              strokeLinejoin="round"
              fill="none"
            />
            <circle cx="14" cy="14" r="3.5" fill="white" opacity="0.9" />
            <line x1="14" y1="3" x2="14" y2="10.5" stroke="white" strokeWidth="1.5" opacity="0.5" />
            <line x1="14" y1="17.5" x2="14" y2="25" stroke="white" strokeWidth="1.5" opacity="0.5" />
            <line x1="4" y1="8.5" x2="10.5" y2="12" stroke="white" strokeWidth="1.5" opacity="0.5" />
            <line x1="17.5" y1="16" x2="24" y2="19.5" stroke="white" strokeWidth="1.5" opacity="0.5" />
            <line x1="24" y1="8.5" x2="17.5" y2="12" stroke="white" strokeWidth="1.5" opacity="0.5" />
            <line x1="10.5" y1="16" x2="4" y2="19.5" stroke="white" strokeWidth="1.5" opacity="0.5" />
          </svg>
        </div>

        {/* Spinning ring */}
        <div className={`absolute -inset-2 ${s.ring} rounded-full`}>
          <svg className="animate-spin w-full h-full" viewBox="0 0 60 60">
            <circle
              cx="30"
              cy="30"
              r="26"
              fill="none"
              stroke="url(#spinGrad)"
              strokeWidth="2"
              strokeLinecap="round"
              strokeDasharray="60 100"
            />
            <defs>
              <linearGradient id="spinGrad" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#6366F1" />
                <stop offset="100%" stopColor="#0EA5E9" stopOpacity="0" />
              </linearGradient>
            </defs>
          </svg>
        </div>
      </div>

      {/* Brand name */}
      <p className={`font-bold tracking-tight gradient-brand-text ${s.logo} mb-2`}>
        NexusHR
      </p>

      {/* Message */}
      <p className={`${s.text} text-[#64748B] font-medium`}>{message}</p>

      {/* Dots */}
      <div className="flex gap-1.5 mt-4">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="w-1.5 h-1.5 rounded-full bg-indigo-500"
            style={{
              animation: 'dotPulse 1.4s ease-in-out infinite',
              animationDelay: `${i * 0.2}s`,
            }}
          />
        ))}
      </div>
    </div>
  );
};
