Bisa. Untuk kasusmu, saya sarankan **jangan memperlakukan admin panel sebagai kumpulan halaman CRUD yang terpisah**, tetapi sebagai **CMS/Management System** yang punya struktur informasi jelas.

Yang paling penting dari rancangan baru ini adalah menyelesaikan masalah yang kamu sebutkan: **satu aset/logo jangan di-upload berkali-kali hanya karena digunakan di tempat berbeda**. Admin harus mengelola aset secara terpusat, lalu berbagai section cukup memilih/referensi aset tersebut.

Berikut planning yang bisa langsung kamu berikan ke AI Agent.

---

# Admin Panel Redesign Plan — DsterGame

## 1. Tujuan Utama

Rombak total admin dashboard menjadi **Centralized Content Management & Administration Panel** yang:

- Mengelola seluruh konten public website.
- Mengelola asset/media secara terpusat.
- Mengelola admin dan authentication.
- Menyediakan dashboard statistik.
- Menyediakan audit log dan login log.
- Memiliki struktur navigasi yang konsisten.
- Menggunakan design system yang sudah ada di landing page.
- Tidak membuat ulang warna, typography, spacing, radius, button, card, dll secara hardcode.
- Menggunakan existing components, CSS variables, Tailwind utilities, dan design tokens dari project.
- Menghindari file component yang terlalu besar.
- Tidak menghapus fitur backend yang sudah berjalan hanya karena UI admin dirombak.
- Memisahkan **Content Management**, **Media Management**, dan **System Administration**.

---

# 2. Konsep Struktur Admin

Gunakan struktur besar:

```text
ADMIN PANEL
│
├── Dashboard
│
├── Content
│   ├── Home
│   ├── Game Catalog
│   ├── Pricing
│   ├── Events
│   ├── Gallery
│   ├── Locations
│   ├── FAQ
│   ├── Testimonials
│   ├── Feedback
│   └── Contact
│
├── Media
│   ├── Media Library
│   ├── Logo & Branding
│   └── Upload / Asset Management
│
├── Website
│   ├── Navigation
│   ├── SEO
│   ├── General Settings
│   └── Footer
│
├── Administration
│   ├── Admin Users
│   ├── Roles & Permissions
│   ├── Login Logs
│   ├── Admin Activity Logs
│   └── Security
│
└── System
    ├── System Status
    ├── Database
    ├── Cache / Revalidation
    └── Error Logs
```

**Jangan membuat semua menu tersebut langsung aktif.** Struktur navigasi boleh disiapkan, tetapi implementasi dilakukan bertahap berdasarkan fitur yang memang sudah tersedia di backend.

---

# 3. Dashboard

Dashboard bukan sekadar halaman kosong dengan angka.

Tujuannya adalah memberikan **overview kondisi website**.

### Overview

Tampilkan:

```text
Website Overview

[ Published Games ]
[ Active Events ]
[ Gallery Photos ]
[ Testimonials ]

[ Feedback Baru ]
[ Contact Message Baru ]
```

Kemudian:

### Recent Activity

Contoh:

```text
Recent Activity

Admin A updated Game "GTA V"
Admin B added new Event
Admin A uploaded image
Admin C logged in
Admin A deleted testimonial
```

Data ini berasal dari **Admin Activity Log**, bukan data dummy.

---

### Website Status

Misalnya:

```text
Website Status

● Website             Operational
● Database            Connected
● Storage             Connected
● Cache               Active
● Last Deployment     ...
```

Jangan membuat status palsu.

Jika backend belum mempunyai health-check, buat endpoint/service khusus.

---

# 4. Content Management

Ini menjadi bagian terbesar admin panel.

Gunakan pola UI yang konsisten:

```text
Page Header
    Title
    Description
    Action Button

Filter / Search

Data Table / Content Cards

Pagination

Create / Edit Drawer atau Modal
```

---

# 5. Home Management

Karena homepage memiliki banyak section, jangan membuat setiap section menjadi halaman admin yang sepenuhnya terpisah jika tidak diperlukan.

Gunakan:

```text
Content
└── Home
```

Kemudian:

```text
Home
│
├── Hero
├── Game Showcase
├── Pricing Preview
├── Event Preview
├── Gallery Preview
├── Location Preview
├── Testimonials Preview
├── FAQ Preview
└── Contact / CTA
```

Admin dapat mengatur:

