import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { prisma } from '@/lib/prisma';
import { verifyAdminRole } from '@/lib/server-auth';
import { logActivity } from '@/lib/activity-logger';

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { session, response } = await verifyAdminRole();
  if (response) return response;

  try {
    const { id } = await params;
    const body = await request.json();
    const { title, genre, isPopular, displayOrder, hardwareId } = body;

    const updated = await prisma.game.update({
      where: { id },
      data: {
        title: title?.trim(),
        genre: genre?.trim(),
        isPopular: isPopular !== undefined ? Boolean(isPopular) : undefined,
        displayOrder: displayOrder !== undefined ? Number(displayOrder) : undefined,
        hardwareId: hardwareId || undefined,
      },
    });

    await logActivity({
      userId: session?.userId,
      action: 'UPDATE_GAME_CATALOG',
      entityName: 'Game',
      entityId: id,
      payload: { title: updated.title },
    });

    revalidatePath('/');
    revalidatePath('/list-game');
    return NextResponse.json({ success: true, data: updated, message: 'Game berhasil diperbarui.' });
  } catch (error) {
    console.error('Error updating game item:', error);
    return NextResponse.json({ success: false, message: 'Failed to update game' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { session, response } = await verifyAdminRole();
  if (response) return response;

  try {
    const { id } = await params;
    const deleted = await prisma.game.delete({ where: { id } });

    await logActivity({
      userId: session?.userId,
      action: 'HAPUS_GAME_CATALOG',
      entityName: 'Game',
      entityId: id,
      payload: { title: deleted.title },
    });

    revalidatePath('/');
    revalidatePath('/list-game');
    return NextResponse.json({ success: true, message: 'Game berhasil dihapus dari database.' });
  } catch (error) {
    console.error('Error deleting game item:', error);
    return NextResponse.json({ success: false, message: 'Failed to delete game' }, { status: 500 });
  }
}
