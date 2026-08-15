'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  mockHero,
  mockListGameList,
  mockPricingTabs,
  mockEvents,
  mockGalleryPhotos,
  mockBranchLocations,
  mockTestimonials,
  mockFaqs,
  NavItem,
  ListGameItem,
  PricingTab,
  EventItem,
  GalleryPhoto,
  BranchLocation,
  TestimonialItem,
  FaqMockItem,
} from '@/data/mock-landing';
import { parseGoogleMapsInput } from '@/utils/mapsParser';
import { CatalogDevice } from '@/data/gameCatalog';

export interface SectionMeta {
  id: string;
  title: string;
  subtitle: string;
}

export interface ContactInfo {
  phone: string;
  whatsapp: string;
  instagram: string;
  email: string;
  address: string;
  footerText: string;
  footerSocialLinks?: Array<{ id: string; platform: string; url: string; icon: string }>;
}

export interface HeroData {
  logo: string;
  instagram: string;
  ctaText: string;
  ctaLink: string;
  decorations: {
    vr: string;
    gamepad: string;
    wheel: string;
    stick: string;
    star: string;
  };
  gameCovers: Array<{ id: string; title: string; image: string }>;
}

export interface SiteDataState {
  sections: Record<string, SectionMeta>;
  hero: HeroData;
  listGames: ListGameItem[];
  pricingTabs: PricingTab[];
  events: EventItem[];
  galleryPhotos: GalleryPhoto[];
  branchLocations: BranchLocation[];
  testimonials: TestimonialItem[];
  faqs: FaqMockItem[];
  contactInfo: ContactInfo;
  navbar: NavItem[];
  catalogDevices?: CatalogDevice[];
}

const DEFAULT_SECTIONS: Record<string, SectionMeta> = {
  hero: { id: 'hero', title: 'DsterGame Studio', subtitle: 'Console & Racing Simulator Lounge | Rental Tempat & Sewa Bawa Pulang' },
  'list-game': { id: 'list-game', title: 'Katalog Game', subtitle: 'Koleksi game original terlengkap untuk berbagai platform konsol & simulator balap.' },
  pricing: { id: 'pricing', title: 'Daftar Harga & Paket', subtitle: 'Pilih paket rental konsol paling pas sesuai durasi & fasilitas favoritmu.' },
  event: { id: 'event', title: 'Event & Turnamen', subtitle: 'Ikuti turnamen esports seru, match night komunitas, dan dapatkan total prize pool menarik.' },
  gallery: { id: 'gallery', title: 'Galeri Suasana', subtitle: 'Atmosphere gaming lounge eksklusif yang nyaman, bersih, ber-AC dengan layar Smart TV 4K terbaru.' },
  location: { id: 'location', title: 'Lokasi Cabang', subtitle: 'Temukan cabang utama DsterGame Studio atau titik terdekat untuk bermain bersama komunitas.' },
  testimonials: { id: 'testimonials', title: 'Apa Kata Customer', subtitle: 'Testimoni jujur dan pengalaman mengesankan dari para gamer & pelanggan setia DsterGame Studio.' },
  faq: { id: 'faq', title: 'FAQ', subtitle: 'Jawaban lengkap atas pertanyaan yang sering diajukan seputar layanan dan fasilitas.' },
  feedback: { id: 'feedback', title: 'Feedback', subtitle: 'Kritik, saran, dan pengalaman bermain Anda sangat berharga untuk peningkatan pelayanan kami.' },
  contact: { id: 'contact', title: 'Contact Us', subtitle: 'Hubungi tim admin kami melalui WhatsApp untuk reservasi tempat, informasi sewa, atau turnamen.' },
};

const DEFAULT_CONTACT: ContactInfo = {
  phone: '081234567890',
  whatsapp: '6281234567890',
  instagram: '@dster.game',
  email: 'admin@dstergame.com',
  address: 'Jl. Gedongsongo No. 17, Ungaran Barat, Kab. Semarang',
  footerText: '© 2026 DsterGame Studio. All Rights Reserved.',
};

const DEFAULT_NAVBAR: NavItem[] = [
  { id: '1', label: 'Home', href: '/' },
  { id: '2', label: 'List Game', href: '/list-game' },
  { id: '3', label: 'Pricing', href: '/pricing' },
  { id: '4', label: 'Events', href: '/event' },
  { id: '5', label: 'Gallery', href: '/gallery' },
  { id: '6', label: 'Location', href: '/location' },
  { id: '7', label: 'Testimoni', href: '/testimonials' },
  { id: '8', label: 'FAQ', href: '/faq' },
  { id: '9', label: 'Contact', href: '/contact' },
];

export const INITIAL_STATE: SiteDataState = {
  sections: DEFAULT_SECTIONS,
  hero: mockHero,
  listGames: mockListGameList,
  pricingTabs: mockPricingTabs,
  events: mockEvents,
  galleryPhotos: mockGalleryPhotos,
  branchLocations: mockBranchLocations,
  testimonials: mockTestimonials,
  faqs: mockFaqs,
  contactInfo: DEFAULT_CONTACT,
  navbar: DEFAULT_NAVBAR,
};

