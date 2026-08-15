export interface NavItem {
  id: string;
  label: string;
  href: string;
}

export interface GameItem {
  id: string;
  title: string;
  platform: string;
  coverImage: string;
  genre: string;
}

export interface ListGameItem {
  id: string;
  name: string;
  logo: string;
  logoImage?: string;
  secondaryImage?: string;
  buttonText: string;
  bgColor: string;
  textColor: string;
  games: GameItem[];
}

export interface RateOption {
  duration: string;
  price: string;
}

export interface PricingPackage {
  id: string;
  vipName: string;
  timeRange?: string;
  price?: string;
  rates?: RateOption[];
  features?: string[];
  description?: string;
}

export interface PricingCategoryColumn {
  title: string;
  items: PricingPackage[];
}

export interface PricingTab {
  id: string;
  label: string;
  subtitle?: string;
  terms?: string;
  generalFeatures?: string[];
  columns: PricingCategoryColumn[];
}

export interface EventItem {
  id: string;
  title: string;
  subTitle: string;
  description: string;
  posterImage: string;
  timeDate: string;
  buttonText: string;
  linkUrl: string;
  startDate?: string;
  endDate?: string;
  isNew?: boolean;
  badgeText?: string;
}

export interface GalleryPhoto {
  id: string;
  letter?: string;
  imagePath: string;
  title: string;
  size: 'sm' | 'md' | 'lg';
  description?: string;
}

export interface BranchLocation {
  id: string;
  name: string;
  address: string;
  lat: number;
  lng: number;
  phone: string;
  mapUrl: string;
  embedUrl?: string;
}

export interface TestimonialItem {
  id: string;
  nickname: string;
  username: string;
  comment: string;
  rating: number;
  avatarUrl?: string;
}

export interface FaqMockItem {
  id: string;
  question: string;
  answer: string;
}

export const mockNavbar: NavItem[] = [
  { id: '1', label: 'Home', href: '#hero' },
  { id: '2', label: 'List Game', href: '#list-game' },
  { id: '3', label: 'Pricing', href: '#pricing' },
  { id: '4', label: 'Events', href: '#event' },
  { id: '5', label: 'Gallery', href: '#gallery' },
  { id: '6', label: 'Location', href: '#location' },
  { id: '7', label: 'Testimoni', href: '#testimonials' },
  { id: '8', label: 'FAQ', href: '#faq' },
  { id: '9', label: 'Contact', href: '#contact' },
];

export const mockHero = {
  logo: '/Logo/DsterGameLogo.png',
  instagram: '@dster.game',
  ctaText: 'Explore',
  ctaLink: '#list-game',
  decorations: {
    vr: '/Decoration/Decoration-VR.png',
    gamepad: '/Decoration/Decoration-GamePad.png',
    wheel: '/Decoration/Decoration-Whell.png',
    stick: '/Decoration/Decoration-Stick.png',
    star: '/Decoration/Decoration-Star.png',
  },
  gameCovers: [
    { id: '1', title: 'Minecraft', image: '/GameCover/Minecraft.jpg' },
    { id: '2', title: 'Forza Horizon 5', image: '/GameCover/ForzaHorizon5.jpg' },
    { id: '3', title: 'Grand Theft Auto V', image: '/GameCover/GrandTheftAutoV.jpg' },
    { id: '4', title: 'Spider-Man 2', image: '/GameCover/Spiderman.jpg' },
    { id: '5', title: 'It Takes Two', image: '/GameCover/ItTakesTwo.jpg' },
  ],
};

