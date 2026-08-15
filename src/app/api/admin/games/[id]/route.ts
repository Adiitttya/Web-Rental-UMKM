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
    const { name, description, isAvailable, displayOrder } = body;

    const updated = await prisma.hardware.update({
      where: { id },
      data: {
        name: name?.trim(),
        description: description?.trim(),
        isAvailable: isAvailable !== undefined ? Boolean(isAvailable) : undefined,
        displayOrder: displayOrder !== undefined ? Number(displayOrder) : undefined,
      },
    });

    await logActivity({
      userId: session?.userId,
      action: 'UPDATE_HARDWARE',
      entityName: 'Hardware',
      entityId: id,
      payload: { name: updated.name },
    });

    revalidatePath('/');
    revalidatePath('/list-game');
    return NextResponse.json({ success: true, data: updated, message: 'Hardware updated successfully.' });
  } catch (error) {
    console.error('Error updating hardware:', error);
    return NextResponse.json({ success: false, message: 'Failed to update hardware' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { session, response } = await verifyAdminRole();
  if (response) return response;

  try {
    const { id } = await params;
    const deleted = await prisma.hardware.delete({ where: { id } });

    await logActivity({
      userId: session?.userId,
      action: 'HAPUS_HARDWARE',
      entityName: 'Hardware',
      entityId: id,
      payload: { name: deleted.name },
    });

    revalidatePath('/');
    revalidatePath('/list-game');
    return NextResponse.json({ success: true, message: 'Hardware deleted successfully.' });
  } catch (error) {
    console.error('Error deleting hardware:', error);
    return NextResponse.json({ success: false, message: 'Failed to delete hardware' }, { status: 500 });
  }
}
