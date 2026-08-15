'use client';

import React, { useState, useEffect } from 'react';
import { AdminPageHeader } from '@/components/admin/primitives/AdminPageHeader';
import { AdminEmptyState } from '@/components/admin/primitives/AdminEmptyState';

interface SessionLog {
  id: string;
  token: string;
  ipAddress?: string | null;
  userAgent?: string | null;
  createdAt: string;
  expiresAt: string;
  user: {
    name: string;
    email: string;
    role: string;
  };
}

export default function AdminLoginLogsPage() {
  const [logs, setLogs] = useState<SessionLog[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchLogs = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/admin/logs/login');
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
  }, []);

  return (
    <div className="space-y-6">
      {/* Header */}
      <AdminPageHeader
        title="Log Riwayat Sesi & Login (Login Logs)"
        description="Audit rekaman otentikasi, alamat IP akses, perangkat yang digunakan, dan masa berlaku sesi pengguna admin."
        badge="Session Audit"
      />

      {/* Main Table Card */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden space-y-4">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <h3 className="text-sm font-extrabold text-slate-900">Rekaman Sesi Login Aktif & Historis</h3>
          <button
            onClick={fetchLogs}
            className="text-xs font-bold text-[var(--primary)] hover:underline cursor-pointer"
          >
            Refresh Log
          </button>
        </div>

        <div className="overflow-x-auto">
          {isLoading ? (
            <div className="p-12 text-center text-xs font-bold text-slate-400 animate-pulse">
              Memuat data audit sesi login...
            </div>
          ) : logs.length === 0 ? (
            <div className="p-8">
              <AdminEmptyState
                title="Belum Ada Log Sesi"
                description="Belum ada riwayat sesi login yang tercatat di basis data."
              />
            </div>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-extrabold text-slate-500 uppercase tracking-wider">
                  <th className="py-3.5 px-4">Pengguna</th>
                  <th className="py-3.5 px-4">Alamat IP</th>
                  <th className="py-3.5 px-4">User Agent / Perangkat</th>
                  <th className="py-3.5 px-4">Waktu Login</th>
                  <th className="py-3.5 px-4">Status Sesi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs font-semibold text-slate-700">
                {logs.map((item) => {
                  const isExpired = new Date(item.expiresAt).getTime() < Date.now();
                  return (
                    <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-4 px-4 font-bold text-slate-900">
                        <div>{item.user.name}</div>
                        <div className="text-[11px] text-slate-400 font-mono font-normal">
                          {item.user.email}
                        </div>
                      </td>
                      <td className="py-4 px-4 font-mono text-[11px] text-slate-600">
                        {item.ipAddress || '127.0.0.1'}
                      </td>
                      <td className="py-4 px-4 text-slate-500 text-[11px] max-w-xs truncate" title={item.userAgent || ''}>
                        {item.userAgent || 'Web Browser / Chrome'}
                      </td>
                      <td className="py-4 px-4 text-slate-500 font-mono text-[11px] whitespace-nowrap">
                        {new Date(item.createdAt).toLocaleString('id-ID', {
                          day: '2-digit',
                          month: 'short',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </td>
                      <td className="py-4 px-4">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-black uppercase ${
                            !isExpired
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : 'bg-slate-100 text-slate-500 border border-slate-200'
                          }`}
                        >
                          {!isExpired ? 'Aktif' : 'Expired'}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
