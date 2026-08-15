import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { prisma } from '@/lib/prisma';
import { verifyAdminRole } from '@/lib/server-auth';
import { logActivity } from '@/lib/activity-logger';

// PUT update FAQ
export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { session, response } = await verifyAdminRole();
  if (response) return response;

  try {
    const { id } = await params;
    const body = await request.json();
    const { question, answer, displayOrder, isPublished } = body;

    const updatedFaq = await prisma.faqItem.update({
      where: { id },
      data: {
        question: question?.trim(),
        answer: answer?.trim(),
        displayOrder: displayOrder !== undefined ? Number(displayOrder) : undefined,
        isPublished: isPublished !== undefined ? Boolean(isPublished) : undefined,
      },
    });

    await logActivity({
      userId: session?.userId,
      action: 'UPDATE_FAQ',
      entityName: 'FaqItem',
      entityId: id,
      payload: { question: updatedFaq.question },
    });

    revalidatePath('/');
    revalidatePath('/faq');
    return NextResponse.json({ success: true, data: updatedFaq, message: 'FAQ updated successfully.' });
  } catch (error) {
    console.error('Error updating FAQ:', error);
    return NextResponse.json({ success: false, message: 'Failed to update FAQ' }, { status: 500 });
  }
}

// DELETE FAQ
export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { session, response } = await verifyAdminRole();
  if (response) return response;

  try {
    const { id } = await params;
    const deleted = await prisma.faqItem.delete({
      where: { id },
    });

    await logActivity({
      userId: session?.userId,
      action: 'HAPUS_FAQ',
      entityName: 'FaqItem',
      entityId: id,
      payload: { question: deleted.question },
    });

    revalidatePath('/');
    revalidatePath('/faq');
    return NextResponse.json({ success: true, message: 'FAQ deleted successfully.' });
  } catch (error) {
    console.error('Error deleting FAQ:', error);
    return NextResponse.json({ success: false, message: 'Failed to delete FAQ' }, { status: 500 });
  }
}
