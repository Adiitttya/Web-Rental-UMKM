# Integration & System Stabilization Planning

## 1. Objective

Tujuan tahap ini adalah mengintegrasikan dan menyelaraskan seluruh sistem yang sudah dibuat:

```text
Landing Page
      ↕
Backend
      ↕
Database
      ↕
Storage / External Services
```

sehingga seluruh komponen memiliki kontrak data yang konsisten dan siap digunakan oleh Admin Dashboard pada tahap berikutnya.

Tahap ini **bukan pembuatan Admin Dashboard**.

Fokus utama:

- audit existing implementation,
- sinkronisasi frontend dengan database,
- melengkapi database apabila benar-benar diperlukan,
- menghubungkan backend dengan frontend,
- memastikan seluruh data dinamis memiliki sumber data yang jelas,
- validasi,
- security,
- performance,
- accessibility,
- error handling,
- observability,
- testing,
- dan production readiness.

---

# 2. Critical Rule

> **Jangan mengasumsikan struktur project.**

Agent harus terlebih dahulu membaca dan memahami repository aktual.

Jangan membuat:

- model database baru tanpa kebutuhan yang teridentifikasi,
- section baru,
- feature baru,
- repository baru,
- service baru,
- API baru,
- folder baru,

hanya berdasarkan asumsi.

Semua perubahan harus berdasarkan:

1. implementasi yang sudah ada,
2. kebutuhan landing page aktual,
3. schema database aktual,
4. backend foundation aktual,
5. assets aktual,
6. dependency aktual,
7. hasil audit.

---

# 3. Phase 0 — Full Repository Audit

Sebelum mengubah kode, lakukan audit menyeluruh.

Periksa:

### Frontend

- seluruh route,
- seluruh page,
- seluruh component,
- seluruh section,
- seluruh interactive feature,
- seluruh mock data,
- seluruh hardcoded content,
- seluruh asset reference.

### Backend

- database client,
- repository,
- service,
- server actions,
- route handlers,
- validators,
- middleware,
- authentication,
- authorization,
- error handling.

### Database

- seluruh schema,
- relations,
- enum,
- index,
- unique constraint,
- nullable field,
- foreign key,
- cascade behavior,
- migration,
- seed.

### Infrastructure

- environment variables,
- storage,
- external API,
- third-party libraries,
- configuration.

### Documentation

Periksa dokumentasi yang sudah tersedia agar tidak membuat implementasi yang bertentangan dengan architecture sebelumnya.

---

# 4. Buat Integration Gap Analysis

Setelah audit, buat dokumen:

```text
docs/integration/
    system-audit.md
    integration-gap-analysis.md
    data-flow.md
    api-contracts.md
    production-readiness.md
```

`integration-gap-analysis.md` harus mengidentifikasi:

| Area               | Status | Masalah | Solusi | Prioritas |
| ------------------ | ------ | ------- | ------ | --------- |
| Frontend → Backend | ...    | ...     | ...    | ...       |
| Backend → Database | ...    | ...     | ...    | ...       |
| Content            | ...    | ...     | ...    | ...       |
| Media              | ...    | ...     | ...    | ...       |
| Validation         | ...    | ...     | ...    | ...       |
| Security           | ...    | ...     | ...    | ...       |
| Performance        | ...    | ...     | ...    | ...       |

Jangan membuat solusi sebelum gap benar-benar ditemukan.

---

# 5. Content/Data Audit

Ini salah satu bagian terpenting.

Agent harus melakukan inventory seluruh informasi yang sekarang digunakan landing page.

Contohnya secara **generik**, bukan berarti model-model ini harus dibuat:

```text
Text
Title
Description
Image
Link
Button
Price
Date
Location
Social Link
Configuration
```

Agent harus mencari seluruh data seperti itu **dari implementasi aktual**.

Untuk setiap data, tentukan:

```text
Static
atau
Dynamic
```

### Static

Data yang memang tidak perlu diubah admin.

### Dynamic

Data yang harus dapat diubah melalui Admin Dashboard nantinya.

---

# 6. Dynamic Content Gap

Untuk setiap konten dinamis, buat mapping:

```text
Landing Page Element
        ↓
Data Source
        ↓
Backend Access
        ↓
Database
        ↓
Future Admin Control
```

