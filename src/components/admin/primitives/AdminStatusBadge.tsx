'use client';

import React from 'react';

export type StatusVariant =
  | 'success'
  | 'warning'
  | 'danger'
  | 'info'
  | 'neutral';

export interface AdminStatusBadgeProps {
  status: string;
  variant?: StatusVariant;
  dot?: boolean;
}

export const AdminStatusBadge: React.FC<AdminStatusBadgeProps> = ({
  status,
  variant = 'neutral',
  dot = true,
}) => {
  const getStyles = () => {
    switch (variant) {
      case 'success':
        return {
          container: 'bg-emerald-50 text-emerald-700 border-emerald-200',
          dot: 'bg-emerald-500',
        };
      case 'warning':
        return {
          container: 'bg-amber-50 text-amber-700 border-amber-200',
          dot: 'bg-amber-500',
        };
      case 'danger':
        return {
          container: 'bg-rose-50 text-rose-700 border-rose-200',
          dot: 'bg-rose-500',
        };
      case 'info':
        return {
          container: 'bg-blue-50 text-blue-700 border-blue-200',
          dot: 'bg-blue-500',
        };
      case 'neutral':
      default:
        return {
          container: 'bg-slate-100 text-slate-700 border-slate-200',
          dot: 'bg-slate-400',
        };
    }
  };

  const styles = getStyles();

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-extrabold tracking-wide uppercase border ${styles.container}`}
    >
      {dot && <span className={`w-1.5 h-1.5 rounded-full ${styles.dot}`} />}
      <span>{status}</span>
    </span>
  );
};
