'use client';

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { useSiteData } from '@/context/SiteContext';
import { Container } from '../../layout/Container';

export const HeroSection: React.FC = () => {
  const { siteData } = useSiteData();
  const hero = siteData.hero;
  const coversRef = useRef<HTMLDivElement>(null);
  const [isRevealed, setIsRevealed] = useState(false);

  useEffect(() => {
    const target = coversRef.current;
    if (!target) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsRevealed(true);
          }
        });
      },
      { threshold: 0.15 }
    );

    observer.observe(target);
    return () => observer.disconnect();
  }, []);

  const handleExploreClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    const target = document.getElementById('list-game');
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else {
      window.location.hash = 'list-game';
    }
  };

  return (
    <section
      id="hero"
      className="relative min-h-[90vh] lg:min-h-screen bg-[var(--background)] overflow-hidden flex flex-col justify-between pt-16 sm:pt-20"
    >
      {/* 3D Floating Decorations */}
      {hero.decorations?.wheel && (
        <div
          className="absolute z-10 pointer-events-none transition-all duration-700 opacity-100"
          style={{ top: '14%', left: '18%', width: 'clamp(50px, 7vw, 100px)', height: 'clamp(50px, 7vw, 100px)' }}
        >
          <div className="relative w-full h-full animate-float" style={{ animationDelay: '0s' }}>
            <Image
              src={hero.decorations.wheel}
              alt="Wheel Decoration"
              fill
              sizes="100px"
              className="object-contain drop-shadow-xl"
              loading="lazy"
            />
          </div>
        </div>
      )}

      {hero.decorations?.stick && (
        <div
          className="absolute z-10 pointer-events-none transition-all duration-700 opacity-100"
          style={{ top: '12%', right: '20%', width: 'clamp(45px, 6vw, 90px)', height: 'clamp(45px, 6vw, 90px)' }}
        >
          <div className="relative w-full h-full animate-float" style={{ animationDelay: '0.8s' }}>
            <Image
              src={hero.decorations.stick}
              alt="Stick Decoration"
              fill
              sizes="90px"
              className="object-contain drop-shadow-xl"
              loading="lazy"
            />
          </div>
        </div>
      )}

      {hero.decorations?.gamepad && (
        <div
          className="absolute z-10 pointer-events-none transition-all duration-700 opacity-100"
          style={{ top: '32%', left: '12%', width: 'clamp(65px, 8vw, 130px)', height: 'clamp(65px, 8vw, 130px)' }}
        >
          <div className="relative w-full h-full animate-float" style={{ animationDelay: '1.4s' }}>
            <Image
              src={hero.decorations.gamepad}
              alt="GamePad Decoration"
              fill
              sizes="130px"
              className="object-contain drop-shadow-xl"
              loading="lazy"
            />
          </div>
        </div>
      )}

      {hero.decorations?.vr && (
        <div
          className="absolute z-10 pointer-events-none transition-all duration-700 opacity-100"
          style={{ top: '30%', right: '12%', width: 'clamp(70px, 9vw, 140px)', height: 'clamp(70px, 9vw, 140px)' }}
        >
          <div className="relative w-full h-full animate-float" style={{ animationDelay: '2s' }}>
            <Image
              src={hero.decorations.vr}
              alt="VR Decoration"
              fill
              sizes="140px"
              className="object-contain drop-shadow-xl"
              loading="lazy"
            />
          </div>
        </div>
      )}

      {/* Hero Central Content (Instant SSR Render for LCP Optimization) */}
      <Container
        size="lg"
        className="relative z-20 flex flex-col items-center text-center pt-16 sm:pt-20 md:pt-24 pb-6"
      >
        {/* Logo DsterGame - Primary LCP Candidate */}
        <div className="relative w-64 sm:w-80 md:w-[420px] lg:w-[480px] aspect-[460/140] mb-2 hover:scale-105 transition-transform duration-300">
          <Image
            src={hero.logo}
            alt="DsterGame Logo"
            fill
            sizes="(max-width: 640px) 256px, (max-width: 768px) 320px, 480px"
            className="object-contain drop-shadow-2xl"
            priority
            loading="eager"
          />
        </div>

        {/* Instagram Handle */}
        <p className="text-xs sm:text-sm font-bold text-[var(--dark)]/75 tracking-wider bg-blue-50/80 px-4 py-1 rounded-full border border-blue-100/60 shadow-sm">
          {hero.instagram}
        </p>

        {/* Explore Button */}
        <div className="mt-6 sm:mt-8">
          <a
            href="#list-game"
            onClick={handleExploreClick}
            className="inline-flex items-center justify-center rounded-full px-7 py-1.5 sm:px-9 sm:py-2 border-2 border-[var(--primary)] bg-white text-[var(--primary)] hover:bg-[var(--primary)] hover:text-white text-xs sm:text-sm font-extrabold transition-all duration-300 shadow-md hover:shadow-blue-500/30 transform hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
          >
            {hero.ctaText}
          </a>
        </div>
      </Container>

      {/* Game Covers Fan-out Showcase */}
      <div className="w-full" ref={coversRef}>
        <div className="relative w-full flex justify-center items-end z-20 pt-2 sm:pt-4 overflow-hidden min-h-[150px] min-[380px]:min-h-[175px] min-[480px]:min-h-[210px] sm:min-h-[280px] md:min-h-[320px]">
          <div className="absolute bottom-0 left-0 right-0 h-20 min-[480px]:h-28 sm:h-40 bg-gradient-to-t from-[var(--background)] via-[var(--background)]/80 to-transparent z-40 pointer-events-none" />

          <div className="relative flex items-end justify-center pointer-events-none select-none w-full max-w-[960px] h-[140px] min-[380px]:h-[160px] min-[480px]:h-[200px] sm:h-[280px] md:h-[320px]">
            {hero.gameCovers.map((game, idx) => {
              const configs = [
                { rotate: -14, translateY: 'clamp(16px, 4.5vw, 48px)', translateX: 'clamp(-220px, -23vw, -65px)', zIndex: 10, scale: 0.86 },
                { rotate:  -7, translateY: 'clamp(6px, 2vw, 18px)',    translateX: 'clamp(-110px, -11.5vw, -32px)', zIndex: 20, scale: 0.93 },
                { rotate:   0, translateY: '0px',                       translateX: '0px',                           zIndex: 30, scale: 1.00 },
                { rotate:   7, translateY: 'clamp(6px, 2vw, 18px)',    translateX: 'clamp(32px, 11.5vw, 110px)',   zIndex: 20, scale: 0.93 },
                { rotate:  14, translateY: 'clamp(16px, 4.5vw, 48px)', translateX: 'clamp(65px, 23vw, 220px)',    zIndex: 10, scale: 0.86 },
              ];
              const c = configs[idx] || configs[2];
              const distFromCenter = Math.abs(idx - 2);
              const transitionDelay = `${distFromCenter * 0.12}s`;

              const transform = isRevealed
                ? `translateX(${c.translateX}) translateY(${c.translateY}) rotate(${c.rotate}deg) scale(${c.scale})`
                : `translateX(0px) translateY(30px) rotate(0deg) scale(0.7)`;

              const opacity = isRevealed ? 1 : 0;

              return (
                <div
                  key={game.id}
                  className="absolute bottom-0 pointer-events-auto"
                  style={{
                    transform,
                    opacity,
                    zIndex: c.zIndex,
                    transformOrigin: 'bottom center',
                    transition: `transform 0.85s cubic-bezier(0.16, 1, 0.3, 1) ${transitionDelay}, opacity 0.6s ease-out ${transitionDelay}`,
                  }}
                >
                  <div className="relative w-[84px] h-[106px] min-[380px]:w-[100px] min-[380px]:h-[126px] min-[480px]:w-[130px] min-[480px]:h-[165px] sm:w-[180px] sm:h-[228px] md:w-[210px] md:h-[266px] lg:w-[230px] lg:h-[291px] rounded-xl min-[380px]:rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl transition-transform duration-300 hover:scale-105">
                    <Image
                      src={game.image}
                      alt={game.title}
                      fill
                      priority={idx === 0}
                      loading={idx === 0 ? "eager" : "lazy"}
                      sizes="(max-width: 380px) 84px, (max-width: 480px) 100px, (max-width: 640px) 130px, (max-width: 768px) 180px, 230px"
                      className="object-cover"
                      draggable={false}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};
