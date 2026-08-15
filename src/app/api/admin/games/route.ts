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
      include: {
        hardwares: {
          orderBy: { displayOrder: 'asc' },
          include: {
            games: {
              orderBy: { displayOrder: 'asc' },
            },
          },
        },
      },
    });

    return NextResponse.json({ success: true, data: categories });
  } catch (error) {
    console.error('Error fetching game catalog:', error);
    return NextResponse.json({ success: false, message: 'Failed to fetch game catalog' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const { session, response } = await verifyAdminRole();
  if (response) return response;

  try {
    const body = await request.json();
    const { name, categoryId, description, isAvailable, displayOrder } = body;

    if (!name || !categoryId) {
      return NextResponse.json({ success: false, message: 'Nama device dan kategori wajib diisi.' }, { status: 400 });
    }

    const wibNow = getWibDate();
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');

    const newHw = await prisma.hardware.create({
      data: {
        name: name.trim(),
        slug: `${slug}-${Date.now()}`,
        description: description?.trim() || '',
        categoryId,
        isAvailable: isAvailable ?? true,
        displayOrder: Number(displayOrder) || 1,
        createdAt: wibNow,
        updatedAt: wibNow,
      },
      include: {
        category: true,
        games: true,
      },
    });

    await logActivity({
      userId: session?.userId,
      action: 'TAMBAH_DEVICE_HARDWARE',
      entityName: 'Hardware',
      entityId: newHw.id,
      payload: { name: newHw.name, categoryId },
    });

    revalidatePath('/');
    revalidatePath('/list-game');
    return NextResponse.json({ success: true, data: newHw, message: 'Device unit berhasil ditambahkan.' });
  } catch (error) {
    console.error('Error creating hardware device:', error);
    return NextResponse.json({ success: false, message: 'Failed to create hardware device' }, { status: 500 });
  }
}
