'use client';

import React, { useState, useEffect } from 'react';
import { Toast } from '@/components/feedback/Toast';
import { ConfirmDialog } from '@/components/admin/ConfirmDialog';

interface FaqItem {
  id: string;
  question: string;
  answer: string;
  displayOrder: number;
  isPublished: boolean;
}

export default function AdminFaqPage() {
  const [faqs, setFaqs] = useState<FaqItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingFaq, setEditingFaq] = useState<FaqItem | null>(null);

  // Delete confirm dialog state
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [displayOrder, setDisplayOrder] = useState(1);
  const [isSaving, setIsSaving] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const fetchFaqs = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/admin/faq');
      const data = await res.json();
      if (data.success && Array.isArray(data.data)) {
        setFaqs(data.data);
      }
    } catch {
      setToast({ type: 'error', message: 'Gagal memuat data FAQ.' });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchFaqs();
  }, []);

  const handleOpenModal = (faq?: FaqItem) => {
    if (faq) {
      setEditingFaq(faq);
      setQuestion(faq.question);
      setAnswer(faq.answer);
      setDisplayOrder(faq.displayOrder);
    } else {
      setEditingFaq(null);
      setQuestion('');
      setAnswer('');
      setDisplayOrder(faqs.length + 1);
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    const payload = { question, answer, displayOrder };

    try {
      const url = editingFaq ? `/api/admin/faq/${editingFaq.id}` : '/api/admin/faq';
      const method = editingFaq ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (data.success) {
        setToast({ type: 'success', message: editingFaq ? 'FAQ berhasil diperbarui.' : 'FAQ baru berhasil ditambahkan.' });
        setIsModalOpen(false);
        fetchFaqs();
      } else {
        setToast({ type: 'error', message: data.message || 'Gagal menyimpan FAQ.' });
      }
    } catch {
      setToast({ type: 'error', message: 'Terjadi kesalahan sistem.' });
    } finally {
      setIsSaving(false);
    }
  };

  const handleConfirmDelete = async () => {
    if (!deleteTargetId) return;
    setIsDeleting(true);

    try {
      const res = await fetch(`/api/admin/faq/${deleteTargetId}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        setToast({ type: 'success', message: 'FAQ berhasil dihapus.' });
        setDeleteTargetId(null);
        fetchFaqs();
      } else {
        setToast({ type: 'error', message: data.message || 'Gagal menghapus FAQ.' });
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
        isOpen={deleteTargetId !== null}
        title="Hapus FAQ Ini?"
        message="Pertanyaan dan jawaban FAQ ini akan dihapus secara permanen dari database."
        isLoading={isDeleting}
        onConfirm={handleConfirmDelete}
        onClose={() => setDeleteTargetId(null)}
      />

      {/* Main Card with Action Button Right next to Content Header */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-500">Total:</span>
            <span className="px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 font-extrabold text-xs">
              {faqs.length} FAQ
            </span>
          </div>

          <button
            onClick={() => handleOpenModal()}
            className="px-4 py-2 bg-[var(--primary)] hover:opacity-90 text-white font-extrabold text-xs rounded-xl transition-all shadow-xs cursor-pointer flex items-center gap-1.5"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            <span>Tambah FAQ</span>
          </button>
        </div>

        {isLoading ? (
          <div className="p-12 text-center text-xs font-bold text-slate-400 animate-pulse">
            Memuat data FAQ...
          </div>
        ) : faqs.length === 0 ? (
          <div className="p-12 text-center text-xs font-bold text-slate-400">
            Belum ada data FAQ terdaftar.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-extrabold text-slate-500 uppercase tracking-wider">
                  <th className="py-3 px-4 w-16 text-center">Urutan</th>
                  <th className="py-3 px-4">Pertanyaan</th>
                  <th className="py-3 px-4">Jawaban</th>
                  <th className="py-3 px-4 w-28 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs font-semibold text-slate-700">
                {faqs.map((faq) => (
                  <tr key={faq.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-4 font-black text-center text-slate-400">#{faq.displayOrder}</td>
                    <td className="py-3.5 px-4 font-bold text-[var(--foreground)] max-w-xs leading-snug">{faq.question}</td>
                    <td className="py-3.5 px-4 text-slate-600 max-w-md leading-relaxed">{faq.answer}</td>
                    <td className="py-3.5 px-4 text-right space-x-1.5 shrink-0">
                      <button
                        onClick={() => handleOpenModal(faq)}
                        className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-bold transition-colors cursor-pointer"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => setDeleteTargetId(faq.id)}
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

      {/* Modal Form */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/80 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-7 max-w-lg w-full shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-extrabold text-slate-900">
                {editingFaq ? 'Edit FAQ' : 'Tambah FAQ Baru'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600 font-bold">
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Pertanyaan (Question)</label>
                <input
                  type="text"
                  required
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 font-semibold text-xs text-slate-900 focus:outline-none focus:border-[var(--primary)]"
                  placeholder="Contoh: Apakah bisa sewa konsol untuk dibawa pulang?"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Jawaban (Answer)</label>
                <textarea
                  required
                  rows={4}
                  value={answer}
                  onChange={(e) => setAnswer(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 font-semibold text-xs text-slate-900 focus:outline-none focus:border-[var(--primary)]"
                  placeholder="Jawaban rinci..."
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Nomor Urutan Tampilan</label>
                <input
                  type="number"
                  min={1}
                  value={displayOrder}
                  onChange={(e) => setDisplayOrder(Number(e.target.value))}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 font-semibold text-xs text-slate-900 focus:outline-none focus:border-[var(--primary)]"
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
                  {isSaving ? 'Menyimpan...' : 'Simpan FAQ'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
