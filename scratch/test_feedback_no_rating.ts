import { prisma } from '../src/lib/prisma';
import { POST } from '../src/app/api/feedback/route';

async function testFeedbackNoRating() {
  console.log('🧪 Testing Feedback Submission (No Rating Field)...');

  const mockRequest = new Request('http://localhost:3000/api/feedback', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name: 'Feedback Pure User',
      comment: 'Masukan murni tanpa kolom rating testimoni.',
    }),
  });

  const response = await POST(mockRequest);
  const data = await response.json();
  console.log('API Response Status:', response.status);
  console.log('API Response Data:', data);

  if (data?.feedback?.id) {
    const feedbackId = data.feedback.id;
    const raw: any = await prisma.$queryRaw`SELECT "id", "name", "comment", "createdAt"::text FROM "Feedback" WHERE "id" = ${feedbackId}`;
    console.log('\nDB Verification:');
    console.log(' - ID:', raw[0].id);
    console.log(' - Name:', raw[0].name);
    console.log(' - Stored createdAt (WIB):', raw[0].createdAt);

    await prisma.feedback.delete({ where: { id: feedbackId } }).catch(() => null);
    console.log('✅ Success: Pure feedback saved cleanly with WIB timestamp!');
  }

  process.exit(0);
}

testFeedbackNoRating();
