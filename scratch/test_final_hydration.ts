import { getCanonicalLandingData } from '../src/lib/server-landing-data';

async function testFinal() {
  console.log('🔍 Testing Canonical Hydration from Database...');
  try {
    const data = await getCanonicalLandingData();
    console.log('✅ Canonical Landing Data Loaded Successfully:');
    console.log(` - Sections: ${Object.keys(data.sections).length}`);
    console.log(` - Testimonials: ${data.testimonials.length}`);
    console.log(` - FAQs: ${data.faqs.length}`);
    console.log(` - Branches: ${data.branchLocations.length}`);
    console.log(` - Events: ${data.events.length}`);
    console.log(` - Gallery Photos: ${data.galleryPhotos.length}`);
    console.log(` - Pricing Tabs: ${data.pricingTabs.length}`);
    console.log(` - Catalog Devices: ${data.catalogDevices?.length || 0}`);
  } catch (err: any) {
    console.error('❌ Error during canonical hydration:', err.message || err);
  }
}

testFinal();
