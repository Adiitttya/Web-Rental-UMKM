'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { Toast } from '@/components/feedback/Toast';
import { ConfirmDialog } from '@/components/admin/ConfirmDialog';

interface GameItem {
  id: string;
  title: string;
  slug: string;
  genre: string | null;
  isPopular: boolean;
  displayOrder: number;
}

interface HardwareDevice {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  isAvailable: boolean;
  displayOrder: number;
  games: GameItem[];
}

interface HardwareCategory {
  id: string;
  name: string;
  slug: string;
  displayOrder: number;
  hardwares: HardwareDevice[];
}

export default function AdminGamesPage() {
  const [categories, setCategories] = useState<HardwareCategory[]>([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>('');
  const [selectedDeviceId, setSelectedDeviceId] = useState<string>('');
  const [searchGameQuery, setSearchGameQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  // Delete Confirm Dialog state
  const [deleteTarget, setDeleteTarget] = useState<{ type: 'device' | 'game'; id: string; name: string } | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Modals
  const [isDeviceModalOpen, setIsDeviceModalOpen] = useState(false);
  const [editingDevice, setEditingDevice] = useState<HardwareDevice | null>(null);
  const [deviceName, setDeviceName] = useState('');
  const [deviceBranch, setDeviceBranch] = useState('Cabang 1 (Gedongsongo)');
  const [deviceIsAvailable, setDeviceIsAvailable] = useState(true);

  const [isGameModalOpen, setIsGameModalOpen] = useState(false);
  const [editingGame, setEditingGame] = useState<GameItem | null>(null);
  const [gameTitle, setGameTitle] = useState('');
  const [gameGenre, setGameGenre] = useState('Action');
  const [gameIsPopular, setGameIsPopular] = useState(false);

  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');

  const [isSaving, setIsSaving] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const fetchCatalog = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/admin/games');
      const data = await res.json();
      if (data.success && Array.isArray(data.data)) {
        setCategories(data.data);

        if (data.data.length > 0) {
          const currentCat = data.data.find((c: HardwareCategory) => c.id === selectedCategoryId) || data.data[0];
          setSelectedCategoryId(currentCat.id);

          if (currentCat.hardwares.length > 0) {
            const currentDev = currentCat.hardwares.find((h: HardwareDevice) => h.id === selectedDeviceId) || currentCat.hardwares[0];
            setSelectedDeviceId(currentDev.id);
          } else {
            setSelectedDeviceId('');
          }
        }
      }
    } catch {
      setToast({ type: 'error', message: 'Gagal memuat katalog hardware & game.' });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCatalog();
  }, []);

  const activeCategory = useMemo(() => {
    return categories.find((c) => c.id === selectedCategoryId) || categories[0];
  }, [categories, selectedCategoryId]);

  const activeDevice = useMemo(() => {
    if (!activeCategory || !activeCategory.hardwares) return null;
    return activeCategory.hardwares.find((h) => h.id === selectedDeviceId) || activeCategory.hardwares[0] || null;
  }, [activeCategory, selectedDeviceId]);

  const filteredGames = useMemo(() => {
    if (!activeDevice || !activeDevice.games) return [];
    if (!searchGameQuery.trim()) return activeDevice.games;
    const q = searchGameQuery.toLowerCase();
    return activeDevice.games.filter((g) => g.title.toLowerCase().includes(q) || (g.genre && g.genre.toLowerCase().includes(q)));
  }, [activeDevice, searchGameQuery]);

  const handleSelectCategory = (catId: string) => {
    setSelectedCategoryId(catId);
    const cat = categories.find((c) => c.id === catId);
    if (cat && cat.hardwares.length > 0) {
      setSelectedDeviceId(cat.hardwares[0].id);
    } else {
      setSelectedDeviceId('');
    }
  };

  // Device Actions
  const handleOpenDeviceModal = (dev?: HardwareDevice) => {
    if (dev) {
      setEditingDevice(dev);
      setDeviceName(dev.name);
      setDeviceBranch(dev.description || 'Cabang 1 (Gedongsongo)');
      setDeviceIsAvailable(dev.isAvailable);
    } else {
      setEditingDevice(null);
      setDeviceName('');
      setDeviceBranch('Cabang 1 (Gedongsongo)');
      setDeviceIsAvailable(true);
    }
    setIsDeviceModalOpen(true);
  };

  const handleSaveDevice = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeCategory) return;
    setIsSaving(true);

    try {
      const url = editingDevice ? `/api/admin/games/${editingDevice.id}` : '/api/admin/games';
      const method = editingDevice ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: deviceName,
          categoryId: activeCategory.id,
          description: deviceBranch,
          isAvailable: deviceIsAvailable,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setToast({ type: 'success', message: editingDevice ? 'Device unit berhasil diperbarui.' : 'Device unit baru berhasil ditambahkan.' });
        setIsDeviceModalOpen(false);
        fetchCatalog();
      } else {
        setToast({ type: 'error', message: data.message || 'Gagal menyimpan device.' });
      }
    } catch {
      setToast({ type: 'error', message: 'Terjadi kesalahan sistem.' });
    } finally {
      setIsSaving(false);
    }
  };

  // Game Actions
  const handleOpenGameModal = (game?: GameItem) => {
    if (game) {
      setEditingGame(game);
      setGameTitle(game.title);
      setGameGenre(game.genre || 'Action');
      setGameIsPopular(game.isPopular);
    } else {
      setEditingGame(null);
      setGameTitle('');
      setGameGenre('Action');
      setGameIsPopular(false);
    }
    setIsGameModalOpen(true);
  };

  const handleSaveGame = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeDevice) return;
    setIsSaving(true);

    try {
      const url = editingGame ? `/api/admin/games/items/${editingGame.id}` : '/api/admin/games/items';
      const method = editingGame ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: gameTitle,
          hardwareId: activeDevice.id,
          genre: gameGenre,
          isPopular: gameIsPopular,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setToast({ type: 'success', message: editingGame ? 'Game berhasil diperbarui.' : 'Game berhasil ditambahkan ke device.' });
        setIsGameModalOpen(false);
        fetchCatalog();
      } else {
        setToast({ type: 'error', message: data.message || 'Gagal menyimpan game.' });
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
      const url = deleteTarget.type === 'device'
        ? `/api/admin/games/${deleteTarget.id}`
        : `/api/admin/games/items/${deleteTarget.id}`;

      const res = await fetch(url, { method: 'DELETE' });
      const data = await res.json();

      if (data.success) {
        setToast({
          type: 'success',
          message: deleteTarget.type === 'device' ? 'Device unit berhasil dihapus.' : 'Game berhasil dihapus.',
        });
        setDeleteTarget(null);
        fetchCatalog();
      } else {
        setToast({ type: 'error', message: data.message || 'Gagal menghapus item.' });
      }
    } catch {
      setToast({ type: 'error', message: 'Terjadi kesalahan sistem.' });
    } finally {
      setIsDeleting(false);
    }
  };

  // Add Category Action
  const handleSaveCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCategoryName.trim()) return;

    try {
      const res = await fetch('/api/admin/games/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newCategoryName }),
      });

      const data = await res.json();
      if (data.success) {
        setToast({ type: 'success', message: 'Kategori hardware card baru berhasil ditambahkan.' });
        setIsCategoryModalOpen(false);
        setNewCategoryName('');
        fetchCatalog();
      } else {
        setToast({ type: 'error', message: data.message || 'Gagal membuat kategori.' });
      }
    } catch {
      setToast({ type: 'error', message: 'Terjadi kesalahan sistem.' });
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
        title={deleteTarget?.type === 'device' ? `Hapus Device "${deleteTarget?.name}"?` : `Hapus Game "${deleteTarget?.name}"?`}
        message={
          deleteTarget?.type === 'device'
            ? 'Device unit beserta seluruh game yang terpasang di dalamnya akan dihapus dari database.'
            : 'Game ini akan dihapus dari daftar katalog unit device ini.'
        }
        isLoading={isDeleting}
        onConfirm={handleConfirmDelete}
        onClose={() => setDeleteTarget(null)}
      />

      {isLoading ? (
        <div className="bg-white rounded-2xl border border-slate-200/80 p-12 text-center text-xs font-bold text-slate-400 animate-pulse">
          Memuat seluruh hierarki katalog hardware dan game...
        </div>
      ) : categories.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200/80 p-12 text-center text-xs font-bold text-slate-400">
          Belum ada kategori hardware terdaftar.
        </div>
      ) : (
        <div className="space-y-4">
          {/* Level 1: Hardware Category Tabs + Direct "+ Kategori" Button */}
          <div className="flex items-center justify-between gap-3 bg-white p-2.5 rounded-2xl border border-slate-200/80 shadow-xs">
            <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-0.5">
              {categories.map((cat) => {
                const isCatActive = cat.id === activeCategory?.id;
                const totalDevices = cat.hardwares?.length || 0;
                const totalGames = cat.hardwares?.reduce((acc, h) => acc + (h.games?.length || 0), 0) || 0;

                return (
                  <button
                    key={cat.id}
                    onClick={() => handleSelectCategory(cat.id)}
                    className={`px-4 py-2 rounded-xl font-extrabold text-xs transition-all shrink-0 cursor-pointer flex items-center gap-2 ${
                      isCatActive
                        ? 'bg-[var(--primary)] text-white shadow-xs'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    <span>{cat.name}</span>
                    <span className={`text-[10px] px-1.5 py-0.5 rounded-md font-bold ${
                      isCatActive ? 'bg-white/20 text-white' : 'bg-white text-slate-600'
                    }`}>
                      {totalDevices} unit ({totalGames} game)
                    </span>
                  </button>
                );
              })}
            </div>

            <button
              onClick={() => setIsCategoryModalOpen(true)}
              className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs rounded-xl transition-colors cursor-pointer shrink-0 flex items-center gap-1.5"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              <span>Kategori Card</span>
            </button>
          </div>

          {/* Level 2 & 3: Device Grid & Selected Device Game List */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
            {/* Left Column (5 Cols): Device Units List */}
            <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200/80 p-4 sm:p-5 space-y-3.5 shadow-xs">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div>
                  <h3 className="text-sm font-extrabold text-[var(--foreground)]">Unit ({activeCategory?.name})</h3>
                  <p className="text-[11px] text-slate-500 font-medium">{activeCategory?.hardwares?.length || 0} unit device terdaftar</p>
                </div>
                <button
                  onClick={() => handleOpenDeviceModal()}
                  className="px-3 py-1.5 bg-[var(--primary)] hover:opacity-90 text-white font-extrabold text-xs rounded-xl transition-all shadow-xs cursor-pointer flex items-center gap-1 shrink-0"
                >
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  <span>Tambah Unit</span>
                </button>
              </div>

              {activeCategory?.hardwares?.length === 0 ? (
                <div className="p-8 text-center text-xs font-bold text-slate-400 bg-slate-50 rounded-xl border border-dashed border-slate-200">
                  Belum ada unit device di kategori ini.
                </div>
              ) : (
                <div className="space-y-2 max-h-[600px] overflow-y-auto pr-1">
                  {activeCategory?.hardwares?.map((dev) => {
                    const isDevActive = dev.id === activeDevice?.id;
                    return (
                      <div
                        key={dev.id}
                        onClick={() => setSelectedDeviceId(dev.id)}
                        className={`p-3 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                          isDevActive
                            ? 'border-[var(--primary)] bg-blue-50/50 shadow-xs'
                            : 'border-slate-200 hover:border-slate-300 bg-slate-50/30'
                        }`}
                      >
                        <div className="min-w-0 pr-2">
                          <div className="flex items-center gap-2">
                            <h4 className="font-extrabold text-xs text-[var(--foreground)] truncate">{dev.name}</h4>
                            {!dev.isAvailable && (
                              <span className="text-[9px] px-1.5 py-0.5 rounded bg-slate-200 text-slate-600 font-bold">Non-aktif</span>
                            )}
                          </div>
                          <p className="text-[10px] text-slate-500 font-medium truncate mt-0.5">{dev.description || 'Cabang Utama'}</p>
                          <span className="inline-block mt-1 text-[10px] font-bold text-blue-600 bg-blue-100/60 px-2 py-0.5 rounded-md">
                            {dev.games?.length || 0} Games Terpasang
                          </span>
                        </div>

                        <div className="flex items-center gap-1 shrink-0" onClick={(e) => e.stopPropagation()}>
                          <button
                            onClick={() => handleOpenDeviceModal(dev)}
                            className="p-1.5 text-slate-500 hover:text-slate-800 hover:bg-slate-200/60 rounded-lg transition-colors cursor-pointer"
                            title="Edit Device"
                          >
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                            </svg>
                          </button>
                          <button
                            onClick={() => setDeleteTarget({ type: 'device', id: dev.id, name: dev.name })}
                            className="p-1.5 text-rose-500 hover:text-rose-700 hover:bg-rose-100/60 rounded-lg transition-colors cursor-pointer"
                            title="Hapus Device"
                          >
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Right Column (7 Cols): Games Inside Selected Device Unit */}
            <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200/80 p-4 sm:p-5 space-y-3.5 shadow-xs">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 border-b border-slate-100 pb-3">
                <div>
                  <h3 className="text-sm font-extrabold text-[var(--foreground)]">
                    Daftar Game: {activeDevice ? activeDevice.name : 'Pilih Unit'}
                  </h3>
                  <p className="text-[11px] text-slate-500 font-medium">
                    {activeDevice?.games?.length || 0} game tersimpan untuk unit ini
                  </p>
                </div>
                {activeDevice && (
                  <button
                    onClick={() => handleOpenGameModal()}
                    className="px-3.5 py-1.5 bg-[var(--primary)] hover:opacity-90 text-white font-extrabold text-xs rounded-xl transition-all shadow-xs cursor-pointer shrink-0 flex items-center gap-1 self-start sm:self-auto"
                  >
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    <span>Tambah Game</span>
                  </button>
                )}
              </div>

              {/* Game Search Bar */}
              <div className="flex items-center gap-2 bg-slate-50 px-3 py-2 rounded-xl border border-slate-200">
                <svg className="w-4 h-4 text-slate-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input
                  type="text"
                  value={searchGameQuery}
                  onChange={(e) => setSearchGameQuery(e.target.value)}
                  placeholder={`Cari game di unit ${activeDevice?.name || ''}...`}
                  className="bg-transparent border-none text-xs text-slate-900 font-semibold focus:outline-none w-full placeholder-slate-400"
                />
                {searchGameQuery && (
                  <button onClick={() => setSearchGameQuery('')} className="text-xs text-slate-400 hover:text-slate-700">
                    ✕
                  </button>
                )}
              </div>

              {!activeDevice ? (
                <div className="p-8 text-center text-xs font-bold text-slate-400 bg-slate-50 rounded-xl border border-dashed border-slate-200">
                  Silakan pilih unit device di sebelah kiri terlebih dahulu.
                </div>
              ) : filteredGames.length === 0 ? (
                <div className="p-8 text-center text-xs font-bold text-slate-400 bg-slate-50 rounded-xl border border-dashed border-slate-200">
                  {searchGameQuery ? `Tidak ada game dengan kata kunci "${searchGameQuery}"` : 'Belum ada game terpasang di unit ini.'}
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-h-[520px] overflow-y-auto pr-1">
                  {filteredGames.map((game, idx) => (
                    <div
                      key={game.id}
                      className="p-3 rounded-xl border border-slate-200/80 bg-slate-50/50 hover:bg-blue-50/30 hover:border-blue-200 transition-all flex items-center justify-between"
                    >
                      <div className="min-w-0 pr-2">
                        <div className="flex items-center gap-1.5">
                          <span className="text-[10px] font-bold text-slate-400">#{idx + 1}</span>
                          <h5 className="font-bold text-xs text-[var(--foreground)] truncate">{game.title}</h5>
                        </div>
                        <span className="text-[10px] text-slate-500 font-medium">{game.genre || 'General'}</span>
                      </div>
                      <div className="flex items-center gap-1 shrink-0">
                        <button
                          onClick={() => handleOpenGameModal(game)}
                          className="p-1 text-slate-500 hover:text-slate-800 hover:bg-slate-200 rounded cursor-pointer"
                          title="Edit Game"
                        >
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                          </svg>
                        </button>
                        <button
                          onClick={() => setDeleteTarget({ type: 'game', id: game.id, name: game.title })}
                          className="p-1 text-rose-500 hover:text-rose-700 hover:bg-rose-100 rounded cursor-pointer"
                          title="Hapus Game"
                        >
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Modal: Device Unit Form */}
      {isDeviceModalOpen && (
        <div className="fixed inset-0 bg-slate-900/80 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-7 max-w-md w-full shadow-2xl space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-extrabold text-slate-900">
                {editingDevice ? 'Edit Device Unit' : `Tambah Device di ${activeCategory?.name}`}
              </h3>
              <button onClick={() => setIsDeviceModalOpen(false)} className="text-slate-400 hover:text-slate-600 font-bold">✕</button>
            </div>

            <form onSubmit={handleSaveDevice} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Nama Device Unit</label>
                <input
                  type="text"
                  required
                  value={deviceName}
                  onChange={(e) => setDeviceName(e.target.value)}
                  placeholder="Contoh: PlayStation 5 - Unit 1"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 font-semibold text-xs text-slate-900 focus:outline-none focus:border-[var(--primary)]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Keterangan Cabang / Ruangan</label>
                <input
                  type="text"
                  value={deviceBranch}
                  onChange={(e) => setDeviceBranch(e.target.value)}
                  placeholder="Contoh: Cabang 1 (Gedongsongo) - VIP Room"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 font-semibold text-xs text-slate-900 focus:outline-none focus:border-[var(--primary)]"
                />
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="deviceIsAvailable"
                  checked={deviceIsAvailable}
                  onChange={(e) => setDeviceIsAvailable(e.target.checked)}
                  className="w-4 h-4 rounded text-blue-600 cursor-pointer"
                />
                <label htmlFor="deviceIsAvailable" className="text-xs font-bold text-slate-700 cursor-pointer">
                  Unit Tersedia & Aktif
                </label>
              </div>

              <div className="flex justify-end gap-2.5 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsDeviceModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-colors cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="px-5 py-2.5 bg-[var(--primary)] hover:opacity-90 text-white font-extrabold text-xs rounded-xl transition-all shadow-xs cursor-pointer disabled:opacity-50"
                >
                  {isSaving ? 'Menyimpan...' : 'Simpan Device'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Game Item Form */}
      {isGameModalOpen && (
        <div className="fixed inset-0 bg-slate-900/80 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-7 max-w-md w-full shadow-2xl space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-extrabold text-slate-900">
                {editingGame ? 'Edit Game' : `Tambah Game ke ${activeDevice?.name}`}
              </h3>
              <button onClick={() => setIsGameModalOpen(false)} className="text-slate-400 hover:text-slate-600 font-bold">✕</button>
            </div>

            <form onSubmit={handleSaveGame} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Judul Game</label>
                <input
                  type="text"
                  required
                  value={gameTitle}
                  onChange={(e) => setGameTitle(e.target.value)}
                  placeholder="Contoh: EA Sports FC 24"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 font-semibold text-xs text-slate-900 focus:outline-none focus:border-[var(--primary)]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Genre / Kategori</label>
                <input
                  type="text"
                  value={gameGenre}
                  onChange={(e) => setGameGenre(e.target.value)}
                  placeholder="Sports, Action, Racing, RPG, dll."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 font-semibold text-xs text-slate-900 focus:outline-none focus:border-[var(--primary)]"
                />
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="gameIsPopular"
                  checked={gameIsPopular}
                  onChange={(e) => setGameIsPopular(e.target.checked)}
                  className="w-4 h-4 rounded text-blue-600 cursor-pointer"
                />
                <label htmlFor="gameIsPopular" className="text-xs font-bold text-slate-700 cursor-pointer">
                  Tandai sebagai Game Favorit / Populer
                </label>
              </div>

              <div className="flex justify-end gap-2.5 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsGameModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-colors cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="px-5 py-2.5 bg-[var(--primary)] hover:opacity-90 text-white font-extrabold text-xs rounded-xl transition-all shadow-xs cursor-pointer disabled:opacity-50"
                >
                  {isSaving ? 'Menyimpan...' : 'Simpan Game'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Category Card Form */}
      {isCategoryModalOpen && (
        <div className="fixed inset-0 bg-slate-900/80 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-7 max-w-md w-full shadow-2xl space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-extrabold text-slate-900">Tambah Kategori Card Hardware</h3>
              <button onClick={() => setIsCategoryModalOpen(false)} className="text-slate-400 hover:text-slate-600 font-bold">✕</button>
            </div>

            <form onSubmit={handleSaveCategory} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Nama Kategori</label>
                <input
                  type="text"
                  required
                  value={newCategoryName}
                  onChange={(e) => setNewCategoryName(e.target.value)}
                  placeholder="Contoh: VR Gaming Lounge"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 font-semibold text-xs text-slate-900 focus:outline-none focus:border-[var(--primary)]"
                />
              </div>

              <div className="flex justify-end gap-2.5 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsCategoryModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-colors cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-[var(--primary)] hover:opacity-90 text-white font-extrabold text-xs rounded-xl transition-all shadow-xs cursor-pointer"
                >
                  Tambah Kategori
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
