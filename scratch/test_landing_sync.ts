import { getCanonicalLandingData } from '../src/lib/server-landing-data';
import { prisma } from '../src/lib/prisma';

async function testLandingSync() {
  console.log('🔍 Testing getCanonicalLandingData() DB Hydration...\n');
  try {
    const data = await getCanonicalLandingData();
    console.log('✅ catalogDevices from DB:', data.catalogDevices?.length);
    if (data.catalogDevices && data.catalogDevices.length > 0) {
      const totalGames = data.catalogDevices.reduce((sum, d) => sum + d.games.length, 0);
      console.log('✅ Total games in catalogDevices:', totalGames);
      console.log('   First device:', data.catalogDevices[0].name, '->', data.catalogDevices[0].games.length, 'games');
    }
    console.log('✅ Branch locations count:', data.branchLocations.length);
    data.branchLocations.forEach((b, i) => {
      console.log(`   Branch ${i + 1}: ${b.name} (${b.lat}, ${b.lng}) -> ${b.mapUrl}`);
    });
  } catch (err) {
    console.error('❌ Error in landing sync:', err);
  } finally {
    await prisma.$disconnect();
    process.exit(0);
  }
}

testLandingSync();
