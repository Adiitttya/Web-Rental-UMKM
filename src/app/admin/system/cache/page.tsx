'use client';

import React, { useState } from 'react';
import { Toast } from '@/components/feedback/Toast';
import { AdminPageHeader } from '@/components/admin/primitives/AdminPageHeader';

interface RevalidateTarget {
  name: string;
  path: string;
  description: string;
}

const targets: RevalidateTarget[] = [
  {
    name: 'Seluruh Aplikasi (Full Site Cache)',
    path: 'ALL',
    description: 'Bersihkan seluruh cache layout dan halaman publik secara komprehensif.',
  },
  {
    name: 'Beranda Utama (Landing Page)',
    path: '/',
    description: 'Perbarui cache Hero, Featured Games, Quick Pricing, dan Call to Action.',
  },
  {
    name: 'Katalog Hardware & Game',
    path: '/list-game',
    description: 'Perbarui cache daftar inventaris konsol, simulator rig, dan judul game.',
  },
  {
    name: 'Pricelist & Paket Tarif',
    path: '/pricing',
    description: 'Perbarui cache daftar harga sewa per jam dan paket malam.',
  },
  {
    name: 'Turnamen & Events',
    path: '/event',
    description: 'Perbarui cache jadwal turnamen e-sports dan kompetisi aktif.',
  },
  {
    name: 'Dokumentasi Galeri',
    path: '/gallery',
    description: 'Perbarui cache foto dokumentasi ruangan dan fasilitas studio.',
  },
  {
    name: 'Lokasi Cabang Studio',
    path: '/location',
    description: 'Perbarui cache peta lokasi dan jam operasional cabang.',
  },
  {
    name: 'Pusat Bantuan FAQ',
    path: '/faq',
    description: 'Perbarui cache pertanyaan umum dan pedoman rental.',
  },
];

export default function AdminCachePage() {
  const [revalidatingPath, setRevalidatingPath] = useState<string | null>(null);
  const [lastPurged, setLastPurged] = useState<Record<string, string>>({});
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const handleRevalidate = async (path: string, name: string) => {
    setRevalidatingPath(path);
    try {
      const res = await fetch('/api/admin/system/revalidate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ path }),
      });
      const json = await res.json();
      if (json.success) {
        setLastPurged((prev) => ({
          ...prev,
          [path]: new Date().toLocaleTimeString('id-ID'),
        }));
        setToast({ type: 'success', message: `${name} berhasil di-revalidasi!` });
      } else {
        setToast({ type: 'error', message: json.message || 'Gagal merevalidasi cache.' });
      }
    } catch {
      setToast({ type: 'error', message: 'Terjadi kesalahan sistem.' });
    } finally {
      setRevalidatingPath(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <AdminPageHeader
        title="Manajemen Cache & Revalidasi ISR (Cache Control)"
        description="Picu pembaruan cache Incremental Static Regeneration (ISR) secara on-demand agar pembaruan data langsung tampil di web publik tanpa perlu re-deploy."
        badge="Cache Pipeline"
      />

      {/* Floating Toast */}
      <Toast
        isVisible={!!toast}
        type={toast?.type}
        message={toast?.message || ''}
        onClose={() => setToast(null)}
      />

      {/* Targets Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {targets.map((target) => {
          const isProcessing = revalidatingPath === target.path;
          return (
            <div
              key={target.path}
              className={`p-5 rounded-2xl border shadow-sm flex flex-col justify-between transition-all ${
                target.path === 'ALL'
                  ? 'bg-gradient-to-r from-blue-50/70 to-slate-50 border-blue-200'
                  : 'bg-white border-slate-200 hover:border-slate-300'
              }`}
            >
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-black text-slate-900">{target.name}</h3>
                  <span className="font-mono text-[10px] text-slate-500 font-bold px-2 py-0.5 rounded bg-slate-100 border border-slate-200">
                    {target.path}
                  </span>
                </div>
                <p className="text-xs text-slate-500 font-medium leading-relaxed">
                  {target.description}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                <span className="text-[10px] font-mono text-slate-400 font-medium">
                  {lastPurged[target.path]
                    ? `Terakhir: ${lastPurged[target.path]}`
                    : 'Siap Revalidasi'}
                </span>

                <button
                  type="button"
                  onClick={() => handleRevalidate(target.path, target.name)}
                  disabled={isProcessing}
                  className={`px-4 py-1.5 rounded-xl text-xs font-extrabold transition-all cursor-pointer shadow-sm disabled:opacity-50 ${
                    target.path === 'ALL'
                      ? 'bg-slate-900 hover:bg-slate-800 text-white'
                      : 'bg-[var(--primary)] hover:opacity-90 text-white'
                  }`}
                >
                  {isProcessing ? 'Merevalidasi...' : 'Revalidate Cache'}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
