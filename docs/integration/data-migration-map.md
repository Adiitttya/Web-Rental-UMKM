# Data Migration & Mapping Strategy Report

Document Status: **Completed**  
Audit Stage: **Stage A — Database Mapping Strategy**

---

## 1. Executive Summary

Laporan ini memetakan transformasi dari struktur data lokal/mock (`src/data/mock-landing.ts`) ke entitas database Prisma aktual (`prisma/schema/modules/`). 

Prinsip utama: **Menggunakan kembali entitas Prisma yang sudah ada** tanpa membuat skema/tabel baru secara gegabah.

---

## 2. Mock Data to Prisma Schema Mapping Matrix

| Existing Dataset | Target Prisma Model(s) | Key Transformation & Relations | Schema Status |
|---|---|---|---|
| `mockHero` | `Hero` + `HeroDecoration` + `Media` | `bgMediaId`, `logoMediaId`, `decorations` via relation `HeroDecorationMedia` | **Match (Siap)** |
| `mockListGameList` | `HardwareCategory` + `Hardware` + `Game` + `Media` | `Hardware.categoryId` → `HardwareCategory`, `Game.hardwareId` → `Hardware` | **Match (Siap)** |
| `mockPricingTabs` | `PricingCategory` + `PricingItem` | `PricingItem.categoryId` → `PricingCategory`. Attribute JSON/Text untuk rates & features | **Match (Siap)** |
| `mockEvents` | `Event` + `EventCategory` + `Media` | `Event.posterMediaId` → `Media`, `Event.status` → `EventStatus` enum | **Match (Siap)** |
| `mockGalleryPhotos` | `GalleryPhoto` + `GalleryAlbum` + `Media` | `GalleryPhoto.mediaId` → `Media`, `GalleryPhoto.albumId` → `GalleryAlbum` | **Match (Siap)** |
| `mockBranchLocations` | `Branch` + `Media` | Field `address`, `latitude`, `longitude`, `mapUrl`, `phone`, `whatsapp` | **Match (Siap)** |
| `mockTestimonials` | `Testimonial` + `Media` | `reviewerName`, `reviewerRole`, `content`, `rating`, `avatarMediaId` → `Media` | **Match (Siap)** |
| `mockFaqs` | `FaqItem` + `FaqCategory` | `FaqItem.categoryId` → `FaqCategory`, `question`, `answer` | **Match (Siap)** |
| `DEFAULT_SECTIONS` | `SystemSetting` / `CmsSection` | Group `sections` key/value `section_hero_title`, `section_hero_subtitle` | **Match (Siap)** |
| `DEFAULT_CONTACT` | `SystemSetting` | Group `contact` key/value `contact_phone`, `contact_whatsapp`, `contact_instagram` | **Match (Siap)** |
| Feedback Submit | `Testimonial` / In-memory Store | Migrasi dari in-memory server array ke tabel Prisma `Testimonial` | **Adjustment Needed** |

---

## 3. Detailed Entity Transformation Flows

### Flow 1: Hero Section
```text
mockHero Data Object
        ↓
Prisma Model: Hero (id, title, subtitle, ctaText, ctaLink)
        ├─ Relation: HeroDecoration (heroId, mediaId, positionX, positionY, zIndex, animationType)
        └─ Relation: Media (bgMedia, logoMedia)
```

### Flow 2: List Game Section
```text
mockListGameList Array
        ↓
Prisma Model: HardwareCategory (id, name, slug)
        ↓
Prisma Model: Hardware (id, name, slug, categoryId)
        ↓
Prisma Model: Game (id, title, slug, hardwareId, genre, isPopular, coverMediaId)
```

### Flow 3: Pricing Section
```text
mockPricingTabs Array
        ↓
Prisma Model: PricingCategory (id, name, slug, displayOrder)
        ↓
Prisma Model: PricingItem (id, categoryId, name, price, duration, features, isHighlighted)
```

### Flow 4: Branch Location
```text
mockBranchLocations Array
        ↓
Prisma Model: Branch (id, name, slug, address, latitude, longitude, phone, whatsapp, mapUrl, operationalHours, coverMediaId)
```

---

## 4. Migration Plan Execution (Stage B-1 Target)

1. **Populasi Database Seed (`prisma/seed.ts`)**:
   - Memastikan seluruh isi dataset dari `mock-landing.ts` ter-insert secara utuh ke database saat `npm run db:seed` dijalankan.
2. **Transformasi Media Asset**:
   - Mendaftarkan file gambar lokal (`/GameCover/`, `/Logo/`, `/Decoration/`) ke dalam tabel Prisma `Media`.
3. **PemberSIHAN Ketergantungan Client**:
   - Mengganti sumber data `SiteContext` dari `localStorage`/`mock-landing.ts` ke Server Actions & API Handler yang membaca Prisma DB.
