'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { Toast } from '@/components/feedback/Toast';
import { ConfirmDialog } from '@/components/admin/ConfirmDialog';

interface GalleryPhotoItem {
  id: string;
  caption: string;
  displayOrder: number;
  media?: {
    url: string;
    altText?: string;
  };
}

export default function AdminGalleryPage() {
  const [photos, setPhotos] = useState<GalleryPhotoItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPhoto, setEditingPhoto] = useState<GalleryPhotoItem | null>(null);

  // Delete Confirm Dialog state
  const [deleteTarget, setDeleteTarget] = useState<{ id: string; title: string } | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const [title, setTitle] = useState('');
  const [caption, setCaption] = useState('');
  const [imageUrls, setImageUrls] = useState<string[]>(['']);
  const [displayOrder, setDisplayOrder] = useState(1);

  const [isSaving, setIsSaving] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const fetchPhotos = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/admin/gallery');
      const data = await res.json();
      if (data.success && Array.isArray(data.data)) {
        setPhotos(data.data);
      }
    } catch {
      setToast({ type: 'error', message: 'Gagal memuat data galeri.' });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPhotos();
  }, []);

  const handleOpenModal = (photo?: GalleryPhotoItem) => {
    if (photo) {
      setEditingPhoto(photo);
      const titlePart = photo.media?.altText || photo.caption.split('-')[0]?.trim() || '';
      const captionPart = photo.caption.includes('-') ? photo.caption.split('-').slice(1).join('-').trim() : photo.caption;
      setTitle(titlePart);
      setCaption(captionPart);
      setImageUrls([photo.media?.url || '']);
      setDisplayOrder(photo.displayOrder);
    } else {
      setEditingPhoto(null);
      setTitle('');
      setCaption('Foto dokumentasi suasana gaming lounge DsterGame Studio');
      setImageUrls(['https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=1200&auto=format&fit=crop']);
      setDisplayOrder(photos.length + 1);
    }
    setIsModalOpen(true);
  };

  const handleAddImageUrlField = () => {
    setImageUrls([...imageUrls, '']);
  };

  const handleRemoveImageUrlField = (index: number) => {
    if (imageUrls.length <= 1) return;
    setImageUrls(imageUrls.filter((_, i) => i !== index));
  };

  const handleImageUrlChange = (index: number, val: string) => {
    const updated = [...imageUrls];
    updated[index] = val;
    setImageUrls(updated);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    const validUrls = imageUrls.filter((u) => u.trim().length > 0);
    if (validUrls.length === 0) {
      setToast({ type: 'error', message: 'Setidaknya masukkan 1 URL gambar.' });
      setIsSaving(false);
      return;
    }

    try {
      if (editingPhoto) {
        const res = await fetch(`/api/admin/gallery/${editingPhoto.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            title,
            caption,
            imageUrl: validUrls[0],
            displayOrder,
          }),
        });
        const data = await res.json();
        if (data.success) {
          setToast({ type: 'success', message: 'Foto galeri berhasil diperbarui.' });
          setIsModalOpen(false);
          fetchPhotos();
        } else {
          setToast({ type: 'error', message: data.message || 'Gagal menyimpan foto.' });
        }
      } else {
        let successCount = 0;
        for (let i = 0; i < validUrls.length; i++) {
          const res = await fetch('/api/admin/gallery', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              title: validUrls.length > 1 ? `${title} (${i + 1})` : title,
              caption,
              imageUrl: validUrls[i],
              displayOrder: displayOrder + i,
            }),
          });
          const data = await res.json();
          if (data.success) successCount++;
        }

        setToast({ type: 'success', message: `${successCount} foto galeri berhasil ditambahkan.` });
        setIsModalOpen(false);
        fetchPhotos();
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
      const res = await fetch(`/api/admin/gallery/${deleteTarget.id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        setToast({ type: 'success', message: 'Foto galeri berhasil dihapus.' });
        setDeleteTarget(null);
        fetchPhotos();
      } else {
        setToast({ type: 'error', message: data.message || 'Gagal menghapus foto.' });
      }
    } catch {
      setToast({ type: 'error', message: 'Terjadi kesalahan sistem.' });
    } finally {
      setIsDeleting(false);
    }
  };

  const moveOrder = async (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= photos.length) return;

    const newPhotos = [...photos];
    const temp = newPhotos[index];
    newPhotos[index] = newPhotos[targetIndex];
    newPhotos[targetIndex] = temp;

    const payload = newPhotos.map((p, idx) => ({ id: p.id, displayOrder: idx + 1 }));
    setPhotos(newPhotos);

    try {
      await fetch('/api/admin/gallery/reorder', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items: payload }),
      });
      setToast({ type: 'success', message: 'Urutan galeri berhasil diperbarui.' });
    } catch {
      fetchPhotos();
    }
  };

  return (
    <div className="space-y-4">
      <Toast
        isVisible={!!toast}
        type={toast?.type}
        message={toast?.message || ''}
        onClose={() => setToast(null)}
      />

      <ConfirmDialog
        isOpen={deleteTarget !== null}
        title={`Hapus Foto "${deleteTarget?.title}"?`}
        message="Dokumentasi foto ini akan dihapus dari album galeri dan halaman website."
        isLoading={isDeleting}
        onConfirm={handleConfirmDelete}
        onClose={() => setDeleteTarget(null)}
      />

      {/* Action Header Bar right above gallery grid */}
      <div className="flex items-center justify-between bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/80 shadow-xs">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-slate-500">Total Foto:</span>
          <span className="px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 font-extrabold text-xs">
            {photos.length} Foto
          </span>
        </div>

        <button
          onClick={() => handleOpenModal()}
          className="px-4 py-2 bg-[var(--primary)] hover:opacity-90 text-white font-extrabold text-xs rounded-xl transition-all shadow-xs cursor-pointer flex items-center gap-1.5"
        >
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          <span>Tambah Foto Galeri</span>
        </button>
      </div>

      {isLoading ? (
        <div className="bg-white rounded-2xl border border-slate-200/80 p-12 text-center text-xs font-bold text-slate-400 animate-pulse">
          Memuat data galeri...
        </div>
      ) : photos.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200/80 p-12 text-center text-xs font-bold text-slate-400">
          Belum ada foto galeri terdaftar.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {photos.map((p, idx) => (
            <div key={p.id} className="bg-white rounded-2xl border border-slate-200/80 overflow-hidden flex flex-col justify-between shadow-xs hover:shadow-md transition-shadow">
              <div>
                <div className="relative w-full aspect-[4/3] bg-slate-100 overflow-hidden">
                  {p.media?.url && (
                    <Image
                      src={p.media.url}
                      alt={p.caption}
                      fill
                      className="object-cover"
                      unoptimized
                    />
                  )}
                  <div className="absolute top-2 left-2 bg-slate-900/80 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                    #{idx + 1}
                  </div>
                </div>

                <div className="p-4 space-y-1.5">
                  <h4 className="font-extrabold text-xs text-[var(--foreground)] truncate">
                    {p.media?.altText || p.caption.split('-')[0]}
                  </h4>
                  <p className="text-[11px] text-slate-500 line-clamp-2">{p.caption}</p>
                </div>
              </div>

              <div className="p-3 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => moveOrder(idx, 'up')}
                    disabled={idx === 0}
                    className="p-1.5 rounded-lg bg-white border border-slate-200 text-slate-600 hover:bg-slate-100 disabled:opacity-30 cursor-pointer"
                    title="Geser Naik"
                  >
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 15l7-7 7 7" />
                    </svg>
                  </button>
                  <button
                    onClick={() => moveOrder(idx, 'down')}
                    disabled={idx === photos.length - 1}
                    className="p-1.5 rounded-lg bg-white border border-slate-200 text-slate-600 hover:bg-slate-100 disabled:opacity-30 cursor-pointer"
                    title="Geser Turun"
                  >
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => handleOpenModal(p)}
                    className="px-2.5 py-1 bg-white hover:bg-slate-100 text-slate-700 rounded-lg text-xs font-bold border border-slate-200 cursor-pointer"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => setDeleteTarget({ id: p.id, title: p.media?.altText || p.caption.split('-')[0] })}
                    className="px-2.5 py-1 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-lg text-xs font-bold cursor-pointer"
                  >
                    Hapus
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal Form */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/80 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-7 max-w-lg w-full shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-extrabold text-slate-900">
                {editingPhoto ? 'Edit Foto Galeri' : 'Tambah Foto Galeri (Multi-Image Support)'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600 font-bold">✕</button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Judul Foto / Dokumentasi</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 font-semibold text-xs text-slate-900 focus:outline-none focus:border-[var(--primary)]"
                  placeholder="Contoh: PS5 VIP Lounge & Racing Rig"
                />
              </div>

              {/* Multi-Image URL Input Fields */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-bold text-slate-700">URL Gambar ({imageUrls.length} Gambar)</label>
                  {!editingPhoto && (
                    <button
                      type="button"
                      onClick={handleAddImageUrlField}
                      className="text-xs font-bold text-[var(--primary)] hover:underline cursor-pointer"
                    >
                      + Tambah Baris Gambar
                    </button>
                  )}
                </div>

                {imageUrls.map((url, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <input
                      type="url"
                      required
                      value={url}
                      onChange={(e) => handleImageUrlChange(idx, e.target.value)}
                      className="flex-1 px-3.5 py-2 rounded-xl border border-slate-200 font-mono text-xs text-slate-900 focus:outline-none focus:border-[var(--primary)]"
                      placeholder="https://images.unsplash.com/... atau /Gallery/..."
                    />
                    {imageUrls.length > 1 && !editingPhoto && (
                      <button
                        type="button"
                        onClick={() => handleRemoveImageUrlField(idx)}
                        className="p-2 text-rose-500 hover:text-rose-700 cursor-pointer"
                        title="Hapus baris"
                      >
                        ✕
                      </button>
                    )}
                  </div>
                ))}
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Deskripsi / Caption Foto</label>
                <textarea
                  rows={3}
                  value={caption}
                  onChange={(e) => setCaption(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 font-semibold text-xs text-slate-900 focus:outline-none focus:border-[var(--primary)]"
                  placeholder="Deskripsi fasilitas, kenyamanan, atau turnamen..."
                />
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
                  className="px-5 py-2.5 bg-[var(--primary)] hover:opacity-90 text-white font-extrabold text-xs rounded-xl transition-all shadow-xs cursor-pointer disabled:opacity-50"
                >
                  {isSaving ? 'Menyimpan...' : 'Simpan Foto'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