export const mockListGameList: ListGameItem[] = [
  {
    id: 'playstation',
    name: 'PlayStation',
    logo: '/Logo/PlayStationLogo.png',
    logoImage: '/Logo/PlayStationLogo.png',
    secondaryImage: undefined,
    buttonText: 'Detail',
    bgColor: '#2425B5',
    textColor: '#FFFFFF',
    games: [
      { id: 'ps5-1', title: 'EA Sports FC 24 / PES 2024', platform: 'PS5', coverImage: '/GameCover/GrandTheftAutoV.jpg', genre: 'Sports' },
      { id: 'ps5-2', title: "Marvel's Spider-Man 2", platform: 'PS5', coverImage: '/GameCover/Spiderman.jpg', genre: 'Action' },
      { id: 'ps4-1', title: 'Grand Theft Auto V', platform: 'PS4', coverImage: '/GameCover/GrandTheftAutoV.jpg', genre: 'Action' },
      { id: 'ps4-2', title: 'God of War Ragnarok', platform: 'PS4', coverImage: '/GameCover/GrandTheftAutoV.jpg', genre: 'Action' },
      { id: 'ps3-1', title: 'PES 2013 Legend Patch', platform: 'PS3', coverImage: '/GameCover/GrandTheftAutoV.jpg', genre: 'Sports' },
    ],
  },
  {
    id: 'nintendo',
    name: 'Nintendo Switch',
    logo: '/Logo/NintendoLogo.png',
    logoImage: '/Logo/NintendoLogo.png',
    secondaryImage: undefined,
    buttonText: 'Detail',
    bgColor: '#E71B24',
    textColor: '#FFFFFF',
    games: [
      { id: 'ns-1', title: 'Minecraft Switch Edition', platform: 'Nintendo Switch', coverImage: '/GameCover/Minecraft.jpg', genre: 'Sandbox' },
      { id: 'ns-2', title: 'It Takes Two', platform: 'Nintendo Switch', coverImage: '/GameCover/ItTakesTwo.jpg', genre: 'Co-op' },
      { id: 'ns-3', title: 'Mario Kart 8 Deluxe', platform: 'Nintendo Switch', coverImage: '/GameCover/Minecraft.jpg', genre: 'Racing' },
    ],
  },
  {
    id: 'logitech',
    name: 'Logitech Wheel',
    logo: '/Logo/LogitechLogo.png',
    logoImage: '/Logo/LogitechLogo.png',
    secondaryImage: undefined,
    buttonText: 'Detail',
    bgColor: '#E0FE0A',
    textColor: '#1D242B',
    games: [
      { id: 'lg-1', title: 'Forza Horizon 5', platform: 'Simulator Wheel', coverImage: '/GameCover/ForzaHorizon5.jpg', genre: 'Racing' },
      { id: 'lg-2', title: 'Assetto Corsa', platform: 'Simulator Wheel', coverImage: '/GameCover/ForzaHorizon5.jpg', genre: 'Simulator' },
      { id: 'lg-3', title: 'Gran Turismo 7', platform: 'Simulator Wheel', coverImage: '/GameCover/ForzaHorizon5.jpg', genre: 'Racing' },
    ],
  },
];

