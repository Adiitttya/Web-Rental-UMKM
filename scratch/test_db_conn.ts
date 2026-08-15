import { PrismaClient } from '@prisma/client';

async function testConnection(url: string, name: string) {
  console.log(`🔌 Testing ${name} connection to Supabase...`);
  const client = new PrismaClient({
    datasources: { db: { url } },
  });
  try {
    const count = await client.hardware.count();
    console.log(`  ✅ ${name} SUCCESS: Found ${count} hardwares in DB!\n`);
    await client.$disconnect();
    return true;
  } catch (err: any) {
    console.error(`  ❌ ${name} FAILED:`, err.message || err, '\n');
    await client.$disconnect();
    return false;
  }
}

async function run() {
  const url1 = "postgresql://postgres.wmbqaoeanejgebbsgitm:umkm-dstergame@aws-0-ap-northeast-2.pooler.supabase.com:6543/postgres?pgbouncer=true";
  const url2 = "postgresql://postgres.wmbqaoeanejgebbsgitm:umkm-dstergame@aws-0-ap-northeast-2.pooler.supabase.com:5432/postgres";
  const url3 = "postgresql://postgres.wmbqaoeanejgebbsgitm:umkm-dstergame@db.wmbqaoeanejgebbsgitm.supabase.co:5432/postgres";

  await testConnection(url1, "Option 1 (Pooler 6543 + pgbouncer)");
  await testConnection(url2, "Option 2 (Pooler 5432)");
  await testConnection(url3, "Option 3 (Direct db.supabase.co 5432)");

  process.exit(0);
}

run();
