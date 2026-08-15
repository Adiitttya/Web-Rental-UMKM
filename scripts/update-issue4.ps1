param(
    [string]$Token = ""
)

$issueBody = @'
## 🎯 Overview

Implementasi Landing Page **DsterGame Rental Website** secara statis menggunakan mock data.

Ikuti desain yang ada di `public/LandingPage.jpg` sebagai referensi visual utama.
Referensi teknis: `docs/landingpage.md` dan `docs/blue-print.md`.

> **Tidak ada integrasi database di tahap ini.** Semua data menggunakan mock objects bertipe TypeScript yang nantinya bisa diganti Service Layer.

---

## 📌 Konteks Proyek

- **Framework:** Next.js App Router + TypeScript + Tailwind CSS
- **UI Library:** Sudah tersedia di `src/components/` — **jangan buat ulang komponen yang sudah ada**
- **Assets:** Semua ada di folder `public/` — jangan duplikat atau rename
- **Warna utama:** `#0000FF` (Primary Blue), `#FAFAFA` (Background), `#1D242B` (Dark)
- **Section files:** ada di `src/components/landing/sections/`
- **Mock data:** ada di `src/data/mock-landing.ts`

---

## ⚠️ Aturan Wajib (Tidak Boleh Dilanggar)

1. `app/page.tsx` **hanya menyusun section** — tidak boleh ada implementasi JSX di dalamnya
2. Setiap section adalah **komponen terpisah dan mandiri** — tidak saling bergantung
3. **Gunakan komponen UI Library yang sudah ada** — jangan buat ulang Button, Card, Tabs, Accordion, Modal, dll.
4. **Semua data dari mock data typed** — tidak boleh ada teks atau data yang langsung ditulis di JSX
5. Semua gambar dari `public/` menggunakan `next/image`
6. TypeScript di seluruh kode, HTML semantik, markup aksesibel

---

## 🗂️ Status Sections Saat Ini

Beberapa section sudah dibuat namun **belum sempurna / perlu diperbaiki**. Tinjau setiap file yang ada dan perbaiki sesuai arahan di bawah.

| # | Section | File | Status |
|---|---|---|---|
| 1 | **Navbar** | `NavbarSection.tsx` | Perlu review & perbaikan |
| 2 | **Hero** | `HeroSection.tsx` | Perlu review & perbaikan |
| 3 | **Hardware (List Game)** | `ListGameSection.tsx` | ⚠️ Nama file salah — rename ke `HardwareSection.tsx` |
| 4 | **Pricing** | `PricingSection.tsx` | Perlu review & perbaikan |
| 5 | **Events** | `EventSection.tsx` | Perlu review & perbaikan |
| 6 | **Gallery** | `GallerySection.tsx` | Perlu review & perbaikan |
| 7 | **Location** | `LocationSection.tsx` | Perlu review & perbaikan |
| 8 | **Testimonials** | `TestimonialSection.tsx` | Perlu review & perbaikan |
| 9 | **FAQ** | `FAQSection.tsx` | Perlu review & perbaikan |
| 10 | **Contact** | `ContactSection.tsx` | Perlu review & perbaikan |
| 11 | **Footer** | `FooterSection.tsx` | Perlu review & perbaikan |

---

## 📋 Instruksi Per Section

> Lihat `public/LandingPage.jpg` sebagai referensi visual untuk setiap section.

---

### 1. Navbar

**Tampilkan:**
- Logo (dari `public/Logo/`)
- Navigation links: `Home`, `List Game`, `Pricing`, `Events`, `Gallery`, `Location`, `Testimoni`, `FAQ`, `Contact`
- Tombol CTA di kanan (label dan fungsinya akan ditentukan nanti, untuk sekarang gunakan label "Button")

**Behavior:**
- Sticky (selalu di atas layar saat di-scroll)
- Background berubah (tambah shadow/backdrop blur) saat di-scroll ke bawah
- Navigation links melakukan **smooth scroll** ke section menggunakan `id` anchor
- Di mobile: tampilkan hamburger menu

---

### 2. Hero

