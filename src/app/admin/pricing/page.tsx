'use client';

import React, { useState, useEffect } from 'react';
import { Toast } from '@/components/feedback/Toast';
import { ConfirmDialog } from '@/components/admin/ConfirmDialog';

interface PricingItem {
  id: string;
  name: string;
  price: number;
  duration: string;
  features: string;
  displayOrder: number;
}

interface PricingCategory {
  id: string;
  name: string;
  slug: string;
  items: PricingItem[];
}

export default function AdminPricingPage() {
  const [categories, setCategories] = useState<PricingCategory[]>([]);
  const [activeTabId, setActiveTabId] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<PricingItem | null>(null);

  // Delete Confirm Dialog state
  const [deleteTarget, setDeleteTarget] = useState<{ id: string; name: string } | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const [categoryId, setCategoryId] = useState('');
  const [name, setName] = useState('');
  const [price, setPrice] = useState<number>(14000);
  const [duration, setDuration] = useState('1 Jam');
  const [features, setFeatures] = useState('');
  const [displayOrder, setDisplayOrder] = useState(1);

  const [isSaving, setIsSaving] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const fetchPricing = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/admin/pricing');
      const data = await res.json();
      if (data.success && Array.isArray(data.data)) {
        setCategories(data.data);
        if (data.data.length > 0 && !activeTabId) {
          setActiveTabId(data.data[0].id);
        }
      }
    } catch {
      setToast({ type: 'error', message: 'Gagal memuat data paket harga.' });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPricing();
  }, []);

  const activeCategory = categories.find((c) => c.id === activeTabId) || categories[0];

  const handleOpenModal = (catId: string, item?: PricingItem) => {
    setCategoryId(catId);
    if (item) {
      setEditingItem(item);
      setName(item.name);
      setPrice(item.price);
      setDuration(item.duration);
      setFeatures(item.features || '');
      setDisplayOrder(item.displayOrder);
    } else {
      setEditingItem(null);
      setName('');
      setPrice(14000);
      setDuration('1 Jam');
      setFeatures('TV LED 4K, Kursi Sofa Ergonomis, 2 Controller Original');
      setDisplayOrder(1);
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    const payload = { categoryId, name, price, duration, features, displayOrder };

    try {
      const url = editingItem ? `/api/admin/pricing/${editingItem.id}` : '/api/admin/pricing';
      const method = editingItem ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (data.success) {
        setToast({ type: 'success', message: editingItem ? 'Item harga berhasil diperbarui.' : 'Item harga berhasil ditambahkan.' });
        setIsModalOpen(false);
        fetchPricing();
      } else {
        setToast({ type: 'error', message: data.message || 'Gagal menyimpan item harga.' });
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
      const res = await fetch(`/api/admin/pricing/${deleteTarget.id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        setToast({ type: 'success', message: 'Item harga berhasil dihapus.' });
        setDeleteTarget(null);
        fetchPricing();
      } else {
        setToast({ type: 'error', message: data.message || 'Gagal menghapus item harga.' });
      }
    } catch {
      setToast({ type: 'error', message: 'Terjadi kesalahan sistem.' });
    } finally {
      setIsDeleting(false);
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
        title={`Hapus Paket "${deleteTarget?.name}"?`}
        message="Baris tarif paket ini akan dihapus dari tabel daftar harga dan website."
        isLoading={isDeleting}
        onConfirm={handleConfirmDelete}
        onClose={() => setDeleteTarget(null)}
      />

      {isLoading ? (
        <div className="bg-white rounded-2xl border border-slate-200/80 p-12 text-center text-xs font-bold text-slate-400 animate-pulse">
          Memuat data paket harga...
        </div>
      ) : categories.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200/80 p-12 text-center text-xs font-bold text-slate-400">
          Belum ada kategori tarif harga terdaftar.
        </div>
      ) : (
        <div className="space-y-4">
          {/* Category Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-0.5 no-scrollbar bg-white p-2.5 rounded-2xl border border-slate-200/80 shadow-xs">
            {categories.map((cat) => {
              const isActive = cat.id === activeCategory?.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setActiveTabId(cat.id)}
                  className={`px-4 py-2 rounded-xl font-extrabold text-xs transition-all shrink-0 cursor-pointer flex items-center gap-2 ${
                    isActive
                      ? 'bg-[var(--primary)] text-white shadow-xs'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  <span>{cat.name}</span>
                  <span className={`text-[10px] px-1.5 py-0.5 rounded-md font-bold ${
                    isActive ? 'bg-white/20 text-white' : 'bg-white text-slate-600'
                  }`}>
                    {cat.items?.length || 0} paket
                  </span>
                </button>
              );
            })}
          </div>

          {/* Active Category Table with contextual action button */}
          {activeCategory && (
            <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
              <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-extrabold text-[var(--foreground)]">{activeCategory.name}</h3>
                  <span className="text-[10px] font-mono text-blue-600 font-bold uppercase">{activeCategory.slug}</span>
                </div>
                <button
                  onClick={() => handleOpenModal(activeCategory.id)}
                  className="px-4 py-2 bg-[var(--primary)] hover:opacity-90 text-white font-extrabold text-xs rounded-xl transition-all shadow-xs cursor-pointer flex items-center gap-1.5"
                >
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  <span>Tambah Baris Paket</span>
                </button>
              </div>

              {activeCategory.items?.length === 0 ? (
                <div className="p-8 text-center text-xs font-bold text-slate-400">
                  Belum ada baris paket di kategori ini.
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-extrabold text-slate-500 uppercase tracking-wider">
                        <th className="py-3 px-4">Nama Paket / Unit</th>
                        <th className="py-3 px-4">Durasi</th>
                        <th className="py-3 px-4">Harga (IDR)</th>
                        <th className="py-3 px-4">Fasilitas / Features</th>
                        <th className="py-3 px-4 w-28 text-right">Aksi</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-xs font-semibold text-slate-700">
                      {activeCategory.items.map((item) => (
                        <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                          <td className="py-3.5 px-4 font-bold text-[var(--foreground)]">{item.name}</td>
                          <td className="py-3.5 px-4 font-bold text-blue-600">{item.duration}</td>
                          <td className="py-3.5 px-4 font-extrabold text-[var(--foreground)]">
                            Rp {Number(item.price).toLocaleString('id-ID')}
                          </td>
                          <td className="py-3.5 px-4 text-slate-500 max-w-xs truncate">{item.features || '-'}</td>
                          <td className="py-3.5 px-4 text-right space-x-1.5 shrink-0">
                            <button
                              onClick={() => handleOpenModal(activeCategory.id, item)}
                              className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-bold transition-colors cursor-pointer"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => setDeleteTarget({ id: item.id, name: item.name })}
                              className="px-2.5 py-1 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-lg text-xs font-bold transition-colors cursor-pointer"
                            >
                              Hapus
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Modal Form */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/80 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-7 max-w-md w-full shadow-2xl space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-extrabold text-slate-900">
                {editingItem ? 'Edit Item Paket Harga' : 'Tambah Paket Harga Baru'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600 font-bold">✕</button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Nama Paket / Konsol</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 font-semibold text-xs text-slate-900 focus:outline-none focus:border-[var(--primary)]"
                  placeholder="Contoh: PlayStation 5"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Durasi</label>
                  <input
                    type="text"
                    required
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 font-semibold text-xs text-slate-900 focus:outline-none focus:border-[var(--primary)]"
                    placeholder="1 Jam / 12 Jam / 24 Jam"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Tarif (Rp)</label>
                  <input
                    type="number"
                    required
                    min={0}
                    value={price}
                    onChange={(e) => setPrice(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 font-bold text-xs text-slate-900 focus:outline-none focus:border-[var(--primary)]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Fasilitas Termasuk (Pisahkan dengan koma)</label>
                <textarea
                  rows={3}
                  value={features}
                  onChange={(e) => setFeatures(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 font-semibold text-xs text-slate-900 focus:outline-none focus:border-[var(--primary)]"
                  placeholder="TV OLED 4K 50 Inci, Kursi Sofa Ergonomis, 2 Stik DualSense"
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
                  {isSaving ? 'Menyimpan...' : 'Simpan Paket'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
