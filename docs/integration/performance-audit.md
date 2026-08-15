# Performance & Core Web Vitals Audit Report

Document Status: **Completed**  
Audit Stage: **Stage A — Performance & Optimization Audit**

---

## 1. Executive Summary

Laporan ini mengidentifikasi potensi hambatan performa (*performance bottlenecks*) pada Landing Page DsterGame Studio, mengukur efisiensi rendering, penggunaan Next.js Server Components, serta optimasi resource visual dan animasi.

---

## 2. Key Performance Metrics & Bottleneck Analysis

### 2.1 React Server Components (RSC) vs Client Islands
- **Temuan**: Saat ini `LandingPage.tsx` ditandai dengan directive `'use client'` pada root component.
- **Dampak**: Seluruh bundel JavaScript landing page (termasuk komponen statis seperti Footer, Contact, FAQ) dikirim dan di-hydrate di browser.
- **Rekomendasi**: Ubah halaman menjadi Server Component. Hanya tandai komponen interaktif (seperti `ScrollReveal`, Filter Tab `ListGame`, Carousel `Testimonial`) dengan `"use client"`.

### 2.2 Image & Asset Optimization
- **Temuan**: Sebagian komponen menggunakan tag HTML `<img>` standar alih-alih `next/image`.
- **Dampak**: Gambar tidak terkompresi secara otomatis ke format WebP/AVIF, tidak memiliki dimensi responsif, dan menyebabkan akumulasi Cumulative Layout Shift (CLS).
- **Rekomendasi**: Ganti tag `<img>` dengan `<Image />` dari `next/image`. Hero image utama harus menyertakan prop `priority` untuk mengoptimalkan LCP (Largest Contentful Paint).

### 2.3 GPU-Accelerated Animations
- **Temuan**: Komponen animasi seperti `ScrollReveal.tsx` dan `HeroSection.tsx` memanfaatkan CSS transitions & keyframes.
- **Rekomendasi**: Pastikan properti animasi terbatas pada `transform` dan `opacity` untuk memanfaatkan akselerasi GPU dan mencegah *layout thrashing*.

### 2.4 Database Query Optimization (Anti N+1 Query)
- **Temuan**: Relasi antar tabel seperti `Hardware` → `Game` atau `PricingCategory` → `PricingItem` berpotensi memicu query berulang jika dilakukan dalam *loop*.
- **Rekomendasi**: Manfaatkan fitur `include` dan `select` spesifik pada Prisma ORM dalam satu kali query kolektif (`findMany`).
