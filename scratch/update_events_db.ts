import { prisma } from '../src/lib/prisma';

async function updateEventsDB() {
  console.log('🔄 Updating Event records in PostgreSQL Database with startDate & endDate...\n');

  const eventsData = [
    {
      title: 'PES 2025 Arena',
      slug: 'pes-2025-arena',
      subtitle: 'Tournament & Match Night',
      description: 'Prizepool Rp 1.000.000 + Trophy. Tempat terbatas untuk 32 slot peserta!',
      startDate: new Date('2026-09-15T10:00:00Z'),
      endDate: new Date('2026-09-20T22:00:00Z'),
      eventDate: new Date('2026-09-15T10:00:00Z'),
    },
    {
      title: 'Tekken 8 Clash',
      slug: 'tekken-8-clash',
      subtitle: 'Community Championship',
      description: 'Turnamen komunitas Tekken 8 dengan total hadiah menarik & sertifikat.',
      startDate: new Date('2026-09-20T13:00:00Z'),
      endDate: new Date('2026-09-25T21:00:00Z'),
      eventDate: new Date('2026-09-20T13:00:00Z'),
    },
    {
      title: 'Forza Horizon Speed Cup',
      slug: 'forza-horizon-speed-cup',
      subtitle: 'Logitech G29 Challenge',
      description: 'Adu kecepatan di simulator balap Logitech G29 dengan track resmi.',
      startDate: new Date('2026-09-28T09:00:00Z'),
      endDate: new Date('2026-10-03T21:00:00Z'),
      eventDate: new Date('2026-09-28T09:00:00Z'),
    },
    {
      title: 'FIFA FC24 League',
      slug: 'fifa-fc24-league',
      subtitle: 'Weekend Special Match',
      description: 'Kompetisi liga weekend antar member DsterGame dengan hadiah voucher rental.',
      startDate: new Date('2026-10-05T14:00:00Z'),
      endDate: new Date('2026-10-10T22:00:00Z'),
      eventDate: new Date('2026-10-05T14:00:00Z'),
    },
  ];

  for (const item of eventsData) {
    try {
      await prisma.event.upsert({
        where: { slug: item.slug },
        update: {
          startDate: item.startDate,
          endDate: item.endDate,
          eventDate: item.eventDate,
        },
        create: {
          title: item.title,
          slug: item.slug,
          subtitle: item.subtitle,
          description: item.description,
          startDate: item.startDate,
          endDate: item.endDate,
          eventDate: item.eventDate,
          locationText: 'DsterGame Main Branch',
          status: 'UPCOMING',
          isFeatured: true,
          displayOrder: 1,
        },
      });
      console.log(`  ✅ Updated Event [${item.title}]: ${item.startDate.toISOString().split('T')[0]} s/d ${item.endDate.toISOString().split('T')[0]}`);
    } catch (e: any) {
      console.error(`  ❌ Failed updating [${item.title}]:`, e.message);
    }
  }

  const allEvents = await prisma.event.findMany({
    orderBy: { displayOrder: 'asc' },
  });

  console.log('\n📊 All Events in PostgreSQL DB:');
  allEvents.forEach((evt) => {
    console.log(` - ID: ${evt.id} | Title: "${evt.title}" | Start: ${evt.startDate?.toISOString()} | End: ${evt.endDate?.toISOString()}`);
  });

  process.exit(0);
}

updateEventsDB();
