import React from 'react';

interface AvatarProps {
  name: string;
  src?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

export const Avatar: React.FC<AvatarProps> = ({ name, src, size = 'md', className = '' }) => {
  const getInitials = (fullName: string) => {
    if (!fullName) return 'NX';
    const parts = fullName.trim().split(' ');
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  };

  const sizes = {
    sm: 'w-8 h-8 text-xs rounded-lg',
    md: 'w-10 h-10 text-sm rounded-xl',
    lg: 'w-14 h-14 text-base font-semibold rounded-xl',
    xl: 'w-16 h-16 text-xl font-bold rounded-2xl',
  };

  return (
    <div
      className={`relative inline-flex items-center justify-center overflow-hidden shrink-0 ${sizes[size]} ${className}`}
    >
      {src ? (
        <img src={src} alt={name} className="w-full h-full object-cover" />
      ) : (
        <div
          className="w-full h-full text-white flex items-center justify-center font-bold"
          style={{
            background: 'linear-gradient(135deg, #6366F1, #8B5CF6)',
            boxShadow: '0 0 12px rgba(99,102,241,0.3)',
          }}
        >
          {getInitials(name)}
        </div>
      )}
    </div>
  );
};
