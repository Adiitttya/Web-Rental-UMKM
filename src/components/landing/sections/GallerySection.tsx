'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { useSiteData } from '@/context/SiteContext';
import { GalleryPhoto } from '@/data/mock-landing';
import { Container } from '../../layout/Container';
import { Modal } from '../../overlay/Modal';
import { ScrollReveal } from '../../animation/ScrollReveal';

export const GallerySection: React.FC = () => {
  const { siteData } = useSiteData();
  const galleryPhotos = siteData.galleryPhotos;

  const [selectedPhoto, setSelectedPhoto] = useState<GalleryPhoto | null>(null);

  // Decorative text elements for "G A L L E R Y"
  const galleryLetters = [
    { letter: 'G', image: '/Other/Gallery-G.png' },
    { letter: 'A', image: '/Other/Gallery-A.png' },
    { letter: 'L', image: '/Other/Gallery-L.png' },
    { letter: 'L', image: '/Other/Gallery-L.png' },
    { letter: 'E', image: '/Other/Gallery-E.png' },
    { letter: 'R', image: '/Other/Gallery-R.png' },
    { letter: 'Y', image: '/Other/Gallery-Y.png' },
  ];

  return (
    <section id="gallery" className="py-16 sm:py-24 bg-[var(--background)] overflow-hidden relative">
      <Container size="lg">
        <div className="relative flex flex-col items-center justify-center">
          
          {/* Decorative 3D "G A L L E R Y" Title Banner */}
          <ScrollReveal direction="zoom" duration={700}>
            <div className="flex items-center justify-center gap-1.5 xs:gap-2.5 sm:gap-4 md:gap-6 z-10 select-none mb-10 sm:mb-16 w-full px-2">
              {galleryLetters.map((item, idx) => (
                <div
                  key={idx}
                  className="relative w-9 h-9 xs:w-11 xs:h-11 sm:w-16 sm:h-16 md:w-20 md:h-20 lg:w-24 lg:h-24 transition-transform duration-300 hover:scale-105 pointer-events-none shrink-0"
                >
                  <Image
                    src={item.image}
                    alt={`Gallery ${item.letter}`}
                    fill
                    sizes="(max-width: 640px) 44px, (max-width: 768px) 64px, 96px"
                    className="object-contain drop-shadow-xl"
                    priority={idx < 3}
                  />
                </div>
              ))}
            </div>
          </ScrollReveal>

          {/* Interactive Floating Circle Photos */}
          <div className="w-full max-w-5xl flex flex-wrap items-center justify-center gap-4 sm:gap-8 md:gap-10 z-20 px-2">
            {galleryPhotos.map((photo, idx) => {
              const sizes = {
                sm: 'w-20 h-20 sm:w-28 sm:h-28 md:w-32 md:h-32',
                md: 'w-24 h-24 sm:w-32 sm:h-32 md:w-40 md:h-40',
                lg: 'w-28 h-28 sm:w-40 sm:h-40 md:w-48 md:h-48',
              };

              return (
                <ScrollReveal key={photo.id} direction="zoom" delay={idx * 100} duration={600}>
                  <div
                    onClick={() => setSelectedPhoto(photo)}
                    className={`group relative rounded-full overflow-hidden cursor-pointer shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-110 border-4 border-white hover:border-[#0000FF] hover:shadow-blue-500/40 animate-float ${sizes[photo.size]}`}
                    style={{ animationDelay: `${idx * 0.3}s` }}
                  >
                    <Image
                      src={photo.imagePath}
                      alt={photo.title}
                      fill
                      sizes="(max-width: 640px) 112px, (max-width: 768px) 160px, 192px"
                      className="object-cover transition-transform duration-500 group-hover:scale-115"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 flex flex-col items-center justify-center p-2 text-center">
                      <span className="text-white text-[10px] sm:text-xs font-extrabold line-clamp-2 px-1">
                        {photo.title}
                      </span>
                      <span className="mt-1 text-[9px] sm:text-[10px] text-blue-300 font-semibold bg-black/50 px-2 py-0.5 rounded-full backdrop-blur-xs">
                        Lihat Foto
                      </span>
                    </div>
                  </div>
                </ScrollReveal>
              );
            })}
          </div>
        </div>

        {/* Modal Lightbox */}
        <Modal
          isOpen={selectedPhoto !== null}
          onClose={() => setSelectedPhoto(null)}
          title={selectedPhoto?.title || 'Foto Galeri'}
        >
          {selectedPhoto && (
            <div className="flex flex-col items-center justify-center p-2 sm:p-4">
              <div className="relative w-full max-w-lg h-64 sm:h-80 md:h-[340px] mb-4 rounded-2xl overflow-hidden shadow-2xl border border-gray-200/50 bg-slate-950">
                <Image
                  src={selectedPhoto.imagePath}
                  alt={selectedPhoto.title}
                  fill
                  sizes="(max-width: 768px) 100vw, 512px"
                  className="object-cover"
                />
              </div>
              <h4 className="font-extrabold text-gray-900 dark:text-white text-center text-lg sm:text-xl tracking-tight">
                {selectedPhoto.title}
              </h4>
              <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 text-center mt-2 max-w-md leading-relaxed">
                {selectedPhoto.description || 'DsterGame Gaming Lounge & Community Space'}
              </p>
            </div>
          )}
        </Modal>
      </Container>
    </section>
  );
};