Contoh format:

```text
[Actual component name]
        ↓
[Actual data currently used]
        ↓
[Existing service/repository]
        ↓
[Existing database entity]
```

Jika tidak ada database entity yang sesuai:

```text
MISSING
```

**Jangan langsung membuat model baru.**

Masukkan terlebih dahulu ke:

```text
Database Gap Report
```

Baru setelah kebutuhan dianalisis, tentukan apakah memang perlu perubahan schema.

---

# 7. Database Synchronization

Setelah gap analysis selesai, sinkronkan database dengan kebutuhan aktual.

Prinsip:

> Extend existing schema before creating redundant structures.

Jika model yang sudah ada dapat menangani kebutuhan tersebut, **gunakan model yang sudah ada**.

Jangan membuat duplikasi hanya karena frontend memiliki nama section berbeda.

Jika memang diperlukan perubahan:

1. dokumentasikan alasan,
2. tentukan impact,
3. update schema,
4. update migration,
5. update seed bila diperlukan,
6. update repository,
7. update service,
8. update validation,
9. update frontend integration.

---

# 8. Data Contract

Setiap data yang mengalir dari backend ke frontend harus memiliki kontrak yang jelas.

```text
Database
   ↓
Repository
   ↓
Service
   ↓
Server Action / Route Handler
   ↓
Validated Response
   ↓
Frontend
```

Frontend tidak boleh mengetahui detail internal database.

Contohnya frontend tidak boleh bergantung pada:

```text
Prisma Model
Database Column
Internal Database Relation
```

Frontend hanya menerima data contract yang memang dibutuhkan.

---

# 9. Backend Integration

Gunakan backend foundation yang sudah ada.

Jangan membuat pola baru hanya untuk landing page.

Semua akses data harus mengikuti architecture existing.

Pastikan:

```text
UI
 ↓
Action / API
 ↓
Service
 ↓
Repository
 ↓
Database
```

Tidak boleh:

```text
UI
 ↓
Database
```

atau:

```text
Component
 ↓
Prisma
```

---

# 10. Remove Mock Data

Setelah backend integration siap:

```text
Mock Data
```

diganti menjadi:

```text
Database Data
```

Tetapi jangan menghapus mock data sebelum integration selesai.

Gunakan mock data sebagai fallback/testing apabila architecture project memang membutuhkannya.

Setelah production data flow tervalidasi, hapus dependency terhadap mock data yang tidak lagi diperlukan.

---

# 11. Loading State

Setiap data asynchronous harus memiliki state yang jelas:

```text
Loading
Success
Empty
Error
```

Jangan sampai user melihat:

```text
blank screen
```

ketika database sedang loading.

---

# 12. Empty State

Database bisa saja kosong.

Landing page harus tetap stabil.

Misalnya sebuah data collection kosong:

```text
Database
   ↓
[]
   ↓
UI
```

Tidak boleh menyebabkan:

```text
undefined
cannot map
cannot read property
```

Semua collection harus aman terhadap:

- empty array,
- null,
- undefined,
- missing optional data.

---

# 13. Error Handling

Implementasikan error handling secara konsisten.

Tangani:

- Database error
- Network error
- Validation error
- Authentication error
- Authorization error
- External API error
- Storage error
- Unexpected error

Jangan expose internal error kepada user.

Jangan menampilkan:

```text
PrismaClientKnownRequestError...
```

atau stack trace di production.

---

# 14. Security Audit

Sebelum Admin Dashboard dibuat, lakukan security review.

### Input

Pastikan seluruh input tervalidasi.

Gunakan validation layer yang sudah tersedia.

### Database

Pastikan query menggunakan parameterized ORM/query mechanism.

Jangan membuat raw query yang memungkinkan injection kecuali benar-benar diperlukan dan aman.

### Authentication

Periksa:

- session handling,
- cookie,
- expiration,
- logout,
- authentication boundary.

### Authorization

Authentication ≠ authorization.

Pastikan user yang authenticated belum tentu memiliki akses administratif.

### Secrets

Pastikan:

- secret tidak masuk repository,
- `.env` tidak ter-commit,
- API key tidak dikirim ke client,
- service credentials tidak berada di frontend.

