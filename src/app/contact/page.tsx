import type { Metadata } from 'next';
import { LandingPage } from '@/components/landing/LandingPage';
import { getCanonicalLandingData } from '@/lib/server-landing-data';

export const revalidate = 3600;

export const metadata: Metadata = {
  title: 'Kontak & Booking Rental PS Ungaran',
  description:
    'Hubungi admin DsterGame Studio via WhatsApp untuk reservasi room VIP PS5, simulator balap, atau booking sewa konsol bawa pulang di Ungaran & Salatiga.',
  alternates: {
    canonical: '/contact',
  },
  openGraph: {
    title: 'Kontak & Reservasi DsterGame Studio Ungaran',
    description:
      'Layanan cepat customer service WhatsApp dan info kontak cabang DsterGame Ungaran & Salatiga.',
    url: '/contact',
  },
};

export default async function ContactPage() {
  const landingData = await getCanonicalLandingData();
  return <LandingPage initialSection="contact" initialData={landingData} />;
}
