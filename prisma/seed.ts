import { PrismaClient, EventStatus, MediaFileType } from '@prisma/client';
import bcrypt from 'bcryptjs';
import fs from 'fs';
import path from 'path';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting comprehensive database seed for DsterGame Studio...');

  // 0. Default Admin User
  const adminPasswordHash = await bcrypt.hash('Dstergame@Ungaran123', 10);
  await prisma.user.upsert({
    where: { email: 'admin@dstergame.com' },
    update: {
      passwordHash: adminPasswordHash,
      role: 'ADMIN',
    },
    create: {
      name: 'Admin DsterGame',
      email: 'admin@dstergame.com',
      passwordHash: adminPasswordHash,
      role: 'ADMIN',
    },
  });

  // 1. Theme Settings
  await prisma.themeSetting.upsert({
    where: { id: 'default-theme' },
    update: {},
    create: {
      id: 'default-theme',
      primaryColor: '#0000FF',
      secondaryColor: '#3B82F6',
      backgroundColor: '#FAFAFA',
      darkColor: '#1D242B',
      fontFamily: 'Inter',
      borderRadius: '0.75rem',
      isActive: true,
    },
  });

  // 2. System Settings & Contact Info
  const defaultSettings = [
    { key: 'site_name', value: 'DsterGame Studio', group: 'general', description: 'Website Name' },
    { key: 'site_tagline', value: 'Console & Racing Simulator Lounge | Rental Tempat & Sewa Bawa Pulang', group: 'general', description: 'Tagline' },
    { key: 'contact_phone', value: '081234567890', group: 'contact', description: 'Phone Number' },
    { key: 'contact_whatsapp', value: '6281234567890', group: 'contact', description: 'Official WhatsApp' },
    { key: 'contact_instagram', value: '@dster.game', group: 'contact', description: 'Instagram handle' },
    { key: 'contact_email', value: 'admin@dstergame.com', group: 'contact', description: 'Official Email' },
    { key: 'contact_address', value: 'Jl. Gedongsongo No. 17, Ungaran Barat, Kab. Semarang', group: 'contact', description: 'Main Address' },
    { key: 'footer_text', value: '© 2026 DsterGame Studio. All Rights Reserved.', group: 'general', description: 'Footer Copyright' },
  ];

  for (const setting of defaultSettings) {
    await prisma.systemSetting.upsert({
      where: { key: setting.key },
      update: { value: setting.value },
      create: setting,
    });
  }

  // 3. CMS Sections
  const sections = [
    { sectionKey: 'hero', title: 'DsterGame Studio', subtitle: 'Console & Racing Simulator Lounge | Rental Tempat & Sewa Bawa Pulang', displayOrder: 1 },
    { sectionKey: 'list-game', title: 'Katalog Game', subtitle: 'Koleksi game original terlengkap untuk berbagai platform konsol & simulator balap.', displayOrder: 2 },
    { sectionKey: 'pricing', title: 'Daftar Harga & Paket', subtitle: 'Pilih paket rental konsol paling pas sesuai durasi & fasilitas favoritmu.', displayOrder: 3 },
    { sectionKey: 'event', title: 'Event & Turnamen', subtitle: 'Ikuti turnamen esports seru, match night komunitas, dan dapatkan total prize pool menarik.', displayOrder: 4 },
    { sectionKey: 'gallery', title: 'Galeri Suasana', subtitle: 'Atmosphere gaming lounge eksklusif yang nyaman, bersih, ber-AC dengan layar Smart TV 4K terbaru.', displayOrder: 5 },
    { sectionKey: 'location', title: 'Lokasi Cabang', subtitle: 'Temukan cabang utama DsterGame Studio atau titik terdekat untuk bermain bersama komunitas.', displayOrder: 6 },
    { sectionKey: 'testimonials', title: 'Apa Kata Customer', subtitle: 'Testimoni jujur dan pengalaman mengesankan dari para gamer & pelanggan setia DsterGame Studio.', displayOrder: 7 },
    { sectionKey: 'faq', title: 'FAQ', subtitle: 'Jawaban lengkap atas pertanyaan yang sering diajukan seputar layanan dan fasilitas.', displayOrder: 8 },
    { sectionKey: 'feedback', title: 'Feedback', subtitle: 'Kritik, saran, dan pengalaman bermain Anda sangat berharga untuk peningkatan pelayanan kami.', displayOrder: 9 },
    { sectionKey: 'contact', title: 'Contact Us', subtitle: 'Hubungi tim admin kami melalui WhatsApp untuk reservasi tempat, informasi sewa, atau turnamen.', displayOrder: 10 },
  ];

  for (const sec of sections) {
    await prisma.cmsSection.upsert({
      where: { sectionKey: sec.sectionKey },
      update: { title: sec.title, subtitle: sec.subtitle, displayOrder: sec.displayOrder },
      create: sec,
    });
  }

  // 4. Hero Section
  await prisma.hero.upsert({
    where: { id: 'main-hero' },
    update: {},
    create: {
      id: 'main-hero',
      title: 'DsterGame Studio',
      subtitle: 'Console & Racing Simulator Lounge | Rental Tempat & Sewa Bawa Pulang',
      ctaText: 'Explore',
      ctaLink: '#list-game',
      isPrimary: true,
    },
  });

  // 5. Hardware Catalog & Games
  const categoriesMap: Record<string, string> = {};

  const psCat = await prisma.hardwareCategory.upsert({
    where: { slug: 'playstation' },
    update: { name: 'PlayStation' },
    create: { name: 'PlayStation', slug: 'playstation', displayOrder: 1 },
  });
  categoriesMap['playstation'] = psCat.id;

  const nintendoCat = await prisma.hardwareCategory.upsert({
    where: { slug: 'nintendo' },
    update: { name: 'Nintendo Switch' },
    create: { name: 'Nintendo Switch', slug: 'nintendo', displayOrder: 2 },
  });
  categoriesMap['nintendo'] = nintendoCat.id;

  const logitechCat = await prisma.hardwareCategory.upsert({
    where: { slug: 'logitech' },
    update: { name: 'Logitech Wheel' },
    create: { name: 'Logitech Wheel', slug: 'logitech', displayOrder: 3 },
  });
  categoriesMap['logitech'] = logitechCat.id;

  // Clean old hardware/game entries before re-seeding full catalog
  await prisma.game.deleteMany({});
  await prisma.hardware.deleteMany({});

  const parsedDataPath = path.join(__dirname, '../scratch/parsed_games_data.json');
  const parsedData = JSON.parse(fs.readFileSync(parsedDataPath, 'utf8'));

  console.log(`📦 Seeding ${parsedData.length} hardwares and their game catalogs into PostgreSQL database...`);

  for (const hw of parsedData) {
    const categoryId = categoriesMap[hw.categorySlug] || psCat.id;
    await prisma.hardware.create({
      data: {
        id: hw.id,
        name: hw.name,
        slug: hw.slug,
        description: `${hw.branch} - ${hw.name}`,
        categoryId: categoryId,
        isAvailable: hw.isAvailable,
        displayOrder: hw.displayOrder,
        games: {
          create: hw.games.map((g: { title: string; slug: string; genre: string; isPopular: boolean; displayOrder: number }) => ({
            title: g.title,
            slug: g.slug,
            genre: g.genre,
            isPopular: g.isPopular,
            displayOrder: g.displayOrder,
          })),
        },
      },
    });
  }

  console.log(`✅ Successfully seeded 55 hardwares and 1,265 games into PostgreSQL DB!`);

  // 6. Pricing Categories & Items
  await prisma.pricingCategory.deleteMany({
    where: { slug: { notIn: ['main', 'playbox', 'sewa-console', 'sewa-tv'] } },
  });

  const catOnsite = await prisma.pricingCategory.upsert({
    where: { slug: 'main' },
    update: {},
    create: { name: 'Pricelist On-Site', slug: 'main', displayOrder: 1 },
  });

  const catPlaybox = await prisma.pricingCategory.upsert({
    where: { slug: 'playbox' },
    update: {},
    create: { name: 'Playbox Portable', slug: 'playbox', displayOrder: 2 },
  });

  const catConsole = await prisma.pricingCategory.upsert({
    where: { slug: 'sewa-console' },
    update: {},
    create: { name: 'Sewa Konsol', slug: 'sewa-console', displayOrder: 3 },
  });

  const catTv = await prisma.pricingCategory.upsert({
    where: { slug: 'sewa-tv' },
    update: {},
    create: { name: 'Sewa Televisi', slug: 'sewa-tv', displayOrder: 4 },
  });

  await prisma.pricingItem.deleteMany({ where: {} });

  const pricingItems = [
    { categoryId: catOnsite.id, name: 'Nintendo Switch', price: 14000, duration: '1 Jam', features: 'TV LED 4K 50 Inci, Kursi Sofa Ergonomis, 2 Controller Original', displayOrder: 1 },
    { categoryId: catOnsite.id, name: 'PlayStation 5', price: 14000, duration: '1 Jam', features: 'TV OLED 4K 50 Inci, Kursi Sofa Ergonomis, 2 Stik DualSense Original', displayOrder: 2 },
    { categoryId: catOnsite.id, name: 'PlayStation 4 Pro', price: 12000, duration: '1 Jam', features: 'TV LED 4K 43 Inci, Kursi Sofa Ergonomis, 2 Stik DualShock Original', displayOrder: 3 },
    { categoryId: catOnsite.id, name: 'PlayStation 4', price: 9000, duration: '1 Jam', features: 'TV LED 43 Inci, 2 Stik DualShock Original', displayOrder: 4 },
    { categoryId: catOnsite.id, name: 'PlayStation 3', price: 6000, duration: '1 Jam', features: 'TV LED 43 Inci, 2 Stik Controller Original', displayOrder: 5 },
    { categoryId: catOnsite.id, name: 'Extra Controller', price: 5000, duration: 'Per Jam', features: 'Tambahan Stik DualShock / DualSense Wireless', displayOrder: 6 },
    { categoryId: catOnsite.id, name: 'Racing Simulator (Logitech Wheel) (1 Jam)', price: 25000, duration: '1 Jam', features: 'VIP Private AC Room (PS5), Nintendo Switch Access, Smart TV 55" OLED 4K + Netflix', displayOrder: 7 },
    { categoryId: catOnsite.id, name: 'Racing Simulator (Logitech Wheel) (2 Jam)', price: 45000, duration: '2 Jam', features: 'VIP Private AC Room (PS5), Nintendo Switch Access, Smart TV 55" OLED 4K + Netflix', displayOrder: 8 },
    { categoryId: catOnsite.id, name: 'Racing Simulator (Logitech Wheel) (3 Jam)', price: 60000, duration: '3 Jam', features: 'VIP Private AC Room (PS5), Nintendo Switch Access, Smart TV 55" OLED 4K + Netflix', displayOrder: 9 },

    { categoryId: catPlaybox.id, name: 'Playbox PS3 (12 Jam)', price: 70000, duration: '12 Jam', features: '2 Stik Controller Original Mesin, Console PlayStation 3, Koleksi Full Games Terlengkap, Layar Monitor IPS 27 Inci 180Hz', displayOrder: 1 },
    { categoryId: catPlaybox.id, name: 'Playbox PS3 (24 Jam)', price: 95000, duration: '24 Jam', features: '2 Stik Controller Original Mesin, Console PlayStation 3, Koleksi Full Games Terlengkap, Layar Monitor IPS 27 Inci 180Hz', displayOrder: 2 },
    { categoryId: catPlaybox.id, name: 'Playbox PS4 Pro (12 Jam)', price: 90000, duration: '12 Jam', features: '2 Stik DualShock Original, Console PlayStation 4 Pro, Koleksi Full Games Terlengkap, Layar Monitor IPS 27 Inci 180Hz', displayOrder: 3 },
    { categoryId: catPlaybox.id, name: 'Playbox PS4 Pro (24 Jam)', price: 150000, duration: '24 Jam', features: '2 Stik DualShock Original, Console PlayStation 4 Pro, Koleksi Full Games Terlengkap, Layar Monitor IPS 27 Inci 180Hz', displayOrder: 4 },

    { categoryId: catConsole.id, name: 'Nintendo Switch (12 Jam)', price: 100000, duration: '12 Jam', features: 'Home Rental Bawa Pulang, Jaminan 2 Identitas Resmi, Layanan Antar/Jemput Lokasi', displayOrder: 1 },
    { categoryId: catConsole.id, name: 'Nintendo Switch (24 Jam)', price: 180000, duration: '24 Jam', features: 'Home Rental Bawa Pulang, Jaminan 2 Identitas Resmi, Layanan Antar/Jemput Lokasi', displayOrder: 2 },
    { categoryId: catConsole.id, name: 'PlayStation 5 (12 Jam)', price: 170000, duration: '12 Jam', features: 'Home Rental Bawa Pulang, 2 Stik DualSense Controller, Koleksi Game Terlengkap', displayOrder: 3 },
    { categoryId: catConsole.id, name: 'PlayStation 5 (24 Jam)', price: 240000, duration: '24 Jam', features: 'Home Rental Bawa Pulang, 2 Stik DualSense Controller, Koleksi Game Terlengkap', displayOrder: 4 },
    { categoryId: catConsole.id, name: 'PlayStation 4 Pro (12 Jam)', price: 80000, duration: '12 Jam', features: 'Home Rental Bawa Pulang, 2 Stik DualShock Controller, Koleksi Game Terlengkap', displayOrder: 5 },
    { categoryId: catConsole.id, name: 'PlayStation 4 Pro (24 Jam)', price: 130000, duration: '24 Jam', features: 'Home Rental Bawa Pulang, 2 Stik DualShock Controller, Koleksi Game Terlengkap', displayOrder: 6 },

    { categoryId: catTv.id, name: 'Monitor Playbox 27 Inci (12 Jam)', price: 25000, duration: '12 Jam', features: 'Monitor IPS High Refresh Rate 180Hz, Kabel HDMI Included', displayOrder: 1 },
    { categoryId: catTv.id, name: 'Monitor Playbox 27 Inci (24 Jam)', price: 40000, duration: '24 Jam', features: 'Monitor IPS High Refresh Rate 180Hz, Kabel HDMI Included', displayOrder: 2 },
    { categoryId: catTv.id, name: 'TV LED 32 Inci (12 Jam)', price: 20000, duration: '12 Jam', features: 'Smart TV LED 32 Inci, Kabel HDMI Included', displayOrder: 3 },
    { categoryId: catTv.id, name: 'TV LED 32 Inci (24 Jam)', price: 35000, duration: '24 Jam', features: 'Smart TV LED 32 Inci, Kabel HDMI Included', displayOrder: 4 },
    { categoryId: catTv.id, name: 'TV LED 43 Inci (12 Jam)', price: 30000, duration: '12 Jam', features: 'Smart TV LED 43 Inci 4K, Kabel HDMI Included', displayOrder: 5 },
    { categoryId: catTv.id, name: 'TV LED 43 Inci (24 Jam)', price: 40000, duration: '24 Jam', features: 'Smart TV LED 43 Inci 4K, Kabel HDMI Included', displayOrder: 6 },
  ];

  for (const item of pricingItems) {
    await prisma.pricingItem.create({ data: item });
  }

  // 7. Events
  const events = [
    {
      title: 'PES 2025 Arena',
      slug: 'pes-2025-arena',
      subtitle: 'Tournament & Match Night',
      description: 'Prizepool Rp 1.000.000 + Trophy. Tempat terbatas untuk 32 slot peserta!',
      eventDate: new Date('2026-09-15T18:00:00Z'),
      startDate: new Date('2026-09-15T10:00:00Z'),
      endDate: new Date('2026-09-20T22:00:00Z'),
      locationText: 'DsterGame Main Branch',
      status: EventStatus.UPCOMING,
      isFeatured: true,
      displayOrder: 1,
    },
    {
      title: 'Tekken 8 Clash',
      slug: 'tekken-8-clash',
      subtitle: 'Community Championship',
      description: 'Turnamen komunitas Tekken 8 dengan total hadiah menarik & sertifikat.',
      eventDate: new Date('2026-09-20T18:00:00Z'),
      startDate: new Date('2026-09-20T13:00:00Z'),
      endDate: new Date('2026-09-25T21:00:00Z'),
      locationText: 'DsterGame Main Branch',
      status: EventStatus.UPCOMING,
      isFeatured: false,
      displayOrder: 2,
    },
    {
      title: 'Forza Horizon Speed Cup',
      slug: 'forza-horizon-speed-cup',
      subtitle: 'Logitech G29 Challenge',
      description: 'Adu kecepatan di simulator balap Logitech G29 dengan track resmi.',
      eventDate: new Date('2026-09-28T18:00:00Z'),
      startDate: new Date('2026-09-28T09:00:00Z'),
      endDate: new Date('2026-10-03T21:00:00Z'),
      locationText: 'DsterGame Main Branch',
      status: EventStatus.UPCOMING,
      isFeatured: false,
      displayOrder: 3,
    },
    {
      title: 'FIFA FC24 League',
      slug: 'fifa-fc24-league',
      subtitle: 'Weekend Special Match',
      description: 'Kompetisi liga weekend antar member DsterGame dengan hadiah voucher rental.',
      eventDate: new Date('2026-10-05T18:00:00Z'),
      startDate: new Date('2026-10-05T14:00:00Z'),
      endDate: new Date('2026-10-10T22:00:00Z'),
      locationText: 'DsterGame Main Branch',
      status: EventStatus.UPCOMING,
      isFeatured: false,
      displayOrder: 4,
    },
    {
      title: 'FC 25 Launch Tournament',
      slug: 'fc-25-launch-tournament',
      subtitle: 'Next-Gen Showcase & Clash',
      description: 'Turnamen peluncuran EA Sports FC 25 dengan hadiah tunai & exclusive gaming merchandise.',
      eventDate: new Date('2026-11-15T18:00:00Z'),
      startDate: new Date('2026-11-15T10:00:00Z'),
      endDate: new Date('2026-11-20T22:00:00Z'),
      locationText: 'DsterGame Main Branch',
      status: EventStatus.UPCOMING,
      isFeatured: true,
      displayOrder: 5,
    },
    {
      title: 'Mario Kart Party Clash',
      slug: 'mario-kart-party-clash',
      subtitle: 'Nintendo Switch Night',
      description: 'Kompetisi balap seru Mario Kart 8 Deluxe 4 player split-screen dengan snack & voucher gratis.',
      eventDate: new Date('2026-12-01T18:00:00Z'),
      startDate: new Date('2026-12-01T14:00:00Z'),
      endDate: new Date('2026-12-05T22:00:00Z'),
      locationText: 'DsterGame Main Branch',
      status: EventStatus.UPCOMING,
      isFeatured: false,
      displayOrder: 6,
    },
  ];

  for (const event of events) {
    await prisma.event.upsert({
      where: { slug: event.slug },
      update: {
        startDate: event.startDate,
        endDate: event.endDate,
        eventDate: event.eventDate,
      },
      create: event,
    });
  }

  // 8. Gallery Albums & Photos
  const mainAlbum = await prisma.galleryAlbum.upsert({
    where: { slug: 'suasana-studio' },
    update: {},
    create: {
      title: 'Suasana DsterGame Studio',
      slug: 'suasana-studio',
      description: 'Koleksi foto area gaming lounge, VIP Room PS5, & Simulator Balap.',
      displayOrder: 1,
    },
  });

  await prisma.galleryPhoto.deleteMany({ where: {} });

  const galleryItems = [
    { title: 'PS5 VIP Station', caption: 'Ruang khusus rental PS5 VIP dengan TV 4K 65 inci, sofa empuk, dan sound system immersif.', url: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=1200&auto=format&fit=crop', displayOrder: 1 },
    { title: 'Racing Simulator Cockpit', caption: 'Set Kemudi Simulator Balap Logitech G29 lengkap dengan pedal & gear shifter.', url: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?q=80&w=1200&auto=format&fit=crop', displayOrder: 2 },
    { title: 'VR Motion Arena', caption: 'Sensasi petualangan 360 derajat dengan Virtual Reality Headset & Motion Controllers.', url: 'https://images.unsplash.com/photo-1593508512255-86ab42a8e620?q=80&w=1200&auto=format&fit=crop', displayOrder: 3 },
    { title: 'Cozy Community Lounge', caption: 'Area kumpul & nongkrong santai yang nyaman dilengkapi AC & snack bar.', url: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=1200&auto=format&fit=crop', displayOrder: 4 },
    { title: 'Esports Tournament Setup', caption: 'Arena pertandingan lokal multiplayer FC24, FIFA, & Tekken 8.', url: 'https://images.unsplash.com/photo-1538481199705-c710c4e965fc?q=80&w=1200&auto=format&fit=crop', displayOrder: 5 },
    { title: 'PS5 DualSense Station', caption: 'Stik PS5 DualSense wireless selalu terawat, responsif, dan siap tanding.', url: 'https://images.unsplash.com/photo-1606813907291-d86efa9b94db?q=80&w=1200&auto=format&fit=crop', displayOrder: 6 },
    { title: 'Nintendo Switch Party Zone', caption: 'Area main game Nintendo Switch OLED party games bersama teman-teman.', url: 'https://images.unsplash.com/photo-1578303512597-81e6cc155b3e?q=80&w=1200&auto=format&fit=crop', displayOrder: 7 },
    { title: 'VVIP Ambient Lighting Room', caption: 'Pencahayaan RGB eksklusif dengan atmosphere gaming masa kini.', url: 'https://images.unsplash.com/photo-1598550476439-6847785fcea6?q=80&w=1200&auto=format&fit=crop', displayOrder: 8 },
  ];

  for (const g of galleryItems) {
    const media = await prisma.media.create({
      data: {
        filename: `${g.title.toLowerCase().replace(/\s+/g, '-')}.jpg`,
        url: g.url,
        mimeType: 'image/jpeg',
        fileType: MediaFileType.IMAGE,
        sizeBytes: 1024 * 300,
        altText: g.title,
      },
    });

    await prisma.galleryPhoto.create({
      data: {
        albumId: mainAlbum.id,
        mediaId: media.id,
        caption: `${g.title} - ${g.caption}`,
        displayOrder: g.displayOrder,
        isFeatured: true,
      },
    });
  }

  // 9. Branch Locations
  await prisma.branch.upsert({
    where: { slug: 'dstergame-cabang-1' },
    update: {},
    create: {
      name: 'DsterGame Cabang 1',
      slug: 'dstergame-cabang-1',
      address: 'Jl. Pemuda No. 12, Bandarjo, Kec. Ungaran Barat, Kab. Semarang 50511',
      latitude: -7.133860,
      longitude: 110.398851,
      phone: '081234567890',
      whatsapp: '6281234567890',
      mapUrl: 'https://maps.app.goo.gl/ygUFrbeKupStPAEm7',
      operationalHours: '06.00 - 24.00 WIB',
      isPrimary: true,
      isPublished: true,
      displayOrder: 1,
    },
  });

  await prisma.branch.upsert({
    where: { slug: 'dstergame-cabang-2' },
    update: {
      name: 'DsterGame Cabang 2',
      address: 'Jl. Gedongsongo No. 17, Rt.05 Rw.II Mijen, Candirejo, Kec. Ungaran Barat, Kab. Semarang 50513',
      latitude: -7.152918474450402,
      longitude: 110.40754126034807,
      mapUrl: 'https://maps.app.goo.gl/ohiPUyJ9myd9eQEU9',
      isPublished: true,
      displayOrder: 2,
    },
    create: {
      name: 'DsterGame Cabang 2',
      slug: 'dstergame-cabang-2',
      address: 'Jl. Gedongsongo No. 17, Rt.05 Rw.II Mijen, Candirejo, Kec. Ungaran Barat, Kab. Semarang 50513',
      latitude: -7.152918474450402,
      longitude: 110.40754126034807,
      phone: '085172412206',
      whatsapp: '6285172412206',
      mapUrl: 'https://maps.app.goo.gl/ohiPUyJ9myd9eQEU9',
      operationalHours: '06.00 - 24.00 WIB',
      isPrimary: false,
      isPublished: true,
      displayOrder: 2,
    },
  });

  await prisma.branch.upsert({
    where: { slug: 'dstergame-cabang-3' },
    update: {
      name: 'DsterGame Cabang 3',
      address: 'Pertokoan Pandawa Pujasera, Jl. Ahmad Yani No.9, Kalicacing, Kec. Sidomukti, Kota Salatiga',
      latitude: -7.333627554257242,
      longitude: 110.50335111835415,
      mapUrl: 'https://maps.app.goo.gl/UPX9YgbXidywG87F7',
      isPublished: true,
      displayOrder: 3,
    },
    create: {
      name: 'DsterGame Cabang 3',
      slug: 'dstergame-cabang-3',
      address: 'Pertokoan Pandawa Pujasera, Jl. Ahmad Yani No.9, Kalicacing, Kec. Sidomukti, Kota Salatiga',
      latitude: -7.333627554257242,
      longitude: 110.50335111835415,
      phone: '085111392206',
      whatsapp: '6285111392206',
      mapUrl: 'https://maps.app.goo.gl/UPX9YgbXidywG87F7',
      operationalHours: '06.00 - 24.00 WIB',
      isPrimary: false,
      isPublished: true,
      displayOrder: 3,
    },
  });

  // 10. Testimonials
  await prisma.testimonial.deleteMany({ where: {} });

  const testimonials = [
    { reviewerName: 'Hasan Afandi', reviewerRole: 'Pelanggan Setia', content: 'Tempatnya nyaman banget, PS-nya lengkap dan masih bagus semua 👍 Pelayanan ramah, harga juga terjangkau. Betah main lama-lama di sini!', rating: 5, isFeatured: true, displayOrder: 1 },
    { reviewerName: 'Ridwan Pramuditya', reviewerRole: 'Gamer Ungaran', content: 'Ruangan bersih, nyaman, dilengkapi fasilitas wifi (tanya admin jika ingin tau wifinya), satu lokasi dengan warmindo apabila kita lapar', rating: 5, isFeatured: true, displayOrder: 2 },
    { reviewerName: 'Defender Widi', reviewerRole: 'Komunitas PES', content: 'tempat PSan paling nyaman di Ungaran, lengkap juga ada makanan dan minuman dengan harga terjangkau. kelebihannya lagi bisa bebas makan, minum, ataupun rokok di dalam sambil main', rating: 5, isFeatured: true, displayOrder: 3 },
    { reviewerName: 'Matcha Latte', reviewerRole: 'Pengunjung Studio', content: 'Dstetgame PlayStation tempat yang seru buat main game bareng teman. Tersedia fasilitas PS3, PS4, dan PS5 yang bisa dipakai dengan nyaman. Tempatnya juga cukup enak buat nongkrong sambil main.', rating: 5, isFeatured: true, displayOrder: 4 },
    { reviewerName: 'Valen', reviewerRole: 'Pelanggan Cabang 2', content: 'dstergame cabang 2 ga kalah nyaman e sama yang cabang utama. pokomen kalian wajib mampir main gess', rating: 5, isFeatured: true, displayOrder: 5 },
    { reviewerName: 'Muhammad Wildan Albi', reviewerRole: 'Esports Member', content: 'Cabang dstergame kedua yang ga kalah keren bahkan improve dari cabang utama 😁', rating: 5, isFeatured: true, displayOrder: 6 },
    { reviewerName: 'Bintang Rahmat', reviewerRole: 'Member VIP Simulator', content: 'Simulator balap Logitech G29-nya responsif banget! Serasa balapan beneran di sirkuit. Bakal sering langganan di sini.', rating: 5, isFeatured: true, displayOrder: 7 },
    { reviewerName: 'Kevin Sanjaya', reviewerRole: 'Student Gamer', content: 'Stik PS5 selalu bersih dan terawat, gak ada yang drift. Ruangan AC dingin banget buat mabar jam-jaman.', rating: 5, isFeatured: true, displayOrder: 8 },
    { reviewerName: 'Andika Pratama', reviewerRole: 'Local Resident', content: 'Harga sewa konsol bawa pulang murah dan syaratnya gampang. Pelayanan admin WhatsApp cepat dan ramah!', rating: 5, isFeatured: true, displayOrder: 9 },
    { reviewerName: 'Rian Ardianto', reviewerRole: 'Komunitas Tekken', content: 'Turnamen Tekken 8 di DsterGame kemarin seru parah! Prizepool langsung cair, tempatnya luas dan gak sumpek.', rating: 5, isFeatured: true, displayOrder: 10 },
  ];

  for (const t of testimonials) {
    await prisma.testimonial.create({ data: t });
  }

  // 11. FAQs
  const generalFaq = await prisma.faqCategory.upsert({
    where: { id: 'faq-general' },
    update: {},
    create: { id: 'faq-general', name: 'Umum', displayOrder: 1 },
  });

  await prisma.faqItem.deleteMany({ where: {} });

  const faqs = [
    { question: 'Bagaimana alur pesan & cara mulai bermain jika baru pertama kali datang?', answer: 'Sangat mudah & santai! Cukup datang ke kasir/admin, pilih konsol yang ingin Anda mainkan (PS3, PS4, PS5, Switch, atau Simulator Balap), dan staff kami siap menyiapkan TV, memilihkan game, hingga mengajari cara memegang stik controller sampai Anda nyaman bermain.', categoryId: generalFaq.id, displayOrder: 1 },
    { question: 'Apakah bisa booking / reservasi slot tempat atau konsol lebih dulu sebelum datang?', answer: 'Bisa banget! Agar tidak kehabisan tempat saat jam ramai, Anda dapat langsung reservasi via WhatsApp Admin sebelum berangkat. Cukup infokan estimasi jam kedatangan, durasi main, dan jenis konsol pilihan Anda.', categoryId: generalFaq.id, displayOrder: 2 },
    { question: 'Syarat dan prosedur apa saja yang dibutuhkan untuk Sewa Bawa Pulang (Home Rental)?', answer: 'Persyaratannya sangat simpel! Cukup jaminkan 2 Identitas Resmi yang masih berlaku (seperti KTP / SIM / STNK / Kartu Pelajar) dan kirimkan titik lokasi rumah via WhatsApp Admin. Kami juga menyediakan layanan antar-jemput unit konsol langsung ke lokasi Anda.', categoryId: generalFaq.id, displayOrder: 3 },
    { question: 'Apakah boleh membawa makanan & minuman sendiri saat bermain di tempat?', answer: 'Boleh banget! Anda bebas membawa makanan & minuman dari luar. Selain itu, studio kami juga berada di lokasi yang sama dengan Warmindo & Snack Corner sehingga Anda bisa memesan makan dan minum favorit sambil santai bermain.', categoryId: generalFaq.id, displayOrder: 4 },
    { question: 'Bagaimana jika stik/controller mengalami kendala saat sedang asyik bermain?', answer: 'Jangan khawatir! Seluruh stik controller dirawat dan dicek secara berkala. Jika baterai habis atau ada kendala pada tombol saat bermain, staff kami akan langsung menggantinya dengan stik cadangan tanpa biaya tambahan.', categoryId: generalFaq.id, displayOrder: 5 },
  ];

  for (const faq of faqs) {
    await prisma.faqItem.create({ data: faq });
  }

  console.log('✅ Comprehensive database seed completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
