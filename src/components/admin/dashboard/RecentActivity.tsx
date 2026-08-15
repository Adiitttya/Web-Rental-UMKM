'use client';

import React from 'react';
import Link from 'next/link';

export interface ActivityItem {
  id: string;
  action: string;
  entityName: string;
  entityId?: string | null;
  createdAt: Date | string;
  user?: {
    name: string;
    email: string;
  } | null;
}

export interface RecentActivityProps {
  activities: ActivityItem[];
}

export const RecentActivity: React.FC<RecentActivityProps> = ({ activities }) => {
  const formatTime = (date: Date | string) => {
    const d = new Date(date);
    return d.toLocaleString('id-ID', {
      day: '2-digit',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getActionColor = (action: string) => {
    const act = action.toUpperCase();
    if (act.includes('CREATE') || act.includes('TAMBAH') || act.includes('PUBLISH')) {
      return 'bg-emerald-50 text-emerald-600 border-emerald-200';
    }
    if (act.includes('DELETE') || act.includes('HAPUS')) {
      return 'bg-rose-50 text-rose-600 border-rose-200';
    }
    return 'bg-blue-50 text-[var(--primary)] border-blue-200';
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 space-y-4">
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <div>
          <h3 className="text-sm font-extrabold text-slate-900">Aktivitas Administratif Terkini</h3>
          <p className="text-[11px] text-slate-500 font-medium mt-0.5">
            Audit trail dari pembaruan, perubahan konten, dan aksi sistem admin.
          </p>
        </div>
        <Link
          href="/admin/logs/activity"
          className="text-xs font-extrabold text-[var(--primary)] hover:underline"
        >
          Lihat Semua
        </Link>
      </div>

      {activities.length === 0 ? (
        <div className="p-6 text-center text-xs font-semibold text-slate-400">
          Belum ada rekaman aktivitas administratif.
        </div>
      ) : (
        <div className="divide-y divide-slate-100 space-y-2">
          {activities.map((item) => (
            <div key={item.id} className="pt-2 flex items-start justify-between gap-3">
              <div className="flex items-start gap-2.5 min-w-0">
                <span
                  className={`px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider shrink-0 border mt-0.5 ${getActionColor(
                    item.action
                  )}`}
                >
                  {item.action}
                </span>
                <div className="min-w-0">
                  <div className="text-xs font-extrabold text-slate-800 truncate">
                    {item.entityName} {item.entityId ? `#${item.entityId.slice(0, 6)}` : ''}
                  </div>
                  <div className="text-[11px] text-slate-500 font-medium truncate">
                    Oleh: {item.user?.name || 'Administrator'} ({item.user?.email || 'System'})
                  </div>
                </div>
              </div>

              <span className="text-[10px] font-bold text-slate-400 shrink-0">
                {formatTime(item.createdAt)}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
