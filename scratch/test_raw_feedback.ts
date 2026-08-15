import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: "postgresql://postgres.wmbqaoeanejgebbsgitm:umkm-dstergame@aws-0-ap-northeast-2.pooler.supabase.com:6543/postgres?pgbouncer=true"
    }
  }
});

async function testRawFeedback() {
  console.log('🔍 Testing Raw SQL Insert into PostgreSQL "Feedback" table...\n');
  try {
    const id = 'fb_' + Date.now();
    const name = 'Aditya Raw Test';
    const comment = 'Test feedback langsung ke tabel Feedback via SQL Raw!';

    await prisma.$executeRawUnsafe(
      `INSERT INTO "Feedback" ("id", "name", "comment", "rating", "status", "isRead", "createdAt", "updatedAt") 
       VALUES ($1, $2, $3, $4, $5, $6, NOW(), NOW())`,
      id,
      name,
      comment,
      5,
      'pending',
      false
    );

    console.log('✅ Successfully inserted feedback with ID:', id);

    const rows: any[] = await prisma.$queryRawUnsafe(
      `SELECT * FROM "Feedback" WHERE "deletedAt" IS NULL ORDER BY "createdAt" DESC`
    );

    console.log('✅ Total rows in "Feedback" table:', rows.length);
    console.log('   Latest record:', rows[0]?.name, '->', rows[0]?.comment);
  } catch (err) {
    console.error('❌ Error testing raw feedback:', err);
  } finally {
    await prisma.$disconnect();
    process.exit(0);
  }
}

testRawFeedback();
