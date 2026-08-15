# Admin Dashboard Functional Prototype — Planning

## 1. Objective

Membangun versi awal Admin Dashboard yang bersifat **functional prototype** untuk melakukan testing, debugging, dan validasi seluruh sistem CMS.

Dashboard ini harus terintegrasi dengan:

```text
Admin Dashboard
       ↓
Existing Backend Foundation
       ↓
Existing Database
       ↓
Existing Landing Page
```

Dashboard pada tahap ini **tidak ditujukan sebagai final UI/UX**.

Prioritas:

1. Functional correctness
2. Database integration
3. Backend integration
4. Authentication
5. Authorization
6. Validation
7. Error handling
8. Data synchronization
9. Testing
10. Debugging

Visual design hanya dibuat secukupnya agar seluruh functionality dapat digunakan dengan nyaman.

---

# 2. Critical Constraints

### Jangan mengasumsikan database

Agent **WAJIB membaca database/schema yang sudah ada**.

Jangan membuat entity/model baru hanya karena membutuhkan halaman admin.

Jangan mengganti nama model database tanpa alasan yang kuat.

Jangan membuat duplicate model.

---

### Jangan mengasumsikan fitur

Agent harus melakukan audit terhadap:

- database,
- backend,
- landing page,
- existing data,
- integration layer,

kemudian menentukan apa saja yang perlu dikelola oleh Admin Dashboard.

Jangan mengarang fitur CMS yang belum memiliki dasar pada project.

---

### Jangan membuat final design

Dashboard prototype tidak perlu:

- visual branding final,
- animasi kompleks,
- custom illustration,
- dashboard chart yang dekoratif,
- responsive perfection,
- micro-interaction,
- advanced visual effects.

Design final akan dibuat setelah seluruh functionality selesai dan tervalidasi.

---

# 3. Phase 0 — Existing System Audit

Sebelum coding, agent harus membaca repository.

Audit:

```text
Database
Backend
Landing Page
Integration Layer
Authentication
Authorization
Validation
Existing UI Library
Existing Routes
Existing Data
```

Cari seluruh data yang:

- ditampilkan landing page,
- berasal dari database,
- dapat berubah,
- membutuhkan CRUD,
- memiliki relationship,
- memiliki media,
- memiliki configuration,
- atau membutuhkan administrative control.

---

# 4. Create Admin Capability Map

Setelah audit, buat dokumentasi:

```text
docs/admin/
├── admin-capability-map.md
├── admin-data-map.md
├── admin-permission-map.md
└── admin-test-plan.md
```

`admin-capability-map.md` harus menjelaskan:

```text
Database Entity
        ↓
Used By
        ↓
Admin Operation
        ↓
Backend Service
        ↓
Landing Page Effect
```

Contoh generik:

```text
Existing Data Entity
├── Read
├── Create
├── Update
├── Delete
└── Reorder

        ↓

Existing Backend

        ↓

Landing Page
```

**Nama entity harus diambil dari project aktual.**

---

# 5. Admin Route Foundation

Buat area admin yang terisolasi dari public landing page.

Contoh struktur konseptual:

```text
/admin
    ├── dashboard
    ├── ...
```

Namun **jangan memaksakan struktur folder atau routing tertentu** jika project Anda sudah memiliki convention.

Agent harus mengikuti architecture existing.

Admin area harus memiliki:

- authentication boundary,
- authorization boundary,
- layout dasar,
- navigation minimal,
- logout,
- protected routes.

---

# 6. Authentication

Admin Dashboard hanya dapat diakses oleh user yang authenticated.

Test:

```text
Guest
 ↓
/admin
 ↓
BLOCKED
```

Authenticated user:

```text
User
 ↓
/admin
 ↓
Allowed
```

Session harus menggunakan mekanisme authentication yang sudah ada.

Jangan membuat authentication system kedua.

---

# 7. Authorization

Authentication saja tidak cukup.

Pastikan authorization dilakukan di **server-side boundary**.

Test minimal:

```text
Authenticated User
        ↓
Admin Resource
        ↓
Authorization Check
        ↓
Allowed / Denied
```

Jangan hanya menyembunyikan menu.

Contoh yang salah:

```text
if (!admin) {
   hideEditButton();
}
```

tetapi API/server action masih dapat dipanggil.

Authorization harus tetap dilakukan ketika request mencapai server.

---

# 8. Prototype Dashboard Layout

Buat layout sederhana:

```text
┌───────────────────────────────────────┐
│ Admin Header                          │
├────────────┬──────────────────────────┤
│ Navigation │                          │
│            │       Content             │
│ Dashboard  │                          │
│ Content    │                          │
│ ...        │                          │
│            │                          │
└────────────┴──────────────────────────┘
```

Gunakan UI Library yang sudah dibuat.

Tidak perlu membuat design system baru.

---

