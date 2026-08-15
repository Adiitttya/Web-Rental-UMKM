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
      className="relative bg-[var(--background)] overflow-hidden flex flex-col justify-between pt-16 sm:pt-20 min-h-auto md:min-h-[85vh] lg:min-h-screen"
    >
      {/* 3D Floating Decorations - Adjusted for Mobile framing */}
      {hero.decorations?.wheel && (
        <div
          className="absolute z-10 pointer-events-none transition-all duration-700 opacity-90 sm:opacity-100 top-[6%] left-[3%] sm:top-[12%] sm:left-[14%] lg:left-[18%] w-[42px] h-[42px] sm:w-[70px] sm:h-[70px] lg:w-[95px] lg:h-[95px]"
        >
          <div className="relative w-full h-full animate-float" style={{ animationDelay: '0s' }}>
            <Image
              src={hero.decorations.wheel}
              alt="Wheel Decoration"
              fill
              sizes="(max-width: 640px) 42px, (max-width: 1024px) 70px, 95px"
              className="object-contain drop-shadow-md sm:drop-shadow-xl"
              loading="lazy"
            />
          </div>
        </div>
      )}

      {hero.decorations?.stick && (
        <div
          className="absolute z-10 pointer-events-none transition-all duration-700 opacity-90 sm:opacity-100 top-[5%] right-[3%] sm:top-[10%] sm:right-[15%] lg:right-[20%] w-[38px] h-[38px] sm:w-[65px] sm:h-[65px] lg:w-[85px] lg:h-[85px]"
        >
          <div className="relative w-full h-full animate-float" style={{ animationDelay: '0.8s' }}>
            <Image
              src={hero.decorations.stick}
              alt="Stick Decoration"
              fill
              sizes="(max-width: 640px) 38px, (max-width: 1024px) 65px, 85px"
              className="object-contain drop-shadow-md sm:drop-shadow-xl"
              loading="lazy"
            />
          </div>
        </div>
      )}

      {hero.decorations?.gamepad && (
        <div
          className="absolute z-10 pointer-events-none transition-all duration-700 opacity-90 sm:opacity-100 top-[20%] left-[2%] sm:top-[28%] sm:left-[8%] lg:left-[12%] w-[52px] h-[52px] sm:w-[90px] sm:h-[90px] lg:w-[125px] lg:h-[125px]"
        >
          <div className="relative w-full h-full animate-float" style={{ animationDelay: '1.4s' }}>
            <Image
              src={hero.decorations.gamepad}
              alt="GamePad Decoration"
              fill
              sizes="(max-width: 640px) 52px, (max-width: 1024px) 90px, 125px"
              className="object-contain drop-shadow-md sm:drop-shadow-xl"
              loading="lazy"
            />
          </div>
        </div>
      )}

      {hero.decorations?.vr && (
        <div
          className="absolute z-10 pointer-events-none transition-all duration-700 opacity-90 sm:opacity-100 top-[19%] right-[2%] sm:top-[26%] sm:right-[8%] lg:right-[12%] w-[55px] h-[55px] sm:w-[95px] sm:h-[95px] lg:w-[135px] lg:h-[135px]"
        >
          <div className="relative w-full h-full animate-float" style={{ animationDelay: '2s' }}>
            <Image
              src={hero.decorations.vr}
              alt="VR Decoration"
              fill
              sizes="(max-width: 640px) 55px, (max-width: 1024px) 95px, 135px"
              className="object-contain drop-shadow-md sm:drop-shadow-xl"
              loading="lazy"
            />
          </div>
        </div>
      )}

      {/* Hero Central Content (Instant SSR Render for LCP Optimization) */}
      <Container
        size="lg"
        className="relative z-20 flex flex-col items-center text-center pt-6 sm:pt-14 md:pt-20 pb-2 sm:pb-6"
      >
        {/* Logo DsterGame - Primary LCP Candidate */}
        <div className="relative w-56 sm:w-80 md:w-[420px] lg:w-[480px] aspect-[460/140] mb-2 sm:mb-3 hover:scale-105 transition-transform duration-300">
          <Image
            src={hero.logo}
            alt="DsterGame Logo"
            fill
            sizes="(max-width: 640px) 224px, (max-width: 768px) 320px, 480px"
            className="object-contain drop-shadow-2xl"
            priority
            loading="eager"
          />
        </div>

        {/* Instagram Handle */}
        <p className="text-[11px] sm:text-sm font-bold text-[var(--dark)]/75 tracking-wider bg-blue-50/80 px-3.5 py-0.5 sm:px-4 sm:py-1 rounded-full border border-blue-100/60 shadow-sm">
          {hero.instagram}
        </p>

        {/* Explore Button */}
        <div className="mt-4 sm:mt-6 md:mt-8">
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
      <div className="w-full mt-2 sm:mt-4 pb-2 sm:pb-0" ref={coversRef}>
        <div className="relative w-full flex justify-center items-end z-20 pt-2 sm:pt-4 overflow-hidden min-h-[140px] min-[380px]:min-h-[165px] min-[480px]:min-h-[200px] sm:min-h-[260px] md:min-h-[300px]">
          <div className="absolute bottom-0 left-0 right-0 h-16 min-[480px]:h-24 sm:h-36 bg-gradient-to-t from-[var(--background)] via-[var(--background)]/80 to-transparent z-40 pointer-events-none" />

          <div className="relative flex items-end justify-center pointer-events-none select-none w-full max-w-[960px] h-[130px] min-[380px]:h-[155px] min-[480px]:h-[190px] sm:h-[260px] md:h-[300px]">
            {hero.gameCovers.map((game, idx) => {
              const configs = [
                { rotate: -14, translateY: 'clamp(14px, 4vw, 48px)', translateX: 'clamp(-180px, -22vw, -60px)', zIndex: 10, scale: 0.86 },
                { rotate:  -7, translateY: 'clamp(5px, 1.8vw, 18px)', translateX: 'clamp(-90px, -11vw, -30px)',   zIndex: 20, scale: 0.93 },
                { rotate:   0, translateY: '0px',                     translateX: '0px',                           zIndex: 30, scale: 1.00 },
                { rotate:   7, translateY: 'clamp(5px, 1.8vw, 18px)', translateX: 'clamp(30px, 11vw, 90px)',     zIndex: 20, scale: 0.93 },
                { rotate:  14, translateY: 'clamp(14px, 4vw, 48px)', translateX: 'clamp(60px, 22vw, 180px)',    zIndex: 10, scale: 0.86 },
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
                  <div className="relative w-[78px] h-[98px] min-[380px]:w-[94px] min-[380px]:h-[118px] min-[480px]:w-[125px] min-[480px]:h-[158px] sm:w-[170px] sm:h-[215px] md:w-[200px] md:h-[254px] lg:w-[220px] lg:h-[278px] rounded-xl min-[380px]:rounded-2xl sm:rounded-3xl overflow-hidden shadow-xl sm:shadow-2xl transition-transform duration-300 hover:scale-105">
                    <Image
                      src={game.image}
                      alt={game.title}
                      fill
                      priority={idx === 0}
                      loading={idx === 0 ? "eager" : "lazy"}
                      sizes="(max-width: 380px) 78px, (max-width: 480px) 94px, (max-width: 640px) 125px, (max-width: 768px) 170px, 220px"
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
