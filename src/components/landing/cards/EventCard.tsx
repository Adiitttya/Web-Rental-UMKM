import React from 'react';
import Image from 'next/image';
import { Button } from '../../navigation/Button';
import { isEventNewOrUpcoming } from '@/utils/eventUtils';

export interface EventCardProps {
  title: string;
  subTitle: string;
  description: string;
  posterImage: string;
  timeDate: string;
  buttonText?: string;
  linkUrl?: string;
  startDate?: string;
  endDate?: string;
  isNew?: boolean;
  badgeText?: string;
}

export const EventCard: React.FC<EventCardProps> = ({
  title,
  subTitle,
  description,
  posterImage,
  timeDate,
  buttonText = 'Detail',
  linkUrl = '#',
  startDate,
  endDate,
  isNew = false,
  badgeText,
}) => {
  const isUpcoming = isEventNewOrUpcoming({ isNew, startDate, endDate });
  const displayBadge = badgeText || (isUpcoming ? 'NEW' : null);

  return (
    <div className="relative bg-[var(--primary)] rounded-3xl p-6 text-white shadow-xl hover:-translate-y-2 transition-all duration-300 flex flex-col justify-between">
      {/* Red Starburst NEW Stamp Badge (Top-Left Corner) */}
      {displayBadge && (
        <div className="absolute -top-3.5 -left-3.5 z-20 w-12 h-12 sm:w-14 sm:h-14 flex items-center justify-center filter drop-shadow-lg transition-transform duration-300 hover:scale-110">
          <svg
            className="absolute inset-0 w-full h-full text-red-600 fill-current drop-shadow-md"
            viewBox="0 0 100 100"
          >
            <path d="M50 0 L58 8 L69 2 L73 14 L85 12 L85 24 L97 27 L92 39 L100 49 L91 59 L95 71 L83 74 L81 87 L68 85 L62 96 L50 91 L38 96 L32 85 L19 87 L17 74 L5 71 L9 59 L0 49 L8 39 L3 27 L15 24 L15 12 L27 14 L31 2 L42 8 Z" />
          </svg>
          <span className="relative z-10 text-white font-black text-[11px] sm:text-xs tracking-wider -rotate-12 select-none uppercase drop-shadow-xs">
            {displayBadge}
          </span>
        </div>
      )}
      <div className="flex flex-col sm:flex-row gap-5 items-start">
        {/* Poster */}
        <div className="relative w-full sm:w-40 aspect-[3/4] rounded-2xl overflow-hidden flex-shrink-0 border-2 border-white/20">
          <Image
            src={posterImage}
            alt={title}
            fill
            sizes="(max-width: 640px) 100vw, 160px"
            className="object-cover"
            loading="eager"
          />
        </div>

        {/* Content */}
        <div className="flex-1 space-y-2">
          <h3 className="text-2xl font-extrabold tracking-tight">{title}</h3>
          <h4 className="text-blue-200 font-semibold text-sm">{subTitle}</h4>
          <p className="text-blue-100 text-xs leading-relaxed line-clamp-3">
            {description}
          </p>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-6 pt-4 border-t border-blue-400/40 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-blue-100">
          <svg className="w-4 h-4 text-blue-200 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <span>{timeDate}</span>
        </div>
        <a href={linkUrl} target="_blank" rel="noopener noreferrer" className="shrink-0">
          <Button
            variant="ghost"
            size="sm"
            className="!bg-white !text-[var(--primary)] hover:!bg-white hover:!text-[var(--primary)] border-none font-extrabold !rounded-full px-6 py-2 shadow-md hover:shadow-[0_0_20px_rgba(255,255,255,0.7)] hover:scale-105 transition-all duration-300"
          >
            {buttonText}
          </Button>
        </a>
      </div>
    </div>
  );
};
