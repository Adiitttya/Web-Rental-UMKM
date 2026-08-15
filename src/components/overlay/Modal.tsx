import React, { useEffect } from 'react';

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  className = '',
  size = 'xl',
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const sizeClasses = {
    sm: 'max-w-md',
    md: 'max-w-xl',
    lg: 'max-w-3xl',
    xl: 'max-w-5xl',
    full: 'max-w-6xl',
  }[size];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/75 backdrop-blur-md transition-opacity duration-300 animate-fade-in"
        onClick={onClose}
      />

      {/* Modal Container */}
      <div
        className={`relative z-10 w-full ${sizeClasses} h-[560px] sm:h-[600px] bg-[var(--background)] text-[var(--dark)] rounded-[2rem] p-5 sm:p-7 shadow-2xl border border-[var(--border)] transition-all transform scale-100 flex flex-col ${className}`}
      >
        {title && (
          <div className="flex items-center justify-between pb-4 border-b border-[var(--border)] mb-4 shrink-0">
            <h3 className="text-lg sm:text-2xl font-extrabold text-[var(--dark)] tracking-tight">
              {title}
            </h3>
            <button
              onClick={onClose}
              className="w-9 h-9 rounded-full bg-gray-200/70 hover:bg-gray-300/80 text-[var(--dark)] flex items-center justify-center font-bold text-sm transition-colors cursor-pointer"
              aria-label="Close modal"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        )}
        <div className="flex-1 overflow-y-auto min-h-0 pr-1 no-scrollbar">{children}</div>
      </div>
    </div>
  );
};
