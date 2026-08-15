'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { Toast } from '@/components/feedback/Toast';
import { ConfirmDialog } from '@/components/admin/ConfirmDialog';

interface EventItem {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  eventDate: string;
  startDate?: string;
  endDate?: string;
  locationText: string;
  linkUrl?: string;
  isFeatured: boolean;
  displayOrder: number;
  posterMedia?: { url: string };
  posterUrl?: string;
}

export default function AdminEventsPage() {
  const [events, setEvents] = useState<EventItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<EventItem | null>(null);

  // Delete Confirm Dialog state
  const [deleteTarget, setDeleteTarget] = useState<{ id: string; title: string } | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [description, setDescription] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [locationText, setLocationText] = useState('DsterGame Main Branch');
  const [linkUrl, setLinkUrl] = useState('https://instagram.com/dster.game');
  const [posterUrl, setPosterUrl] = useState('/Other/Event-Poster.jpg');
  const [displayOrder, setDisplayOrder] = useState(1);

  const [isSaving, setIsSaving] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const fetchEvents = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/admin/events');
      const data = await res.json();
      if (data.success && Array.isArray(data.data)) {
        setEvents(data.data);
      }
    } catch {
      setToast({ type: 'error', message: 'Gagal memuat data event.' });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const handleOpenModal = (evt?: EventItem) => {
    if (evt) {
      setEditingEvent(evt);
      setTitle(evt.title);
      setSubtitle(evt.subtitle || '');
      setDescription(evt.description || '');
      setStartDate(evt.startDate ? evt.startDate.slice(0, 16) : '');
      setEndDate(evt.endDate ? evt.endDate.slice(0, 16) : '');
      setLocationText(evt.locationText || 'DsterGame Main Branch');
      setLinkUrl(evt.linkUrl || 'https://instagram.com/dster.game');
      setPosterUrl(evt.posterMedia?.url || evt.posterUrl || '/Other/Event-Poster.jpg');
      setDisplayOrder(evt.displayOrder);
    } else {
      setEditingEvent(null);
      setTitle('');
      setSubtitle('Tournament & Match Night');
      setDescription('Prizepool menarik + Trophy juara. Kuota terbatas!');
      setStartDate('2026-09-15T10:00');
      setEndDate('2026-09-20T22:00');
      setLocationText('DsterGame Main Branch');
      setLinkUrl('https://instagram.com/dster.game');
      setPosterUrl('/Other/Event-Poster.jpg');
      setDisplayOrder(events.length + 1);
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    const payload = {
      title,
      subtitle,
      description,
      startDate,
      endDate,
      eventDate: startDate || undefined,
      locationText,
      linkUrl,
      posterUrl,
      displayOrder,
    };

    try {
      const url = editingEvent ? `/api/admin/events/${editingEvent.id}` : '/api/admin/events';
      const method = editingEvent ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (data.success) {
        setToast({ type: 'success', message: editingEvent ? 'Event berhasil diperbarui.' : 'Event baru berhasil ditambahkan.' });
        setIsModalOpen(false);
        fetchEvents();
      } else {
        setToast({ type: 'error', message: data.message || 'Gagal menyimpan event.' });
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
      const res = await fetch(`/api/admin/events/${deleteTarget.id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        setToast({ type: 'success', message: 'Event berhasil dihapus.' });
        setDeleteTarget(null);
        fetchEvents();
      } else {
        setToast({ type: 'error', message: data.message || 'Gagal menghapus event.' });
      }
    } catch {
      setToast({ type: 'error', message: 'Terjadi kesalahan sistem.' });
    } finally {
      setIsDeleting(false);
    }
  };

  const moveOrder = async (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= events.length) return;

    const newEvents = [...events];
    const temp = newEvents[index];
    newEvents[index] = newEvents[targetIndex];
    newEvents[targetIndex] = temp;

    const payload = newEvents.map((evt, idx) => ({ id: evt.id, displayOrder: idx + 1 }));
    setEvents(newEvents);

    try {
      await fetch('/api/admin/events/reorder', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items: payload }),
      });
      setToast({ type: 'success', message: 'Urutan event berhasil diperbarui.' });
    } catch {
      fetchEvents();
    }
  };

  const isEventOngoing = (evt: EventItem) => {
    const target = evt.endDate ? new Date(evt.endDate) : evt.startDate ? new Date(evt.startDate) : evt.eventDate ? new Date(evt.eventDate) : null;
    if (!target) return true;
    return (target.getTime() + 24 * 3600 * 1000) >= Date.now();
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
        title={`Hapus Event "${deleteTarget?.title}"?`}
        message="Event turnamen ini akan dihapus dari publikasi website dan database."
        isLoading={isDeleting}
        onConfirm={handleConfirmDelete}
        onClose={() => setDeleteTarget(null)}
      />

      {/* Top action bar right next to event listing */}
      <div className="flex items-center justify-between bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/80 shadow-xs">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-slate-500">Total Event:</span>
          <span className="px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 font-extrabold text-xs">
            {events.length} Event
          </span>
        </div>

        <button
          onClick={() => handleOpenModal()}
          className="px-4 py-2 bg-[var(--primary)] hover:opacity-90 text-white font-extrabold text-xs rounded-xl transition-all shadow-xs cursor-pointer flex items-center gap-1.5"
        >
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          <span>Tambah Event</span>
        </button>
      </div>

      {isLoading ? (
        <div className="bg-white rounded-2xl border border-slate-200/80 p-12 text-center text-xs font-bold text-slate-400 animate-pulse">
          Memuat data event...
        </div>
      ) : events.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200/80 p-12 text-center text-xs font-bold text-slate-400">
          Belum ada event turnamen terdaftar di database.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {events.map((evt, idx) => {
            const activeFeatured = isEventOngoing(evt);
            const posterSrc = evt.posterMedia?.url || evt.posterUrl || '/Other/Event-Poster.jpg';

            return (
              <div key={evt.id} className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden flex flex-col justify-between hover:shadow-md transition-shadow">
                <div>
                  {/* Poster Image */}
                  <div className="relative w-full aspect-[16/9] bg-slate-100 overflow-hidden">
                    <Image
                      src={posterSrc}
                      alt={evt.title}
                      fill
                      className="object-cover"
                      unoptimized
                    />
                    <div className="absolute top-2.5 right-2.5 flex items-center gap-1.5">
                      {activeFeatured ? (
                        <span className="px-2 py-0.5 rounded-full bg-emerald-600 text-white text-[10px] font-extrabold shadow-xs flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                          <span>Unggulan Aktif</span>
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded-full bg-slate-800/80 text-slate-300 text-[10px] font-bold shadow-xs">
                          Selesai / Terlewat
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="p-4 sm:p-5 space-y-2.5">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold text-blue-600 uppercase tracking-wider">{evt.subtitle || 'Tournament'}</span>
                      <span className="text-[10px] font-bold text-slate-400">Urutan #{idx + 1}</span>
                    </div>

                    <h3 className="font-extrabold text-sm text-[var(--foreground)] leading-snug">{evt.title}</h3>

                    <p className="text-xs text-slate-500 line-clamp-2">{evt.description}</p>

                    <div className="pt-2 border-t border-slate-100 space-y-1.5 text-[11px] text-slate-600 font-medium">
                      <div className="flex items-center gap-1.5">
                        <svg className="w-3.5 h-3.5 text-slate-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <span>
                          {evt.startDate && evt.endDate
                            ? `${new Date(evt.startDate).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })} - ${new Date(evt.endDate).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}`
                            : evt.eventDate ? new Date(evt.eventDate).toLocaleDateString('id-ID') : '-'}
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5 truncate">
                        <svg className="w-3.5 h-3.5 text-slate-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        <span className="truncate">{evt.locationText}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Footer Action Controls */}
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
                      disabled={idx === events.length - 1}
                      className="p-1.5 rounded-lg bg-white border border-slate-200 text-slate-600 hover:bg-slate-100 disabled:opacity-30 cursor-pointer"
                      title="Geser Turun"
                    >
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleOpenModal(evt)}
                      className="px-2.5 py-1 bg-white hover:bg-slate-100 text-slate-800 rounded-lg text-xs font-bold border border-slate-200 cursor-pointer"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => setDeleteTarget({ id: evt.id, title: evt.title })}
                      className="px-2.5 py-1 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-lg text-xs font-bold cursor-pointer"
                    >
                      Hapus
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal Event Form */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/80 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-7 max-w-lg w-full shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-extrabold text-slate-900">
                {editingEvent ? 'Edit Event Turnamen' : 'Tambah Event Baru'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600 font-bold">✕</button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Judul Event / Turnamen</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 font-semibold text-xs text-slate-900 focus:outline-none focus:border-[var(--primary)]"
                  placeholder="PES 2025 Arena Tournament"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Subtitle / Sub-kategori</label>
                <input
                  type="text"
                  value={subtitle}
                  onChange={(e) => setSubtitle(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 font-semibold text-xs text-slate-900 focus:outline-none focus:border-[var(--primary)]"
                  placeholder="Turnamen Komunitas"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Waktu Mulai</label>
                  <input
                    type="datetime-local"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 font-semibold text-xs text-slate-900 focus:outline-none focus:border-[var(--primary)]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Waktu Selesai</label>
                  <input
                    type="datetime-local"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 font-semibold text-xs text-slate-900 focus:outline-none focus:border-[var(--primary)]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Lokasi Event</label>
                <input
                  type="text"
                  value={locationText}
                  onChange={(e) => setLocationText(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 font-semibold text-xs text-slate-900 focus:outline-none focus:border-[var(--primary)]"
                  placeholder="DsterGame Main Branch (Gedongsongo)"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Link URL Detail (Instagram / Google Form)</label>
                <input
                  type="url"
                  value={linkUrl}
                  onChange={(e) => setLinkUrl(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 font-semibold text-xs text-slate-900 focus:outline-none focus:border-[var(--primary)]"
                  placeholder="https://instagram.com/dster.game"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Path / URL Poster Banner</label>
                <input
                  type="text"
                  value={posterUrl}
                  onChange={(e) => setPosterUrl(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 font-mono text-xs text-slate-900 focus:outline-none focus:border-[var(--primary)]"
                  placeholder="/Other/Event-Poster.jpg"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Deskripsi Turnamen</label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 font-semibold text-xs text-slate-900 focus:outline-none focus:border-[var(--primary)]"
                  placeholder="Informasi hadiah, pendaftaran, dan format pertandingan..."
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
                  {isSaving ? 'Menyimpan...' : 'Simpan Event'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
