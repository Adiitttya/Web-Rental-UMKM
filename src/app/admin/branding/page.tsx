'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { Toast } from '@/components/feedback/Toast';
import { AdminPageHeader } from '@/components/admin/primitives/AdminPageHeader';

export default function AdminBrandingPage() {
  const [primaryLogo, setPrimaryLogo] = useState('/images/logo-dster.png');
  const [navbarLogo, setNavbarLogo] = useState('/images/logo-dster.png');
  const [favicon, setFavicon] = useState('/favicon.ico');
  const [footerLogo, setFooterLogo] = useState('/images/logo-dster.png');
  const [siteName, setSiteName] = useState('DsterGame Studio');
  const [tagline, setTagline] = useState('Console & Racing Simulator Lounge');
  const [socialPreview, setSocialPreview] = useState('/images/og-preview.jpg');

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const fetchBranding = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/admin/branding');
      const json = await res.json();
      if (json.success && json.data) {
        setPrimaryLogo(json.data.brand_logo_primary || '/images/logo-dster.png');
        setNavbarLogo(json.data.brand_logo_navbar || '/images/logo-dster.png');
        setFavicon(json.data.brand_favicon || '/favicon.ico');
        setFooterLogo(json.data.brand_logo_footer || '/images/logo-dster.png');
        setSiteName(json.data.brand_site_name || 'DsterGame Studio');
        setTagline(json.data.brand_tagline || 'Console & Racing Simulator Lounge');
        setSocialPreview(json.data.brand_social_preview || '/images/og-preview.jpg');
      }
    } catch {
      setToast({ type: 'error', message: 'Gagal memuat pengaturan identitas brand.' });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBranding();
  }, []);

  const handleSaveField = async (key: string, value: string, labelName: string) => {
    setIsSaving(true);
    try {
      const res = await fetch('/api/admin/branding', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ [key]: value }),
      });
      const json = await res.json();
      if (json.success) {
        setToast({ type: 'success', message: `${labelName} berhasil diperbarui.` });
      } else {
        setToast({ type: 'error', message: json.message || 'Gagal menyimpan.' });
      }
    } catch {
      setToast({ type: 'error', message: 'Terjadi kesalahan sistem.' });
    } finally {
      setIsSaving(false);
    }
  };

  const handleUsePrimaryLogo = (target: 'navbar' | 'footer') => {
    if (target === 'navbar') {
      setNavbarLogo(primaryLogo);
      handleSaveField('brand_logo_navbar', primaryLogo, 'Logo Navbar');
    } else {
      setFooterLogo(primaryLogo);
      handleSaveField('brand_logo_footer', primaryLogo, 'Logo Footer');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <AdminPageHeader
        title="Identitas Brand Terpusat (Centralized Branding)"
        description="Satu pusat konfigurasi logo dan visual identitas. Menghilangkan redundansi upload di Navbar, Hero, Favicon, dan Footer."
        badge="Brand Identity"
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
          Memuat konfigurasi identitas brand...
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Logo & Visual Assets Card */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-6">
            <div className="border-b border-slate-100 pb-3">
              <h3 className="text-sm font-extrabold text-slate-900">Logo & Asset Brand Utama</h3>
              <p className="text-xs text-slate-500 font-medium mt-0.5">
                Konfigurasi logo primer, navbar, footer, dan ikon browser favicon.
              </p>
            </div>

            <div className="space-y-4">
              {/* Primary Logo */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Primary Logo (Sumber Utama)</label>
                <div className="flex items-center gap-3 p-3 bg-slate-50 border border-slate-200 rounded-xl mb-2">
                  <div className="w-12 h-12 rounded-lg bg-slate-900 flex items-center justify-center p-2 shrink-0 relative overflow-hidden">
                    <Image src={primaryLogo} alt="Primary Logo" width={40} height={40} className="object-contain" unoptimized />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-bold text-slate-800 truncate">{primaryLogo}</div>
                    <div className="text-[10px] text-slate-400 font-medium">Logo master yang digunakan di berbagai section</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={primaryLogo}
                    onChange={(e) => setPrimaryLogo(e.target.value)}
                    className="flex-1 px-3.5 py-2 rounded-xl border border-slate-300 font-mono text-xs text-slate-900 focus:outline-none focus:border-[var(--primary)]"
                  />
                  <button
                    type="button"
                    onClick={() => handleSaveField('brand_logo_primary', primaryLogo, 'Primary Logo')}
                    disabled={isSaving}
                    className="px-4 py-2 bg-[var(--primary)] hover:opacity-90 text-white font-extrabold text-xs rounded-xl transition-all shadow-sm shrink-0 cursor-pointer disabled:opacity-50"
                  >
                    Simpan
                  </button>
                </div>
              </div>

              {/* Navbar Logo */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-bold text-slate-700">Logo Navbar (Header Situs)</label>
                  <button
                    type="button"
                    onClick={() => handleUsePrimaryLogo('navbar')}
                    className="text-[11px] font-extrabold text-[var(--primary)] hover:underline cursor-pointer"
                  >
                    Gunakan Primary Logo ✓
                  </button>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={navbarLogo}
                    onChange={(e) => setNavbarLogo(e.target.value)}
                    className="flex-1 px-3.5 py-2 rounded-xl border border-slate-300 font-mono text-xs text-slate-900 focus:outline-none focus:border-[var(--primary)]"
                  />
                  <button
                    type="button"
                    onClick={() => handleSaveField('brand_logo_navbar', navbarLogo, 'Logo Navbar')}
                    disabled={isSaving}
                    className="px-4 py-2 bg-[var(--primary)] hover:opacity-90 text-white font-extrabold text-xs rounded-xl transition-all shadow-sm shrink-0 cursor-pointer disabled:opacity-50"
                  >
                    Simpan
                  </button>
                </div>
              </div>

              {/* Favicon */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Browser Favicon Icon (.ico / .png)</label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={favicon}
                    onChange={(e) => setFavicon(e.target.value)}
                    className="flex-1 px-3.5 py-2 rounded-xl border border-slate-300 font-mono text-xs text-slate-900 focus:outline-none focus:border-[var(--primary)]"
                  />
                  <button
                    type="button"
                    onClick={() => handleSaveField('brand_favicon', favicon, 'Favicon')}
                    disabled={isSaving}
                    className="px-4 py-2 bg-[var(--primary)] hover:opacity-90 text-white font-extrabold text-xs rounded-xl transition-all shadow-sm shrink-0 cursor-pointer disabled:opacity-50"
                  >
                    Simpan
                  </button>
                </div>
              </div>

              {/* Footer Logo */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-bold text-slate-700">Logo Footer (Bagian Bawah)</label>
                  <button
                    type="button"
                    onClick={() => handleUsePrimaryLogo('footer')}
                    className="text-[11px] font-extrabold text-[var(--primary)] hover:underline cursor-pointer"
                  >
                    Gunakan Primary Logo ✓
                  </button>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={footerLogo}
                    onChange={(e) => setFooterLogo(e.target.value)}
                    className="flex-1 px-3.5 py-2 rounded-xl border border-slate-300 font-mono text-xs text-slate-900 focus:outline-none focus:border-[var(--primary)]"
                  />
                  <button
                    type="button"
                    onClick={() => handleSaveField('brand_logo_footer', footerLogo, 'Logo Footer')}
                    disabled={isSaving}
                    className="px-4 py-2 bg-[var(--primary)] hover:opacity-90 text-white font-extrabold text-xs rounded-xl transition-all shadow-sm shrink-0 cursor-pointer disabled:opacity-50"
                  >
                    Simpan
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Brand Text & Social Share Card */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-6">
            <div className="border-b border-slate-100 pb-3">
              <h3 className="text-sm font-extrabold text-slate-900">Nama Brand & Deskripsi</h3>
              <p className="text-xs text-slate-500 font-medium mt-0.5">
                Pengaturan teks resmi studio dan gambar pratinjau media sosial (OpenGraph).
              </p>
            </div>

            <div className="space-y-4">
              {/* Site Name */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Nama Resmi Brand / Studio</label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={siteName}
                    onChange={(e) => setSiteName(e.target.value)}
                    className="flex-1 px-3.5 py-2 rounded-xl border border-slate-300 text-xs font-semibold text-slate-900 focus:outline-none focus:border-[var(--primary)]"
                  />
                  <button
                    type="button"
                    onClick={() => handleSaveField('brand_site_name', siteName, 'Nama Brand')}
                    disabled={isSaving}
                    className="px-4 py-2 bg-[var(--primary)] hover:opacity-90 text-white font-extrabold text-xs rounded-xl transition-all shadow-sm shrink-0 cursor-pointer disabled:opacity-50"
                  >
                    Simpan
                  </button>
                </div>
              </div>

              {/* Tagline */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Tagline Resmi Studio</label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={tagline}
                    onChange={(e) => setTagline(e.target.value)}
                    className="flex-1 px-3.5 py-2 rounded-xl border border-slate-300 text-xs font-semibold text-slate-900 focus:outline-none focus:border-[var(--primary)]"
                  />
                  <button
                    type="button"
                    onClick={() => handleSaveField('brand_tagline', tagline, 'Tagline Brand')}
                    disabled={isSaving}
                    className="px-4 py-2 bg-[var(--primary)] hover:opacity-90 text-white font-extrabold text-xs rounded-xl transition-all shadow-sm shrink-0 cursor-pointer disabled:opacity-50"
                  >
                    Simpan
                  </button>
                </div>
              </div>

              {/* Social Preview Image */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Gambar Pratinjau Share Media Sosial (OG Image)</label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={socialPreview}
                    onChange={(e) => setSocialPreview(e.target.value)}
                    className="flex-1 px-3.5 py-2 rounded-xl border border-slate-300 font-mono text-xs text-slate-900 focus:outline-none focus:border-[var(--primary)]"
                  />
                  <button
                    type="button"
                    onClick={() => handleSaveField('brand_social_preview', socialPreview, 'Social Preview Image')}
                    disabled={isSaving}
                    className="px-4 py-2 bg-[var(--primary)] hover:opacity-90 text-white font-extrabold text-xs rounded-xl transition-all shadow-sm shrink-0 cursor-pointer disabled:opacity-50"
                  >
                    Simpan
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
