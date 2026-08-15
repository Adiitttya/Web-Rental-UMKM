import { getCanonicalLandingData } from '../src/lib/server-landing-data';

async function test() {
  const data = await getCanonicalLandingData();
  console.log('📊 Canonical Landing Events Data:');
  data.events.forEach((e) => {
    console.log(`Title: "${e.title}"`);
    console.log(`  timeDate:  "${e.timeDate}"`);
    console.log(`  startDate: "${e.startDate}"`);
    console.log(`  endDate:   "${e.endDate}"`);
    console.log(`  linkUrl:   "${e.linkUrl}"`);
    console.log('');
  });
  process.exit(0);
}

test().catch(console.error);