**Tampilkan:**
- Logo rental (gambar dari `public/Logo/`)
- Teks handle Instagram di bawah logo (misal: `@dster.game`)
- Tombol **"Explore"** — saat diklik, scroll ke section berikutnya (`#hardware`)
- Dekorasi floating (gamepad, joystick, wheel, VR — dari `public/Decoration/`) dengan **animasi mengambang (float)**
- Fan-out kartu game cover (dari `public/GameCover/`) di bagian bawah hero, tertata seperti kartu dikembangkan (rotate kiri-kanan dari tengah)

**Catatan Penting:**
- Tombol yang ada saat ini salah label ("Contact Now") — **ganti menjadi "Explore"**
- Tombol Explore harus melakukan scroll ke `#hardware`, bukan membuka link lain
- Dekorasi menggunakan `position: absolute` di dalam section

---

### 3. Hardware Section (rename dari `ListGameSection`)

**Tampilkan:**
- Title: "List Game"
- Description/subtitle singkat
- Grid card hardware: **PlayStation**, **Nintendo Switch**, **Logitech Wheel**
  - PlayStation → background biru, logo PlayStation
  - Nintendo Switch → background merah, logo Nintendo
  - Logitech → background putih/abu, logo Logitech

**Behavior:**
- Card hoverable dan clickable
- Klik card → buka **Modal** menampilkan daftar game dari hardware tersebut
- Relasi data: `Hardware → banyak Games`
- Gunakan komponen `Modal` yang sudah ada di UI Library

**Contoh Mock Data:**
```typescript
const hardwareList = [
  {
    id: 'playstation',
    name: 'PlayStation',
    bgColor: '#0000FF',
    textColor: '#FFFFFF',
    logo: '/Logo/...',
    games: [
      { id: '1', title: 'God of War', platform: 'PS4', genre: 'Action', coverImage: '/GameCover/...' },
    ]
  },
]
```

---

### 4. Pricing Section

**Tampilkan:**
- Title
- Tabs: `Paket Pagi`, `Paket Sore`, `Paket Malam`, `Paket Member`, `Paket Tournament`
- Konten berubah sesuai tab aktif tanpa reload
- Tabel/card harga di dalam setiap tab

**Behavior:**
- Gunakan komponen `Tabs` dari UI Library
- Client-side tab switching

---

### 5. Events Section

**Tampilkan:**
- **Animated marquee tape** bertuliskan "EVENT EVENT EVENT ..." yang berjalan dari kanan ke kiri terus-menerus — **dibuat dengan CSS animation keyframe, bukan gambar statis**
- Grid event cards di bawahnya

**Card Event berisi:**
- Poster event (gambar)
- Title
- Sub-title
- Description/caption
- Tanggal event
- Tombol "Lihat Detail" → link Instagram (gunakan `#` sebagai placeholder)

**Catatan:**
- Marquee = CSS `@keyframes marquee` dengan `translateX` — bukan PNG/SVG panjang

---

### 6. Gallery Section

**Tampilkan:**
- Teks dekoratif besar: `G A L L E R Y`
- Lingkaran-lingkaran (circle thumbnails) berisi gambar gallery

**Behavior:**
- Lingkaran **mengambang** dengan animasi float random kecil
- Gerakan tetap berada dalam batas section
- Hover → sedikit **membesar (scale)**
- Klik → buka **Modal/Lightbox** gambar ukuran penuh
- Gunakan `Modal` dari UI Library untuk lightbox

---

### 7. Location Section

**Tampilkan:**
- Background biru (`#0000FF`)
- Title: "Location"
- Card maps interaktif

**Behavior:**
- Efek **parallax** saat di-scroll dari section Gallery
- Maps menggunakan **Leaflet + OpenStreetMap**
- Maps bisa di-zoom dan di-drag
- Multiple marker (misal 3 cabang)
- Klik marker → popup nama + link direction
- Data marker dari mock data (tidak di-hardcode di komponen)

**Contoh Mock Data:**
```typescript
const locations = [
  { id: '1', name: 'DsterGame Pusat', lat: -7.7956, lng: 110.3695, address: 'Jl. Contoh No. 1' },
]
```

---

