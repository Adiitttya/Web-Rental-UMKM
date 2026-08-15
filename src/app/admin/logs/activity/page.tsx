'use client';

import React, { useState, useEffect } from 'react';
import { AdminPageHeader } from '@/components/admin/primitives/AdminPageHeader';
import { AdminEmptyState } from '@/components/admin/primitives/AdminEmptyState';

interface ActivityLogItem {
  id: string;
  action: string;
  entityName: string;
  entityId?: string | null;
  payload?: string | null;
  ipAddress?: string | null;
  createdAt: string;
  user?: {
    name: string;
    email: string;
    role: string;
  } | null;
}

export default function AdminActivityLogsPage() {
  const [logs, setLogs] = useState<ActivityLogItem[]>([]);
  const [search, setSearch] = useState('');
  const [entityFilter, setEntityFilter] = useState('ALL');
  const [isLoading, setIsLoading] = useState(true);

  const fetchLogs = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(
        `/api/admin/logs/activity?search=${encodeURIComponent(search)}&entity=${entityFilter}`
      );
      const json = await res.json();
      if (json.success && Array.isArray(json.data)) {
        setLogs(json.data);
      }
    } catch {
      // Error handling
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, [search, entityFilter]);

  const getActionBadge = (action: string) => {
    const act = action.toUpperCase();
    if (act.includes('TAMBAH') || act.includes('CREATE') || act.includes('UPLOAD')) {
      return 'bg-emerald-50 text-emerald-700 border-emerald-200';
    }
    if (act.includes('HAPUS') || act.includes('DELETE')) {
      return 'bg-rose-50 text-rose-700 border-rose-200';
    }
    return 'bg-blue-50 text-blue-700 border-blue-200';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <AdminPageHeader
        title="Audit Trail Aktivitas Admin (Activity Logs)"
        description="Rekaman kronologis lengkap setiap aksi penambahan, pengubahan, dan penghapusan data CMS oleh seluruh pengguna admin."
        badge="Audit Trail"
      />

      {/* Filter & Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-md">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari aksi, modul, atau detail..."
            className="w-full pl-9 pr-3.5 py-2 rounded-xl border border-slate-300 text-xs font-semibold text-slate-900 focus:outline-none focus:border-[var(--primary)]"
          />
          <svg className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>

        <div className="flex items-center gap-2">
          <select
            value={entityFilter}
            onChange={(e) => setEntityFilter(e.target.value)}
            className="px-3 py-2 rounded-xl border border-slate-300 text-xs font-bold text-slate-800 focus:outline-none focus:border-[var(--primary)] cursor-pointer"
          >
            <option value="ALL">Semua Modul Entitas</option>
            <option value="Event">Event</option>
            <option value="Hardware">Hardware & Game</option>
            <option value="PricingItem">Pricing</option>
            <option value="GalleryPhoto">Gallery</option>
            <option value="Branch">Branch</option>
            <option value="FaqItem">FAQ</option>
            <option value="Testimonial">Testimonial</option>
            <option value="Feedback">Feedback</option>
            <option value="Media">Media</option>
            <option value="SystemSetting">SystemSetting</option>
            <option value="SeoMetadata">SEO</option>
            <option value="User">Admin User</option>
          </select>
        </div>
      </div>

      {/* Main Table Card */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden space-y-4">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <h3 className="text-sm font-extrabold text-slate-900">Rekaman Audit Log</h3>
          <span className="text-xs font-bold text-slate-500">{logs.length} Rekaman</span>
        </div>

        <div className="overflow-x-auto">
          {isLoading ? (
            <div className="p-12 text-center text-xs font-bold text-slate-400 animate-pulse">
              Memuat data audit trail aktivitas...
            </div>
          ) : logs.length === 0 ? (
            <div className="p-8">
              <AdminEmptyState
                title="Belum Ada Log Aktivitas"
                description="Belum ada transaksi aktivitas yang sesuai dengan kriteria pencarian."
              />
            </div>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-extrabold text-slate-500 uppercase tracking-wider">
                  <th className="py-3.5 px-4">Aktor Pengguna</th>
                  <th className="py-3.5 px-4">Jenis Aksi</th>
                  <th className="py-3.5 px-4">Modul Entitas</th>
                  <th className="py-3.5 px-4">Detail Payload</th>
                  <th className="py-3.5 px-4">Waktu</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs font-semibold text-slate-700">
                {logs.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-4 px-4 font-bold text-slate-900">
                      <div>{item.user?.name || 'Administrator'}</div>
                      <div className="text-[11px] text-slate-400 font-mono font-normal">
                        {item.user?.email || 'System Session'}
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <span
                        className={`inline-block px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider border ${getActionBadge(
                          item.action
                        )}`}
                      >
                        {item.action}
                      </span>
                    </td>
                    <td className="py-4 px-4 font-bold text-slate-800">
                      <span>{item.entityName}</span>
                      {item.entityId && (
                        <span className="text-[10px] text-slate-400 font-mono block">
                          #{item.entityId.slice(0, 8)}
                        </span>
                      )}
                    </td>
                    <td className="py-4 px-4 text-slate-500 font-mono text-[11px] max-w-sm truncate" title={item.payload || ''}>
                      {item.payload || '-'}
                    </td>
                    <td className="py-4 px-4 text-slate-500 font-mono text-[11px] whitespace-nowrap">
                      {new Date(item.createdAt).toLocaleString('id-ID', {
                        day: '2-digit',
                        month: 'short',
                        hour: '2-digit',
                        minute: '2-digit',
                        second: '2-digit',
                      })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
