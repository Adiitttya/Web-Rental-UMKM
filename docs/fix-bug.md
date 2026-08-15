# MASTER PLAN — Sinkronisasi Data Landing Page & Eliminasi Unexpected Refresh

Kita akan melakukan investigasi dan perbaikan arsitektur data pada
landing page.

PENTING:

Jangan langsung mengubah kode.

Pada tahap awal, kamu harus memahami masalah, tujuan arsitektur,
constraint, dan acceptance criteria terlebih dahulu.

Setelah memahami semuanya, lakukan AUDIT terhadap project.
Setelah audit selesai, laporkan hasilnya dan tunggu approval sebelum
melakukan refactor besar.

============================================================

1. # KONTEKS PROJECT

Project menggunakan:

- Next.js
- React
- TypeScript
- Supabase PostgreSQL
- Prisma
- Backend/API
- CMS / Admin Dashboard

Landing page memiliki banyak section yang datanya berasal dari CMS /
database, antara lain:

- Hero
- Event
- Hardware
- Pricing
- Gallery
- Location / Branch
- Testimonial
- FAQ
- Game
- System Setting
- dan section lain yang menggunakan data database.

Database harus menjadi sumber data utama untuk production.

============================================================ 2. MASALAH YANG SEDANG TERJADI
============================================================

Landing page mengalami masalah dimana setelah halaman dibuka,
beberapa section terlihat seperti mengalami refresh/update sendiri
setelah halaman sudah tampil.

Efeknya dapat berupa:

- content section berubah
- jumlah item dapat berubah
- FAQ dapat kehilangan state open/close
- section dapat terlihat seperti di-render ulang
- animation dapat terlihat berjalan kembali
- UI terlihat seperti menerima data baru setelah initial render

Masalah ini terjadi pada lebih dari satu section sehingga jangan
menganggap ini sebagai bug individual pada FAQ, Gallery, Event,
Testimonial, Pricing, atau section tertentu.

Anggap ini sebagai indikasi masalah pada GLOBAL DATA LIFECYCLE,
RENDER LIFECYCLE, atau HYDRATION ARCHITECTURE.

============================================================ 3. HAL YANG HARUS DIBEDAKAN
============================================================

Jangan mencampurkan dua hal berikut.

A. UI / Scroll Animation

Landing page memang memiliki animation ketika section pertama kali
masuk viewport.

Animation tersebut DISENGAJA.

Animation harus tetap dipertahankan.

Jangan menghapus animation hanya untuk menghilangkan gejala glitch.

B. Data Lifecycle

Content dari database tidak boleh:

initial data
→ render
→ fetch data lain
→ replace content
→ render ulang

Data harus mempunyai satu canonical source dan satu data flow yang
jelas.

============================================================ 4. TEMUAN DARI LOG SERVER
============================================================

Gunakan terminal/log aktual sebagai evidence, bukan asumsi.

Terlihat pola:

GET /
→ "Fetching full landing page data from repositories..."
→ banyak Prisma query
→ GET /api/cms 200
→ "Fetching full landing page data from repositories..." lagi
→ rangkaian Prisma query landing page lagi

Artinya terdapat indikasi bahwa full landing page data dieksekusi
melalui lebih dari satu execution path.

Ini HARUS diaudit.

Jangan langsung menyimpulkan bahwa duplicate execution ini pasti
merupakan satu-satunya root cause.

Buktikan hubungan antara:

GET /
/api/cms
repository
service
SiteContext
client fetch
state update
component render
component remount

============================================================ 5. ROOT PROBLEM YANG INGIN KITA SELESAIKAN
============================================================

Target kita BUKAN:

"mencegah React re-render."

Re-render React sendiri adalah hal normal.

Target sebenarnya:

"Memastikan landing page menggunakan satu canonical dataset yang valid
dan tidak mengganti dataset tersebut setelah UI production sudah
ditampilkan."

Dengan kata lain:

DATABASE
→ DATA ACCESS
→ SERVER DATA LOADING
→ ONE CANONICAL DATASET
→ PAGE
→ SECTION PROPS
→ UI

Bukan:

