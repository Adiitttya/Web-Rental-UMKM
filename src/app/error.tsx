'use client';

import { useEffect } from 'react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Server Data Boundary Error:', error);
  }, [error]);

  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col items-center justify-center p-6 text-center">
      <div className="max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-2xl">
        <h2 className="text-2xl font-bold text-red-500 mb-3">Layanan Sementara Tidak Tersedia</h2>
        <p className="text-slate-300 text-sm mb-6 leading-relaxed">
          Gagal menghubungkan ke database server. Silakan muat ulang halaman atau coba beberapa saat lagi.
        </p>
        <button
          onClick={() => reset()}
          className="px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm rounded-xl shadow-lg transition-all duration-200 cursor-pointer"
        >
          Coba Lagi
        </button>
      </div>
    </div>
  );
}
