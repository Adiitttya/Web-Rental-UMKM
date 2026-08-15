'use client';

import React, { useState, useMemo } from 'react';
import { useSiteData } from '@/context/SiteContext';
import { ListGameItem } from '@/data/mock-landing';
import { gameCatalogData, CatalogDevice } from '@/data/gameCatalog';
import { Container } from '../../layout/Container';
import { Heading, Paragraph } from '../../typography/Typography';
import { Modal } from '../../overlay/Modal';
import { ListGameCard } from '../cards/ListGameCard';
import { sanitizeSearchQuery } from '@/utils/sanitize';
import { ScrollReveal } from '../../animation/ScrollReveal';

type ListGameCategory = 'playstation' | 'nintendo' | 'logitech';

export const ListGameSection: React.FC = () => {
  const { siteData } = useSiteData();
  const listGameList = siteData.listGames;
  const sectionMeta = siteData.sections['list-game'] || {
    title: 'List Game',
    subtitle: 'Pilih kategori game rental favoritmu untuk menjelajahi koleksi game lengkap yang tersedia di DsterGame Studio.',
  };

  const [selectedCategoryItem, setSelectedCategoryItem] = useState<ListGameItem | null>(null);
  const [activeCategory, setActiveCategory] = useState<ListGameCategory | null>(null);
  const [activeFamilyFilter, setActiveFamilyFilter] = useState<'ALL' | 'PS5' | 'PS4' | 'PS3'>('ALL');
  const [activeDeviceId, setActiveDeviceId] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const catalogDevices = useMemo<CatalogDevice[]>(() => {
    if (siteData.catalogDevices && siteData.catalogDevices.length > 0) {
      return siteData.catalogDevices;
    }
    return gameCatalogData;
  }, [siteData.catalogDevices]);

  const getDevicesForCategory = (cat: ListGameCategory): CatalogDevice[] => {
    return catalogDevices.filter((d: CatalogDevice) => d.listGameCategory === cat);
  };

  // Open modal for a specific list game category card
  const handleOpenListGameModal = (item: ListGameItem) => {
    let cat: ListGameCategory = 'playstation';
    if (item.id === 'nintendo' || item.name.toLowerCase().includes('nintendo')) {
      cat = 'nintendo';
    } else if (item.id === 'logitech' || item.name.toLowerCase().includes('logitech')) {
      cat = 'logitech';
    }

    setSelectedCategoryItem(item);
    setActiveCategory(cat);
    setActiveFamilyFilter('ALL');
    setSearchQuery('');

    const availableDevices = getDevicesForCategory(cat);
    if (availableDevices.length > 0) {
      setActiveDeviceId(availableDevices[0].id);
    }
  };

  // Get available devices for the active category (pre-sorted by generation & game count)
  const categoryDevices = useMemo<CatalogDevice[]>(() => {
    if (!activeCategory) return [];
    return getDevicesForCategory(activeCategory);
  }, [activeCategory, catalogDevices]);

  // Filter PlayStation devices by family filter (PS5 / PS4 / PS3) if applicable
  const filteredDevices = useMemo<CatalogDevice[]>(() => {
    if (activeCategory !== 'playstation' || activeFamilyFilter === 'ALL') {
      return categoryDevices;
    }
    return categoryDevices.filter((dev: CatalogDevice) => {
      const name = dev.name.toUpperCase();
      if (activeFamilyFilter === 'PS5') return name.includes('PS5');
      if (activeFamilyFilter === 'PS4') return name.includes('PS4') || name.includes('PS PRO');
      if (activeFamilyFilter === 'PS3') return name.includes('PS3');
      return true;
    });
  }, [categoryDevices, activeCategory, activeFamilyFilter]);

  // Ensure activeDeviceId is valid
  const currentDevice = useMemo<CatalogDevice | undefined>(() => {
    const found = filteredDevices.find((d: CatalogDevice) => d.id === activeDeviceId);
    return found || filteredDevices[0] || categoryDevices[0];
  }, [filteredDevices, activeDeviceId, categoryDevices]);

  // Filter games inside active device by search query
  const filteredGames = useMemo<string[]>(() => {
    if (!currentDevice) return [];
    if (!searchQuery.trim()) return currentDevice.games;
    const q = searchQuery.toLowerCase();
    return currentDevice.games.filter((gameTitle: string) => gameTitle.toLowerCase().includes(q));
  }, [currentDevice, searchQuery]);

  // Brand accent colors for active tabs
  const getBrandAccentClass = (cat: ListGameCategory | null) => {
    if (cat === 'nintendo') return 'bg-[#E71B24] text-white shadow-md font-bold';
    if (cat === 'logitech') return 'bg-[var(--dark)] text-[#E0FE0A] border border-black shadow-md font-bold';
    return 'bg-[var(--primary)] text-white shadow-md font-bold';
  };

  return (
    <section id="list-game" className="py-20 sm:py-24 bg-[var(--background)] text-[var(--dark)]">
      <Container size="lg">
        {/* Section Header */}
        <ScrollReveal direction="up" duration={600}>
          <div className="text-center max-w-2xl mx-auto mb-14 sm:mb-16">
            <Heading level={2} className="text-3xl sm:text-4xl font-extrabold text-[var(--dark)] mb-4">
              {sectionMeta.title}
            </Heading>
            <Paragraph className="text-sm text-gray-600 max-w-xl mx-auto font-medium leading-relaxed">
              {sectionMeta.subtitle}
            </Paragraph>
          </div>
        </ScrollReveal>

        {/* List Game Card Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 justify-items-center max-w-4xl mx-auto">
          {listGameList.map((item, idx) => (
            <ScrollReveal key={item.id} direction="up" delay={idx * 150} duration={650} className="w-full flex justify-center">
              <ListGameCard
                name={item.name}
                bgColor={item.bgColor}
                textColor={item.textColor}
                logoImage={item.logoImage || item.logo}
                secondaryImage={item.secondaryImage}
                buttonLabel="Detail"
                onClick={() => handleOpenListGameModal(item)}
              />
            </ScrollReveal>
          ))}
        </div>

        {/* Dynamic Modal List Game */}
        <Modal
          isOpen={selectedCategoryItem !== null}
          onClose={() => setSelectedCategoryItem(null)}
          size="xl"
          title={selectedCategoryItem ? `Katalog Game ${selectedCategoryItem.name}` : ''}
        >
          {selectedCategoryItem && currentDevice && (
            <div className="flex flex-col h-full space-y-4">
              {/* PlayStation Console Family Filter Tabs */}
              {activeCategory === 'playstation' && (
                <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar shrink-0">
                  {(['ALL', 'PS5', 'PS4', 'PS3'] as const).map((family) => (
                    <button
                      key={family}
                      onClick={() => {
                        setActiveFamilyFilter(family);
                        const newFiltered = categoryDevices.filter((dev: CatalogDevice) => {
                          const n = dev.name.toUpperCase();
                          if (family === 'PS5') return n.includes('PS5');
                          if (family === 'PS4') return n.includes('PS4') || n.includes('PS PRO');
                          if (family === 'PS3') return n.includes('PS3');
                          return true;
                        });
                        if (newFiltered.length > 0) {
                          setActiveDeviceId(newFiltered[0].id);
                        }
                      }}
                      className={`text-xs px-3.5 py-1.5 rounded-lg font-bold transition-all shrink-0 cursor-pointer ${
                        activeFamilyFilter === family
                          ? 'bg-[var(--primary)] text-white shadow-sm'
                          : 'bg-white text-[var(--dark)] hover:text-[var(--dark)] hover:bg-gray-100 border border-gray-200'
                      }`}
                    >
                      {family === 'ALL' ? 'Semua PlayStation' : family === 'PS4' ? 'PS4 & PS4 Pro' : family}
                    </button>
                  ))}
                </div>
              )}

              {/* Console Device Type Tabs */}
              <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-gray-200 no-scrollbar shrink-0">
                {filteredDevices.map((dev: CatalogDevice) => {
                  const isActive = dev.id === currentDevice.id;
                  return (
                    <button
                      key={dev.id}
                      onClick={() => setActiveDeviceId(dev.id)}
                      className={`text-xs sm:text-sm px-4 py-2 rounded-xl font-bold transition-all shrink-0 cursor-pointer flex items-center gap-2 ${
                        isActive
                          ? getBrandAccentClass(activeCategory)
                          : 'bg-white text-[var(--dark)] hover:bg-gray-100 border border-gray-200'
                      }`}
                    >
                      <span>{dev.name}</span>
                      <span
                        className={`text-[10px] px-1.5 py-0.5 rounded-md font-semibold ${
                          isActive ? 'bg-black/15 text-current' : 'bg-gray-100 text-gray-600 border border-gray-200'
                        }`}
                      >
                        {dev.games.length}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Search Bar */}
              <div className="flex items-center gap-2 bg-white p-2.5 rounded-xl border border-gray-200 shadow-xs shrink-0 px-3">
                <svg className="w-4 h-4 text-gray-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(sanitizeSearchQuery(e.target.value, 100))}
                  maxLength={100}
                  placeholder={`Cari game di ${currentDevice.name}...`}
                  className="bg-transparent border-none text-[var(--dark)] text-xs sm:text-sm placeholder-gray-400 focus:outline-none w-full font-medium"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="text-xs text-gray-400 hover:text-gray-700 p-1 shrink-0 cursor-pointer"
                    aria-label="Clear search"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                )}
              </div>

              {/* Game List Grid */}
              <div className="flex-1 overflow-y-auto no-scrollbar pr-1 min-h-0">
                {filteredGames.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5 auto-rows-max">
                    {filteredGames.map((gameTitle: string, idx: number) => (
                      <div
                        key={`${currentDevice.id}-${idx}`}
                        className="p-3.5 rounded-xl border border-gray-200 bg-white hover:border-blue-400 hover:bg-blue-50/40 transition-all duration-150 shadow-xs flex items-center"
                      >
                        <h4 className="font-bold text-xs sm:text-sm text-[var(--dark)] leading-snug break-words">
                          {gameTitle}
                        </h4>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="h-full flex flex-col items-center justify-center text-center p-8 bg-white/50 rounded-2xl border border-dashed border-gray-300">
                    <p className="text-gray-500 text-sm font-medium">
                      Tidak ada game ditemukan untuk kata kunci <strong className="text-[var(--dark)]">&quot;{searchQuery}&quot;</strong>
                    </p>
                    <button
                      onClick={() => setSearchQuery('')}
                      className="mt-2 text-xs font-semibold text-[var(--primary)] hover:underline cursor-pointer"
                    >
                      Tampilkan semua game
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}
        </Modal>
      </Container>
    </section>
  );
};
