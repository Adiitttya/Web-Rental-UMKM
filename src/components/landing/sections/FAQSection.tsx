'use client';

import React from 'react';
import { useSiteData } from '@/context/SiteContext';
import { Container } from '../../layout/Container';
import { Heading } from '../../typography/Typography';
import { Accordion } from '../../data-display/DataDisplay';

import { ScrollReveal } from '../../animation/ScrollReveal';

export const FAQSection: React.FC = () => {
  const { siteData } = useSiteData();
  const faqs = siteData.faqs;
  const sectionMeta = siteData.sections['faq'] || {
    title: 'FAQ',
    subtitle: 'Pertanyaan yang sering ditanyakan seputar layanan, fasilitas, dan ketentuan sewa.',
  };

  const accordionItems = faqs.map((faq) => ({
    id: faq.id,
    question: faq.question,
    answer: faq.answer,
  }));

  return (
    <section id="faq" className="py-20 bg-[var(--primary)]">
      <Container size="lg">
        <ScrollReveal direction="up" duration={600}>
          <div className="text-center mb-12">
            <Heading level={2} className="text-3xl sm:text-4xl font-extrabold text-white">
              {sectionMeta.title}
            </Heading>
            {sectionMeta.subtitle && (
              <p className="text-xs sm:text-sm text-blue-100 mt-2 font-medium">
                {sectionMeta.subtitle}
              </p>
            )}
          </div>
        </ScrollReveal>

        <ScrollReveal direction="up" delay={200} duration={700}>
          <div className="max-w-3xl mx-auto">
            <Accordion items={accordionItems} />
          </div>
        </ScrollReveal>
      </Container>
    </section>
  );
};
