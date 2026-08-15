# Backend Foundation Planning

## Tujuan

Membangun fondasi backend yang bersih, modular, reusable, scalable, dan tidak bergantung pada implementasi database tertentu.

Tahap ini **tidak membuat fitur website**, **tidak membuat CRUD**, dan **tidak membuat halaman**.

Fokusnya adalah membangun infrastruktur backend yang nantinya akan digunakan oleh seluruh project.

---

# Target Hasil

Setelah Backend Foundation selesai, project harus memiliki:

- Struktur folder backend yang jelas
- Database client yang terpusat
- Service Layer
- Repository Layer
- Validation Layer
- Error Handling
- Response Standard
- Utility Functions
- Type Definitions
- Constants
- Configuration
- Logging
- Middleware
- Security Foundation
- Coding Convention

Backend Foundation **tidak boleh menghasilkan UI**.

---

# Folder Structure

Backend hanya bertanggung jawab terhadap logic.

Contoh struktur:

```text
src/

├── actions/
│
├── lib/
│
├── repositories/
│
├── services/
│
├── validators/
│
├── middleware/
│
├── types/
│
├── constants/
│
├── utils/
│
├── config/
│
├── hooks/
│
└── server/
```

Setiap folder memiliki tanggung jawab yang jelas.

---

# Responsibilities

## Config

Seluruh konfigurasi project.

Contohnya

- Environment
- Website Config
- Storage Config
- Upload Config
- Security Config

Tidak boleh ada business logic.

---

## Constants

Semua constant.

Misalnya

- Pagination Default
- Upload Limit
- Allowed Mime Type
- Route Name
- Status

---

## Types

Seluruh interface dan type.

Contohnya

- API Response
- Pagination
- Table
- Upload
- Session

Tidak boleh berisi logic.

---

## Utils

Utility yang reusable.

Misalnya

- Formatter
- Date
- String
- Number
- Slug
- URL
- Color
- Validation Helper

---

## Validators

Seluruh validasi.

Semua request harus melalui validator.

Tidak boleh ada validasi langsung di component ataupun service.

---

## Repository Layer

Repository hanya bertugas berkomunikasi dengan database.

Repository **tidak boleh memiliki business logic**.

Repository hanya melakukan operasi data.

Contoh tanggung jawab:

- Create
- Read
- Update
- Delete
- Query
- Search

---

## Service Layer

Service adalah tempat seluruh business logic.

Contoh:

Repository menghasilkan data.

Service mengolah data.

Service boleh memanggil beberapa repository.

Component hanya berbicara dengan Service.

Tidak pernah langsung ke Repository.

---

## Server Layer

Berisi seluruh logic server.

Misalnya

- Authentication
- Session
- Cookies
- Headers

---

## Middleware

Semua middleware.

Misalnya

- Authentication
- Authorization
- Logging
- Security
- Redirect

---

## Actions

Seluruh Server Actions.

Landing Page maupun Dashboard cukup memanggil Action.

Action memanggil Service.

Service memanggil Repository.

Repository memanggil Database.

---

# Dependency Flow

Harus mengikuti arah berikut:

```text
UI

↓

Server Action

↓

Service

↓

Repository

↓

Database
```

Tidak boleh ada alur sebaliknya.

Component tidak boleh mengakses database secara langsung.

---

# Error Handling

Seluruh project menggunakan sistem error yang konsisten.

Misalnya:

- Validation Error
- Authentication Error
- Authorization Error
- Not Found
- Conflict
- Internal Server Error

Tidak boleh menggunakan pesan error acak.

---

# Response Standard

Semua backend harus memiliki format response yang konsisten.

Baik sukses maupun gagal.

Sehingga frontend cukup memahami satu format.

---

# Logging

Seluruh aktivitas penting memiliki logging.

Misalnya:

- Login
- Logout
- CRUD
- Upload
- Error

Logging dipusatkan.

---

# Security Foundation

Backend harus disiapkan untuk:

- Input Validation
- SQL Injection Prevention
- XSS Prevention
- CSRF Protection
- Rate Limiting (opsional)
- Secure Cookie
- Environment Validation

