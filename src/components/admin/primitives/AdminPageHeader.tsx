'use client';

import React from 'react';

export interface AdminPageHeaderProps {
  title: string;
  description?: string;
  badge?: string;
  action?: React.ReactNode;
}

export const AdminPageHeader: React.FC<AdminPageHeaderProps> = ({
  title,
  description,
  badge,
  action,
}) => {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 sm:p-6 rounded-2xl border border-slate-200 shadow-sm">
      <div className="space-y-1">
        <div className="flex items-center gap-2.5 flex-wrap">
          <h1 className="text-xl sm:text-2xl font-black text-slate-800 tracking-tight">{title}</h1>
          {badge && (
            <span className="px-2.5 py-0.5 rounded-md bg-blue-50 text-[var(--primary)] font-extrabold text-[10px] tracking-wider uppercase border border-blue-100">
              {badge}
            </span>
          )}
        </div>
        {description && (
          <p className="text-xs text-slate-500 font-medium max-w-2xl leading-relaxed">
            {description}
          </p>
        )}
      </div>

      {action && <div className="shrink-0 flex items-center gap-2">{action}</div>}
    </div>
  );
};