INITIAL_STATE
→ UI
→ CLIENT FETCH
→ API
→ DATABASE
→ SET STATE
→ UI BERUBAH

============================================================ 6. SINGLE SOURCE OF TRUTH
============================================================

Untuk production content:

Supabase PostgreSQL
adalah source of truth.

Prisma berfungsi sebagai data access layer.

Repository / Service bertugas mengambil dan membentuk data.

Next.js server bertugas menyediakan data ke landing page.

Section menerima data melalui props / server data flow.

Jangan menggunakan:

- mock data
- INITIAL_STATE
- hardcoded CMS content
- fallback content

sebagai dataset production yang ditampilkan terlebih dahulu lalu
diganti dengan database response.

Fallback hanya boleh digunakan jika memang diperlukan untuk:

- error state
- empty state
- development/testing

dan tidak boleh menyebabkan:

fallback data
→ database data

pada normal page load.

============================================================ 7. TARGET ARCHITECTURE
============================================================

Target arsitektur:

Supabase
↓
Prisma
↓
Repository
↓
Service / Data Aggregator
↓
Next.js Server
↓
ONE CANONICAL LANDING DATASET
↓
Landing Page
↓
Section Props
↓
UI

Contoh:

getLandingPageData()
↓
{
hero,
events,
hardware,
pricing,
gallery,
branches,
testimonials,
faq,
games,
settings
}
↓
Landing Page
↓
Section Components

Semua section menggunakan dataset yang berasal dari data flow yang
sama.

============================================================ 8. CLIENT STATE VS DATABASE DATA
============================================================

Pisahkan dengan tegas:

DATABASE CONTENT

- Hero
- Event
- Hardware
- Pricing
- Gallery
- Branch / Location
- Testimonial
- FAQ
- Games
- Settings

Data tersebut tidak perlu disimpan ulang sebagai global client state
jika sudah tersedia dari server.

CLIENT UI STATE

- FAQ openId
- Pricing active tab
- Gallery selected image
- Modal open/close
- Mobile menu state
- Carousel index
- Filter state
- UI interaction state

Client state hanya menyimpan keadaan INTERAKSI UI.

Jangan gunakan client state sebagai cache kedua untuk seluruh CMS
dataset tanpa alasan arsitektural yang jelas.

============================================================ 9. SITE CONTEXT
============================================================

Audit SiteContext secara khusus.

Tentukan:

- mengapa SiteContext dibuat
- data apa yang disimpan
- siapa yang menggunakan
- kapan provider melakukan update
- apakah provider melakukan fetch
- apakah provider melakukan hydration
- apakah provider membuat object baru
- apakah provider menyebabkan consumer rerender
- apakah SiteContext masih diperlukan

Jika SiteContext hanya digunakan untuk:

Database
→ API
→ Client Context
→ seluruh landing page

maka evaluasi apakah data tersebut lebih tepat diberikan langsung
dari Server Component melalui props.

Jangan menghapus Context sebelum dependency-nya dipahami.

============================================================ 10. INITIAL_STATE / MOCK DATA
============================================================

Cari semua:

INITIAL_STATE
initialData
mockLandingData
fallbackData
mock data
default content

Tentukan:

- siapa yang menggunakan
- kapan digunakan
- apakah digunakan saat production
- apakah digunakan sebelum API response
- apakah digunakan sebagai fallback
- apakah menyebabkan data berubah setelah hydration

Target production:

Database data harus menjadi canonical content.

Jangan:

INITIAL_STATE
→ tampilkan kepada user
→ API selesai
→ replace dengan database.

============================================================ 11. API /api/cms
============================================================

Audit /api/cms.

Tentukan:

- siapa yang memanggil endpoint tersebut
- apakah landing page memanggilnya
- apakah dipanggil dari useEffect
- apakah dipanggil lebih dari sekali
- apakah endpoint mengambil dataset yang sama dengan server page
- apakah repository yang sama dipanggil kembali
- apakah endpoint memang masih diperlukan
- apakah endpoint diperlukan untuk admin/CMS saja
- apakah endpoint dapat dipisahkan dari landing page data loading

