import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { prisma, getWibDate } from '@/lib/prisma';
import { verifyAdminRole } from '@/lib/server-auth';
import { logActivity } from '@/lib/activity-logger';

export async function GET() {
  const { response } = await verifyAdminRole();
  if (response) return response;

  try {
    const faqs = await prisma.faqItem.findMany({
      orderBy: { displayOrder: 'asc' },
    });
    return NextResponse.json({ success: true, data: faqs });
  } catch (error) {
    console.error('Error fetching FAQs:', error);
    return NextResponse.json({ success: false, message: 'Failed to fetch FAQs' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const { session, response } = await verifyAdminRole();
  if (response) return response;

  try {
    const body = await request.json();
    const { question, answer, displayOrder, isPublished } = body;

    if (!question || !answer) {
      return NextResponse.json({ success: false, message: 'Question and answer are required.' }, { status: 400 });
    }

    const wibNow = getWibDate();

    const newFaq = await prisma.faqItem.create({
      data: {
        question: question.trim(),
        answer: answer.trim(),
        displayOrder: Number(displayOrder) || 1,
        isPublished: isPublished ?? true,
        createdAt: wibNow,
        updatedAt: wibNow,
      },
    });

    await logActivity({
      userId: session?.userId,
      action: 'TAMBAH_FAQ',
      entityName: 'FaqItem',
      entityId: newFaq.id,
      payload: { question: newFaq.question },
    });

    revalidatePath('/');
    revalidatePath('/faq');
    return NextResponse.json({ success: true, data: newFaq, message: 'FAQ created successfully.' });
  } catch (error) {
    console.error('Error creating FAQ:', error);
    return NextResponse.json({ success: false, message: 'Failed to create FAQ' }, { status: 500 });
  }
}
