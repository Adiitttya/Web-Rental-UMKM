import type { Metadata } from 'next';
import { LandingPage } from '@/components/landing/LandingPage';
import { getCanonicalLandingData } from '@/lib/server-landing-data';

export const revalidate = 3600;

export const metadata: Metadata = {
  title: 'Testimoni & Review Pengunjung Rental PS',
  description:
    'Baca ulasan dan pengalaman asli pelanggan setia DsterGame Studio Ungaran. Rating 4.9/5 dari ratusan gamers di Ungaran, Salatiga & sekitarnya.',
  alternates: {
    canonical: '/testimonials',
  },
  openGraph: {
    title: 'Review Pelanggan DsterGame Studio Ungaran',
    description:
      'Kepuasan pelanggan tentang kenyamanan sofa, kelengkapan game PS5, stik terawat, dan simulator balap.',
    url: '/testimonials',
  },
};

export default async function TestimonialsPage() {
  const landingData = await getCanonicalLandingData();
  return <LandingPage initialSection="testimonials" initialData={landingData} />;
}
