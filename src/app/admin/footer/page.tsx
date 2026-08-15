'use client';

import React, { useState, useEffect } from 'react';
import { Toast } from '@/components/feedback/Toast';

export interface SocialLinkItem {
  id: string;
  platform: string;
  url: string;
  icon: string;
}

const AVAILABLE_PLATFORMS = [
  { id: 'instagram', platform: 'Instagram', defaultUrl: 'https://instagram.com/dster.game', icon: 'instagram' },
  { id: 'tiktok', platform: 'TikTok', defaultUrl: 'https://tiktok.com/@dster.game', icon: 'tiktok' },
  { id: 'whatsapp', platform: 'WhatsApp', defaultUrl: 'https://wa.me/6285172412206', icon: 'whatsapp' },
  { id: 'email', platform: 'Email', defaultUrl: 'mailto:admin@dstergame.com', icon: 'email' },
  { id: 'x', platform: 'X (Twitter)', defaultUrl: 'https://x.com/dstergame', icon: 'x' },
  { id: 'youtube', platform: 'YouTube', defaultUrl: 'https://youtube.com/@dstergame', icon: 'youtube' },
  { id: 'facebook', platform: 'Facebook', defaultUrl: 'https://facebook.com/dstergame', icon: 'facebook' },
  { id: 'maps', platform: 'Google Maps', defaultUrl: 'https://maps.app.goo.gl/dstergame', icon: 'maps' },
  { id: 'linkedin', platform: 'LinkedIn', defaultUrl: 'https://linkedin.com/company/dstergame', icon: 'linkedin' },
  { id: 'discord', platform: 'Discord', defaultUrl: 'https://discord.gg/dstergame', icon: 'discord' },
];