---

# Coding Rules

Backend harus mengikuti aturan berikut:

- Tidak ada hardcode data.
- Tidak ada query database di UI.
- Tidak ada business logic di component.
- Satu file memiliki satu tanggung jawab.
- Hindari file yang sangat panjang.
- Gunakan penamaan yang konsisten.
- Semua fungsi memiliki tujuan yang jelas.

---

# Deliverables

Backend Foundation dianggap selesai apabila:

- Struktur folder selesai
- Semua layer tersedia
- Database client terhubung
- Validation siap digunakan
- Error system siap digunakan
- Logging siap digunakan
- Constants selesai
- Utilities selesai
- Types selesai
- Config selesai

Belum ada CRUD.

Belum ada Landing Page.

Belum ada Dashboard.

---

# Design System & UI Library Planning

## Tujuan

Membangun Design System yang menjadi standar seluruh tampilan website dan dashboard.

Design System harus reusable, konsisten, dan mudah dikembangkan.

Tahap ini **tidak membuat halaman website**.

Fokusnya adalah membangun komponen dasar yang akan digunakan berulang.

---

# Design Philosophy

Design System harus:

- Konsisten
- Modular
- Reusable
- Responsive
- Accessible
- Mudah di-maintenance
- Mudah diubah dari satu tempat

---

# Folder Structure

```text
components/

├── ui/
│
├── layout/
│
├── navigation/
│
├── feedback/
│
├── display/
│
├── data-display/
│
├── form/
│
├── overlay/
│
├── animation/
│
├── typography/
│
└── providers/
```

Landing page dan Dashboard **belum dibuat**.

---

# UI Categories

## Layout

Komponen yang mengatur struktur halaman.

Contoh:

- Container
- Section
- Grid
- Stack
- Divider
- Spacer

---

## Typography

Komponen teks.

Contoh:

- Heading
- Paragraph
- Caption
- Label
- Badge

---

## Navigation

Komponen navigasi.

Contoh:

- Button
- Link
- Breadcrumb
- Pagination
- Tabs

---

## Forms

Komponen input.

Contoh:

- Input
- Textarea
- Select
- Checkbox
- Radio
- Switch
- Form Field

---

## Data Display

Komponen untuk menampilkan data.

Contoh:

- Card
- Table
- Avatar
- Timeline
- Statistic
- Accordion
- List

---

## Feedback

Komponen umpan balik.

Contoh:

- Alert
- Toast
- Loading
- Skeleton
- Empty State
- Progress
- Spinner

---

## Overlay

Komponen yang muncul di atas halaman.

Contoh:

- Modal
- Dialog
- Drawer
- Popover
- Tooltip

---

## Animation

Komponen pendukung animasi.

Misalnya:

- Fade
- Slide
- Reveal
- Floating
- Marquee
- Parallax Helper

Komponen ini hanya menyediakan perilaku animasi, bukan isi konten.

---

## Providers

Semua provider React.

Misalnya:

- Theme Provider
- Query Provider
- Toast Provider

---

# Design Tokens

Seluruh komponen menggunakan Design Tokens.

Contohnya:

- Color
- Typography
- Radius
- Shadow
- Spacing
- Breakpoint
- Transition
- Z-Index

Nilai token mengikuti desain yang sudah Anda tentukan dan tidak ditulis ulang di setiap komponen.

---

# Rules

Semua komponen harus:

- Mendukung TypeScript.
- Mendukung Dark/Light jika nanti diperlukan.
- Mendukung `className` untuk ekstensi.
- Tidak mengandung business logic.
- Memiliki API (props) yang konsisten.
- Reusable di Landing Page maupun Dashboard.

---

# Deliverables

Design System dianggap selesai apabila:

- Struktur folder komponen selesai.
- Design Tokens tersedia.
- Komponen dasar selesai.
- Layout primitives selesai.
- Komponen feedback selesai.
- Komponen form selesai.
- Komponen overlay selesai.
- Komponen animasi dasar selesai.
- Dokumentasi penggunaan setiap komponen tersedia.

---
