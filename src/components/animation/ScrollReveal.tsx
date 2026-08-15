'use client';

import React, { useEffect, useRef, useState } from 'react';

export interface ScrollRevealProps {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  direction?: 'up' | 'down' | 'left' | 'right' | 'zoom';
  delay?: number;
  duration?: number;
  threshold?: number;
  once?: boolean;
}

export const ScrollReveal: React.FC<ScrollRevealProps> = ({
  children,
  className = '',
  style = {},
  direction = 'up',
  delay = 0,
  duration = 650,
  threshold = 0.12,
  once = true,
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const currentRef = ref.current;
    if (!currentRef) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          if (once && currentRef) {
            observer.unobserve(currentRef);
          }
        } else if (!once) {
          setIsVisible(false);
        }
      },
      {
        threshold,
        rootMargin: '0px 0px -40px 0px',
      }
    );

    observer.observe(currentRef);

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, [threshold, once]);

  const getTransformClasses = () => {
    if (isVisible) {
      return 'opacity-100 translate-x-0 translate-y-0 scale-100 pointer-events-auto';
    }

    const baseHidden = 'opacity-0 pointer-events-none';
    switch (direction) {
      case 'up':
        return `${baseHidden} translate-y-10 scale-[0.98]`;
      case 'down':
        return `${baseHidden} -translate-y-10 scale-[0.98]`;
      case 'left':
        return `${baseHidden} translate-x-10`;
      case 'right':
        return `${baseHidden} -translate-x-10`;
      case 'zoom':
        return `${baseHidden} scale-90`;
      default:
        return `${baseHidden} translate-y-10`;
    }
  };

  return (
    <div
      ref={ref}
      className={`transition-all transform-gpu ease-[cubic-bezier(0.16,1,0.3,1)] ${getTransformClasses()} ${className}`}
      style={{
        ...style,
        transitionDuration: `${duration}ms`,
        transitionDelay: `${delay}ms`,
      }}
    >
      {children}
    </div>
  );
};
