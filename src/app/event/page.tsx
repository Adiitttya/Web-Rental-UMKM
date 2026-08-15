import type { Metadata } from 'next';
import { LandingPage } from '@/components/landing/LandingPage';
import { getCanonicalLandingData } from '@/lib/server-landing-data';

export const revalidate = 3600;

export const metadata: Metadata = {
  title: 'Jadwal Event & Turnamen Game Ungaran',
  description:
    'Ikuti turnamen seru PES/FC24/FC25, Tekken 8, Forza Horizon, dan Mario Kart di DsterGame Studio Ungaran. Total hadiah jutaan rupiah, sertifikat, dan trophy.',
  alternates: {
    canonical: '/event',
  },
  openGraph: {
    title: 'Event & Turnamen Esports DsterGame Studio Ungaran',
    description:
      'Turnamen rutin komunitas gamers Ungaran & Semarang. Daftarkan tim kamu sekarang dan rebut total prizepool jutaan rupiah!',
    url: '/event',
  },
};

export default async function EventPage() {
  const landingData = await getCanonicalLandingData();
  return <LandingPage initialSection="event" initialData={landingData} />;
}
