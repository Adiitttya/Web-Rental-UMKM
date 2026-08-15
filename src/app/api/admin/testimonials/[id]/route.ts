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
    const { reviewerName, reviewerRole, content, rating, displayOrder } = body;

    const updated = await prisma.testimonial.update({
      where: { id },
      data: {
        reviewerName: reviewerName?.trim(),
        reviewerRole: reviewerRole?.trim(),
        content: content?.trim(),
        rating: rating !== undefined ? Number(rating) : undefined,
        displayOrder: displayOrder !== undefined ? Number(displayOrder) : undefined,
      },
    });

    await logActivity({
      userId: session?.userId,
      action: 'UPDATE_TESTIMONIAL',
      entityName: 'Testimonial',
      entityId: id,
      payload: { reviewerName: updated.reviewerName },
    });

    revalidatePath('/');
    revalidatePath('/testimonials');
    return NextResponse.json({ success: true, data: updated, message: 'Testimonial updated successfully.' });
  } catch (error) {
    console.error('Error updating testimonial:', error);
    return NextResponse.json({ success: false, message: 'Failed to update testimonial' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { session, response } = await verifyAdminRole();
  if (response) return response;

  try {
    const { id } = await params;
    const deleted = await prisma.testimonial.delete({ where: { id } });

    await logActivity({
      userId: session?.userId,
      action: 'HAPUS_TESTIMONIAL',
      entityName: 'Testimonial',
      entityId: id,
      payload: { reviewerName: deleted.reviewerName },
    });

    revalidatePath('/');
    revalidatePath('/testimonials');
    return NextResponse.json({ success: true, message: 'Testimonial deleted successfully.' });
  } catch (error) {
    console.error('Error deleting testimonial:', error);
    return NextResponse.json({ success: false, message: 'Failed to delete testimonial' }, { status: 500 });
  }
}
