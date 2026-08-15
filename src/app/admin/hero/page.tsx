'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { Toast } from '@/components/feedback/Toast';

interface GameCover {
  id: string;
  title: string;
  image: string;
}

interface Decorations {
  vr: string;
  gamepad: string;
  wheel: string;
  stick: string;
  star?: string;
}

export default function AdminHeroPage() {
  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [instagram, setInstagram] = useState('@dster.game');
  const [ctaText, setCtaText] = useState('Explore');
  const [ctaLink, setCtaLink] = useState('#list-game');
  const [logoUrl, setLogoUrl] = useState('/Logos/logo-utama.png');

  const [decorations, setDecorations] = useState<Decorations>({
    vr: '/3d/vr.webp',
    gamepad: '/3d/gamepad.webp',
    wheel: '/3d/wheel.webp',
    stick: '/3d/stick.webp',
  });

  const [gameCovers, setGameCovers] = useState<GameCover[]>([]);

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const fetchHeroData = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/admin/hero');
      const data = await res.json();
      if (data.success && data.data) {
        const d = data.data;
        setTitle(d.title || '');
        setSubtitle(d.subtitle || '');
        setInstagram(d.instagram || '@dster.game');
        setCtaText(d.ctaText || 'Explore');
        setCtaLink(d.ctaLink || '#list-game');
        setLogoUrl(d.logo || '/Logos/logo-utama.png');
        if (d.decorations) setDecorations(d.decorations);
        if (Array.isArray(d.gameCovers)) setGameCovers(d.gameCovers);
      }
    } catch {
      setToast({ type: 'error', message: 'Gagal memuat data Hero section.' });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchHeroData();
  }, []);

  const handleSaveAll = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      const res = await fetch('/api/admin/hero', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          subtitle,
          instagram,
          ctaText,
          ctaLink,
          logo: logoUrl,
          decorations,
          gameCovers,
        }),
      });

      const result = await res.json();
      if (result.success) {
        setToast({ type: 'success', message: 'Pengaturan Hero berhasil disimpan dan tersinkron ke web utama.' });
      } else {
        setToast({ type: 'error', message: result.message || 'Gagal menyimpan pengaturan.' });
      }
    } catch {
      setToast({ type: 'error', message: 'Terjadi kesalahan sistem.' });
    } finally {
      setIsSaving(false);
    }
  };

  const handleCoverChange = (index: number, field: 'title' | 'image', value: string) => {
    const updated = [...gameCovers];
    updated[index] = { ...updated[index], [field]: value };
    setGameCovers(updated);
  };

  return (
    <div className="space-y-5">
      <Toast
        isVisible={!!toast}
        type={toast?.type}
        message={toast?.message || ''}
        onClose={() => setToast(null)}
      />

      <form onSubmit={handleSaveAll} className="space-y-5">
        {/* Top Control Bar positioned right above content */}
        <div className="flex items-center justify-between bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[var(--primary)]" />
            <span className="text-xs font-bold text-slate-700">Live Editor Hero Section</span>
          </div>
          <button
            type="submit"
            disabled={isSaving || isLoading}
            className="px-5 py-2 bg-[var(--primary)] hover:opacity-90 text-white font-extrabold text-xs rounded-xl transition-all shadow-xs cursor-pointer disabled:opacity-50 flex items-center gap-1.5"
          >
            {isSaving ? (
              <>
                <svg className="w-3.5 h-3.5 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                <span>Menyimpan...</span>
              </>
            ) : (
              <>
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
                </svg>
                <span>Simpan Perubahan</span>
              </>
            )}
          </button>
        </div>

        {isLoading ? (
          <div className="bg-white rounded-2xl border border-slate-200/80 p-12 text-center text-xs font-bold text-slate-400 animate-pulse">
            Memuat konfigurasi Hero...
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
            {/* Left 2 Columns: Texts & Buttons */}
            <div className="lg:col-span-2 space-y-5">
              {/* Card 1: Branding & Headline */}
              <div className="bg-white rounded-2xl border border-slate-200/80 p-5 space-y-4 shadow-xs">
                <div className="border-b border-slate-100 pb-3">
                  <h2 className="text-sm font-bold text-[var(--foreground)]">Headline & Identitas Teks</h2>
                  <p className="text-xs text-slate-500">Teks utama yang langsung dilihat pengunjung saat membuka halaman.</p>
                </div>

                <div className="space-y-3.5">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Handle Instagram</label>
                    <input
                      type="text"
                      required
                      value={instagram}
                      onChange={(e) => setInstagram(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 font-semibold text-xs text-slate-900 focus:outline-none focus:border-[var(--primary)] bg-slate-50/50"
                      placeholder="@dster.game"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Judul Utama (Title)</label>
                    <input
                      type="text"
                      required
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 font-semibold text-xs text-slate-900 focus:outline-none focus:border-[var(--primary)] bg-slate-50/50"
                      placeholder="DsterGame Studio"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Tagline Subtitle</label>
                    <textarea
                      rows={2}
                      value={subtitle}
                      onChange={(e) => setSubtitle(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 font-semibold text-xs text-slate-900 focus:outline-none focus:border-[var(--primary)] bg-slate-50/50"
                      placeholder="Console & Racing Simulator Lounge..."
                    />
                  </div>
                </div>
              </div>

              {/* Card 2: Call to Action (CTA) Button */}
              <div className="bg-white rounded-2xl border border-slate-200/80 p-5 space-y-4 shadow-xs">
                <div className="border-b border-slate-100 pb-3">
                  <h2 className="text-sm font-bold text-[var(--foreground)]">Tombol Aksi (Explore CTA)</h2>
                  <p className="text-xs text-slate-500">Label dan tujuan tautan scroll / URL saat tombol diklik.</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Teks Tombol</label>
                    <input
                      type="text"
                      required
                      value={ctaText}
                      onChange={(e) => setCtaText(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 font-semibold text-xs text-slate-900 focus:outline-none focus:border-[var(--primary)] bg-slate-50/50"
                      placeholder="Explore"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Link Target (Anchor / URL)</label>
                    <input
                      type="text"
                      required
                      value={ctaLink}
                      onChange={(e) => setCtaLink(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 font-mono text-xs text-slate-900 focus:outline-none focus:border-[var(--primary)] bg-slate-50/50"
                      placeholder="#list-game"
                    />
                  </div>
                </div>
              </div>

              {/* Card 3: Game Covers Showcase */}
              <div className="bg-white rounded-2xl border border-slate-200/80 p-5 space-y-4 shadow-xs">
                <div className="border-b border-slate-100 pb-3">
                  <h2 className="text-sm font-bold text-[var(--foreground)]">Game Covers Showcase (5 Covers Fan-out)</h2>
                  <p className="text-xs text-slate-500">5 cover game yang ditampilkan bertumpuk melengkung di area bawah hero.</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  {gameCovers.map((cover, idx) => (
                    <div key={cover.id || idx} className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/50 space-y-2">
                      <div className="flex items-center gap-3">
                        <div className="relative w-12 h-16 rounded-lg overflow-hidden bg-slate-200 shrink-0 border border-slate-300">
                          {cover.image ? (
                            <Image
                              src={cover.image}
                              alt={cover.title}
                              fill
                              className="object-cover"
                              unoptimized
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-[10px] text-slate-400">Cover</div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0 space-y-1.5">
                          <input
                            type="text"
                            value={cover.title}
                            onChange={(e) => handleCoverChange(idx, 'title', e.target.value)}
                            placeholder="Judul Game"
                            className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 font-bold text-xs bg-white focus:outline-none focus:border-[var(--primary)]"
                          />
                          <input
                            type="text"
                            value={cover.image}
                            onChange={(e) => handleCoverChange(idx, 'image', e.target.value)}
                            placeholder="URL Gambar Cover (/GameCover/...)"
                            className="w-full px-2.5 py-1 rounded-lg border border-slate-200 font-mono text-[10px] text-slate-600 bg-white focus:outline-none focus:border-[var(--primary)]"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right 1 Column: Visual Assets & 3D Decorations */}
            <div className="space-y-5">
              {/* Logo Preview */}
              <div className="bg-white rounded-2xl border border-slate-200/80 p-5 space-y-3.5 shadow-xs">
                <div className="border-b border-slate-100 pb-2.5">
                  <h2 className="text-sm font-bold text-[var(--foreground)]">Logo Banner</h2>
                  <p className="text-xs text-slate-500">Logo utama yang berada di tengah Hero.</p>
                </div>
                <div className="relative w-full h-24 bg-slate-100 rounded-xl flex items-center justify-center border border-slate-200 p-2 overflow-hidden">
                  <Image
                    src={logoUrl}
                    alt="Logo Preview"
                    width={240}
                    height={80}
                    className="object-contain max-h-20"
                    unoptimized
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">Path / URL Logo</label>
                  <input
                    type="text"
                    value={logoUrl}
                    onChange={(e) => setLogoUrl(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 font-mono text-xs text-slate-900 bg-slate-50/50 focus:outline-none focus:border-[var(--primary)]"
                  />
                </div>
              </div>

              {/* 3D Floating Decorations */}
              <div className="bg-white rounded-2xl border border-slate-200/80 p-5 space-y-3.5 shadow-xs">
                <div className="border-b border-slate-100 pb-2.5">
                  <h2 className="text-sm font-bold text-[var(--foreground)]">Gambar Dekorasi 3D</h2>
                  <p className="text-xs text-slate-500">Asset 3D melayang di sekeliling banner hero.</p>
                </div>

                <div className="space-y-3">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">Logitech Wheel 3D</label>
                    <input
                      type="text"
                      value={decorations.wheel}
                      onChange={(e) => setDecorations({ ...decorations, wheel: e.target.value })}
                      className="w-full px-3 py-1.5 rounded-xl border border-slate-200 font-mono text-[11px] text-slate-800 bg-slate-50/50 focus:outline-none focus:border-[var(--primary)]"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">DualSense Stick 3D</label>
                    <input
                      type="text"
                      value={decorations.stick}
                      onChange={(e) => setDecorations({ ...decorations, stick: e.target.value })}
                      className="w-full px-3 py-1.5 rounded-xl border border-slate-200 font-mono text-[11px] text-slate-800 bg-slate-50/50 focus:outline-none focus:border-[var(--primary)]"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">Gamepad 3D</label>
                    <input
                      type="text"
                      value={decorations.gamepad}
                      onChange={(e) => setDecorations({ ...decorations, gamepad: e.target.value })}
                      className="w-full px-3 py-1.5 rounded-xl border border-slate-200 font-mono text-[11px] text-slate-800 bg-slate-50/50 focus:outline-none focus:border-[var(--primary)]"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">VR Headset 3D</label>
                    <input
                      type="text"
                      value={decorations.vr}
                      onChange={(e) => setDecorations({ ...decorations, vr: e.target.value })}
                      className="w-full px-3 py-1.5 rounded-xl border border-slate-200 font-mono text-[11px] text-slate-800 bg-slate-50/50 focus:outline-none focus:border-[var(--primary)]"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </form>
    </div>
  );
}
