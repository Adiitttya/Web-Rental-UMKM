'use client';

import React, { useEffect, useState } from 'react';

export interface ToastProps {
  message: string;
  type?: 'success' | 'error' | 'info';
  isVisible: boolean;
  onClose: () => void;
  duration?: number;
}

export const Toast: React.FC<ToastProps> = ({
  message,
  type = 'success',
  isVisible,
  onClose,
  duration = 3500,
}) => {
  const [shouldRender, setShouldRender] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [progress, setProgress] = useState(100);

  useEffect(() => {
    if (isVisible) {
      setShouldRender(true);
      setProgress(100);
      const timer = setTimeout(() => setIsAnimating(true), 20);
      return () => clearTimeout(timer);
    } else {
      setIsAnimating(false);
      const timer = setTimeout(() => setShouldRender(false), 300);
      return () => clearTimeout(timer);
    }
  }, [isVisible]);

  useEffect(() => {
    if (!isVisible) return;

    const interval = 50;
    const step = (interval / duration) * 100;

    const progressTimer = setInterval(() => {
      setProgress((prev) => Math.max(0, prev - step));
    }, interval);

    const closeTimer = setTimeout(() => {
      onClose();
    }, duration);

    return () => {
      clearInterval(progressTimer);
      clearTimeout(closeTimer);
    };
  }, [isVisible, duration, onClose]);

  if (!shouldRender) return null;

  const typeConfig = {
    success: {
      borderColor: 'border-emerald-500/30',
      badgeBg: 'bg-emerald-50 text-emerald-600 border border-emerald-200',
      progressBg: 'bg-emerald-500',
      icon: (
        <svg className="w-5 h-5 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      title: 'Berhasil!',
    },
    error: {
      borderColor: 'border-rose-500/30',
      badgeBg: 'bg-rose-50 text-rose-600 border border-rose-200',
      progressBg: 'bg-rose-500',
      icon: (
        <svg className="w-5 h-5 text-rose-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      title: 'Perhatian',
    },
    info: {
      borderColor: 'border-blue-500/30',
      badgeBg: 'bg-blue-50 text-[var(--primary)] border border-blue-200',
      progressBg: 'bg-[var(--primary)]',
      icon: (
        <svg className="w-5 h-5 text-[var(--primary)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      title: 'Informasi',
    },
  };

  const config = typeConfig[type];

  return (
    <div
      className={`fixed bottom-6 right-6 z-50 max-w-md w-[calc(100vw-3rem)] sm:w-96 transition-all duration-300 ease-out transform ${
        isAnimating
          ? 'translate-y-0 opacity-100 scale-100 pointer-events-auto'
          : 'translate-y-8 opacity-0 scale-95 pointer-events-none'
      }`}
    >
      <div className={`relative overflow-hidden bg-white/95 backdrop-blur-xl border ${config.borderColor} rounded-2xl shadow-2xl shadow-slate-900/10 p-4 flex items-start gap-3.5`}>
        {/* Icon Badge */}
        <div className={`p-2 rounded-xl shrink-0 ${config.badgeBg}`}>
          {config.icon}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0 pt-0.5">
          <h5 className="font-extrabold text-xs text-[var(--dark)] tracking-wider uppercase">
            {config.title}
          </h5>
          <p className="text-xs sm:text-sm text-slate-600 font-semibold mt-0.5 leading-snug break-words">
            {message}
          </p>
        </div>

        {/* Close Button */}
        <button
          onClick={onClose}
          className="text-slate-400 hover:text-slate-700 p-1.5 rounded-lg transition-colors cursor-pointer shrink-0 -mr-1 -mt-1 hover:bg-slate-100"
          aria-label="Tutup notifikasi"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Progress Bar */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-slate-100 overflow-hidden">
          <div
            className={`h-full ${config.progressBg} transition-all duration-75 ease-linear`}
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    </div>
  );
};
