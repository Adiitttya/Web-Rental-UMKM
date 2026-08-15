# Security Audit Report

Document Status: **Completed**  
Audit Stage: **Stage A — Security Audit & Vulnerability Assessment**

---

## 1. Executive Summary

Laporan ini mengevaluasi tingkat keamanan repository **Web-Rental-UMKM (DsterGame Studio)**, mencakup proteksi input, autentikasi, rahasia lingkungan (environment secrets), sanitasi konten XSS, proteksi media asset, dan konfigurasi header HTTP.

---

## 2. Detailed Security Findings & Risk Assessment

### 2.1 Environment & Secret Exposure Audit
- **Findings**:
  - `NEXT_PUBLIC_*` belum digunakan secara berlebihan, namun perlu dipastikan tidak ada kunci API privat (misal Prisma connection string, JWT Secret, Admin Service Key) yang diberi prefix `NEXT_PUBLIC_`.
  - File `.env` berada dalam `.gitignore` (Lolos).

### 2.2 Input Validation & SQL Injection
- **Findings**:
  - Database diakses via Prisma ORM yang secara bawaan menggunakan parameterized queries (Mencegah SQL Injection).
  - Pada `src/app/api/feedback/route.ts`, input `name` dan `comment` sudah disanitasi dengan helper `sanitizeText()`.
  - *Gap*: Diperlukan skema validasi Zod atau `BaseValidator` yang terdistribusi seragam di seluruh Server Actions pada Stage B-2.

### 2.3 XSS (Cross-Site Scripting) & Content Sanitization
- **Findings**:
  - Tidak ditemukan penggunaan `dangerouslySetInnerHTML` yang tidak terlindungi pada seluruh file `.tsx`.
  - Di `LandingPage.tsx`, terdapat event listener untuk mencegah klik-kanan & drag-and-drop pada media gambar (`handleContextMenu` & `handleDragStart`).

### 2.4 Security Headers & Rate Limiting
- **Findings**:
  - Route handler `/api/cms` dan `/api/feedback` sudah menyertakan header keamanan: `X-Content-Type-Options: nosniff`, `X-Frame-Options: DENY`, `X-XSS-Protection: 1; mode=block`.
  - Rate limiting pada `/api/feedback` saat ini masih menggunakan `Map` di dalam memori Node.js instance (10 req/min).

---

## 3. Action Items untuk Stage B-2 (Security Hardening)

1. Menambahkan middleware Next.js untuk pengujian Security Headers secara global pada seluruh route HTTP.
2. Memastikan seluruh error internal (seperti `PrismaClientKnownRequestError`) disaring sebelum sampai ke client untuk mencegah *Information Disclosure*.
3. Menyediakan validasi ukuran dan tipe MIME untuk upload media di masa mendatang.
