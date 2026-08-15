# Admin Prototype Test Report — DsterGame Studio CMS

Laporan hasil pengujian fungsionalitas Admin Dashboard & Sinkronisasi Landing Page.

| Test ID | Test Scenario | Expected Result | Actual Result | Status | Notes |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **A1** | Guest access `/admin` | Redirected to `/admin/login` | Redirected to `/admin/login` | **PASS** | Protection verified by Middleware |
| **A2** | Login invalid credentials | Error alert displayed | Error alert displayed | **PASS** | Unauthorized attempt blocked |
| **A3** | Login valid admin credentials | Access granted to `/admin/dashboard` | Access granted to `/admin/dashboard` | **PASS** | Session cookie created securely |
| **A4** | Logout action | Session destroyed, redirected to login | Session destroyed, redirected to login | **PASS** | Session cleared |
| **B1** | Direct HTTP mutation without session | HTTP 401/403 Unauthorized | HTTP 401/403 Unauthorized | **PASS** | Server boundary security active |
| **C1** | FAQ CRUD operations | Create/Update/Delete synced to DB & Landing Page | Create/Update/Delete synced | **PASS** | Pilot CRUD verified |
| **C2** | Branch / Location CRUD | Cabang 2 coordinates updated accurately | Cabang 2 maps updated | **PASS** | Location section updated |
| **C3** | Pricing CRUD | Multi-rate pricing items updated | Multi-rate items synced | **PASS** | All rate options preserved |
| **C4** | Event CRUD | Community tournament events updated | Events updated | **PASS** | Synced |
| **C5** | Gallery CRUD | 8 photos preserved & updated | 8 photos preserved | **PASS** | Synced |
| **D1** | Landing Page Anti-Flicker & Refresh | No layout shifts or accordion state resets | Zero flicker, state preserved | **PASS** | State bailout working |