Jika server sudah mengambil full landing page data untuk rendering,
jangan melakukan second hydration hanya untuk mendapatkan data yang
sama dari /api/cms.

Endpoint boleh tetap ada jika dibutuhkan oleh bagian lain.

============================================================ 12. DUPLICATE FETCH / DUPLICATE QUERY
============================================================

Audit semua pemanggilan:

- getLandingPageData()
- repository functions
- service functions
- /api/cms
- fetch()
- useEffect()
- server-side data loading

Cari apakah:

GET /
dan
GET /api/cms

mengambil dataset yang sama.

Cari juga apakah masing-masing section melakukan request sendiri.

Target:

SATU DATA AGGREGATION FLOW

bukan:

Event → fetch
FAQ → fetch
Gallery → fetch
Pricing → fetch
Testimonial → fetch

============================================================ 13. COMPONENT REMOUNT
============================================================

Audit kemungkinan component REMOUNT.

Cari:

- changing key
- dynamic key
- conditional rendering
- loading → loaded transition
- provider replacement
- data-dependent component tree
- animation wrapper
- Suspense boundary
- hydration boundary
- state reset
- component mounting/unmounting

Penting:

RENDER ≠ REMOUNT.

Jangan menyebut semua rerender sebagai remount.

Buktikan jika memang ada remount.

Cari penyebab sebenarnya.

============================================================ 14. ANIMATION / SCROLL REVEAL
============================================================

Animation adalah fitur yang disengaja.

Jangan menghapusnya.

Audit:

- IntersectionObserver
- ScrollReveal
- animation hook
- animation state
- useEffect animation
- section visibility
- animation key
- mount/unmount behavior

Pastikan:

section mount
→ observer
→ section masuk viewport
→ animation

dan bukan:

section mount
→ animation
→ data update
→ component remount
→ animation ulang

Jika animation berjalan ulang, tentukan apakah penyebabnya:

- data replacement
- remount
- key change
- observer recreation
- dependency array
- atau memang behavior animation yang normal.

============================================================ 15. FAQ
============================================================

FAQ digunakan sebagai contoh untuk membuktikan arsitektur.

FAQ content:

Database
→ server data
→ props

FAQ UI state:

openId

Jika user membuka FAQ:

FAQ #1
→ open

kemudian data tidak berubah,
openId tidak boleh reset hanya karena ada background CMS fetch.

Jangan memperbaiki ini hanya dengan useEffect tambahan.

Perbaiki data lifecycle yang menyebabkan state reset jika memang
itulah root cause-nya.

============================================================ 16. GALLERY
============================================================

Gallery harus menggunakan dataset canonical.

Jika database memiliki N item:

page initial render
→ N item

dan tidak boleh berubah menjadi M item hanya karena client selesai
melakukan fetch kedua.

Jika jumlah item memang berubah karena filter/pagination/user action,
itu valid.

Jika berubah tanpa user action, audit:

- duplicate fetch
- data replacement
- filtering
- sorting
- hydration
- state initialization
- conditional rendering.

============================================================ 17. DATABASE CONSISTENCY
============================================================

Audit juga layer database.

Pastikan repository menggunakan:

- filter yang konsisten
- isPublished yang benar
- deletedAt yang benar
- displayOrder yang konsisten
- relation yang konsisten

Perhatikan bahwa log saat ini memang mengambil data seperti:

GalleryPhoto
Event
FaqItem
Testimonial
PricingItem
Hardware
Game
Media

dengan query yang berbeda.

Pastikan hasil aggregation akhirnya konsisten.

Jangan mengubah query hanya untuk menghilangkan visual glitch tanpa
memahami business logic-nya.

============================================================ 18. TRANSACTION / PRISMA
============================================================

Log menunjukkan beberapa:

BEGIN
...
COMMIT

dalam satu proses landing data loading.

Audit:

- apakah repository menggunakan transaction
- apakah query berjalan parallel
- apakah ada transaction per repository
- apakah transaction tersebut memang diperlukan
- apakah ada duplicate repository invocation
- apakah query dapat dibuat lebih efisien

Jangan otomatis menggabungkan semua query menjadi satu transaction.

Tujuannya bukan sekadar mengurangi jumlah BEGIN/COMMIT.