### 8. Testimonials Section

**Tampilkan:**
- Grid card testimoni
- Setiap card: avatar, nickname, komentar, rating bintang (⭐/5)

---

### 9. FAQ Section

- Gunakan **komponen `Accordion` dari UI Library** — jangan buat accordion baru
- FAQ dari mock data

---

### 10. Contact Us Section

**Tampilkan:**
- Title: "Contact Us"
- Description singkat
- Dekorasi gambar controller (dari `public/`)
- Tombol WhatsApp — klik membuka `wa.me/{nomor}` di tab baru
- Nomor dari mock data (boleh placeholder)

---

### 11. Footer

**Tampilkan:**
- Logo rental
- Description singkat
- Navigation links
- Social media icons (dalam lingkaran): Instagram, TikTok, YouTube
- Copyright text

Semua data dari mock data.

---

## 🎨 Design System

Selalu gunakan CSS variables:

```css
var(--primary)    /* #0000FF */
var(--background) /* #FAFAFA */
var(--dark)       /* #1D242B */
```

Gunakan Tailwind classes yang konsisten. Inline style hanya untuk nilai dinamis (animasi, positioning).

---

## 📁 Struktur Folder yang Diharapkan

```
src/
├── components/landing/sections/
│   ├── NavbarSection.tsx
│   ├── HeroSection.tsx
│   ├── HardwareSection.tsx     ← rename dari ListGameSection
│   ├── PricingSection.tsx
│   ├── EventSection.tsx
│   ├── GallerySection.tsx
│   ├── LocationSection.tsx
│   ├── TestimonialSection.tsx
│   ├── FAQSection.tsx
│   ├── ContactSection.tsx
│   ├── FooterSection.tsx
│   └── index.ts
├── data/
│   └── mock-landing.ts
└── app/
    └── page.tsx
```

---

## ✅ Checklist Deliverable

- [ ] Semua 11 section diimplementasikan sebagai komponen terpisah
- [ ] `app/page.tsx` hanya menyusun section
- [ ] Tampilan visual mendekati `public/LandingPage.jpg`
- [ ] Responsive: Mobile, Tablet, Laptop, Desktop, Wide
- [ ] Semua mock data bertipe TypeScript
- [ ] Semua gambar dari `public/` via `next/image`
- [ ] Tidak ada data hardcode di JSX
- [ ] Tidak ada komponen UI baru yang dibuat
- [ ] Navbar sticky + smooth scroll berfungsi
- [ ] Tombol "Explore" di Hero scroll ke `#hardware`
- [ ] Hardware card membuka Modal daftar game
- [ ] Pricing tab berfungsi client-side
- [ ] Event marquee berjalan otomatis (CSS animation)
- [ ] Gallery floating + hover scale + lightbox berfungsi
- [ ] Location maps Leaflet interaktif + multiple marker
- [ ] FAQ menggunakan Accordion dari UI Library
- [ ] Contact button membuka WhatsApp link

---

## 🚫 Di Luar Scope Issue Ini

- Integrasi database / Supabase / Prisma
- Admin Dashboard / CMS
- Autentikasi admin
- Section yang tidak ada di `public/LandingPage.jpg`
- Perubahan pada UI Library yang sudah ada
'@

if ($Token -eq "") {
    Write-Host "ERROR: GitHub token diperlukan. Jalankan script dengan parameter -Token 'ghp_xxxxx'"
    exit 1
}

$headers = @{
    "Authorization" = "Bearer $Token"
    "Accept" = "application/vnd.github+json"
    "X-GitHub-Api-Version" = "2022-11-28"
    "Content-Type" = "application/json"
}

$body = @{
    body = $issueBody
} | ConvertTo-Json -Depth 10

try {
    $response = Invoke-RestMethod -Uri "https://api.github.com/repos/Adiitttya/Web-Rental-UMKM/issues/4" -Method PATCH -Headers $headers -Body $body
    Write-Host "✅ Issue #4 berhasil diupdate!"
    Write-Host "URL: $($response.html_url)"
} catch {
    Write-Host "❌ Error: $_"
    Write-Host $_.Exception.Message
}