export const mockPricingTabs: PricingTab[] = [
  {
    id: 'main',
    label: 'Pricelist On-Site',
    subtitle: 'Paket rental main di tempat dengan layar Smart TV 4K, Kursi Sofa Ergonomis, dan Controller Original.',
    columns: [
      {
        title: '',
        items: [
          {
            id: 'main-nintendo',
            vipName: 'Nintendo Switch',
            rates: [
              { duration: '1 Jam', price: 'Rp 14.000' },
            ],
            features: ['TV LED 4K 50 Inci', 'Kursi Sofa Ergonomis', '2 Controller Original'],
          },
          {
            id: 'main-ps5',
            vipName: 'PlayStation 5',
            rates: [
              { duration: '1 Jam', price: 'Rp 14.000' },
            ],
            features: ['TV OLED 4K 50 Inci', 'Kursi Sofa Ergonomis', '2 Stik DualSense Original'],
          },
          {
            id: 'main-ps4-pro',
            vipName: 'PlayStation 4 Pro',
            rates: [
              { duration: '1 Jam', price: 'Rp 12.000' },
            ],
            features: ['TV LED 4K 43 Inci', 'Kursi Sofa Ergonomis', '2 Stik DualShock Original'],
          },
          {
            id: 'main-ps4',
            vipName: 'PlayStation 4',
            rates: [
              { duration: '1 Jam', price: 'Rp 9.000' },
            ],
            features: ['TV LED 43 Inci', '2 Stik DualShock Original'],
          },
          {
            id: 'main-ps3',
            vipName: 'PlayStation 3',
            rates: [
              { duration: '1 Jam', price: 'Rp 6.000' },
            ],
            features: ['TV LED 43 Inci', '2 Stik Controller Original Mesin'],
          },
          {
            id: 'main-extra-stick',
            vipName: 'Extra Controller',
            rates: [
              { duration: 'Per Jam', price: 'Rp 5.000 - Rp 15.000' },
            ],
            features: ['Tambahan Stik DualShock / DualSense Wireless'],
          },
          {
            id: 'main-racing',
            vipName: 'Racing Simulator (Logitech Wheel)',
            rates: [
              { duration: '1 Jam', price: 'Rp 25.000' },
              { duration: '2 Jam', price: 'Rp 45.000' },
              { duration: '3 Jam', price: 'Rp 60.000' },
            ],
            features: ['VIP Private AC Room (PS5)', 'Nintendo Switch Access', 'Smart TV 55" OLED 4K + Netflix'],
          },
        ],
      },
    ],
  },
  {
    id: 'playbox',
    label: 'Playbox Portable',
    subtitle: 'Paket Playbox Portable dengan Layar Monitor IPS 180Hz High Performance',
    columns: [
      {
        title: '',
        items: [
          {
            id: 'pb-ps3',
            vipName: 'Playbox PS3',
            rates: [
              { duration: '12 Jam', price: 'Rp 70.000' },
              { duration: '24 Jam', price: 'Rp 95.000' },
            ],
            features: [
              '2 Stik Controller Original Mesin',
              'Console PlayStation 3',
              'Koleksi Full Games Terlengkap',
              'Update Game Sepak Bola Terbaru',
              'Layar Monitor IPS 27 Inci 180Hz',
            ],
          },
          {
            id: 'pb-ps4',
            vipName: 'Playbox PS4 Pro',
            rates: [
              { duration: '12 Jam', price: 'Rp 90.000' },
              { duration: '24 Jam', price: 'Rp 150.000' },
            ],
            features: [
              '2 Stik DualShock Original',
              'Console PlayStation 4 Pro',
              'Koleksi Full Games Terlengkap',
              'Update Game Sepak Bola Terbaru',
              'Layar Monitor IPS 27 Inci 180Hz',
            ],
          },
        ],
      },
    ],
  },
  {
    id: 'sewa-console',
    label: 'Sewa Konsol',
    subtitle: 'Paket sewa konsol game bawa pulang (Home Rental)',
    terms: 'Layanan antar / jemput bisa di sharelock terlebih dahulu, jaminan 2 identitas = KTP / SIM / Kartu Pelajar / STNK Hidup',
    columns: [
      {
        title: '',
        items: [
          {
            id: 'sc-nintendo',
            vipName: 'Nintendo Switch',
            rates: [
              { duration: '12 Jam', price: 'Rp 100.000' },
              { duration: '24 Jam', price: 'Rp 180.000' },
            ],
            features: ['Home Rental Bawa Pulang', 'Jaminan 2 Identitas Resmi', 'Layanan Antar/Jemput Lokasi'],
          },
          {
            id: 'sc-ps5',
            vipName: 'PlayStation 5',
            rates: [
              { duration: '12 Jam', price: 'Rp 170.000' },
              { duration: '24 Jam', price: 'Rp 240.000' },
            ],
            features: ['Home Rental Bawa Pulang', '2 Stik DualSense Controller', 'Koleksi Game Terlengkap'],
          },
          {
            id: 'sc-ps4-pro',
            vipName: 'PlayStation 4 Pro',
            rates: [
              { duration: '12 Jam', price: 'Rp 80.000' },
              { duration: '24 Jam', price: 'Rp 130.000' },
            ],
            features: ['Home Rental Bawa Pulang', '2 Stik DualShock Controller', 'Koleksi Game Terlengkap'],
          },
          {
            id: 'sc-ps4',
            vipName: 'PlayStation 4',
            rates: [
              { duration: '12 Jam', price: 'Rp 70.000' },
              { duration: '24 Jam', price: 'Rp 120.000' },
            ],
            features: ['Home Rental Bawa Pulang', '2 Stik DualShock Controller', 'Koleksi Game Terlengkap'],
          },
          {
            id: 'sc-ps3',
            vipName: 'PlayStation 3',
            rates: [
              { duration: '12 Jam', price: 'Rp 50.000' },
              { duration: '24 Jam', price: 'Rp 75.000' },
            ],
            features: ['Home Rental Bawa Pulang', '2 Stik Controller Original', 'Full Game Patch Legend'],
          },
        ],
      },
    ],
  },
  {
    id: 'sewa-tv',
    label: 'Sewa Televisi',
    subtitle: 'Paket sewa Smart TV & Display monitor bawa pulang',
    terms: 'Wajib follow Instagram @sewa_Playstation_ungaran',
    columns: [
      {
        title: '',
        items: [
          {
            id: 'stv-pb27',
            vipName: 'Monitor Playbox 27 Inci',
            rates: [
              { duration: '12 Jam', price: 'Rp 25.000' },
              { duration: '24 Jam', price: 'Rp 40.000' },
            ],
            features: ['Monitor IPS High Refresh Rate 180Hz', 'Kabel HDMI Included'],
          },
          {
            id: 'stv-tv32',
            vipName: 'TV LED 32 Inci',
            rates: [
              { duration: '12 Jam', price: 'Rp 20.000' },
              { duration: '24 Jam', price: 'Rp 35.000' },
            ],
            features: ['Smart TV LED 32 Inci', 'Kabel HDMI Included'],
          },
          {
            id: 'stv-tv43',
            vipName: 'TV LED 43 Inci',
            rates: [
              { duration: '12 Jam', price: 'Rp 30.000' },
              { duration: '24 Jam', price: 'Rp 40.000' },
            ],
            features: ['Smart TV LED 43 Inci 4K', 'Kabel HDMI Included'],
          },
        ],
      },
    ],
  },
];

