import { landingService } from '@/services/landing.service';
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

import { CatalogDevice } from '@/data/gameCatalog';
import { formatEventTimeRange } from '@/utils/eventUtils';

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

function createDefaultState(): SiteDataState {
  return {
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
}

export async function getCanonicalLandingData(): Promise<SiteDataState> {
  const updated = createDefaultState();

  const fullData = await landingService.getFullLandingData();

  if (!fullData) {
    throw new Error('Failed to fetch canonical landing page data from database.');
  }

  // 0. Sections Meta
  if (Array.isArray(fullData.cmsSections) && fullData.cmsSections.length > 0) {
    fullData.cmsSections.forEach((sec) => {
      if (updated.sections[sec.sectionKey]) {
        updated.sections[sec.sectionKey] = {
          id: sec.sectionKey,
          title: sec.title,
          subtitle: sec.subtitle || updated.sections[sec.sectionKey].subtitle,
        };
      }
    });
  }

  // 1. Testimonials
  if (Array.isArray(fullData.testimonials) && fullData.testimonials.length > 0) {
    updated.testimonials = fullData.testimonials.map((t) => ({
      id: t.id,
      nickname: t.reviewerName,
      username: t.reviewerRole || `@${t.reviewerName.toLowerCase().replace(/\s+/g, '')}`,
      comment: t.content,
      rating: t.rating || 5,
    }));
  }

  // 2. FAQs (Stable IDs f1, f2, etc. to prevent accordion reset)
  if (Array.isArray(fullData.faqs) && fullData.faqs.length > 0) {
    updated.faqs = fullData.faqs.map((f, idx) => ({
      id: `f${idx + 1}`,
      question: f.question,
      answer: f.answer,
    }));
  }

  // 3. Branches / Locations (Exact Cabang 1, Cabang 2, & Cabang 3 coordinates)
  if (Array.isArray(fullData.branches) && fullData.branches.length > 0) {
    updated.branchLocations = fullData.branches.map((b, idx) => {
      const isCabang3 = b.name.toLowerCase().includes('3') || b.address.toLowerCase().includes('salatiga');
      const isCabang2 = b.name.toLowerCase().includes('2') || b.address.toLowerCase().includes('gedongsongo');

      const lat = b.latitude ?? (isCabang3 ? -7.333627554257242 : isCabang2 ? -7.152918474450402 : -7.133860);
      const lng = b.longitude ?? (isCabang3 ? 110.50335111835415 : isCabang2 ? 110.40754126034807 : 110.398851);
      const mapUrl = b.mapUrl || (isCabang3 ? 'https://maps.app.goo.gl/UPX9YgbXidywG87F7' : isCabang2 ? 'https://maps.app.goo.gl/ohiPUyJ9myd9eQEU9' : 'https://maps.app.goo.gl/ygUFrbeKupStPAEm7');
      const embedUrl = `https://maps.google.com/maps?q=${lat},${lng}&z=17&output=embed`;

      return {
        id: b.id || (isCabang3 ? 'b3' : isCabang2 ? 'b2' : `b${idx + 1}`),
        name: b.name.replace(/\s*\(Salatiga\)/gi, '').trim(),
        address: b.address,
        lat,
        lng,
        phone: b.phone || updated.contactInfo.phone,
        mapUrl,
        embedUrl,
      };
    });
  }

  // 4. Events (Auto-Featured calculation based on event dates)
  if (Array.isArray(fullData.events) && fullData.events.length > 0) {
    const nowMs = Date.now();
    const oneDayMs = 24 * 60 * 60 * 1000;

    updated.events = fullData.events.map((e) => {
      const startDateStr = e.startDate ? new Date(e.startDate).toISOString() : undefined;
      const endDateStr = e.endDate ? new Date(e.endDate).toISOString() : undefined;
      const timeDateFormatted = formatEventTimeRange(e.startDate, e.endDate, e.eventDate);

      // Auto-featured logic: If event hasn't passed its end date (or eventDate), it's featured
      const targetDate = e.endDate ? new Date(e.endDate) : e.startDate ? new Date(e.startDate) : e.eventDate ? new Date(e.eventDate) : null;
      const isAutoFeatured = targetDate ? (targetDate.getTime() + oneDayMs) >= nowMs : true;

      return {
        id: e.id,
        title: e.title,
        subTitle: e.subtitle || 'Event Community',
        description: e.description || '',
        posterImage: e.posterMedia?.url || '/Other/Event-Poster.jpg',
        timeDate: timeDateFormatted,
        startDate: startDateStr,
        endDate: endDateStr,
        buttonText: 'Detail Event',
        linkUrl: e.linkUrl || '#',
        isNew: isAutoFeatured,
      };
    });
  }

  // 5. Gallery Photos
  if (Array.isArray(fullData.galleryPhotos) && fullData.galleryPhotos.length > 0) {
    const letters = ['G', 'A', 'L', 'L', 'E', 'R', 'Y', 'S'];
    const sizes: Array<'sm' | 'md' | 'lg'> = ['lg', 'md', 'sm', 'md', 'lg', 'sm', 'lg', 'md'];
    updated.galleryPhotos = fullData.galleryPhotos.map((g, idx) => ({
      id: g.id,
      letter: letters[idx % letters.length],
      imagePath: g.media?.url || 'https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=1200&auto=format&fit=crop',
      title: g.media?.altText || g.caption?.split('-')[0]?.trim() || `Gallery Item ${idx + 1}`,
      size: sizes[idx % sizes.length],
      description: g.caption || 'Foto fasilitas dan suasana gaming lounge DsterGame Studio',
    }));
  }

  // 6. Pricing Catalog
  if (Array.isArray(fullData.pricingCatalog) && fullData.pricingCatalog.length > 0) {
    updated.pricingTabs = fullData.pricingCatalog.map((cat) => {
      const itemMap = new Map<string, { id: string; vipName: string; rates: Array<{ duration: string; price: string }>; features?: string[] }>();

      (cat.items || []).forEach((item) => {
        const isExtra = item.name.toLowerCase().includes('extra');
        const formattedPrice = isExtra ? 'Rp 5.000 - Rp 15.000' : `Rp ${Number(item.price).toLocaleString('id-ID')}`;
        const baseName = item.name.replace(/\s*\(\d+\s*jam\)/i, '').trim();
        const durationStr = isExtra ? 'Per Jam' : (item.duration || '1 Jam');
        const featuresArr = item.features ? item.features.split(',').map((f) => f.trim()) : ['TV LED 4K', 'Kursi Sofa', 'Controller Original'];

        if (!itemMap.has(baseName)) {
          itemMap.set(baseName, {
            id: item.id,
            vipName: baseName,
            rates: [{ duration: durationStr, price: formattedPrice }],
            features: featuresArr,
          });
        } else {
          const existing = itemMap.get(baseName)!;
          if (!existing.rates.some((r) => r.duration === durationStr)) {
            existing.rates.push({ duration: durationStr, price: formattedPrice });
          }
        }
      });

      // Merge fallback multi-rates from initial state if missing
      const defaultTab = mockPricingTabs.find((t: { id: string }) => t.id === (cat.slug || cat.id));
      if (defaultTab) {
        defaultTab.columns.flatMap((c: { items: any[] }) => c.items).forEach((defaultItem: any) => {
          if (!itemMap.has(defaultItem.vipName)) {
            itemMap.set(defaultItem.vipName, defaultItem as any);
          } else {
            const existing = itemMap.get(defaultItem.vipName)!;
            if (defaultItem.rates && defaultItem.rates.length > 1) {
              existing.rates = defaultItem.rates;
            }
          }
        });
      }

      return {
        id: cat.slug || cat.id,
        label: cat.name,
        subtitle: cat.slug === 'sewa-console'
          ? 'Paket sewa konsol game bawa pulang (Home Rental)'
          : cat.slug === 'playbox'
          ? 'Paket Playbox Portable dengan Layar Monitor IPS 180Hz High Performance'
          : cat.slug === 'sewa-tv'
          ? 'Paket sewa Smart TV & Display monitor bawa pulang'
          : 'Pilih paket rental konsol paling pas sesuai durasi & fasilitas favoritmu.',
        terms: cat.slug === 'sewa-console'
          ? 'Layanan antar / jemput bisa di sharelock terlebih dahulu, jaminan 2 identitas = KTP / SIM / Kartu Pelajar / STNK Hidup'
          : cat.slug === 'sewa-tv'
          ? 'Wajib follow Instagram @sewa_Playstation_ungaran'
          : undefined,
        columns: [
          {
            title: '',
            items: Array.from(itemMap.values()),
          },
        ],
      };
    });
  }

  // 7. System Settings
  if (Array.isArray(fullData.systemSettings) && fullData.systemSettings.length > 0) {
    const settingMap: Record<string, string> = {};
    fullData.systemSettings.forEach((s) => {
      settingMap[s.key] = s.value;
    });

    let parsedSocialLinks;
    if (settingMap.footer_social_links) {
      try {
        parsedSocialLinks = JSON.parse(settingMap.footer_social_links);
      } catch {
        // Fallback
      }
    }

    updated.contactInfo = {
      phone: settingMap.contact_phone || updated.contactInfo.phone,
      whatsapp: settingMap.contact_whatsapp || updated.contactInfo.whatsapp,
      instagram: settingMap.contact_instagram || updated.contactInfo.instagram,
      email: settingMap.contact_email || updated.contactInfo.email,
      address: settingMap.contact_address || updated.contactInfo.address,
      footerText: settingMap.footer_text || updated.contactInfo.footerText,
      footerSocialLinks: Array.isArray(parsedSocialLinks) ? parsedSocialLinks : undefined,
    };

    // Hero Section Dynamic Mapping
    let heroDecorations = updated.hero.decorations;
    if (settingMap.hero_decorations) {
      try {
        heroDecorations = JSON.parse(settingMap.hero_decorations);
      } catch {
        // keep default
      }
    }

    let heroCovers = updated.hero.gameCovers;
    if (settingMap.hero_game_covers) {
      try {
        heroCovers = JSON.parse(settingMap.hero_game_covers);
      } catch {
        // keep default
      }
    }

    if (fullData.hero || settingMap.contact_instagram || settingMap.hero_logo) {
      updated.hero = {
        ...updated.hero,
        logo: settingMap.hero_logo || fullData.hero?.logoMedia?.url || updated.hero.logo,
        instagram: settingMap.contact_instagram || settingMap.hero_instagram || updated.hero.instagram,
        ctaText: fullData.hero?.ctaText || updated.hero.ctaText,
        ctaLink: fullData.hero?.ctaLink || updated.hero.ctaLink,
        decorations: heroDecorations,
        gameCovers: heroCovers,
      };
    }
  }

  // 8. Hardware & Game Catalog (Real Database Sync)
  if (Array.isArray(fullData.gameCatalog) && fullData.gameCatalog.length > 0) {
    const dbDevices: CatalogDevice[] = [];
    fullData.gameCatalog.forEach((cat) => {
      const categorySlug = (cat.slug || '').toLowerCase();
      const listGameCategory: 'playstation' | 'nintendo' | 'logitech' =
        categorySlug.includes('nintendo') ? 'nintendo' : categorySlug.includes('logitech') ? 'logitech' : 'playstation';

      (cat.hardwares || []).forEach((hw) => {
        dbDevices.push({
          id: hw.slug || hw.id,
          name: hw.name,
          listGameCategory,
          branch: hw.description?.split('-')[0]?.trim(),
          games: (hw.games || []).map((g) => g.title),
        });
      });
    });

    if (dbDevices.length > 0) {
      updated.catalogDevices = dbDevices;
    }
  }

  return updated;
}
