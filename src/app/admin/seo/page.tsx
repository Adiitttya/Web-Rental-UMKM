'use client';

import React, { useState, useEffect } from 'react';
import { Toast } from '@/components/feedback/Toast';
import { AdminPageHeader } from '@/components/admin/primitives/AdminPageHeader';

interface SeoItem {
  id?: string;
  pagePath: string;
  title: string;
  description?: string | null;
  keywords?: string | null;
}

export default function AdminSeoPage() {
  const [pages, setPages] = useState<SeoItem[]>([]);
  const [selectedPath, setSelectedPath] = useState<string>('/');
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const fetchSeo = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/admin/seo');
      const json = await res.json();
      if (json.success && Array.isArray(json.data)) {
        setPages(json.data);
      }
    } catch {
      setToast({ type: 'error', message: 'Gagal memuat metadata SEO.' });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSeo();
  }, []);

  const currentPage = pages.find((p) => p.pagePath === selectedPath) || {
    pagePath: selectedPath,
    title: '',
    description: '',
    keywords: '',
  };

  const handleFieldChange = (field: keyof SeoItem, val: string) => {
    setPages((prev) =>
      prev.map((item) => {
        if (item.pagePath === selectedPath) {
          return { ...item, [field]: val };
        }
        return item;
      })
    );
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const res = await fetch('/api/admin/seo', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(currentPage),
      });
      const json = await res.json();
      if (json.success) {
        setToast({ type: 'success', message: `Metadata SEO untuk ${selectedPath} berhasil diperbarui.` });
        fetchSeo();
      } else {
        setToast({ type: 'error', message: json.message || 'Gagal menyimpan SEO.' });
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
        title="Optimasi Mesin Pencari (SEO Management)"
        description="Konfigurasi Title Tag, Meta Description, dan Keywords per halaman publik untuk memaksimalkan visibilitas di Google Search."
        badge="SEO Engine"
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
          Memuat metadata SEO halaman...
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Page Selector Sidebar */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 space-y-2">
            <div className="px-2 py-1 text-[11px] font-extrabold text-slate-400 uppercase tracking-wider">
              Pilih Halaman Publik
            </div>
            <div className="space-y-1">
              {pages.map((p) => {
                const isActive = p.pagePath === selectedPath;
                return (
                  <button
                    key={p.pagePath}
                    type="button"
                    onClick={() => setSelectedPath(p.pagePath)}
                    className={`w-full text-left px-3 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-between ${
                      isActive
                        ? 'bg-[var(--primary)] text-white shadow-sm font-extrabold'
                        : 'text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <span>{p.pagePath === '/' ? 'Home (/)' : p.pagePath}</span>
                    <span className="text-[10px] opacity-70">➔</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* SEO Form & Live Google SERP Preview */}
          <div className="lg:col-span-2 space-y-6">
            {/* SERP Preview Card */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-3">
              <div className="text-[11px] font-black text-slate-400 uppercase tracking-wider">
                Pratinjau Hasil Pencarian Google (SERP Preview)
              </div>
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                <div className="text-[11px] text-slate-500 font-mono">
                  https://dstergame.com{selectedPath === '/' ? '' : selectedPath}
                </div>
                <div className="text-base font-bold text-blue-700 hover:underline cursor-pointer">
                  {currentPage.title || 'Judul Halaman Belum Diatur'}
                </div>
                <div className="text-xs text-slate-600 leading-relaxed">
                  {currentPage.description || 'Deskripsi meta ringkas halaman belum diatur.'}
                </div>
              </div>
            </div>

            {/* Editor Form */}
            <form onSubmit={handleSave} className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-5">
              <div className="border-b border-slate-100 pb-3">
                <h3 className="text-sm font-extrabold text-slate-900">
                  Edit Metadata: <span className="font-mono text-blue-600">{selectedPath}</span>
                </h3>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-bold text-slate-700">Meta Title</label>
                  <span className="text-[10px] font-mono text-slate-400">
                    {currentPage.title?.length || 0} / 60 karakter
                  </span>
                </div>
                <input
                  type="text"
                  required
                  value={currentPage.title || ''}
                  onChange={(e) => handleFieldChange('title', e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-semibold text-slate-900 focus:outline-none focus:border-[var(--primary)]"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-bold text-slate-700">Meta Description</label>
                  <span className="text-[10px] font-mono text-slate-400">
                    {currentPage.description?.length || 0} / 160 karakter
                  </span>
                </div>
                <textarea
                  rows={3}
                  value={currentPage.description || ''}
                  onChange={(e) => handleFieldChange('description', e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-semibold text-slate-900 focus:outline-none focus:border-[var(--primary)]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Keywords (Pisahkan dengan koma)
                </label>
                <input
                  type="text"
                  value={currentPage.keywords || ''}
                  onChange={(e) => handleFieldChange('keywords', e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-semibold text-slate-900 focus:outline-none focus:border-[var(--primary)]"
                />
              </div>

              <div className="flex justify-end pt-3 border-t border-slate-100">
                <button
                  type="submit"
                  disabled={isSaving}
                  className="px-6 py-2.5 bg-[var(--primary)] hover:opacity-90 text-white font-extrabold text-xs rounded-xl transition-all shadow-sm cursor-pointer disabled:opacity-50"
                >
                  {isSaving ? 'Menyimpan...' : 'Simpan Metadata SEO'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
