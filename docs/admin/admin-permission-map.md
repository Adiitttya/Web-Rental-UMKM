# Admin Permission Map — DsterGame Studio CMS

Dokumentasi peran (*Role*) dan izin (*Permissions*) pada level server-side & API boundaries.

## 1. User Roles

1. **`ADMIN`**:
   - Memiliki akses penuh untuk membaca, membuat, memperbarui, dan menghapus seluruh entity CMS (FAQ, Branch, Pricing, Event, Gallery, Hardware, Testimonial, Settings).
   - Memiliki hak akses ke seluruh halaman `/admin/*` dan API `/api/admin/*`.

2. **`CUSTOMER` / `GUEST`**:
   - Hanya memiliki izin membaca (*READ*) konten public di Public Landing Page (`/` dan `/api/cms`).
   - Dilarang keras mengakses route `/admin/*` dan API mutasi `/api/admin/*`.

## 2. API Permission & Authorization Boundary

| Endpoint Path | HTTP Method | Allowed Roles | Enforcement Mechanism |
| :--- | :--- | :--- | :--- |
| `/api/auth/login` | POST | Public | Public route |
| `/api/auth/logout` | POST | Authenticated | Session verification |
| `/api/auth/me` | GET | Authenticated | Session verification |
| `/api/admin/dashboard` | GET | `ADMIN` | Middleware & Server-side `verifyAdminRole` |
| `/api/admin/faq/*` | GET, POST, PUT, DELETE | `ADMIN` | Middleware & Server-side `verifyAdminRole` |
| `/api/admin/branches/*` | GET, POST, PUT, DELETE | `ADMIN` | Middleware & Server-side `verifyAdminRole` |
| `/api/admin/pricing/*` | GET, POST, PUT, DELETE | `ADMIN` | Middleware & Server-side `verifyAdminRole` |
| `/api/admin/events/*` | GET, POST, PUT, DELETE | `ADMIN` | Middleware & Server-side `verifyAdminRole` |
| `/api/admin/gallery/*` | GET, POST, PUT, DELETE | `ADMIN` | Middleware & Server-side `verifyAdminRole` |
| `/api/admin/games/*` | GET, POST, PUT, DELETE | `ADMIN` | Middleware & Server-side `verifyAdminRole` |
| `/api/admin/testimonials/*` | GET, POST, PUT, DELETE | `ADMIN` | Middleware & Server-side `verifyAdminRole` |
| `/api/admin/settings` | GET, PUT | `ADMIN` | Middleware & Server-side `verifyAdminRole` |
