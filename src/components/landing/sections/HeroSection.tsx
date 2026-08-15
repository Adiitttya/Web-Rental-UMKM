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
      className="relative bg-[var(--background)] overflow-hidden flex flex-col justify-between pt-20 sm:pt-24 md:pt-28 min-h-auto md:min-h-[85vh] lg:min-h-screen"
    >
      {/* 3D Floating Decorations - Placed safely below fixed Navbar */}
      {hero.decorations?.wheel && (
        <div
          className="hidden sm:block absolute z-10 pointer-events-none transition-all duration-700 opacity-90 sm:opacity-100 top-[14%] left-[6%] md:left-[12%] lg:left-[16%] w-[50px] h-[50px] md:w-[70px] md:h-[70px] lg:w-[90px] lg:h-[90px]"
        >
          <div className="relative w-full h-full animate-float" style={{ animationDelay: '0s' }}>
            <Image
              src={hero.decorations.wheel}
              alt="Wheel Decoration"
              fill
              sizes="(max-width: 768px) 50px, (max-width: 1024px) 70px, 90px"
              className="object-contain drop-shadow-md sm:drop-shadow-xl"
              loading="lazy"
            />
          </div>
        </div>
      )}

      {hero.decorations?.stick && (
        <div
          className="hidden sm:block absolute z-10 pointer-events-none transition-all duration-700 opacity-90 sm:opacity-100 top-[12%] right-[6%] md:right-[12%] lg:right-[18%] w-[45px] h-[45px] md:w-[65px] md:h-[65px] lg:w-[85px] lg:h-[85px]"
        >
          <div className="relative w-full h-full animate-float" style={{ animationDelay: '0.8s' }}>
            <Image
              src={hero.decorations.stick}
              alt="Stick Decoration"
              fill
              sizes="(max-width: 768px) 45px, (max-width: 1024px) 65px, 85px"
              className="object-contain drop-shadow-md sm:drop-shadow-xl"
              loading="lazy"
            />
          </div>
        </div>
      )}

      {hero.decorations?.gamepad && (
        <div
          className="absolute z-10 pointer-events-none transition-all duration-700 opacity-80 sm:opacity-100 top-[14%] sm:top-[28%] left-[1.5%] sm:left-[6%] lg:left-[10%] w-[44px] h-[44px] sm:w-[80px] sm:h-[80px] lg:w-[120px] lg:h-[120px]"
        >
          <div className="relative w-full h-full animate-float" style={{ animationDelay: '1.4s' }}>
            <Image
              src={hero.decorations.gamepad}
              alt="GamePad Decoration"
              fill
              sizes="(max-width: 640px) 44px, (max-width: 1024px) 80px, 120px"
              className="object-contain drop-shadow-md sm:drop-shadow-xl"
              loading="lazy"
            />
          </div>
        </div>
      )}

      {hero.decorations?.vr && (
        <div
          className="absolute z-10 pointer-events-none transition-all duration-700 opacity-80 sm:opacity-100 top-[13%] sm:top-[26%] right-[1.5%] sm:right-[6%] lg:right-[10%] w-[46px] h-[46px] sm:w-[85px] sm:h-[85px] lg:w-[130px] lg:h-[130px]"
        >
          <div className="relative w-full h-full animate-float" style={{ animationDelay: '2s' }}>
            <Image
              src={hero.decorations.vr}
              alt="VR Decoration"
              fill
              sizes="(max-width: 640px) 46px, (max-width: 1024px) 85px, 130px"
              className="object-contain drop-shadow-md sm:drop-shadow-xl"
              loading="lazy"
            />
          </div>
        </div>
      )}

      {/* Hero Central Content (Instant SSR Render for LCP Optimization) */}
      <Container
        size="lg"
        className="relative z-20 flex flex-col items-center text-center pt-3 sm:pt-10 md:pt-16 pb-2 sm:pb-6"
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
