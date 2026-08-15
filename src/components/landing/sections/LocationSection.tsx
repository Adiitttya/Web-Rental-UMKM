'use client';

import React, { useState, useMemo } from 'react';
import { useSiteData } from '@/context/SiteContext';
import { BranchLocation } from '@/data/mock-landing';
import { Container } from '../../layout/Container';
import { Heading, Paragraph } from '../../typography/Typography';
import { Button } from '../../navigation/Button';
import { ScrollReveal } from '../../animation/ScrollReveal';

export const LocationSection: React.FC = () => {
  const { siteData } = useSiteData();
  const branches = siteData.branchLocations;
  const sectionMeta = siteData.sections['location'] || {
    title: 'Location',
    subtitle: 'Temukan lokasi cabang utama DsterGame Studio atau titik terdekat untuk bermain bersama komunitas.',
  };

  const [selectedBranchId, setSelectedBranchId] = useState<string | null>(null);

  const activeBranch: BranchLocation = useMemo(() => {
    return (
      branches.find((b) => b.id === selectedBranchId) ||
      branches[0] || {
        id: 'default',
        name: 'DsterGame Studio',
        address: siteData.contactInfo.address,
        lat: -7.140263,
        lng: 110.407612,
        phone: siteData.contactInfo.phone,
        mapUrl: 'https://maps.google.com',
        embedUrl: 'https://maps.google.com/maps?q=-7.140263,110.407612&z=17&output=embed',
      }
    );
  }, [branches, selectedBranchId, siteData.contactInfo]);

  const mapEmbedSrc = useMemo(() => {
    if (!activeBranch) return '';
    if (activeBranch.embedUrl && activeBranch.embedUrl.includes('output=embed')) {
      return activeBranch.embedUrl.replace(/\s+/g, '');
    }
    if (activeBranch.lat && activeBranch.lng) {
      return `https://maps.google.com/maps?q=${activeBranch.lat},${activeBranch.lng}&z=17&output=embed`;
    }
    return `https://maps.google.com/maps?q=${encodeURIComponent(activeBranch.address || activeBranch.name)}&z=17&output=embed`;
  }, [activeBranch]);

  return (
    <section id="location" className="relative py-20 sm:py-24 bg-[var(--primary)] text-white overflow-hidden rounded-t-[3rem] md:rounded-t-[5rem]">
      <Container size="lg" className="relative z-10">
        <ScrollReveal direction="up" duration={600}>
          <div className="text-center mb-8 sm:mb-10">
            <Heading level={2} className="text-3xl sm:text-4xl font-extrabold text-white mb-3">
              {sectionMeta.title}
            </Heading>
            <Paragraph className="text-sm sm:text-base text-white max-w-xl mx-auto font-medium opacity-90 leading-relaxed">
              {sectionMeta.subtitle}
            </Paragraph>
          </div>
        </ScrollReveal>

        {/* Capsule Pill Branch Tabs */}
        {branches.length > 1 && (
          <ScrollReveal direction="up" delay={150} duration={600}>
            <div className="flex justify-center mb-8 px-2">
              <div className="inline-flex max-w-full overflow-x-auto no-scrollbar items-center p-1 sm:p-1.5 rounded-full bg-[var(--card-bg)] border border-blue-200 shadow-xl gap-1 sm:gap-1.5">
                {branches.map((branch, idx) => {
                  const isSelected = activeBranch.id === branch.id;
                  return (
                    <button
                      key={branch.id ? `${branch.id}-${idx}` : `branch-${idx}`}
                      onClick={() => setSelectedBranchId(branch.id)}
                      className={`px-4 sm:px-6 py-2 sm:py-2.5 rounded-full text-xs sm:text-sm font-extrabold transition-all duration-200 cursor-pointer flex items-center gap-2 whitespace-nowrap ${
                        isSelected
                          ? 'bg-[var(--primary)] text-white shadow-md shadow-blue-900/30 scale-100'
                          : 'text-[var(--dark)] hover:text-[var(--primary)] hover:bg-slate-100'
                      }`}
                    >
                      <svg
                        className={`w-4 h-4 transition-colors ${isSelected ? 'text-white' : 'text-current'}`}
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2.2}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                        />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      {branch.name}
                    </button>
                  );
                })}
              </div>
            </div>
          </ScrollReveal>
        )}

        {/* Location Card Box */}
        {activeBranch && (
          <ScrollReveal direction="up" delay={250} duration={700}>
            <div className="max-w-4xl mx-auto bg-[var(--card-bg)] rounded-3xl p-4 sm:p-6 shadow-2xl overflow-hidden">
              <div className="relative w-full aspect-[4/3] sm:aspect-[16/9] rounded-2xl overflow-hidden bg-slate-100 shadow-inner">
                <iframe
                  key={activeBranch.id || 'primary-map'}
                  title={`Map Location - ${activeBranch.name}`}
                  aria-label={`Peta Lokasi Google Maps untuk ${activeBranch.name}`}
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  loading="lazy"
                  allowFullScreen
                  referrerPolicy="strict-origin-when-cross-origin"
                  src={mapEmbedSrc}
                  className="w-full h-full rounded-2xl border-0"
                />
              </div>

              <div className="mt-5 pt-2 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-[var(--dark)] px-1 sm:px-2">
                <div>
                  <h4 className="font-extrabold text-lg sm:text-xl text-[var(--dark)] tracking-tight">{activeBranch.name}</h4>
                  <p className="text-xs sm:text-sm text-slate-600 mt-1 font-medium">{activeBranch.address}</p>
                </div>

                <a
                  href={activeBranch.mapUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto shrink-0"
                >
                  <Button
                    variant="primary"
                    size="sm"
                    className="w-full sm:w-auto bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-white font-extrabold !rounded-full px-7 py-2.5 text-xs sm:text-sm shadow-md hover:shadow-blue-500/30 transition-colors duration-200"
                  >
                    Petunjuk Arah
                  </Button>
                </a>
              </div>
            </div>
          </ScrollReveal>
        )}
      </Container>
    </section>
  );
};
