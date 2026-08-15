'use client';

import React from 'react';
import { useSiteData } from '@/context/SiteContext';
import { Container } from '../../layout/Container';
import { Heading, Paragraph } from '../../typography/Typography';
import { Button } from '../../navigation/Button';

import { ScrollReveal } from '../../animation/ScrollReveal';

export const ContactSection: React.FC = () => {
  const { siteData } = useSiteData();
  const { contactInfo, sections, branchLocations } = siteData;
  const sectionMeta = sections['contact'] || {
    title: 'Contact Us',
    subtitle: 'Punya pertanyaan seputar booking tempat, reservasi turnamen, atau sewa bawa pulang konsol? Hubungi admin kami melalui WhatsApp.',
  };

  const branch1Phone = branchLocations[0]?.phone || contactInfo.phone;
  const branch2Phone = branchLocations[1]?.phone || contactInfo.phone;

  return (
    <section id="contact" className="py-20 sm:py-24 bg-[var(--primary)] text-white relative overflow-hidden">
      <Container size="lg" className="relative z-10 text-center">
        <ScrollReveal direction="up" duration={600}>
          <Heading level={2} className="text-3xl sm:text-4xl font-extrabold text-white mb-4">
            {sectionMeta.title}
          </Heading>

          <Paragraph className="text-sm sm:text-base text-white max-w-xl mx-auto mb-10 font-medium leading-relaxed">
            {sectionMeta.subtitle}
          </Paragraph>
        </ScrollReveal>

        <ScrollReveal direction="up" delay={200} duration={650}>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <a
              href={`https://wa.me/${branch1Phone}?text=Halo%20Admin%20DsterGame,%20saya%20ingin%20tanya%20rental`}
              target="_blank"
              rel="noopener noreferrer"
              className="shrink-0"
            >
              <Button
                variant="ghost"
                size="sm"
                className="!bg-white !text-[var(--primary)] hover:!bg-white hover:!text-[var(--primary)] border-none font-extrabold !rounded-full px-8 py-3 shadow-md hover:shadow-[0_0_20px_rgba(255,255,255,0.7)] hover:scale-105 transition-all duration-300 text-xs sm:text-sm"
              >
                Admin 1
              </Button>
            </a>

            <a
              href={`https://wa.me/${branch2Phone}?text=Halo%20Admin%20DsterGame,%20saya%20ingin%20tanya%20reservasi`}
              target="_blank"
              rel="noopener noreferrer"
              className="shrink-0"
            >
              <Button
                variant="ghost"
                size="sm"
                className="!bg-white !text-[var(--primary)] hover:!bg-white hover:!text-[var(--primary)] border-none font-extrabold !rounded-full px-8 py-3 shadow-md hover:shadow-[0_0_20px_rgba(255,255,255,0.7)] hover:scale-105 transition-all duration-300 text-xs sm:text-sm"
              >
                Admin 2
              </Button>
            </a>
          </div>
        </ScrollReveal>
      </Container>
    </section>
  );
};
