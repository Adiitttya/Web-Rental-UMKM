import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: 'postgresql://postgres.wmbqaoeanejgebbsgitm:umkm-dstergame@aws-0-ap-northeast-2.pooler.supabase.com:5432/postgres',
    },
  },
});

async function check() {
  const events = await prisma.event.findMany({
    where: { deletedAt: null },
    orderBy: { displayOrder: 'asc' },
    select: { id: true, title: true, startDate: true, endDate: true, eventDate: true, linkUrl: true }
  });
  events.forEach(e => {
    console.log(`Title: ${e.title}`);
    console.log(`  startDate: ${e.startDate?.toISOString() ?? 'NULL'}`);
    console.log(`  endDate:   ${e.endDate?.toISOString() ?? 'NULL'}`);
    console.log(`  eventDate: ${e.eventDate?.toISOString() ?? 'NULL'}`);
    console.log(`  linkUrl:   ${e.linkUrl ?? 'NULL'}`);
    console.log('');
  });
  await prisma.$disconnect();
  process.exit(0);
}
check();
