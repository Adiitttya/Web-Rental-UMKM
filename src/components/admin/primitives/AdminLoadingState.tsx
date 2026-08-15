'use client';

import React from 'react';

export interface AdminLoadingStateProps {
  message?: string;
  rows?: number;
}

export const AdminLoadingState: React.FC<AdminLoadingStateProps> = ({
  message = 'Memuat data sistem...',
  rows = 4,
}) => {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4 animate-pulse">
      <div className="flex items-center justify-between border-b border-slate-100 pb-4">
        <div className="h-4 bg-slate-200 rounded w-1/4"></div>
        <div className="h-4 bg-slate-200 rounded w-16"></div>
      </div>

      <div className="space-y-3">
        {Array.from({ length: rows }).map((_, idx) => (
          <div key={idx} className="flex items-center gap-4">
            <div className="w-10 h-10 bg-slate-100 rounded-xl shrink-0"></div>
            <div className="flex-1 space-y-1.5">
              <div className="h-3.5 bg-slate-100 rounded w-3/4"></div>
              <div className="h-2.5 bg-slate-100 rounded w-1/2"></div>
            </div>
            <div className="w-16 h-6 bg-slate-100 rounded-lg shrink-0"></div>
          </div>
        ))}
      </div>

      <div className="pt-2 text-center text-xs font-bold text-slate-400">
        {message}
      </div>
    </div>
  );
};
