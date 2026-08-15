import { prisma } from '../src/lib/prisma';

async function testDatabase() {
  console.log('🔍 Testing Database Connection & Data Integrity...\n');

  try {
    // 1. Test System & Theme Settings
    const theme = await prisma.themeSetting.findFirst();
    console.log('✅ [ThemeSetting]:', theme?.primaryColor ? `Primary Color: ${theme.primaryColor}` : 'Not found');

    const settingsCount = await prisma.systemSetting.count();
    console.log(`✅ [SystemSetting]: ${settingsCount} settings found.`);

    // 2. Test Hardware & Games Relation
    const hardwares = await prisma.hardware.findMany({
      include: {
        category: true,
        games: true,
      },
    });

    const totalGames = await prisma.game.count();

    console.log(`✅ [Hardware]: ${hardwares.length} hardwares found.`);
    console.log(`✅ [Game]: ${totalGames} games found in database!`);
    for (const h of hardwares.slice(0, 10)) {
      console.log(`   - ${h.name} (${h.category?.name || 'No Cat'}) -> ${h.games.length} games`);
    }
    if (hardwares.length > 10) {
      console.log(`   ... and ${hardwares.length - 10} more hardware units.`);
    }

    // 3. Test Pricing Categories & Items
    const pricingCategories = await prisma.pricingCategory.findMany({
      include: { items: true },
    });
    console.log(`✅ [PricingCategory]: ${pricingCategories.length} categories found.`);
    for (const cat of pricingCategories) {
      console.log(`   - ${cat.name}: ${cat.items.length} items`);
    }

    // 4. Test Events
    const events = await prisma.event.findMany();
    console.log(`✅ [Event]: ${events.length} event(s) found.`);
    for (const e of events) {
      console.log(`   - ${e.title} [Status: ${e.status}]`);
    }

    // 5. Test FAQs
    const faqs = await prisma.faqItem.findMany({
      include: { category: true },
    });
    console.log(`✅ [FaqItem]: ${faqs.length} FAQ item(s) found.`);
    for (const f of faqs) {
      console.log(`   - Q: "${f.question}" -> Category: ${f.category?.name || 'General'}`);
    }

    // 6. Test Branch
    const branches = await prisma.branch.findMany();
    console.log(`✅ [Branch]: ${branches.length} branch(es) found:`);
    for (const b of branches) {
      console.log(`   - ${b.name} (${b.address})`);
    }

    console.log('\n🎉 ALL DATABASE TESTS PASSED SUCCESSFULLY! No errors detected.');
  } catch (error) {
    console.error('❌ Database Test Error:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

testDatabase();