### Client Exposure

Audit seluruh:

```text
NEXT_PUBLIC_*
```

Pastikan tidak ada secret yang diberi prefix public.

---

# 15. XSS / Content Security

Karena nantinya admin dapat mengubah konten website, perhatikan data yang berasal dari database.

Jangan render arbitrary HTML tanpa sanitization.

Audit penggunaan:

```text
dangerouslySetInnerHTML
```

Jika memang dibutuhkan rich text:

```text
Input
 ↓
Sanitize
 ↓
Store
 ↓
Render
```

Jangan:

```text
Admin Input
 ↓
Database
 ↓
dangerouslySetInnerHTML
```

tanpa sanitization.

---

# 16. Media Security

Audit sistem image/storage.

Pastikan:

- file type divalidasi,
- MIME type divalidasi,
- file size dibatasi,
- filename tidak dipercaya,
- upload tidak memungkinkan executable file,
- storage permission benar,
- public/private bucket sesuai kebutuhan.

Image yang digunakan publik boleh public.

File administratif atau sensitif harus private.

---

# 17. Environment Security

Pastikan environment variable dipisahkan:

```text
Development
Test
Production
```

dan tidak ada credential hardcoded.

Tambahkan environment validation agar aplikasi gagal secara jelas jika variable wajib tidak tersedia.

---

# 18. Performance Audit

Landing page harus diperiksa menggunakan prinsip Core Web Vitals.

Perhatikan:

- LCP
- CLS
- INP
- TTFB

Fokus terutama pada:

### Images

Gunakan:

```text
next/image
```

sesuai kebutuhan.

Optimalkan:

- dimensions,
- format,
- quality,
- lazy loading,
- priority.

Hero image yang menjadi LCP jangan di-lazy-load secara sembarangan.

---

# 19. JavaScript Optimization

Audit seluruh client component.

Jangan menggunakan:

```text
"use client"
```

pada component yang sebenarnya dapat menjadi Server Component.

Gunakan Client Component hanya ketika membutuhkan:

- state,
- effect,
- browser API,
- interaction,
- animation library tertentu.

Ini penting untuk mengurangi JavaScript yang dikirim ke browser.

---

# 20. Animation Optimization

Karena landing page Anda memiliki beberapa animation/interaction, periksa:

- GPU-friendly animation,
- transform,
- opacity,
- avoiding layout thrashing,
- requestAnimationFrame bila diperlukan,
- cleanup event listener.

Hindari animasi yang terus melakukan:

```text
top
left
width
height
```

jika dapat digantikan dengan:

```text
transform
opacity
```

---

# 21. Responsive Audit

Test minimal:

```text
Mobile
Tablet
Laptop
Desktop
Large Desktop
```

Periksa:

- overflow horizontal,
- text wrapping,
- image scaling,
- card layout,
- navigation,
- modal,
- gallery,
- map,
- animation,
- typography.

Tidak boleh ada:

```text
horizontal scrollbar
```

yang tidak disengaja.

---

# 22. Accessibility Audit

Periksa:

- semantic HTML,
- heading hierarchy,
- alt text,
- keyboard navigation,
- focus state,
- button vs link,
- form labels,
- modal focus,
- accordion accessibility,
- color contrast.

Interactive element tidak boleh hanya dapat digunakan dengan mouse.

---

# 23. SEO Foundation

Pastikan landing page memiliki:

- title,
- meta description,
- canonical,
- Open Graph,
- Twitter/X metadata bila diperlukan,
- favicon,
- robots,
- sitemap,
- semantic headings.

Data SEO yang nantinya editable oleh admin harus memiliki jalur data yang jelas, tetapi **jangan membuat database model baru tanpa audit**.

---

# 24. Caching Strategy

Setelah data flow stabil, tentukan data mana yang:

```text
Static
Cached
Dynamic
Real-time
```

Jangan membuat semua request menjadi dynamic.

Content yang jarang berubah dapat menggunakan caching/revalidation.

Content yang harus real-time harus benar-benar memiliki alasan untuk real-time.

---

# 25. Database Performance

Audit:

- index,
- foreign key,
- query count,
- N+1 query,
- unnecessary relation loading,
- pagination,
- select field.

