import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { Role, UserStatus } from '@prisma/client';
import { verifyAdminRole } from '@/lib/server-auth';
import { logActivity } from '@/lib/activity-logger';

export const dynamic = 'force-dynamic';

export async function GET() {
  const { response } = await verifyAdminRole();
  if (response) return response;

  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        status: true,
        lastLoginAt: true,
        createdAt: true,
      },
      orderBy: { createdAt: 'asc' },
    });

    return NextResponse.json({ success: true, data: users });
  } catch (error) {
    console.error('Error fetching admin users:', error);
    return NextResponse.json(
      { success: false, message: 'Gagal memuat daftar pengguna admin.' },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  const { session, response } = await verifyAdminRole();
  if (response) return response;

  try {
    const body = await request.json();
    const { userId, role, status } = body;

    if (!userId) {
      return NextResponse.json(
        { success: false, message: 'userId wajib diisi.' },
        { status: 400 }
      );
    }

    const data: Record<string, unknown> = {};
    if (role) data.role = role as Role;
    if (status) data.status = status as UserStatus;

    const updated = await prisma.user.update({
      where: { id: userId },
      data,
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        status: true,
      },
    });

    await logActivity({
      userId: session?.userId,
      action: 'UPDATE_ADMIN_USER',
      entityName: 'User',
      entityId: userId,
      payload: { role: updated.role, status: updated.status },
    });

    return NextResponse.json({
      success: true,
      data: updated,
      message: 'Peran atau status pengguna admin berhasil diperbarui.',
    });
  } catch (error) {
    console.error('Error updating user:', error);
    return NextResponse.json(
      { success: false, message: 'Gagal memperbarui pengguna admin.' },
      { status: 500 }
    );
  }
}