- title
- subtitle
- description
- button
- image
- visibility
- ordering
- content reference

### Penting

Jangan upload logo baru di Home hanya karena Hero membutuhkan logo.

Misalnya:

```text
Hero
    logo → Brand Logo
```

bukan:

```text
Hero
    upload logo → hero-logo.png
```

---

# 6. Game Catalog

```text
Content
└── Game Catalog
```

Fungsi:

- Create game
- Edit game
- Delete game
- Publish/unpublish
- Search
- Filter category
- Sort
- Manage cover
- Manage hardware/platform
- Manage description

Struktur data tetap mengikuti schema/database yang sudah ada.

UI jangan membuat database model baru hanya demi tampilan.

---

# 7. Pricing

Gunakan management berbasis data.

```text
Pricing
│
├── Packages
├── Categories
└── Time Period
```

Admin dapat:

- create pricing
- edit pricing
- delete pricing
- enable/disable
- reorder
- assign package/category

Contoh:

```text
Package
├── Name
├── Description
├── Duration
├── Price
├── Category
└── Status
```

---

# 8. Events

```text
Events
```

Fitur:

- Create
- Edit
- Delete
- Publish
- Draft
- Schedule
- Image
- Description
- Event date
- CTA
- Ordering

Tambahkan status:

```text
Draft
Published
Archived
```

Jika backend belum mendukung status tersebut, **jangan memaksakan schema baru sekarang**. Audit terlebih dahulu schema yang tersedia.

---

# 9. Gallery

Gallery sebaiknya tidak hanya berupa CRUD image biasa.

Gunakan konsep:

```text
Gallery
├── Albums
└── Media
```

Misalnya:

```text
Gallery
    Event 17 Agustus
        image 1
        image 2
        image 3

    Rental PS
        image 1
        image 2
```

Namun ini harus mengikuti model database yang sudah ada.

---

# 10. Location

Karena website memiliki cabang:

```text
Locations
```

Admin dapat mengelola:

- Branch name
- Address
- Phone
- Opening hours
- Google Maps location
- Coordinates
- Maps embed/reference
- Status
- Ordering

### Google Maps

Jangan menyimpan iframe HTML mentah jika tidak diperlukan.

Lebih baik simpan data:

```text
latitude
longitude
address
placeId
```

kemudian frontend membangun map dari data tersebut.

---

# 11. FAQ

Gunakan table:

```text
Question
Answer
Category
Status
Order
```

Fitur:

- Create
- Edit
- Delete
- Publish
- Reorder
- Search

---

# 12. Testimonials

Admin dapat:

- Add testimonial
- Edit
- Delete
- Publish/unpublish
- Feature/unfeature
- Reorder

Contoh:

```text
Name
Message
Rating
Avatar
Status
Featured
Order
```

---

# 13. Feedback

Ini sebaiknya **bukan CRUD biasa**.

Feedback adalah incoming data.

Gunakan workflow:

```text
New
↓
Read
↓
Reviewed
↓
Resolved
```

Table:

```text
Sender
Subject
Message
Created
Status
```

Admin dapat:

- View
- Mark as read
- Mark as resolved
- Delete
- Search
- Filter

---

# 14. Contact Us

Sama seperti feedback, Contact Us merupakan **inbound communication**.

Jangan mencampurnya dengan content management.

```text
Contact Messages
```

Status:

```text
New
Read
Replied
Resolved
Archived
```

Tambahkan:

- search
- filter
- timestamp
- sender
- email
- message

---

# 15. Media Library

Ini menurut saya **salah satu perubahan paling penting** dari admin lama.

Buat:

```text
Media
└── Media Library
```

Konsepnya seperti mini asset manager.

Admin bisa melihat:

```text
[ Logo ] [ GTA V ] [ Event ] [ Gallery ]
```

Setiap asset mempunyai:

```text
ID
File name
URL
Type
Size
Width
Height
Uploaded by
Created at
```

Admin bisa:

- Upload
- Preview
- Search
- Filter
- Delete
- Copy URL
- Replace asset
- See where asset is being used

---

# 16. Centralized Branding

Ini khusus menyelesaikan masalah logo yang kamu sebutkan.

Jangan:

```text
Home Logo
Navbar Logo
Favicon Logo
Footer Logo
```

masing-masing mempunyai upload sendiri.

Gunakan:

```text
Media
└── Branding
```

Contohnya:

