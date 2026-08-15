import { prisma } from '../src/lib/prisma';

async function main() {
  console.log('🔄 Adding 2 new events to DB...');

  const newEvents = [
    {
      title: 'FC 25 Launch Tournament',
      slug: 'fc-25-launch-tournament',
      subtitle: 'Next-Gen Showcase & Clash',
      description: 'Turnamen peluncuran EA Sports FC 25 dengan hadiah tunai & exclusive gaming merchandise.',
      eventDate: new Date('2026-11-15T18:00:00Z'),
      startDate: new Date('2026-11-15T10:00:00Z'),
      endDate: new Date('2026-11-20T22:00:00Z'),
      locationText: 'DsterGame Main Branch',
      status: 'UPCOMING' as const,
      isFeatured: true,
      displayOrder: 5,
    },
    {
      title: 'Mario Kart Party Clash',
      slug: 'mario-kart-party-clash',
      subtitle: 'Nintendo Switch Night',
      description: 'Kompetisi balap seru Mario Kart 8 Deluxe 4 player split-screen dengan snack & voucher gratis.',
      eventDate: new Date('2026-12-01T18:00:00Z'),
      startDate: new Date('2026-12-01T14:00:00Z'),
      endDate: new Date('2026-12-05T22:00:00Z'),
      locationText: 'DsterGame Main Branch',
      status: 'UPCOMING' as const,
      isFeatured: false,
      displayOrder: 6,
    },
  ];

  for (const evt of newEvents) {
    try {
      await prisma.event.upsert({
        where: { slug: evt.slug },
        update: {
          title: evt.title,
          subtitle: evt.subtitle,
          description: evt.description,
          startDate: evt.startDate,
          endDate: evt.endDate,
          eventDate: evt.eventDate,
          displayOrder: evt.displayOrder,
        },
        create: evt,
      });
      console.log(`✅ Upserted ${evt.title}`);
    } catch (e: any) {
      console.log(`⚠️ Skip/Error for ${evt.title}: ${e.message}`);
    }
  }

  process.exit(0);
}

main();
