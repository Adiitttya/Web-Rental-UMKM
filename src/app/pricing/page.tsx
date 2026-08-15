import { LandingPage } from '@/components/landing/LandingPage';
import { getCanonicalLandingData } from '@/lib/server-landing-data';

export const revalidate = 3600;

export default async function PricingPage() {
  const landingData = await getCanonicalLandingData();
  return <LandingPage initialSection="pricing" initialData={landingData} />;
}