```text
Brand Identity

Primary Logo
    [ Select Media ]

Navbar Logo
    [ Use Primary Logo ✓ ]

Favicon
    [ Select Media ]

Footer Logo
    [ Use Primary Logo ✓ ]
```

Jika semuanya menggunakan logo yang sama:

```text
Primary Logo
       ↓
Navbar
       ↓
Footer
       ↓
Hero
```

Tidak ada duplikasi upload.

---

# 17. Branding Settings

Buat satu tempat untuk:

```text
Branding
│
├── Primary Logo
├── Secondary Logo
├── Favicon
├── Site Name
├── Brand Description
└── Social Preview Image
```

Kemudian component frontend mengambil data tersebut dari centralized settings.

---

# 18. Website Settings

```text
Website
└── General Settings
```

Contoh:

```text
Site Name
Site Description
Default Language
Timezone
Contact Email
Contact Phone
Social Links
```

Gunakan schema `SiteSetting` yang sudah ada jika memang cukup.

Jangan membuat environment variable untuk setting yang memang harus dapat diubah admin.

---

# 19. Navigation Management

Buat:

```text
Website
└── Navigation
```

Admin bisa mengatur:

```text
Home
Game Catalog
Pricing
Events
Gallery
Location
FAQ
Contact
```

Dengan:

- label
- URL
- visibility
- order
- external/internal

Tetapi **jangan langsung membuat dynamic navigation database** jika navigation saat ini masih hardcoded dan belum diperlukan.

Ini bisa menjadi Phase berikutnya.

---

# 20. SEO Management

```text
Website
└── SEO
```

Admin dapat mengatur:

```text
Page
Title
Description
OG Image
Canonical URL
Index / Noindex
```

Contoh:

```text
Home
Game Catalog
Pricing
Event
Gallery
Location
FAQ
Contact
```

Gunakan model `SeoPage` yang sudah ada jika model tersebut memang dirancang untuk ini.

---

# 21. Admin Users

```text
Administration
└── Admin Users
```

Tampilkan:

```text
Admin
Email / Discord
Role
Status
Last Login
Created
```

Action:

```text
View
Edit Role
Disable
Revoke Session
```

---

# 22. Roles & Permissions

Jangan hanya:

```text
Admin
```

Sebaiknya sistem disiapkan untuk:

```text
Super Admin
Admin
Editor
Viewer
```

Contoh permission:

```text
content.read
content.create
content.update
content.delete

media.upload
media.delete

admin.manage
logs.read
settings.manage
```

Dengan begitu nantinya kamu tidak perlu merombak authorization lagi ketika jumlah admin bertambah.

---

# 23. Login Logs

Sesuai kebutuhanmu:

```text
Administration
└── Login Logs
```

Data:

```text
Admin
Login time
Logout time
IP
User agent
Device
Browser
Status
```

Status:

```text
Success
Failed
Blocked
```

Tambahkan filter:

```text
Date
Admin
Status
```

---

# 24. Admin Activity Logs

Ini berbeda dari Login Logs.

Login log:

> siapa login?

Activity log:

> siapa melakukan apa?

Contoh:

```text
Admin A
Updated Game
GTA V
12 Aug 2026 14:20
```

atau:

```text
Admin B
Deleted Gallery Photo
photo_123
12 Aug 2026 15:12
```

Structure:

```text
Actor
Action
Entity
Entity ID
Before
After
IP
Timestamp
```

Untuk aksi sensitif, `before/after` sangat berguna untuk audit.

---

# 25. System Status

```text
System
└── System Status
```

Tampilkan:

```text
Application
Database
Storage
Cache
API
```

Contoh:

```text
Database
Connected

Latency
182 ms

Last Check
08:41:21
```

Ini juga membantu debugging ketika website tiba-tiba lambat.

---

# 26. Cache / Revalidation

Karena project-mu menggunakan ISR, ini sangat berguna.

```text
System
└── Cache
```

Tampilkan:

```text
Landing Page
Last Revalidated
Cache Status
```

Dan jika diperlukan:

```text
[ Revalidate Homepage ]

[ Revalidate All Public Pages ]
```

Ini harus menggunakan mekanisme server-side yang aman, **bukan endpoint publik tanpa authentication**.

---

# 27. Error Logs

Jika memang backend sudah memiliki error logging, tampilkan:

```text
System
└── Error Logs
```

Contoh:

