# API Contracts & Data Transfer Objects (DTO) Specification

Document Status: **Completed**  
Audit Stage: **Stage A — API Contracts & DTO Specification**

---

## 1. Executive Summary

Dokumen ini mendefinisikan kontrak data (*API Contracts*) dan antarmuka TypeScript DTO antara backend Next.js dengan komponen frontend Landing Page DsterGame Studio.

---

## 2. Standardized Response Format

Seluruh respon dari Server Actions dan Route Handlers wajib mengikuti tipe generic `ApiResponse<T>` (`src/types/api-response.ts`):

```typescript
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: {
    message: string;
    code: string;
    details?: unknown;
  };
}
```

---

## 3. Section Data Contracts

### 3.1 Hero Section Contract (`HeroDTO`)
```typescript
export interface HeroDTO {
  id: string;
  title: string;
  subtitle: string | null;
  ctaText: string | null;
  ctaLink: string | null;
  bgUrl: string | null;
  logoUrl: string | null;
  decorations: Array<{
    id: string;
    mediaUrl: string;
    positionX: string;
    positionY: string;
    zIndex: number;
    animationType: string | null;
  }>;
}
```

### 3.2 Game Catalog Contract (`GameCatalogDTO`)
```typescript
export interface GameCatalogDTO {
  categories: Array<{
    id: string;
    name: string;
    slug: string;
    hardwares: Array<{
      id: string;
      name: string;
      slug: string;
      description: string | null;
      coverUrl: string | null;
      games: Array<{
        id: string;
        title: string;
        slug: string;
        coverUrl: string | null;
        genre: string | null;
        isPopular: boolean;
      }>;
    }>;
  }>;
}
```

### 3.3 Pricing Catalog Contract (`PricingCatalogDTO`)
```typescript
export interface PricingCatalogDTO {
  categories: Array<{
    id: string;
    name: string;
    slug: string;
    items: Array<{
      id: string;
      name: string;
      price: number;
      duration: string | null;
      features: string[] | null;
      isHighlighted: boolean;
    }>;
  }>;
}
```

### 3.4 Event Section Contract (`EventDTO`)
```typescript
export interface EventDTO {
  id: string;
  title: string;
  slug: string;
  subtitle: string | null;
  description: string | null;
  posterUrl: string | null;
  eventDate: string | null;
  locationText: string | null;
  linkUrl: string | null;
  isNew: boolean;
  status: 'DRAFT' | 'PUBLISHED' | 'UPCOMING' | 'ONGOING' | 'COMPLETED' | 'CANCELLED';
}
```

### 3.5 Branch Location Contract (`BranchDTO`)
```typescript
export interface BranchDTO {
  id: string;
  name: string;
  slug: string;
  address: string;
  latitude: number | null;
  longitude: number | null;
  phone: string | null;
  whatsapp: string | null;
  mapUrl: string | null;
  operationalHours: string | null;
  coverUrl: string | null;
  isPrimary: boolean;
}
```

### 3.6 Testimonial & Feedback Contract (`TestimonialDTO`)
```typescript
export interface TestimonialDTO {
  id: string;
  reviewerName: string;
  reviewerRole: string | null;
  avatarUrl: string | null;
  content: string;
  rating: number;
  isFeatured: boolean;
  createdAt: string;
}
```
