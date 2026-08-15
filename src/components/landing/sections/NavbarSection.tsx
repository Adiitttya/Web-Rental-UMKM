'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useSiteData } from '@/context/SiteContext';
import { Container } from '../../layout/Container';
import { Button } from '../../navigation/Button';
import { isEventNewOrUpcoming } from '@/utils/eventUtils';

const getSectionIdFromHref = (href: string): string => {
  if (href === '/' || href === '#hero') return 'hero';
  return href.replace(/^\//, '').replace(/^#/, '');
};

export const NavbarSection: React.FC = () => {
  const { siteData } = useSiteData();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSectionId, setActiveSectionId] = useState<string>('hero');

  const { navbar, hero, contactInfo } = siteData;

  // Filter navbar items for header display (only main 6 sections: Home, List Game, Pricing, Events, Gallery, Location)
  const headerNavItems = navbar.filter((item) => {
    const secId = getSectionIdFromHref(item.href);
    return ['hero', 'list-game', 'pricing', 'event', 'gallery', 'location'].includes(secId);
  });

  useEffect(() => {
    let ticking = false;

    const updateScrollState = () => {
      setIsScrolled(window.scrollY > 20);

      // ScrollSpy: Determine active section based on scroll offset
      const sectionIds = headerNavItems.map((item) => getSectionIdFromHref(item.href));
      const scrollPosition = window.scrollY + 180;

      for (let i = sectionIds.length - 1; i >= 0; i--) {
        const secId = sectionIds[i];
        const elem = document.getElementById(secId);
        if (elem) {
          const top = elem.offsetTop;
          if (scrollPosition >= top) {
            setActiveSectionId(secId);
            break;
          }
        }
      }
      ticking = false;
    };

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(updateScrollState);
        ticking = true;
      }
    };

    updateScrollState();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [headerNavItems]);

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    const secId = getSectionIdFromHref(href);
    const targetElem = document.getElementById(secId);

    if (targetElem) {
      e.preventDefault();
      targetElem.scrollIntoView({ behavior: 'smooth', block: 'start' });
      setActiveSectionId(secId);
      setMobileMenuOpen(false);
      window.history.pushState(null, '', href);
    }
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 transform-gpu ${
        isScrolled
          ? 'bg-[#FAFAFA]/95 backdrop-blur-md shadow-md py-2 border-b border-gray-200/60'
          : 'bg-[#FAFAFA]/85 backdrop-blur-sm py-2.5 sm:py-3 border-b border-gray-100/50'
      }`}
    >
      <Container size="lg">
        <div className="flex items-center justify-between h-11">
          {/* Logo */}
          <Link
            href="/"
            onClick={(e) => handleNavClick(e, '/')}
            className="flex items-center group"
          >
            <div className="relative w-28 sm:w-36 h-8 sm:h-9 transition-transform duration-200 group-hover:scale-105">
              <Image
                src={hero.logo}
                alt="DsterGame Logo"
                fill
                sizes="(max-width: 640px) 112px, 144px"
                className="object-contain"
                priority
              />
            </div>
          </Link>

          {/* Nav Items — Desktop (Only Main Important Sections) */}
          <nav className="hidden lg:flex items-center gap-6">
            {headerNavItems.map((item) => {
              const secId = getSectionIdFromHref(item.href);
              const isActive = activeSectionId === secId;
              const isEventItem = secId === 'event';
              const hasEventNotif = isEventItem && siteData.events?.some((e) => isEventNewOrUpcoming(e));

              return (
                <Link
                  key={item.id}
                  href={item.href}
                  onClick={(e) => handleNavClick(e, item.href)}
                  className={`text-xs font-semibold transition-colors duration-200 py-1 border-b-2 flex items-center gap-1.5 ${
                    isActive
                      ? 'text-[var(--primary)] border-[var(--primary)] font-bold'
                      : 'text-[var(--dark)] border-transparent hover:text-[var(--primary)] hover:border-[var(--primary)]'
                  }`}
                >
                  <span>{item.label}</span>
                  {hasEventNotif && (
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75" />
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-[var(--primary)]" />
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Right Action */}
          <div className="flex items-center gap-3">
            <a
              href={`https://wa.me/${contactInfo.whatsapp}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button
                variant="primary"
                size="sm"
                className="bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-white font-extrabold !rounded-full px-5 py-1.5 text-xs shadow-md transition-all hover:shadow-blue-500/30"
              >
                Reservasi
              </Button>
            </a>

            {/* Animated Hamburger / Cross Morphing Toggle Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden relative w-10 h-10 flex flex-col justify-center items-center rounded-xl text-gray-700 hover:text-[var(--primary)] hover:bg-gray-100/80 transition-colors cursor-pointer focus:outline-none"
              aria-label="Toggle Navigation Menu"
            >
              <div className="w-5 h-4 relative flex flex-col justify-between">
                <span
                  className={`w-full h-0.5 bg-current rounded-full transition-all duration-300 ease-in-out transform origin-center ${
                    mobileMenuOpen ? 'rotate-45 translate-y-[7px]' : ''
                  }`}
                />
                <span
                  className={`w-full h-0.5 bg-current rounded-full transition-all duration-200 ease-in-out ${
                    mobileMenuOpen ? 'opacity-0 scale-x-0' : 'opacity-100 scale-x-100'
                  }`}
                />
                <span
                  className={`w-full h-0.5 bg-current rounded-full transition-all duration-300 ease-in-out transform origin-center ${
                    mobileMenuOpen ? '-rotate-45 -translate-y-[7px]' : ''
                  }`}
                />
              </div>
            </button>
          </div>
        </div>

        {/* Animated Mobile Navigation Drawer */}
        <div
          className={`lg:hidden overflow-hidden transition-all duration-300 ease-in-out ${
            mobileMenuOpen
              ? 'max-h-96 opacity-100 translate-y-0 mt-3'
              : 'max-h-0 opacity-0 -translate-y-2 pointer-events-none mt-0'
          }`}
        >
          <div className="pt-3 pb-4 px-2 border border-gray-200/80 bg-white/95 backdrop-blur-lg rounded-2xl shadow-xl">
            <nav className="flex flex-col space-y-1">
              {headerNavItems.map((item) => {
                const secId = getSectionIdFromHref(item.href);
                const isActive = activeSectionId === secId;
                const isEventItem = secId === 'event';
                const hasEventNotif = isEventItem && siteData.events?.some((e) => isEventNewOrUpcoming(e));

                return (
                  <Link
                    key={item.id}
                    href={item.href}
                    onClick={(e) => handleNavClick(e, item.href)}
                    className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center justify-between ${
                      isActive
                        ? 'text-[var(--primary)] bg-blue-50/80 font-extrabold border-l-4 border-[var(--primary)] shadow-xs'
                        : 'text-[var(--dark)] hover:text-[var(--primary)] hover:bg-blue-50/50'
                    }`}
                  >
                    <span>{item.label}</span>
                    {hasEventNotif && (
                      <span className="bg-[var(--primary)] text-white text-[10px] font-extrabold px-2 py-0.5 rounded-full animate-pulse uppercase tracking-wider">
                        NEW
                      </span>
                    )}
                  </Link>
                );
              })}
            </nav>
          </div>
        </div>
      </Container>
    </header>
  );
};
