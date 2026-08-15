# Admin Test Plan — DsterGame Studio CMS

Rencana pengujian menyeluruh untuk memvalidasi fungsionalitas Admin Dashboard Functional Prototype & Data Synchronization.

## 1. Authentication & Route Protection Tests

- **Test A1**: Akses Unauthenticated Guest ke `/admin/dashboard` → Wajib di-redirect ke `/admin/login`.
- **Test A2**: Login Admin dengan Email `admin@dstergame.com` & Password Salah → Gagal & tampil pesan error.
- **Test A3**: Login Admin dengan Email `admin@dstergame.com` & Password `Dstergame@Ungaran123` → Berhasil login & masuk ke `/admin/dashboard`.
- **Test A4**: Klik Tombol Logout → Session cookie dihapus, redirect ke `/admin/login`.

## 2. Server-Side Authorization Tests

- **Test B1**: Direct HTTP POST/PUT/DELETE request ke `/api/admin/faq` tanpa Cookie Session → Ditolak dengan HTTP 401/403.
- **Test B2**: Request mutasi dengan role bukan `ADMIN` → Ditolak di server boundary.

## 3. CRUD & Data Persistence Tests per Entity

- **Test C1 (FAQ)**:
  - Create FAQ baru via UI Admin → Data tersimpan di database & muncul di Landing Page.
  - Edit FAQ → Perubahan tersimpan & konsisten setelah refresh.
  - Delete FAQ → Data terhapus & hilang dari Landing Page.
- **Test C2 (Branch Location)**:
  - Edit koordinat & map URL Cabang 2 (`-7.152918474450402, 110.40754126034807`) → Peta di Landing Page langsung ter-update ke lokasi baru.
- **Test C3 (Pricing)**:
  - Edit/Tambah paket & tarif harga bertingkat → Landing Page menampilkan seluruh variasi harga dengan konsisten.
- **Test C4 (Events)**:
  - Update data turnamen → Poster & deskripsi baru muncul di section Event.
- **Test C5 (Gallery)**:
  - Update caption / tambah foto → 8 foto galeri tetap utuh di Landing Page.

## 4. Anti-Glitch & Sync Tests (Issue #28)

- **Test D1**: Hard refresh Landing Page berulang kali → Data dari database tampil stabil tanpa flickering atau unexpected reset state FAQ/Location.
