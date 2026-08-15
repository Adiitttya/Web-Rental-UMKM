# Component Data Source & Data Binding Map

Document Status: **Completed**  
Audit Stage: **Stage A — Data Source Mapping**

---

## 1. Executive Summary

Dokumen ini memetakan seluruh komponen landing page terhadap sumber data (Data Source), akses backend (Action/Repository/Service), entitas Prisma database, dan kontrol admin yang direncanakan di masa depan.

---

## 2. Component Data Source Matrix

| UI Component | Current Data Source | Proposed Backend Layer | Prisma Database Model | Status Linkage |
|---|---|---|---|---|
| `NavbarSection.tsx` | `SiteContext` / `DEFAULT_NAVBAR` | `getCmsSettingsAction()` / `SystemSettingService` | `SystemSetting` | ⚠️ MISSING Backend Link |
| `HeroSection.tsx` | `SiteContext` / `mockHero` | `getHeroSectionAction()` / `HeroRepository` | `Hero`, `HeroDecoration`, `Media` | ⚠️ MISSING Backend Link |
| `ListGameSection.tsx` | `SiteContext` / `mockListGameList` | `getGameCatalogAction()` / `GameRepository` | `HardwareCategory`, `Hardware`, `Game`, `Media` | ⚠️ MISSING Backend Link |
| `PricingSection.tsx` | `SiteContext` / `mockPricingTabs` | `getPricingCatalogAction()` / `PricingRepository` | `PricingCategory`, `PricingItem` | ⚠️ MISSING Backend Link |
| `EventSection.tsx` | `SiteContext` / `mockEvents` | `getEventsAction()` / `EventRepository` | `Event`, `EventCategory`, `Media` | ⚠️ MISSING Backend Link |
| `GallerySection.tsx` | `SiteContext` / `mockGalleryPhotos` | `getGalleryPhotosAction()` / `GalleryRepository` | `GalleryPhoto`, `GalleryAlbum`, `Media` | ⚠️ MISSING Backend Link |
| `LocationSection.tsx` | `SiteContext` / `mockBranchLocations` | `getBranchesAction()` / `BranchRepository` | `Branch`, `Media` | ⚠️ MISSING Backend Link |
| `TestimonialSection.tsx` | `SiteContext` / `mockTestimonials` | `getTestimonialsAction()` / `TestimonialRepository` | `Testimonial`, `Media` | ⚠️ MISSING Backend Link |
| `FAQSection.tsx` | `SiteContext` / `mockFaqs` | `getFaqsAction()` / `FaqRepository` | `FaqCategory`, `FaqItem` | ⚠️ MISSING Backend Link |
| `FeedbackSection.tsx` | `POST /api/feedback` (In-memory) | `submitFeedbackAction()` / `TestimonialRepository` | `Testimonial` / `Feedback` | ⚠️ IN-MEMORY Fallback Only |
| `ContactSection.tsx` | `SiteContext` / `DEFAULT_CONTACT` | `getContactInfoAction()` / `SystemSettingRepository` | `SystemSetting`, `Branch` | ⚠️ MISSING Backend Link |
| `FooterSection.tsx` | `SiteContext` / `DEFAULT_CONTACT` | `getFooterConfigAction()` / `SystemSettingRepository` | `SystemSetting` | ⚠️ MISSING Backend Link |

---

## 3. Layered Data Flow Specification

Guna memenuhi instruksi arsitektur tanpa bypass layer:

```text
UI Landing Component
        ↓
Server Action (e.g. getHeroDataAction)
        ↓
Service (e.g. HeroService)
        ↓
Repository (e.g. HeroRepository)
        ↓
Prisma Client ORM (prisma.hero.findFirst)
        ↓
PostgreSQL Database
```

Semua komponen harus mengakses data melalui pola ini. Komponen UI **dilarang keras** melakukan query Prisma secara langsung (`PrismaClient` di dalam component file).
