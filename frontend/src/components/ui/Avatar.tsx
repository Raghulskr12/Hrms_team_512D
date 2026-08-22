import React from 'react';

interface AvatarProps {
  name: string;
  src?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

export const Avatar: React.FC<AvatarProps> = ({ name, src, size = 'md', className = '' }) => {
  const getInitials = (fullName: string) => {
    if (!fullName) return 'DF';
    const parts = fullName.trim().split(' ');
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  };

  const sizes = {
    sm: 'w-8 h-8 text-xs',
    md: 'w-10 h-10 text-sm',
    lg: 'w-14 h-14 text-base font-semibold',
    xl: 'w-20 h-20 text-xl font-bold',
  };

  return (
    <div className={`relative inline-flex items-center justify-center rounded-full overflow-hidden shrink-0 ${sizes[size]} ${className}`}>
      {src ? (
        <img src={src} alt={name} className="w-full h-full object-cover" />
      ) : (
        <div className="w-full h-full bg-gradient-to-br from-purple-600 to-indigo-800 text-white flex items-center justify-center font-medium">
          {getInitials(name)}
        </div>
      )}
    </div>
  );
};
