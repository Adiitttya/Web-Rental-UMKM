import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { prisma, getWibDate } from '@/lib/prisma';
import { verifyAdminRole } from '@/lib/server-auth';
import { logActivity } from '@/lib/activity-logger';

export async function GET() {
  const { response } = await verifyAdminRole();
  if (response) return response;

  try {
    const testimonials = await prisma.testimonial.findMany({
      orderBy: { displayOrder: 'asc' },
    });
    return NextResponse.json({ success: true, data: testimonials });
  } catch (error) {
    console.error('Error fetching testimonials:', error);
    return NextResponse.json({ success: false, message: 'Failed to fetch testimonials' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const { session, response } = await verifyAdminRole();
  if (response) return response;

  try {
    const body = await request.json();
    const { reviewerName, reviewerRole, content, rating, displayOrder } = body;

    if (!reviewerName || !content) {
      return NextResponse.json({ success: false, message: 'Reviewer name and content are required.' }, { status: 400 });
    }

    const wibNow = getWibDate();

    const newTestimonial = await prisma.testimonial.create({
      data: {
        reviewerName: reviewerName.trim(),
        reviewerRole: reviewerRole?.trim() || '@gamer',
        content: content.trim(),
        rating: Number(rating) || 5,
        displayOrder: Number(displayOrder) || 1,
        createdAt: wibNow,
        updatedAt: wibNow,
      },
    });

    await logActivity({
      userId: session?.userId,
      action: 'TAMBAH_TESTIMONIAL',
      entityName: 'Testimonial',
      entityId: newTestimonial.id,
      payload: { reviewerName: newTestimonial.reviewerName },
    });

    revalidatePath('/');
    revalidatePath('/testimonials');
    return NextResponse.json({ success: true, data: newTestimonial, message: 'Testimonial created successfully.' });
  } catch (error) {
    console.error('Error creating testimonial:', error);
    return NextResponse.json({ success: false, message: 'Failed to create testimonial' }, { status: 500 });
  }
}
