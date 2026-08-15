import type { Metadata } from 'next';
import { LandingPage } from '@/components/landing/LandingPage';
import { getCanonicalLandingData } from '@/lib/server-landing-data';

export const revalidate = 3600;

export const metadata: Metadata = {
  title: 'Daftar Harga & Paket Rental PS5, PS4, Switch & Simulator',
  description:
    'Cek tarif rental PS3, PS4, PS5, Nintendo Switch, dan Simulator Balap Logitech G29 di DsterGame Ungaran. Tersedia paket main di tempat dan sewa harian bawa pulang.',
  alternates: {
    canonical: '/pricing',
  },
  openGraph: {
    title: 'Daftar Harga & Paket Rental PS & Simulator | DsterGame Studio',
    description:
      'Paket rental main di tempat mulai Rp 6.000/jam dan sewa konsol bawa pulang mulai Rp 50.000/12 jam di Ungaran & Salatiga.',
    url: '/pricing',
  },
};

export default async function PricingPage() {
  const landingData = await getCanonicalLandingData();
  return <LandingPage initialSection="pricing" initialData={landingData} />;
}