Tujuannya adalah memastikan data loading benar, konsisten, dan tidak
mengalami duplicate execution.

============================================================ 19. CACHE DAN REVALIDATION
============================================================

Setelah data lifecycle benar, baru tentukan strategi caching.

Target:

ADMIN
↓
BACKEND
↓
PRISMA
↓
SUPABASE
↓
REVALIDATION
↓
NEXT.JS
↓
REQUEST BERIKUTNYA MENDAPAT DATA TERBARU

Bukan:

BROWSER
↓
INITIAL DATA
↓
FETCH API
↓
REPLACE CONTENT

Tidak perlu polling atau interval fetching untuk content statis
kecuali ada requirement yang jelas.

============================================================ 20. URUTAN IMPLEMENTASI
============================================================

Jangan melakukan semua perubahan sekaligus.

Gunakan urutan:

PHASE A
Audit data flow

PHASE B
Identifikasi root cause

PHASE C
Dokumentasikan current architecture

PHASE D
Dokumentasikan target architecture

PHASE E
Hilangkan duplicate data loading

PHASE F
Hilangkan second hydration jika memang ada

PHASE G
Pisahkan database content dari client UI state

PHASE H
Review SiteContext

PHASE I
Review INITIAL_STATE

PHASE J
Review component remount

PHASE K
Review animation lifecycle

PHASE L
Implement cache/revalidation

PHASE M
Testing

============================================================ 21. TESTING PLAN
============================================================

Setelah implementasi:

TEST 1
Hard refresh landing page.

Expected:
content langsung konsisten dengan database.

TEST 2
Refresh berkali-kali.

Expected:
dataset tidak berubah secara random.

TEST 3
Buka FAQ #1.

Expected:
tetap open sampai user mengubahnya.

TEST 4
Scroll ke setiap section.

Expected:
animation tetap berjalan sesuai desain.

TEST 5
Scroll naik-turun berkali-kali.

Expected:
animation tidak menyebabkan data reload.

TEST 6
Monitor Network.

Expected:
tidak ada unnecessary second hydration untuk landing page.

TEST 7
Monitor server terminal.

Expected:
setiap request dapat dijelaskan data-loading path-nya.

TEST 8
Admin mengubah FAQ.

Expected:
database berubah.

Setelah mekanisme revalidation berjalan,
request berikutnya mendapatkan data baru.

TEST 9
Admin mengubah pricing.

Expected:
pricing baru muncul pada request yang sesuai,
tanpa menyebabkan browser melakukan second hydration.

TEST 10
Admin mengubah gallery.

Expected:
gallery baru konsisten dengan database.

TEST 11
Disable network setelah initial response.

Expected:
tidak ada client fetch CMS yang diperlukan untuk mengganti
content yang sudah dirender.

TEST 12
Production build.

Jalankan:

npm run build

dan pastikan tidak ada error.

============================================================ 22. ACCEPTANCE CRITERIA
============================================================

Task hanya dianggap selesai apabila:

[DATA]

1. Supabase adalah single source of truth.
2. Tidak ada production content yang berasal dari INITIAL_STATE lalu
   diganti database data.
3. Tidak ada duplicate full landing-page fetch yang tidak diperlukan.
4. Landing page menggunakan canonical dataset.
5. Section tidak menerima dataset berbeda dari source berbeda.

[RENDER]

6. Tidak ada unnecessary component remount.
7. Render ulang yang normal tidak menyebabkan state UI hilang.
8. key component stabil.
9. Loading state tidak mengganti content dengan dataset kedua.

[CLIENT]

10. CMS content tidak disimpan sebagai duplicate global client state
    tanpa alasan yang jelas.
11. Client state hanya menangani UI interaction.
12. FAQ tidak reset akibat data fetching.

[ANIMATION]

13. ScrollReveal tetap aktif.
14. Animation tidak dihapus sebagai workaround.
15. Animation tidak terpicu ulang karena data replacement/remount
    yang tidak diperlukan.

[API]

16. /api/cms tidak digunakan sebagai second hydration untuk landing
    page jika server sudah menyediakan data yang sama.
