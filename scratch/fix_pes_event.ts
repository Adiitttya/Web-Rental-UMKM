import { prisma } from '../src/lib/prisma';
import { formatEventTimeRange } from '../src/utils/eventUtils';

async function fixPESEvent() {
  console.log('🔧 Updating PES 2025 Arena in PostgreSQL database...\n');
  try {
    await prisma.$executeRawUnsafe(
      `UPDATE "Event" 
       SET "startDate" = '2026-09-15T10:00:00Z'::timestamp, 
           "endDate" = '2026-09-20T22:00:00Z'::timestamp 
       WHERE "slug" = 'pes-2025-arena' OR "title" ILIKE '%PES 2025%'`
    );
    console.log('✅ PES 2025 Arena startDate & endDate updated successfully!');

    const events = await prisma.event.findMany({ orderBy: { displayOrder: 'asc' } });
    console.log('\n📊 All Events with formatted timeDate:');
    events.forEach((evt) => {
      const timeDate = formatEventTimeRange(evt.startDate, evt.endDate, evt.eventDate);
      console.log(` - Event: "${evt.title}"`);
      console.log(`   Formatted timeDate for Web: "${timeDate}"`);
      console.log(`   startDate: ${evt.startDate?.toISOString()} | endDate: ${evt.endDate?.toISOString()}`);
    });
  } catch (err) {
    console.error('❌ Error updating PES event:', err);
  } finally {
    process.exit(0);
  }
}

fixPESEvent();
