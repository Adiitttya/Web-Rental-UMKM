# System Audit Report

Document Status: **Completed**  
Audit Stage: **Stage A — Full Repository Audit**  
Target Environment: **Next.js 16.3.0 / React 19 / Prisma ORM / PostgreSQL**

---

## 1. Executive Summary

Audit ini dilakukan secara mendalam pada repository **Web-Rental-UMKM (DsterGame Studio)** untuk mengidentifikasi arsitektur aktual, komponen frontend, layer backend, struktur database Prisma, serta infrastruktur.

Secara umum, aplikasi sudah memiliki fondasi arsitektur modular yang sangat rapi (`src/actions`, `src/services`, `src/repositories`, `src/validators`, `prisma/schema/modules`), namun komponen frontend landing page saat ini masih terikat dengan data lokal/mock via `SiteContext` dan `mock-landing.ts` alih-alih mengonsumsi data langsung dari Prisma database.

---

## 2. Frontend Architecture Audit

### 2.1 Route & Page Structure
Aplikasi menggunakan **Next.js App Router** dengan struktur route sebagai berikut:

- `src/app/page.tsx` — Landing page utama (mengembalikan `<LandingPage />`).
- `src/app/contact/page.tsx` — Halaman Contact (mengembalikan `<LandingPage initialSection="contact" />`).
- `src/app/event/page.tsx` — Halaman Event (mengembalikan `<LandingPage initialSection="event" />`).
- `src/app/faq/page.tsx` — Halaman FAQ (mengembalikan `<LandingPage initialSection="faq" />`).
- `src/app/gallery/page.tsx` — Halaman Gallery (mengembalikan `<LandingPage initialSection="gallery" />`).
- `src/app/list-game/page.tsx` — Halaman List Game (mengembalikan `<LandingPage initialSection="list-game" />`).
- `src/app/location/page.tsx` — Halaman Location (mengembalikan `<LandingPage initialSection="location" />`).
- `src/app/pricing/page.tsx` — Halaman Pricing (mengembalikan `<LandingPage initialSection="pricing" />`).
- `src/app/testimonials/page.tsx` — Halaman Testimonials (mengembalikan `<LandingPage initialSection="testimonials" />`).
- `src/app/api/cms/route.ts` — API Route handler CMS data.
- `src/app/api/feedback/route.ts` — API Route handler Feedback.

### 2.2 Landing Page & Section Components
Seluruh section UI terkumpul di `src/components/landing/sections/`:
1. `NavbarSection.tsx` — Navigation bar dinamis dengan scroll tracking.
2. `HeroSection.tsx` — Showcase hero, logo, dekorasi animasi floating, game covers.
3. `ListGameSection.tsx` — Katalog game interaktif per platform (PlayStation, Nintendo, Logitech).
4. `PricingSection.tsx` — Tabulasi paket harga (On-Site, Playbox, Sewa Console, Sewa TV).
5. `EventSection.tsx` — Card list event & turnamen esports.
6. `GallerySection.tsx` — Grid galeri foto suasana lounge.
7. `LocationSection.tsx` — Peta lokasi & embed Google Maps 2 cabang.
8. `TestimonialSection.tsx` — Card ulasan pelanggan & rating bintang.
9. `FAQSection.tsx` — Accordion pertanyaan yang sering diajukan.
10. `FeedbackSection.tsx` — Form kirim ulasan/feedback pengunjung.
11. `ContactSection.tsx` — Informasi kontak & link WhatsApp/Instagram.
12. `FooterSection.tsx` — Footer & copyright link.

### 2.3 State Management
- Seluruh section landing page membaca state dari `useSiteData()` (`SiteContext.tsx`).
- `SiteContext.tsx` menginisialisasi state dari `src/data/mock-landing.ts` dan menyimpannya di `localStorage` (`dstergame_site_data_v1`).

---

## 3. Backend Architecture Audit

### 3.1 Layered Design Audit
Repository sudah mengadopsi pola arsitektur *Clean / Layered*:
- **Actions Layer** (`src/actions/base.action.ts`): Menggunakan helper `handleServerAction()` untuk membungkus eksekusi server action dengan error logging dan penanganan `AppError`.
- **Service Layer** (`src/services/base.service.ts`): Memuat business logic dasar dan logger.
- **Repository Layer** (`src/repositories/base.repository.ts`): Menggunakan `BaseRepository` yang terhubung dengan instance `prisma` (`src/lib/prisma.ts`).
- **Validation Layer** (`src/validators/base.ts`): Memiliki `BaseValidator` bertipe generic dengan aturan validasi beruntun.

### 3.2 Existing API Route Handlers
- `src/app/api/cms/route.ts`:
  - `GET`: Mengambil data `cmsSection`, `branch`, `faqItem`, `event`, `testimonial`, dan `systemSetting` dari database via Prisma. Memiliki fallback exception handling safe.
  - `POST`: Mengurai URL Google Maps menggunakan utility `parseGoogleMapsInput`.
- `src/app/api/feedback/route.ts`:
  - `POST`: Menerima feedback pengunjung dengan rate limiting sliding window (10 req/min per IP) & sanitasi string.
  - `GET`: Mengembalikan data feedback yang tersimpan **di memori (in-memory array)**.

---

## 4. Database Architecture Audit

### 4.1 Schema Modularization
Database dikelola menggunakan **Prisma ORM (v6.3.1)** dengan skema modular di `prisma/schema/modules/`:
- `landing.prisma` — `Hero`, `HeroDecoration`
- `game.prisma` — `Game`
- `hardware.prisma` — `Hardware`, `HardwareCategory`, `HardwareFeature`
- `pricing.prisma` — `PricingCategory`, `PricingItem`
- `event.prisma` — `Event`, `EventCategory`
- `gallery.prisma` — `GalleryAlbum`, `GalleryPhoto`
- `branch.prisma` — `Branch`
- `testimonial.prisma` — `Testimonial`
- `faq.prisma` — `FaqCategory`, `FaqItem`
- `media.prisma` — `Media` (Terhubung ke avatar, cover, poster, background)
- `system.prisma` — `SystemSetting`, `FeatureFlag`
- `seo.prisma` — `SeoMetadata`
- `user.prisma` — `User`
- `booking.prisma` — `Booking`
- `inventory.prisma` — `InventoryItem`

### 4.2 Database Client & Seed
- Singleton instance di `src/lib/prisma.ts`.
- Script seed di `prisma/seed.ts` mengisi data awal untuk theme, system settings, hardware, game, pricing, events, FAQs, dan branch.

---

## 5. Infrastructure & Configuration Audit

- **Environment Variables**: `.env` dan `.env.example` memuat `DATABASE_URL`.
- **Assets**: Public assets tersimpan di `/public/` (`/GameCover/`, `/Logo/`, `/Decoration/`, `/Other/`).
- **Build & Tools**: TypeScript 5, ESLint 9, TailwindCSS v4 with `@tailwindcss/postcss`.

---

## 6. Audit Conclusion

Sistem memiliki struktur backend dan skema database yang sangat lengkap dan siap pakai. Tantangan utama integrasi terletak pada pengikatan data (data binding) dari database Prisma ke komponen frontend landing page untuk menggantikan ketergantungan pada `mock-landing.ts` dan `SiteContext` local storage.