```text
Database Connection Error
API Error
Upload Error
Authentication Error
```

Namun jangan membuat fake error log hanya demi UI.

---

# 28. Struktur Layout Admin

Saya sarankan:

```text
┌─────────────────────────────────────────────────────┐
│ Sidebar                    │ Topbar                  │
│                           │                         │
│ DsterGame                 │ Search     Admin       │
│                           │                         │
│ Dashboard                 ├─────────────────────────┤
│                           │                         │
│ CONTENT                   │ Page Content            │
│  Home                     │                         │
│  Game Catalog             │                         │
│  Pricing                  │                         │
│  Events                   │                         │
│  Gallery                  │                         │
│  Locations                │                         │
│  FAQ                      │                         │
│  Testimonials             │                         │
│  Feedback                 │                         │
│  Contact                  │                         │
│                           │                         │
│ MEDIA                     │                         │
│  Media Library            │                         │
│  Branding                 │                         │
│                           │                         │
│ WEBSITE                   │                         │
│  SEO                      │                         │
│  Settings                 │                         │
│                           │                         │
│ ADMINISTRATION            │                         │
│  Admin Users              │                         │
│  Logs                     │                         │
│                           │                         │
│ SYSTEM                    │                         │
│  Status                   │                         │
│  Cache                    │                         │
└─────────────────────────────────────────────────────┘
```

Sidebar harus responsive.

Mobile:

```text
☰
```

→ sidebar drawer.

---

# 29. Design System

**Jangan membuat design system kedua untuk admin.**

Admin harus menggunakan design system existing landing page.

AI agent harus melakukan audit:

```text
src/
├── components/
├── app/
├── styles/
├── lib/
└── ...
```

Cari:

- CSS variables
- colors
- typography
- spacing
- radius
- shadows
- buttons
- inputs
- cards
- badges
- dialogs
- tables
- animations

Kemudian gunakan kembali component tersebut.

Jika component belum ada:

> buat **reusable primitive**, bukan styling langsung di setiap halaman.

Misalnya:

```text
AdminPageHeader
AdminDataTable
AdminFilterBar
AdminStatCard
AdminEmptyState
AdminLoadingState
AdminConfirmDialog
AdminForm
AdminStatusBadge
```

---

# 30. Hindari Komponen Raksasa

Jangan:

```text
AdminDashboard.tsx
1000+ lines
```

Gunakan:

```text
dashboard/
├── DashboardPage.tsx
├── DashboardStats.tsx
├── RecentActivity.tsx
├── WebsiteStatus.tsx
└── QuickActions.tsx
```

Untuk game:

```text
games/
├── GamePage.tsx
├── GameTable.tsx
├── GameFilters.tsx
├── GameForm.tsx
├── GameActions.tsx
└── GameDeleteDialog.tsx
```

---

# 31. Reusable CRUD Architecture

Karena banyak section mempunyai pola CRUD yang sama, jangan copy-paste.

Gunakan pattern:

```text
List
 ↓
Search / Filter
 ↓
Table
 ↓
Create / Edit
 ↓
Validation
 ↓
Mutation
 ↓
Revalidation
 ↓
Activity Log
```

Misalnya:

```text
Game
Event
FAQ
Testimonial
Gallery
Pricing
```

semuanya mengikuti architecture yang sama.

---

# 32. Data Flow

Pertahankan arsitektur:

```text
Admin UI
   ↓
Admin API
   ↓
Service Layer
   ↓
Repository
   ↓
Prisma
   ↓
Supabase
```

Jangan:

```text
Admin Component
   ↓
Prisma
```

dan jangan membuat client langsung mengakses database.

---

# 33. Setelah Mutation

Setiap perubahan admin harus mempunyai pipeline:

```text
Admin Update
     ↓
Validate
     ↓
Database Mutation
     ↓
Activity Log
     ↓
Revalidate Path
     ↓
Response
```

Misalnya:

```text
Update Event
    ↓
DB updated
    ↓
ActivityLog created
    ↓
revalidatePath("/event")
    ↓
revalidatePath("/")
```

Dengan begitu public website tetap cepat karena menggunakan cache, tetapi perubahan admin tetap cepat terlihat.

---

# 34. Security

Admin panel harus mempunyai:

### Authentication

```text
Admin Login
     ↓
Session
     ↓
Authorization
     ↓
Admin Panel
```

### Authorization

Setiap admin API harus memeriksa permission.

