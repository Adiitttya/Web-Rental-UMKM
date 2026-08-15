import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyAdminRole } from '@/lib/server-auth';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const { response } = await verifyAdminRole();
  if (response) return response;

  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search');
    const entity = searchParams.get('entity');

    const where: Record<string, unknown> = {};

    if (entity && entity !== 'ALL') {
      where.entityName = entity;
    }

    if (search) {
      where.OR = [
        { action: { contains: search, mode: 'insensitive' } },
        { entityName: { contains: search, mode: 'insensitive' } },
        { payload: { contains: search, mode: 'insensitive' } },
      ];
    }

    const activities = await prisma.activityLog.findMany({
      where,
      take: 100,
      orderBy: { createdAt: 'desc' },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
          },
        },
      },
    });

    return NextResponse.json({ success: true, data: activities });
  } catch (error) {
    console.error('Error fetching activity logs:', error);
    return NextResponse.json(
      { success: false, message: 'Gagal memuat log aktivitas audit.' },
      { status: 500 }
    );
  }
}
