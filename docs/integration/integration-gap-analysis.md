# Integration Gap Analysis Report

Document Status: **Completed**  
Audit Stage: **Stage A — Integration Gap Analysis**

---

## 1. Executive Summary

Laporan ini menyajikan analisis celah (*gap analysis*) antara kondisi implementasi aplikasi saat ini dengan target kondisi integrasi ideal yang didefinisikan pada `docs/integration.md`.

---

## 2. Comprehensive Gap Analysis Table

| Area | Status | Masalah Saat Ini | Solusi yang Direkomendasikan | Prioritas |
|---|---|---|---|---|
| **Frontend → Backend** | ⚠️ partial | Komponen UI landing page tidak memanggil Server Actions/API Route, melainkan membaca data dari `SiteContext` local storage. | Buat Server Actions untuk setiap section & panggil dari Server Component / Hydration. | **High (P0)** |
| **Backend → Database** | ⚠️ partial | `src/app/api/cms/route.ts` memanggil Prisma secara instan, namun repository di `src/repositories/` masih kosong (`base.repository.ts` saja). | Implementasikan repository konkret (`HeroRepository`, `GameRepository`, `BranchRepository`, dll). | **High (P0)** |
| **Content / Data Persistence** | ❌ incomplete | Feedback pengunjung di `/api/feedback` disimpan di variabel array in-memory (`serverFeedbacks`), hilang saat server restart. | Alihkan penyimpanan feedback ke tabel database Prisma `Testimonial` atau tabel khusus. | **High (P0)** |
| **Media & Asset Management** | ⚠️ partial | Path gambar di hardcode ke `/public/` (misal `/GameCover/Minecraft.jpg`) alih-alih merujuk entitas `Media` di database. | Daftarkan assets ke tabel `Media` dan hubungkan `mediaId` pada model `Game`, `Hero`, `Event`, `Branch`. | **Medium (P1)** |
| **Validation Layer** | ⚠️ partial | Baru ada `BaseValidator` dasar dan sanitasi manual di `/api/feedback`, belum ada validator terstruktur untuk semua DTO data. | Buat kelas validator konkret bertipe generic yang mewarisi `BaseValidator`. | **Medium (P1)** |
| **Security Hardening** | ⚠️ partial | Rate limiter di `/api/feedback` menggunakan `Map` in-memory. Pengabaian proteksi pada `NEXT_PUBLIC_*` belum diaudit ketat. | Gunakan environment validation, pastikan proteksi secret, dan berikan sanitasi input seragam. | **High (P0)** |
| **Performance & RSC** | ⚠️ partial | `LandingPage.tsx` menggunakan `"use client"` di tingkat teratas halaman, meniadakan manfaat React Server Components. | Refactor halaman utama menjadi Server Component yang me-fetch data awal, lalu kirim ke Client Islands. | **High (P0)** |
| **Error Handling & Observability** | ⚠️ partial | Belum ada Error Boundary pada level section, logging masih bergantung pada `console.log`/`logger.ts` sederhana. | Implementasikan Graceful Fallback, Empty States, dan Error Boundary seragam. | **Medium (P1)** |

---

## 3. Core Gap Remediation Plan

1. **Gap 1: Monolithic Client Component (`LandingPage.tsx`)**
   - *Issue*: Seluruh landing page terbungkus `"use client"` sehingga Next.js merender seluruh halaman di browser.
   - *Fix*: Jadikan `src/app/page.tsx` sebagai Async Server Component yang me-fetch data dari Service/Repository, lalu meneruskannya sebagai initial props ke komponen UI.

2. **Gap 2: In-Memory Feedback Storage**
   - *Issue*: `src/app/api/feedback/route.ts` menyimpan feedback di array JS sementara `const serverFeedbacks = []`.
   - *Fix*: Hubungkan POST feedback ke Prisma Database melalui `FeedbackService` dan `TestimonialRepository`.

3. **Gap 3: Missing Concrete Repositories & Services**
   - *Issue*: Folder `src/repositories/` dan `src/services/` hanya berisi file dasar (`base.repository.ts`, `base.service.ts`).
   - *Fix*: Buat repository konkret seperti `HeroRepository`, `GameRepository`, `PricingRepository`, `EventRepository`, `GalleryRepository`, `BranchRepository`, `FaqRepository`, `TestimonialRepository`.
