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
    const { title, subtitle, description, eventDate, startDate, endDate, locationText, linkUrl, isFeatured, displayOrder } = body;

    const updated = await prisma.event.update({
      where: { id },
      data: {
        title: title?.trim(),
        subtitle: subtitle?.trim(),
        description: description?.trim(),
        eventDate: eventDate ? new Date(eventDate) : (startDate ? new Date(startDate) : undefined),
        startDate: startDate ? new Date(startDate) : (startDate === null ? null : undefined),
        endDate: endDate ? new Date(endDate) : (endDate === null ? null : undefined),
        locationText: locationText?.trim(),
        linkUrl: linkUrl !== undefined ? (linkUrl?.trim() || null) : undefined,
        isFeatured: isFeatured !== undefined ? Boolean(isFeatured) : undefined,
        displayOrder: displayOrder !== undefined ? Number(displayOrder) : undefined,
      },
    });

    await logActivity({
      userId: session?.userId,
      action: 'UPDATE_EVENT',
      entityName: 'Event',
      entityId: id,
      payload: { title: updated.title },
    });

    revalidatePath('/');
    revalidatePath('/event');
    return NextResponse.json({ success: true, data: updated, message: 'Event updated successfully.' });
  } catch (error) {
    console.error('Error updating event:', error);
    return NextResponse.json({ success: false, message: 'Failed to update event' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { session, response } = await verifyAdminRole();
  if (response) return response;

  try {
    const { id } = await params;
    const deleted = await prisma.event.delete({ where: { id } });

    await logActivity({
      userId: session?.userId,
      action: 'HAPUS_EVENT',
      entityName: 'Event',
      entityId: id,
      payload: { title: deleted.title },
    });

    revalidatePath('/');
    revalidatePath('/event');
    return NextResponse.json({ success: true, message: 'Event deleted successfully.' });
  } catch (error) {
    console.error('Error deleting event:', error);
    return NextResponse.json({ success: false, message: 'Failed to delete event' }, { status: 500 });
  }
}
