'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useSiteData } from '@/context/SiteContext';
import { Container } from '../../layout/Container';

export const FooterSection: React.FC = () => {
  const { siteData } = useSiteData();
  const { hero, navbar, contactInfo } = siteData;

  const getSectionIdFromHref = (href: string): string => {
    if (href === '/' || href === '#hero') return 'hero';
    return href.replace(/^\//, '').replace(/^#/, '');
  };

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    const secId = getSectionIdFromHref(href);
    const targetElem = document.getElementById(secId);

    if (targetElem) {
      e.preventDefault();
      targetElem.scrollIntoView({ behavior: 'smooth', block: 'start' });
      window.history.pushState(null, '', href);
    }
  };

  const renderSocialIcon = (iconName: string) => {
    switch (iconName) {
      case 'instagram':
        return (
          <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
            <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
          </svg>
        );
      case 'tiktok':
        return (
          <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
            <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 1 1-5.2-1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V5.8a6.34 6.34 0 0 0-1-.08 6.35 6.35 0 1 0 6.35 6.35V8.65a8.23 8.23 0 0 0 4.88 1.57V6.77a4.82 4.82 0 0 1-1-.08z" />
          </svg>
        );
      case 'whatsapp':
        return (
          <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
            <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l.399.635-1.002 3.657 3.753-.984.593.365z" />
          </svg>
        );
      case 'email':
        return (
          <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
            <path d="M0 3v18h24v-18h-24zm21.518 2l-9.518 7.713-9.518-7.713h19.036zm-19.518 14v-11.817l10 8.104 10-8.104v11.817h-20z" />
          </svg>
        );
      case 'x':
        return (
          <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
          </svg>
        );
      case 'youtube':
        return (
          <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
            <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
          </svg>
        );
      case 'facebook':
        return (
          <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
          </svg>
        );
      default:
        return (
          <svg className="w-4 h-4 stroke-current fill-none" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
          </svg>
        );
    }
  };

  // Dynamic social links from DB or fallback default
  const defaultSocialLinks = [
    { label: 'Instagram', url: `https://instagram.com/${contactInfo.instagram.replace('@', '')}`, icon: 'instagram' },
    { label: 'TikTok', url: `https://tiktok.com/@dster.game`, icon: 'tiktok' },
    { label: 'WhatsApp', url: `https://wa.me/${contactInfo.whatsapp}`, icon: 'whatsapp' },
    { label: 'Email', url: `mailto:${contactInfo.email}`, icon: 'email' },
  ];

  const activeSocialLinks = contactInfo.footerSocialLinks && contactInfo.footerSocialLinks.length > 0
    ? contactInfo.footerSocialLinks.map((s) => ({ label: s.platform, url: s.url, icon: s.icon }))
    : defaultSocialLinks;

  return (
    <footer className="bg-[var(--dark)] text-white pt-10 sm:pt-12 pb-5 border-t border-slate-800">
      <Container size="lg" className="text-center flex flex-col items-center">
        {/* Logo & Instagram Handle */}
        <div className="flex flex-col items-center justify-center mb-5">
          <Link
            href="/"
            onClick={(e) => handleNavClick(e, '/')}
            className="relative w-44 sm:w-56 h-12 mb-1 hover:scale-105 transition-transform duration-200"
          >
            <Image
              src={hero.logo}
              alt="DsterGame Footer Logo"
              fill
              sizes="224px"
              className="object-contain"
            />
          </Link>
          <span className="text-xs font-bold text-blue-400">
            {hero.instagram}
          </span>
        </div>

        {/* Footer Navigation Links */}
        <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 mb-6 px-4">
          {navbar.map((item) => (
            <Link
              key={item.id}
              href={item.href}
              onClick={(e) => handleNavClick(e, item.href)}
              className="text-xs sm:text-sm font-semibold text-gray-300 hover:text-blue-400 transition-colors"
            >
              {item.label}
            </Link>
          ))}
        </div>

        {/* Dynamic Social Media Icon Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-3.5 mb-6">
          {activeSocialLinks.map((s, idx) => (
            <a
              key={idx}
              href={s.url}
              target="_blank"
              rel="noopener noreferrer"
              title={s.label}
              aria-label={s.label}
              className="w-9 h-9 rounded-full bg-slate-800 text-gray-300 hover:bg-[var(--primary)] hover:text-white transition-all duration-300 flex items-center justify-center shadow-md transform hover:scale-110"
            >
              {renderSocialIcon(s.icon)}
            </a>
          ))}
        </div>

        {/* Compact Copyright Footer Line */}
        <div className="w-full border-t border-slate-800/80 pt-4 text-[11px] sm:text-xs text-gray-400 font-medium">
          {contactInfo.footerText}
        </div>
      </Container>
    </footer>
  );
};
