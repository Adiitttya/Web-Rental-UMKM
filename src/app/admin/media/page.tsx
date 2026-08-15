'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { Toast } from '@/components/feedback/Toast';
import { AdminPageHeader } from '@/components/admin/primitives/AdminPageHeader';
import { AdminConfirmDialog } from '@/components/admin/primitives/AdminConfirmDialog';
import { AdminEmptyState } from '@/components/admin/primitives/AdminEmptyState';

interface MediaItem {
  id: string;
  folder: string;
  filename: string;
  url: string;
  mimeType: string;
  sizeBytes: number;
  altText?: string | null;
  createdAt: string;
  _count?: {
    galleryPhotos: number;
    hardwareCovers: number;
    gameCovers: number;
    eventPosters: number;
    branchCovers: number;
  };
}

export default function AdminMediaPage() {
  const [mediaList, setMediaList] = useState<MediaItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  // Add media modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filename, setFilename] = useState('');
  const [url, setUrl] = useState('');
  const [altText, setAltText] = useState('');
  const [folder, setFolder] = useState('general');
  const [isSaving, setIsSaving] = useState(false);

  // Delete modal state
  const [deleteTarget, setDeleteTarget] = useState<MediaItem | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchMedia = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/admin/media?search=${encodeURIComponent(search)}`);
      const json = await res.json();
      if (json.success) {
        setMediaList(json.data);
      }
    } catch {
      setToast({ type: 'error', message: 'Gagal memuat daftar media library.' });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMedia();
  }, [search]);

  const handleAddMedia = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!filename || !url) return;

    setIsSaving(true);
    try {
      const res = await fetch('/api/admin/media', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          filename,
          url,
          altText,
          folder,
        }),
      });
      const json = await res.json();
      if (json.success) {
        setToast({ type: 'success', message: 'Asset media berhasil didaftarkan.' });
        setIsModalOpen(false);
        setFilename('');
        setUrl('');
        setAltText('');
        fetchMedia();
      } else {
        setToast({ type: 'error', message: json.message || 'Gagal menambahkan media.' });
      }
    } catch {
      setToast({ type: 'error', message: 'Terjadi kesalahan sistem.' });
    } finally {
      setIsSaving(false);
    }
  };

  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    try {
      const res = await fetch(`/api/admin/media/${deleteTarget.id}`, {
        method: 'DELETE',
      });
      const json = await res.json();
      if (json.success) {
        setToast({ type: 'success', message: 'Media berhasil dihapus dari pustaka.' });
        setDeleteTarget(null);
        fetchMedia();
      } else {
        setToast({ type: 'error', message: json.message || 'Gagal menghapus media.' });
      }
    } catch {
      setToast({ type: 'error', message: 'Terjadi kesalahan server saat menghapus.' });
    } finally {
      setIsDeleting(false);
    }
  };

  const handleCopyUrl = (mediaUrl: string) => {
    navigator.clipboard.writeText(mediaUrl);
    setToast({ type: 'success', message: 'URL media berhasil disalin ke clipboard.' });
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <AdminPageHeader
        title="Pustaka Media Terpusat (Media Library)"
        description="Kelola seluruh aset visual, logo, cover game, poster turnamen, dan foto dokumentasi dari satu tempat terpusat."
        badge="Asset Hub"
        action={
          <button
            onClick={() => setIsModalOpen(true)}
            className="px-4 py-2.5 bg-[var(--primary)] hover:opacity-90 text-white font-bold text-xs rounded-xl transition-all shadow-sm flex items-center gap-2 cursor-pointer"
          >
            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            <span>Tambah Asset Media</span>
          </button>
        }
      />

      {/* Floating Toast */}
      <Toast
        isVisible={!!toast}
        type={toast?.type}
        message={toast?.message || ''}
        onClose={() => setToast(null)}
      />

      {/* Confirmation Dialog */}
      <AdminConfirmDialog
        isOpen={!!deleteTarget}
        title="Hapus Asset Media?"
        message={`Asset "${deleteTarget?.filename}" akan dihapus permanen.`}
        confirmText="Hapus Media"
        isLoading={isDeleting}
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeleteTarget(null)}
      />

      {/* Search Bar & Stats */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-md">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari nama file atau deskripsi media..."
            className="w-full pl-9 pr-3.5 py-2 rounded-xl border border-slate-300 text-xs font-semibold text-slate-900 focus:outline-none focus:border-[var(--primary)]"
          />
          <svg className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>

        <div className="text-xs font-extrabold text-slate-500">
          Total Terdaftar: <span className="text-slate-900">{mediaList.length} Asset</span>
        </div>
      </div>

      {/* Media Grid */}
      {isLoading ? (
        <div className="p-12 text-center text-xs font-bold text-slate-400 bg-white rounded-2xl border border-slate-200 animate-pulse">
          Memuat asset dari pustaka media...
        </div>
      ) : mediaList.length === 0 ? (
        <AdminEmptyState
          title="Pustaka Media Kosong"
          description="Belum ada aset gambar atau media yang didaftarkan. Tambahkan aset pertama Anda."
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {mediaList.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col justify-between group hover:border-[var(--primary)]/40 transition-all duration-200"
            >
              {/* Media Thumbnail */}
              <div className="relative aspect-video bg-slate-100 overflow-hidden">
                <Image
                  src={item.url}
                  alt={item.altText || item.filename}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                  unoptimized
                />
                <span className="absolute top-2 left-2 px-2 py-0.5 rounded bg-slate-900/80 text-white font-mono text-[9px] font-bold uppercase">
                  {item.folder}
                </span>
              </div>

              {/* Media Info */}
              <div className="p-3.5 space-y-1.5 flex-1">
                <div className="text-xs font-black text-slate-900 truncate" title={item.filename}>
                  {item.filename}
                </div>
                <div className="text-[10px] text-slate-400 font-mono flex items-center justify-between">
                  <span>{formatFileSize(item.sizeBytes)}</span>
                  <span>{new Date(item.createdAt).toLocaleDateString('id-ID')}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="p-3 pt-0 flex items-center gap-2 border-t border-slate-100 pt-2.5">
                <button
                  type="button"
                  onClick={() => handleCopyUrl(item.url)}
                  className="flex-1 py-1.5 px-2 bg-slate-50 hover:bg-slate-100 text-slate-700 text-[11px] font-extrabold rounded-lg border border-slate-200 transition-colors cursor-pointer text-center"
                >
                  Salin URL
                </button>
                <button
                  type="button"
                  onClick={() => setDeleteTarget(item)}
                  className="p-1.5 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-lg text-xs font-bold transition-colors cursor-pointer shrink-0"
                  title="Hapus Media"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Media Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-lg w-full p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-black text-slate-900">Daftarkan Asset Media Baru</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                ✕
              </button>
            </div>

            <form onSubmit={handleAddMedia} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Nama File (Identifier)</label>
                <input
                  type="text"
                  required
                  value={filename}
                  onChange={(e) => setFilename(e.target.value)}
                  placeholder="contoh: ps5-pro-console.jpg"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-semibold text-slate-900 focus:outline-none focus:border-[var(--primary)]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">URL Media (Image Link)</label>
                <input
                  type="url"
                  required
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="https://... atau /images/..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 font-mono text-xs text-slate-900 focus:outline-none focus:border-[var(--primary)]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Deskripsi / Alt Text</label>
                <input
                  type="text"
                  value={altText}
                  onChange={(e) => setAltText(e.target.value)}
                  placeholder="Deskripsi singkat konten visual"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-semibold text-slate-900 focus:outline-none focus:border-[var(--primary)]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Kategori Folder</label>
                <select
                  value={folder}
                  onChange={(e) => setFolder(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-semibold text-slate-900 focus:outline-none focus:border-[var(--primary)]"
                >
                  <option value="general">Umum (General)</option>
                  <option value="branding">Branding & Logo</option>
                  <option value="games">Hardware & Game Covers</option>
                  <option value="events">Events & Tournaments</option>
                  <option value="gallery">Studio Gallery</option>
                </select>
              </div>

              <div className="flex justify-end gap-2.5 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-colors cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="px-5 py-2 bg-[var(--primary)] hover:opacity-90 text-white font-extrabold text-xs rounded-xl transition-all shadow-sm cursor-pointer disabled:opacity-50"
                >
                  {isSaving ? 'Menyimpan...' : 'Simpan Media'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
