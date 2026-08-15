import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyAdminRole } from '@/lib/server-auth';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const { response } = await verifyAdminRole();
  if (response) return response;

  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const search = searchParams.get('search');

    const where: Record<string, unknown> = {
      deletedAt: null,
    };

    if (status && status !== 'ALL') {
      if (status === 'UNREAD') {
        where.isRead = false;
      } else {
        where.status = status.toLowerCase();
      }
    }

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { comment: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
      ];
    }

    const feedbacks = await prisma.feedback.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    });

    const unreadCount = await prisma.feedback.count({
      where: { isRead: false, deletedAt: null },
    });

    return NextResponse.json({
      success: true,
      data: feedbacks,
      meta: {
        total: feedbacks.length,
        unreadCount,
      },
    });
  } catch (error) {
    console.error('Error fetching admin feedbacks:', error);
    return NextResponse.json(
      { success: false, message: 'Gagal memuat data pesan feedback.' },
      { status: 500 }
    );
  }
}
