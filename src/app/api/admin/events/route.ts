import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { prisma, getWibDate } from '@/lib/prisma';
import { EventStatus } from '@prisma/client';
import { verifyAdminRole } from '@/lib/server-auth';
import { logActivity } from '@/lib/activity-logger';

export async function GET() {
  const { response } = await verifyAdminRole();
  if (response) return response;

  try {
    const events = await prisma.event.findMany({
      orderBy: { displayOrder: 'asc' },
    });
    return NextResponse.json({ success: true, data: events });
  } catch (error) {
    console.error('Error fetching events:', error);
    return NextResponse.json({ success: false, message: 'Failed to fetch events' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const { session, response } = await verifyAdminRole();
  if (response) return response;

  try {
    const body = await request.json();
    const { title, subtitle, description, eventDate, startDate, endDate, locationText, linkUrl, isFeatured, displayOrder } = body;

    if (!title) {
      return NextResponse.json({ success: false, message: 'Title is required.' }, { status: 400 });
    }

    const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
    const wibNow = getWibDate();

    const newEvent = await prisma.event.create({
      data: {
        title: title.trim(),
        slug: `${slug}-${Date.now()}`,
        subtitle: subtitle?.trim() || '',
        description: description?.trim() || '',
        eventDate: eventDate ? new Date(eventDate) : (startDate ? new Date(startDate) : wibNow),
        startDate: startDate ? new Date(startDate) : null,
        endDate: endDate ? new Date(endDate) : null,
        locationText: locationText?.trim() || 'DsterGame Main Branch',
        linkUrl: linkUrl?.trim() || null,
        status: EventStatus.UPCOMING,
        isFeatured: isFeatured ?? true,
        displayOrder: Number(displayOrder) || 1,
        createdAt: wibNow,
        updatedAt: wibNow,
      },
    });

    await logActivity({
      userId: session?.userId,
      action: 'TAMBAH_EVENT',
      entityName: 'Event',
      entityId: newEvent.id,
      payload: { title: newEvent.title },
    });

    revalidatePath('/');
    revalidatePath('/event');
    return NextResponse.json({ success: true, data: newEvent, message: 'Event created successfully.' });
  } catch (error) {
    console.error('Error creating event:', error);
    return NextResponse.json({ success: false, message: 'Failed to create event' }, { status: 500 });
  }
}