interface SiteContextType {
  siteData: SiteDataState;
  updateSection: (sectionKey: string, title: string, subtitle: string) => void;
  updateHero: (newHero: Partial<HeroData>) => void;
  updateBranchLocation: (id: string, branch: Partial<BranchLocation>) => void;
  addBranchLocationFromUrl: (inputUrl: string, name?: string, phone?: string) => void;
  updateContactInfo: (newContact: Partial<ContactInfo>) => void;
  updateListGames: (newListGames: ListGameItem[]) => void;
  updatePricingTabs: (newPricing: PricingTab[]) => void;
  updateEvents: (newEvents: EventItem[]) => void;
  updateGalleryPhotos: (newPhotos: GalleryPhoto[]) => void;
  updateTestimonials: (newTestimonials: TestimonialItem[]) => void;
  updateFaqs: (newFaqs: FaqMockItem[]) => void;
  updateNavbar: (newNav: NavItem[]) => void;
  resetToDefaults: () => void;
}

const SiteContext = createContext<SiteContextType | undefined>(undefined);

const LOCAL_STORAGE_KEY = 'dstergame_site_data_v2';

export const SiteDataProvider: React.FC<{ children: React.ReactNode; initialData?: SiteDataState }> = ({ children, initialData }) => {
  const [siteData, setSiteData] = useState<SiteDataState>(initialData || INITIAL_STATE);

  useEffect(() => {
    if (initialData) {
      setSiteData(initialData);
    }
  }, [initialData]);

  const saveState = (newState: SiteDataState) => {
    setSiteData(newState);
  };

  const updateSection = (sectionKey: string, title: string, subtitle: string) => {
    saveState({
      ...siteData,
      sections: {
        ...siteData.sections,
        [sectionKey]: { id: sectionKey, title, subtitle },
      },
    });
  };

  const updateHero = (newHero: Partial<HeroData>) => {
    saveState({
      ...siteData,
      hero: { ...siteData.hero, ...newHero },
    });
  };

  const updateBranchLocation = (id: string, branch: Partial<BranchLocation>) => {
    const updated = siteData.branchLocations.map((loc) =>
      loc.id === id ? { ...loc, ...branch } : loc
    );
    saveState({ ...siteData, branchLocations: updated });
  };

  const addBranchLocationFromUrl = (inputUrl: string, name?: string, phone?: string) => {
    const parsed = parseGoogleMapsInput(inputUrl);
    const newBranch: BranchLocation = {
      id: `b-${Date.now()}`,
      name: name || parsed.nameHint || `DsterGame Cabang Baru`,
      address: parsed.addressHint || 'Jl. Lokasi Baru',
      lat: parsed.lat || -7.140263,
      lng: parsed.lng || 110.407612,
      phone: phone || siteData.contactInfo.phone,
      mapUrl: parsed.mapUrl,
      embedUrl: parsed.embedUrl,
    };

    saveState({
      ...siteData,
      branchLocations: [...siteData.branchLocations, newBranch],
    });
  };

  const updateContactInfo = (newContact: Partial<ContactInfo>) => {
    saveState({
      ...siteData,
      contactInfo: { ...siteData.contactInfo, ...newContact },
    });
  };

  const updateListGames = (newListGames: ListGameItem[]) => {
    saveState({ ...siteData, listGames: newListGames });
  };

  const updatePricingTabs = (newPricing: PricingTab[]) => {
    saveState({ ...siteData, pricingTabs: newPricing });
  };

  const updateEvents = (newEvents: EventItem[]) => {
    saveState({ ...siteData, events: newEvents });
  };

  const updateGalleryPhotos = (newPhotos: GalleryPhoto[]) => {
    saveState({ ...siteData, galleryPhotos: newPhotos });
  };

  const updateTestimonials = (newTestimonials: TestimonialItem[]) => {
    saveState({ ...siteData, testimonials: newTestimonials });
  };

  const updateFaqs = (newFaqs: FaqMockItem[]) => {
    saveState({ ...siteData, faqs: newFaqs });
  };

  const updateNavbar = (newNav: NavItem[]) => {
    saveState({ ...siteData, navbar: newNav });
  };

  const resetToDefaults = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(LOCAL_STORAGE_KEY);
    }
    setSiteData(INITIAL_STATE);
  };

  return (
    <SiteContext.Provider
      value={{
        siteData,
        updateSection,
        updateHero,
        updateBranchLocation,
        addBranchLocationFromUrl,
        updateContactInfo,
        updateListGames,
        updatePricingTabs,
        updateEvents,
        updateGalleryPhotos,
        updateTestimonials,
        updateFaqs,
        updateNavbar,
        resetToDefaults,
      }}
    >
      {children}
    </SiteContext.Provider>
  );
};

export const useSiteData = () => {
  const context = useContext(SiteContext);
  if (!context) {
    throw new Error('useSiteData must be used within a SiteDataProvider');
  }
  return context;
};
