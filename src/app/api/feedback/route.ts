import { NextResponse } from 'next/server';
import { sanitizeText } from '@/utils/sanitize';
import { prisma, getWibDate } from '@/lib/prisma';

// Simple sliding window rate limiter (max 10 requests per minute per IP/client)
const rateLimitMap = new Map<string, { count: number; expiresAt: number }>();

const checkRateLimit = (ip: string): boolean => {
  const now = Date.now();
  const record = rateLimitMap.get(ip);
  if (!record || now > record.expiresAt) {
    rateLimitMap.set(ip, { count: 1, expiresAt: now + 60000 });
    return true;
  }
  if (record.count >= 10) {
    return false;
  }
  record.count += 1;
  return true;
};

// Security headers helper
const createSecureResponse = (data: unknown, status: number = 200) => {
  const response = NextResponse.json(data, { status });
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-XSS-Protection', '1; mode=block');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  return response;
};

export async function POST(request: Request) {
  try {
    const clientIp = request.headers.get('x-forwarded-for') || 'anonymous';
    if (!checkRateLimit(clientIp)) {
      return createSecureResponse(
        { error: 'Terlalu banyak permintaan. Silakan coba lagi beberapa saat.' },
        429
      );
    }

    const body = await request.json();

    if (!body.name || !body.name.trim() || !body.comment || !body.comment.trim()) {
      return createSecureResponse(
        { error: 'Nama dan komentar/feedback wajib diisi.' },
        400
      );
    }

    const sanitizedName = sanitizeText(body.name, 100);
    const sanitizedComment = sanitizeText(body.comment, 1000);

    if (!sanitizedName || !sanitizedComment) {
      return createSecureResponse(
        { error: 'Karakter tidak valid terdeteksi.' },
        400
      );
    }

    const wibNow = getWibDate();

    // Insertion strictly into PostgreSQL "Feedback" table with WIB timestamp
    let createdFeedback: unknown = null;
    try {
      createdFeedback = await prisma.feedback.create({
        data: {
          name: sanitizedName,
          comment: sanitizedComment,
          status: 'pending',
          createdAt: wibNow,
          updatedAt: wibNow,
        },
      });
      console.log('✅ [Feedback API] Saved feedback to database with WIB timestamp');
    } catch (sqlErr) {
      console.error('❌ [Feedback API] Insert error, fallback to raw SQL:', sqlErr);
      const newId = 'fb_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6);
      await prisma.$executeRawUnsafe(
        `INSERT INTO "Feedback" ("id", "name", "comment", "status", "isRead", "createdAt", "updatedAt") 
         VALUES ($1, $2, $3, $4, $5, NOW() AT TIME ZONE 'Asia/Jakarta', NOW() AT TIME ZONE 'Asia/Jakarta')`,
        newId,
        sanitizedName,
        sanitizedComment,
        'pending',
        false
      );
      createdFeedback = { id: newId, name: sanitizedName, comment: sanitizedComment, createdAt: wibNow.toISOString() };
    }

    return createSecureResponse(
      {
        message: 'Terima kasih! Feedback Anda telah berhasil terkirim. Masukan Anda sangat berharga bagi DsterGame Studio.',
        feedback: createdFeedback,
      },
      201
    );
  } catch (error: unknown) {
    const errStr = error instanceof Error ? error.message : String(error);
    console.error('Error saving feedback:', errStr);
    return createSecureResponse(
      { error: 'Terjadi kesalahan server saat memproses feedback. Silakan coba lagi.' },
      500
    );
  }
}

export async function GET() {
  try {
    let feedbacks: unknown[] = [];
    try {
      feedbacks = await prisma.feedback.findMany({
        where: { deletedAt: null },
        orderBy: { createdAt: 'desc' },
      });
    } catch {
      feedbacks = (await prisma.$queryRawUnsafe(
        `SELECT "id", "name", "comment", "status", "isRead", "createdAt" 
         FROM "Feedback" 
         WHERE "deletedAt" IS NULL 
         ORDER BY "createdAt" DESC`
      )) as unknown[];
    }
    return createSecureResponse({ feedbacks });
  } catch (error) {
    console.error('Error fetching feedbacks:', error);
    return createSecureResponse({ feedbacks: [] });
  }
}
