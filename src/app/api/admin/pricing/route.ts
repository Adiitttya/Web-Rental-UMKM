import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { prisma, getWibDate } from '@/lib/prisma';
import { verifyAdminRole } from '@/lib/server-auth';
import { logActivity } from '@/lib/activity-logger';

export async function GET() {
  const { response } = await verifyAdminRole();
  if (response) return response;

  try {
    const categories = await prisma.pricingCategory.findMany({
      orderBy: { displayOrder: 'asc' },
      include: {
        items: {
          orderBy: { displayOrder: 'asc' },
        },
      },
    });
    return NextResponse.json({ success: true, data: categories });
  } catch (error) {
    console.error('Error fetching pricing items:', error);
    return NextResponse.json({ success: false, message: 'Failed to fetch pricing items' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const { session, response } = await verifyAdminRole();
  if (response) return response;

  try {
    const body = await request.json();
    const { categoryId, name, price, duration, features, displayOrder } = body;

    if (!categoryId || !name || price === undefined) {
      return NextResponse.json({ success: false, message: 'Category, name, and price are required.' }, { status: 400 });
    }

    const wibNow = getWibDate();

    const newItem = await prisma.pricingItem.create({
      data: {
        categoryId,
        name: name.trim(),
        price: Number(price),
        duration: duration?.trim() || '1 Jam',
        features: features?.trim() || '',
        displayOrder: Number(displayOrder) || 1,
        createdAt: wibNow,
        updatedAt: wibNow,
      },
    });

    await logActivity({
      userId: session?.userId,
      action: 'TAMBAH_PRICING',
      entityName: 'PricingItem',
      entityId: newItem.id,
      payload: { name: newItem.name, price: newItem.price },
    });

    revalidatePath('/');
    revalidatePath('/pricing');
    return NextResponse.json({ success: true, data: newItem, message: 'Pricing item created successfully.' });
  } catch (error) {
    console.error('Error creating pricing item:', error);
    return NextResponse.json({ success: false, message: 'Failed to create pricing item' }, { status: 500 });
  }
}
