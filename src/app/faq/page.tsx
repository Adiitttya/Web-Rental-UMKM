import type { Metadata } from 'next';
import { LandingPage } from '@/components/landing/LandingPage';
import { getCanonicalLandingData } from '@/lib/server-landing-data';

export const revalidate = 3600;

export const metadata: Metadata = {
  title: 'FAQ - Pertanyaan & Syarat Sewa PS Ungaran',
  description:
    'Temukan jawaban lengkap seputar syarat sewa PS bawa pulang, metode pembayaran QRIS/Cash, booking tempat, dan fasilitas di DsterGame Studio.',
  alternates: {
    canonical: '/faq',
  },
  openGraph: {
    title: 'FAQ & Syarat Ketentuan Rental PS | DsterGame Ungaran',
    description:
      'Semua informasi penting mengenai rental on-site, sewa bawa pulang, dan reservasi di DsterGame.',
    url: '/faq',
  },
};

export default async function FaqPage() {
  const landingData = await getCanonicalLandingData();
  return <LandingPage initialSection="faq" initialData={landingData} />;
}
