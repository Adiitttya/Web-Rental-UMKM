'use client';

import React, { useState } from 'react';
import { useSiteData } from '@/context/SiteContext';
import { Container } from '../../layout/Container';
import { Heading, Paragraph } from '../../typography/Typography';
import { Button } from '../../navigation/Button';
import { Toast } from '../../feedback/Toast';
import { sanitizeText } from '@/utils/sanitize';
import { saveFeedback } from '@/services/feedbackStore';
import { ScrollReveal } from '../../animation/ScrollReveal';

export const FeedbackSection: React.FC = () => {
  const { siteData } = useSiteData();
  const [name, setName] = useState('');
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Toast Notification State
  const [toastState, setToastState] = useState<{
    isVisible: boolean;
    message: string;
    type: 'success' | 'error' | 'info';
  }>({
    isVisible: false,
    message: '',
    type: 'success',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const cleanName = sanitizeText(name, 100);
    const cleanComment = sanitizeText(comment, 1000);

    if (!cleanName || !cleanComment) {
      setToastState({
        isVisible: true,
        message: 'Mohon lengkapi nama dan ulasan Anda terlebih dahulu sebelum mengirim.',
        type: 'error',
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // 1. Save to local storage backup
      saveFeedback({ name: cleanName, comment: cleanComment });

      // 2. Post to API endpoint
      const response = await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: cleanName, comment: cleanComment }),
      });

      const resData = await response.json().catch(() => null);

      if (!response.ok) {
        throw new Error(resData?.error || 'Gagal mengirim ulasan');
      }

      // 3. Show success toast notification with premium copywriting
      setToastState({
        isVisible: true,
        message: resData?.message || 'Terima kasih! Feedback & ulasan Anda telah berhasil terkirim. Masukan Anda sangat berharga bagi DsterGame Studio.',
        type: 'success',
      });

      // Clear form inputs
      setName('');
      setComment('');
    } catch (err: unknown) {
      const errMsg = err instanceof Error ? err.message : 'Terjadi kendala saat mengirim ulasan. Silakan coba beberapa saat lagi.';
      setToastState({
        isVisible: true,
        message: errMsg,
        type: 'error',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const sectionMeta = siteData.sections['feedback'] || {
    title: 'Feedback',
    subtitle: 'Kritik, saran, dan pengalaman bermain Anda sangat berharga untuk peningkatan pelayanan DsterGame Studio.',
  };

  return (
    <section id="feedback" className="py-20 sm:py-24 bg-[var(--primary)] text-white relative overflow-hidden">
      {/* Decorative Ambient Glow */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-white/10 rounded-full blur-3xl pointer-events-none animate-pulse" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-300/10 rounded-full blur-3xl pointer-events-none animate-pulse" style={{ animationDelay: '1s' }} />

      <Container size="lg" className="relative z-10">
        {/* Section Header */}
        <ScrollReveal direction="up" duration={600}>
          <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-12">
            <Heading level={2} className="text-3xl sm:text-4xl font-extrabold text-white mb-3">
              {sectionMeta.title}
            </Heading>
            <Paragraph className="text-sm sm:text-base text-white max-w-xl mx-auto font-medium opacity-90 leading-relaxed">
              {sectionMeta.subtitle}
            </Paragraph>
          </div>
        </ScrollReveal>

        {/* Feedback Form Card Container */}
        <ScrollReveal direction="up" delay={200} duration={650}>
          <div className="max-w-2xl mx-auto bg-[var(--card-bg)] text-[var(--dark)] rounded-3xl p-6 sm:p-8 shadow-2xl overflow-hidden">
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* 2-Column Responsive Input Form */}
              <div className="grid grid-cols-1 gap-5">
                {/* Field 1: Nama */}
                <div className="flex flex-col gap-1.5 text-left">
                  <label htmlFor="feedback-name" className="text-xs sm:text-sm font-extrabold text-[var(--dark)]">
                    Nama Lengkap <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="feedback-name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Masukkan nama Anda..."
                    maxLength={100}
                    required
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-slate-50 text-[var(--dark)] text-xs sm:text-sm font-semibold placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:bg-white transition-all"
                  />
                </div>

                {/* Field 2: Feedback / Komentar */}
                <div className="flex flex-col gap-1.5 text-left">
                  <label htmlFor="feedback-comment" className="text-xs sm:text-sm font-extrabold text-[var(--dark)]">
                    Komentar / Feedback <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    id="feedback-comment"
                    rows={4}
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Tuliskan pesan, saran, atau kesan Anda selama bermain..."
                    maxLength={1000}
                    required
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-slate-50 text-[var(--dark)] text-xs sm:text-sm font-semibold placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:bg-white transition-all resize-none"
                  />
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-2 flex justify-end">
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full sm:w-auto bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-white font-extrabold !rounded-full px-8 py-3 text-xs sm:text-sm shadow-md hover:shadow-blue-500/30 transition-all duration-300 hover:scale-105 cursor-pointer disabled:opacity-70 disabled:hover:scale-100"
                >
                  {isSubmitting ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg className="animate-spin h-4 w-4 text-white" viewBox="0 0 24 24" fill="none">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                      </svg>
                      Mengirim...
                    </span>
                  ) : (
                    'Kirim Feedback'
                  )}
                </Button>
              </div>
            </form>
          </div>
        </ScrollReveal>
      </Container>

      {/* Component Reusable Toast Notification */}
      <Toast
        isVisible={toastState.isVisible}
        message={toastState.message}
        type={toastState.type}
        onClose={() => setToastState((prev) => ({ ...prev, isVisible: false }))}
      />
    </section>
  );
};