export default function AdminFooterPage() {
  const [copyrightNotice, setCopyrightNotice] = useState('© 2026 DsterGame Studio. All Rights Reserved.');
  const [socialLinks, setSocialLinks] = useState<SocialLinkItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const fetchFooterData = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/admin/footer');
      const data = await res.json();
      if (data.success && data.data) {
        setCopyrightNotice(data.data.copyrightNotice || '© 2026 DsterGame Studio. All Rights Reserved.');
        setSocialLinks(data.data.socialLinks || []);
      }
    } catch {
      setToast({ type: 'error', message: 'Gagal memuat data footer dari database.' });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchFooterData();
  }, []);

  const handleAddPlatform = (p: (typeof AVAILABLE_PLATFORMS)[0]) => {
    const exists = socialLinks.some((item) => item.id === p.id);
    if (exists) {
      setToast({ type: 'error', message: `Media sosial ${p.platform} sudah ada dalam daftar.` });
      return;
    }

    setSocialLinks((prev) => [
      ...prev,
      {
        id: p.id,
        platform: p.platform,
        url: p.defaultUrl,
        icon: p.icon,
      },
    ]);
  };

  const handleUrlChange = (id: string, newUrl: string) => {
    setSocialLinks((prev) =>
      prev.map((item) => (item.id === id ? { ...item, url: newUrl } : item))
    );
  };

  const handleRemoveSocialLink = (id: string) => {
    setSocialLinks((prev) => prev.filter((item) => item.id !== id));
  };

  const handleSaveCopyrightOnly = async () => {
    setIsSaving(true);
    try {
      const res = await fetch('/api/admin/footer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          copyrightNotice,
          socialLinks,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setToast({ type: 'success', message: 'Teks Copyright Notice berhasil disimpan ke database!' });
      } else {
        setToast({ type: 'error', message: data.message || 'Gagal menyimpan copyright.' });
      }
    } catch {
      setToast({ type: 'error', message: 'Terjadi kesalahan jaringan atau server.' });
    } finally {
      setIsSaving(false);
    }
  };

  const handleSubmitAll = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const res = await fetch('/api/admin/footer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          copyrightNotice,
          socialLinks,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setToast({ type: 'success', message: 'Pengaturan Copyright & Media Sosial Footer berhasil diperbarui ke database!' });
      } else {
        setToast({ type: 'error', message: data.message || 'Gagal menyimpan data footer.' });
      }
    } catch {
      setToast({ type: 'error', message: 'Terjadi kesalahan jaringan atau server.' });
    } finally {
      setIsSaving(false);
    }
  };

  const getPlatformIcon = (iconName: string) => {
    switch (iconName) {
      case 'instagram':
        return (
          <svg className="w-4 h-4 text-pink-600 fill-current" viewBox="0 0 24 24">
            <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
          </svg>
        );
      case 'tiktok':
        return (
          <svg className="w-4 h-4 text-slate-900 fill-current" viewBox="0 0 24 24">
            <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 1 1-5.2-1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V5.8a6.34 6.34 0 0 0-1-.08 6.35 6.35 0 1 0 6.35 6.35V8.65a8.23 8.23 0 0 0 4.88 1.57V6.77a4.82 4.82 0 0 1-1-.08z" />
          </svg>
        );
      case 'whatsapp':
        return (
          <svg className="w-4 h-4 text-emerald-600 fill-current" viewBox="0 0 24 24">
            <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l.399.635-1.002 3.657 3.753-.984.593.365z" />
          </svg>
        );
      case 'email':
        return (
          <svg className="w-4 h-4 text-blue-600 fill-current" viewBox="0 0 24 24">
            <path d="M0 3v18h24v-18h-24zm21.518 2l-9.518 7.713-9.518-7.713h19.036zm-19.518 14v-11.817l10 8.104 10-8.104v11.817h-20z" />
          </svg>
        );
      case 'x':
        return (
          <svg className="w-4 h-4 text-slate-900 fill-current" viewBox="0 0 24 24">
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
          </svg>
        );
      case 'youtube':
        return (
          <svg className="w-4 h-4 text-rose-600 fill-current" viewBox="0 0 24 24">
            <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
          </svg>
        );
      case 'facebook':
        return (
          <svg className="w-4 h-4 text-blue-700 fill-current" viewBox="0 0 24 24">
            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
          </svg>
        );
      default:
        return (
          <svg className="w-4 h-4 text-slate-700 stroke-current" fill="none" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
          </svg>
        );
    }
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 sm:p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-800">Footer & Metadata Settings</h1>
          <p className="text-xs text-slate-500 font-medium mt-1">
            Konfigurasi hak cipta (copyright), tautan navigasi sekunder, serta informasi hukum pada bagian bawah situs.
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

      {isLoading ? (
        <div className="bg-white rounded-2xl p-12 border border-slate-200 shadow-sm text-center text-xs font-bold text-slate-400 animate-pulse">
          Memuat data pengaturan footer dari database...
        </div>
      ) : (
        <div className="space-y-4 sm:space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 sm:p-6 lg:p-8 space-y-6">
            {/* Copyright Notice Section with Inline Save Button */}
            <div className="border-b border-slate-100 pb-4">
              <h3 className="text-sm font-extrabold text-slate-900">Hak Cipta (Copyright Notice)</h3>
              <p className="text-xs text-slate-500 font-medium mt-0.5">
                Ubah teks hak cipta resmi yang tampil di bagian paling bawah halaman landing page.
              </p>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">Teks Copyright Notice</label>
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                <input
                  type="text"
                  required
                  value={copyrightNotice}
                  onChange={(e) => setCopyrightNotice(e.target.value)}
                  className="flex-1 px-3.5 py-2.5 rounded-xl border border-slate-300 font-semibold text-xs text-slate-900 focus:outline-none focus:border-[var(--primary)]"
                  placeholder="© 2026 DsterGame Studio. All Rights Reserved."
                />
                <button
                  type="button"
                  onClick={handleSaveCopyrightOnly}
                  disabled={isSaving}
                  className="px-4 py-2.5 bg-[var(--primary)] hover:opacity-90 text-white font-extrabold text-xs rounded-xl transition-all shadow-sm shrink-0 cursor-pointer disabled:opacity-50"
                >
                  Simpan
                </button>
              </div>
            </div>

            {/* Social Media Section */}
            <div className="border-t border-slate-100 pt-6">
              <div className="border-b border-slate-100 pb-4 mb-4">
                <h3 className="text-sm font-extrabold text-slate-900">Media Sosial & Link Tautan</h3>
                <p className="text-xs text-slate-500 font-medium mt-0.5">
                  Klik pilihan media sosial di bawah untuk menambahkan kolom tautan baru.
                </p>
              </div>

              {/* Selector Buttons for Available Platforms */}
              <div className="space-y-2 mb-6">
                <div className="text-[11px] font-extrabold text-slate-400 uppercase tracking-wider">
                  Pilih Media Sosial untuk Ditambahkan:
                </div>
                <div className="flex flex-wrap gap-2">
                  {AVAILABLE_PLATFORMS.map((p) => {
                    const isAdded = socialLinks.some((item) => item.id === p.id);
                    return (
                      <button
                        key={p.id}
                        type="button"
                        onClick={() => handleAddPlatform(p)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer border ${
                          isAdded
                            ? 'bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed opacity-60'
                            : 'bg-white text-slate-800 border-slate-200 hover:border-[var(--primary)] hover:text-[var(--primary)] shadow-sm'
                        }`}
                        disabled={isAdded}
                      >
                        <span>{getPlatformIcon(p.icon)}</span>
                        <span>+ {p.platform}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Dynamic Social Links Rows */}
              <div className="space-y-3">
                <div className="text-[11px] font-extrabold text-slate-400 uppercase tracking-wider">
                  Daftar Media Sosial Aktif ({socialLinks.length}):
                </div>

                {socialLinks.length === 0 ? (
                  <div className="p-6 text-center text-xs font-semibold text-slate-400 border border-dashed border-slate-200 rounded-xl">
                    Belum ada media sosial yang ditambahkan. Klik opsi media sosial di atas.
                  </div>
                ) : (
                  socialLinks.map((item) => (
                    <div
                      key={item.id}
                      className="flex flex-col sm:flex-row sm:items-center gap-3 p-3 bg-slate-50 border border-slate-200 rounded-xl group hover:border-slate-300 transition-colors"
                    >
                      <div className="flex items-center gap-2.5 shrink-0">
                        <div className="w-8 h-8 rounded-lg bg-white border border-slate-200 flex items-center justify-center shrink-0 shadow-sm">
                          {getPlatformIcon(item.icon)}
                        </div>
                        <div className="w-24 font-extrabold text-xs text-slate-800">
                          {item.platform}
                        </div>
                      </div>

                      <div className="flex-1 min-w-0 flex items-center gap-2">
                        <input
                          type="text"
                          required
                          value={item.url}
                          onChange={(e) => handleUrlChange(item.id, e.target.value)}
                          className="flex-1 px-3 py-2 rounded-lg bg-white border border-slate-200 font-mono text-xs text-slate-900 focus:outline-none focus:border-[var(--primary)]"
                          placeholder={`https://...`}
                        />
                        <button
                          type="button"
                          onClick={() => handleRemoveSocialLink(item.id)}
                          className="w-9 h-9 rounded-lg bg-white hover:bg-rose-50 text-slate-400 hover:text-rose-600 border border-slate-200 flex items-center justify-center text-xs font-bold transition-colors cursor-pointer shrink-0"
                          title="Hapus Media Sosial"
                        >
                          ✕
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>

              <div className="flex justify-end pt-4 mt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={handleSubmitAll}
                  disabled={isSaving}
                  className="px-4 py-2.5 bg-[var(--primary)] hover:opacity-90 text-white font-extrabold text-xs rounded-xl transition-all shadow-sm cursor-pointer disabled:opacity-50"
                >
                  Simpan Media Sosial
                </button>
              </div>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}
