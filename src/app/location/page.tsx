import { LandingPage } from '@/components/landing/LandingPage';
import { getCanonicalLandingData } from '@/lib/server-landing-data';

export const revalidate = 3600;

export default async function LocationPage() {
  const landingData = await getCanonicalLandingData();
  return <LandingPage initialSection="location" initialData={landingData} />;
}
