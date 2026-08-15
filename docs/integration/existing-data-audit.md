# Existing Local & Mock Data Audit Report

Document Status: **Completed**  
Audit Stage: **Stage A — Content & Mock Data Audit**

---

## 1. Objective

Inventarisasi seluruh data lokal, mock data, dan hardcoded content yang saat ini dikonsumsi oleh Landing Page DsterGame Studio sebelum dilakukan pemindahan data ke Prisma Database.

---

## 2. Inventory Datasets

### Dataset 1: Navigation Bar (`mockNavbar` / `DEFAULT_NAVBAR`)
- **Lokasi Definisi**: `src/data/mock-landing.ts` & `src/context/SiteContext.tsx`
- **Komponen Pengonsumsi**: `NavbarSection.tsx`, `FooterSection.tsx`
- **Struktur Field**:
  - `id`: string
  - `label`: string
  - `href`: string (misal: `/`, `/list-game`, `/pricing`, `/event`, `/gallery`, `/location`, `/testimonials`, `/faq`, `/contact`)
- **Tipe Content**: **Dynamic / Configurable** (Menu navigasi harus dapat diatur atau diaktifkan melalui `SystemSetting` / `CmsSection`).

---

### Dataset 2: Hero Content (`mockHero`)
- **Lokasi Definisi**: `src/data/mock-landing.ts`
- **Komponen Pengonsumsi**: `HeroSection.tsx`, `NavbarSection.tsx`
- **Struktur Field**:
  - `logo`: string (`/Logo/DsterGameLogo.png`)
  - `instagram`: string (`@dster.game`)
  - `ctaText`: string (`Explore`)
  - `ctaLink`: string (`#list-game`)
  - `decorations`: object (`vr`, `gamepad`, `wheel`, `stick`, `star`)
  - `gameCovers`: Array<{ id, title, image }> (Minecraft, Forza Horizon 5, GTA V, Spider-Man 2, It Takes Two)
- **Tipe Content**: **Dynamic** (Tersedia model Prisma `Hero`, `HeroDecoration`, dan `Media`).

---

### Dataset 3: List Game Catalog (`mockListGameList`)
- **Lokasi Definisi**: `src/data/mock-landing.ts`
- **Komponen Pengonsumsi**: `ListGameSection.tsx`
- **Struktur Field**:
  - `id`: string (`playstation`, `nintendo`, `logitech`)
  - `name`: string
  - `logo`: string
  - `buttonText`: string
  - `bgColor`: string
  - `textColor`: string
  - `games`: Array<{ id, title, platform, coverImage, genre }>
- **Tipe Content**: **Dynamic** (Tersedia model Prisma `HardwareCategory`, `Hardware`, `Game`, dan `Media`).

---

### Dataset 4: Pricing Tabs & Packages (`mockPricingTabs`)
- **Lokasi Definisi**: `src/data/mock-landing.ts`
- **Komponen Pengonsumsi**: `PricingSection.tsx`
- **Struktur Field**:
  - `id`: string (`main`, `playbox`, `sewa-console`, `sewa-tv`)
  - `label`: string
  - `subtitle`: string
  - `terms`: string (opsional)
  - `columns`: Array of category columns with `items` (`vipName`, `price`, `rates`, `features`)
- **Tipe Content**: **Dynamic** (Tersedia model Prisma `PricingCategory` dan `PricingItem`).

---

### Dataset 5: Events & Turnamen (`mockEvents`)
- **Lokasi Definisi**: `src/data/mock-landing.ts`
- **Komponen Pengonsumsi**: `EventSection.tsx`
- **Struktur Field**:
  - `id`: string (`e1`, `e2`, `e3`, `e4`)
  - `title`: string
  - `subTitle`: string
  - `description`: string
  - `posterImage`: string
  - `timeDate`: string
  - `startDate`: string
  - `endDate`: string
  - `buttonText`: string
  - `linkUrl`: string
  - `isNew`: boolean
- **Tipe Content**: **Dynamic** (Tersedia model Prisma `Event`, `EventCategory`, dan `Media`).

---

### Dataset 6: Gallery Photos (`mockGalleryPhotos`)
- **Lokasi Definisi**: `src/data/mock-landing.ts`
- **Komponen Pengonsumsi**: `GallerySection.tsx`
- **Struktur Field**:
  - `id`: string
  - `letter`: string (opsional)
  - `imagePath`: string (URL Unsplash / local media)
  - `title`: string
  - `size`: `'sm' | 'md' | 'lg'`
  - `description`: string
- **Tipe Content**: **Dynamic** (Tersedia model Prisma `GalleryPhoto`, `GalleryAlbum`, dan `Media`).

---

### Dataset 7: Branch Locations (`mockBranchLocations`)
- **Lokasi Definisi**: `src/data/mock-landing.ts`
- **Komponen Pengonsumsi**: `LocationSection.tsx`
- **Struktur Field**:
  - `id`: string (`b1`, `b2`)
  - `name`: string
  - `address`: string
  - `lat`: number
  - `lng`: number
  - `phone`: string
  - `mapUrl`: string
  - `embedUrl`: string
- **Tipe Content**: **Dynamic** (Tersedia model Prisma `Branch` dan `Media`).

---

### Dataset 8: Testimonials (`mockTestimonials`)
- **Lokasi Definisi**: `src/data/mock-landing.ts`
- **Komponen Pengonsumsi**: `TestimonialSection.tsx`
- **Struktur Field**:
  - `id`: string (`t1` - `t6`)
  - `nickname`: string
  - `username`: string
  - `comment`: string
  - `rating`: number
  - `avatarUrl`: string (opsional)
- **Tipe Content**: **Dynamic** (Tersedia model Prisma `Testimonial` dan `Media`).

---

### Dataset 9: FAQs (`mockFaqs`)
- **Lokasi Definisi**: `src/data/mock-landing.ts`
- **Komponen Pengonsumsi**: `FAQSection.tsx`
- **Struktur Field**:
  - `id`: string (`faq1`, `faq2`, `faq3`)
  - `question`: string
  - `answer`: string
- **Tipe Content**: **Dynamic** (Tersedia model Prisma `FaqCategory` dan `FaqItem`).

---

### Dataset 10: Section Metadata & Contact Info (`DEFAULT_SECTIONS`, `DEFAULT_CONTACT`)
- **Lokasi Definisi**: `src/context/SiteContext.tsx`
- **Komponen Pengonsumsi**: `ContactSection.tsx`, `FooterSection.tsx`, seluruh judul section UI.
- **Struktur Field**:
  - `sections`: Map of key → `{ id, title, subtitle }`
  - `contactInfo`: `{ phone, whatsapp, instagram, email, address, footerText }`
- **Tipe Content**: **Dynamic / Configurable** (Dapat disimpan di Prisma `SystemSetting`).

---

## 3. Kesimpulan Audit Content
Seluruh data yang ditampilkan landing page saat ini sudah terinventarisasi dengan lengkap. Semua dataset memiliki pasangan model Prisma yang sesuai di database sehingga dapat difasilitasi tanpa kehilangan struktur data saat migrasi Stage B.
