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
    const { name, address, latitude, longitude, phone, mapUrl, operationalHours, isPrimary, displayOrder } = body;

    const updated = await prisma.branch.update({
      where: { id },
      data: {
        name: name?.trim(),
        address: address?.trim(),
        latitude: latitude !== undefined ? Number(latitude) : undefined,
        longitude: longitude !== undefined ? Number(longitude) : undefined,
        phone: phone?.trim(),
        mapUrl: mapUrl?.trim(),
        operationalHours: operationalHours?.trim(),
        isPrimary: isPrimary !== undefined ? Boolean(isPrimary) : undefined,
        displayOrder: displayOrder !== undefined ? Number(displayOrder) : undefined,
      },
    });

    await logActivity({
      userId: session?.userId,
      action: 'UPDATE_CABANG',
      entityName: 'Branch',
      entityId: id,
      payload: { name: updated.name },
    });

    revalidatePath('/');
    revalidatePath('/location');
    return NextResponse.json({ success: true, data: updated, message: 'Branch updated successfully.' });
  } catch (error) {
    console.error('Error updating branch:', error);
    return NextResponse.json({ success: false, message: 'Failed to update branch' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { session, response } = await verifyAdminRole();
  if (response) return response;

  try {
    const { id } = await params;
    const deleted = await prisma.branch.delete({ where: { id } });

    await logActivity({
      userId: session?.userId,
      action: 'HAPUS_CABANG',
      entityName: 'Branch',
      entityId: id,
      payload: { name: deleted.name },
    });

    revalidatePath('/');
    revalidatePath('/location');
    return NextResponse.json({ success: true, message: 'Branch deleted successfully.' });
  } catch (error) {
    console.error('Error deleting branch:', error);
    return NextResponse.json({ success: false, message: 'Failed to delete branch' }, { status: 500 });
  }
}
