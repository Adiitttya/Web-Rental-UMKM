'use client';

import React, { useState } from 'react';
import { useSiteData } from '@/context/SiteContext';
import { Container } from '../../layout/Container';
import { Marquee } from '../../animation/Animation';
import { EventCard } from '../cards/EventCard';
import { ScrollReveal } from '../../animation/ScrollReveal';

const ITEMS_PER_PAGE = 4;

export const EventSection: React.FC = () => {
  const { siteData } = useSiteData();
  const events = siteData.events || [];
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(events.length / ITEMS_PER_PAGE);
  const safeCurrentPage = Math.min(Math.max(currentPage, 1), totalPages || 1);

  const startIndex = (safeCurrentPage - 1) * ITEMS_PER_PAGE;
  const visibleEvents = events.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const handlePageChange = (page: number) => {
    if (page === safeCurrentPage) return;
    setCurrentPage(page);
    const eventEl = document.getElementById('event');
    if (eventEl) {
      const yOffset = -80; // Offset for sticky navbar height
      const y = eventEl.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  return (
    <section id="event" className="py-20 sm:py-28 bg-white overflow-hidden">
      {/* Animated Event Tape Ribbon matching reference design */}
      <ScrollReveal direction="down" duration={700}>
        <div className="mb-20 sm:mb-24 lg:mb-28 -rotate-2 -mx-6 sm:-mx-12 overflow-hidden drop-shadow-[0_12px_22px_rgba(0,0,0,0.18)] scale-105">
          <Marquee gap="gap-0" className="bg-transparent py-1">
            <div className="flex items-center gap-0 select-none">
              {Array(16)
                .fill(null)
                .map((_, idx) => {
                  const isEven = idx % 2 === 0;
                  return (
                    <div
                      key={idx}
                      className={`-skew-x-[15deg] px-6 sm:px-10 md:px-14 py-2.5 sm:py-3.5 md:py-4 flex items-center justify-center shrink-0 ${
                        isEven
                          ? 'bg-white text-[var(--primary)]'
                          : 'bg-[var(--primary)] text-white'
                      }`}
                    >
                      <span className="skew-x-[15deg] font-black text-lg sm:text-2xl md:text-3xl tracking-wider uppercase whitespace-nowrap">
                        EVENT
                      </span>
                    </div>
                  );
                })}
            </div>
          </Marquee>
        </div>
      </ScrollReveal>

      <Container size="lg">
        {/* Render EventCard components via responsive grid mapping */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 max-w-5xl mx-auto px-2 sm:px-0">
          {visibleEvents.map((evt, idx) => (
            <ScrollReveal key={`p${safeCurrentPage}-${evt.id}`} direction="up" delay={idx * 100} duration={600}>
              <EventCard
                title={evt.title}
                subTitle={evt.subTitle}
                description={evt.description}
                posterImage={evt.posterImage}
                timeDate={evt.timeDate}
                buttonText={evt.buttonText}
                linkUrl={evt.linkUrl}
                startDate={evt.startDate}
                endDate={evt.endDate}
                isNew={evt.isNew}
                badgeText={evt.badgeText}
              />
            </ScrollReveal>
          ))}
        </div>

        {/* Pagination Controls with ScrollReveal animation when total items > 4 */}
        {totalPages > 1 && (
          <ScrollReveal direction="up" delay={200} duration={650}>
            <div className="mt-12 sm:mt-16 flex items-center justify-center gap-2 xs:gap-3">
              {/* Previous Button */}
              <button
                onClick={() => handlePageChange(safeCurrentPage - 1)}
                disabled={safeCurrentPage === 1}
                aria-label="Halaman Sebelumnya"
                className={`px-3.5 py-2 sm:px-4 sm:py-2.5 rounded-xl font-bold text-sm sm:text-base border-2 transition-all duration-300 flex items-center gap-1.5 active:scale-95 ${
                  safeCurrentPage === 1
                    ? 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed'
                    : 'bg-white text-gray-700 border-gray-200 hover:border-[var(--primary)] hover:text-[var(--primary)] hover:shadow-lg hover:shadow-[var(--primary)]/10 hover:-translate-y-0.5'
                }`}
              >
                <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7" />
                </svg>
                <span className="hidden xs:inline">Prev</span>
              </button>

              {/* Number Buttons */}
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => {
                const isActive = pageNum === safeCurrentPage;
                return (
                  <button
                    key={pageNum}
                    onClick={() => handlePageChange(pageNum)}
                    aria-label={`Halaman ${pageNum}`}
                    className={`min-w-[40px] h-10 sm:min-w-[44px] sm:h-11 px-3 rounded-xl font-extrabold text-sm sm:text-base border-2 transition-all duration-300 flex items-center justify-center active:scale-95 ${
                      isActive
                        ? 'bg-[var(--primary)] text-white border-[var(--primary)] shadow-lg shadow-[var(--primary)]/30 scale-105 -translate-y-0.5'
                        : 'bg-white text-gray-700 border-gray-200 hover:border-[var(--primary)]/60 hover:text-[var(--primary)] hover:bg-blue-50/40 hover:-translate-y-0.5'
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}

              {/* Next Button */}
              <button
                onClick={() => handlePageChange(safeCurrentPage + 1)}
                disabled={safeCurrentPage === totalPages}
                aria-label="Halaman Selanjutnya"
                className={`px-3.5 py-2 sm:px-4 sm:py-2.5 rounded-xl font-bold text-sm sm:text-base border-2 transition-all duration-300 flex items-center gap-1.5 active:scale-95 ${
                  safeCurrentPage === totalPages
                    ? 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed'
                    : 'bg-white text-gray-700 border-gray-200 hover:border-[var(--primary)] hover:text-[var(--primary)] hover:shadow-lg hover:shadow-[var(--primary)]/10 hover:-translate-y-0.5'
                }`}
              >
                <span className="hidden xs:inline">Next</span>
                <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </ScrollReveal>
        )}
      </Container>
    </section>
  );
};

