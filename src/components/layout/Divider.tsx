import React from 'react';

export const Divider: React.FC<{ className?: string }> = ({ className = '' }) => (
  <hr className={`border-t border-gray-200 dark:border-slate-800 my-4 ${className}`} />
);

export const Spacer: React.FC<{ size?: 4 | 8 | 12 | 16 }> = ({ size = 8 }) => {
  const sizeClasses = {
    4: 'h-4',
    8: 'h-8',
    12: 'h-12',
    16: 'h-16',
  };
  return <div className={sizeClasses[size]} />;
};
