# Issue: Admin Dashboard — UI Overhaul & Feature Completion

## Overview
Renovasi tampilan dan fungsionalitas Admin Dashboard agar konsisten dengan design system web utama, serta menghubungkan semua panel ke database yang valid.

---

## Global / Cross-Cutting Rules

- **Design Consistency** — Gunakan warna, typography, component, dan spacing yang sudah ada di global CSS (`root`) dan komponen web utama. Jangan hardcode nilai apapun.
- **Database-Driven** — Semua data (game, hardware, event, gallery, dll.) harus bersumber dari database. Perubahan di admin harus langsung tercermin di web utama.
- **Minimalis** — Hapus elemen UI yang tidak relevan (contoh: status "Database Connected"). Tampilan harus bersih dan profesional.
- **Navbar Workspace** — Ganti teks statis navbar dengan judul panel yang sedang aktif (contoh: "Dashboard", "Katalog Game", dll.).
- **Sidebar Admin** — Sesuaikan warna dan layout sidebar dengan design web utama.

---

## Panels

### 1. Home / Hero
**Goal:** Admin dapat mengedit konten section Hero web utama secara live dari panel ini.

**Fields yang bisa diedit:**
- Gambar decoration
- Game cover
- Teks `@dster.game`
- Tombol Explore: teks & URL tujuan

---

### 2. Katalog Game
**Goal:** Admin dapat mengelola hierarki Hardware → Device → Game yang terhubung ke database dan web utama.

**Struktur data:**
- **Hardware** (contoh: PlayStation, Nintendo, Logitech Wheel) — memiliki nama, image, dan warna card
- **Device** (contoh: PlayStation 5 Pro) — berada di bawah Hardware
- **Game** — berada di bawah Device; memiliki data lengkap sesuai skema DB yang ada

**Operasi yang tersedia:**
- Hardware: create, edit, delete
- Device: create, edit, delete (dengan pemilihan parent Hardware)
- Game: create, edit, delete (dengan pemilihan parent Device)

**UI Flow:** Pilih Hardware → pilih Device → tampil list Game dari device tersebut.

> Hapus game di admin = hapus dari DB = hilang di web utama. Semua operasi harus sinkron.

---

### 3. Pricelist
**Goal:** Perbaiki layout tabel Pricelist agar rapi dan profesional.

**Operasi yang tersedia:** create, edit (rename), delete per baris/entry.

---

### 4. Event
**Goal:** Admin dapat mengelola event yang ditampilkan di web utama.

**Fields per event:** image, link, title, subtitle, tanggal, deskripsi, lokasi.

**Operasi yang tersedia:**
- create, edit, delete
- Drag & drop untuk mengatur urutan tampil
- Toggle aktif/nonaktif — hanya event yang di-toggle aktif yang muncul di web utama

**Auto-featured logic:**
- Event unggulan ditentukan otomatis berdasarkan tanggal
- Event yang baru dibuat (tanggal belum lewat) → otomatis menjadi unggulan
- Event yang tanggalnya sudah lewat → otomatis tidak unggulan
- **Hapus fitur manual "Event Unggulan"**

---

### 5. Gallery
**Goal:** Sesuaikan layout dan design gallery dengan design system web utama.

**Operasi yang tersedia:** create, edit, delete, drag & drop urutan.

**Catatan:** Setiap item gallery dapat memiliki lebih dari 1 gambar.

---

### 6. Locations
**Goal:** Admin dapat mengelola data cabang (lebih dari 1 cabang didukung).

**Fields per lokasi:** nama cabang, alamat, koordinat maps, nomor telepon, jam buka.

**Operasi yang tersedia:** create, edit, delete.

**Input koordinat:** Admin bisa paste link Google Maps **atau** input koordinat lat/lng manual.

---

### 7. FAQ
**Goal:** Perbaiki layout dan design panel FAQ.

**Fields per item:** urutan, pertanyaan, jawaban.

**Operasi yang tersedia:** create, edit, delete.

---

### 8. Testimonials
**Goal:** Perbaiki layout dan design panel Testimonials.

**Operasi yang tersedia:** create, edit, delete.

---

## Acceptance Criteria

- [ ] Semua panel menggunakan design system web utama (warna, font, komponen)
- [ ] Navbar admin menampilkan judul panel aktif
- [ ] Semua data bersumber dari database (tidak ada dummy data)
- [ ] Perubahan data di admin langsung sinkron ke web utama
- [ ] Hierarki Hardware → Device → Game berfungsi penuh dengan CRUD
- [ ] Event featured berjalan secara otomatis berdasarkan tanggal
- [ ] Toggle aktif/nonaktif event berfungsi
- [ ] Drag & drop pada Event dan Gallery berfungsi dan tersimpan ke DB
- [ ] Input koordinat lokasi mendukung paste link Google Maps dan input manual
- [ ] Gallery mendukung multi-image per item
- [ ] UI bersih, minimalis, dan konsisten antar panel
