'use client';

import React from 'react';
import { useSiteData } from '@/context/SiteContext';
import { Container } from '../../layout/Container';
import { Heading } from '../../typography/Typography';
import { TestimonialCard } from '../cards/TestimonialCard';
import { Marquee } from '../../animation/Animation';

import { ScrollReveal } from '../../animation/ScrollReveal';

export const TestimonialSection: React.FC = () => {
  const { siteData } = useSiteData();
  const testimonials = siteData.testimonials;
  const sectionMeta = siteData.sections['testimonials'] || {
    title: 'Apa Kata Customer',
    subtitle: 'Apa kata para gamer & pelanggan tentang pengalaman seru bermain di DsterGame Studio',
  };

  return (
    <section id="testimonials" className="py-20 sm:py-24 bg-[var(--primary)] text-white overflow-hidden">
      <Container size="lg" className="mb-12">
        <ScrollReveal direction="up" duration={600}>
          <div className="text-center">
            <Heading level={2} className="text-3xl sm:text-4xl font-extrabold text-white mb-2">
              {sectionMeta.title}
            </Heading>
            <p className="text-sm text-blue-100 max-w-xl mx-auto font-medium">
              {sectionMeta.subtitle}
            </p>
          </div>
        </ScrollReveal>
      </Container>

      {/* Infinite Scrolling Marquee for Testimonial Cards */}
      <ScrollReveal direction="up" delay={200} duration={750} className="w-full">
        <div className="w-full py-4">
          <Marquee pauseOnHover speed={60} gap="gap-6" className="py-2">
            {testimonials.map((t) => (
              <TestimonialCard
                key={t.id}
                nickname={t.nickname}
                username={t.username}
                comment={t.comment}
                rating={t.rating}
              />
            ))}
          </Marquee>
        </div>
      </ScrollReveal>
    </section>
  );
};
