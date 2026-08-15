# Rental Website

## Project Blueprint v1.0

## 1. Project Goal

Membangun website profesional untuk UMKM rental game yang berfungsi sebagai media promosi, katalog layanan, informasi event, galeri, lokasi cabang, testimoni pelanggan, FAQ, serta sebagai media informasi kepada calon pelanggan.

Website harus dapat dikelola sepenuhnya melalui Admin Dashboard tanpa perlu mengubah source code.

Seluruh konten website bersifat dinamis dan berasal dari database.

---

# 2. Project Philosophy

Project mengikuti prinsip berikut:

- Clean Architecture
- Component Based Development
- Reusable Components
- Responsive First
- Database Driven
- Maintainable
- Scalable
- No Hardcoded Content
- Single Responsibility Principle
- Separation of Concerns
- Responsiveness
- High Performance
- Interactive
- Secure

---

# 3. Tech Stack

Frontend

- Next.js (App Router)
- TypeScript
- Tailwind CSS

Backend

- Next.js Server Actions / Route Handlers

Database

- Supabase PostgreSQL

ORM

- Prisma

Authentication

- Discord / Admin Login (atau sesuai kebutuhan nanti)

Image

- Next Image

Map

- Leaflet + OpenStreetMap (gratis) atau Google Maps jika dibutuhkan.

Analytics

- Dashboard Statistics
- Visitor Counter
- Popular Pages

---

# 4. Landing Page Structure

Landing Page terdiri dari beberapa section.

Semua section harus menjadi component terpisah.

```
Navbar

Hero

Game Hardware

Pricing

Events

Gallery

Location

Testimonials

FAQ

Contact

Footer
```

Tidak ada section yang dibuat langsung di page.tsx.

page.tsx hanya bertugas menyusun section.

---

# 5. Detail Section

## Navbar

Menampilkan

- Logo
- Navigation
- CTA Button

Navbar bersifat sticky.

Menu melakukan smooth scroll.

CTA akan ditentukan kemudian.

---

## Hero

Menampilkan

Logo

Decoration

Game Cover

Button Explore

Button Explore melakukan scroll menuju section berikutnya.

Semua decoration menggunakan absolute positioning.

---

## Hardware Section

Bukan daftar game.

Tetapi daftar hardware.

Contoh

PlayStation

Nintendo Switch

Logitech Wheel

Ketika card dipilih

↓

akan membuka daftar game yang tersedia pada hardware tersebut.

Relasi datanya

```
Hardware

↓

Games
```

Bukan

```
Game

↓

Hardware
```

Karena satu hardware memiliki banyak game.

---

## Pricing Section

Memiliki Tab.

Setiap tab menampilkan data berbeda.

Misalnya

```
Daily Rental

Hourly Rental

Member

Tournament
```

Isi tabel berubah sesuai tab.

Data berasal dari database.

---

## Event Section

Terdiri dari

Animated Event Tape

↓

Event Card

Event Tape tidak menggunakan gambar panjang.

Lebih baik dibuat menggunakan CSS Animation.

Karena

- ringan
- responsive
- mudah diubah

Card Event berisi

Poster

Title

Subtitle

Description

Date

Button

Button menuju Instagram atau halaman detail event.

---

## Gallery

Section paling interaktif.

Decoration

```
G A L L E R Y
```

berfungsi sebagai elemen visual.

Lingkaran merupakan thumbnail gallery.

Behavior

- floating animation
- random movement kecil
- hover scale
- click membuka modal/lightbox

Data gallery berasal dari database.

---

## Location

Background berubah menjadi biru.

Menggunakan efek parallax.

Maps menggunakan interactive map.

Fitur

Zoom

Drag

Marker banyak cabang

Popup lokasi

Direction

---

## Testimonial

Card

Profile

Nama

Komentar

Rating

Rating menggunakan bintang.

---

## FAQ

Accordion.

Semua FAQ berasal dari database.

---

## Contact

Title

Description

WhatsApp Button

Semua nomor WhatsApp berasal dari database.

---

## Footer

Logo

