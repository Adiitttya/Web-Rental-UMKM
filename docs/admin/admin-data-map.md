# Admin Data Map — DsterGame Studio CMS

Pemetaan asal-usul data yang ditampilkan pada Public Landing Page beserta skema Prisma terkait.

## 1. Public Landing Page Section vs Prisma Data Model

| Landing Page Section | Source Database Models | Primary Fields Used |
| :--- | :--- | :--- |
| **Hero Section** | `Hero`, `CmsSection` | `title`, `subtitle`, `ctaText`, `ctaLink` |
| **Katalog Game (Hardware)** | `Hardware`, `HardwareCategory`, `Game` | `name`, `slug`, `description`, `games.title`, `isAvailable` |
| **Pricelist (4 Tabs)** | `PricingCategory`, `PricingItem` | `name`, `slug`, `price`, `duration`, `features`, `terms` |
| **Event & Turnamen** | `Event` | `title`, `subtitle`, `description`, `eventDate`, `locationText`, `isFeatured` |
| **Galeri Suasana** | `GalleryPhoto`, `GalleryAlbum`, `Media` | `caption`, `media.url`, `media.altText`, `displayOrder` |
| **Lokasi Cabang** | `Branch` | `name`, `address`, `latitude`, `longitude`, `phone`, `mapUrl` |
| **Testimonial** | `Testimonial` | `reviewerName`, `reviewerRole`, `content`, `rating` |
| **FAQ** | `FaqItem` | `question`, `answer`, `displayOrder` |
| **System Info & Footer** | `SystemSetting` | `site_name`, `contact_phone`, `contact_whatsapp`, `contact_instagram`, `footer_text` |
