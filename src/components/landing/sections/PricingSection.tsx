'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { useSiteData } from '@/context/SiteContext';
import { Container } from '../../layout/Container';
import { Heading } from '../../typography/Typography';
import { Tabs } from '../../navigation/Tabs';

import { ScrollReveal } from '../../animation/ScrollReveal';

export const PricingSection: React.FC = () => {
  const { siteData } = useSiteData();
  const pricingTabs = siteData.pricingTabs;
  const sectionMeta = siteData.sections['pricing'] || {
    title: 'Pricing',
    subtitle: 'Pilih paket rental konsol paling pas sesuai durasi & fasilitas favoritmu.',
  };

  const [activeTab, setActiveTab] = useState(pricingTabs[0]?.id || 'main');

  const selectedTab = pricingTabs.find((t) => t.id === activeTab) || pricingTabs[0] || {
    id: 'main',
    label: 'Pricelist Main',
    columns: [],
  };

  const tabOptions = pricingTabs.map((t) => ({
    id: t.id,
    label: t.label,
  }));

  const allItems = selectedTab.columns ? selectedTab.columns.flatMap((col) => col.items) : [];

  return (
    <section id="pricing" className="py-20 sm:py-24 bg-[var(--background)] relative overflow-hidden">
      <Container size="lg">
        {/* Title */}
        <ScrollReveal direction="up" duration={600}>
          <div className="text-center mb-10">
            <Heading level={2} className="text-3xl sm:text-4xl font-extrabold text-[var(--dark)] mb-4">
              {sectionMeta.title}
            </Heading>
            {(selectedTab.subtitle || sectionMeta.subtitle) && (
              <p className="text-sm text-gray-600 max-w-xl mx-auto mb-6 font-medium">
                {selectedTab.subtitle || sectionMeta.subtitle}
              </p>
            )}

            {/* Tabs Switcher */}
            {tabOptions.length > 0 && (
              <div className="flex justify-center overflow-x-auto pb-3 horizontal-scrollbar max-w-full px-2 sm:px-0">
                <Tabs
                  tabs={tabOptions}
                  activeTabId={activeTab}
                  onChange={(id) => setActiveTab(id)}
                />
              </div>
            )}
          </div>
        </ScrollReveal>

        {/* Pricing Container Wrapper with Outer Floating Blur Stars */}
        <ScrollReveal direction="up" delay={200} duration={750} className="w-full">
        <div className="relative max-w-5xl mx-auto px-2 sm:px-0">
          {/* Floating Outer Star Decoration Left */}
          <div className="absolute -top-8 -left-6 sm:-top-10 sm:-left-10 w-20 h-20 sm:w-32 sm:h-32 pointer-events-none z-10 animate-float opacity-80">
            <Image
              src="/Decoration/Decoration-Star.png"
              alt="Decoration Star"
              fill
              sizes="(max-width: 640px) 80px, 128px"
              className="object-contain"
            />
          </div>

          {/* Floating Outer Star Decoration Right */}
          <div className="absolute -bottom-8 -right-6 sm:-bottom-10 sm:-right-10 w-24 h-24 sm:w-36 sm:h-36 pointer-events-none z-10 animate-float opacity-80 [animation-delay:2s]">
            <Image
              src="/Decoration/Decoration-Star.png"
              alt="Decoration Star"
              fill
              sizes="(max-width: 640px) 96px, 144px"
              className="object-contain"
            />
          </div>

          {/* Pricing Main Container - Fixed Consistent Height */}
          <div className="relative bg-[var(--primary)] rounded-3xl p-3.5 sm:p-6 shadow-2xl text-white border border-blue-600 h-[540px] sm:h-[570px] flex flex-col justify-between overflow-hidden">
            {/* Scrollable Item Cards Grid with CSS Containment & GPU Layer Optimization */}
            <div className="flex-1 min-h-0 overflow-y-auto custom-scrollbar p-2.5 sm:p-3.5 [contain:content] overscroll-y-auto">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 sm:gap-4 auto-rows-fr">
                {allItems.map((pkg) => {
                  const rates = pkg.rates && pkg.rates.length > 0 
                    ? pkg.rates 
                    : pkg.price 
                      ? [{ duration: pkg.timeRange || 'Per Jam', price: pkg.price }]
                      : [];

                  return (
                    <div
                      key={pkg.id}
                      className="bg-white text-[var(--dark)] rounded-2xl p-4 sm:p-4.5 flex flex-col justify-between h-full transform-gpu transition-transform transition-shadow duration-150 hover:-translate-y-1 hover:shadow-xl hover:border-blue-400 shadow-md border border-blue-100/60 min-h-[160px]"
                    >
                      <div className="space-y-3">
                        {/* Header Title Badge */}
                        <div className="flex items-center justify-between gap-2">
                          <span className="bg-blue-50 text-[var(--primary)] px-3 py-1.5 rounded-xl font-bold text-xs sm:text-sm border border-blue-100 shadow-xs truncate max-w-full">
                            {pkg.vipName}
                          </span>
                        </div>

                        {/* Rates Array (Gambar 1 style: rate pills stacked for duration & pricing) */}
                        {rates.length > 0 && (
                          <div className="flex flex-col gap-1.5 pt-0.5">
                            {rates.map((r, rIdx) => (
                              <div
                                key={rIdx}
                                className="bg-blue-50/60 border border-blue-100 rounded-xl px-3 py-1.5 flex items-center justify-between gap-2 text-xs"
                              >
                                <span className="text-blue-700 font-semibold bg-blue-100/90 px-2 py-0.5 rounded-md">{r.duration}</span>
                                <span className="text-[var(--primary)] font-bold text-sm">{r.price}</span>
                              </div>
                            ))}
                          </div>
                        )}

                        {/* Features Bullet List */}
                        {pkg.features && pkg.features.length > 0 && (
                          <div className="pt-2 border-t border-slate-100 flex flex-col gap-1.5">
                            {pkg.features.map((feat, fIdx) => (
                              <div key={fIdx} className="flex items-center gap-2 text-xs text-slate-700 font-medium">
                                <svg className="w-3.5 h-3.5 text-[var(--primary)] shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                </svg>
                                <span>{feat}</span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Description */}
                      {pkg.description && (
                        <p className="text-xs text-slate-500 pt-2 border-t border-slate-100 leading-snug break-words italic mt-2 font-normal">
                          {pkg.description}
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* S&K Text INSIDE Container Footer (No Emoji / Icon) */}
            {selectedTab.terms && (
              <div className="mt-3 pt-2.5 border-t border-white/20 text-center shrink-0">
                <p className="text-[11px] sm:text-xs text-blue-100/90 font-medium leading-tight">
                  S&K: {selectedTab.terms}
                </p>
              </div>
            )}
          </div>
        </div>
        </ScrollReveal>
      </Container>
    </section>
  );
};