Jangan mengambil seluruh database jika frontend hanya membutuhkan beberapa field.

Contoh konsep:

```text
Bad:

SELECT *
```

jika hanya membutuhkan:

```text
id
title
image
```

Repository harus mengambil data secukupnya.

---

# 26. N+1 Query Audit

Cari pola seperti:

```text
Get list
 ↓
loop
 ↓
query database
 ↓
query database
 ↓
query database
```

Jika terjadi, ubah menjadi query yang lebih efisien melalui relation/include/select yang tepat.

---

# 27. External Services Audit

Untuk service eksternal apa pun yang digunakan landing page:

- timeout,
- error fallback,
- loading,
- rate limit,
- API key security,
- failure handling.

Website tidak boleh crash hanya karena service eksternal sedang bermasalah.

---

# 28. Testing

Sebelum Admin Dashboard dimulai, lakukan beberapa tingkat testing.

### Type Check

```text
TypeScript
```

harus bersih.

### Lint

Tidak ada error lint.

### Build

Production build harus berhasil.

### Unit Test

Test:

- utility,
- validation,
- service logic,
- transformation.

### Integration Test

Test:

```text
Frontend
 ↓
Backend
 ↓
Database
```

### E2E Test

Test user flow aktual dari browser.

---

# 29. Production Build Test

Jangan hanya menjalankan development:

```text
npm run dev
```

Test juga:

```text
npm run build
npm run start
```

Karena beberapa masalah hanya muncul pada production build.

---

# 30. Observability

Pastikan sistem memiliki cara mengetahui ketika sesuatu gagal.

Minimal:

```text
Application Error
Database Error
Server Error
Client Error
```

memiliki logging yang jelas.

Jangan menggunakan `console.log()` secara sembarangan sebagai sistem monitoring production.

---

# 31. Final Integration Test

Pada akhir phase, lakukan test penuh:

```text
Browser
   ↓
Landing Page
   ↓
Request
   ↓
Backend
   ↓
Repository
   ↓
Database
   ↓
Response
   ↓
UI
```

Test:

- data tersedia,
- data kosong,
- data invalid,
- database error,
- network error,
- image missing,
- external service error,
- mobile,
- desktop.

---

# 32. Definition of Done

Phase ini **belum boleh dianggap selesai** hanya karena website terlihat bagus.

Semua kondisi berikut harus terpenuhi:

### Architecture

- [ ] Frontend menggunakan architecture yang sudah ditetapkan.
- [ ] Backend menggunakan foundation yang sudah dibuat.
- [ ] Tidak ada bypass layer.
- [ ] Tidak ada duplicate architecture.

### Database

- [ ] Semua kebutuhan landing page sudah memiliki data source.
- [ ] Tidak ada redundant model.
- [ ] Tidak ada migration yang tertinggal.
- [ ] Query berjalan dengan benar.
- [ ] Index sudah diperiksa.

### Frontend

- [ ] Mock data tidak menjadi dependency production.
- [ ] Semua dynamic data berhasil ditampilkan.
- [ ] Loading state tersedia.
- [ ] Empty state aman.
- [ ] Error state aman.
- [ ] Tidak ada console error.

### Security

- [ ] Secret tidak terekspos.
- [ ] Input tervalidasi.
- [ ] Authorization boundary benar.
- [ ] Upload tervalidasi.
- [ ] Arbitrary HTML ditangani dengan aman.
- [ ] Error sensitif tidak diekspos.

### Performance

- [ ] Image optimal.
- [ ] Client component hanya digunakan jika diperlukan.
- [ ] Tidak ada unnecessary query.
- [ ] Tidak ada N+1 query.
- [ ] Animation tidak menyebabkan jank.
- [ ] Tidak ada unnecessary JavaScript.

### Responsive

- [ ] Mobile.
- [ ] Tablet.
- [ ] Desktop.
- [ ] Wide screen.
- [ ] Tidak ada unintended horizontal overflow.

### Accessibility

- [ ] Keyboard navigation.
- [ ] Focus state.
- [ ] Alt text.
- [ ] Semantic HTML.
- [ ] Contrast.
- [ ] Interactive element accessible.

### Testing

