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
    const { title, caption, imageUrl, displayOrder } = body;

    const photo = await prisma.galleryPhoto.findUnique({ where: { id } });
    if (!photo) {
      return NextResponse.json({ success: false, message: 'Photo not found' }, { status: 404 });
    }

    if (imageUrl && photo.mediaId) {
      await prisma.media.update({
        where: { id: photo.mediaId },
        data: {
          url: imageUrl.trim(),
          altText: title?.trim() || undefined,
        },
      });
    }

    const updated = await prisma.galleryPhoto.update({
      where: { id },
      data: {
        caption: `${title?.trim() || ''} - ${caption?.trim() || ''}`,
        displayOrder: displayOrder !== undefined ? Number(displayOrder) : undefined,
      },
    });

    await logActivity({
      userId: session?.userId,
      action: 'UPDATE_FOTO_GALERI',
      entityName: 'GalleryPhoto',
      entityId: id,
      payload: { caption: updated.caption },
    });

    revalidatePath('/');
    revalidatePath('/gallery');
    return NextResponse.json({ success: true, data: updated, message: 'Gallery photo updated successfully.' });
  } catch (error) {
    console.error('Error updating gallery photo:', error);
    return NextResponse.json({ success: false, message: 'Failed to update gallery photo' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { session, response } = await verifyAdminRole();
  if (response) return response;

  try {
    const { id } = await params;
    await prisma.galleryPhoto.delete({ where: { id } });

    await logActivity({
      userId: session?.userId,
      action: 'HAPUS_FOTO_GALERI',
      entityName: 'GalleryPhoto',
      entityId: id,
    });

    revalidatePath('/');
    revalidatePath('/gallery');
    return NextResponse.json({ success: true, message: 'Gallery photo deleted successfully.' });
  } catch (error) {
    console.error('Error deleting gallery photo:', error);
    return NextResponse.json({ success: false, message: 'Failed to delete gallery photo' }, { status: 500 });
  }
}
