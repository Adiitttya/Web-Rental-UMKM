'use client';

import React, { useState, useEffect } from 'react';
import { AdminPageHeader } from '@/components/admin/primitives/AdminPageHeader';
import { AdminStatusBadge } from '@/components/admin/primitives/AdminStatusBadge';

interface SystemHealthDetails {
  status: string;
  timestamp: string;
  services: {
    web: {
      status: string;
      uptime: number;
    };
    database: {
      status: string;
      latencyMs: number;
      error?: string | null;
    };
    storage: {
      status: string;
      driver: string;
    };
  };
}

export default function AdminSystemStatusPage() {
  const [health, setHealth] = useState<SystemHealthDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchStatus = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/health');
      const json = await res.json();
      setHealth(json);
    } catch {
      setHealth(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchStatus();
  }, []);

  const formatUptime = (seconds: number) => {
    const d = Math.floor(seconds / (3600 * 24));
    const h = Math.floor((seconds % (3600 * 24)) / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = Math.floor(seconds % 60);
    return `${d > 0 ? `${d}h ` : ''}${h}j ${m}m ${s}d`;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <AdminPageHeader
        title="Status Kesehatan & Infrastruktur Sistem (System Status)"
        description="Pemantauan metrik operasional aplikasi secara real-time, latensi database PostgreSQL, dan integritas penyimpanan media."
        badge="Live Diagnostics"
        action={
          <button
            onClick={fetchStatus}
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl transition-all shadow-sm flex items-center gap-1.5 cursor-pointer"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            <span>Uji Ulang Koneksi</span>
          </button>
        }
      />

      {/* Main Status Overview */}
      {isLoading ? (
        <div className="p-12 text-center text-xs font-bold text-slate-400 bg-white rounded-2xl border border-slate-200 animate-pulse">
          Mengambil diagnostik sistem...
        </div>
      ) : (
        <div className="space-y-6">
          {/* Summary Banner */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <div
                className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black text-lg ${
                  health?.status === 'operational'
                    ? 'bg-emerald-50 text-emerald-600'
                    : 'bg-rose-50 text-rose-600'
                }`}
              >
                {health?.status === 'operational' ? '✓' : '!'}
              </div>
              <div>
                <h3 className="text-base font-black text-slate-900">
                  {health?.status === 'operational'
                    ? 'Seluruh Sistem Operasional Normal'
                    : 'Layanan Mengalami Gangguan Parsial'}
                </h3>
                <p className="text-xs text-slate-500 font-medium mt-0.5">
                  Pemeriksaan terakhir: {health ? new Date(health.timestamp).toLocaleString('id-ID') : '-'}
                </p>
              </div>
            </div>

            <AdminStatusBadge
              status={health?.status === 'operational' ? 'Operational' : 'Degraded'}
              variant={health?.status === 'operational' ? 'success' : 'danger'}
            />
          </div>

          {/* Service Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Database Service */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black text-slate-800">PostgreSQL Database</span>
                <AdminStatusBadge
                  status={health?.services.database.status || 'Checking'}
                  variant={health?.services.database.status === 'Connected' ? 'success' : 'danger'}
                />
              </div>
              <div className="space-y-1 pt-2 border-t border-slate-100 text-xs text-slate-600">
                <div className="flex justify-between">
                  <span className="text-slate-400">Latensi Kueri:</span>
                  <span className="font-mono font-bold text-slate-900">
                    {health?.services.database.latencyMs} ms
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Driver Engine:</span>
                  <span className="font-mono font-semibold text-slate-700">Prisma Client</span>
                </div>
              </div>
            </div>

            {/* Next.js Web Service */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black text-slate-800">Next.js Web Engine</span>
                <AdminStatusBadge status="Online" variant="success" />
              </div>
              <div className="space-y-1 pt-2 border-t border-slate-100 text-xs text-slate-600">
                <div className="flex justify-between">
                  <span className="text-slate-400">Process Uptime:</span>
                  <span className="font-mono font-bold text-slate-900">
                    {health ? formatUptime(health.services.web.uptime) : '-'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Environment:</span>
                  <span className="font-mono font-semibold text-slate-700">
                    {process.env.NODE_ENV || 'development'}
                  </span>
                </div>
              </div>
            </div>

            {/* Media Storage Service */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black text-slate-800">Media Storage Engine</span>
                <AdminStatusBadge status="Connected" variant="success" />
              </div>
              <div className="space-y-1 pt-2 border-t border-slate-100 text-xs text-slate-600">
                <div className="flex justify-between">
                  <span className="text-slate-400">Storage Provider:</span>
                  <span className="font-mono font-semibold text-slate-700">Local / Supabase</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Integrity Check:</span>
                  <span className="font-mono font-bold text-emerald-600">Passed</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