export const mockEvents: EventItem[] = [
  {
    id: 'e1',
    title: 'PES 2025 Arena',
    subTitle: 'Tournament & Match Night',
    description: 'Prizepool Rp 1.000.000 + Trophy. Tempat terbatas untuk 32 slot peserta!',
    posterImage: '/Other/Event-Poster.jpg',
    timeDate: '15 - 20 Sep 2026',
    startDate: '2026-09-15',
    endDate: '2026-09-20',
    buttonText: 'Detail',
    linkUrl: 'https://instagram.com/dster.game',
    isNew: true,
    badgeText: 'NEW',
  },
  {
    id: 'e2',
    title: 'Tekken 8 Clash',
    subTitle: 'Community Championship',
    description: 'Turnamen komunitas Tekken 8 dengan total hadiah menarik & sertifikat.',
    posterImage: '/Other/Event-Poster.jpg',
    timeDate: '20 - 25 Sep 2026',
    startDate: '2026-09-20',
    endDate: '2026-09-25',
    buttonText: 'Detail',
    linkUrl: 'https://instagram.com/dster.game',
  },
  {
    id: 'e3',
    title: 'Forza Horizon Speed Cup',
    subTitle: 'Logitech G29 Challenge',
    description: 'Adu kecepatan di simulator balap Logitech G29 dengan track resmi.',
    posterImage: '/Other/Event-Poster.jpg',
    timeDate: '28 Sep - 03 Okt 2026',
    startDate: '2026-09-28',
    endDate: '2026-10-03',
    buttonText: 'Detail',
    linkUrl: 'https://instagram.com/dster.game',
  },
  {
    id: 'e4',
    title: 'FIFA FC24 League',
    subTitle: 'Weekend Special Match',
    description: 'Kompetisi liga weekend antar member DsterGame dengan hadiah voucher rental.',
    posterImage: '/Other/Event-Poster.jpg',
    timeDate: '05 - 10 Okt 2026',
    startDate: '2026-10-05',
    endDate: '2026-10-10',
    buttonText: 'Detail',
    linkUrl: 'https://instagram.com/dster.game',
  },
  {
    id: 'e5',
    title: 'FC 25 Launch Tournament',
    subTitle: 'Next-Gen Showcase & Clash',
    description: 'Turnamen peluncuran EA Sports FC 25 dengan hadiah tunai & exclusive gaming merchandise.',
    posterImage: '/Other/Event-Poster.jpg',
    timeDate: '15 - 20 Nov 2026',
    startDate: '2026-11-15',
    endDate: '2026-11-20',
    buttonText: 'Detail',
    linkUrl: 'https://instagram.com/dster.game',
    isNew: true,
    badgeText: 'NEW',
  },
  {
    id: 'e6',
    title: 'Mario Kart Party Clash',
    subTitle: 'Nintendo Switch Night',
    description: 'Kompetisi balap seru Mario Kart 8 Deluxe 4 player split-screen dengan snack & voucher gratis.',
    posterImage: '/Other/Event-Poster.jpg',
    timeDate: '01 - 05 Des 2026',
    startDate: '2026-12-01',
    endDate: '2026-12-05',
    buttonText: 'Detail',
    linkUrl: 'https://instagram.com/dster.game',
  },
];

