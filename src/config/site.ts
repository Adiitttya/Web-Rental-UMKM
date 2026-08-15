export const siteConfig = {
  name: 'DsterGame',
  tagline: 'Game Console & Simulator Rental',
  description: 'Website resmi rental PlayStation, Nintendo Switch, dan Simulator Logitech.',
  url: process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
  storage: {
    maxUploadSize: 10 * 1024 * 1024, // 10MB
    allowedImageTypes: ['image/jpeg', 'image/png', 'image/webp', 'image/svg+xml'],
  },
};
