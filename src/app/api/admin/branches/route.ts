import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { prisma, getWibDate } from '@/lib/prisma';
import { verifyAdminRole } from '@/lib/server-auth';
import { logActivity } from '@/lib/activity-logger';

export async function GET() {
  const { response } = await verifyAdminRole();
  if (response) return response;

  try {
    const branches = await prisma.branch.findMany({
      orderBy: { displayOrder: 'asc' },
    });
    return NextResponse.json({ success: true, data: branches });
  } catch (error) {
    console.error('Error fetching branches:', error);
    return NextResponse.json({ success: false, message: 'Failed to fetch branches' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const { session, response } = await verifyAdminRole();
  if (response) return response;

  try {
    const body = await request.json();
    const { name, address, latitude, longitude, phone, mapUrl, operationalHours, isPrimary, displayOrder } = body;

    if (!name || !address) {
      return NextResponse.json({ success: false, message: 'Name and address are required.' }, { status: 400 });
    }

    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
    const wibNow = getWibDate();

    const newBranch = await prisma.branch.create({
      data: {
        name: name.trim(),
        slug: `${slug}-${Date.now()}`,
        address: address.trim(),
        latitude: Number(latitude) || -7.133860,
        longitude: Number(longitude) || 110.398851,
        phone: phone?.trim() || '081234567890',
        mapUrl: mapUrl?.trim() || '',
        operationalHours: operationalHours?.trim() || '06.00 - 24.00 WIB',
        isPrimary: isPrimary ?? false,
        displayOrder: Number(displayOrder) || 1,
        createdAt: wibNow,
        updatedAt: wibNow,
      },
    });

    await logActivity({
      userId: session?.userId,
      action: 'TAMBAH_CABANG',
      entityName: 'Branch',
      entityId: newBranch.id,
      payload: { name: newBranch.name, address: newBranch.address },
    });

    revalidatePath('/');
    revalidatePath('/location');
    return NextResponse.json({ success: true, data: newBranch, message: 'Branch created successfully.' });
  } catch (error) {
    console.error('Error creating branch:', error);
    return NextResponse.json({ success: false, message: 'Failed to create branch' }, { status: 500 });
  }
}
