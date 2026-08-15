import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: "postgresql://postgres.wmbqaoeanejgebbsgitm:umkm-dstergame@aws-0-ap-northeast-2.pooler.supabase.com:6543/postgres?pgbouncer=true",
    },
  },
});

async function main() {
  console.log("🚀 Updating Event startDate, endDate, and linkUrl in PostgreSQL Database...\n");

  const updates = [
    {
      title: 'PES 2025 Arena',
      startDate: '2026-09-15T10:00:00.000Z',
      endDate: '2026-09-20T22:00:00.000Z',
      linkUrl: 'https://instagram.com/dster.game',
    },
    {
      title: 'FIFA FC24 League',
      startDate: '2026-10-05T14:00:00.000Z',
      endDate: '2026-10-10T22:00:00.000Z',
      linkUrl: 'https://instagram.com/dster.game',
    },
    {
      title: 'Tekken 8 Clash',
      startDate: '2026-09-20T13:00:00.000Z',
      endDate: '2026-09-25T21:00:00.000Z',
      linkUrl: 'https://instagram.com/dster.game',
    },
    {
      title: 'Forza Horizon Speed Cup',
      startDate: '2026-09-28T09:00:00.000Z',
      endDate: '2026-10-03T21:00:00.000Z',
      linkUrl: 'https://instagram.com/dster.game',
    },
  ];

  for (const upd of updates) {
    const res = await prisma.$executeRawUnsafe(
      `UPDATE "Event" SET "startDate" = $1::timestamptz, "endDate" = $2::timestamptz, "linkUrl" = $3 WHERE "title" = $4`,
      upd.startDate,
      upd.endDate,
      upd.linkUrl,
      upd.title
    );
    console.log(`✅ ${upd.title}: Updated ${res} row(s) in PostgreSQL!`);
  }

  console.log("\n📊 Verifying updated rows from DB:");
  const events: any[] = await prisma.$queryRawUnsafe(
    `SELECT "id", "title", "startDate", "endDate", "linkUrl" FROM "Event" WHERE "deletedAt" IS NULL ORDER BY "displayOrder" ASC`
  );

  events.forEach((e) => {
    console.log(` - Event: "${e.title}"`);
    console.log(`   startDate: ${e.startDate}`);
    console.log(`   endDate:   ${e.endDate}`);
    console.log(`   linkUrl:   ${e.linkUrl}`);
  });

  await prisma.$disconnect();
  process.exit(0);
}

main().catch((e) => {
  console.error("❌ Error updating events:", e);
  process.exit(1);
});
