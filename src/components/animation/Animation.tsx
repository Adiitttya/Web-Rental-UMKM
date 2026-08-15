import React from 'react';

export interface FloatingProps {
  children: React.ReactNode;
  className?: string;
}

export const Floating: React.FC<FloatingProps> = ({ children, className = '' }) => (
  <div className={`animate-float ${className}`}>{children}</div>
);

export interface MarqueeProps {
  children: React.ReactNode;
  className?: string;
  speed?: number;
  pauseOnHover?: boolean;
  gap?: string;
}

export const Marquee: React.FC<MarqueeProps> = ({
  children,
  className = '',
  speed = 40,
  pauseOnHover = true,
  gap = 'gap-6',
}) => (
  <div
    className={`flex overflow-hidden select-none w-full ${
      pauseOnHover ? 'marquee-container' : ''
    } ${gap} ${className}`}
  >
    <div
      className={`flex shrink-0 items-center justify-around ${gap} min-w-full animate-marquee`}
      style={{ animationDuration: `${speed}s` }}
    >
      {children}
    </div>
    <div
      className={`flex shrink-0 items-center justify-around ${gap} min-w-full animate-marquee`}
      style={{ animationDuration: `${speed}s` }}
      aria-hidden="true"
    >
      {children}
    </div>
  </div>
);
