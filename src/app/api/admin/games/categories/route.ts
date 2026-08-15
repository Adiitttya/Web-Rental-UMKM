import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { prisma, getWibDate } from '@/lib/prisma';
import { verifyAdminRole } from '@/lib/server-auth';
import { logActivity } from '@/lib/activity-logger';

export async function GET() {
  const { response } = await verifyAdminRole();
  if (response) return response;

  try {
    const categories = await prisma.hardwareCategory.findMany({
      orderBy: { displayOrder: 'asc' },
    });
    return NextResponse.json({ success: true, data: categories });
  } catch (error) {
    console.error('Error fetching hardware categories:', error);
    return NextResponse.json({ success: false, message: 'Failed to fetch categories' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const { session, response } = await verifyAdminRole();
  if (response) return response;

  try {
    const body = await request.json();
    const { name, displayOrder } = body;

    if (!name) {
      return NextResponse.json({ success: false, message: 'Nama kategori hardware wajib diisi.' }, { status: 400 });
    }

    const wibNow = getWibDate();
    const slug = `${name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '')}-${Date.now()}`;

    const newCategory = await prisma.hardwareCategory.create({
      data: {
        name: name.trim(),
        slug,
        displayOrder: Number(displayOrder) || 1,
        createdAt: wibNow,
        updatedAt: wibNow,
      },
    });

    await logActivity({
      userId: session?.userId,
      action: 'TAMBAH_KATEGORI_HARDWARE',
      entityName: 'HardwareCategory',
      entityId: newCategory.id,
      payload: { name: newCategory.name },
    });

    revalidatePath('/');
    revalidatePath('/list-game');
    return NextResponse.json({ success: true, data: newCategory, message: 'Kategori card berhasil ditambahkan.' });
  } catch (error) {
    console.error('Error creating hardware category:', error);
    return NextResponse.json({ success: false, message: 'Failed to create hardware category' }, { status: 500 });
  }
}