17. Semua API call yang tetap ada memiliki tujuan yang jelas.

[DATABASE]

18. Repository query konsisten.
19. Filter published/deleted/displayOrder konsisten.
20. Tidak ada duplicate repository invocation yang tidak diperlukan.

[CACHE]

21. Admin update dapat menghasilkan data baru melalui revalidation /
    request lifecycle yang benar.
22. Tidak menggunakan polling client untuk content statis tanpa alasan.

[QUALITY]

23. TypeScript 0 error.
24. Production build berhasil.
25. Tidak ada console error.
26. Tidak ada hydration error.
27. Network request dapat dijelaskan.
28. Server query dapat dijelaskan.
29. Tidak ada fix berbasis timeout, delay, force rerender, atau
    workaround visual.

============================================================ 23. RULE PALING PENTING
============================================================

Jangan mengejar:

"website terlihat tidak glitch."

Kita mengejar:

"DATA FLOW DAN COMPONENT LIFECYCLE SECARA ARSITEKTURAL BENAR."

Jangan menambal setiap section secara individual.

Jika Event, Gallery, Pricing, Location, Testimonial, FAQ, dan section
lain mengalami gejala yang sama, cari shared root cause.

Jangan menggunakan:

- setTimeout
- delay
- debounce sebagai workaround
- forceUpdate
- random key
- JSON.stringify sebagai solusi utama
- reload page
- disable animation
- hide/show component
- arbitrary loading delay

untuk menyembunyikan masalah.

JSON.stringify bailout yang sudah dibuat boleh dipertahankan
SEMENTARA sampai root cause selesai diaudit, tetapi jangan anggap
itu sebagai root-cause fix.

============================================================ 24. OUTPUT YANG SAYA INGINKAN SEBELUM EKSEKUSI
============================================================

Sebelum mengedit kode, berikan laporan dengan struktur:

1. CURRENT ARCHITECTURE
2. CURRENT DATA FLOW
3. CURRENT REQUEST FLOW
4. DUPLICATE FETCH FINDINGS
5. INITIAL_STATE FINDINGS
6. SITE CONTEXT FINDINGS
7. API /api/cms FINDINGS
8. COMPONENT REMOUNT FINDINGS
9. ANIMATION LIFECYCLE FINDINGS
10. PRISMA / DATABASE FINDINGS
11. ROOT CAUSE
12. SECONDARY ISSUES
13. TARGET ARCHITECTURE
14. PROPOSED FILE CHANGES
15. MIGRATION ORDER
16. RISKS
17. TEST PLAN

Jangan mengklaim root cause sebelum ada evidence dari code.

Jika ada bagian yang belum dapat dibuktikan, tulis:

"UNCONFIRMED"

bukan membuat asumsi.

Setelah laporan selesai, BERHENTI dan tunggu approval saya.

Jangan mengedit kode sebelum saya memberikan approval.

````

### Kenapa saya membuatnya bertahap seperti ini?

Karena kondisi project-mu sekarang sudah cukup kompleks: **Next.js → server → repository → Prisma → Supabase**, sementara di sisi client masih ada indikasi **`SiteContext` + `/api/cms` + initial state**. Log juga menunjukkan full landing-page data loading muncul dua kali dalam lifecycle yang berdekatan.

Jadi kita **tidak boleh langsung menyimpulkan** "`SiteContext` salah", "`/api/cms` salah", atau "React re-render salah". Agent harus membuktikan jalurnya terlebih dahulu.

Target akhirnya sederhana:

```text
DATABASE
   ↓
PRISMA
   ↓
REPOSITORY / SERVICE
   ↓
NEXT.JS SERVER
   ↓
ONE CANONICAL DATASET
   ↓
PROPS
   ↓
SECTIONS
   ↓
UI
````

Sementara state client hanya:

```text
FAQ open/close
Pricing tab
Gallery modal
Navbar
Carousel
dan interaksi UI lainnya
```

Dengan pendekatan ini, kita tidak lagi mencoba **"membuat glitch tidak terlihat"**, tetapi menghilangkan kondisi yang memungkinkan **data valid A digantikan data B setelah halaman sudah berjalan**.