# 9. Dashboard Overview

Dashboard overview hanya perlu menyediakan informasi minimum yang membantu debugging.

Contohnya:

- authentication status,
- database connection status jika relevan,
- basic system status,
- jumlah data yang relevan,
- recent administrative activity jika sudah tersedia.

Jangan membuat analytics dashboard final pada tahap ini.

---

# 10. CRUD Prototype

Ini adalah bagian terpenting.

Agent harus memilih **satu entity/data domain aktual yang paling sederhana** sebagai pilot implementation.

Jangan menentukan entity dari planning ini.

Gunakan hasil:

```text
admin-capability-map.md
```

Kemudian implementasikan:

```text
LIST
 ↓
DETAIL
 ↓
CREATE
 ↓
UPDATE
 ↓
DELETE
```

**hanya jika operation tersebut memang valid untuk entity tersebut.**

---

# 11. READ

Admin dapat melihat data yang tersimpan di database.

Flow:

```text
Admin UI
 ↓
Server Action / API
 ↓
Service
 ↓
Repository
 ↓
Database
```

Jangan:

```text
Admin UI
 ↓
Database
```

---

# 12. CREATE

Jika entity mendukung creation:

```text
Admin Form
 ↓
Client Validation
 ↓
Server Validation
 ↓
Authorization
 ↓
Service
 ↓
Repository
 ↓
Database
```

Setelah berhasil:

```text
Database
 ↓
Revalidation
 ↓
Landing Page
```

---

# 13. UPDATE

Admin dapat mengubah data existing.

Test:

```text
Existing Data
 ↓
Admin Edit
 ↓
Validation
 ↓
Database Update
 ↓
Landing Page Updated
```

Pastikan perubahan tetap ada setelah refresh.

---

# 14. DELETE

Implementasikan hanya jika sesuai dengan architecture database.

Test:

```text
Admin
 ↓
Delete
 ↓
Confirmation
 ↓
Authorization
 ↓
Database
```

Pastikan behavior deletion sesuai dengan schema yang sudah ada.

**Jangan mengubah strategi deletion database hanya untuk prototype.**

---

# 15. Validation

Gunakan validation layer existing.

Validasi harus dilakukan pada:

### Client

Untuk UX.

### Server

Untuk security dan data integrity.

Client validation **tidak boleh dianggap sebagai security mechanism**.

Test:

```text
Invalid Input
 ↓
Rejected
 ↓
Database tidak berubah
```

---

# 16. Error Handling

Prototype harus menguji semua kondisi utama:

```text
Success
Loading
Empty
Validation Error
Unauthorized
Forbidden
Not Found
Database Error
Unexpected Error
```

Jangan menampilkan internal stack trace kepada user.

---

# 17. Data Synchronization Test

Ini merupakan tujuan utama prototype.

Test:

```text
Admin Dashboard
      ↓
Update Data
      ↓
Backend
      ↓
Database
      ↓
Cache / Revalidation
      ↓
Landing Page
```

Kemudian:

1. Update dari admin.
2. Pastikan database berubah.
3. Refresh admin.
4. Pastikan data tetap berubah.
5. Buka landing page.
6. Pastikan data terbaru muncul.
7. Refresh landing page.
8. Pastikan data tetap konsisten.

---

# 18. Cache & Revalidation

Periksa apakah framework melakukan caching pada data landing page.

Setiap mutation harus memiliki strategi revalidation yang benar.

Test:

```text
Update
 ↓
Database
 ↓
Invalidate / Revalidate
 ↓
Landing
```

Tidak boleh terjadi:

```text
Database = New Data
Landing = Old Data
```

tanpa alasan yang disengaja.

---

# 19. Relationship Testing

Jika entity memiliki relationship:

```text
Entity A
 ↓
Entity B
 ↓
Entity C
```

test:

- create relation,
- update relation,
- remove relation,
- invalid relation,
- deleted referenced data,
- orphaned records.

Agent harus mengikuti relationship aktual yang ditemukan pada schema.

---

# 20. Media Testing

Jika salah satu data membutuhkan image/file:

Test:

```text
Upload
 ↓
Validation
 ↓
Storage
 ↓
Database Reference
 ↓
Landing Page
```

Test juga:

- invalid file type,
- excessive file size,
- missing file,
- replacement,
- deletion,
- failed upload.

Jangan membuat upload mechanism baru jika existing media infrastructure sudah tersedia.

---

# 21. Security Testing

Minimal test:

### Authentication

```text
Guest → Admin
```

harus ditolak.

### Authorization

User tanpa permission → operation harus ditolak.

### Direct Request

Coba akses server action/API secara langsung tanpa authorization.

Harus ditolak.

### Input Manipulation

Coba input:

- malformed data,
- unexpected fields,
- invalid IDs,
- excessive values.

Server harus melakukan validation.

---