Description

Navigation

Social Media

Copyright

---

# 6. Admin Dashboard

Dashboard bukan hanya CRUD.

Dashboard menjadi pusat pengelolaan website.

Admin dapat mengubah seluruh isi website.

---

Dashboard memiliki modul:

```
Dashboard

Website Analytics

Hero

Hardware

Games

Pricing

Events

Gallery

Location

Testimonials

FAQ

Social Media

Website Settings

Appearance

Media Library

Users

Activity Logs
```

---

# 7. CMS Concept

Semua text

Semua gambar

Semua warna

Semua button

Semua FAQ

Semua event

Semua harga

Semua gallery

berasal dari database.

Tidak ada text yang di-hardcode.

---

# 8. Database Philosophy

Database bersifat relational.

Contoh

```
Hardware

id

name

↓

Games

id

hardwareId

title
```

Pricing

```
Pricing Category

↓

Pricing Item
```

Event

```
Event

↓

Gallery
```

Gallery

```
Album

↓

Photos
```

Dengan struktur seperti ini database akan lebih fleksibel dibanding menyimpan semua data dalam satu tabel.

---

# 9. Assets Structure

```
public/

    logos/

    icons/

    images/

        landing/

            hero/

            hardware/

            pricing/

            events/

            gallery/

            location/

            testimonial/

            footer/

    decorations/

    illustrations/
```

---

# 10. Components Philosophy

Component dibagi menjadi dua jenis.

## Shared Components

Dipakai di seluruh website.

Contoh

```
Button

Card

Badge

Container

SectionTitle

Modal

Tabs

Accordion

Input

Textarea

Dialog

Tooltip

Carousel

Pagination

Loading

Skeleton
```

---

## Landing Components

```
Navbar

Hero

HardwareSection

PricingSection

EventSection

GallerySection

LocationSection

TestimonialSection

FAQSection

ContactSection

Footer
```

---

# 11. Folder Structure

```
app/

components/
│
├── ui/
├── layout/
├── landing/
├── dashboard/
├── cards/
├── forms/
├── map/
├── animation/
├── icons/

features/

lib/

services/

hooks/

utils/

types/

constants/

prisma/

public/
```

Dengan pembagian seperti ini, setiap folder memiliki tanggung jawab yang jelas dan mudah dicari.

---

# 12. UI Principles

Warna utama

```
Primary

#0000FF

Background

#FAFAFA

Dark

#1D242B
```

Design Style

- Modern
- Clean
- Minimal
- Rounded
- Interactive
- Smooth Animation
- Gaming Feel
- High Performance

---

# 13. Animation Principles

Animasi digunakan sebagai pendukung, bukan pengganggu.

Beberapa animasi yang direncanakan:

- Sticky navbar
- Smooth scroll
- Hero decoration floating
- Explore button scroll
- Hardware card hover
- Pricing tab transition
- Event tape marquee
- Event card hover
- Gallery floating motion
- Gallery image scale
- Gallery lightbox
- Blue section parallax
- FAQ expand/collapse
- Button ripple/hover
- Footer reveal

Semua animasi harus halus, konsisten, dan tetap menjaga performa halaman.

---

## Tahapan Pengembangan

Saya juga menyarankan agar AI Agent **tidak langsung membuat seluruh website**. Pecah menjadi milestone agar hasil lebih rapi dan mudah direvisi:

1. **Foundation**: inisialisasi Next.js, struktur folder, design system, tema warna, typography, komponen UI dasar (Button, Card, Container, SectionTitle, Tabs, Accordion, Modal, dll.).
2. **Landing Page Static**: implementasi semua section sesuai desain Figma menggunakan data dummy.
3. **Backend & Database**: desain schema Prisma, Supabase, autentikasi admin, media library, API/server actions.
4. **CMS Integration**: hubungkan setiap section ke database sehingga seluruh konten dapat dikelola dari dashboard.
5. **Interactive Features**: floating gallery, parallax, marquee event, peta interaktif, lightbox, animasi, analytics, optimasi performa, SEO, dan pengujian.