- [ ] Typecheck passed.
- [ ] Lint passed.
- [ ] Unit test passed.
- [ ] Integration test passed.
- [ ] E2E test passed.
- [ ] Production build passed.

---

# 33. Output yang Harus Dihasilkan Agent

Jangan hanya meminta agent "selesaikan integrasi".

Agent harus menghasilkan laporan:

```text
docs/integration/
├── system-audit.md
├── integration-gap-analysis.md
├── data-flow.md
├── api-contracts.md
├── security-audit.md
├── performance-audit.md
├── accessibility-audit.md
├── testing-report.md
└── production-readiness.md
```

Selain itu, setiap perubahan schema/backend harus dicatat.

---

# 34. Sangat Penting: Jangan Langsung Coding

Saya menyarankan prompt/issue ini memiliki **dua tahap**.

### Stage A — Audit

Agent hanya:

- membaca repository,
- membaca database,
- membaca backend,
- membaca landing page,
- membuat gap analysis,
- membuat rekomendasi.

**Tidak mengubah source code.**

Setelah laporan selesai, Anda review.

### Stage B — Implementation

Baru agent mengerjakan hasil audit secara bertahap.

Misalnya:

```text
Issue #1
Data Integration

↓

Issue #2
Error Handling

↓

Issue #3
Security Hardening

↓

Issue #4
Performance Optimization

↓

Issue #5
Accessibility

↓

Issue #6
Testing

↓

Issue #7
Production Readiness
```

Ini sangat cocok dengan workflow GitHub + AI Agent yang Anda rencanakan sebelumnya.

---

## Existing Local / Hardcoded Data Migration

The current landing page already contains data stored locally inside
existing source files, constants, mock-data files, or component-level
objects/arrays.

Examples may include, but are not limited to:

- comments/testimonials
- game lists
- hardware data
- pricing data
- event data
- gallery data
- FAQ data
- navigation data
- social links
- contact information
- other content currently rendered by the landing page.

IMPORTANT:

Do NOT assume that these existing data structures are incorrect.

Do NOT immediately delete, replace, rename, or rewrite them.

First perform a complete audit of all existing local/static/mock data.

For every existing dataset, determine:

1. Where the data is currently defined.
2. Which component consumes it.
3. What fields it contains.
4. Which fields are displayed.
5. Which fields are interactive.
6. Whether the data already has an equivalent representation in the existing database.
7. Whether the database representation is sufficient for the current UI.
8. Whether additional database fields or relationships are actually required.
9. Whether the data should remain static or become CMS-managed.
10. Whether any transformation is required between database data and UI data.

Create a data migration/mapping document before modifying the implementation.

Recommended documentation:

docs/integration/
existing-data-audit.md
data-migration-map.md
data-source-map.md

Each dataset should be documented using a structure similar to:

Existing Source
↓
Current Data Shape
↓
Current Consumer
↓
Database Equivalent
↓
Backend Access Layer
↓
Final UI Data Shape

Do not create new database models simply because an existing local
data object has a different name or structure.

Prefer reusing existing database models and relationships whenever
they can correctly represent the required data.

Only modify the database schema when the existing schema genuinely
cannot represent the current product requirements.

If schema changes are required:

1. document the reason,
2. identify the affected relationships,
3. update the schema,
4. create the required migration,
5. update repositories,
6. update services,
7. update validation,
8. update the frontend integration,
9. update tests.

The existing local data must be treated as a migration source/reference
during this phase.

Do not lose any existing information during migration.

Before removing any local/mock dataset, verify that:

- equivalent database data exists,
- backend access works,
- the frontend can retrieve the data,
- the UI produces the same expected result,
- loading/empty/error states work,
- tests pass.

Only after successful verification should the old local/mock data be
removed or converted into test fixtures where appropriate.

Do not use local mock data as a production fallback unless explicitly
required by the architecture.

The final production data flow should be:

Database
↓
Repository
↓
Service
↓
Server Action / API
↓
Validated Data Contract
↓
Landing Page Component

The UI component must not directly import production content from
mock-data files once the corresponding data has been migrated.

However, reusable mock/fixture data may remain separately under an
appropriate test/fixture location if it is required for automated
testing.

The goal is to migrate existing content safely rather than blindly
replace it.
