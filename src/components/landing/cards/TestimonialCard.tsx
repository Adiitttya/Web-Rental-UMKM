import React from 'react';

export interface TestimonialCardProps {
  nickname: string;
  username: string;
  comment: string;
  rating?: number;
}

export const TestimonialCard: React.FC<TestimonialCardProps> = ({
  nickname,
  username,
  comment,
  rating = 5,
}) => {
  return (
    <div className="w-[300px] sm:w-[360px] h-[230px] sm:h-[240px] bg-[var(--card-bg)] text-[var(--dark)] rounded-3xl p-5 sm:p-6 shadow-xl border border-gray-100 flex flex-col justify-between overflow-hidden hover:-translate-y-1 transition-all duration-300 shrink-0">
      {/* Header User Info */}
      <div className="flex items-center gap-3.5 mb-2.5 shrink-0">
        <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-[var(--dark)] flex items-center justify-center text-white font-black text-base sm:text-lg shrink-0 shadow-md">
          {nickname.charAt(0).toUpperCase()}
        </div>
        <div className="min-w-0 flex-1">
          <h4 className="font-extrabold text-sm sm:text-base text-[var(--primary)] truncate leading-tight">
            {nickname}
          </h4>
          <p className="text-xs text-blue-900/80 font-bold truncate mt-0.5">
            {username}
          </p>
        </div>
      </div>

      {/* Rating Stars */}
      <div className="flex items-center gap-1 mb-2 text-yellow-400 text-sm shrink-0">
        {'★'.repeat(Math.min(5, Math.max(1, rating)))}
      </div>

      {/* Comment Content */}
      <div className="flex-1 overflow-hidden min-h-0 flex items-start">
        <p
          className="text-xs sm:text-sm text-gray-600 leading-relaxed whitespace-normal break-words overflow-hidden text-ellipsis select-none"
          style={{
            display: '-webkit-box',
            WebkitLineClamp: 4,
            WebkitBoxOrient: 'vertical',
          }}
        >
          &ldquo;{comment}&rdquo;
        </p>
      </div>
    </div>
  );
};
