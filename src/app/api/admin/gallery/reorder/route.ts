import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { prisma } from '@/lib/prisma';
import { verifyAdminRole } from '@/lib/server-auth';
import { logActivity } from '@/lib/activity-logger';

export async function POST(request: NextRequest) {
  const { session, response } = await verifyAdminRole();
  if (response) return response;

  try {
    const body = await request.json();
    const { items } = body; // Array of { id: string, displayOrder: number }

    if (!Array.isArray(items)) {
      return NextResponse.json({ success: false, message: 'Items array is required' }, { status: 400 });
    }

    await prisma.$transaction(
      items.map((item) =>
        prisma.galleryPhoto.update({
          where: { id: item.id },
          data: { displayOrder: item.displayOrder },
        })
      )
    );

    await logActivity({
      userId: session?.userId,
      action: 'REORDER_GALLERY',
      entityName: 'GalleryPhoto',
      entityId: 'batch',
      payload: { count: items.length },
    });

    revalidatePath('/');
    revalidatePath('/gallery');
    return NextResponse.json({ success: true, message: 'Urutan galeri berhasil diperbarui.' });
  } catch (error) {
    console.error('Error reordering gallery photos:', error);
    return NextResponse.json({ success: false, message: 'Failed to reorder gallery photos' }, { status: 500 });
  }
}
