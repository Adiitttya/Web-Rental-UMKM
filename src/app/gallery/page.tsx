import type { Metadata } from 'next';
import { LandingPage } from '@/components/landing/LandingPage';
import { getCanonicalLandingData } from '@/lib/server-landing-data';

export const revalidate = 3600;

export const metadata: Metadata = {
  title: 'Galeri Fasilitas & Suasana Gaming Lounge',
  description:
    'Lihat foto fasilitas premium DsterGame Studio: PS5 VIP room, simulator balap Logitech G29, VR arena, TV 4K OLED, sofa empuk, dan interior gaming estetik.',
  alternates: {
    canonical: '/gallery',
  },
  openGraph: {
    title: 'Galeri Suasana & Fasilitas Gaming Lounge DsterGame',
    description:
      'Suasana rental PS paling nyaman & modern di Ungaran dengan fasilitas VIP dan simulator balap mobil.',
    url: '/gallery',
  },
};

export default async function GalleryPage() {
  const landingData = await getCanonicalLandingData();
  return <LandingPage initialSection="gallery" initialData={landingData} />;
}