export const mockGalleryPhotos: GalleryPhoto[] = [
  {
    id: 'g1',
    letter: 'G',
    imagePath: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=1200&auto=format&fit=crop',
    title: 'PS5 VIP Station',
    size: 'lg',
    description: 'Ruang khusus rental PS5 VIP dengan TV 4K 65 inci, sofa empuk, dan sound system immersif.',
  },
  {
    id: 'g2',
    letter: 'A',
    imagePath: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?q=80&w=1200&auto=format&fit=crop',
    title: 'Racing Simulator Cockpit',
    size: 'md',
    description: 'Set Kemudi Simulator Balap Logitech G29 lengkap dengan pedal & gear shifter.',
  },
  {
    id: 'g3',
    letter: 'L',
    imagePath: 'https://images.unsplash.com/photo-1593508512255-86ab42a8e620?q=80&w=1200&auto=format&fit=crop',
    title: 'VR Motion Arena',
    size: 'sm',
    description: 'Sensasi petualangan 360 derajat dengan Virtual Reality Headset & Motion Controllers.',
  },
  {
    id: 'g4',
    letter: 'L',
    imagePath: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=1200&auto=format&fit=crop',
    title: 'Cozy Community Lounge',
    size: 'md',
    description: 'Area kumpul & nongkrong santai yang nyaman dilengkapi AC & snack bar.',
  },
  {
    id: 'g5',
    letter: 'E',
    imagePath: 'https://images.unsplash.com/photo-1538481199705-c710c4e965fc?q=80&w=1200&auto=format&fit=crop',
    title: 'Esports Tournament Setup',
    size: 'lg',
    description: 'Arena pertandingan lokal multiplayer FC24, FIFA, & Tekken 8.',
  },
  {
    id: 'g6',
    letter: 'R',
    imagePath: 'https://images.unsplash.com/photo-1606813907291-d86efa9b94db?q=80&w=1200&auto=format&fit=crop',
    title: 'PS5 DualSense Station',
    size: 'md',
    description: 'Stik PS5 DualSense wireless selalu terawat, responsif, dan siap tanding.',
  },
  {
    id: 'g7',
    letter: 'Y',
    imagePath: 'https://images.unsplash.com/photo-1578303512597-81e6cc155b3e?q=80&w=1200&auto=format&fit=crop',
    title: 'Nintendo Switch Party Zone',
    size: 'lg',
    description: 'Area main game Nintendo Switch OLED party games bersama teman-teman.',
  },
  {
    id: 'g8',
    letter: 'S',
    imagePath: 'https://images.unsplash.com/photo-1598550476439-6847785fcea6?q=80&w=1200&auto=format&fit=crop',
    title: 'VVIP Ambient Lighting Room',
    size: 'md',
    description: 'Pencahayaan RGB eksklusif dengan atmosphere gaming masa kini.',
  },
];

export const mockBranchLocations: BranchLocation[] = [
  {
    id: 'b1',
    name: 'DsterGame Cabang 1',
    address: 'Jl. Pemuda No. 12, Bandarjo, Kec. Ungaran Barat, Kab. Semarang 50511',
    lat: -7.1338603549452815,
    lng: 110.39885164643879,
    phone: '081234567890',
    mapUrl: 'https://maps.app.goo.gl/ygUFrbeKupStPAEm7',
    embedUrl: 'https://maps.google.com/maps?q=-7.133860,110.398851&z=17&output=embed',
  },
  {
    id: 'b2',
    name: 'DsterGame Cabang 2',
    address: 'Jl. Gedongsongo No. 17, Rt.05 Rw.II Mijen, Candirejo, Kec. Ungaran Barat, Kab. Semarang 50513',
    lat: -7.152918474450402,
    lng: 110.40754126034807,
    phone: '085172412206',
    mapUrl: 'https://maps.app.goo.gl/ohiPUyJ9myd9eQEU9',
    embedUrl: 'https://maps.google.com/maps?q=-7.152918474450402,110.40754126034807&z=17&output=embed',
  },
  {
    id: 'b3',
    name: 'DsterGame Cabang 3',
    address: 'Pertokoan Pandawa Pujasera, Jl. Ahmad Yani No.9, Kalicacing, Kec. Sidomukti, Kota Salatiga',
    lat: -7.333627554257242,
    lng: 110.50335111835415,
    phone: '085111392206',
    mapUrl: 'https://maps.app.goo.gl/UPX9YgbXidywG87F7',
    embedUrl: 'https://maps.google.com/maps?q=-7.333627554257242,110.50335111835415&z=17&output=embed',
  },
];

export const mockBranchLocation: BranchLocation = mockBranchLocations[0];

