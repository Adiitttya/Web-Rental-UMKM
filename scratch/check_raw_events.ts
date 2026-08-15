import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: "postgresql://postgres.wmbqaoeanejgebbsgitm:umkm-dstergame@aws-0-ap-northeast-2.pooler.supabase.com:6543/postgres?pgbouncer=true",
    },
  },
});

async function main() {
  const events: any[] = await prisma.$queryRawUnsafe(`SELECT * FROM "Event" WHERE "deletedAt" IS NULL ORDER BY "displayOrder" ASC`);
  console.log("Raw SQL query result from Event table:");
  events.forEach(e => {
    console.log(`Title: ${e.title}`);
    console.log(`  startDate: ${e.startDate}`);
    console.log(`  endDate:   ${e.endDate}`);
    console.log(`  linkUrl:   ${e.linkUrl}`);
    console.log(`  eventDate: ${e.eventDate}`);
    console.log('');
  });
  await prisma.$disconnect();
  process.exit(0);
}

main().catch(console.error);
