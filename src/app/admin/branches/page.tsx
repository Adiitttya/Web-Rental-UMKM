'use client';

import React, { useState, useEffect } from 'react';
import { Toast } from '@/components/feedback/Toast';
import { ConfirmDialog } from '@/components/admin/ConfirmDialog';
import { parseCoordinatesFromInput } from '@/utils/mapUtils';

interface BranchItem {
  id: string;
  name: string;
  address: string;
  latitude: number;
  longitude: number;
  phone: string;
  mapUrl: string;
  operationalHours: string;
  isPrimary: boolean;
  displayOrder: number;
}

export default function AdminBranchesPage() {
  const [branches, setBranches] = useState<BranchItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBranch, setEditingBranch] = useState<BranchItem | null>(null);

  // Delete Confirm Dialog state
  const [deleteTarget, setDeleteTarget] = useState<{ id: string; name: string } | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [latitude, setLatitude] = useState<number>(-7.133860);
  const [longitude, setLongitude] = useState<number>(110.398851);
  const [phone, setPhone] = useState('');
  const [mapUrl, setMapUrl] = useState('');
  const [operationalHours, setOperationalHours] = useState('06.00 - 24.00 WIB');
  const [isPrimary, setIsPrimary] = useState(false);
  const [displayOrder, setDisplayOrder] = useState(1);

  const [isSaving, setIsSaving] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const fetchBranches = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/admin/branches');
      const data = await res.json();
      if (data.success && Array.isArray(data.data)) {
        setBranches(data.data);
      }
    } catch {
      setToast({ type: 'error', message: 'Gagal memuat data cabang.' });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBranches();
  }, []);

  const handleMapUrlChange = (url: string) => {
    setMapUrl(url);
    const parsed = parseCoordinatesFromInput(url);
    if (parsed.latitude !== null && parsed.longitude !== null) {
      setLatitude(parsed.latitude);
      setLongitude(parsed.longitude);
      setToast({ type: 'success', message: `Koordinat berhasil diekstrak: ${parsed.latitude}, ${parsed.longitude}` });
    }
  };

  const handleOpenModal = (branch?: BranchItem) => {
    if (branch) {
      setEditingBranch(branch);
      setName(branch.name);
      setAddress(branch.address);
      setLatitude(branch.latitude);
      setLongitude(branch.longitude);
      setPhone(branch.phone || '');
      setMapUrl(branch.mapUrl || '');
      setOperationalHours(branch.operationalHours || '06.00 - 24.00 WIB');
      setIsPrimary(branch.isPrimary);
      setDisplayOrder(branch.displayOrder);
    } else {
      setEditingBranch(null);
      setName('');
      setAddress('');
      setLatitude(-7.133860);
      setLongitude(110.398851);
      setPhone('081234567890');
      setMapUrl('');
      setOperationalHours('06.00 - 24.00 WIB');
      setIsPrimary(false);
      setDisplayOrder(branches.length + 1);
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    const payload = {
      name,
      address,
      latitude,
      longitude,
      phone,
      mapUrl,
      operationalHours,
      isPrimary,
      displayOrder,
    };

    try {
      const url = editingBranch ? `/api/admin/branches/${editingBranch.id}` : '/api/admin/branches';
      const method = editingBranch ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (data.success) {
        setToast({ type: 'success', message: editingBranch ? 'Data cabang berhasil diperbarui.' : 'Cabang baru berhasil ditambahkan.' });
        setIsModalOpen(false);
        fetchBranches();
      } else {
        setToast({ type: 'error', message: data.message || 'Gagal menyimpan cabang.' });
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
      const res = await fetch(`/api/admin/branches/${deleteTarget.id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        setToast({ type: 'success', message: 'Cabang berhasil dihapus.' });
        setDeleteTarget(null);
        fetchBranches();
      } else {
        setToast({ type: 'error', message: data.message || 'Gagal menghapus cabang.' });
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
        title={`Hapus Cabang "${deleteTarget?.name}"?`}
        message="Lokasi cabang ini akan dihapus dari daftar cabang dan peta interaktif website."
        isLoading={isDeleting}
        onConfirm={handleConfirmDelete}
        onClose={() => setDeleteTarget(null)}
      />

      {/* Action Header Bar directly above branches grid */}
      <div className="flex items-center justify-between bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/80 shadow-xs">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-slate-500">Total Cabang:</span>
          <span className="px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 font-extrabold text-xs">
            {branches.length} Lokasi
          </span>
        </div>

        <button
          onClick={() => handleOpenModal()}
          className="px-4 py-2 bg-[var(--primary)] hover:opacity-90 text-white font-extrabold text-xs rounded-xl transition-all shadow-xs cursor-pointer flex items-center gap-1.5"
        >
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          <span>Tambah Cabang</span>
        </button>
      </div>

      {isLoading ? (
        <div className="bg-white rounded-2xl border border-slate-200/80 p-12 text-center text-xs font-bold text-slate-400 animate-pulse">
          Memuat data cabang...
        </div>
      ) : branches.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200/80 p-12 text-center text-xs font-bold text-slate-400">
          Belum ada data cabang terdaftar.
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {branches.map((b) => (
            <div key={b.id} className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden p-5 sm:p-6 flex flex-col justify-between space-y-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div className="flex items-center gap-2">
                    <h3 className="font-extrabold text-base text-[var(--foreground)]">{b.name}</h3>
                    {b.isPrimary && (
                      <span className="px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 text-[10px] font-bold">
                        Utama
                      </span>
                    )}
                  </div>
                  <span className="text-[10px] font-mono font-bold text-slate-400">ID: {b.id.slice(0, 8)}</span>
                </div>

                <div className="space-y-2 text-xs text-slate-600">
                  <div className="flex items-start gap-2">
                    <span className="font-bold text-slate-400 shrink-0">Alamat:</span>
                    <span className="font-medium text-slate-800">{b.address}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-400 shrink-0">Telepon/WA:</span>
                    <span className="font-bold text-blue-600">{b.phone}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-400 shrink-0">Jam Buka:</span>
                    <span className="font-medium text-slate-800">{b.operationalHours}</span>
                  </div>
                  <div className="flex items-center gap-2 font-mono text-[11px] text-slate-500">
                    <span className="font-bold text-slate-400 font-sans shrink-0">Koordinat:</span>
                    <span>{b.latitude}, {b.longitude}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                {b.mapUrl ? (
                  <a
                    href={b.mapUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs font-bold text-[var(--primary)] hover:underline flex items-center gap-1"
                  >
                    <span>Buka Google Maps</span>
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </a>
                ) : <span />}

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleOpenModal(b)}
                    className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-bold transition-colors cursor-pointer"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => setDeleteTarget({ id: b.id, name: b.name })}
                    className="px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-xl text-xs font-bold transition-colors cursor-pointer"
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
                {editingBranch ? 'Edit Lokasi Cabang' : 'Tambah Cabang Baru'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600 font-bold">✕</button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Nama Cabang</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 font-semibold text-xs text-slate-900 focus:outline-none focus:border-[var(--primary)]"
                  placeholder="Contoh: DsterGame Cabang 2 (Gedongsongo)"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Alamat Lengkap</label>
                <textarea
                  required
                  rows={2}
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 font-semibold text-xs text-slate-900 focus:outline-none focus:border-[var(--primary)]"
                  placeholder="Jl. Gedongsongo No. 17, Ungaran Barat..."
                />
              </div>

              {/* Smart Maps Link & Parser */}
              <div className="p-3.5 bg-blue-50/50 rounded-xl border border-blue-100 space-y-2">
                <label className="block text-xs font-bold text-blue-950">
                  Link Google Maps (Ekstrak Koordinat Otomatis)
                </label>
                <input
                  type="url"
                  value={mapUrl}
                  onChange={(e) => handleMapUrlChange(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-blue-200 font-mono text-xs text-slate-900 bg-white focus:outline-none focus:border-[var(--primary)]"
                  placeholder="Paste URL Google Maps disini..."
                />
                <p className="text-[10px] text-blue-800/80 font-medium">
                  Paste link Maps di atas untuk mengisi latitude & longitude otomatis, atau isi manual di bawah.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Latitude</label>
                  <input
                    type="number"
                    step="any"
                    required
                    value={latitude}
                    onChange={(e) => setLatitude(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 font-mono text-xs text-slate-900 focus:outline-none focus:border-[var(--primary)]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Longitude</label>
                  <input
                    type="number"
                    step="any"
                    required
                    value={longitude}
                    onChange={(e) => setLongitude(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 font-mono text-xs text-slate-900 focus:outline-none focus:border-[var(--primary)]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Nomor WhatsApp / Phone</label>
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 font-semibold text-xs text-slate-900 focus:outline-none focus:border-[var(--primary)]"
                    placeholder="085172412206"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Jam Operasional</label>
                  <input
                    type="text"
                    value={operationalHours}
                    onChange={(e) => setOperationalHours(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 font-semibold text-xs text-slate-900 focus:outline-none focus:border-[var(--primary)]"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="isPrimary"
                  checked={isPrimary}
                  onChange={(e) => setIsPrimary(e.target.checked)}
                  className="w-4 h-4 rounded text-blue-600 cursor-pointer"
                />
                <label htmlFor="isPrimary" className="text-xs font-bold text-slate-700 cursor-pointer">
                  Tandai sebagai Cabang Utama (Primary Branch)
                </label>
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
                  {isSaving ? 'Menyimpan...' : 'Simpan Cabang'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
