# Admin Capability Map — DsterGame Studio CMS

Dokumentasi pemetaan seluruh entity database ke operasi Admin Dashboard, Service/Repository layer, dan dampaknya pada Public Landing Page.

| Entity (Database Model) | Admin Operations (CRUD) | Backend Layer (Service / Repo) | Impact on Public Landing Page |
| :--- | :--- | :--- | :--- |
| `FaqItem` | READ, CREATE, UPDATE, DELETE, REORDER | `faq.repository.ts` | Langsung mengubah pertanyaan & jawaban di section FAQ landing page |
| `Branch` | READ, CREATE, UPDATE, DELETE | `branch.repository.ts` | Mengubah alamat, kontak, koordinat lat/lng, dan embed Google Maps di section Lokasi Cabang |
| `PricingItem` / `PricingCategory` | READ, CREATE, UPDATE, DELETE | `pricing.repository.ts` | Mengubah harga, durasi, paket, dan fitur di section Pricelist (4 Tab) |
| `Event` | READ, CREATE, UPDATE, DELETE | `event.repository.ts` | Mengubah judul turnamen, tanggal, lokasi, poster, dan deskripsi di section Event |
| `GalleryPhoto` / `GalleryAlbum` | READ, CREATE, UPDATE, DELETE | `gallery.repository.ts` | Mengubah foto fasilitas, caption, dan susunan galeri di section Galeri Suasana |
| `Hardware` / `HardwareCategory` | READ, CREATE, UPDATE, DELETE | `game.repository.ts` | Mengubah konsol game, simulator balap, dan game list di section Katalog Game |
| `Testimonial` | READ, CREATE, UPDATE, DELETE | `testimonial.repository.ts` | Mengubah ulasan pelanggan, nama, rating, dan foto di section Testimonial |
| `SystemSetting` | READ, UPDATE | `system-setting.repository.ts` | Mengubah nomor WhatsApp, Telepon, Instagram, Email, Alamat, dan Footer Text |
| `Hero` | READ, UPDATE | `hero.repository.ts` | Mengubah judul utama, tagline, dan tombol CTA pada Hero Banner utama |
| `User` / `Session` | READ, CREATE (Admin User), DELETE Session | `prisma.user`, `prisma.session` | Digunakan untuk autentikasi & otorisasi masuk ke Admin Dashboard |
