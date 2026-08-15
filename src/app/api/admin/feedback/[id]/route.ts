import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyAdminRole } from '@/lib/server-auth';
import { logActivity } from '@/lib/activity-logger';

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { session, response } = await verifyAdminRole();
  if (response) return response;

  try {
    const { id } = await params;
    const body = await request.json();
    const { status, isRead } = body;

    const data: Record<string, unknown> = {};
    if (status !== undefined) data.status = status;
    if (isRead !== undefined) data.isRead = Boolean(isRead);

    const updated = await prisma.feedback.update({
      where: { id },
      data,
    });

    await logActivity({
      userId: session?.userId,
      action: 'UPDATE_STATUS_FEEDBACK',
      entityName: 'Feedback',
      entityId: id,
      payload: { status: updated.status, isRead: updated.isRead },
    });

    return NextResponse.json({
      success: true,
      data: updated,
      message: 'Status pesan feedback berhasil diperbarui.',
    });
  } catch (error) {
    console.error('Error updating feedback status:', error);
    return NextResponse.json(
      { success: false, message: 'Gagal memperbarui status feedback.' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { session, response } = await verifyAdminRole();
  if (response) return response;

  try {
    const { id } = await params;
    const deleted = await prisma.feedback.delete({
      where: { id },
    });

    await logActivity({
      userId: session?.userId,
      action: 'HAPUS_FEEDBACK',
      entityName: 'Feedback',
      entityId: id,
      payload: { name: deleted.name },
    });

    return NextResponse.json({
      success: true,
      message: 'Pesan feedback berhasil dihapus.',
    });
  } catch (error) {
    console.error('Error deleting feedback:', error);
    return NextResponse.json(
      { success: false, message: 'Gagal menghapus pesan feedback.' },
      { status: 500 }
    );
  }
}
