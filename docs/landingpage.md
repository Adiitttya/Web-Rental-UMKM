# Landing Page Development Planning

## Objective

Mengimplementasikan landing page sesuai desain yang terdapat pada `public/LandingPage.jpg` dengan memanfaatkan seluruh assets yang telah tersedia di folder `public`.

Landing page harus dibangun menggunakan komponen reusable yang telah tersedia pada UI Library, mengikuti Design System yang telah dibuat, dan tidak membuat ulang komponen yang sudah ada.

Landing page pada tahap ini **belum terhubung ke database**. Seluruh data dapat menggunakan mock data yang mengikuti struktur data sesungguhnya, sehingga pada tahap integrasi CMS nanti hanya perlu mengganti sumber datanya.

---

# Development Principles

Landing page harus mengikuti prinsip berikut:

- Pixel-accurate terhadap desain.
- Responsive (Mobile, Tablet, Desktop).
- Reusable.
- Tidak ada hardcoded style yang berulang.
- Tidak ada business logic di component presentasi.
- Tidak membuat komponen UI yang sudah tersedia pada UI Library.
- Setiap section merupakan component terpisah.
- Setiap section dapat berdiri sendiri.
- Mudah diintegrasikan dengan CMS di masa depan.

---

# Design Source

Gunakan:

```text
public/LandingPage.jpg
```

sebagai referensi utama layout.

Gunakan seluruh assets yang telah tersedia pada folder `public`.

Jangan membuat ulang asset menggunakan CSS apabila asset asli sudah tersedia.

Namun untuk elemen yang lebih tepat dibuat secara dinamis (misalnya marquee, animasi, atau dekorasi sederhana), implementasi melalui kode lebih disarankan daripada menggunakan gambar statis.

---

# Implementation Strategy

Landing page tidak dibuat sekaligus.

Gunakan pendekatan bertahap.

Misalnya:

```
Landing Page

↓

Section 1

↓

Section 2

↓

Section 3

↓

...

↓

Responsive

↓

Animation

↓

Optimization
```

Setiap section harus selesai sepenuhnya sebelum melanjutkan ke section berikutnya.

---

# Section Order

Implementasi mengikuti urutan visual pada desain.

1. Navbar
2. Hero
3. Hardware
4. Pricing
5. Events
6. Gallery
7. Location
8. Testimonials
9. FAQ
10. Contact
11. Footer

---

# General Rules

Setiap section harus:

- Memiliki component sendiri.
- Memiliki data sendiri.
- Tidak bergantung pada section lain.
- Tidak mengetahui struktur internal section lain.
- Menggunakan reusable UI Component.

---

# Data Strategy

Walaupun belum menggunakan database, jangan menulis data langsung di JSX.

Hindari:

```tsx
<h1>DsterGame</h1>

<p>Rental PS terbaik...</p>
```

Lebih baik gunakan struktur data sementara.

Misalnya:

```
Section

↓

Mock Data

↓

Component
```

Nantinya mock data dapat diganti dengan data dari Service Layer tanpa mengubah component.

---

# Layout Rules

Landing Page hanya bertugas menyusun section.

Halaman utama tidak boleh berisi implementasi isi section.

Contohnya:

```
Landing Page

↓

Navbar

↓

Hero

↓

Hardware

↓

Pricing

↓

...
```

Bukan:

```
Landing Page

↓

3000 baris JSX
```

---

# Assets Usage

Semua asset berasal dari folder `public`.

Gunakan asset asli.

Jangan:

- copy asset
- duplicate asset
- rename tanpa alasan

Semua asset harus diakses secara konsisten.

---

# Responsive Rules

Landing page harus mendukung minimal:

- Mobile
- Tablet
- Laptop
- Desktop
- Wide Screen

Layout tidak boleh hanya mengecilkan ukuran.

Susunan section boleh berubah apabila memang diperlukan untuk kenyamanan pengguna.

---

# Animation Guidelines

Animasi digunakan untuk meningkatkan pengalaman pengguna, bukan sebagai dekorasi berlebihan.

Animasi harus:

- ringan
- konsisten
- tidak mengganggu
- memiliki durasi seragam
- menghormati preferensi reduced motion jika memungkinkan