Jangan hanya menyembunyikan tombol frontend.

Contoh:

```text
UI permission check
+
Server/API permission check
```

Server check adalah yang wajib.

---

# 35. Fase Implementasi

Jangan langsung mengerjakan semuanya.

### Phase 1 — Admin Foundation

```text
Admin Layout
Sidebar
Topbar
Responsive
Theme/design system
Authentication guard
Permission foundation
```

### Phase 2 — Dashboard

```text
Stats
Recent Activity
Website Status
Quick Actions
```

### Phase 3 — Content

```text
Home
Games
Pricing
Events
Gallery
Locations
FAQ
Testimonials
```

### Phase 4 — Communication

```text
Feedback
Contact Messages
```

### Phase 5 — Media

```text
Media Library
Branding
Centralized Assets
```

### Phase 6 — Website

```text
SEO
Settings
Navigation
Footer
```

### Phase 7 — Administration

```text
Admin Users
Roles
Permissions
Login Logs
Activity Logs
```

### Phase 8 — System

```text
System Status
Cache
Revalidation
Error Logs
```

### Phase 9 — Hardening

```text
Security audit
Permission audit
API audit
Database query audit
Responsive testing
Loading states
Error states
Empty states
Performance testing
```

---

# 36. Aturan Penting untuk AI Agent

Saya akan menambahkan aturan ini ke prompt supaya agent **tidak mengulangi masalah admin lama**:

> **IMPORTANT IMPLEMENTATION RULES**
>
> 1. Do not start coding immediately.
> 2. First inspect the existing admin implementation, database schema, repositories, services, API routes, authentication, design system, reusable components, CSS variables, and existing admin features.
> 3. Preserve existing backend functionality unless there is a documented reason to modify it.
> 4. The redesign is primarily an architectural/UI/UX refactor of the admin panel, not a reason to rewrite working backend logic.
> 5. Do not create duplicate upload fields for assets that represent the same logical asset.
> 6. Implement centralized Media/Branding management so assets can be referenced by multiple sections.
> 7. Reuse existing project design tokens and components wherever possible.
> 8. Do not hardcode colors, fonts, spacing, border radius, shadows, or other design values when an existing project token/variable/component already exists.
> 9. Do not create giant page components. Split complex UI into reusable components.
> 10. Do not duplicate CRUD logic between admin sections when a reusable abstraction is appropriate.
> 11. Preserve the existing `DATABASE → Prisma → Service → Server/API → UI` architecture.
> 12. Do not introduce client-side database access.
> 13. Do not introduce mock data or silent fallback data.
> 14. All mutations must have proper validation, authorization, error handling, activity logging where applicable, and cache revalidation.
> 15. Do not remove existing features merely to simplify the implementation.
> 16. Do not remove existing animations or public website features unless specifically required for performance or correctness.
> 17. Admin UI must use the same visual language as the main website, but may use a more information-dense layout appropriate for administration.
> 18. Every page must have loading, empty, error, and success states.
> 19. Every destructive action must require confirmation.
> 20. Before modifying the database schema, verify whether the existing schema can already support the requirement.
> 21. Do not create a new database model merely to solve a UI problem.
> 22. After each implementation phase, run TypeScript checks and relevant tests before proceeding.
> 23. Do not perform large unrelated refactors during the admin redesign.
> 24. Keep the implementation modular and maintainable.
> 25. Before completing a phase, provide a concise summary of files changed, functionality implemented, verification performed, and any remaining risks.

---

## Prioritas yang saya rekomendasikan

Kalau melihat kondisi project-mu sekarang, **jangan langsung membuat 20 halaman admin**.

Urutannya lebih efektif:

**Foundation → Dashboard → Content → Media/Branding → Communication → Administration → System.**

Dan saya justru akan menjadikan **Media Library + Centralized Branding** sebagai bagian penting dari redesign, karena itu langsung menyelesaikan problem yang kamu temukan: satu logo tidak seharusnya mempunyai 3–4 mekanisme upload berbeda hanya karena dipakai oleh Hero, Navbar, dan Favicon.

Satu catatan arsitektural: **favicon memang sebaiknya bisa memiliki asset berbeda dari primary logo**, karena format/dimensi dan kebutuhan browser-nya berbeda. Yang perlu dihindari adalah _duplikasi asset yang sama_, bukan memaksa semua branding asset menjadi satu file.
