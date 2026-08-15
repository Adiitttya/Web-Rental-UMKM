# Data Flow Architecture & Protocol Report

Document Status: **Completed**  
Audit Stage: **Stage A — Architecture & Protocol Definition**

---

## 1. Executive Summary

Dokumen ini mendefinisikan arsitektur aliran data (*Data Flow Architecture*) target untuk mengintegrasikan frontend landing page dengan backend foundation dan database Prisma.

---

## 2. Comparison of Architectures

### 2.1 Existing Architecture (Pre-Integration)
```text
Browser User
    ↓
LandingPage.tsx ('use client')
    ↓
useSiteData() Hook (SiteContext.tsx)
    ↓
localStorage ('dstergame_site_data_v1') OR mock-landing.ts
```
*Kelemahan*: Data bersifat statis/lokal di browser user, perubahan tidak tersimpan di server/database, dan tidak siap untuk Admin Dashboard.

---

### 2.2 Target Integrated Production Architecture
```text
Next.js Server Component (src/app/page.tsx)
    ↓
Server Actions / API Route Handlers (src/actions/)
    ↓
Service Layer (src/services/)
    ↓
Repository Layer (src/repositories/)
    ↓
Prisma Client ORM (src/lib/prisma.ts)
    ↓
PostgreSQL Database
    ↓ (Validated Response / DTO)
React UI Section Components (Client Islands)
```

---

## 3. Detailed Data Protocol Rules

1. **Strict Layering Protocol**:
   - UI tidak boleh langsung memanggil Prisma (`prisma.game.findMany()`).
   - Server Action harus memanggil Service.
   - Service harus memanggil Repository.
   - Repository mengeksekusi Prisma Client.
2. **Immutability & Data Contracts**:
   - DTO yang dikirim ke UI tidak boleh mengekspos detail internal Prisma (seperti `deletedAt`, `uploadedById`, atau kredensial DB).
3. **Fallback & Error Boundary Protocol**:
   - Apabila database tidak merespons atau kosong, backend mengembalikan array kosong `[]` atau default contract yang aman tanpa memicu runtime error (`cannot read property of undefined`).
