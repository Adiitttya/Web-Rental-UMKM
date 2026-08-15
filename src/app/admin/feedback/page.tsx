'use client';

import React, { useState, useEffect } from 'react';
import { Toast } from '@/components/feedback/Toast';
import { ConfirmDialog } from '@/components/admin/ConfirmDialog';
import { AdminEmptyState } from '@/components/admin/primitives/AdminEmptyState';
import { AdminStatusBadge } from '@/components/admin/primitives/AdminStatusBadge';

interface FeedbackItem {
  id: string;
  name: string;
  email?: string | null;
  phone?: string | null;
  comment: string;
  status: string;
  isRead: boolean;
  createdAt: string;
}

export default function AdminFeedbackPage() {
  const [feedbacks, setFeedbacks] = useState<FeedbackItem[]>([]);
  const [filter, setFilter] = useState<'ALL' | 'UNREAD' | 'PENDING' | 'RESOLVED'>('ALL');
  const [isLoading, setIsLoading] = useState(true);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const [deleteTarget, setDeleteTarget] = useState<FeedbackItem | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchFeedbacks = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/admin/feedback?status=${filter}`);
      const json = await res.json();
      if (json.success) {
        setFeedbacks(json.data);
      }
    } catch {
      setToast({ type: 'error', message: 'Gagal memuat data pesan feedback dari server.' });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchFeedbacks();
  }, [filter]);

  const handleToggleStatus = async (item: FeedbackItem) => {
    try {
      const nextStatus = item.status === 'pending' ? 'reviewed' : item.status === 'reviewed' ? 'resolved' : 'pending';
      const res = await fetch(`/api/admin/feedback/${item.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: nextStatus, isRead: true }),
      });
      const json = await res.json();
      if (json.success) {
        setToast({ type: 'success', message: 'Status pesan feedback berhasil diperbarui.' });
        fetchFeedbacks();
      } else {
        setToast({ type: 'error', message: json.message || 'Gagal memperbarui status.' });
      }
    } catch {
      setToast({ type: 'error', message: 'Terjadi kesalahan sistem.' });
    }
  };

  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    try {
      const res = await fetch(`/api/admin/feedback/${deleteTarget.id}`, {
        method: 'DELETE',
      });
      const json = await res.json();
      if (json.success) {
        setToast({ type: 'success', message: 'Pesan feedback berhasil dihapus.' });
        setDeleteTarget(null);
        fetchFeedbacks();
      } else {
        setToast({ type: 'error', message: json.message || 'Gagal menghapus pesan.' });
      }
    } catch {
      setToast({ type: 'error', message: 'Terjadi kesalahan sistem saat menghapus.' });
    } finally {
      setIsDeleting(false);
    }
  };

  const unreadCount = feedbacks.filter((f) => !f.isRead).length;

  return (
    <div className="space-y-4">
      {/* Floating Toast */}
      <Toast
        isVisible={!!toast}
        type={toast?.type}
        message={toast?.message || ''}
        onClose={() => setToast(null)}
      />

      {/* Confirmation Dialog */}
      <ConfirmDialog
        isOpen={!!deleteTarget}
        title="Hapus Pesan Feedback?"
        message={`Pesan dari ${deleteTarget?.name || 'pengirim'} akan dihapus secara permanen dari basis data.`}
        confirmText="Hapus Pesan"
        isLoading={isDeleting}
        onConfirm={handleConfirmDelete}
        onClose={() => setDeleteTarget(null)}
      />

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/80 shadow-xs">
          <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Total Masukan</div>
          <div className="text-2xl font-black text-slate-900 mt-1">{feedbacks.length}</div>
        </div>
        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/80 shadow-xs">
          <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Belum Dibaca</div>
          <div className="text-2xl font-black text-[var(--primary)] mt-1">{unreadCount}</div>
        </div>
        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/80 shadow-xs">
          <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Tingkat Kepuasan</div>
          <div className="text-2xl font-black text-emerald-600 mt-1">4.9 / 5.0</div>
        </div>
      </div>

      {/* Main Inbox Container */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden space-y-4">
        {/* Filter Controls */}
        <div className="p-4 border-b border-slate-100 flex items-center gap-2 flex-wrap">
          <button
            onClick={() => setFilter('ALL')}
            className={`px-3 py-1.5 rounded-xl text-xs font-extrabold cursor-pointer transition-all ${
              filter === 'ALL' ? 'bg-[var(--primary)] text-white shadow-xs' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Semua ({feedbacks.length})
          </button>
          <button
            onClick={() => setFilter('UNREAD')}
            className={`px-3 py-1.5 rounded-xl text-xs font-extrabold cursor-pointer transition-all ${
              filter === 'UNREAD' ? 'bg-[var(--primary)] text-white shadow-xs' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Belum Dibaca
          </button>
          <button
            onClick={() => setFilter('PENDING')}
            className={`px-3 py-1.5 rounded-xl text-xs font-extrabold cursor-pointer transition-all ${
              filter === 'PENDING' ? 'bg-[var(--primary)] text-white shadow-xs' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Pending
          </button>
          <button
            onClick={() => setFilter('RESOLVED')}
            className={`px-3 py-1.5 rounded-xl text-xs font-extrabold cursor-pointer transition-all ${
              filter === 'RESOLVED' ? 'bg-[var(--primary)] text-white shadow-xs' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Selesai
          </button>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          {isLoading ? (
            <div className="p-8 text-center text-xs font-bold text-slate-400 animate-pulse">
              Memuat data pesan umpan balik...
            </div>
          ) : feedbacks.length === 0 ? (
            <div className="p-8">
              <AdminEmptyState
                title="Kotak Masuk Kosong"
                description="Belum ada pesan umpan balik atau kritik saran yang diterima saat ini."
              />
            </div>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-extrabold text-slate-500 uppercase tracking-wider">
                  <th className="py-3.5 px-4">Pengirim</th>
                  <th className="py-3.5 px-4">Kontak</th>
                  <th className="py-3.5 px-4">Pesan Masukan</th>
                  <th className="py-3.5 px-4">Tanggal</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 w-32 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs font-semibold text-slate-700">
                {feedbacks.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-4 px-4 font-bold text-slate-900">
                      <div>{item.name}</div>
                      {!item.isRead && (
                        <span className="inline-block mt-0.5 px-1.5 py-0.5 rounded bg-blue-100 text-blue-700 text-[9px] font-black uppercase">
                          New
                        </span>
                      )}
                    </td>
                    <td className="py-4 px-4">
                      <div className="text-slate-600 font-mono text-[11px]">{item.email || '-'}</div>
                      <div className="text-slate-400 font-mono text-[11px]">{item.phone || '-'}</div>
                    </td>
                    <td className="py-4 px-4 text-slate-600 max-w-md leading-relaxed">
                      {item.comment}
                    </td>
                    <td className="py-4 px-4 text-slate-400 text-[11px] font-mono whitespace-nowrap">
                      {new Date(item.createdAt).toLocaleString('id-ID', {
                        day: '2-digit',
                        month: 'short',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </td>
                    <td className="py-4 px-4">
                      <AdminStatusBadge
                        status={item.status}
                        variant={
                          item.status === 'resolved'
                            ? 'success'
                            : item.status === 'reviewed'
                            ? 'info'
                            : 'warning'
                        }
                      />
                    </td>
                    <td className="py-4 px-4 text-right space-x-1.5 shrink-0 whitespace-nowrap">
                      <button
                        onClick={() => handleToggleStatus(item)}
                        className="px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-bold transition-colors cursor-pointer"
                        title="Ubah Status Workflow"
                      >
                        Status
                      </button>
                      <button
                        onClick={() => setDeleteTarget(item)}
                        className="px-2.5 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-lg text-xs font-bold transition-colors cursor-pointer"
                        title="Hapus Pesan"
                      >
                        Hapus
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
