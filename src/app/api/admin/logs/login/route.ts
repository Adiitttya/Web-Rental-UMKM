import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyAdminRole } from '@/lib/server-auth';

export const dynamic = 'force-dynamic';

export async function GET() {
  const { response } = await verifyAdminRole();
  if (response) return response;

  try {
    const sessions = await prisma.session.findMany({
      take: 50,
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

    return NextResponse.json({ success: true, data: sessions });
  } catch (error) {
    console.error('Error fetching login logs:', error);
    return NextResponse.json(
      { success: false, message: 'Gagal memuat log login.' },
      { status: 500 }
    );
  }
}
