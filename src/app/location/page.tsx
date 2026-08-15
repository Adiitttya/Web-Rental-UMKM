import type { Metadata } from 'next';
import { LandingPage } from '@/components/landing/LandingPage';
import { getCanonicalLandingData } from '@/lib/server-landing-data';

export const revalidate = 3600;

export const metadata: Metadata = {
  title: 'Lokasi Cabang Rental PS di Ungaran & Salatiga',
  description:
    'Kunjungi cabang DsterGame Studio di Bandarjo Ungaran, Candirejo Ungaran, dan Kalicacing Salatiga. Akses Google Maps mudah, parkir luas, dan dekat pusat kuliner.',
  alternates: {
    canonical: '/location',
  },
  openGraph: {
    title: 'Lokasi Cabang DsterGame Studio Ungaran & Salatiga',
    description:
      'Cabang 1: Jl. Pemuda Bandarjo, Cabang 2: Jl. Gedongsongo Candirejo, Cabang 3: Pujasera Kalicacing Salatiga.',
    url: '/location',
  },
};

export default async function LocationPage() {
  const landingData = await getCanonicalLandingData();
  return <LandingPage initialSection="location" initialData={landingData} />;
}