export const mockTestimonials: TestimonialItem[] = [
  {
    id: 't1',
    nickname: 'Hasan Afandi',
    username: '@hasanafandi',
    comment: 'Tempatnya nyaman banget, PS-nya lengkap dan masih bagus semua 👍 Pelayanan ramah, harga juga terjangkau. Betah main lama-lama di sini!',
    rating: 5,
  },
  {
    id: 't2',
    nickname: 'Ridwan Pramuditya',
    username: '@ridwan_pramuditya',
    comment: 'Ruangan bersih, nyaman, dilengkapi fasilitas wifi (tanya admin jika ingin tau wifinya), satu lokasi dengan warmindo apabila kita lapar',
    rating: 5,
  },
  {
    id: 't3',
    nickname: 'Defender Widi',
    username: '@defend_widi',
    comment: 'tempat PSan paling nyaman di Ungaran, lengkap juga ada makanan dan minuman dengan harga terjangkau. kelebihannya lagi bisa bebas makan, minum, ataupun rokok di dalam sambil main',
    rating: 5,
  },
  {
    id: 't4',
    nickname: 'Matcha Latte',
    username: '@matcha_late',
    comment: 'Dstetgame PlayStation tempat yang seru buat main game bareng teman. Tersedia fasilitas PS3, PS4, dan PS5 yang bisa dipakai dengan nyaman. Tempatnya juga cukup enak buat nongkrong sambil main. Selain itu, di sini juga melayani jual dan sewa PlayStation, jadi cocok buat yang ingin main di tempat atau menyewa untuk dibawa pulang.',
    rating: 5,
  },
  {
    id: 't5',
    nickname: 'Valen',
    username: '@valen',
    comment: 'dstergame cabang 2 ga kalah nyaman e sama yang cabang utama. pokomen kalian wajib mampir main gess',
    rating: 5,
  },
  {
    id: 't6',
    nickname: 'Muhammad Wildan Albi',
    username: '@wildan_albi',
    comment: 'Cabang dstergame kedua yang ga kalah keren bahkan improve dari cabang utama 😁',
    rating: 5,
  },
];

export const mockFaqs: FaqMockItem[] = [
  {
    id: 'faq1',
    question: 'Bagaimana alur pesan & cara mulai bermain jika baru pertama kali datang?',
    answer: 'Sangat mudah & santai! Cukup datang ke kasir/admin, pilih konsol yang ingin Anda mainkan (PS3, PS4, PS5, Switch, atau Simulator Balap), dan staff kami siap menyiapkan TV, memilihkan game, hingga mengajari cara memegang stik controller sampai Anda nyaman bermain.',
  },
  {
    id: 'faq2',
    question: 'Apakah bisa booking / reservasi slot tempat atau konsol lebih dulu sebelum datang?',
    answer: 'Bisa banget! Agar tidak kehabisan tempat saat jam ramai, Anda dapat langsung reservasi via WhatsApp Admin sebelum berangkat. Cukup infokan estimasi jam kedatangan, durasi main, dan jenis konsol pilihan Anda.',
  },
  {
    id: 'faq3',
    question: 'Syarat dan prosedur apa saja yang dibutuhkan untuk Sewa Bawa Pulang (Home Rental)?',
    answer: 'Persyaratannya sangat simpel! Cukup jaminkan 2 Identitas Resmi yang masih berlaku (seperti KTP / SIM / STNK / Kartu Pelajar) dan kirimkan titik lokasi rumah via WhatsApp Admin. Kami juga menyediakan layanan antar-jemput unit konsol langsung ke lokasi Anda.',
  },
  {
    id: 'faq4',
    question: 'Apakah boleh membawa makanan & minuman sendiri saat bermain di tempat?',
    answer: 'Boleh banget! Anda bebas membawa makanan & minuman dari luar. Selain itu, studio kami juga berada di lokasi yang sama dengan Warmindo & Snack Corner sehingga Anda bisa memesan makan dan minum favorit sambil santai bermain.',
  },
  {
    id: 'faq5',
    question: 'Bagaimana jika stik/controller mengalami kendala saat sedang asyik bermain?',
    answer: 'Jangan khawatir! Seluruh stik controller dirawat dan dicek secara berkala. Jika baterai habis atau ada kendala pada tombol saat bermain, staff kami akan langsung menggantinya dengan stik cadangan tanpa biaya tambahan.',
  },
];
