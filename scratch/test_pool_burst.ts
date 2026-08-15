import { PrismaClient } from '@prisma/client';

async function testBurst(url: string, name: string) {
  console.log(`🔌 Testing ${name}...`);
  const client = new PrismaClient({
    datasources: { db: { url } },
    log: [],
  });

  try {
    const start = Date.now();
    await Promise.all([
      client.cmsSection.findMany(),
      client.hero.findFirst(),
      client.game.findMany(),
      client.pricingCategory.findMany(),
      client.event.findMany(),
      client.galleryPhoto.findMany(),
      client.branch.findMany(),
      client.faqItem.findMany(),
      client.testimonial.findMany(),
      client.systemSetting.findMany(),
    ]);
    console.log(`  ✅ ${name} SUCCESS in ${Date.now() - start}ms!\n`);
    await client.$disconnect();
    return true;
  } catch (err: any) {
    console.error(`  ❌ ${name} FAILED:`, err.message || err, '\n');
    await client.$disconnect();
    return false;
  }
}

async function run() {
  const baseUrl = "postgresql://postgres.wmbqaoeanejgebbsgitm:umkm-dstergame@aws-0-ap-northeast-2.pooler.supabase.com:5432/postgres";
  
  await testBurst(baseUrl, "1. Without params");
  await testBurst(`${baseUrl}?connection_limit=10&pool_timeout=20&connect_timeout=15`, "2. With connection_limit=10&pool_timeout=20&connect_timeout=15");
  await testBurst(`${baseUrl}?connection_limit=5&pool_timeout=30&connect_timeout=15`, "3. With connection_limit=5&pool_timeout=30&connect_timeout=15");
}

run();
