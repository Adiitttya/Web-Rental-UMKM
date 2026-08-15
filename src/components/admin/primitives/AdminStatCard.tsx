'use client';

import React from 'react';
import Link from 'next/link';

export interface AdminStatCardProps {
  title: string;
  count: number | string;
  icon: React.ReactNode;
  href?: string;
  description?: string;
  badge?: string;
  badgeType?: 'success' | 'info' | 'warning';
}

export const AdminStatCard: React.FC<AdminStatCardProps> = ({
  title,
  count,
  icon,
  href,
  description,
  badge,
  badgeType = 'info',
}) => {
  const content = (
    <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm hover:border-[var(--primary)]/40 hover:shadow-md transition-all duration-200 flex flex-col justify-between h-full group">
      <div className="flex items-start justify-between">
        <div className="w-10 h-10 rounded-xl bg-blue-50 text-[var(--primary)] flex items-center justify-center shrink-0">
          {icon}
        </div>
        {badge && (
          <span
            className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
              badgeType === 'success'
                ? 'bg-emerald-50 text-emerald-600 border border-emerald-200'
                : badgeType === 'warning'
                ? 'bg-amber-50 text-amber-600 border border-amber-200'
                : 'bg-blue-50 text-blue-600 border border-blue-200'
            }`}
          >
            {badge}
          </span>
        )}
      </div>

      <div className="mt-4">
        <div className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">{count}</div>
        <div className="text-xs font-extrabold text-slate-700 mt-1 group-hover:text-[var(--primary)] transition-colors">
          {title}
        </div>
        {description && <div className="text-[11px] text-slate-400 font-medium mt-0.5">{description}</div>}
      </div>

      {href && (
        <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-slate-500 group-hover:text-[var(--primary)] transition-colors">
          <span>Kelola Modul</span>
          <span className="opacity-0 group-hover:opacity-100 transition-opacity">&rarr;</span>
        </div>
      )}
    </div>
  );

  if (href) {
    return <Link href={href}>{content}</Link>;
  }

  return content;
};
