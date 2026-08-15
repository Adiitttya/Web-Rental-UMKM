'use client';

import React, { useEffect } from 'react';
import {
  NavbarSection,
  HeroSection,
  ListGameSection,
  PricingSection,
  EventSection,
  GallerySection,
  LocationSection,
  TestimonialSection,
  FAQSection,
  FeedbackSection,
  ContactSection,
  FooterSection,
} from '@/components/landing';
import { SiteDataProvider, SiteDataState } from '@/context/SiteContext';

interface LandingPageProps {
  initialSection?: string;
  initialData?: SiteDataState;
}

export const LandingPage: React.FC<LandingPageProps> = ({ initialSection, initialData }) => {
  useEffect(() => {
    if (initialSection) {
      const timer = setTimeout(() => {
        const elem = document.getElementById(initialSection);
        if (elem) {
          elem.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 150);
      return () => clearTimeout(timer);
    }
  }, [initialSection]);

  // Asset Protection: Prevent Right-Click Download & Drag-and-Drop on Media Elements
  useEffect(() => {
    const handleContextMenu = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (
        target &&
        (target.tagName === 'IMG' ||
          target.tagName === 'VIDEO' ||
          target.closest('img') ||
          target.closest('picture'))
      ) {
        e.preventDefault();
      }
    };

    const handleDragStart = (e: DragEvent) => {
      const target = e.target as HTMLElement;
      if (
        target &&
        (target.tagName === 'IMG' ||
          target.tagName === 'VIDEO' ||
          target.closest('img') ||
          target.closest('picture'))
      ) {
        e.preventDefault();
      }
    };

    document.addEventListener('contextmenu', handleContextMenu);
    document.addEventListener('dragstart', handleDragStart);

    return () => {
      document.removeEventListener('contextmenu', handleContextMenu);
      document.removeEventListener('dragstart', handleDragStart);
    };
  }, []);

  return (
    <SiteDataProvider initialData={initialData}>
      <main className="min-h-screen bg-[var(--background)] text-[var(--foreground)]">
        <NavbarSection />
        <HeroSection />
        <ListGameSection />
        <PricingSection />
        <EventSection />
        <GallerySection />
        <LocationSection />
        <TestimonialSection />
        <FAQSection />
        <FeedbackSection />
        <ContactSection />
        <FooterSection />
      </main>
    </SiteDataProvider>
  );
};
