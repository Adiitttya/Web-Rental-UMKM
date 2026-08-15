'use client';

import React, { useState } from 'react';
import { Toast } from '@/components/feedback/Toast';

export default function AdminContactPage() {
  const [whatsapp, setWhatsapp] = useState('085172412206');
  const [phone, setPhone] = useState('085172412206');
  const [email, setEmail] = useState('contact@dstergame.com');
  const [address, setAddress] = useState('Jl. Gedongsongo No. 17, Ungaran Barat, Kab. Semarang');
  const [instagram, setInstagram] = useState('https://instagram.com/dster.game');
  const [operationalHours, setOperationalHours] = useState('Buka Setiap Hari (06:00 - 24:00 WIB)');

  const [isSaving, setIsSaving] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const handleSaveField = async (fieldName: string) => {
    setIsSaving(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 400));
      setToast({ type: 'success', message: `${fieldName} berhasil diperbarui.` });
    } catch {
      setToast({ type: 'error', message: `Gagal memperbarui ${fieldName}.` });
    } finally {
      setIsSaving(false);
    }
  };

  const handleSubmitAll = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 600));
      setToast({ type: 'success', message: 'Informasi kontak resmi berhasil diperbarui dan tersimpan secara permanen.' });
    } catch {
      setToast({ type: 'error', message: 'Gagal memperbarui informasi kontak.' });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 sm:p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-800">Official Contact & Communication</h1>
          <p className="text-xs text-slate-500 font-medium mt-1">
            Kelola saluran komunikasi resmi, nomor WhatsApp admin, email operasional, dan lokasi studio.
          </p>
        </div>
      </div>

      {/* Floating Toast Notification */}
      <Toast
        isVisible={!!toast}
        type={toast?.type}
        message={toast?.message || ''}
        onClose={() => setToast(null)}
      />

      {/* Main Configuration Form with Inline Save Buttons */}
      <div className="space-y-4 sm:space-y-6">
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 sm:p-6 lg:p-8 space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <h3 className="text-sm font-extrabold text-slate-900">Saluran Komunikasi Publik</h3>
            <p className="text-xs text-slate-500 font-medium mt-0.5">
              Atur nomor WhatsApp, telepon customer service, dan email utama studio.
            </p>
          </div>

          <div className="space-y-4">
            {/* WhatsApp Field with Inline Save Button */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">Nomor WhatsApp Official</label>
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                <input
                  type="text"
                  required
                  value={whatsapp}
                  onChange={(e) => setWhatsapp(e.target.value)}
                  className="flex-1 px-3.5 py-2.5 rounded-xl border border-slate-300 font-mono text-xs text-slate-900 focus:outline-none focus:border-[var(--primary)]"
                />
                <button
                  type="button"
                  onClick={() => handleSaveField('Nomor WhatsApp')}
                  disabled={isSaving}
                  className="px-4 py-2.5 bg-[var(--primary)] hover:opacity-90 text-white font-extrabold text-xs rounded-xl transition-all shadow-sm shrink-0 cursor-pointer disabled:opacity-50"
                >
                  Simpan
                </button>
              </div>
            </div>

            {/* Telepon CS Field with Inline Save Button */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">Telepon Hotline / CS</label>
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                <input
                  type="text"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="flex-1 px-3.5 py-2.5 rounded-xl border border-slate-300 font-mono text-xs text-slate-900 focus:outline-none focus:border-[var(--primary)]"
                />
                <button
                  type="button"
                  onClick={() => handleSaveField('Telepon Hotline')}
                  disabled={isSaving}
                  className="px-4 py-2.5 bg-[var(--primary)] hover:opacity-90 text-white font-extrabold text-xs rounded-xl transition-all shadow-sm shrink-0 cursor-pointer disabled:opacity-50"
                >
                  Simpan
                </button>
              </div>
            </div>

            {/* Email Field with Inline Save Button */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">Alamat Email Operasional</label>
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="flex-1 px-3.5 py-2.5 rounded-xl border border-slate-300 font-semibold text-xs text-slate-900 focus:outline-none focus:border-[var(--primary)]"
                />
                <button
                  type="button"
                  onClick={() => handleSaveField('Email Operasional')}
                  disabled={isSaving}
                  className="px-4 py-2.5 bg-[var(--primary)] hover:opacity-90 text-white font-extrabold text-xs rounded-xl transition-all shadow-sm shrink-0 cursor-pointer disabled:opacity-50"
                >
                  Simpan
                </button>
              </div>
            </div>

            {/* Instagram Profile Field with Inline Save Button */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">Link Profil Instagram</label>
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                <input
                  type="url"
                  required
                  value={instagram}
                  onChange={(e) => setInstagram(e.target.value)}
                  className="flex-1 px-3.5 py-2.5 rounded-xl border border-slate-300 font-semibold text-xs text-slate-900 focus:outline-none focus:border-[var(--primary)]"
                />
                <button
                  type="button"
                  onClick={() => handleSaveField('Profil Instagram')}
                  disabled={isSaving}
                  className="px-4 py-2.5 bg-[var(--primary)] hover:opacity-90 text-white font-extrabold text-xs rounded-xl transition-all shadow-sm shrink-0 cursor-pointer disabled:opacity-50"
                >
                  Simpan
                </button>
              </div>
            </div>

            {/* Alamat Utama Field with Inline Save Button */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">Alamat Utama Studio</label>
              <div className="flex flex-col sm:flex-row items-stretch sm:items-start gap-2">
                <textarea
                  rows={2}
                  required
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="flex-1 px-3.5 py-2.5 rounded-xl border border-slate-300 font-semibold text-xs text-slate-900 focus:outline-none focus:border-[var(--primary)]"
                />
                <button
                  type="button"
                  onClick={() => handleSaveField('Alamat Utama')}
                  disabled={isSaving}
                  className="px-4 py-2.5 bg-[var(--primary)] hover:opacity-90 text-white font-extrabold text-xs rounded-xl transition-all shadow-sm shrink-0 cursor-pointer disabled:opacity-50"
                >
                  Simpan
                </button>
              </div>
            </div>

            {/* Jam Operasional Field with Inline Save Button */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">Pengumuman Jam Operasional</label>
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                <input
                  type="text"
                  required
                  value={operationalHours}
                  onChange={(e) => setOperationalHours(e.target.value)}
                  className="flex-1 px-3.5 py-2.5 rounded-xl border border-slate-300 font-semibold text-xs text-slate-900 focus:outline-none focus:border-[var(--primary)]"
                />
                <button
                  type="button"
                  onClick={() => handleSaveField('Jam Operasional')}
                  disabled={isSaving}
                  className="px-4 py-2.5 bg-[var(--primary)] hover:opacity-90 text-white font-extrabold text-xs rounded-xl transition-all shadow-sm shrink-0 cursor-pointer disabled:opacity-50"
                >
                  Simpan
                </button>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