# 22. Database Integrity Testing

Pastikan Admin Dashboard tidak dapat menghasilkan:

- orphaned record,
- invalid relation,
- duplicate unique data,
- invalid enum,
- invalid required field,
- inconsistent state.

Database constraint tetap menjadi lapisan terakhir perlindungan.

---

# 23. UI Prototype Rules

Prototype boleh terlihat sederhana.

Tetapi harus memiliki:

```text
Button
Input
Form
Table/List
Modal
Toast
Loading
Error
Empty State
```

Gunakan UI Library yang sudah tersedia.

Jangan membuat ulang komponen tersebut hanya karena dashboard masih prototype.

---

# 24. Responsive Minimum

Walaupun bukan final design, prototype tetap harus usable pada:

- Desktop
- Laptop
- Tablet

Mobile dapat dibuat sebagai minimum functional support jika dashboard memang terutama digunakan desktop.

Jangan menghabiskan waktu untuk pixel-perfect responsive design pada tahap ini.

---

# 25. Testing Strategy

Untuk setiap CRUD prototype:

### Test 1 — Read

```text
Database
 ↓
Admin
```

### Test 2 — Create

```text
Admin
 ↓
Database
```

### Test 3 — Update

```text
Admin
 ↓
Database
 ↓
Landing
```

### Test 4 — Delete

```text
Admin
 ↓
Database
 ↓
Landing
```

### Test 5 — Invalid Input

```text
Admin
 ↓
Rejected
```

### Test 6 — Unauthorized

```text
Unauthorized
 ↓
Rejected
```

### Test 7 — Refresh

```text
Mutation
 ↓
Refresh
 ↓
Data persists
```

---

# 26. Do Not Implement Everything at Once

Setelah pilot CRUD berhasil, baru lanjutkan domain berikutnya berdasarkan hasil audit.

Gunakan pola:

```text
Pilot CRUD
   ↓
Test
   ↓
Fix Architecture
   ↓
Second CRUD
   ↓
Test
   ↓
Third CRUD
   ↓
...
```

Jangan membuat 20 halaman admin sekaligus lalu testing di akhir.

---

# 27. GitHub Issue Strategy

Saya sangat menyarankan memecahnya menjadi beberapa issue.

### Issue 1 — Admin Audit

Audit database, backend, landing page, dan tentukan capability map.

### Issue 2 — Admin Authentication

Protected admin route + session.

### Issue 3 — Admin Authorization

Permission enforcement.

### Issue 4 — Admin Prototype Shell

Layout + navigation sederhana.

### Issue 5 — First CRUD Vertical Slice

Pilih entity aktual yang paling sesuai berdasarkan audit.

### Issue 6 — CRUD Security & Validation

Validation + authorization + error handling.

### Issue 7 — Landing Synchronization

Pastikan mutation admin → database → landing page.

### Issue 8 — Additional CRUD Modules

Implementasikan domain berikutnya satu per satu.

### Issue 9 — Integration Testing

End-to-end testing seluruh admin → database → landing flow.

---

# 28. Definition of Done

Admin Functional Prototype belum dianggap selesai hanya karena halaman admin dapat dibuka.

Minimal:

- [ ] Admin route protected.
- [ ] Authentication bekerja.
- [ ] Authorization bekerja.
- [ ] Existing backend digunakan.
- [ ] Existing database digunakan.
- [ ] Tidak ada duplicate database model tanpa alasan.
- [ ] CRUD pilot berhasil.
- [ ] Server-side validation bekerja.
- [ ] Error handling bekerja.
- [ ] Loading state bekerja.
- [ ] Empty state bekerja.
- [ ] Database mutation berhasil.
- [ ] Data persistence berhasil.
- [ ] Landing page menerima perubahan.
- [ ] Cache/revalidation benar.
- [ ] Relationship tidak rusak.
- [ ] Media handling aman jika diperlukan.
- [ ] Tidak ada secret exposed.
- [ ] Unauthorized request ditolak.
- [ ] Typecheck berhasil.
- [ ] Lint berhasil.
- [ ] Build berhasil.
- [ ] Integration/E2E test berhasil.

---

# 29. Output yang Wajib Dibuat Agent

Setelah pekerjaan selesai, agent harus menghasilkan:

```text
docs/admin/
├── admin-capability-map.md
├── admin-data-map.md
├── admin-permission-map.md
├── admin-test-plan.md
└── admin-prototype-test-report.md
```

`admin-prototype-test-report.md` harus mencatat:

```text
Test
Expected Result
Actual Result
Status
Notes
```

Contoh:

```text
Update Data
Expected: Database updated
Actual: Database updated
Status: PASS

Landing Synchronization
Expected: New value displayed
Actual: New value displayed
Status: PASS

Unauthorized Update
Expected: Request rejected
Actual: Request rejected
Status: PASS
```

---
