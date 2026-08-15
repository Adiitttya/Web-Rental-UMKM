import type { Metadata } from 'next';
import { LandingPage } from '@/components/landing/LandingPage';
import { getCanonicalLandingData } from '@/lib/server-landing-data';

export const revalidate = 3600;

export const metadata: Metadata = {
  title: 'Katalog Game PS5, PS4 & Nintendo Switch Terlengkap',
  description:
    'Temukan ratusan judul game original PS5, PS4, Nintendo Switch, dan game balap simulator terbaru di DsterGame Ungaran. Update rutin game rilis terbaru.',
  alternates: {
    canonical: '/list-game',
  },
  openGraph: {
    title: 'Koleksi Game PS5, PS4 & Nintendo Switch | DsterGame Ungaran',
    description:
      'Daftar game terlengkap mulai dari EA Sports FC 24, GTA V, Spiderman 2, Minecraft, Forza Horizon 5, hingga Mario Kart 8 Deluxe.',
    url: '/list-game',
  },
};

export default async function ListGamePage() {
  const landingData = await getCanonicalLandingData();
  return <LandingPage initialSection="list-game" initialData={landingData} />;
}
