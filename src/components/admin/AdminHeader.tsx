'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';

interface AdminHeaderProps {
  onToggleSidebar?: () => void;
}

const routeTitleMap: Record<string, { title: string; subtitle: string }> = {
  '/admin/dashboard': { title: 'Dashboard Overview', subtitle: 'Ringkasan performa & statistik konten' },
  '/admin/hero': { title: 'Home / Hero Banner', subtitle: 'Kelola headline, logo, dekorasi, cover game, dan tombol aksi' },
  '/admin/games': { title: 'Katalog Game & Hardware', subtitle: 'Manajemen Hardware, Device unit, dan daftar game' },
  '/admin/pricing': { title: 'Pricelist & Paket', subtitle: 'Manajemen tabel harga, durasi sewa, dan paket rental' },
  '/admin/events': { title: 'Event & Turnamen', subtitle: 'Manajemen publikasi event, jadwal, dan turnamen komunitas' },
  '/admin/gallery': { title: 'Galeri Suasana', subtitle: 'Koleksi dokumentasi foto fasilitas dan gaming lounge' },
  '/admin/branches': { title: 'Lokasi Cabang', subtitle: 'Pengaturan informasi cabang, alamat, dan koordinat maps' },
  '/admin/faq': { title: 'FAQ (Pertanyaan Umum)', subtitle: 'Daftar pertanyaan dan jawaban yang sering ditanyakan' },
  '/admin/testimonials': { title: 'Testimonials', subtitle: 'Kelola ulasan dan pengalaman bermain pelanggan' },
  '/admin/feedback': { title: 'Feedback Inbox', subtitle: 'Kritik dan saran masuk dari pengunjung website' },
  '/admin/contact': { title: 'Kontak & Informasi', subtitle: 'Nomor WhatsApp, telepon, dan alamat operasional' },
  '/admin/media': { title: 'Media Library', subtitle: 'Pusat penyimpanan gambar dan aset digital' },
  '/admin/branding': { title: 'Brand Identity', subtitle: 'Pengaturan logo, icon, dan identitas visual' },
  '/admin/settings': { title: 'General Settings', subtitle: 'Konfigurasi umum website dan studio' },
  '/admin/seo': { title: 'SEO Metadata', subtitle: 'Pengaturan meta tag dan optimasi mesin pencari' },
  '/admin/footer': { title: 'Footer & Metadata', subtitle: 'Pengaturan informasi footer dan tautan sosial' },
  '/admin/users': { title: 'Admin Users', subtitle: 'Manajemen akun pengelola dan hak akses CMS' },
  '/admin/logs/login': { title: 'Login Logs', subtitle: 'Riwayat aktivitas masuk sistem admin' },
  '/admin/logs/activity': { title: 'Activity Logs', subtitle: 'Audit jejak perubahan data konten' },
  '/admin/system/status': { title: 'System Status', subtitle: 'Status server dan konektivitas database' },
  '/admin/system/cache': { title: 'Cache Revalidation', subtitle: 'Pembersihan cache dan sinkronisasi data instan' },
};

export const AdminHeader: React.FC<AdminHeaderProps> = ({ onToggleSidebar }) => {
  const router = useRouter();
  const pathname = usePathname();
  const [userName, setUserName] = useState<string>('Admin User');
  const [userEmail, setUserEmail] = useState<string>('admin@dstergame.com');
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  // Determine current active page title
  const currentRouteMeta = routeTitleMap[pathname] || {
    title: pathname.split('/').pop()?.toUpperCase() || 'Admin Panel',
    subtitle: 'Panel Administrasi DsterGame Studio',
  };

  useEffect(() => {
    fetch('/api/auth/me')
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.user) {
          setUserName(data.user.name || 'Admin User');
          setUserEmail(data.user.email || 'admin@dstergame.com');
        }
      })
      .catch(() => null);
  }, []);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      router.push('/admin/login');
      router.refresh();
    } catch {
      setIsLoggingOut(false);
    }
  };

  return (
    <header className="h-16 bg-white border-b border-slate-200 px-4 sm:px-6 flex items-center justify-between shadow-xs shrink-0 z-20">
      <div className="flex items-center gap-3 min-w-0">
        {/* Mobile Menu Toggle */}
        <button
          onClick={onToggleSidebar}
          aria-label="Toggle Navigation Menu"
          className="lg:hidden p-2 rounded-xl text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-colors focus:outline-none shrink-0"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>

        {/* Dynamic Active Workspace Title */}
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <h2 className="text-sm sm:text-base font-extrabold text-[var(--foreground)] tracking-tight truncate">
              {currentRouteMeta.title}
            </h2>
          </div>
          <p className="text-[11px] text-slate-500 font-medium hidden sm:block truncate">
            {currentRouteMeta.subtitle}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3 sm:gap-4 shrink-0">
        <div className="text-right hidden md:block">
          <div className="text-xs font-bold text-[var(--foreground)]">{userName}</div>
          <div className="text-[10px] font-medium text-slate-500">{userEmail}</div>
        </div>

        <button
          onClick={handleLogout}
          disabled={isLoggingOut}
          className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-rose-50 hover:text-rose-600 text-slate-600 font-bold text-xs border border-slate-200 hover:border-rose-200 transition-colors cursor-pointer flex items-center gap-1.5"
        >
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
          <span className="hidden sm:inline">{isLoggingOut ? 'Keluar...' : 'Keluar'}</span>
        </button>
      </div>
    </header>
  );
};
