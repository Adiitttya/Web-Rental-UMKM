'use client';

import React, { useEffect, useState } from 'react';

interface HealthData {
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
    };
    storage: {
      status: string;
    };
  };
}

export const WebsiteStatus: React.FC = () => {
  const [health, setHealth] = useState<HealthData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchHealth = async () => {
    try {
      const res = await fetch('/api/health');
      const data = await res.json();
      setHealth(data);
    } catch {
      setHealth({
        status: 'degraded',
        timestamp: new Date().toISOString(),
        services: {
          web: { status: 'online', uptime: 0 },
          database: { status: 'Error', latencyMs: 0 },
          storage: { status: 'disconnected' },
        },
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchHealth();
    const interval = setInterval(fetchHealth, 30000);
    return () => clearInterval(interval);
  }, []);

  const formatUptime = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    return `${hrs}j ${mins}m`;
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 space-y-4">
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <div>
          <h3 className="text-sm font-extrabold text-slate-900">Status Infrastruktur & Layanan</h3>
          <p className="text-[11px] text-slate-500 font-medium mt-0.5">
            Metrik operasional real-time aplikasi web, database, dan media storage.
          </p>
        </div>
        <button
          onClick={fetchHealth}
          className="text-xs font-bold text-slate-400 hover:text-slate-700 flex items-center gap-1 cursor-pointer"
          title="Perbarui Status"
        >
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          <span>Refresh</span>
        </button>
      </div>

      {isLoading ? (
        <div className="p-6 text-center text-xs font-bold text-slate-400 animate-pulse">
          Memeriksa kesehatan sistem...
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {/* Web App Status */}
          <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
            <div>
              <div className="text-[11px] font-bold text-slate-500">Aplikasi Web</div>
              <div className="text-xs font-extrabold text-slate-800 mt-0.5">
                Uptime: {health ? formatUptime(health.services.web.uptime) : '-'}
              </div>
            </div>
            <span className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-emerald-50 text-emerald-600 text-[10px] font-black uppercase border border-emerald-200">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              Online
            </span>
          </div>

          {/* Database Status */}
          <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
            <div>
              <div className="text-[11px] font-bold text-slate-500">PostgreSQL Database</div>
              <div className="text-xs font-extrabold text-slate-800 mt-0.5">
                Latensi: {health?.services.database.latencyMs} ms
              </div>
            </div>
            <span
              className={`flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] font-black uppercase border ${
                health?.services.database.status === 'Connected'
                  ? 'bg-emerald-50 text-emerald-600 border-emerald-200'
                  : 'bg-rose-50 text-rose-600 border-rose-200'
              }`}
            >
              <span
                className={`w-1.5 h-1.5 rounded-full ${
                  health?.services.database.status === 'Connected' ? 'bg-emerald-500' : 'bg-rose-500'
                }`}
              />
              {health?.services.database.status || 'Checking'}
            </span>
          </div>

          {/* Media Storage Status */}
          <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
            <div>
              <div className="text-[11px] font-bold text-slate-500">Media Storage</div>
              <div className="text-xs font-extrabold text-slate-800 mt-0.5">Static / Supabase</div>
            </div>
            <span className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-emerald-50 text-emerald-600 text-[10px] font-black uppercase border border-emerald-200">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              Connected
            </span>
          </div>
        </div>
      )}
    </div>
  );
};