Animasi diterapkan setelah layout selesai.

---

# Section Behaviour

## Navbar

- Sticky.
- Background berubah saat scroll jika diperlukan.
- Navigation melakukan smooth scroll.
- Active section dapat ditandai.

---

## Hero

- Fokus utama halaman.
- Tombol Explore melakukan scroll ke section berikutnya.
- Decoration menggunakan posisi yang konsisten.
- Layout mengikuti desain.

---

## Hardware

Menampilkan daftar hardware.

Card:

- hover
- focus
- clickable

Belum perlu membuka halaman baru.

Pada tahap ini cukup menyiapkan struktur agar nantinya dapat menampilkan daftar game.

---

## Pricing

Tab harus dapat berpindah.

Perpindahan tab tidak melakukan reload halaman.

Konten berubah sesuai tab.

---

## Events

Marquee dibuat menggunakan animasi CSS/JavaScript, bukan gambar panjang.

Event Card:

- hover
- button
- informasi event

---

## Gallery

Gallery merupakan section interaktif.

Thumbnail:

- floating
- hover
- click

Click membuka modal/lightbox.

Random movement harus tetap berada di dalam batas section.

---

## Location

Maps harus bersifat interaktif.

Section ini nantinya akan menerima data lokasi dari CMS.

Marker tidak di-hardcode pada component.

---

## Testimonials

Gunakan card.

Rating ditampilkan secara visual.

Layout mengikuti design.

---

## FAQ

Gunakan Accordion dari UI Library.

Jangan membuat accordion baru.

---

## Contact

Button membuka WhatsApp.

Nomor masih dapat menggunakan placeholder.

---

## Footer

Menampilkan:

- Logo
- Description
- Navigation
- Social Media
- Copyright

Semua berasal dari data.

---

# Performance

Landing page harus memperhatikan:

- Optimasi gambar (`next/image`)
- Lazy loading
- Dynamic import bila diperlukan
- Semantic HTML
- Accessibility dasar
- SEO dasar

---

# Code Quality

Setiap section harus:

- memiliki satu tanggung jawab,
- menggunakan TypeScript,
- tidak melebihi ukuran file yang sulit dipelihara.

Jika sebuah section mulai memiliki banyak logika, pecah lagi menjadi subcomponent.

Misalnya:

```
Hardware Section

├── Section
├── Header
├── Grid
├── Card
├── Dialog
└── Tabs
```

Daripada satu file besar.

---

# Development Milestones

## Milestone 1

Landing Structure

- Routing halaman
- Menyusun seluruh section
- Layout dasar
- Responsive container

---

## Milestone 2

Static UI

Implementasi seluruh section sesuai desain menggunakan mock data.

Belum ada backend.

---

## Milestone 3

Interaction

Tambahkan interaksi:

- Scroll
- Hover
- Tab
- Accordion
- Modal
- Gallery
- Marquee
- Parallax

---

## Milestone 4

Responsive

Perbaiki seluruh breakpoint.

---

## Milestone 5

Optimization

- Image optimization
- Accessibility
- SEO
- Performance
- Code cleanup

---

# Deliverables

Tahap Landing Page dianggap selesai apabila:

- Semua section pada `public/LandingPage.jpg` telah diimplementasikan.
- Tampilan mendekati desain secara visual.
- Semua assets menggunakan file yang tersedia di `public`.
- Layout responsif di berbagai ukuran layar.
- Komponen memanfaatkan UI Library yang telah dibuat.
- Tidak ada data yang ditulis langsung di JSX.
- Struktur kode modular dan mudah dipelihara.
- Belum ada integrasi database ataupun CMS.

---

## Catatan untuk AI Agent

AI Agent harus memandang tahap ini sebagai **implementasi antarmuka**, bukan implementasi fitur. Prioritas utama adalah menghasilkan struktur komponen yang bersih, konsisten, dan siap dihubungkan ke backend pada tahap berikutnya. Hindari menambahkan fitur yang tidak ada pada desain atau mengubah tata letak tanpa alasan yang jelas. Setiap keputusan implementasi harus mempertimbangkan kemudahan integrasi dengan CMS dan dashboard di masa mendatang.
