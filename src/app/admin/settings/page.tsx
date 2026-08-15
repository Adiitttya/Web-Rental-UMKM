'use client';

import React, { useState, useEffect } from 'react';
import { Toast } from '@/components/feedback/Toast';
import { AdminPageHeader } from '@/components/admin/primitives/AdminPageHeader';

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<Record<string, string>>({
    site_name: 'DsterGame Studio',
    contact_phone: '085172412206',
    contact_whatsapp: '6285172412206',
    contact_instagram: '@dster.game',
    contact_email: 'admin@dstergame.com',
    contact_address: 'Jl. Gedongsongo No. 17, Ungaran Barat, Kab. Semarang',
    default_language: 'id',
    timezone: 'Asia/Jakarta (WIB)',
  });

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  useEffect(() => {
    fetch('/api/admin/settings')
      .then((res) => res.json())
      .then((data) => {
        if (data.success && Array.isArray(data.data)) {
          const map: Record<string, string> = {};
          data.data.forEach((s: { key: string; value: string }) => {
            map[s.key] = s.value;
          });
          setSettings((prev) => ({ ...prev, ...map }));
        }
      })
      .catch(() => null)
      .finally(() => setIsLoading(false));
  }, []);

  const handleChange = (key: string, value: string) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  const handleSaveField = async (key: string, label: string) => {
    setIsSaving(true);
    try {
      const res = await fetch('/api/admin/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ settings: { [key]: settings[key] } }),
      });

      const data = await res.json();
      if (data.success) {
        setToast({ type: 'success', message: `${label} berhasil diperbarui.` });
      } else {
        setToast({ type: 'error', message: data.message || 'Gagal menyimpan pengaturan.' });
      }
    } catch {
      setToast({ type: 'error', message: 'Terjadi kesalahan sistem.' });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <AdminPageHeader
        title="Pengaturan Umum Situs (General Settings)"
        description="Konfigurasi parameter global aplikasi web, kontak resmi, bahasa standar, dan zona waktu operasional."
        badge="System Config"
      />

      {/* Floating Toast */}
      <Toast
        isVisible={!!toast}
        type={toast?.type}
        message={toast?.message || ''}
        onClose={() => setToast(null)}
      />

      {isLoading ? (
        <div className="p-12 text-center text-xs font-bold text-slate-400 bg-white rounded-2xl border border-slate-200 animate-pulse">
          Memuat pengaturan sistem...
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-6">
          <div className="border-b border-slate-100 pb-3">
            <h3 className="text-sm font-extrabold text-slate-900">Parameter Dasar Website</h3>
            <p className="text-xs text-slate-500 font-medium mt-0.5">
              Setiap perubahan bidang dapat disimpan langsung secara instan.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {/* Site Name */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">Nama Website (Site Name)</label>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={settings.site_name || ''}
                  onChange={(e) => handleChange('site_name', e.target.value)}
                  className="flex-1 px-3.5 py-2.5 rounded-xl border border-slate-300 font-semibold text-xs text-slate-900 focus:outline-none focus:border-[var(--primary)]"
                />
                <button
                  type="button"
                  onClick={() => handleSaveField('site_name', 'Nama Website')}
                  disabled={isSaving}
                  className="px-4 py-2.5 bg-[var(--primary)] hover:opacity-90 text-white font-extrabold text-xs rounded-xl transition-all shadow-sm shrink-0 cursor-pointer disabled:opacity-50"
                >
                  Simpan
                </button>
              </div>
            </div>

            {/* Official WhatsApp */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">Official WhatsApp (628xxx)</label>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={settings.contact_whatsapp || ''}
                  onChange={(e) => handleChange('contact_whatsapp', e.target.value)}
                  className="flex-1 px-3.5 py-2.5 rounded-xl border border-slate-300 font-mono text-xs text-slate-900 focus:outline-none focus:border-[var(--primary)]"
                />
                <button
                  type="button"
                  onClick={() => handleSaveField('contact_whatsapp', 'Nomor WhatsApp')}
                  disabled={isSaving}
                  className="px-4 py-2.5 bg-[var(--primary)] hover:opacity-90 text-white font-extrabold text-xs rounded-xl transition-all shadow-sm shrink-0 cursor-pointer disabled:opacity-50"
                >
                  Simpan
                </button>
              </div>
            </div>

            {/* Phone */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">Nomor Telepon Hotline</label>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={settings.contact_phone || ''}
                  onChange={(e) => handleChange('contact_phone', e.target.value)}
                  className="flex-1 px-3.5 py-2.5 rounded-xl border border-slate-300 font-mono text-xs text-slate-900 focus:outline-none focus:border-[var(--primary)]"
                />
                <button
                  type="button"
                  onClick={() => handleSaveField('contact_phone', 'Nomor Telepon')}
                  disabled={isSaving}
                  className="px-4 py-2.5 bg-[var(--primary)] hover:opacity-90 text-white font-extrabold text-xs rounded-xl transition-all shadow-sm shrink-0 cursor-pointer disabled:opacity-50"
                >
                  Simpan
                </button>
              </div>
            </div>

            {/* Instagram */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">Instagram Handle</label>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={settings.contact_instagram || ''}
                  onChange={(e) => handleChange('contact_instagram', e.target.value)}
                  className="flex-1 px-3.5 py-2.5 rounded-xl border border-slate-300 font-semibold text-xs text-slate-900 focus:outline-none focus:border-[var(--primary)]"
                />
                <button
                  type="button"
                  onClick={() => handleSaveField('contact_instagram', 'Instagram Handle')}
                  disabled={isSaving}
                  className="px-4 py-2.5 bg-[var(--primary)] hover:opacity-90 text-white font-extrabold text-xs rounded-xl transition-all shadow-sm shrink-0 cursor-pointer disabled:opacity-50"
                >
                  Simpan
                </button>
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">Official Email</label>
              <div className="flex items-center gap-2">
                <input
                  type="email"
                  value={settings.contact_email || ''}
                  onChange={(e) => handleChange('contact_email', e.target.value)}
                  className="flex-1 px-3.5 py-2.5 rounded-xl border border-slate-300 font-semibold text-xs text-slate-900 focus:outline-none focus:border-[var(--primary)]"
                />
                <button
                  type="button"
                  onClick={() => handleSaveField('contact_email', 'Official Email')}
                  disabled={isSaving}
                  className="px-4 py-2.5 bg-[var(--primary)] hover:opacity-90 text-white font-extrabold text-xs rounded-xl transition-all shadow-sm shrink-0 cursor-pointer disabled:opacity-50"
                >
                  Simpan
                </button>
              </div>
            </div>

            {/* Timezone */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">Zona Waktu Sistem</label>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={settings.timezone || 'Asia/Jakarta (WIB)'}
                  onChange={(e) => handleChange('timezone', e.target.value)}
                  className="flex-1 px-3.5 py-2.5 rounded-xl border border-slate-300 font-semibold text-xs text-slate-900 focus:outline-none focus:border-[var(--primary)]"
                />
                <button
                  type="button"
                  onClick={() => handleSaveField('timezone', 'Zona Waktu')}
                  disabled={isSaving}
                  className="px-4 py-2.5 bg-[var(--primary)] hover:opacity-90 text-white font-extrabold text-xs rounded-xl transition-all shadow-sm shrink-0 cursor-pointer disabled:opacity-50"
                >
                  Simpan
                </button>
              </div>
            </div>
          </div>

          {/* Address */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">Alamat Utama Studio</label>
            <div className="flex flex-col sm:flex-row items-stretch sm:items-start gap-2">
              <textarea
                rows={2}
                value={settings.contact_address || ''}
                onChange={(e) => handleChange('contact_address', e.target.value)}
                className="flex-1 px-3.5 py-2.5 rounded-xl border border-slate-300 font-semibold text-xs text-slate-900 focus:outline-none focus:border-[var(--primary)]"
              />
              <button
                type="button"
                onClick={() => handleSaveField('contact_address', 'Alamat Utama')}
                disabled={isSaving}
                className="px-4 py-2.5 bg-[var(--primary)] hover:opacity-90 text-white font-extrabold text-xs rounded-xl transition-all shadow-sm shrink-0 cursor-pointer disabled:opacity-50"
              >
                Simpan
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
