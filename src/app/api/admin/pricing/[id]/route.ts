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
    const { name, price, duration, features, displayOrder } = body;

    const updated = await prisma.pricingItem.update({
      where: { id },
      data: {
        name: name?.trim(),
        price: price !== undefined ? Number(price) : undefined,
        duration: duration?.trim(),
        features: features?.trim(),
        displayOrder: displayOrder !== undefined ? Number(displayOrder) : undefined,
      },
    });

    await logActivity({
      userId: session?.userId,
      action: 'UPDATE_PRICING',
      entityName: 'PricingItem',
      entityId: id,
      payload: { name: updated.name, price: updated.price },
    });

    revalidatePath('/');
    revalidatePath('/pricing');
    return NextResponse.json({ success: true, data: updated, message: 'Pricing item updated successfully.' });
  } catch (error) {
    console.error('Error updating pricing item:', error);
    return NextResponse.json({ success: false, message: 'Failed to update pricing item' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { session, response } = await verifyAdminRole();
  if (response) return response;

  try {
    const { id } = await params;
    const deleted = await prisma.pricingItem.delete({ where: { id } });

    await logActivity({
      userId: session?.userId,
      action: 'HAPUS_PRICING',
      entityName: 'PricingItem',
      entityId: id,
      payload: { name: deleted.name },
    });

    revalidatePath('/');
    revalidatePath('/pricing');
    return NextResponse.json({ success: true, message: 'Pricing item deleted successfully.' });
  } catch (error) {
    console.error('Error deleting pricing item:', error);
    return NextResponse.json({ success: false, message: 'Failed to delete pricing item' }, { status: 500 });
  }
}
